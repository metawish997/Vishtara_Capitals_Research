const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Designation = require('../models/Designation');
const Role = require('../models/Role');
const Employee = require('../models/Employee');

async function test() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB successfully!');

    // 1. Fetch designations
    const designations = await Designation.find({});
    console.log(`Found ${designations.length} designations.`);
    if (designations.length === 0) {
      console.log('No designations found in database.');
      return;
    }
    const targetDesig = designations[0];
    console.log('Using designation:', targetDesig.name, 'with level:', targetDesig.level);

    // 2. Fetch or create employee role
    let employeeRole = await Role.findOne({ slug: 'employee' });
    if (!employeeRole) {
      employeeRole = await Role.findOne({ name: /employee/i });
    }
    if (!employeeRole) {
      console.log('Employee role not found. Attempting to create one...');
      employeeRole = await Role.create({
        name: 'Employee',
        slug: 'employee',
        permissions: []
      });
    }
    console.log('Using employee role:', employeeRole.name, 'ID:', employeeRole._id);

    // 3. Try to generate employeeCode
    const lastEmployee = await Employee.findOne().sort({ employeeCode: -1 });
    let nextNum = 1;
    if (lastEmployee && lastEmployee.employeeCode) {
      const match = lastEmployee.employeeCode.match(/EMP(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const employeeCode = `EMP${nextNum.toString().padStart(5, '0')}`;
    console.log('Generated Employee Code:', employeeCode);

    // 4. Try to create dummy employee
    const email = `test_dummy_${Date.now()}@domain.com`;
    const dummy = {
      employeeCode,
      firstName: 'Test',
      lastName: 'Dummy',
      email,
      phone: '9999999999',
      password: 'password123',
      designationId: targetDesig._id,
      roleId: employeeRole._id,
      reportingTo: null,
      joiningDate: new Date(),
      status: 'Active'
    };

    console.log('Creating employee in DB:', dummy);
    const created = await Employee.create(dummy);
    console.log('Successfully created employee in DB! Code:', created.employeeCode, 'ID:', created._id);

    // Cleanup the dummy employee
    await Employee.deleteOne({ _id: created._id });
    console.log('Cleaned up dummy employee.');

  } catch (error) {
    console.error('ERROR ENCOUNTERED:', error);
  } finally {
    await mongoose.connection.close();
    console.log('DB Connection closed.');
  }
}

test();
