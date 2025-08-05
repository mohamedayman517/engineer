const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/architectbot";
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Successfully connected to MongoDB');
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n=== Collections ===');
    console.log(collections.map(c => c.name).join('\n'));
    
    // Check if faqs collection exists
    const faqCollections = collections.filter(c => 
      c.name.toLowerCase().includes('faq') || c.name.toLowerCase().includes('faqs')
    );
    
    if (faqCollections.length === 0) {
      console.log('\n❌ No FAQ collections found!');
    } else {
      console.log('\n=== FAQ Collections ===');
      for (const coll of faqCollections) {
        console.log(`\nCollection: ${coll.name}`);
        const count = await mongoose.connection.db.collection(coll.name).countDocuments();
        console.log(`Document count: ${count}`);
        
        // Show first few documents
        const docs = await mongoose.connection.db.collection(coll.name)
          .find({})
          .limit(2)
          .toArray();
          
        console.log('Sample documents:', JSON.stringify(docs, null, 2));
      }
    }
    
    // Check Faq model registration
    console.log('\n=== Mongoose Models ===');
    console.log(mongoose.modelNames());
    
    // Try to get Faq model
    try {
      const Faq = mongoose.model('Faq');
      console.log('\nFaq model schema:', Faq.schema.obj);
      
      // Try to find FAQs
      console.log('\n=== Finding FAQs ===');
      const faqs = await Faq.find({});
      console.log(`Found ${faqs.length} FAQs`);
      
      // Try to create a test FAQ
      console.log('\n=== Creating Test FAQ ===');
      const testFaq = new Faq({
        question: 'Test FAQ ' + new Date().toISOString(),
        answer: 'This is a test FAQ answer.'
      });
      
      const savedFaq = await testFaq.save();
      console.log('Test FAQ saved:', savedFaq);
      
      // Verify it was saved
      const foundFaq = await Faq.findById(savedFaq._id);
      console.log('Found test FAQ:', foundFaq);
      
      // Count all FAQs
      const count = await Faq.countDocuments();
      console.log('Total FAQs in database:', count);
      
    } catch (err) {
      console.error('Error working with Faq model:', err);
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkDatabase();
