const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// JWT Secret (في الإنتاج يجب أن يكون في متغير البيئة)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// تسجيل مستخدم جديد
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: "جميع الحقول مطلوبة"
      });
    }

    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "كلمة المرور وتأكيد كلمة المرور غير متطابقتين"
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
      role: "user" // المستخدمون الجدد يكونون عاديين بشكل افتراضي
    });

    await newUser.save();

    res.status(201).json({
      message: "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
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

// تسجيل الدخول
router.post("/login", async (req, res) => {
  console.log('Login request received:', {
    body: req.body,
    headers: req.headers,
    ip: req.ip
  });
  
  // Set proper headers for UTF-8 encoding
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  try {
    const { email, password } = req.body;

    // التحقق من البيانات المطلوبة
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        error: "Email and password are required",
        message_ar: "البريد الإلكتروني وكلمة المرور مطلوبان"
      });
    }

    console.log('Searching for user with email:', email.trim().toLowerCase());
    
    // البحث عن المستخدم
    const user = await User.findOne({ 
      email: email.trim().toLowerCase(),
      isActive: true 
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found or inactive');
      return res.status(401).json({
        error: "Invalid email or password",
        message_ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      });
    }

    console.log('Verifying password...');
    
    // التحقق من كلمة المرور
    const isPasswordValid = await user.comparePassword(password);
    
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({
        error: "Invalid email or password",
        message_ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      });
    }

    console.log('Updating last login...');
    
    // تحديث آخر تسجيل دخول
    user.lastLogin = new Date();
    await user.save();

    console.log('Creating JWT token...');
    
    // إنشاء JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: "7d" } // صالح لمدة 7 أيام
    );

    console.log('Login successful for user:', user.email);
    
    const response = {
      message: "Login successful",
      message_ar: "تم تسجيل الدخول بنجاح",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    
    return res.json(response);

  } catch (error) {
    console.error("Error in login:", error);
    console.error("Error stack:", error.stack);
    
    // Log detailed error information
    if (error.name === 'MongoServerError') {
      console.error('MongoDB Error:', error.code, error.keyPattern);
    }
    
    if (error.errors) {
      console.error('Validation Errors:', Object.values(error.errors).map(e => e.message));
    }
    
    // Use English error message to avoid encoding issues
    const errorResponse = {
      error: "Server error occurred. Please try again.",
      message_ar: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى",
      ...(process.env.NODE_ENV === 'development' && {
        details: {
          message: error.message,
          name: error.name,
          stack: error.stack,
          ...(error.code && { code: error.code }),
          ...(error.keyPattern && { keyPattern: error.keyPattern })
        }
      })
    };
    
    return res.status(500).json(errorResponse);
  }
});

// تسجيل الخروج (اختياري - يمكن التعامل معه في الواجهة الأمامية)
router.post("/logout", (req, res) => {
  res.json({
    message: "تم تسجيل الخروج بنجاح"
  });
});

// التحقق من صحة الـ token
router.get("/verify", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({
        error: "لا يوجد رمز مصادقة"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "المستخدم غير موجود أو غير نشط"
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error in verify:", error);
    res.status(401).json({
      error: "رمز المصادقة غير صحيح"
    });
  }
});

module.exports = router;
