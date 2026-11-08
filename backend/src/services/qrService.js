const QRCode = require('qrcode');

/**
 * Generate a QR code as a Base64 Data URL.
 * Encodes structured JSON verification payload for fast scan validation.
 */
const generateQRCodeDataUrl = async (payload) => {
  try {
    const jsonString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const dataUrl = await QRCode.toDataURL(jsonString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 280,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR Code:', err);
    throw err;
  }
};

module.exports = {
  generateQRCodeDataUrl
};
