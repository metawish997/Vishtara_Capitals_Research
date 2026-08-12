const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:5001/api/v1/employees');
    console.log('API Status:', res.status);
    console.log('API Success:', res.data.success);
    console.log('Employees Count:', res.data.data.length);
    res.data.data.forEach(e => {
      console.log(`Employee: ${e.firstName} ${e.lastName}`);
      console.log(`- designationId type: ${typeof e.designationId}`);
      console.log(`- designationId value:`, e.designationId);
      console.log(`- reportingTo value:`, e.reportingTo);
    });
  } catch (err) {
    console.error('API Error:', err.message);
    if (err.response) {
      console.error('API Error Data:', err.response.data);
    }
  }
}

test();
