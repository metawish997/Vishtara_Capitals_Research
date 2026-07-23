const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoice,
  createInvoice,
  deleteInvoice
} = require('../../controllers/user/invoiceController');

router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.route('/:id')
  .get(getInvoice)
  .delete(deleteInvoice);

module.exports = router;
