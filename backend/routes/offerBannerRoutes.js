const express = require('express');
const router = express.Router();
const {
  getOfferBanners,
  getOfferBannerById,
  createOfferBanner,
  updateOfferBanner,
  deleteOfferBanner,
  trackClick
} = require('../controllers/offerBannerController');

router.route('/')
  .get(getOfferBanners)
  .post(createOfferBanner);

router.route('/:id')
  .get(getOfferBannerById)
  .put(updateOfferBanner)
  .delete(deleteOfferBanner);

router.post('/:id/click', trackClick);

module.exports = router;
