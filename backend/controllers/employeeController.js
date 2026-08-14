const User = require('../models/User');
const Role = require('../models/Role');
const { processMedia, deleteMedia } = require('../utils/fileHandler');

const mapUserToEmployee = (user) => {
  const e = user.toObject ? user.toObject() : user;
  e.roleId = e.role;
  if (e.status) {
      if (e.status.toLowerCase() === 'active') e.status = 'Active';
      else if (e.status.toLowerCase() === 'inactive') e.status = 'Inactive';
      else if (e.status.toLowerCase() === 'resigned') e.status = 'Resigned';
      else e.status = e.status.charAt(0).toUpperCase() + e.status.slice(1);
  } else {
      e.status = 'Active';
  }
  return e;
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res, next) => {
  try {
    const customerRole = await Role.findOne({ slug: 'customer' });
    let query = { isDeleted: { $ne: true }, email: { $ne: 'admin@example.com' } };
    
    if (customerRole) {
      query.role = { $ne: customerRole._id };
    }

    // Search filter
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { employeeCode: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { name: searchRegex }
      ];
    }

    // Status filter
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status.toLowerCase();
    }

    // Role filter
    if (req.query.roleId && req.query.roleId !== 'All') {
      query.role = req.query.roleId;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const total = await User.countDocuments(query);

    const employees = await User.find(query)
      .populate('role')
      .sort(sort)
      .skip(startIndex)
      .limit(limit);

    const mappedEmployees = employees.map(mapUserToEmployee);

    res.status(200).json({
      success: true,
      count: mappedEmployees.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: mappedEmployees,
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
    const employee = await User.findOne({ _id: req.params.id, isDeleted: { $ne: true } })
      .populate('role');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: mapUserToEmployee(employee)
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
    const { firstName, lastName, email, phone, password, joiningDate, status } = req.body;

    // Auto-generate employeeCode: EMP00001 format
    const lastEmployee = await User.findOne({ employeeCode: { $exists: true } }).sort({ employeeCode: -1 });
    let nextNum = 1;
    if (lastEmployee && lastEmployee.employeeCode) {
      const match = lastEmployee.employeeCode.match(/EMP(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const employeeCode = `EMP${nextNum.toString().padStart(5, '0')}`;

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

    const employee = await User.create({
      employeeCode,
      name: `${firstName || ''} ${lastName || ''}`.trim(),
      firstName,
      lastName,
      email,
      phone,
      password,
      role: employeeRole._id,
      joiningDate,
      profilePhoto,
      image: profilePhoto,
      status: status ? status.toLowerCase() : 'active'
    });

    res.status(201).json({
      success: true,
      data: mapUserToEmployee(employee)
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
    const { firstName, lastName, email, phone, joiningDate, status, roleId } = req.body;
    let employee = await User.findById(req.params.id);
    if (!employee || employee.isDeleted) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
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
    let profilePhoto = employee.profilePhoto || employee.image;
    if (req.file) {
      // Delete old photo if it exists
      if (profilePhoto) {
        await deleteMedia(profilePhoto);
      }
      const processed = await processMedia(req.file, 'employees');
      profilePhoto = processed.url;
    }

    const updatedData = {
      name: firstName || lastName ? `${firstName || employee.firstName || ''} ${lastName || employee.lastName || ''}`.trim() : employee.name,
      firstName: firstName || employee.firstName,
      lastName: lastName || employee.lastName,
      email: email || employee.email,
      phone: phone || employee.phone,
      role: roleId || employee.role || employeeRole._id,
      joiningDate: joiningDate || employee.joiningDate,
      profilePhoto,
      image: profilePhoto,
      status: status ? status.toLowerCase() : employee.status
    };

    const updatedEmployee = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    }).populate('role');

    res.status(200).json({
      success: true,
      data: mapUserToEmployee(updatedEmployee)
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
    let { status } = req.body;
    if (status) status = status.toLowerCase();
    
    if (!['active', 'inactive', 'resigned', 'blocked', 'deleted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const employee = await User.findById(req.params.id);
    if (!employee || employee.isDeleted) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    employee.status = status;
    await employee.save();

    res.status(200).json({
      success: true,
      data: mapUserToEmployee(employee)
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
    const employee = await User.findById(req.params.id);
    if (!employee || employee.isDeleted) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    employee.isDeleted = true;
    employee.deletedAt = Date.now();
    employee.status = 'deleted';
    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee soft-deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
