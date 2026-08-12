const News = require('../models/News');
const NewsCategory = require('../models/NewsCategory');

// --- News Category Controllers ---
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await NewsCategory.find().sort('order_priority');
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await NewsCategory.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
    try {
      const category = await NewsCategory.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      res.status(200).json({ success: true, data: category });
    } catch (error) { next(error); }
};
  
exports.deleteCategory = async (req, res, next) => {
    try {
      const category = await NewsCategory.findById(req.params.id);
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      await category.deleteOne();
      res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};
  
exports.updateCategoryStatus = async (req, res, next) => {
      try {
        const category = await NewsCategory.findByIdAndUpdate(
          req.params.id,
          { is_active: req.body.is_active },
          { new: true, runValidators: true }
        );
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, data: category });
      } catch (error) { next(error); }
};

// --- News Controllers ---
exports.getNews = async (req, res, next) => {
  try {
    const news = await News.find()
        .populate('category', 'name color_code')
        .populate('image')
        .sort('-createdAt');
    res.status(200).json({ success: true, count: news.length, data: news });
  } catch (error) { next(error); }
};

exports.getSingleNews = async (req, res, next) => {
  try {
    const news = await News.findOne({ slug: req.params.slug }).populate('category').populate('image');
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    
    // Increment view count
    news.view_count += 1;
    await news.save();

    res.status(200).json({ success: true, data: news });
  } catch (error) { next(error); }
};

exports.createNews = async (req, res, next) => {
  try {
    if (req.body.status === 'published' && !req.body.published_at) {
      req.body.published_at = Date.now();
    }
    const news = await News.create(req.body);
    res.status(201).json({ success: true, data: news });
  } catch (error) { next(error); }
};

exports.updateNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.status(200).json({ success: true, data: news });
  } catch (error) { next(error); }
};

exports.deleteNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    await news.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.updateNewsStatus = async (req, res, next) => {
    try {
      const news = await News.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
      if (!news) return res.status(404).json({ success: false, message: 'News not found' });
      res.status(200).json({ success: true, data: news });
    } catch (error) { next(error); }
};
