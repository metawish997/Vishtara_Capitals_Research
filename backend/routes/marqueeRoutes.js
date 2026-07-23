const express = require('express');
const router = express.Router();
const {
  getMarquees,
  createMarquee,
  updateMarquee,
  deleteMarquee
} = require('../controllers/marqueeController');

router.route('/')
  .get(getMarquees)
  .post(createMarquee);

router.route('/:id')
  .put(updateMarquee)
  .delete(deleteMarquee);

module.exports = router;
