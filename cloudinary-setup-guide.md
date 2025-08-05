# دليل إعداد Cloudinary

## المشكلة

تم اكتشاف مشكلة في الاتصال بخدمة Cloudinary. الخطأ الذي ظهر هو `unknown api_key` مما يشير إلى أن مفاتيح API المستخدمة غير صحيحة.

## السبب

بعد فحص ملف `.env`، تبين أن مفتاح API السري (API Secret) المستخدم هو قيمة وهمية أو مثال وليس المفتاح الحقيقي:

```
CLOUDINARY_CLOUD_NAME=dajs4wymx
CLOUDINARY_API_KEY=624246677736627
CLOUDINARY_API_SECRET=Ht-Pu9Ow3Yx9Ow-Ht9Pu9Ow3Yx9  # هذا مفتاح وهمي
```

## الحل

يجب الحصول على مفاتيح API الصحيحة من لوحة تحكم Cloudinary واستبدال القيم الموجودة في ملف `.env`.

### خطوات الحصول على مفاتيح Cloudinary الصحيحة:

1. قم بتسجيل الدخول إلى حساب Cloudinary الخاص بك على [https://cloudinary.com/console](https://cloudinary.com/console)

2. في لوحة التحكم، انتقل إلى صفحة "Dashboard" أو "الإعدادات"

3. ابحث عن قسم "API Keys" أو "مفاتيح API"

4. ستجد المعلومات التالية:
   - Cloud Name (اسم السحابة)
   - API Key (مفتاح API)
   - API Secret (مفتاح API السري)

5. قم بنسخ هذه القيم واستبدالها في ملف `.env` الخاص بالمشروع:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### ملاحظات هامة:

- تأكد من أن حساب Cloudinary الخاص بك نشط وغير منتهي الصلاحية.
- تأكد من أن مفتاح API لديه الصلاحيات اللازمة للتحميل والإدارة.
- لا تشارك مفتاح API السري مع أي شخص أو تضعه في مستودع عام.
- إذا كنت تستخدم حساباً تجريبياً مجانياً، فقد تكون هناك قيود على بعض الميزات.

## اختبار الاتصال

بعد تحديث المفاتيح، يمكنك اختبار الاتصال باستخدام الأمر التالي:

```
node test-cloudinary-debug.js
```

إذا كانت المفاتيح صحيحة، ستظهر رسالة نجاح الاتصال.