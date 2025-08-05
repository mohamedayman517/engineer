const express = require("express");
const router = express.Router();
const transporter = require("../utils/emailTransporter");
require("dotenv").config();

// Contact form route
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, projectType, message } = req.body;

    console.log('Contact form data received:', { name, email, phone, projectType, message });

    // Validation - only name, email, and message are required
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Prepare email content
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to your email
      replyTo: `"${name}" <${email}>`, // Set reply-to as user's email
      subject: `New Contact: ${name} - ${projectType || 'No Project Type'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
          <h2 style="color: #2563eb; text-align: center;">طلب تواصل جديد</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">معلومات العميل</h3>
            <p><strong>الاسم:</strong> ${name}</p>
            <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>رقم الجوال:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
            ${projectType ? `<p><strong>نوع المشروع:</strong> ${projectType}</p>` : ''}
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #334155; margin-top: 0;">الرسالة:</h3>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border-right: 4px solid #3b82f6;">
              <p style="line-height: 1.6; color: #1e293b; margin: 0; white-space: pre-line;">${message}</p>
            </div>
          </div>
          
          <div style="margin-top: 25px; padding: 15px; background-color: #eff6ff; border-radius: 8px; border-right: 4px solid #3b82f6;">
            <p style="margin: 0; color: #1e40af; font-size: 14px; text-align: center;">
              <i class="fas fa-reply" style="margin-left: 5px;"></i>
              للرد على المرسل: <a href="mailto:${email}" style="color: #1d4ed8; text-decoration: none;">${email}</a>
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #64748b;">
            <p>تم إرسال هذه الرسالة من نموذج الاتصال في الموقع</p>
            <p>${new Date().toLocaleString('ar-EG', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);

    res.json({
      success: true,
      message: "Message sent successfully!",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
