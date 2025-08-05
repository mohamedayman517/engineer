const axios = require('axios');

async function testAddFaqWithAuth() {
  try {
    // Step 1: Login as admin
    console.log('Attempting to login as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123456'
    });

    const token = loginResponse.data.token;
    console.log('Login successful! Token received.');

    // Step 2: Add a new FAQ
    console.log('\nAttempting to add a new FAQ...');
    const faqData = {
      question: 'Test FAQ Question ' + new Date().toISOString(),
      answer: 'This is a test FAQ answer.'
    };

    const addResponse = await axios.post('http://localhost:5000/api/faq', faqData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('FAQ added successfully!', addResponse.data);
    
    // Step 3: List all FAQs to verify
    console.log('\nFetching all FAQs...');
    const listResponse = await axios.get('http://localhost:5000/api/faq', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Total FAQs in database: ${listResponse.data.length}`);
    console.log('Latest FAQ:', listResponse.data[listResponse.data.length - 1]);
    
  } catch (error) {
    console.error('Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
  }
}

testAddFaqWithAuth();
