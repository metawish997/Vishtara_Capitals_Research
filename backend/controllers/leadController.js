const Lead = require('../models/Lead');
const LeadSource = require('../models/LeadSource');
const LeadCategory = require('../models/LeadCategory');
const LeadStatus = require('../models/LeadStatus');
const LeadComment = require('../models/LeadComment');
const LeadActivityLog = require('../models/LeadActivityLog');
const Employee = require('../models/Employee');
const Designation = require('../models/Designation');
const Role = require('../models/Role');
const { getDownlineIds } = require('../utils/hierarchy/employeeHierarchy');

/**
 * Helper to retrieve or dynamically provision an Employee document for the logged-in User.
 * This ensures audit logs and comments always have a valid reference to an Employee.
 */
const getEmployeeForUser = async (user) => {
  if (!user) return null;
  let employee = await Employee.findOne({ email: user.email }).populate('designationId');
  if (!employee) {
    employee = await Employee.findOne();
    if (!employee) {
      let designation = await Designation.findOne();
      if (!designation) {
        designation = await Designation.create({ name: 'Admin', level: 1 });
      }
      let role = await Role.findOne({ slug: 'employee' });
      if (!role) {
        role = await Role.create({ name: 'Employee', slug: 'employee' });
      }
      employee = await Employee.create({
        firstName: user.name?.split(' ')[0] || 'Admin',
        lastName: user.name?.split(' ')[1] || 'System',
        email: user.email || 'admin@example.com',
        phone: user.phone || '9999999999',
        password: 'password123',
        designationId: designation._id,
        roleId: role._id,
        joiningDate: new Date(),
        status: 'Active'
      });
    }
  }
  return employee;
};

// @desc    Get all leads with search, filtering, and pagination
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res, next) => {
  try {
    let query = {};
    const employee = await getEmployeeForUser(req.user);

    // Check if user is admin by Role or by Employee Designation
    const isAdminRole = req.user.role && (req.user.role.slug === 'admin' || req.user.role.slug === 'super_admin' || req.user.role === 'admin' || req.user.role === 'super admin');
    const isAdminDesignation = employee && employee.designationId && (employee.designationId.name.toLowerCase().includes('admin') || employee.designationId.name.toLowerCase() === 'super admin');
    const isAdmin = isAdminRole || isAdminDesignation;

    if (!isAdmin && employee) {
      // Employees see their own leads and leads of all their subordinates
      const downlineIds = await getDownlineIds(employee._id);
      query.ownerLead = { $in: downlineIds };
    } else {
      // Default Admin behavior: Hide unassigned leads from main Leads page
      query.ownerLead = {
        $exists: true,
        $ne: null
      };
    }

    // Search filter: Lead Code, Full Name, Mobile, Email
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { leadCode: searchRegex },
        { fullName: searchRegex },
        { mobileNumber: searchRegex },
        { email: searchRegex }
      ];
    }

    const mongoose = require('mongoose');

    // Helper to process array or comma-separated string, and map to actual ObjectIds
    const processFilter = (val) => {
      const arr = Array.isArray(val) ? val : val.split(',');
      return arr.filter(id => {
        if (id === 'Read' || id === 'Unread') return true; // Allow enum strings
        return mongoose.Types.ObjectId.isValid(id.trim());
      }).map(id => {
        if (id === 'Read' || id === 'Unread') return id;
        return new mongoose.Types.ObjectId(id.trim());
      });
    };

    // Status filter
    if (req.query.status && req.query.status !== 'All') {
      query.status = { $in: processFilter(req.query.status) };
    }

    // Lead Source filter
    if (req.query.leadSource && req.query.leadSource !== 'All') {
      query.leadSource = { $in: processFilter(req.query.leadSource) };
    }

    // Lead Category filter
    if (req.query.leadCategory && req.query.leadCategory !== 'All') {
      query.leadCategory = { $in: processFilter(req.query.leadCategory) };
    }

    // Specific Owner filter (overrides default)
    if (req.query.ownerLead && req.query.ownerLead !== 'All') {
      if (isAdmin) {
        query.ownerLead = { $in: processFilter(req.query.ownerLead) };
      }
    }

    // Read Status filter
    if (req.query.readStatus && req.query.readStatus !== 'All') {
      query.readStatus = { $in: processFilter(req.query.readStatus) };
    }

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(
          new Date(req.query.endDate).setHours(23, 59, 59, 999)
        )
      };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = [];
    sort.push(['readStatus', -1]);
    if (sortBy !== 'readStatus') {
      sort.push([sortBy, sortOrder]);
    }

    const total = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .populate('status')
      .populate('leadSource')
      .populate('leadCategory')
      .populate('ownerLead')
      .sort(sort)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: leads
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get single lead details and mark as read
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('status')
      .populate('leadSource')
      .populate('leadCategory')
      .populate('ownerLead');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const employee = await getEmployeeForUser(req.user);

    // If unread, mark as read and log the transition
    if (lead.readStatus === 'Unread') {
      lead.readStatus = 'Read';
      await lead.save();

      await LeadActivityLog.create({
        leadId: lead._id,
        employeeId: employee ? employee._id : null,
        activityType: 'Read Status Changed',
        description: 'Read status changed: Unread → Read',
        oldValue: 'Unread',
        newValue: 'Read'
      });
    }

    // Log the viewed event
    await LeadActivityLog.create({
      leadId: lead._id,
      employeeId: employee ? employee._id : null,
      activityType: 'Lead Viewed',
      description: `Lead viewed by ${employee ? employee.firstName + ' ' + employee.lastName : 'System'}`
    });

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res, next) => {
  try {
    const { fullName, mobileNumber, email, leadSource, leadCategory, status, ownerLead, initialComment } = req.body;

    if (!fullName || !mobileNumber) {
      return res.status(400).json({ success: false, message: 'Full Name and Mobile Number are required.' });
    }

    const employee = await getEmployeeForUser(req.user);

    const lead = new Lead({
      fullName,
      mobileNumber,
      email: email || null,
      leadSource: leadSource || null,
      leadCategory: leadCategory || null,
      status: status || null,
      ownerLead: ownerLead || null,
      readStatus: 'Unread',
      commentsCount: initialComment ? 1 : 0
    });

    await lead.save();

    // Log "Lead Created"
    await LeadActivityLog.create({
      leadId: lead._id,
      employeeId: employee ? employee._id : null,
      activityType: 'Lead Created',
      description: `Lead created by ${employee ? employee.firstName + ' ' + employee.lastName : 'System'}`
    });

    // Handle initial comment if provided
    if (initialComment) {
      await LeadComment.create({
        leadId: lead._id,
        employeeId: employee ? employee._id : null,
        comment: initialComment
      });

      await LeadActivityLog.create({
        leadId: lead._id,
        employeeId: employee ? employee._id : null,
        activityType: 'Comment Added',
        description: `Initial comment added: "${initialComment}"`
      });
    }

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead details
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res, next) => {
  try {
    const { fullName, mobileNumber, email, leadSource, leadCategory, status, ownerLead } = req.body;

    let lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const employee = await getEmployeeForUser(req.user);

    // Track specific updates for activity logging
    // 1. Status change audit
    if (status && status.toString() !== lead.status?.toString()) {
      const oldStatus = await LeadStatus.findById(lead.status);
      const newStatus = await LeadStatus.findById(status);
      await LeadActivityLog.create({
        leadId: lead._id,
        employeeId: employee ? employee._id : null,
        activityType: 'Status Changed',
        description: `Status changed: ${oldStatus ? oldStatus.name : 'Unassigned'} → ${newStatus ? newStatus.name : 'Unassigned'}`,
        oldValue: lead.status,
        newValue: status
      });
      lead.status = status;
    }

    // 2. Owner change audit
    if (ownerLead && ownerLead.toString() !== lead.ownerLead?.toString()) {
      const oldOwner = await Employee.findById(lead.ownerLead);
      const newOwner = await Employee.findById(ownerLead);
      await LeadActivityLog.create({
        leadId: lead._id,
        employeeId: employee ? employee._id : null,
        activityType: 'Owner Changed',
        description: `Owner changed: ${oldOwner ? oldOwner.firstName + ' ' + oldOwner.lastName : 'Unassigned'} → ${newOwner ? newOwner.firstName + ' ' + newOwner.lastName : 'Unassigned'}`,
        oldValue: lead.ownerLead,
        newValue: ownerLead
      });
      lead.ownerLead = ownerLead;
      lead.readStatus = 'Unread'; // Owner switch resets to Unread
    }

    // General updates
    lead.fullName = fullName || lead.fullName;
    lead.mobileNumber = mobileNumber || lead.mobileNumber;
    lead.email = email !== undefined ? email : lead.email;
    lead.leadSource = leadSource || lead.leadSource;
    lead.leadCategory = leadCategory || lead.leadCategory;

    await lead.save();

    // Log update event
    await LeadActivityLog.create({
      leadId: lead._id,
      employeeId: employee ? employee._id : null,
      activityType: 'Lead Updated',
      description: `Lead info updated by ${employee ? employee.firstName + ' ' + employee.lastName : 'System'}`
    });

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead and clean up logs
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res, next) => {
  try {
    const employee = await getEmployeeForUser(req.user);
    const isAdminRole = req.user.role && (req.user.role.slug === 'admin' || req.user.role.slug === 'super_admin' || req.user.role === 'admin' || req.user.role === 'super admin');
    const isAdminDesignation = employee && employee.designationId && (employee.designationId.name.toLowerCase().includes('admin') || employee.designationId.name.toLowerCase() === 'super admin');
    const isAdmin = isAdminRole || isAdminDesignation;

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'Only admins can delete leads.' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Delete comments and logs associated with the lead
    await LeadComment.deleteMany({ leadId: lead._id });
    await LeadActivityLog.deleteMany({ leadId: lead._id });

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead and related histories deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Patch lead status
// @route   PATCH /api/leads/:id/status
// @access  Private
exports.changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // status ID
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const employee = await getEmployeeForUser(req.user);
    const oldStatus = await LeadStatus.findById(lead.status);
    const newStatus = await LeadStatus.findById(status);

    lead.status = status;
    await lead.save();

    await LeadActivityLog.create({
      leadId: lead._id,
      employeeId: employee ? employee._id : null,
      activityType: 'Status Changed',
      description: `Status changed: ${oldStatus ? oldStatus.name : 'Unassigned'} → ${newStatus ? newStatus.name : 'Unassigned'}`,
      oldValue: oldStatus ? oldStatus._id : null,
      newValue: newStatus ? newStatus._id : null
    });

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Patch lead owner
// @route   PATCH /api/leads/:id/owner
// @access  Private
exports.changeOwner = async (req, res, next) => {
  try {
    const employee = await getEmployeeForUser(req.user);
    const isAdminRole = req.user.role && (req.user.role.slug === 'admin' || req.user.role.slug === 'super_admin' || req.user.role === 'admin' || req.user.role === 'super admin');
    const isAdminDesignation = employee && employee.designationId && (employee.designationId.name.toLowerCase().includes('admin') || employee.designationId.name.toLowerCase() === 'super admin');
    const isAdmin = isAdminRole || isAdminDesignation;

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'Only admins can change lead owners.' });
    }

    const { ownerLead } = req.body; // Employee ID
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    const oldOwner = await Employee.findById(lead.ownerLead);
    const newOwner = await Employee.findById(ownerLead);

    lead.ownerLead = ownerLead;
    lead.readStatus = 'Unread'; // Owner switch resets to Unread
    await lead.save();

    await LeadActivityLog.create({
      leadId: lead._id,
      employeeId: employee ? employee._id : null,
      activityType: 'Owner Changed',
      description: `Owner changed: ${oldOwner ? oldOwner.firstName + ' ' + oldOwner.lastName : 'Unassigned'} → ${newOwner ? newOwner.firstName + ' ' + newOwner.lastName : 'Unassigned'}`,
      oldValue: oldOwner ? oldOwner._id : null,
      newValue: newOwner ? newOwner._id : null
    });

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Patch read status
// @route   PATCH /api/leads/:id/read-status
// @access  Private
exports.changeReadStatus = async (req, res, next) => {
  try {
    const { readStatus } = req.body; // "Read" or "Unread"
    if (!['Read', 'Unread'].includes(readStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid readStatus value.' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const employee = await getEmployeeForUser(req.user);
    const oldVal = lead.readStatus;
    lead.readStatus = readStatus;
    await lead.save();

    await LeadActivityLog.create({
      leadId: lead._id,
      employeeId: employee ? employee._id : null,
      activityType: 'Read Status Changed',
      description: `Read status changed: ${oldVal} → ${readStatus}`,
      oldValue: oldVal,
      newValue: readStatus
    });

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a lead
// @route   GET /api/leads/:id/comments
// @access  Private
exports.getComments = async (req, res, next) => {
  try {
    const comments = await LeadComment.find({ leadId: req.params.id })
      .populate({
        path: 'employeeId',
        select: 'firstName lastName profilePhoto'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a lead
// @route   POST /api/leads/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const employee = await getEmployeeForUser(req.user);
    if (!employee) {
      return res.status(400).json({ success: false, message: 'Employee profile not found for logged in user.' });
    }

    // Add Comment document
    const leadComment = await LeadComment.create({
      leadId: lead._id,
      employeeId: employee._id,
      comment
    });

    // Update lead attributes: increment commentsCount & reset status to Unread
    lead.commentsCount += 1;
    lead.readStatus = 'Unread';
    await lead.save();

    // Log the "Comment Added" activity
    await LeadActivityLog.create({
      leadId: lead._id,
      employeeId: employee._id,
      activityType: 'Comment Added',
      description: `Comment added by ${employee.firstName} ${employee.lastName}: "${comment.substring(0, 30)}${comment.length > 30 ? '...' : ''}"`
    });

    res.status(201).json({
      success: true,
      data: leadComment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get activity logs for a lead
// @route   GET /api/leads/:id/activity
// @access  Private
exports.getActivity = async (req, res, next) => {
  try {
    const logs = await LeadActivityLog.find({ leadId: req.params.id })
      .populate({
        path: 'employeeId',
        select: 'firstName lastName'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get metadata (dropdown contents) for Lead filtering & forms
// @route   GET /api/leads/meta/dropdowns
// @access  Private
exports.getLeadMetadata = async (req, res, next) => {
  try {
    const employee = await getEmployeeForUser(req.user);
    const isAdminRole = req.user.role && (req.user.role.slug === 'admin' || req.user.role.slug === 'super_admin' || req.user.role === 'admin' || req.user.role === 'super admin');
    const isAdminDesignation = employee && employee.designationId && (employee.designationId.name.toLowerCase().includes('admin') || employee.designationId.name.toLowerCase() === 'super admin');
    const isAdmin = isAdminRole || isAdminDesignation;

    let employeeQuery = { isDeleted: { $ne: true }, status: 'Active' };

    if (!isAdmin && employee) {
      const downlineIds = await getDownlineIds(employee._id);
      employeeQuery._id = { $in: downlineIds };
    }

    const sources = await LeadSource.find({ status: true }).sort({ name: 1 });
    const categories = await LeadCategory.find({ status: true }).sort({ name: 1 });
    const statuses = await LeadStatus.find({ status: true }).sort({ name: 1 });
    const employees = await Employee.find(employeeQuery).sort({ firstName: 1, lastName: 1 });

    res.status(200).json({
      success: true,
      data: {
        sources,
        categories,
        statuses,
        employees
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead dashboard cards summary counts
// @route   GET /api/leads/meta/dashboard
// @access  Private
exports.getLeadDashboard = async (req, res, next) => {
  try {
    const employee = await getEmployeeForUser(req.user);

    // Check if user is admin by Role or by Employee Designation
    const isAdminRole = req.user.role && (req.user.role.slug === 'admin' || req.user.role.slug === 'super_admin' || req.user.role === 'admin' || req.user.role === 'super admin');
    const isAdminDesignation = employee && employee.designationId && (employee.designationId.name.toLowerCase().includes('admin') || employee.designationId.name.toLowerCase() === 'super admin');
    const isAdmin = isAdminRole || isAdminDesignation;

    let baseQuery = {};

    if (!isAdmin && employee) {
      const downlineIds = await getDownlineIds(employee._id);
      baseQuery.ownerLead = { $in: downlineIds };
    }

    const total = await Lead.countDocuments(baseQuery);
    const unread = await Lead.countDocuments({ ...baseQuery, readStatus: 'Unread' });
    const read = await Lead.countDocuments({ ...baseQuery, readStatus: 'Read' });

    // Dynamic checks for statuses
    const newStatus = await LeadStatus.findOne({ name: /New/i });
    const interestedStatus = await LeadStatus.findOne({ name: /Interested/i });
    const convertedStatus = await LeadStatus.findOne({ name: /Converted/i });
    const lostStatus = await LeadStatus.findOne({ name: /Lost/i });

    const newLeads = newStatus ? await Lead.countDocuments({ ...baseQuery, status: newStatus._id }) : 0;
    const interestedLeads = interestedStatus ? await Lead.countDocuments({ ...baseQuery, status: interestedStatus._id }) : 0;
    const convertedLeads = convertedStatus ? await Lead.countDocuments({ ...baseQuery, status: convertedStatus._id }) : 0;
    const lostLeads = lostStatus ? await Lead.countDocuments({ ...baseQuery, status: lostStatus._id }) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        unread,
        read,
        newLeads,
        interestedLeads,
        convertedLeads,
        lostLeads
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign owner to multiple leads
// @route   PATCH /api/leads/bulk/assign
// @access  Private
exports.bulkAssignOwner = async (req, res, next) => {
  try {
    const employee = await getEmployeeForUser(req.user);
    const isAdminRole = req.user.role && (req.user.role.slug === 'admin' || req.user.role.slug === 'super_admin' || req.user.role === 'admin' || req.user.role === 'super admin');
    const isAdminDesignation = employee && employee.designationId && (employee.designationId.name.toLowerCase().includes('admin') || employee.designationId.name.toLowerCase() === 'super admin');
    const isAdmin = isAdminRole || isAdminDesignation;

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'Only admins can bulk assign leads.' });
    }

    const { leadIds, ownerLead } = req.body;
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ success: false, message: 'leadIds array is required.' });
    }
    if (!ownerLead) {
      return res.status(400).json({ success: false, message: 'ownerLead (Employee ID) is required.' });
    }

    const newOwner = await Employee.findById(ownerLead);

    const leads = await Lead.find({ _id: { $in: leadIds } });
    if (leads.length === 0) {
      return res.status(404).json({ success: false, message: 'No valid leads found.' });
    }

    const activityLogs = [];

    for (const lead of leads) {
      const oldOwner = lead.ownerLead ? await Employee.findById(lead.ownerLead) : null;
      lead.ownerLead = ownerLead;
      lead.readStatus = 'Unread';
      await lead.save();

      activityLogs.push({
        leadId: lead._id,
        employeeId: employee ? employee._id : null,
        activityType: 'Owner Changed',
        description: `Owner changed (Bulk): ${oldOwner ? oldOwner.firstName + ' ' + oldOwner.lastName : 'Unassigned'} → ${newOwner ? newOwner.firstName + ' ' + newOwner.lastName : 'Unknown'}`,
        oldValue: oldOwner ? oldOwner._id : null,
        newValue: ownerLead
      });
    }

    if (activityLogs.length > 0) {
      await LeadActivityLog.insertMany(activityLogs);
    }

    res.status(200).json({ success: true, message: `Successfully assigned ${leads.length} leads.` });
  } catch (error) {
    next(error);
  }
};
