const express = require('express');
const router = express.Router();
const {
  getCoreValues,
  updateCoreValueSection,
  createCoreValueCard,
  updateCoreValueCard,
  deleteCoreValueCard,
  getMission,
  updateMission,
  getWhyPlatform,
  upsertWhyPlatformSection,
  deleteWhyPlatformSection
} = require('../controllers/about/aboutController');

// Core Values
router.get('/core-values', getCoreValues);
router.post('/core-values/section', updateCoreValueSection);
router.post('/core-values/card', createCoreValueCard);
router.put('/core-values/card/:id', updateCoreValueCard);
router.delete('/core-values/card/:id', deleteCoreValueCard);

// Mission
router.get('/mission', getMission);
router.post('/mission', updateMission);

// Why Platform
router.get('/why-platform', getWhyPlatform);
router.post('/why-platform', upsertWhyPlatformSection);
router.delete('/why-platform/:id', deleteWhyPlatformSection);

module.exports = router;
