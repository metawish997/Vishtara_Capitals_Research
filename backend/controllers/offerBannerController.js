const OfferBanner = require('../models/OfferBanner');

exports.getOfferBanners = async (req, res, next) => {
  try {
    const banners = await OfferBanner.find().sort('position').populate('image mobile_image');
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (error) { next(error); }
};

exports.getOfferBannerById = async (req, res, next) => {
  try {
    const banner = await OfferBanner.findById(req.params.id).populate('image mobile_image');
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.status(200).json({ success: true, data: banner });
  } catch (error) { next(error); }
};

exports.createOfferBanner = async (req, res, next) => {
  try {
    const banner = await OfferBanner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateOfferBanner = async (req, res, next) => {
  try {
    const banner = await OfferBanner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('image mobile_image');
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteOfferBanner = async (req, res, next) => {
  try {
    const banner = await OfferBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    await banner.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.trackClick = async (req, res, next) => {
  try {
    const banner = await OfferBanner.findByIdAndUpdate(req.params.id, { $inc: { click_count: 1 } });
    res.status(200).json({ success: true });
  } catch (error) { next(error); }
};
