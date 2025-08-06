// Error Handler Middleware
class ErrorHandler {
  // معالج الأخطاء الرئيسي
  static handle(err, req, res, next) {
    console.error("❌ Error Handler:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    // تعيين الترميز الصحيح
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // أخطاء MongoDB
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        error: 'بيانات غير صالحة',
        message_ar: 'بيانات غير صالحة',
        details: errors
      });
    }

    // خطأ في معرف MongoDB
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'معرف غير صالح',
        message_ar: 'معرف غير صالح'
      });
    }

    // خطأ في التكرار (Duplicate Key)
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        error: `${field} موجود مسبقاً`,
        message_ar: `${field} موجود مسبقاً`
      });
    }

    // خطأ في JWT
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'رمز التحقق غير صالح',
        message_ar: 'رمز التحقق غير صالح'
      });
    }

    // انتهاء صلاحية JWT
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'انتهت صلاحية رمز التحقق',
        message_ar: 'انتهت صلاحية رمز التحقق'
      });
    }

    // خطأ في حجم الملف
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'حجم الملف كبير جداً',
        message_ar: 'حجم الملف كبير جداً'
      });
    }

    // خطأ في نوع الملف
    if (err.code === 'LIMIT_FILE_TYPE') {
      return res.status(400).json({
        success: false,
        error: 'نوع الملف غير مدعوم',
        message_ar: 'نوع الملف غير مدعوم'
      });
    }

    // خطأ في الشبكة
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'خطأ في الاتصال بالخدمة',
        message_ar: 'خطأ في الاتصال بالخدمة'
      });
    }

    // خطأ عام في الخادم
    const statusCode = err.statusCode || 500;
    const message = err.message || 'حدث خطأ في الخادم';

    res.status(statusCode).json({
      success: false,
      error: message,
      message_ar: message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack
      })
    });
  }

  // معالج الطلبات غير الموجودة
  static notFound(req, res, next) {
    const error = new Error(`الصفحة غير موجودة - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
  }

  // معالج الأخطاء غير المتوقعة
  static uncaughtException() {
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      console.error('🔄 Server will restart...');
      process.exit(1);
    });
  }

  // معالج الوعود المرفوضة
  static unhandledRejection() {
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      console.error('🔄 Server will restart...');
      process.exit(1);
    });
  }

  // تهيئة معالجات الأخطاء
  static init() {
    this.uncaughtException();
    this.unhandledRejection();
    console.log('✅ Error handlers initialized');
  }
}

module.exports = ErrorHandler;
