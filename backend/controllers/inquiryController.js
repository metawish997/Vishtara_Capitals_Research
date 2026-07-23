const Inquiry = require('../models/Inquiry');

exports.getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort('-createdAt').populate('user', 'name email');
    res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) { next(error); }
};

exports.createInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, data: inquiry });
  } catch (error) { next(error); }
};

exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    await inquiry.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    
    inquiry.status = status;
    await inquiry.save();
    res.status(200).json({ success: true, data: inquiry });
  } catch (error) { next(error); }
};
