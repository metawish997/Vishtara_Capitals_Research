const Invoice = require('../../models/user/Invoice');

exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find().sort('-invoice_date').populate('user', 'name email');
    res.status(200).json({ success: true, count: invoices.length, data: invoices });
  } catch (error) { next(error); }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('user').populate('coupon');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.status(200).json({ success: true, data: invoice });
  } catch (error) { next(error); }
};

exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) { next(error); }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    await invoice.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
