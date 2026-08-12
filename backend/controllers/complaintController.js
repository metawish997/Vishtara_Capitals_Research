const ComplaintData = require('../models/ComplaintData');
const ComplaintRecord = require('../models/ComplaintRecord');

// --- Complaint Data Controllers ---
exports.getComplaintData = async (req, res, next) => {
  try {
    const data = await ComplaintData.find().sort('sno');
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

exports.getComplaintDataById = async (req, res, next) => {
  try {
    const data = await ComplaintData.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Complaint data not found' });
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

exports.createComplaintData = async (req, res, next) => {
  try {
    const data = await ComplaintData.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateComplaintData = async (req, res, next) => {
  try {
    const data = await ComplaintData.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!data) return res.status(404).json({ success: false, message: 'Complaint data not found' });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteComplaintData = async (req, res, next) => {
  try {
    const data = await ComplaintData.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Complaint data not found' });
    await data.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

// --- Complaint Record Controllers ---
exports.getComplaintRecords = async (req, res, next) => {
  try {
    const records = await ComplaintRecord.find().sort('-complaint_date');
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

exports.getComplaintRecordById = async (req, res, next) => {
  try {
    const record = await ComplaintRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Complaint record not found' });
    res.status(200).json({ success: true, data: record });
  } catch (error) { next(error); }
};

exports.createComplaintRecord = async (req, res, next) => {
  try {
    if (req.body.complaint_date) {
        const date = new Date(req.body.complaint_date);
        if (!isNaN(date.getTime())) {
            req.body.complaint_month = date.getMonth() + 1;
            req.body.complaint_year = date.getFullYear();
        }
    }
    
    const record = await ComplaintRecord.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (error) { next(error); }
};

exports.updateComplaintRecord = async (req, res, next) => {
  try {
    if (req.body.complaint_date) {
      const date = new Date(req.body.complaint_date);
      if (!isNaN(date.getTime())) {
          req.body.complaint_month = date.getMonth() + 1;
          req.body.complaint_year = date.getFullYear();
      }
    }
    
    const record = await ComplaintRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
  } catch (error) { next(error); }
};

exports.deleteComplaintRecord = async (req, res, next) => {
  try {
    const record = await ComplaintRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    await record.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

