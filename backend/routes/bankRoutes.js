const express = require('express');
const router = express.Router();
const {
  getBankDetails,
  getBankDetailById,
  createBankDetail,
  updateBankDetail,
  deleteBankDetail
} = require('../controllers/bankController');

router.get('/', getBankDetails);
router.post('/', createBankDetail);
router.get('/:id', getBankDetailById);
router.put('/:id', updateBankDetail);
router.delete('/:id', deleteBankDetail);

module.exports = router;
