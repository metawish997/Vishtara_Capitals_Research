const Campaign = require('../models/Campaign');
const MasterNotification = require('../models/notification/MasterNotification');

// @desc    Get all campaigns
// @route   GET /api/v1/campaigns
// @access  Public/Admin
exports.getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find().sort('-createdAt').populate('image');
    res.status(200).json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single campaign
// @route   GET /api/v1/campaigns/:id
// @access  Public/Admin
exports.getCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('image');
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new campaign
// @route   POST /api/v1/campaigns
// @access  Private/Admin
exports.createCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.create(req.body);

    // Create a global notification for this campaign
    await MasterNotification.create({
      type: 'campaign',
      severity: campaign.type === 'offer' ? 'success' : 'info',
      title: campaign.title,
      message: campaign.description,
      is_global: true,
      data: { campaignId: String(campaign._id) }
    });

    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

// @desc    Update campaign
// @route   PUT /api/v1/campaigns/:id
// @access  Private/Admin
exports.updateCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete campaign
// @route   DELETE /api/v1/campaigns/:id
// @access  Private/Admin
exports.deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    await campaign.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
