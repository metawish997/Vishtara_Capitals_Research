const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Designation = require('../models/Designation');
const Employee = require('../models/Employee');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB!');

    const designations = await Designation.find({});
    console.log('--- DESIGNATIONS ---');
    designations.forEach(d => {
      console.log(`ID: ${d._id}, Name: "${d.name}", Level: ${d.level}`);
    });

    const employees = await Employee.find({ isDeleted: { $ne: true } }).populate('designationId');
    console.log('\n--- EMPLOYEES ---');
    employees.forEach(e => {
      console.log(`ID: ${e._id}, Name: ${e.firstName} ${e.lastName}, Code: ${e.employeeCode}, Designation: "${e.designationId ? e.designationId.name : 'None'}" (ID: ${e.designationId ? e.designationId._id : 'None'}), ReportingTo: ${e.reportingTo}`);
    });

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
}

test();
