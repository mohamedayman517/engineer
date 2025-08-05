const nodemailer = require('nodemailer');
require('dotenv').config();

// Create email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, projectType, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, email, and message are required fields" 
      });
    }

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: `"${name}" <${email}>`,
      subject: `New Contact: ${name} - ${projectType || 'No Project Type'}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">رسالة جديدة من موقع المهندس المعماري</h2>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #34495e;">الاسم:</strong>
              <span style="margin-right: 10px;">${name}</span>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #34495e;">البريد الإلكتروني:</strong>
              <span style="margin-right: 10px;">${email}</span>
            </div>
            
            ${phone ? `
            <div style="margin-bottom: 20px;">
              <strong style="color: #34495e;">رقم الهاتف:</strong>
              <span style="margin-right: 10px;">${phone}</span>
            </div>
            ` : ''}
            
            ${projectType ? `
            <div style="margin-bottom: 20px;">
              <strong style="color: #34495e;">نوع المشروع:</strong>
              <span style="margin-right: 10px;">${projectType}</span>
            </div>
            ` : ''}
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #34495e;">الرسالة:</strong>
              <div style="margin-top: 10px; padding: 15px; background-color: #ecf0f1; border-radius: 5px; line-height: 1.6;">
                ${message}
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #bdc3c7;">
              <p style="color: #7f8c8d; font-size: 14px;">تم إرسال هذه الرسالة من موقع المهندس المعماري</p>
              <p style="color: #7f8c8d; font-size: 12px;">التاريخ: ${new Date().toLocaleString('ar-EG')}</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return res.json({ 
      success: true, 
      message: "Message sent successfully!", 
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to send message. Please try again later.",
      error: error.message 
    });
  }
};
