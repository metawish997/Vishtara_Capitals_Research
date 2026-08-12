const express = require('express');
const router = express.Router();
const {
  getReviews,
  getApprovedReviews,
  createReview,
  updateReviewStatus,
  deleteReview
} = require('../controllers/reviewController');

router.route('/')
  .get(getReviews)
  .post(createReview);

router.get('/approved', getApprovedReviews);

router.route('/:id')
  .put(updateReviewStatus)
  .delete(deleteReview);

module.exports = router;
