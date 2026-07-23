const express = require('express');
const router = express.Router();
const {
  getRiskRewardMasters,
  createRiskRewardMaster,
  updateRiskRewardMaster,
  deleteRiskRewardMaster
} = require('../controllers/riskRewardController');

router.route('/')
  .get(getRiskRewardMasters)
  .post(createRiskRewardMaster);

router.route('/:id')
  .put(updateRiskRewardMaster)
  .delete(deleteRiskRewardMaster);

module.exports = router;
