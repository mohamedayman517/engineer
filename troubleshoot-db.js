require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ MONGODB_URI is not defined in your .env file.');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
console.log(`Using URI: ${mongoUri}`);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:');
    console.error(err);
    process.exit(1);
  });
