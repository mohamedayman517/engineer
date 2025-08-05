const nodemailer = require("nodemailer");
require('dotenv').config();

console.log("🔧 Initializing email transporter...");

// Check if required environment variables are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ ERROR: Missing required email configuration in .env file');
  console.error('Please make sure you have set:');
  console.error('EMAIL_USER=your-email@gmail.com');
  console.error('EMAIL_PASSWORD=your-app-specific-password');
  console.error('\nFor Gmail, you need to:');
  console.error('1. Enable 2-Step Verification on your Google Account');
  console.error('2. Generate an "App Password" (not your regular password)');
  console.error('3. Use this App Password as the EMAIL_PASSWORD');
  process.exit(1);
}

console.log("📧 Email configuration:", {
  service: "gmail",
  user: process.env.EMAIL_USER,
  hasPassword: !!process.env.EMAIL_PASSWORD,
});

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Error verifying email configuration:", error.message);
    console.error("🔍 Error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
    });
    console.error('\nTroubleshooting steps:');
    console.log('1. Make sure you\'re using an App Password, not your Gmail password');
    console.log('2. Enable 2-Step Verification in your Google Account');
    console.log('3. Generate an App Password for your application');
    console.log('4. Check that your .env file has the correct values');
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

module.exports = transporter;
