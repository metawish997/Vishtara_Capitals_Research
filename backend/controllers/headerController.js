const HeaderMenu = require('../models/header/HeaderMenu');
const HeaderSetting = require('../models/header/HeaderSetting');

// --- Header Setting (Singleton-like behavior) ---
exports.getHeaderSettings = async (req, res, next) => {
  try {
    let settings = await HeaderSetting.findOne();
    if (!settings) {
        // Return default or empty if not found
        return res.status(200).json({ success: true, data: {} });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) { next(error); }
};

exports.updateHeaderSettings = async (req, res, next) => {
  try {
    let settings = await HeaderSetting.findOne();
    if (!settings) {
      settings = await HeaderSetting.create(req.body);
    } else {
      settings = await HeaderSetting.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true
      });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) { next(error); }
};

// --- Header Menu Controllers ---
exports.getHeaderMenus = async (req, res, next) => {
  try {
    const menus = await HeaderMenu.find({ status: true }).sort('order_no');
    res.status(200).json({ success: true, count: menus.length, data: menus });
  } catch (error) { next(error); }
};

exports.createHeaderMenu = async (req, res, next) => {
  try {
    const menu = await HeaderMenu.create(req.body);
    res.status(201).json({ success: true, data: menu });
  } catch (error) { next(error); }
};

exports.updateHeaderMenu = async (req, res, next) => {
  try {
    const menu = await HeaderMenu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!menu) return res.status(404).json({ success: false, message: 'Menu item not found' });
    res.status(200).json({ success: true, data: menu });
  } catch (error) { next(error); }
};

exports.deleteHeaderMenu = async (req, res, next) => {
  try {
    const menu = await HeaderMenu.findById(req.params.id);
    if (!menu) return res.status(404).json({ success: false, message: 'Menu item not found' });
    await menu.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.toggleHeaderMenu = async (req, res, next) => {
  try {
    const menu = await HeaderMenu.findById(req.params.id);
    if (!menu) return res.status(404).json({ success: false, message: 'Menu item not found' });
    
    menu.show_in_header = !menu.show_in_header;
    await menu.save();
    
    res.status(200).json({ success: true, data: menu });
  } catch (error) { next(error); }
};

exports.reorderHeaderMenus = async (req, res, next) => {
  try {
    const { order } = req.body; // Array of IDs in order
    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ success: false, message: 'Order array required' });
    }

    const updates = order.map((id, index) => 
      HeaderMenu.findByIdAndUpdate(id, { order_no: index + 1 })
    );

    await Promise.all(updates);
    res.status(200).json({ success: true, message: 'Menus reordered' });
  } catch (error) { next(error); }
};
