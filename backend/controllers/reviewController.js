const Review = require('../models/Review');

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort('-createdAt').populate('user', 'name email');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) { next(error); }
};

exports.getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 1 }).sort('-createdAt');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) { next(error); }
};

exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) { next(error); }
};

exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    
    review.status = status;
    if (status === 1) review.approved_at = Date.now();
    
    await review.save();
    res.status(200).json({ success: true, data: review });
  } catch (error) { next(error); }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
