const express = require('express');
const router = express.Router();
const {
  getContactDetails,
  createContactDetail,
  updateContactDetail,
  deleteContactDetail
} = require('../controllers/contactController');

router.get('/', getContactDetails);
router.post('/', createContactDetail);
router.put('/:id', updateContactDetail);
router.delete('/:id', deleteContactDetail);

module.exports = router;
