const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// الحصول على جميع المستخدمين (للمسؤولين فقط)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب بيانات المستخدمين" });
  }
});

// الحصول على مستخدم محدد بواسطة المعرف
router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب بيانات المستخدم" });
  }
});

// تسجيل مستخدم جديد (للمسؤولين فقط)
router.post("/register", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role, specialization, experience, bio } = req.body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "الاسم والبريد الإلكتروني وكلمة المرور مطلوبة"
      });
    }

    // التحقق من وجود المستخدم مسبقاً
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "هذا البريد الإلكتروني مسجل مسبقاً"
      });
    }

    // إنشاء المستخدم الجديد
    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: role || "user",
      specialization: specialization || "",
      experience: experience || 0,
      bio: bio || ""
    });

    await newUser.save();

    res.status(201).json({
      message: "تم إنشاء المستخدم بنجاح",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        specialization: newUser.specialization,
        experience: newUser.experience,
        bio: newUser.bio
      }
    });

  } catch (error) {
    console.error("Error in register:", error);
    
    // التعامل مع أخطاء التحقق من MongoDB
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: errors.join(", ")
      });
    }

    res.status(500).json({
      error: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى"
    });
  }
});

// تحديث بيانات مستخدم
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role, specialization, experience, bio, isActive } = req.body;
    
    // التحقق من وجود المستخدم
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }
    
    // تحديث البيانات
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (password) user.password = password;
    if (role) user.role = role;
    if (specialization !== undefined) user.specialization = specialization;
    if (experience !== undefined) user.experience = experience;
    if (bio !== undefined) user.bio = bio;
    if (isActive !== undefined) user.isActive = isActive;
    
    await user.save();
    
    res.json({ 
      message: "تم تحديث بيانات المستخدم بنجاح",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        experience: user.experience,
        bio: user.bio,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تحديث بيانات المستخدم" });
  }
});

// حذف مستخدم
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }
    
    res.json({ message: "تم حذف المستخدم بنجاح" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "حدث خطأ أثناء حذف المستخدم" });
  }
});

// الحصول على جميع المهندسين
router.get("/engineers", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const engineers = await User.find({ role: "engineer" }).select("-password").sort({ name: 1 });
    res.json(engineers);
  } catch (error) {
    console.error("Error fetching engineers:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب بيانات المهندسين" });
  }
});

module.exports = router;