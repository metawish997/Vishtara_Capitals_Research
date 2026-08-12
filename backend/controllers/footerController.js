const FooterBrandSetting = require('../models/footer/FooterBrandSetting');
const FooterColumn = require('../models/footer/FooterColumn');
const FooterLink = require('../models/footer/FooterLink');
const FooterSetting = require('../models/footer/FooterSetting');
const FooterSocialLink = require('../models/footer/FooterSocialLink');

// --- Helper for Full Data ---
exports.getFooterFullData = async (req, res, next) => {
  try {
    const settings = (await FooterSetting.findOne()) || {};
    const brand = (await FooterBrandSetting.findOne()) || {};
    const socials = await FooterSocialLink.find().sort('sort_order');
    const columns = await FooterColumn.find().sort('sort_order');
    
    const menuColumns = [];
    for (const col of columns) {
      const links = await FooterLink.find({ footer_column: col._id }).sort('sort_order');
      menuColumns.push({ ...col._doc, links });
    }

    res.status(200).json({
      success: true,
      data: {
        settings,
        brand,
        socials,
        columns: menuColumns
      }
    });
  } catch (error) { next(error); }
};

// --- Footer Settings ---
exports.updateFooterSettings = async (req, res, next) => {
  try {
    let settings = await FooterSetting.findOne();
    if (!settings) {
      settings = await FooterSetting.create(req.body);
    } else {
      settings = await FooterSetting.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) { next(error); }
};

// --- Branding ---
exports.updateBrandSetting = async (req, res, next) => {
  try {
    let brand = await FooterBrandSetting.findOne();
    if (!brand) {
      brand = await FooterBrandSetting.create(req.body);
    } else {
      brand = await FooterBrandSetting.findByIdAndUpdate(brand._id, req.body, { new: true });
    }
    res.status(200).json({ success: true, data: brand });
  } catch (error) { next(error); }
};

// --- Columns ---
exports.createColumn = async (req, res, next) => {
  try {
    const count = await FooterColumn.countDocuments();
    const column = await FooterColumn.create({ ...req.body, sort_order: count + 1 });
    res.status(201).json({ success: true, data: column });
  } catch (error) { next(error); }
};

exports.updateColumn = async (req, res, next) => {
  try {
    const column = await FooterColumn.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: column });
  } catch (error) { next(error); }
};

exports.deleteColumn = async (req, res, next) => {
  try {
    await FooterLink.deleteMany({ footer_column: req.params.id });
    await FooterColumn.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.reorderColumns = async (req, res, next) => {
  try {
    const { order } = req.body;
    const updates = order.map((id, index) => 
      FooterColumn.findByIdAndUpdate(id, { sort_order: index + 1 })
    );
    await Promise.all(updates);
    res.status(200).json({ success: true });
  } catch (error) { next(error); }
};

// --- Links ---
exports.createLink = async (req, res, next) => {
  try {
    const count = await FooterLink.countDocuments({ footer_column: req.body.footer_column });
    const link = await FooterLink.create({ ...req.body, sort_order: count + 1 });
    res.status(201).json({ success: true, data: link });
  } catch (error) { next(error); }
};

exports.updateLink = async (req, res, next) => {
  try {
    const link = await FooterLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: link });
  } catch (error) { next(error); }
};

exports.deleteLink = async (req, res, next) => {
  try {
    await FooterLink.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.reorderLinks = async (req, res, next) => {
  try {
    const { order } = req.body;
    const updates = order.map((id, index) => 
      FooterLink.findByIdAndUpdate(id, { sort_order: index + 1 })
    );
    await Promise.all(updates);
    res.status(200).json({ success: true });
  } catch (error) { next(error); }
};

exports.moveLink = async (req, res, next) => {
  try {
    const { link_id, new_column_id } = req.body;
    const count = await FooterLink.countDocuments({ footer_column: new_column_id });
    const link = await FooterLink.findByIdAndUpdate(link_id, { 
      footer_column: new_column_id,
      sort_order: count + 1
    }, { new: true });
    res.status(200).json({ success: true, data: link });
  } catch (error) { next(error); }
};

// --- Social Links ---
exports.createSocial = async (req, res, next) => {
  try {
    const count = await FooterSocialLink.countDocuments();
    const social = await FooterSocialLink.create({ ...req.body, sort_order: count + 1 });
    res.status(201).json({ success: true, data: social });
  } catch (error) { next(error); }
};

exports.updateSocial = async (req, res, next) => {
  try {
    const social = await FooterSocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: social });
  } catch (error) { next(error); }
};

exports.deleteSocial = async (req, res, next) => {
  try {
    await FooterSocialLink.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.reorderSocials = async (req, res, next) => {
  try {
    const { order } = req.body;
    const updates = order.map((id, index) => 
      FooterSocialLink.findByIdAndUpdate(id, { sort_order: index + 1 })
    );
    await Promise.all(updates);
    res.status(200).json({ success: true });
  } catch (error) { next(error); }
};
