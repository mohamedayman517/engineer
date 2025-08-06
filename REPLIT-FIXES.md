# 🔧 حلول مشاكل Replit الشائعة

## ❌ مشكلة "Blocked request" - تم الحل ✅

### **الخطأ:**
```
Blocked request. This host ("xxx.replit.dev") is not allowed.
To allow this host, add "xxx" to `server.allowedHosts` in vite.config.js.
```

### **الحل المطبق:**
تم إضافة `allowedHosts: 'all'` في `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3002,
    allowedHosts: 'all', // ✅ يحل مشكلة Blocked request
    proxy: {
      "/api": {
        target: process.env.REPLIT_DB_URL ? "http://0.0.0.0:3000" : "http://localhost:5000",
        changeOrigin: true,
        secure: false
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3002,
    allowedHosts: 'all' // ✅ للـ preview أيضاً
  }
});
```

## 🚀 خطوات إعادة التشغيل في Replit

### **1. إيقاف الخادم الحالي:**
- انقر **Stop** في Replit Console
- أو اضغط `Ctrl + C`

### **2. تحديث Dependencies:**
```bash
npm install
```

### **3. إعادة التشغيل:**
```bash
npm run replit
```

### **4. أو تشغيل منفصل:**
```bash
# في Terminal 1
npm run server

# في Terminal 2 (Split Terminal)
npm run client
```

## 🔍 مشاكل أخرى محتملة وحلولها

### **مشكلة 1: Port already in use**
```bash
# الحل
pkill -f node
npm run replit
```

### **مشكلة 2: Cannot connect to database**
- تحقق من `MONGODB_URI` في Secrets
- تأكد من صحة connection string
- تحقق من network access في MongoDB Atlas

### **مشكلة 3: API routes return 404**
- تأكد من تشغيل Backend server على port 3000
- تحقق من proxy configuration في vite.config.js
- راجع console logs للأخطاء

### **مشكلة 4: CORS errors**
```javascript
// في app.js - إضافة Replit domain
app.use(cors({
  origin: [
    'http://localhost:3002',
    'https://your-repl-name.username.repl.co'
  ],
  credentials: true
}));
```

### **مشكلة 5: Environment variables not working**
- تأكد من إضافة المتغيرات في **Secrets** tab
- أعد تشغيل الخادم بعد إضافة secrets جديدة
- تحقق من أسماء المتغيرات (case-sensitive)

## 📋 Checklist للتأكد من العمل الصحيح

### ✅ **Frontend (Port 3002):**
- [ ] الموقع يفتح على `https://your-repl.replit.dev`
- [ ] لا توجد أخطاء في Browser Console
- [ ] الـ navigation يعمل بشكل صحيح

### ✅ **Backend (Port 3000):**
- [ ] API endpoints تستجيب: `/api/projects`, `/api/services`
- [ ] Database connection successful
- [ ] Authentication يعمل

### ✅ **Integration:**
- [ ] Frontend يستطيع الوصول للـ API
- [ ] Contact form يرسل emails
- [ ] File uploads تعمل (إذا مفعلة)

## 🔧 أوامر مفيدة في Replit

### **مراقبة Logs:**
```bash
# Backend logs
npm run server

# Frontend logs  
npm run client

# Combined logs
npm run replit
```

### **تشخيص المشاكل:**
```bash
# فحص المنافذ المستخدمة
netstat -tlnp

# فحص العمليات الجارية
ps aux | grep node

# فحص متغيرات البيئة
printenv | grep MONGO
```

### **إعادة تعيين كاملة:**
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
npm run replit
```

## 🌐 URLs للاختبار

بعد التشغيل الناجح، اختبر هذه الروابط:

- **Frontend:** `https://your-repl-name.username.repl.co`
- **API Test:** `https://your-repl-name.username.repl.co/api/projects`
- **Health Check:** `https://your-repl-name.username.repl.co/api/debug` (إذا متوفر)

## 📞 إذا استمرت المشاكل

1. **تحقق من Replit Console** للأخطاء
2. **راجع Browser Developer Tools** → Network tab
3. **تأكد من جميع Secrets** مُعدة بشكل صحيح
4. **جرب إعادة تشغيل Repl** كاملة
5. **تحقق من GitHub** أن آخر التحديثات مرفوعة

## 🎯 نصائح للأداء الأمثل

- **استخدم MongoDB Atlas** بدلاً من Replit Database للمشاريع الكبيرة
- **فعّل Always On** للمشاريع المهمة (مدفوع)
- **راقب استخدام الموارد** في Replit Dashboard
- **استخدم CDN** للملفات الثابتة الكبيرة

---

**المشروع الآن جاهز للعمل على Replit بدون مشاكل! 🚀**
