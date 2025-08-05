const axios = require('axios');

async function testLogin(email, password) {
  try {
    console.log(`\nTesting login with email: ${email}`);
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      validateStatus: function (status) {
        return status < 500; // Reject only if the status code is greater than or equal to 500
      }
    });
    
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    return response;
  } catch (error) {
    console.error('Error occurred:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data
      } : 'No response',
      stack: error.stack
    });
    throw error;
  }
}

async function runTests() {
  try {
    // Test with test admin user
    console.log('=== Testing Admin Login ===');
    await testLogin('admin@example.com', 'admin123456');
    
    // Test with non-existent user
    console.log('\n=== Testing Non-Existent User ===');
    await testLogin('nonexistent@example.com', 'password123');
    
    // Test with incorrect password
    console.log('\n=== Testing Incorrect Password ===');
    await testLogin('admin@example.com', 'wrongpassword');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
runTests();
