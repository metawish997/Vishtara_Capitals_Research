const ContactDetail = require('../models/ContactDetail');

exports.getContactDetails = async (req, res, next) => {
  try {
    const details = await ContactDetail.find();
    // Return the first one if it exists
    res.status(200).json({ success: true, data: details[0] || null });
  } catch (error) { next(error); }
};

exports.createContactDetail = async (req, res, next) => {
  try {
    // Check if one already exists
    const existing = await ContactDetail.findOne();
    if (existing) {
        return res.status(400).json({ success: false, message: 'Contact details already exist. Please update the existing one.' });
    }
    const detail = await ContactDetail.create(req.body);
    res.status(201).json({ success: true, data: detail });
  } catch (error) { next(error); }
};

exports.updateContactDetail = async (req, res, next) => {
  try {
    const detail = await ContactDetail.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!detail) return res.status(404).json({ success: false, message: 'Detail not found' });
    res.status(200).json({ success: true, data: detail });
  } catch (error) { next(error); }
};

exports.deleteContactDetail = async (req, res, next) => {
  try {
    const detail = await ContactDetail.findByIdAndDelete(req.params.id);
    if (!detail) return res.status(404).json({ success: false, message: 'Detail not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
