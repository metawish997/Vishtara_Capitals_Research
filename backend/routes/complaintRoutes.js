const express = require('express');
const router = express.Router();
const {
  getComplaintData,
  getComplaintDataById,
  createComplaintData,
  updateComplaintData,
  deleteComplaintData,
  getComplaintRecords,
  getComplaintRecordById,
  createComplaintRecord,
  updateComplaintRecord,
  deleteComplaintRecord
} = require('../controllers/complaintController');

// Data Routes
router.route('/data')
  .get(getComplaintData)
  .post(createComplaintData);

router.route('/data/:id')
  .get(getComplaintDataById)
  .put(updateComplaintData)
  .delete(deleteComplaintData);

// Record Routes
router.route('/records')
  .get(getComplaintRecords)
  .post(createComplaintRecord);

router.route('/records/:id')
  .get(getComplaintRecordById)
  .put(updateComplaintRecord)
  .delete(deleteComplaintRecord);

module.exports = router;
