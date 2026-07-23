const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');

// --- Coupon Controllers ---
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ success: true, count: coupons.length, data: coupons });
  } catch (error) { next(error); }
};

exports.getActiveCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ active: true });
    res.status(200).json({ success: true, count: coupons.length, data: coupons });
  } catch (error) { next(error); }
};

exports.verifyCoupon = async (req, res, next) => {
  try {
    const { code, amount } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found or invalid' });
    }

    if (!coupon.active) {
      return res.status(400).json({ success: false, message: 'This coupon is no longer active' });
    }

    if (coupon.expires_at && new Date() > new Date(coupon.expires_at)) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (coupon.min_amount && amount < coupon.min_amount) {
      return res.status(400).json({ success: false, message: `Minimum amount for this coupon is ₹${coupon.min_amount}` });
    }

    // You could also check global_limit and user limits if needed here
    // For now, let's just calculate discount
    let discount = 0;
    if (coupon.type === 'percent') {
      discount = (amount * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    // Ensure discount doesn't exceed amount
    if (discount > amount) {
      discount = amount;
    }

    res.status(200).json({ 
      success: true, 
      coupon: { code: coupon.code, type: coupon.type, value: coupon.value, min_amount: coupon.min_amount }, 
      discount: discount 
    });
  } catch (error) { next(error); }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) { next(error); }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, data: coupon });
  } catch (error) { next(error); }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    await coupon.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

// --- Coupon Usage Controllers ---
exports.getCouponUsages = async (req, res, next) => {
  try {
    const usages = await CouponUsage.find().populate('coupon').populate('user');
    res.status(200).json({ success: true, data: usages });
  } catch (error) { next(error); }
};
