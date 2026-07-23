const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomer,
  deleteCustomer,
  grantDemo,
  toggleDemoStatus
} = require('../controllers/customerController');
const { allocateService } = require('../controllers/admin/manualAllocationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Ensure admin/protected access

router.route('/')
  .get(getCustomers);

router.route('/:id')
  .get(getCustomer)
  .delete(deleteCustomer);

router.post('/:id/grant-demo', grantDemo);
router.post('/:id/toggle-demo-status', toggleDemoStatus);
router.post('/:id/manual-allocation', allocateService);

module.exports = router;
