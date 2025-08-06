const transporter = require("../utils/emailTransporter");

class ContactController {
  // إرسال رسالة تواصل
  static async sendContactMessage(req, res) {
    try {
      console.log("📧 Contact form submission:", {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        body: req.body
      });

      const { name, email, phone, projectType, message } = req.body;

      // التحقق من البيانات المطلوبة
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: "الاسم والبريد الإلكتروني والرسالة مطلوبة",
          message_ar: "الاسم والبريد الإلكتروني والرسالة مطلوبة"
        });
      }

      // التحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "البريد الإلكتروني غير صالح",
          message_ar: "البريد الإلكتروني غير صالح"
        });
      }

      // إعداد محتوى البريد الإلكتروني
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // إرسال إلى نفس البريد
        subject: `رسالة جديدة من موقع المهندس المعماري - ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
              📧 رسالة جديدة من موقع المهندس المعماري
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #2c3e50; margin-top: 0;">معلومات المرسل:</h3>
              <p><strong>الاسم:</strong> ${name}</p>
              <p><strong>البريد الإلكتروني:</strong> ${email}</p>
              ${phone ? `<p><strong>رقم الهاتف:</strong> ${phone}</p>` : ''}
              ${projectType ? `<p><strong>نوع المشروع:</strong> ${projectType}</p>` : ''}
            </div>
            
            <div style="background-color: #ffffff; padding: 15px; border: 1px solid #e9ecef; border-radius: 5px;">
              <h3 style="color: #2c3e50; margin-top: 0;">الرسالة:</h3>
              <p style="line-height: 1.6; color: #555;">${message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e8; border-radius: 5px; text-align: center;">
              <p style="margin: 0; color: #27ae60;">
                <strong>تم إرسال هذه الرسالة من موقع المهندس المعماري</strong>
              </p>
              <p style="margin: 5px 0 0 0; color: #7f8c8d; font-size: 12px;">
                تاريخ الإرسال: ${new Date().toLocaleString('ar-EG')}
              </p>
            </div>
          </div>
        `,
        text: `
          رسالة جديدة من موقع المهندس المعماري
          
          الاسم: ${name}
          البريد الإلكتروني: ${email}
          ${phone ? `رقم الهاتف: ${phone}` : ''}
          ${projectType ? `نوع المشروع: ${projectType}` : ''}
          
          الرسالة:
          ${message}
          
          تاريخ الإرسال: ${new Date().toLocaleString('ar-EG')}
        `
      };

      console.log("📤 Sending email...");

      // إرسال البريد الإلكتروني
      await transporter.sendMail(mailOptions);

      console.log("✅ Contact email sent successfully");

      res.json({
        success: true,
        message: "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً",
        message_ar: "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً"
      });

    } catch (error) {
      console.error("❌ Error sending contact email:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      // التعامل مع أخطاء البريد الإلكتروني المختلفة
      let errorMessage = "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى";

      if (error.code === 'EAUTH') {
        errorMessage = "خطأ في إعدادات البريد الإلكتروني. يرجى التواصل مع المدير";
        console.error("❌ Email authentication failed. Check EMAIL_USER and EMAIL_PASS");
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = "خطأ في الاتصال بخادم البريد الإلكتروني";
        console.error("❌ Email server not found. Check internet connection");
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = "انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى";
        console.error("❌ Email sending timeout");
      }

      res.status(500).json({
        success: false,
        error: errorMessage,
        message_ar: errorMessage,
        ...(process.env.NODE_ENV === 'development' && {
          details: error.message
        })
      });
    }
  }

  // اختبار إعدادات البريد الإلكتروني
  static async testEmailSettings(req, res) {
    try {
      console.log("🧪 Testing email settings...");

      // التحقق من وجود إعدادات البريد الإلكتروني
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(400).json({
          success: false,
          error: "إعدادات البريد الإلكتروني غير مكتملة",
          message_ar: "إعدادات البريد الإلكتروني غير مكتملة",
          details: {
            EMAIL_USER: !!process.env.EMAIL_USER,
            EMAIL_PASS: !!process.env.EMAIL_PASS
          }
        });
      }

      // إرسال بريد إلكتروني تجريبي
      const testMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "اختبار إعدادات البريد الإلكتروني - موقع المهندس المعماري",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50; text-align: center;">🧪 اختبار البريد الإلكتروني</h2>
            <p>هذه رسالة اختبار للتأكد من عمل إعدادات البريد الإلكتروني بشكل صحيح.</p>
            <p><strong>التاريخ والوقت:</strong> ${new Date().toLocaleString('ar-EG')}</p>
            <p style="color: #27ae60;"><strong>✅ إعدادات البريد الإلكتروني تعمل بشكل صحيح!</strong></p>
          </div>
        `,
        text: `
          اختبار البريد الإلكتروني
          
          هذه رسالة اختبار للتأكد من عمل إعدادات البريد الإلكتروني بشكل صحيح.
          
          التاريخ والوقت: ${new Date().toLocaleString('ar-EG')}
          
          ✅ إعدادات البريد الإلكتروني تعمل بشكل صحيح!
        `
      };

      await transporter.sendMail(testMailOptions);

      console.log("✅ Test email sent successfully");

      res.json({
        success: true,
        message: "تم إرسال البريد الإلكتروني التجريبي بنجاح",
        message_ar: "تم إرسال البريد الإلكتروني التجريبي بنجاح"
      });

    } catch (error) {
      console.error("❌ Error testing email settings:", error);

      res.status(500).json({
        success: false,
        error: "فشل في اختبار إعدادات البريد الإلكتروني",
        message_ar: "فشل في اختبار إعدادات البريد الإلكتروني",
        details: error.message
      });
    }
  }
}

module.exports = ContactController;
