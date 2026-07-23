const RiskRewardMaster = require('../models/RiskRewardMaster');

exports.getRiskRewardMasters = async (req, res, next) => {
  try {
    const masters = await RiskRewardMaster.find();
    res.status(200).json({ success: true, count: masters.length, data: masters });
  } catch (error) { next(error); }
};

exports.createRiskRewardMaster = async (req, res, next) => {
  try {
    const master = await RiskRewardMaster.create(req.body);
    res.status(201).json({ success: true, data: master });
  } catch (error) { next(error); }
};

exports.updateRiskRewardMaster = async (req, res, next) => {
  try {
    const master = await RiskRewardMaster.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!master) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: master });
  } catch (error) { next(error); }
};

exports.deleteRiskRewardMaster = async (req, res, next) => {
  try {
    const master = await RiskRewardMaster.findById(req.params.id);
    if (!master) return res.status(404).json({ success: false, message: 'Record not found' });
    await master.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
