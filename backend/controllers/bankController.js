const CompanyBankDetail = require('../models/CompanyBankDetail');

exports.getBankDetails = async (req, res, next) => {
  try {
    const details = await CompanyBankDetail.find().sort('sort_order').populate('bank_logo qr_code_image');
    res.status(200).json({ success: true, data: details });
  } catch (error) { next(error); }
};

exports.getBankDetailById = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const detail = await CompanyBankDetail.findById(req.params.id).populate('bank_logo qr_code_image');
    if (!detail) return res.status(404).json({ success: false, message: 'Bank detail not found' });
    res.status(200).json({ success: true, data: detail });
  } catch (error) { 
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createBankDetail = async (req, res) => {
    try {
        const data = { ...req.body };
        if (!data.bank_logo || data.bank_logo === '') delete data.bank_logo;
        if (!data.qr_code_image || data.qr_code_image === '') delete data.qr_code_image;
        
        const newDetail = await CompanyBankDetail.create(data);
        res.status(201).json({ success: true, data: newDetail });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateBankDetail = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.bank_logo === '') data.bank_logo = null;
        if (data.qr_code_image === '') data.qr_code_image = null;

        const updatedDetail = await CompanyBankDetail.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!updatedDetail) {
            return res.status(404).json({ success: false, message: 'Bank detail not found' });
        }
        res.status(200).json({ success: true, data: updatedDetail });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteBankDetail = async (req, res, next) => {
  try {
    const detail = await CompanyBankDetail.findById(req.params.id);
    if (!detail) return res.status(404).json({ success: false, message: 'Bank detail not found' });
    await detail.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
