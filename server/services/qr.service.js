const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const generateToken = () => uuidv4();

const generateQRCode = async (token) => {
  const url = `${process.env.CLIENT_URL}/verify/${token}`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    width: 300,
    margin: 2,
  });
  return qrDataUrl;
};

module.exports = { generateToken, generateQRCode };
