// ملف اختبار لتكوين Cloudinary
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// طباعة متغيرات البيئة (بدون كشف السر الكامل)
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'موجود' : 'غير موجود');

// تكوين Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// اختبار الاتصال بـ Cloudinary
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('خطأ في الاتصال بـ Cloudinary:', error);
  } else {
    console.log('تم الاتصال بـ Cloudinary بنجاح:', result);
  }
});