const Popup = require('../models/Popup');

exports.getPopups = async (req, res, next) => {
  try {
    const popups = await Popup.find().sort('-priority').populate('image');
    res.status(200).json({ success: true, count: popups.length, data: popups });
  } catch (error) { next(error); }
};

exports.getActivePopup = async (req, res, next) => {
  try {
    const popup = await Popup.findOne({ status: 'active' }).sort('-priority').populate('image');
    res.status(200).json({ success: true, data: popup });
  } catch (error) { next(error); }
};

exports.getPopup = async (req, res, next) => {
  try {
    const popup = await Popup.findById(req.params.id).populate('image');
    if (!popup) return res.status(404).json({ success: false, message: 'Popup not found' });
    res.status(200).json({ success: true, data: popup });
  } catch (error) { next(error); }
};

exports.createPopup = async (req, res, next) => {
  try {
    const popup = await Popup.create(req.body);
    res.status(201).json({ success: true, data: popup });
  } catch (error) { next(error); }
};

exports.updatePopup = async (req, res, next) => {
  try {
    const popup = await Popup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!popup) return res.status(404).json({ success: false, message: 'Popup not found' });
    res.status(200).json({ success: true, data: popup });
  } catch (error) { next(error); }
};

exports.deletePopup = async (req, res, next) => {
  try {
    const popup = await Popup.findById(req.params.id);
    if (!popup) return res.status(404).json({ success: false, message: 'Popup not found' });
    await popup.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
