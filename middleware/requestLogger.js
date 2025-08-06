const fs = require('fs');
const path = require('path');

class RequestLogger {
  constructor() {
    // إنشاء مجلد logs إذا لم يكن موجوداً
    this.logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  // تسجيل الطلبات
  log(req, res, next) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    // معلومات الطلب
    const requestInfo = {
      timestamp,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      origin: req.headers.origin,
      contentType: req.headers['content-type'],
      contentLength: req.headers['content-length']
    };

    // طباعة معلومات الطلب
    console.log(`🌐 ${req.method} ${req.url} - IP: ${req.ip}`);
    
    // تسجيل معلومات إضافية للطلبات المهمة
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      console.log(`📝 ${req.method} Request Details:`, {
        url: req.url,
        body: req.body ? Object.keys(req.body) : 'No body',
        headers: {
          contentType: req.headers['content-type'],
          authorization: req.headers.authorization ? 'Present' : 'None'
        }
      });
    }

    // معالجة الاستجابة
    const originalSend = res.send;
    res.send = function(body) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // معلومات الاستجابة
      const responseInfo = {
        ...requestInfo,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        responseSize: body ? body.length : 0
      };

      // طباعة معلومات الاستجابة
      const statusEmoji = res.statusCode >= 400 ? '❌' : res.statusCode >= 300 ? '⚠️' : '✅';
      console.log(`${statusEmoji} ${res.statusCode} ${req.method} ${req.url} - ${duration}ms`);

      // تسجيل الأخطاء
      if (res.statusCode >= 400) {
        console.error(`❌ Error Response:`, {
          url: req.url,
          method: req.method,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          body: body ? JSON.parse(body) : 'No body'
        });
      }

      // حفظ السجل في ملف (في حالة الإنتاج فقط)
      if (process.env.NODE_ENV === 'production') {
        this.saveToFile(responseInfo);
      }

      return originalSend.call(this, body);
    };

    next();
  }

  // حفظ السجل في ملف
  saveToFile(logData) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logsDir, `requests-${today}.log`);
      const logEntry = JSON.stringify(logData) + '\n';
      
      fs.appendFileSync(logFile, logEntry);
    } catch (error) {
      console.error('❌ Error saving log to file:', error);
    }
  }

  // تسجيل حالة قاعدة البيانات
  static logDatabaseStatus(mongoose) {
    return (req, res, next) => {
      const dbStatus = mongoose.connection.readyState;
      const statusMap = {
        0: '❌ Disconnected',
        1: '✅ Connected',
        2: '🔄 Connecting',
        3: '⚠️ Disconnecting'
      };
      
      console.log(`🗄️ MongoDB Status: ${statusMap[dbStatus] || '❓ Unknown'}`);
      
      // إضافة حالة قاعدة البيانات إلى الطلب
      req.dbStatus = {
        status: dbStatus,
        statusText: statusMap[dbStatus] || 'Unknown'
      };
      
      next();
    };
  }

  // تسجيل معلومات الأمان
  static securityLogger(req, res, next) {
    // تسجيل محاولات الوصول المشبوهة
    const suspiciousPatterns = [
      /\.\.\//, // Path traversal
      /script/i, // XSS attempts
      /union.*select/i, // SQL injection
      /exec\(/i, // Code injection
    ];

    const url = req.url.toLowerCase();
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    
    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(url) || pattern.test(userAgent)
    );

    if (isSuspicious) {
      console.warn('🚨 Suspicious request detected:', {
        ip: req.ip,
        url: req.url,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      });
    }

    next();
  }

  // middleware للاستخدام
  middleware() {
    return this.log.bind(this);
  }
}

module.exports = RequestLogger;
