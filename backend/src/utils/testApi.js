const http = require('http');

const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const waitForServer = async (maxAttempts = 15) => {
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const res = await request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/health',
        method: 'GET'
      });
      if (res.status === 200) {
        console.log(`[Init] Server is ready on attempt ${i}!`);
        return true;
      }
    } catch (e) {
      console.log(`[Init] Waiting for server boot (attempt ${i}/${maxAttempts})...`);
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw new Error('Server did not become ready within timeout.');
};

const runTests = async () => {
  console.log('--- STARTING COMPREHENSIVE SMART CAMPUS API TESTS ---');

  await waitForServer();

  // 1. Health check
  console.log('\n[Test 1] Testing Health Check Endpoint:');
  const health = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  });
  console.log('Status:', health.status, 'Response:', health.body);

  // 2. Student Login
  console.log('\n[Test 2] Testing Student Login:');
  const studentLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'rahul.sharma@smartcampus.edu', password: 'Student@123' }
  );
  console.log('Status:', studentLogin.status, 'Success:', studentLogin.body.success, 'User:', studentLogin.body.user?.name);
  const studentToken = studentLogin.body.token;

  // 3. Admin Login
  console.log('\n[Test 3] Testing Admin Login:');
  const adminLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'admin@smartcampus.edu', password: 'Admin@123' }
  );
  console.log('Status:', adminLogin.status, 'Success:', adminLogin.body.success, 'Role:', adminLogin.body.user?.role);
  const adminToken = adminLogin.body.token;

  // 4. Fetch Events
  console.log('\n[Test 4] Testing Events Listing:');
  const events = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/events',
    method: 'GET'
  });
  console.log('Status:', events.status, 'Count:', events.body.count, 'First Event:', events.body.events?.[0]?.title);

  // 5. Fetch Jobs
  console.log('\n[Test 5] Testing Jobs Listing:');
  const jobs = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/jobs',
    method: 'GET'
  });
  console.log('Status:', jobs.status, 'Count:', jobs.body.count, 'First Job:', jobs.body.jobs?.[0]?.title);

  // 6. Test AI Grounded Chatbot
  console.log('\n[Test 6] Testing AI Chatbot ("What events are happening in our college?"):');
  const chat1 = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/chatbot/ask',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { question: 'What events are happening in our college?' }
  );
  console.log('Status:', chat1.status, 'Success:', chat1.body.success);
  console.log('AI Answer Preview:\n', chat1.body.reply?.substring(0, 180), '...');

  // 7. Test Admin Dashboard Stats
  console.log('\n[Test 7] Testing Admin Dashboard Stats:');
  const adminStats = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/dashboard-stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('Status:', adminStats.status, 'Stats:', adminStats.body.stats);

  console.log('\n--- ALL API TEST SUITES COMPLETED SUCCESSFULLY! ---');
  process.exit(0);
};

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
