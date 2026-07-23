const express = require('express');
const router = express.Router();
const {
  getFooterFullData,
  updateFooterSettings,
  updateBrandSetting,
  createColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  moveLink,
  createSocial,
  updateSocial,
  deleteSocial,
  reorderSocials
} = require('../controllers/footerController');

// Global Data
router.get('/full', getFooterFullData);

// Settings
router.post('/settings', updateFooterSettings);

// Brand
router.post('/brand', updateBrandSetting);

// Columns
router.post('/columns', createColumn);
router.patch('/columns/:id', updateColumn);
router.delete('/columns/:id', deleteColumn);
router.post('/columns/reorder', reorderColumns);

// Links
router.post('/links', createLink);
router.patch('/links/:id', updateLink);
router.delete('/links/:id', deleteLink);
router.post('/links/reorder', reorderLinks);
router.post('/links/move', moveLink);

// Social
router.post('/social', createSocial);
router.patch('/social/:id', updateSocial);
router.delete('/social/:id', deleteSocial);
router.post('/social/reorder', reorderSocials);

module.exports = router;
