const express = require('express');
const router = express.Router();
const {
  getPolicies,
  getPolicyById,
  createPolicyMaster,
  deletePolicyMaster,
  getPolicyContent,
  updatePolicyContent
} = require('../../controllers/policy/policyController');

router.route('/masters')
  .get(getPolicies)
  .post(createPolicyMaster);

router.route('/masters/:id')
  .get(getPolicyById)
  .delete(deletePolicyMaster)
  .put(updatePolicyContent);

router.get('/content/:slug', getPolicyContent);

module.exports = router;
