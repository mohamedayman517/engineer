# 🚀 دليل النشر على Vercel

## المتطلبات الأساسية

### 1. متغيرات البيئة المطلوبة
يجب إضافة هذه المتغيرات في لوحة تحكم Vercel:

```bash
# قاعدة البيانات
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/architectbot

# JWT
JWT_SECRET=your-very-secure-secret-key-here

# البريد الإلكتروني (للنموذج التواصل)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Cloudinary (لرفع الصور)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# البيئة
NODE_ENV=production
```

### 2. خطوات النشر

#### الطريقة الأولى: من GitHub
1. ادخل إلى [vercel.com](https://vercel.com)
2. اربط حسابك بـ GitHub
3. اختر المستودع: `mohamedayman517/engineer`
4. أضف متغيرات البيئة في Settings → Environment Variables
5. انقر Deploy

#### الطريقة الثانية: من CLI
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

### 3. إعداد قاعدة البيانات

#### MongoDB Atlas (مجاني)
1. أنشئ حساب في [MongoDB Atlas](https://www.mongodb.com/atlas)
2. أنشئ Cluster جديد
3. أضف IP Address: `0.0.0.0/0` (للسماح لـ Vercel بالوصول)
4. أنشئ Database User
5. احصل على Connection String وأضفه في `MONGODB_URI`

### 4. إعداد البريد الإلكتروني

#### Gmail App Password
1. فعّل 2-Factor Authentication في حساب Gmail
2. اذهب إلى Google Account Settings
3. Security → App passwords
4. أنشئ App Password جديد
5. استخدم هذا Password في `EMAIL_PASS`

### 5. إعداد Cloudinary

1. أنشئ حساب في [Cloudinary](https://cloudinary.com)
2. احصل على:
   - Cloud Name
   - API Key  
   - API Secret
3. أضفهم في متغيرات البيئة

## 🔧 حل مشاكل شائعة

### خطأ 404 في API Routes
- تأكد من وجود ملف `vercel.json`
- تأكد من أن جميع متغيرات البيئة مُعدة صحيحاً

### خطأ في قاعدة البيانات
- تأكد من صحة `MONGODB_URI`
- تأكد من إضافة IP `0.0.0.0/0` في MongoDB Atlas

### خطأ في رفع الصور
- تأكد من صحة معلومات Cloudinary
- تأكد من أن API Key نشط

### خطأ في البريد الإلكتروني
- تأكد من تفعيل 2FA في Gmail
- تأكد من استخدام App Password وليس كلمة المرور العادية

## 📁 هيكل المشروع للنشر

```
chatbot/
├── vercel.json          # تكوين Vercel
├── app.js              # Backend server
├── package.json        # Dependencies
├── dist/               # Built frontend (auto-generated)
├── routes/             # API routes
├── models/             # Database models
├── src/                # React source code
└── public/             # Static files
```

## 🌐 URLs بعد النشر

- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api/*`

## 📝 ملاحظات مهمة

1. **الملفات الكبيرة**: Vercel لديه حد أقصى 50MB للملفات
2. **Lambda Functions**: كل API route يعمل كـ serverless function
3. **Cold Starts**: قد يكون هناك تأخير في أول استدعاء بعد فترة خمول
4. **Database**: استخدم MongoDB Atlas أو أي cloud database
5. **File Uploads**: استخدم Cloudinary للصور والملفات

## 🆘 الدعم

إذا واجهت مشاكل:
1. تحقق من Vercel Function Logs
2. تأكد من جميع متغيرات البيئة
3. تحقق من اتصال قاعدة البيانات
4. راجع Network tab في Developer Tools
