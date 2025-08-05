const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// MongoDB connection
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedConnection = connection;
  return connection;
}

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'engineer'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

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

  try {
    await connectToDatabase();

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const action = pathname.split('/').pop(); // login, register, etc.

    if (req.method === 'POST' && action === 'login') {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          error: "Email and password are required", 
          message_ar: "البريد الإلكتروني وكلمة المرور مطلوبان" 
        });
      }

      const user = await User.findOne({ email: email.trim().toLowerCase(), isActive: true });
      if (!user) {
        return res.status(401).json({ 
          error: "Invalid email or password", 
          message_ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          error: "Invalid email or password", 
          message_ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
        });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role }, 
        process.env.JWT_SECRET || 'default-secret', 
        { expiresIn: "7d" }
      );

      return res.json({ 
        message: "Login successful", 
        message_ar: "تم تسجيل الدخول بنجاح", 
        token, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      });

    } else if (req.method === 'POST' && action === 'register') {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: "All fields are required", 
          message_ar: "جميع الحقول مطلوبة" 
        });
      }

      const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ 
          error: "User already exists", 
          message_ar: "المستخدم موجود بالفعل" 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        name,
        email: email.trim().toLowerCase(),
        password: hashedPassword
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role }, 
        process.env.JWT_SECRET || 'default-secret', 
        { expiresIn: "7d" }
      );

      return res.status(201).json({ 
        message: "Registration successful", 
        message_ar: "تم التسجيل بنجاح", 
        token, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message_ar: 'حدث خطأ في الخادم',
      details: error.message 
    });
  }
};
