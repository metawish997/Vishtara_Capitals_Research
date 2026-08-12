const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  updateBlogStatus
} = require('../controllers/blogController');

// Category Routes
router.route('/categories')
  .get(getCategories)
  .post(createCategory);

router.route('/categories/:id')
  .put(updateCategory)
  .delete(deleteCategory);

router.put('/categories/:id/status', updateCategoryStatus);

// Blog Routes
router.route('/')
  .get(getBlogs)
  .post(createBlog);

router.route('/:id')
  .put(updateBlog)
  .delete(deleteBlog);

router.put('/:id/status', updateBlogStatus);

router.get('/slug/:slug', getBlogBySlug);

module.exports = router;
