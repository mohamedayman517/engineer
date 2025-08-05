const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function createAdmin() {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ متصل بقاعدة البيانات");

    // التحقق من وجود مدير مسبقاً
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️ يوجد مدير بالفعل:", existingAdmin.email);
      process.exit(0);
    }

    // إنشاء حساب المدير
    const adminData = {
      name: "المدير العام",
      email: "admin@example.com",
      password: "admin123456",
      role: "admin"
    };

    const admin = new User(adminData);
    await admin.save();

    console.log("🎉 تم إنشاء حساب المدير بنجاح!");
    console.log("📧 البريد الإلكتروني:", adminData.email);
    console.log("🔑 كلمة المرور:", adminData.password);
    console.log("⚠️ تأكد من تغيير كلمة المرور بعد أول تسجيل دخول");

  } catch (error) {
    console.error("❌ خطأ في إنشاء المدير:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 تم قطع الاتصال بقاعدة البيانات");
    process.exit(0);
  }
}

createAdmin();
