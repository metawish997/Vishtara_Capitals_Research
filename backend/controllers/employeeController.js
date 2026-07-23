const Employee = require('../models/Employee');
const Designation = require('../models/Designation');
const Role = require('../models/Role');
const { processMedia, deleteMedia } = require('../utils/fileHandler');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res, next) => {
  try {
    let query = { isDeleted: { $ne: true } };

    // Search filter
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { employeeCode: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    // Status filter
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    // Designation filter
    if (req.query.designationId && req.query.designationId !== 'All') {
      query.designationId = req.query.designationId;
    }

    // Role filter
    if (req.query.roleId && req.query.roleId !== 'All') {
      query.roleId = req.query.roleId;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const total = await Employee.countDocuments(query);

    const employees = await Employee.find(query)
      .populate('designationId')
      .populate('roleId')
      .populate({
        path: 'reportingTo',
        populate: { path: 'designationId' }
      })
      .sort(sort)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: employees.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee details
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, isDeleted: { $ne: true } })
      .populate('designationId')
      .populate('roleId')
      .populate({
        path: 'reportingTo',
        populate: { path: 'designationId' }
      });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
exports.createEmployee = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, designationId, reportingTo, joiningDate, status } = req.body;

    // Auto-generate employeeCode: EMP00001 format
    const lastEmployee = await Employee.findOne().sort({ employeeCode: -1 });
    let nextNum = 1;
    if (lastEmployee && lastEmployee.employeeCode) {
      const match = lastEmployee.employeeCode.match(/EMP(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const employeeCode = `EMP${nextNum.toString().padStart(5, '0')}`;

    const employeeDesignation = await Designation.findById(designationId);
    if (!employeeDesignation) {
      return res.status(400).json({ success: false, message: 'Selected designation not found.' });
    }

    const isSalesHead = employeeDesignation.name?.trim().toLowerCase() === 'sales head';
    const isAdmin = employeeDesignation.name?.trim().toLowerCase() === 'admin';
    const finalReportingTo = isAdmin ? null : (reportingTo || null);

    // Verify designation hierarchy if finalReportingTo is specified
    if (finalReportingTo) {
      const managerEmployee = await Employee.findById(finalReportingTo).populate('designationId');
      if (!managerEmployee) {
        return res.status(400).json({ success: false, message: 'Selected reporting manager not found.' });
      }
      const managerDesignation = managerEmployee.designationId;
      if (!managerDesignation) {
        return res.status(400).json({ success: false, message: 'Reporting manager has no designation assigned.' });
      }

      const isManagerAdmin = managerDesignation.name?.trim().toLowerCase() === 'admin';

      if (isSalesHead) {
        // Sales Head reports ONLY to Admin
        if (!isManagerAdmin) {
          return res.status(400).json({
            success: false,
            message: 'Hierarchy violation: A Sales Head must report only to an Admin.'
          });
        }
      } else {
        // Other designations cannot report directly to Admin
        if (isManagerAdmin) {
          return res.status(400).json({
            success: false,
            message: 'Hierarchy violation: Only Sales Head can report directly to an Admin.'
          });
        }
        // General level hierarchy check
        if (managerDesignation.level >= employeeDesignation.level) {
          return res.status(400).json({
            success: false,
            message: `Hierarchy violation: A ${employeeDesignation.name} cannot report to a ${managerDesignation.name}. Manager must have a higher designation hierarchy.`
          });
        }
      }
    }

    // Automatically find or create the "Employee" role
    let employeeRole = await Role.findOne({ slug: 'employee' });
    if (!employeeRole) {
      employeeRole = await Role.findOne({ name: /employee/i });
    }
    if (!employeeRole) {
      employeeRole = await Role.create({
        name: 'Employee',
        slug: 'employee',
        permissions: []
      });
    }

    // Process Profile Photo
    let profilePhoto = null;
    if (req.file) {
      const processed = await processMedia(req.file, 'employees');
      profilePhoto = processed.url;
    }

    const employee = await Employee.create({
      employeeCode,
      firstName,
      lastName,
      email,
      phone,
      password,
      designationId,
      roleId: employeeRole._id,
      reportingTo: finalReportingTo,
      joiningDate,
      profilePhoto,
      status: status || 'Active'
    });

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error);
    next(error);
  }
};

// @desc    Update employee details
// @route   PUT /api/employees/:id
// @access  Private/Admin
exports.updateEmployee = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, designationId, reportingTo, joiningDate, status } = req.body;
    let employee = await Employee.findById(req.params.id);
    if (!employee || employee.isDeleted) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    const finalDesignationId = designationId || employee.designationId;
    const employeeDesignation = await Designation.findById(finalDesignationId);
    if (!employeeDesignation) {
      return res.status(400).json({ success: false, message: 'Designation not found.' });
    }

    const isSalesHead = employeeDesignation.name?.trim().toLowerCase() === 'sales head';
    const isAdmin = employeeDesignation.name?.trim().toLowerCase() === 'admin';
    const finalReportingTo = isAdmin ? null : (reportingTo !== undefined ? reportingTo : employee.reportingTo);

    // Verify designation hierarchy
    if (finalReportingTo) {
      if (finalReportingTo.toString() === req.params.id) {
        return res.status(400).json({ success: false, message: 'An employee cannot report to themselves.' });
      }

      const managerEmployee = await Employee.findById(finalReportingTo).populate('designationId');
      if (!managerEmployee) {
        return res.status(400).json({ success: false, message: 'Selected reporting manager not found.' });
      }
      const managerDesignation = managerEmployee.designationId;
      if (!managerDesignation) {
        return res.status(400).json({ success: false, message: 'Reporting manager has no designation assigned.' });
      }

      const isManagerAdmin = managerDesignation.name?.trim().toLowerCase() === 'admin';

      if (isSalesHead) {
        // Sales Head reports ONLY to Admin
        if (!isManagerAdmin) {
          return res.status(400).json({
            success: false,
            message: 'Hierarchy violation: A Sales Head must report only to an Admin.'
          });
        }
      } else {
        // Other designations cannot report directly to Admin
        if (isManagerAdmin) {
          return res.status(400).json({
            success: false,
            message: 'Hierarchy violation: Only Sales Head can report directly to an Admin.'
          });
        }
        if (managerDesignation.level >= employeeDesignation.level) {
          return res.status(400).json({
            success: false,
            message: `Hierarchy violation: A ${employeeDesignation.name} cannot report to a ${managerDesignation.name}. Manager must have a higher designation hierarchy.`
          });
        }
      }
    }

    // Automatically find or create the "Employee" role
    let employeeRole = await Role.findOne({ slug: 'employee' });
    if (!employeeRole) {
      employeeRole = await Role.findOne({ name: /employee/i });
    }
    if (!employeeRole) {
      employeeRole = await Role.create({
        name: 'Employee',
        slug: 'employee',
        permissions: []
      });
    }

    // Process Profile Photo
    let profilePhoto = employee.profilePhoto;
    if (req.file) {
      // Delete old photo if it exists
      if (employee.profilePhoto) {
        await deleteMedia(employee.profilePhoto);
      }
      const processed = await processMedia(req.file, 'employees');
      profilePhoto = processed.url;
    }

    const updatedData = {
      firstName: firstName || employee.firstName,
      lastName: lastName || employee.lastName,
      email: email || employee.email,
      phone: phone || employee.phone,
      designationId: finalDesignationId,
      roleId: employeeRole._id,
      reportingTo: finalReportingTo || null,
      joiningDate: joiningDate || employee.joiningDate,
      profilePhoto,
      status: status || employee.status
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    }).populate('designationId').populate('roleId').populate({
      path: 'reportingTo',
      populate: { path: 'designationId' }
    });

    res.status(200).json({
      success: true,
      data: updatedEmployee
    });
  } catch (error) {
    console.error("UPDATE EMPLOYEE ERROR:", error);
    next(error);
  }
};

// @desc    Change employee status
// @route   PATCH /api/employees/:id/status
// @access  Private/Admin
exports.changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive', 'Resigned'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee || employee.isDeleted) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    employee.status = status;
    await employee.save();

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee (soft delete)
// @route   DELETE /api/employees/:id
// @access  Private/Admin
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee || employee.isDeleted) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    employee.isDeleted = true;
    employee.deletedAt = Date.now();
    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee soft-deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
