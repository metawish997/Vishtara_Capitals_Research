const Marquee = require('../models/Marquee');

exports.getMarquees = async (req, res, next) => {
  try {
    const marquees = await Marquee.find().sort('display_order');
    res.status(200).json({ success: true, count: marquees.length, data: marquees });
  } catch (error) { next(error); }
};

exports.createMarquee = async (req, res, next) => {
  try {
    const marquee = await Marquee.create(req.body);
    res.status(201).json({ success: true, data: marquee });
  } catch (error) { next(error); }
};

exports.updateMarquee = async (req, res, next) => {
  try {
    const marquee = await Marquee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!marquee) return res.status(404).json({ success: false, message: 'Marquee not found' });
    res.status(200).json({ success: true, data: marquee });
  } catch (error) { next(error); }
};

exports.deleteMarquee = async (req, res, next) => {
  try {
    const marquee = await Marquee.findById(req.params.id);
    if (!marquee) return res.status(404).json({ success: false, message: 'Marquee not found' });
    await marquee.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
