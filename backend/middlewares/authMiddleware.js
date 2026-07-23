const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    // Check if user still exists
    let isEmployee = false;
    let user = await User.findById(decoded.id).populate({
      path: 'role',
      populate: { path: 'permissions' }
    });

    if (!user) {
      user = await Employee.findById(decoded.id).populate({
        path: 'roleId',
        populate: { path: 'permissions' }
      }).populate('designationId');
      isEmployee = true;
    }

    if (!user) {
      console.log('User/Employee not found in DB for ID:', decoded.id, 'Token:', token);
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
    }

    if (user.isDeleted || user.status === 'deleted' || user.status === 'Inactive' || user.status === 'Resigned') {
      return res.status(401).json({ success: false, message: 'ACCOUNT_DELETED' });
    }

    // Normalize role so that req.user.role works for employees too
    if (isEmployee) {
      user.role = user.roleId;
    }

    req.user = user;
    req.isEmployee = isEmployee;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};
exports.optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    // Check if user still exists
    let user = await User.findById(decoded.id);

    if (!user) {
      user = await Employee.findById(decoded.id);
    }

    if (user && !user.isDeleted && user.status !== 'deleted' && user.status !== 'Inactive' && user.status !== 'Resigned') {
      req.user = user;
    }
    next();
  } catch (err) {
    next();
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: 'Access denied. No role assigned.' });
    }

    // Super Admin bypasses role check
    if (req.user.role.slug === 'super_admin' || req.user.role.slug === 'superadmin') {
      return next();
    }

    if (!roles.includes(req.user.role.slug)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role '${req.user.role.slug}' is not authorized to access this route` 
      });
    }

    next();
  };
};
