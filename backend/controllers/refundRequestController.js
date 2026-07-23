const RefundRequest = require('../models/RefundRequest');

exports.getRefundRequests = async (req, res, next) => {
  try {
    const refunds = await RefundRequest.find()
      .sort('-createdAt')
      .populate('user', 'name email')
      .populate('invoice', 'invoice_number amount');
    res.status(200).json({ success: true, count: refunds.length, data: refunds });
  } catch (error) { next(error); }
};

exports.createRefundRequest = async (req, res, next) => {
  try {
    const refund = await RefundRequest.create(req.body);
    res.status(201).json({ success: true, data: refund });
  } catch (error) { next(error); }
};

exports.updateRefundRequest = async (req, res, next) => {
  try {
    const refund = await RefundRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!refund) return res.status(404).json({ success: false, message: 'Refund request not found' });
    res.status(200).json({ success: true, data: refund });
  } catch (error) { next(error); }
};

exports.deleteRefundRequest = async (req, res, next) => {
  try {
    const refund = await RefundRequest.findById(req.params.id);
    if (!refund) return res.status(404).json({ success: false, message: 'Refund request not found' });
    await refund.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
