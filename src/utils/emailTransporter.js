const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a test account if in development
const createTestAccount = async () => {
  if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_HOST) {
    const testAccount = await nodemailer.createTestAccount();
    return {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    };
  }
  return null;
};

// Create transporter with environment variables or test account
const createTransporter = async () => {
  try {
    // Check if we're in development and no SMTP settings are provided
    const testConfig = await createTestAccount();
    if (testConfig) {
      console.log('Using Ethereal test account for email in development');
      console.log('Test account credentials:', {
        user: testConfig.auth.user,
        pass: testConfig.auth.pass
      });
      return nodemailer.createTransport(testConfig);
    }

    // Production/Staging configuration
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || 
        !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Missing required email configuration in environment variables');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('Email server is ready to take our messages');
    
    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    throw error;
  }
};

// Send email function
const sendEmail = async (mailOptions) => {
  try {
    const transporter = await createTransporter();
    
    // Default options
    const defaultOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Architect Bot'}" <${process.env.EMAIL_FROM || 'noreply@example.com'}>`,
      ...mailOptions
    };

    console.log('Sending email:', {
      to: defaultOptions.to,
      subject: defaultOptions.subject,
      isHtml: !!defaultOptions.html
    });

    // Send mail
    const info = await transporter.sendMail(defaultOptions);
    
    // Log preview URL in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Email templates
const emailTemplates = {
  welcome: (user) => ({
    subject: 'مرحباً بك في Architect Bot',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>مرحباً ${user.name || 'عزيزي المستخدم'}</h2>
        <p>شكراً لتسجيلك في نظام Architect Bot.</p>
        <p>يمكنك الآن تسجيل الدخول باستخدام بريدك الإلكتروني.</p>
        <p>مع تحيات،<br>فريق Architect Bot</p>
      </div>
    `
  }),
  resetPassword: (user, resetUrl) => ({
    subject: 'إعادة تعيين كلمة المرور',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>إعادة تعيين كلمة المرور</h2>
        <p>مرحباً ${user.name || 'عزيزي المستخدم'}</p>
        <p>لقد تلقيت هذا البريد لأنك طلبت إعادة تعيين كلمة المرور الخاصة بحسابك.</p>
        <p>الرجاء الضغط على الزر أدناه لإعادة تعيين كلمة المرور:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            إعادة تعيين كلمة المرور
          </a>
        </p>
        <p>إذا لم تكن قد طلبت إعادة تعيين كلمة المرور، فيمكنك تجاهل هذا البريد.</p>
        <p>مع تحيات،<br>فريق Architect Bot</p>
      </div>
    `
  })
};

module.exports = {
  createTransporter,
  sendEmail,
  emailTemplates
};
