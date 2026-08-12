const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { updateEmployee } = require('../controllers/employeeController');

async function runTest() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB!');

    const req = {
      params: { id: '6a293070832b4a2b7b98e460' }, // ID of "test new"
      body: {
        firstName: 'test',
        lastName: 'new',
        email: 'testnew@gmail.com',
        phone: '8888888888',
        designationId: '6a291a8f1543227771f43a05', // Sales Head
        reportingTo: '6a29241b832b4a2b7b98dbfd', // Admin User
        joiningDate: '2026-06-10',
        status: 'Active'
      }
    };

    const res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        console.log('Response JSON (Status ' + this.statusCode + '):', JSON.stringify(data, null, 2));
      }
    };

    const next = function(err) {
      console.error('Next called with error:', err);
    };

    console.log('Invoking updateEmployee controller directly...');
    await updateEmployee(req, res, next);

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('DB connection closed.');
  }
}

runTest();
