const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_campus';

  try {
    // Attempt standard connection with 2s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected to external MongoDB at: ${uri}`);
  } catch (err) {
    console.warn(`[Database] Primary MongoDB connection failed (${err.message}).`);
    console.log('[Database] Starting persistent local MongoDB instance for zero-config operation...');

    try {
      const dbPath = path.join(__dirname, '../../data/db');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      } else {
        // Clean up stale lock if zero bytes
        const lockFile = path.join(dbPath, 'mongod.lock');
        try {
          if (fs.existsSync(lockFile)) {
            const stats = fs.statSync(lockFile);
            if (stats.size === 0) {
              fs.unlinkSync(lockFile);
            }
          }
        } catch (e) {}
      }

      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'smart_campus',
          dbPath: dbPath,
          storageEngine: 'wiredTiger'
        }
      });
      const localUri = mongodInstance.getUri();
      await mongoose.connect(localUri);
      console.log(`[Database] Connected to persistent local MongoDB at: ${localUri}`);
    } catch (memErr) {
      console.warn('[Database] Persistent storage notice, falling back to in-memory instance:', memErr.message);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: { dbName: 'smart_campus' }
      });
      const memoryUri = mongodInstance.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to in-memory MongoDB at: ${memoryUri}`);
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error(`[Database Error] ${err}`);
  });
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
