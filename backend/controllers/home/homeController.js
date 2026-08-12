const HomeCounter = require('../../models/home/HomeCounter');
const HomeKeyFeatureSection = require('../../models/home/HomeKeyFeatureSection');
const HomeKeyFeatureItem = require('../../models/home/HomeKeyFeatureItem');
const HowItWorksSection = require('../../models/home/HowItWorksSection');
const HowItWorksStep = require('../../models/home/HowItWorksStep');
const WhyChooseSection = require('../../models/home/WhyChooseSection');

// --- Home Counter Controllers ---
exports.getCounters = async (req, res, next) => {
  try {
    const counters = await HomeCounter.find({ is_active: true }).sort('sort_order');
    res.status(200).json({ success: true, count: counters.length, data: counters });
  } catch (error) { next(error); }
};

exports.createCounter = async (req, res, next) => {
  try {
    const counter = await HomeCounter.create(req.body);
    res.status(201).json({ success: true, data: counter });
  } catch (error) { next(error); }
};

exports.updateCounter = async (req, res, next) => {
  try {
    const counter = await HomeCounter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!counter) return res.status(404).json({ success: false, message: 'Counter not found' });
    res.status(200).json({ success: true, data: counter });
  } catch (error) { next(error); }
};

exports.deleteCounter = async (req, res, next) => {
  try {
    const counter = await HomeCounter.findById(req.params.id);
    if (!counter) return res.status(404).json({ success: false, message: 'Counter not found' });
    await counter.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

// --- Home Key Features Controllers ---
exports.getKeyFeatures = async (req, res, next) => {
  try {
    const sections = await HomeKeyFeatureSection.find().sort('sort_order');
    const data = [];
    for (const sec of sections) {
      const items = await HomeKeyFeatureItem.find({ section: sec._id }).sort('sort_order');
      data.push({ ...sec._doc, items });
    }
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

exports.createKeyFeatureSection = async (req, res, next) => {
  try {
    const section = await HomeKeyFeatureSection.create(req.body);
    res.status(201).json({ success: true, data: section });
  } catch (error) { next(error); }
};

exports.updateKeyFeatureSection = async (req, res, next) => {
  try {
    const section = await HomeKeyFeatureSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: section });
  } catch (error) { next(error); }
};

exports.deleteKeyFeatureSection = async (req, res, next) => {
  try {
    await HomeKeyFeatureSection.findByIdAndDelete(req.params.id);
    await HomeKeyFeatureItem.deleteMany({ section: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.createKeyFeatureItem = async (req, res, next) => {
  try {
    const item = await HomeKeyFeatureItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) { next(error); }
};

exports.updateKeyFeatureItem = async (req, res, next) => {
  try {
    const item = await HomeKeyFeatureItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: item });
  } catch (error) { next(error); }
};

exports.deleteKeyFeatureItem = async (req, res, next) => {
  try {
    await HomeKeyFeatureItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

// --- How It Works Controllers ---
exports.getHowItWorks = async (req, res, next) => {
  try {
    const sections = await HowItWorksSection.find().sort('sort_order');
    const data = [];
    for (const sec of sections) {
      const steps = await HowItWorksStep.find({ section: sec._id }).sort('sort_order');
      data.push({ ...sec._doc, steps });
    }
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

exports.createHowItWorksSection = async (req, res, next) => {
  try {
    const section = await HowItWorksSection.create(req.body);
    res.status(201).json({ success: true, data: section });
  } catch (error) { next(error); }
};

exports.updateHowItWorksSection = async (req, res, next) => {
  try {
    const section = await HowItWorksSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: section });
  } catch (error) { next(error); }
};

exports.deleteHowItWorksSection = async (req, res, next) => {
  try {
    await HowItWorksSection.findByIdAndDelete(req.params.id);
    await HowItWorksStep.deleteMany({ section: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.createHowItWorksStep = async (req, res, next) => {
  try {
    const step = await HowItWorksStep.create(req.body);
    res.status(201).json({ success: true, data: step });
  } catch (error) { next(error); }
};

exports.updateHowItWorksStep = async (req, res, next) => {
  try {
    const step = await HowItWorksStep.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: step });
  } catch (error) { next(error); }
};

exports.deleteHowItWorksStep = async (req, res, next) => {
  try {
    await HowItWorksStep.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

// --- Why Choose Us Controllers ---
exports.getWhyChooseSections = async (req, res, next) => {
  try {
    const sections = await WhyChooseSection.find().sort('sort_order');
    res.status(200).json({ success: true, count: sections.length, data: sections });
  } catch (error) { next(error); }
};

exports.createWhyChooseSection = async (req, res, next) => {
  try {
    const section = await WhyChooseSection.create(req.body);
    res.status(201).json({ success: true, data: section });
  } catch (error) { next(error); }
};

exports.updateWhyChooseSection = async (req, res, next) => {
  try {
    const section = await WhyChooseSection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    res.status(200).json({ success: true, data: section });
  } catch (error) { next(error); }
};

exports.deleteWhyChooseSection = async (req, res, next) => {
  try {
    const section = await WhyChooseSection.findById(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    await section.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
