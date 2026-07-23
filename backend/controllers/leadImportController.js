const XLSX = require('xlsx');
const multer = require('multer');
const Lead = require('../models/Lead');
const LeadSource = require('../models/LeadSource');
const LeadCategory = require('../models/LeadCategory');
const LeadStatus = require('../models/LeadStatus');
const LeadActivityLog = require('../models/LeadActivityLog');
const LeadImport = require('../models/LeadImport');
const Employee = require('../models/Employee');
const Designation = require('../models/Designation');
const Role = require('../models/Role');

// ─── Multer: memory storage (no disk write) ───────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/octet-stream',
      'text/plain'
    ];
    const ext = file.originalname.toLowerCase().split('.').pop();
    if (['csv', 'xlsx', 'xls'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, XLSX, and XLS files are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max
});

exports.uploadMiddleware = upload.single('file');

// ─── Helper: resolve Employee for logged-in user ──────────────────────────────
const getEmployeeForUser = async (user) => {
  if (!user) return null;
  let employee = await Employee.findOne({ email: user.email });
  if (!employee) {
    employee = await Employee.findOne();
    if (!employee) {
      let designation = await Designation.findOne();
      if (!designation) designation = await Designation.create({ name: 'Admin', level: 1 });
      let role = await Role.findOne({ slug: 'employee' });
      if (!role) role = await Role.create({ name: 'Employee', slug: 'employee' });
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

// ─── Helper: find or create LeadSource by name ───────────────────────────────
const findOrCreateSource = async (name) => {
  if (!name || !name.trim()) return null;
  const trimmed = name.trim();
  let source = await LeadSource.findOne({ name: new RegExp(`^${trimmed}$`, 'i') });
  if (!source) {
    source = await LeadSource.create({ name: trimmed, status: true });
  }
  return source._id;
};

// ─── Helper: find or create LeadCategory by name ─────────────────────────────
const findOrCreateCategory = async (name) => {
  if (!name || !name.trim()) return null;
  const trimmed = name.trim();
  let category = await LeadCategory.findOne({ name: new RegExp(`^${trimmed}$`, 'i') });
  if (!category) {
    // Assign a random color for auto-created categories
    const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    category = await LeadCategory.create({ name: trimmed, color, status: true });
  }
  return category._id;
};

// ─── Helper: find employee by full name ──────────────────────────────────────
const findEmployeeByName = async (fullName) => {
  if (!fullName || !fullName.trim()) return null;
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  const employee = await Employee.findOne({
    firstName: new RegExp(`^${firstName}$`, 'i'),
    ...(lastName ? { lastName: new RegExp(`^${lastName}$`, 'i') } : {})
  });
  return employee ? employee._id : null;
};

// ─── Helper: parse file buffer into rows ─────────────────────────────────────
const parseFileBuffer = (buffer, originalName) => {
  const ext = originalName.toLowerCase().split('.').pop();
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  // header: 1 returns array of arrays; we use sheet_to_json with header row mapping
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  return rows;
};

// ─── Background Processor for Leads ──────────────────────────────────────────
const processRowsInBackground = async (importRecordId, rows, employee, defaultStatus) => {
  try {
    const totalRows = rows.length;
    let importedRows = 0;
    let duplicateRows = 0;
    let failedRows = 0;
    let unassignedRows = 0;
    const warnings = [];

    const normalizeRow = (row) => {
      const out = {};
      for (const key of Object.keys(row)) {
        out[key.toLowerCase().trim()] = String(row[key] || '').trim();
      }
      return out;
    };

    for (let i = 0; i < rows.length; i++) {
      const raw = normalizeRow(rows[i]);

      const phone = raw['phone'] || raw['mobile'] || raw['mobile number'] || raw['phonenumber'] || '';
      const name = raw['name'] || raw['full name'] || raw['fullname'] || '';
      const email = raw['email'] || raw['email address'] || '';
      const ownerName = raw['owner'] || raw['owner name'] || raw['ownername'] || '';
      const sourceName = raw['source'] || raw['lead source'] || raw['leadsource'] || '';
      const categoryName = raw['category'] || raw['lead category'] || raw['leadcategory'] || '';

      if (!phone) {
        failedRows++;
        warnings.push(`Row ${i + 2}: Skipped — phone number is missing.`);
      } else {
        const existing = await Lead.findOne({ mobileNumber: phone });
        if (existing) {
          duplicateRows++;
          warnings.push(`Row ${i + 2}: Duplicate — phone ${phone} already exists (${existing.leadCode}).`);
        } else {
          let ownerLeadId = null;
          if (ownerName) {
            ownerLeadId = await findEmployeeByName(ownerName);
            if (!ownerLeadId) warnings.push(`Row ${i + 2}: Owner "${ownerName}" not found — unassigned.`);
          }
          const sourceId = await findOrCreateSource(sourceName);
          const categoryId = await findOrCreateCategory(categoryName);
          try {
            const lead = new Lead({
              fullName: name || phone,
              mobileNumber: phone,
              email: email || null,
              leadSource: sourceId,
              leadCategory: categoryId,
              status: defaultStatus ? defaultStatus._id : null,
              ownerLead: ownerLeadId,
              readStatus: 'Unread',
              commentsCount: 0
            });
            await lead.save();
            await LeadActivityLog.create({
              leadId: lead._id,
              employeeId: employee ? employee._id : null,
              activityType: 'Lead Imported',
              description: `Lead imported via CSV/Excel upload by ${employee ? employee.firstName + ' ' + employee.lastName : 'System'}`
            });
            importedRows++;
            if (!ownerLeadId) unassignedRows++;
          } catch (rowErr) {
            failedRows++;
            warnings.push(`Row ${i + 2}: Failed to save — ${rowErr.message}`);
          }
        }
      }

      // Update progress every 10 rows or at the very end
      if (i % 10 === 0 || i === rows.length - 1) {
        await LeadImport.findByIdAndUpdate(importRecordId, {
          importedRows,
          duplicateRows,
          failedRows,
          unassignedRows,
          warnings,
          progress: Math.floor(((i + 1) / totalRows) * 100)
        });
      }
    }

    // Final update
    await LeadImport.findByIdAndUpdate(importRecordId, {
      status: 'Completed',
      progress: 100
    });
  } catch (error) {
    console.error('Background Import Error:', error);
    await LeadImport.findByIdAndUpdate(importRecordId, {
      status: 'Failed',
      warnings: [`Fatal error during processing: ${error.message}`]
    });
  }
};

// ─── @desc    Upload and process CSV/Excel file ───────────────────────────────
// ─── @route   POST /api/lead-imports/upload ───────────────────────────────────
exports.uploadLeads = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const employee = await getEmployeeForUser(req.user);
    let defaultStatus = await LeadStatus.findOne({ name: /^New$/i }) || await LeadStatus.findOne();

    let rows;
    try {
      rows = parseFileBuffer(req.file.buffer, req.file.originalname);
    } catch (parseErr) {
      return res.status(400).json({ success: false, message: `File parsing failed: ${parseErr.message}` });
    }

    if (!rows || rows.length === 0) return res.status(400).json({ success: false, message: 'File is empty.' });

    // Save initial import record
    const importRecord = await LeadImport.create({
      fileName: req.file.originalname,
      totalRows: rows.length,
      importedRows: 0,
      duplicateRows: 0,
      failedRows: 0,
      unassignedRows: 0,
      uploadedBy: employee ? employee._id : null,
      status: 'Processing',
      progress: 0,
      warnings: []
    });

    // Fire off the background process asynchronously
    processRowsInBackground(importRecord._id, rows, employee, defaultStatus);

    res.status(202).json({
      success: true,
      message: 'Import started in background.',
      jobId: importRecord._id
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get import progress by Job ID ───────────────────────────────────
// ─── @route   GET /api/lead-imports/progress/:jobId ───────────────────────────
exports.getImportProgress = async (req, res, next) => {
  try {
    const record = await LeadImport.findById(req.params.jobId);
    if (!record) return res.status(404).json({ success: false, message: 'Import job not found.' });
    
    res.status(200).json({
      success: true,
      data: {
        status: record.status,
        progress: record.progress,
        importedRows: record.importedRows,
        failedRows: record.failedRows,
        duplicateRows: record.duplicateRows,
        unassignedRows: record.unassignedRows,
        totalRows: record.totalRows,
        warnings: record.warnings
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get import history (paginated) ──────────────────────────────────
// ─── @route   GET /api/lead-imports/history ──────────────────────────────────
exports.getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await LeadImport.countDocuments();
    const records = await LeadImport.find()
      .populate({ path: 'uploadedBy', select: 'firstName lastName' })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get single import record (for View Summary modal) ───────────────
// ─── @route   GET /api/lead-imports/history/:id ──────────────────────────────
exports.getImportById = async (req, res, next) => {
  try {
    const record = await LeadImport.findById(req.params.id)
      .populate({ path: 'uploadedBy', select: 'firstName lastName' });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Import record not found.' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get unassigned leads (ownerLead = null) with filters ─────────────
// ─── @route   GET /api/lead-imports/unassigned-leads ─────────────────────────
exports.getUnassigned = async (req, res, next) => {
  try {
    let query = { ownerLead: null };

    // Search
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [
        { leadCode: regex },
        { fullName: regex },
        { mobileNumber: regex },
        { email: regex }
      ];
    }

    // Filters
    if (req.query.leadSource && req.query.leadSource !== 'All') {
      query.leadSource = req.query.leadSource;
    }
    if (req.query.leadCategory && req.query.leadCategory !== 'All') {
      query.leadCategory = req.query.leadCategory;
    }
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(new Date(req.query.endDate).setHours(23, 59, 59, 999))
      };
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('status')
      .populate('leadSource')
      .populate('leadCategory')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Assign owner to a lead ─────────────────────────────────────────
// ─── @route   PATCH /api/leads/:id/assign-owner ──────────────────────────────
exports.assignOwner = async (req, res, next) => {
  try {
    const employee = await getEmployeeForUser(req.user);
    const isAdminRole = req.user.role && (req.user.role.slug === 'admin' || req.user.role.slug === 'super_admin' || req.user.role === 'admin' || req.user.role === 'super admin');
    const isAdminDesignation = employee && employee.designationId && (employee.designationId.name.toLowerCase().includes('admin') || employee.designationId.name.toLowerCase() === 'super admin');
    const isAdmin = isAdminRole || isAdminDesignation;

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'Only admins can assign lead owners.' });
    }

    const { ownerLead } = req.body;
    if (!ownerLead) {
      return res.status(400).json({ success: false, message: 'ownerLead (Employee ID) is required.' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    const newOwner = await Employee.findById(ownerLead);

    lead.ownerLead = ownerLead;
    lead.readStatus = 'Unread'; // assignment resets read status
    await lead.save();

    await LeadActivityLog.create({
      leadId: lead._id,
      employeeId: employee ? employee._id : null,
      activityType: 'Lead Assigned',
      description: `Owner assigned: NULL → ${newOwner ? newOwner.firstName + ' ' + newOwner.lastName : 'Unknown'}`,
      oldValue: null,
      newValue: ownerLead
    });

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};
