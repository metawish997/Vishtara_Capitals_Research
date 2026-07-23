const Faq = require('../models/Faq');

exports.getFaqs = async (req, res, next) => {
  try {
    const faqs = await Faq.find().sort('sort_order');
    res.status(200).json({ success: true, data: faqs });
  } catch (error) { next(error); }
};

exports.createFaq = async (req, res, next) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (error) { next(error); }
};

exports.updateFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.status(200).json({ success: true, data: faq });
  } catch (error) { next(error); }
};

exports.deleteFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    await faq.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
