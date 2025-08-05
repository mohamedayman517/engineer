const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function createEngineer() {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ متصل بقاعدة البيانات");

    // التحقق من وجود مهندس مسبقاً
    const existingEngineer = await User.findOne({ role: "engineer" });
    if (existingEngineer) {
      console.log("⚠️ يوجد مهندس بالفعل:", existingEngineer.email);
      process.exit(0);
    }

    // إنشاء حساب المهندس
    const engineerData = {
      name: "المهندس المعماري",
      email: "engineer@example.com",
      password: "engineer123456",
      role: "engineer"
    };

    const engineer = new User(engineerData);
    await engineer.save();

    console.log("🎉 تم إنشاء حساب المهندس بنجاح!");
    console.log("📧 البريد الإلكتروني:", engineerData.email);
    console.log("🔑 كلمة المرور:", engineerData.password);
    console.log("👷 الدور: مهندس معماري");
    console.log("⚠️ تأكد من تغيير كلمة المرور بعد أول تسجيل دخول");

  } catch (error) {
    console.error("❌ خطأ في إنشاء المهندس:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 تم قطع الاتصال بقاعدة البيانات");
    process.exit(0);
  }
}

createEngineer();
