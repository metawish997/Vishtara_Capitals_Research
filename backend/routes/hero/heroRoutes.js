const express = require('express');
const router = express.Router();
const {
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner
} = require('../../controllers/hero/heroController');

router.route('/')
  .get(getHeroBanners)
  .post(createHeroBanner);

router.route('/:id')
  .put(updateHeroBanner)
  .delete(deleteHeroBanner);

module.exports = router;
