const Blog = require('../models/Blog');
const BlogCategory = require('../models/BlogCategory');

// --- Category Controllers ---
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await BlogCategory.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await BlogCategory.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await BlogCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, data: category });
  } catch (error) { next(error); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await BlogCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    await category.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.updateCategoryStatus = async (req, res, next) => {
    try {
      const category = await BlogCategory.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      res.status(200).json({ success: true, data: category });
    } catch (error) { next(error); }
};

// --- Blog Controllers ---
exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
        .populate('category')
        .populate('image')
        .sort('-createdAt');
    res.status(200).json({ success: true, data: blogs });
  } catch (error) { next(error); }
};

exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
        .populate('category')
        .populate('image');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

exports.createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    await blog.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.updateBlogStatus = async (req, res, next) => {
    try {
      const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
      if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
      res.status(200).json({ success: true, data: blog });
    } catch (error) { next(error); }
};
