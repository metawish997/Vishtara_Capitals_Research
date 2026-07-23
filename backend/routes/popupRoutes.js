const express = require('express');
const router = express.Router();
const {
  getPopups,
  getActivePopup,
  getPopup,
  createPopup,
  updatePopup,
  deletePopup
} = require('../controllers/popupController');

router.route('/')
  .get(getPopups)
  .post(createPopup);

router.get('/active', getActivePopup);

router.route('/:id')
  .get(getPopup)
  .put(updatePopup)
  .delete(deletePopup);

module.exports = router;
