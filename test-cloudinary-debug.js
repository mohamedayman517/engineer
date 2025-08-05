require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// طباعة معلومات التكوين (مع إخفاء السر)
console.log('Cloudinary Configuration:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret (first 4 chars):', process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.substring(0, 4) + '...' : 'undefined');

// التحقق من صحة مفتاح API
async function testCloudinaryConnection() {
  try {
    // تكوين Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    console.log('\nTesting Cloudinary connection...');
    
    // استخدام ping للتحقق من الاتصال
    const result = await cloudinary.api.ping();
    console.log('Connection successful:', result);
    
    // محاولة الحصول على معلومات الحساب
    const account = await cloudinary.api.usage();
    console.log('Account info retrieved successfully');
    console.log('Plan:', account.plan);
  } catch (error) {
    console.error('Error connecting to Cloudinary:');
    console.error('Status code:', error.http_code);
    console.error('Error code:', error.error.code);
    console.error('Message:', error.error.message);
    console.error('\nFull error:', JSON.stringify(error, null, 2));
    
    // اقتراحات للإصلاح
    console.log('\nPossible solutions:');
    console.log('1. Verify your API key and secret are correct');
    console.log('2. Make sure your Cloudinary account is active');
    console.log('3. Check if your API key has the necessary permissions');
    console.log('4. Ensure your API secret format is correct (should not contain placeholders like "Ht-Pu9Ow3Yx9Ow-Ht9Pu9Ow3Yx9")');
  }
}

testCloudinaryConnection();