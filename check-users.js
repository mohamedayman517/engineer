require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/architectbot');
    console.log('Connected to MongoDB');
    
    const users = await User.find({}).select('name email role isActive createdAt');
    console.log('=== Users in Database ===');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
    });
    
    if (users.length === 0) {
      console.log('No users found in database');
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();
