require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/architectbot');
    console.log('Connected to MongoDB');
    
    const email = 'mohameddaayman20@gmail.com';
    const newPassword = 'password123';
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log(`Found user: ${user.name} (${user.email})`);
    
    // Update password - the pre-save middleware will hash it automatically
    user.password = newPassword;
    await user.save();
    
    console.log(`✅ Password updated successfully for ${user.email}`);
    console.log(`New password: ${newPassword}`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

resetPassword();
