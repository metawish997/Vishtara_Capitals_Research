const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  getNews,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews,
  updateNewsStatus
} = require('../controllers/newsController');

// Category Routes
router.route('/categories')
  .get(getCategories)
  .post(createCategory);

router.route('/categories/:id')
  .put(updateCategory)
  .delete(deleteCategory);

router.put('/categories/:id/status', updateCategoryStatus);

// News Routes
router.route('/')
  .get(getNews)
  .post(createNews);

router.get('/:slug', getSingleNews);

router.route('/:id')
  .put(updateNews)
  .delete(deleteNews);

router.put('/:id/status', updateNewsStatus);

module.exports = router;
