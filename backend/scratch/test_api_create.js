const axios = require('axios');

async function runTest() {
  try {
    const baseURL = 'http://localhost:5001/api/v1';

    // 1. Login to get token
    console.log('Logging in...');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@example.com',
      password: '11111111'
    });
    const token = loginRes.data.token;
    console.log('Logged in! Token obtained.');

    // 2. Create employee
    console.log('Creating test Sales Head via API...');
    const postData = {
      firstName: 'HTTP',
      lastName: 'Test',
      email: `httptest_${Date.now()}@domain.com`,
      phone: '8888888888',
      password: 'password123',
      designationId: '6a291a8f1543227771f43a05', // Sales Head
      reportingTo: '6a29241b832b4a2b7b98dbfd', // Admin User
      joiningDate: '2026-06-10',
      status: 'Active'
    };

    const createRes = await axios.post(`${baseURL}/employees`, postData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Create API Response:', JSON.stringify(createRes.data, null, 2));

  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('API Error Data:', error.response.data);
    }
  }
}

runTest();
