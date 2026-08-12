const Designation = require('../models/Designation');

// @desc    Get all designations
// @route   GET /api/designations
// @access  Private
exports.getDesignations = async (req, res, next) => {
  try {
    const designations = await Designation.find().sort({ level: 1 });
    res.status(200).json({
      success: true,
      count: designations.length,
      data: designations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new designation
// @route   POST /api/designations
// @access  Private/Admin
exports.createDesignation = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    // Automatically place it at the bottom
    const lastDesignation = await Designation.findOne().sort({ level: -1 });
    const level = lastDesignation ? lastDesignation.level + 1 : 1;

    const designation = await Designation.create({
      name,
      description,
      status,
      level,
    });

    res.status(201).json({
      success: true,
      data: designation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update designation
// @route   PUT /api/designations/:id
// @access  Private/Admin
exports.updateDesignation = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    let designation = await Designation.findById(req.params.id);

    if (!designation) {
      return res.status(404).json({ success: false, message: 'Designation not found' });
    }

    designation = await Designation.findByIdAndUpdate(
      req.params.id,
      { name, description, status },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: designation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete designation
// @route   DELETE /api/designations/:id
// @access  Private/Admin
exports.deleteDesignation = async (req, res, next) => {
  try {
    const designation = await Designation.findById(req.params.id);

    if (!designation) {
      return res.status(404).json({ success: false, message: 'Designation not found' });
    }

    await designation.deleteOne();

    // Recalculate levels for all remaining designations to prevent gaps
    const remaining = await Designation.find().sort({ level: 1 });
    for (let i = 0; i < remaining.length; i++) {
      remaining[i].level = i + 1;
      await remaining[i].save();
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder designations
// @route   PATCH /api/designations/reorder
// @access  Private/Admin
exports.reorderDesignations = async (req, res, next) => {
  try {
    const { designationIds } = req.body;

    if (!designationIds || !Array.isArray(designationIds)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of designationIds',
      });
    }

    // Loop through array and update levels sequentially
    for (let i = 0; i < designationIds.length; i++) {
      await Designation.findByIdAndUpdate(designationIds[i], { level: i + 1 });
    }

    res.status(200).json({
      success: true,
      message: 'Designation hierarchy updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
