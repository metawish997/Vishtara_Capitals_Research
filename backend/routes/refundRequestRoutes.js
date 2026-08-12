const express = require('express');
const router = express.Router();
const {
  getRefundRequests,
  createRefundRequest,
  updateRefundRequest,
  deleteRefundRequest
} = require('../controllers/refundRequestController');

router.route('/')
  .get(getRefundRequests)
  .post(createRefundRequest);

router.route('/:id')
  .put(updateRefundRequest)
  .delete(deleteRefundRequest);

module.exports = router;
