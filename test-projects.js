const axios = require('axios');

async function testProjects() {
  try {
    console.log('Testing projects endpoint...');
    
    // First, login to get a token
    console.log('Logging in as engineer...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'engineer@example.com',
      password: 'engineer123456'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, token received');
    
    // Now fetch projects with the token
    console.log('Fetching projects...');
    const projectsResponse = await axios.get('http://localhost:5000/api/projects', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Projects fetched successfully:', {
      status: projectsResponse.status,
      count: projectsResponse.data.length,
      firstProject: projectsResponse.data[0] ? projectsResponse.data[0].title : 'No projects'
    });
    
  } catch (error) {
    console.error('Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
  }
}

testProjects();
