const HeroBanner = require('../../models/hero/HeroBanner');

exports.getHeroBanners = async (req, res, next) => {
  try {
    const banners = await HeroBanner.find().sort('sort_order').populate('background_image mobile_background_image');
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (error) { next(error); }
};

exports.createHeroBanner = async (req, res, next) => {
  try {
    const banner = await HeroBanner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (error) { next(error); }
};

exports.updateHeroBanner = async (req, res, next) => {
  try {
    const banner = await HeroBanner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.status(200).json({ success: true, data: banner });
  } catch (error) { next(error); }
};

exports.deleteHeroBanner = async (req, res, next) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    await banner.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
