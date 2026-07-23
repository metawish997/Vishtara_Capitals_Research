const express = require('express');
const router = express.Router();
const {
  getHeaderSettings,
  updateHeaderSettings,
  getHeaderMenus,
  createHeaderMenu,
  updateHeaderMenu,
  deleteHeaderMenu,
  toggleHeaderMenu,
  reorderHeaderMenus
} = require('../controllers/headerController');

// Settings Routes
router.route('/settings')
  .get(getHeaderSettings)
  .post(updateHeaderSettings) // Will create or update
  .put(updateHeaderSettings);

// Menu Routes
router.route('/menus')
  .get(getHeaderMenus)
  .post(createHeaderMenu);

router.route('/menus/:id')
  .put(updateHeaderMenu)
  .patch(updateHeaderMenu)
  .delete(deleteHeaderMenu);

router.patch('/menus/:id/toggle', toggleHeaderMenu);
router.post('/menus/reorder', reorderHeaderMenus);

module.exports = router;
