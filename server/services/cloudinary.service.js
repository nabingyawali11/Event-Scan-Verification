const cloudinary = require('../config/cloudinary');

/**
 * Uploads a base64 image string to Cloudinary
 * @param {string} base64Image - Base64 image string (data:image/png;base64,...)
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
const uploadQRCode = async (base64Image, folder = 'event_qr_codes') => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload QR code to Cloudinary');
  }
};

module.exports = { uploadQRCode };
