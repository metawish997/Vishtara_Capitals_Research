const Role = require('../models/Role');
const Permission = require('../models/Permission');

// @desc    Get all roles
// @route   GET /api/v1/roles
// @access  Private/Admin
exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new role
// @route   POST /api/v1/roles
// @access  Private/Admin
exports.createRole = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-');
    
    const role = await Role.create({
      name,
      slug,
      permissions,
      is_locked: false
    });

    res.status(201).json({
      success: true,
      data: role
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update role
// @route   PUT /api/v1/roles/:id
// @access  Private/Admin
exports.updateRole = async (req, res, next) => {
  try {
    let role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    if (role.is_locked) {
        // Prevent changing name/slug for locked roles
        delete req.body.name;
        delete req.body.slug;
    } else if (req.body.name) {
        req.body.slug = req.body.name.toLowerCase().replace(/ /g, '-');
    }

    role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete role
// @route   DELETE /api/v1/roles/:id
// @access  Private/Admin
exports.deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    if (role.is_locked) {
      return res.status(403).json({ 
        success: false, 
        message: 'This is a system role and cannot be deleted.' 
      });
    }

    await role.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all permissions
// @route   GET /api/v1/roles/permissions
// @access  Private/Admin
exports.getPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({
      success: true,
      count: permissions.length,
      data: permissions
    });
  } catch (error) {
    next(error);
  }
};
