const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Employee = require('../models/Employee');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB!');

    const employee = await Employee.findOne({ firstName: 'TEST' }).populate('designationId');
    if (!employee) {
      console.log('TEST employee not found!');
      return;
    }

    console.log('Employee Details:', {
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      designation: employee.designationId?.name,
      reportingTo: employee.reportingTo,
      status: employee.status
    });

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
}

test();
