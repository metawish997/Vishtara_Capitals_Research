const CoreValueSection = require('../../models/about/CoreValueSection');
const CoreValueCard = require('../../models/about/CoreValueCard');
const Mission = require('../../models/about/Mission');
const WhyPlatformSection = require('../../models/about/WhyPlatformSection');
const WhyPlatformContent = require('../../models/about/WhyPlatformContent');

// --- Core Values ---
exports.getCoreValues = async (req, res, next) => {
  try {
    const section = await CoreValueSection.findOne();
    const values = await CoreValueCard.find().sort('sort_order');
    res.status(200).json({ success: true, data: { section, values } });
  } catch (error) { next(error); }
};

exports.updateCoreValueSection = async (req, res, next) => {
  try {
    let section = await CoreValueSection.findOne();
    if (!section) {
      section = await CoreValueSection.create(req.body);
    } else {
      section = await CoreValueSection.findByIdAndUpdate(section._id, req.body, { new: true });
    }
    res.status(200).json({ success: true, data: section });
  } catch (error) { next(error); }
};

exports.createCoreValueCard = async (req, res, next) => {
  try {
    const card = await CoreValueCard.create(req.body);
    res.status(201).json({ success: true, data: card });
  } catch (error) { next(error); }
};

exports.updateCoreValueCard = async (req, res, next) => {
  try {
    const card = await CoreValueCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: card });
  } catch (error) { next(error); }
};

exports.deleteCoreValueCard = async (req, res, next) => {
  try {
    await CoreValueCard.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

// --- Mission ---
exports.getMission = async (req, res, next) => {
  try {
    const mission = await Mission.findOne();
    res.status(200).json({ success: true, data: mission });
  } catch (error) { next(error); }
};

exports.updateMission = async (req, res, next) => {
  try {
    let mission = await Mission.findOne();
    if (!mission) {
      mission = await Mission.create(req.body);
    } else {
      mission = await Mission.findByIdAndUpdate(mission._id, req.body, { new: true });
    }
    res.status(200).json({ success: true, data: mission });
  } catch (error) { next(error); }
};

// --- Why Platform ---
exports.getWhyPlatform = async (req, res, next) => {
  try {
    const sections = await WhyPlatformSection.find().populate('image');
    const fullSections = [];
    for (const s of sections) {
      const contents = await WhyPlatformContent.find({ section_id: s._id }).sort('sort_order');
      fullSections.push({ ...s._doc, contents });
    }
    res.status(200).json({ success: true, data: fullSections });
  } catch (error) { next(error); }
};

exports.upsertWhyPlatformSection = async (req, res, next) => {
  try {
    const { id, badge, heading, subheading, closing_text, is_active, content } = req.body;
    let section;
    if (id) {
      section = await WhyPlatformSection.findByIdAndUpdate(id, { badge, heading, subheading, closing_text, is_active }, { new: true });
    } else {
      section = await WhyPlatformSection.create({ badge, heading, subheading, closing_text, is_active });
    }

    // Update or Create content (assuming one main content for now as per Blade)
    let sectionContent = await WhyPlatformContent.findOne({ section_id: section._id });
    if (!sectionContent) {
      await WhyPlatformContent.create({ section_id: section._id, content });
    } else {
      await WhyPlatformContent.findByIdAndUpdate(sectionContent._id, { content });
    }

    res.status(200).json({ success: true, data: section });
  } catch (error) { next(error); }
};

exports.deleteWhyPlatformSection = async (req, res, next) => {
  try {
    await WhyPlatformContent.deleteMany({ section_id: req.params.id });
    await WhyPlatformSection.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
