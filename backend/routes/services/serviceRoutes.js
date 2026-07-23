const express = require('express');
const router = express.Router();
const {
  getServicePlans,
  createServicePlan,
  getServicePlanById,
  updateServicePlan,
  deleteServicePlan,
  getPlanDurations,
  createPlanDuration,
  getDurationFeatures,
  createPlanFeature
} = require('../../controllers/services/serviceController');

// Service Plan Routes
router.route('/')
  .get(getServicePlans)
  .post(createServicePlan);

router.route('/:id')
  .get(getServicePlanById)
  .put(updateServicePlan)
  .delete(deleteServicePlan);

// Service Plan Duration Routes
router.get('/:planId/durations', getPlanDurations);
router.post('/durations', createPlanDuration);

// Service Plan Feature Routes
router.get('/durations/:durationId/features', getDurationFeatures);
router.post('/features', createPlanFeature);

module.exports = router;
