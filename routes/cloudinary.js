const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

/**
 * مسار للتحقق من تكوين Cloudinary
 */
router.get('/check', async (req, res) => {
  try {
    console.log('Checking Cloudinary configuration...');
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: '***' // لا نعرض السر الكامل
    });
    
    // استعلام بسيط للتحقق من صحة التكوين
    const result = await cloudinary.api.ping();
    
    console.log('Cloudinary ping result:', result);
    
    res.json({
      success: true,
      message: 'Cloudinary configuration is valid',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      result: result
    });
  } catch (error) {
    console.error('Error checking Cloudinary configuration:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Error checking Cloudinary configuration',
      error: error.message,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY
    });
  }
});

module.exports = router;