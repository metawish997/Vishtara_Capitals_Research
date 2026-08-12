const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Designation = require('../models/Designation');
const Employee = require('../models/Employee');

async function check() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const designations = await Designation.find({});
    console.log('\n--- DESIGNATIONS ---');
    designations.forEach(d => {
      console.log(`ID: ${d._id} | Name: "${d.name}" | Level: ${d.level}`);
    });

    const employees = await Employee.find({ isDeleted: { $ne: true } }).populate('designationId');
    console.log('\n--- EMPLOYEES ---');
    employees.forEach(e => {
      console.log(`ID: ${e._id} | Code: ${e.employeeCode} | Name: ${e.firstName} ${e.lastName} | Designation: "${e.designationId ? e.designationId.name : 'None'}" | Level: ${e.designationId ? e.designationId.level : 'N/A'} | ReportingTo: ${e.reportingTo}`);
    });

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await mongoose.connection.close();
    console.log('DB Connection closed.');
  }
}

check();
