const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  changeStatus,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middlewares/authMiddleware');
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');

router.route('/')
  .get(getEmployees)
  .post(protect, upload.single('profilePhoto'), handleUploadError, createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(protect, upload.single('profilePhoto'), handleUploadError, updateEmployee)
  .delete(protect, deleteEmployee);

router.patch('/:id/status', protect, changeStatus);

module.exports = router;
