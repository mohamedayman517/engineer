const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/**
 * تحميل ملف إلى Cloudinary
 * @param {string} filePath - مسار الملف المحلي
 * @param {string} folder - المجلد في Cloudinary
 * @returns {Promise<Object>} - نتيجة التحميل
 */
const uploadFile = async (filePath, folder = 'uploads') => {
  try {
    console.log('CloudinaryService: Starting upload of file:', filePath);
    console.log('CloudinaryService: Target folder:', folder);
    
    // تحديد نوع الملف بناءً على المجلد
    const resourceType = folder === 'videos' ? 'video' : 'auto';
    console.log('CloudinaryService: Using resource type:', resourceType);
    
    // التحقق من وجود الملف
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist at path: ${filePath}`);
    }
    
    console.log('CloudinaryService: File exists, proceeding with upload');
    console.log('CloudinaryService: Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: '***' // لا نعرض السر الكامل
    });
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: resourceType, // استخدام نوع الملف المحدد
      chunk_size: 6000000, // تقسيم الملفات الكبيرة إلى أجزاء (6MB لكل جزء)
    });
    
    console.log('CloudinaryService: Upload successful, result:', {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      resource_type: result.resource_type
    });
    
    // حذف الملف المحلي بعد التحميل
    console.log('CloudinaryService: Deleting local file:', filePath);
    fs.unlinkSync(filePath);
    
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

/**
 * حذف ملف من Cloudinary
 * @param {string} publicId - معرف الملف العام
 * @returns {Promise<Object>} - نتيجة الحذف
 */
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadFile,
  deleteFile
};