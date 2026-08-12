const express = require('express');
const router = express.Router();
const {
  getCounters,
  createCounter,
  updateCounter,
  deleteCounter,
  getKeyFeatures,
  createKeyFeatureSection,
  updateKeyFeatureSection,
  deleteKeyFeatureSection,
  createKeyFeatureItem,
  updateKeyFeatureItem,
  deleteKeyFeatureItem,
  getHowItWorks,
  createHowItWorksSection,
  updateHowItWorksSection,
  deleteHowItWorksSection,
  createHowItWorksStep,
  updateHowItWorksStep,
  deleteHowItWorksStep,
  getWhyChooseSections,
  createWhyChooseSection,
  updateWhyChooseSection,
  deleteWhyChooseSection
} = require('../../controllers/home/homeController');

// Counters
router.route('/counters')
  .get(getCounters)
  .post(createCounter);

router.route('/counters/:id')
  .put(updateCounter)
  .delete(deleteCounter);

// Key Features
router.get('/key-features', getKeyFeatures);
router.post('/key-features/section', createKeyFeatureSection);
router.route('/key-features/section/:id')
  .put(updateKeyFeatureSection)
  .delete(deleteKeyFeatureSection);

router.post('/key-features/item', createKeyFeatureItem);
router.route('/key-features/item/:id')
  .put(updateKeyFeatureItem)
  .delete(deleteKeyFeatureItem);

// How It Works
router.get('/how-it-works', getHowItWorks);
router.post('/how-it-works/section', createHowItWorksSection);
router.route('/how-it-works/section/:id')
  .put(updateHowItWorksSection)
  .delete(deleteHowItWorksSection);

router.post('/how-it-works/step', createHowItWorksStep);
router.route('/how-it-works/step/:id')
  .put(updateHowItWorksStep)
  .delete(deleteHowItWorksStep);

// Why Choose Us
router.route('/why-choose-us')
  .get(getWhyChooseSections)
  .post(createWhyChooseSection);

router.route('/why-choose-us/:id')
  .put(updateWhyChooseSection)
  .delete(deleteWhyChooseSection);

module.exports = router;
