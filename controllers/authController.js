const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

class AuthController {
  // تسجيل مستخدم جديد
  static async register(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // التحقق من البيانات المطلوبة
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: "جميع الحقول مطلوبة",
          message_ar: "جميع الحقول مطلوبة"
        });
      }

      // التحقق من تطابق كلمة المرور
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: "كلمة المرور وتأكيد كلمة المرور غير متطابقتين",
          message_ar: "كلمة المرور وتأكيد كلمة المرور غير متطابقتين"
        });
      }

      // التحقق من وجود المستخدم مسبقاً
      const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "هذا البريد الإلكتروني مسجل مسبقاً",
          message_ar: "هذا البريد الإلكتروني مسجل مسبقاً"
        });
      }

      // إنشاء المستخدم الجديد
      const newUser = new User({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "user"
      });

      await newUser.save();

      console.log('✅ New user registered:', newUser.email);

      res.status(201).json({
        success: true,
        message: "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول",
        message_ar: "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });

    } catch (error) {
      console.error("❌ Error in register:", error);
      
      // التعامل مع أخطاء التحقق من MongoDB
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: errors.join(", "),
          message_ar: errors.join(", ")
        });
      }

      res.status(500).json({
        success: false,
        error: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى",
        message_ar: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى"
      });
    }
  }

  // تسجيل الدخول
  static async login(req, res) {
    try {
      console.log('🔐 Login request received:', {
        email: req.body.email,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
      
      // Set proper headers for UTF-8 encoding
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      
      const { email, password } = req.body;

      // التحقق من البيانات المطلوبة
      if (!email || !password) {
        console.log('❌ Missing email or password');
        return res.status(400).json({
          success: false,
          error: "Email and password are required",
          message_ar: "البريد الإلكتروني وكلمة المرور مطلوبان"
        });
      }

      console.log('🔍 Searching for user with email:', email.trim().toLowerCase());
      
      // البحث عن المستخدم
      const user = await User.findOne({ 
        email: email.trim().toLowerCase(),
        isActive: true 
      });

      console.log('👤 User found:', user ? 'Yes' : 'No');

      if (!user) {
        console.log('❌ User not found or inactive');
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
          message_ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
        });
      }

      console.log('🔒 Verifying password...');
      
      // التحقق من كلمة المرور
      const isPasswordValid = await user.comparePassword(password);
      
      console.log('✅ Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password');
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
          message_ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
        });
      }

      console.log('📅 Updating last login...');
      
      // تحديث آخر تسجيل دخول
      user.lastLogin = new Date();
      await user.save();

      console.log('🎫 Creating JWT token...');
      
      // إنشاء JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log('✅ Login successful for user:', user.email);
      
      const response = {
        success: true,
        message: "تم تسجيل الدخول بنجاح",
        message_ar: "تم تسجيل الدخول بنجاح",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        }
      };

      res.json(response);

    } catch (error) {
      console.error("❌ Error in login:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      res.status(500).json({
        success: false,
        error: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى",
        message_ar: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى"
      });
    }
  }

  // التحقق من صحة التوكن
  static async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "No token provided",
          message_ar: "لم يتم توفير رمز التحقق"
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          error: "Invalid token",
          message_ar: "رمز التحقق غير صالح"
        });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        }
      });

    } catch (error) {
      console.error("❌ Error in verifyToken:", error);
      res.status(401).json({
        success: false,
        error: "Invalid token",
        message_ar: "رمز التحقق غير صالح"
      });
    }
  }
}

module.exports = AuthController;
