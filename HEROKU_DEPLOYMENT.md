# 🚀 دليل النشر على Heroku

## المتطلبات الأساسية

### 1. إنشاء حساب Heroku
- اذهب إلى [heroku.com](https://heroku.com)
- أنشئ حساب مجاني
- تثبيت [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### 2. تسجيل الدخول
```bash
heroku login
```

## خطوات النشر

### الطريقة الأولى: من CLI
```bash
# إنشاء تطبيق Heroku جديد
heroku create your-app-name

# أو إذا كان لديك تطبيق موجود
heroku git:remote -a your-existing-app-name

# إضافة متغيرات البيئة
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/architectbot"
heroku config:set JWT_SECRET="your-very-secure-secret-key"
heroku config:set EMAIL_USER="your_email@gmail.com"
heroku config:set EMAIL_PASS="your_gmail_app_password"
heroku config:set CLOUDINARY_CLOUD_NAME="your_cloud_name"
heroku config:set CLOUDINARY_API_KEY="your_api_key"
heroku config:set CLOUDINARY_API_SECRET="your_api_secret"
heroku config:set NODE_ENV="production"

# رفع الكود
git push heroku main

# فتح التطبيق
heroku open
```

### الطريقة الثانية: من GitHub
1. اذهب إلى [Heroku Dashboard](https://dashboard.heroku.com)
2. انقر "New" → "Create new app"
3. اختر اسم التطبيق والمنطقة
4. في "Deployment method" اختر "GitHub"
5. اربط مستودع `mohamedayman517/engineer`
6. فعّل "Automatic deploys" من branch `main`
7. أضف متغيرات البيئة في Settings → Config Vars

## متغيرات البيئة المطلوبة

```bash
# قاعدة البيانات (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/architectbot

# المصادقة
JWT_SECRET=your-very-secure-secret-key-here

# البريد الإلكتروني (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# رفع الصور (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# البيئة
NODE_ENV=production
```

## إعداد قاعدة البيانات

### MongoDB Atlas (مجاني)
1. أنشئ حساب في [MongoDB Atlas](https://www.mongodb.com/atlas)
2. أنشئ Cluster جديد (M0 مجاني)
3. أضف IP Address: `0.0.0.0/0` (للسماح لـ Heroku بالوصول)
4. أنشئ Database User مع كلمة مرور قوية
5. احصل على Connection String من "Connect" → "Connect your application"
6. أضف Connection String في `MONGODB_URI`

## إعداد البريد الإلكتروني

### Gmail App Password
1. فعّل 2-Factor Authentication في حساب Gmail
2. اذهب إلى [Google Account Settings](https://myaccount.google.com)
3. Security → 2-Step Verification → App passwords
4. أنشئ App Password جديد للتطبيق
5. استخدم هذا Password في `EMAIL_PASS`

## إعداد Cloudinary

1. أنشئ حساب في [Cloudinary](https://cloudinary.com) (مجاني)
2. من Dashboard احصل على:
   - Cloud Name
   - API Key
   - API Secret
3. أضفهم في متغيرات البيئة

## الأوامر المفيدة

```bash
# عرض logs التطبيق
heroku logs --tail

# إعادة تشغيل التطبيق
heroku restart

# فتح التطبيق في المتصفح
heroku open

# عرض معلومات التطبيق
heroku info

# عرض متغيرات البيئة
heroku config

# إضافة متغير بيئة
heroku config:set KEY=VALUE

# حذف متغير بيئة
heroku config:unset KEY

# تشغيل أمر على الخادم
heroku run node seed.js
```

## حل المشاكل الشائعة

### خطأ في البناء (Build Error)
```bash
# تحقق من logs البناء
heroku logs --tail

# تأكد من وجود جميع dependencies في package.json
# تأكد من صحة scripts في package.json
```

### خطأ في قاعدة البيانات
```bash
# تحقق من صحة MONGODB_URI
heroku config:get MONGODB_URI

# تأكد من إضافة IP 0.0.0.0/0 في MongoDB Atlas
# تحقق من صحة username/password
```

### خطأ في البريد الإلكتروني
```bash
# تحقق من متغيرات البريد
heroku config:get EMAIL_USER
heroku config:get EMAIL_PASS

# تأكد من تفعيل 2FA واستخدام App Password
```

## مميزات Heroku

✅ **مجاني للمشاريع الصغيرة**
✅ **دعم كامل لـ Node.js و MongoDB**
✅ **SSL مجاني**
✅ **نشر تلقائي من GitHub**
✅ **سهولة إدارة متغيرات البيئة**
✅ **Logs مفصلة للتشخيص**
✅ **دعم كامل للـ fullstack apps**

## URLs بعد النشر

- **التطبيق**: `https://your-app-name.herokuapp.com`
- **API**: `https://your-app-name.herokuapp.com/api/*`

## ملاحظات مهمة

1. **Free Tier**: التطبيق ينام بعد 30 دقيقة من عدم الاستخدام
2. **Build Time**: أول نشر قد يستغرق 5-10 دقائق
3. **Database**: استخدم MongoDB Atlas (مجاني)
4. **File Uploads**: Heroku filesystem مؤقت، استخدم Cloudinary
5. **Environment Variables**: لا تضع أسرار في الكود، استخدم Config Vars

## الدعم

إذا واجهت مشاكل:
1. تحقق من `heroku logs --tail`
2. تأكد من جميع متغيرات البيئة
3. تحقق من اتصال قاعدة البيانات
4. راجع [Heroku Dev Center](https://devcenter.heroku.com)
