const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// الحصول على جميع المهندسين
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const engineers = await User.find({ role: "engineer" }).select("-password");
    res.json(engineers);
  } catch (error) {
    console.error("Error fetching engineers:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

// الحصول على مهندس محدد بواسطة المعرف
router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const engineer = await User.findOne({ 
      _id: req.params.id,
      role: "engineer"
    }).select("-password");
    
    if (!engineer) {
      return res.status(404).json({ error: "المهندس غير موجود" });
    }
    
    res.json(engineer);
  } catch (error) {
    console.error("Error fetching engineer:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

// تحديث بيانات مهندس
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, specialization, experience, bio } = req.body;
    
    // التحقق من وجود المهندس
    const engineer = await User.findOne({ 
      _id: req.params.id,
      role: "engineer"
    });
    
    if (!engineer) {
      return res.status(404).json({ error: "المهندس غير موجود" });
    }
    
    // تحديث البيانات
    if (name) engineer.name = name;
    if (email) engineer.email = email;
    if (password) engineer.password = password;
    if (specialization !== undefined) engineer.specialization = specialization;
    if (experience !== undefined) engineer.experience = experience;
    if (bio !== undefined) engineer.bio = bio;
    
    await engineer.save();
    
    res.json({ 
      message: "تم تحديث بيانات المهندس بنجاح",
      engineer: {
        _id: engineer._id,
        name: engineer.name,
        email: engineer.email,
        specialization: engineer.specialization,
        experience: engineer.experience,
        bio: engineer.bio,
        role: engineer.role
      }
    });
  } catch (error) {
    console.error("Error updating engineer:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

// حذف مهندس
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const engineer = await User.findOneAndDelete({ 
      _id: req.params.id,
      role: "engineer"
    });
    
    if (!engineer) {
      return res.status(404).json({ error: "المهندس غير موجود" });
    }
    
    res.json({ message: "تم حذف المهندس بنجاح" });
  } catch (error) {
    console.error("Error deleting engineer:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

module.exports = router;