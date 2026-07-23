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

    // Find Sales Head
    const salesHead = await Employee.findOne({ firstName: 'Priya' }).populate('designationId');
    if (!salesHead) {
      console.error('Sales Head Priya not found');
      return;
    }
    console.log(`Found Sales Head: ${salesHead.firstName} ${salesHead.lastName}, Designation: ${salesHead.designationId.name}`);

    // Find Admin
    const adminEmp = await Employee.findOne({ firstName: 'Admin' }).populate('designationId');
    if (!adminEmp) {
      console.error('Admin employee not found');
      return;
    }
    console.log(`Found Admin Employee: ${adminEmp.firstName} ${adminEmp.lastName}, Designation: ${adminEmp.designationId.name}`);

    // Run hierarchy checks like in the controller:
    const finalDesignationId = salesHead.designationId._id;
    const employeeDesignation = await Designation.findById(finalDesignationId);
    const isSalesHead = employeeDesignation.name?.trim().toLowerCase() === 'sales head';
    const isAdmin = employeeDesignation.name?.trim().toLowerCase() === 'admin';
    const finalReportingTo = adminEmp._id;

    console.log('Checks:', { isSalesHead, isAdmin, finalReportingTo });

    if (finalReportingTo) {
      if (finalReportingTo.toString() === salesHead._id.toString()) {
        console.log('Error: cannot report to self');
        return;
      }

      const managerEmployee = await Employee.findById(finalReportingTo).populate('designationId');
      if (!managerEmployee) {
        console.log('Error: manager not found');
        return;
      }
      const managerDesignation = managerEmployee.designationId;
      if (!managerDesignation) {
        console.log('Error: manager design not found');
        return;
      }

      const isManagerAdmin = managerDesignation.name?.trim().toLowerCase() === 'admin';
      console.log('Manager checks:', { isManagerAdmin, managerDesignationName: managerDesignation.name });

      if (isSalesHead) {
        if (!isManagerAdmin) {
          console.log('Violation: Sales Head must report only to Admin');
          return;
        }
      } else {
        if (isManagerAdmin) {
          console.log('Violation: Only Sales Head can report directly to Admin');
          return;
        }
        if (managerDesignation.level >= employeeDesignation.level) {
          console.log('Violation: level check');
          return;
        }
      }
    }

    console.log('All validations passed! Now saving...');
    salesHead.reportingTo = finalReportingTo;
    await salesHead.save();
    console.log('Saved successfully!');

    // Re-fetch and check
    const updated = await Employee.findById(salesHead._id).populate('reportingTo');
    console.log('Updated Priya reportingTo in DB:', updated.reportingTo);

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
}

test();
