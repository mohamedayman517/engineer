const axios = require('axios');

async function testAddFaq() {
  try {
    const response = await axios.post('http://localhost:5000/api/faq', {
      question: 'Test FAQ Question',
      answer: 'Test FAQ Answer'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_VALID_TOKEN_HERE' // Replace with a valid token
      }
    });
    
    console.log('Success!', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAddFaq();
