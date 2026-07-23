const express = require('express');
const router = express.Router();
const {
  getCoupons,
  getActiveCoupons,
  verifyCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponUsages
} = require('../controllers/couponController');

// Coupon Routes
router.get('/active', getActiveCoupons);
router.post('/verify', verifyCoupon);

router.route('/')
  .get(getCoupons)
  .post(createCoupon);

router.route('/:id')
  .put(updateCoupon)
  .delete(deleteCoupon);

// Usage Routes
router.get('/usages', getCouponUsages);

module.exports = router;
