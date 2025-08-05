const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// Middleware للتحقق من المصادقة
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.startsWith("Bearer ") 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return res.status(401).json({
        error: "الوصول مرفوض. يرجى تسجيل الدخول"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: "المستخدم غير موجود أو غير نشط"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      error: "رمز المصادقة غير صحيح"
    });
  }
};

// Middleware للتحقق من صلاحيات الإدارة
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "يرجى تسجيل الدخول أولاً"
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "الوصول مرفوض. صلاحيات الإدارة مطلوبة"
    });
  }

  next();
};

// Middleware اختياري للمصادقة (لا يرفض الطلب إذا لم يكن هناك token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.startsWith("Bearer ") 
      ? authHeader.substring(7) 
      : null;

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // في حالة الخطأ، نتجاهله ونتابع بدون مستخدم
    next();
  }
};

// Middleware للتحقق من صلاحيات المهندس أو الإدارة
const requireEngineerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "يرجى تسجيل الدخول أولاً"
    });
  }

  if (req.user.role !== "admin" && req.user.role !== "engineer") {
    return res.status(403).json({
      error: "الوصول مرفوض. صلاحيات الإدارة أو المهندس مطلوبة"
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireEngineerOrAdmin,
  optionalAuth
};
