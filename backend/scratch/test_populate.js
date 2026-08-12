const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Employee = require('../models/Employee');
const Designation = require('../models/Designation');

async function runTest() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const employees = await Employee.find({ isDeleted: { $ne: true } })
      .populate('designationId')
      .populate({
        path: 'reportingTo',
        populate: { path: 'designationId' }
      });

    employees.forEach(emp => {
      console.log(`\nEmployee: ${emp.firstName} ${emp.lastName} (${emp.employeeCode})`);
      if (emp.reportingTo) {
        console.log(`- Reporting To: ${emp.reportingTo.firstName} ${emp.reportingTo.lastName}`);
        console.log(`  - designationId type: ${typeof emp.reportingTo.designationId}`);
        console.log(`  - designationId value:`, emp.reportingTo.designationId);
      } else {
        console.log('- Reporting To: None');
      }
    });

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
}

runTest();
