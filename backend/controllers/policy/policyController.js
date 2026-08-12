const PolicyMaster = require('../../models/policy/PolicyMaster');
const PolicyContent = require('../../models/policy/PolicyContent');

// --- Policy Master Controllers ---
exports.getPolicies = async (req, res, next) => {
  try {
    const policies = await PolicyMaster.find();
    // Fetch latest version for each policy
    const data = await Promise.all(policies.map(async (p) => {
        const latest = await PolicyContent.findOne({ policy_master: p._id, is_active: true });
        return { ...p._doc, latest_content: latest };
    }));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

exports.getPolicyById = async (req, res, next) => {
    try {
        const policy = await PolicyMaster.findById(req.params.id);
        if (!policy) return res.status(404).json({ success: false, message: 'Policy not found' });
        const latest = await PolicyContent.findOne({ policy_master: policy._id, is_active: true });
        res.status(200).json({ success: true, data: { ...policy._doc, latest_content: latest } });
    } catch (error) { next(error); }
};

exports.createPolicyMaster = async (req, res, next) => {
  try {
    const { name, title, description, content, updates_summary } = req.body;
    
    // 1. Create Master
    const master = await PolicyMaster.create({ name, title, description });
    
    // 2. Create Initial Content
    await PolicyContent.create({
        policy_master: master._id,
        content,
        updates_summary: updates_summary || 'Initial Version',
        version_number: 1,
        is_active: true
    });

    res.status(201).json({ success: true, data: master });
  } catch (error) { 
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deletePolicyMaster = async (req, res, next) => {
    try {
        const master = await PolicyMaster.findById(req.params.id);
        if (!master) return res.status(404).json({ success: false, message: 'Policy not found' });
        
        // Delete all associated content
        await PolicyContent.deleteMany({ policy_master: master._id });
        await master.deleteOne();
        
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};

// --- Policy Content Controllers ---
exports.getPolicyContent = async (req, res, next) => {
  try {
    const master = await PolicyMaster.findOne({ slug: req.params.slug });
    if (!master) return res.status(404).json({ success: false, message: 'Policy not found' });
    
    const content = await PolicyContent.findOne({ policy_master: master._id, is_active: true });
    res.status(200).json({ success: true, data: content });
  } catch (error) { next(error); }
};

exports.updatePolicyContent = async (req, res, next) => {
  try {
    const { name, title, description, content, updates_summary } = req.body;
    const masterId = req.params.id;

    // 1. Update Master Fields
    const master = await PolicyMaster.findByIdAndUpdate(masterId, { name, title, description }, { new: true });
    if (!master) return res.status(404).json({ success: false, message: 'Master not found' });

    // 2. Handle Versioning
    const currentActive = await PolicyContent.findOne({ policy_master: masterId, is_active: true });
    
    // Deactivate current
    if (currentActive) {
        currentActive.is_active = false;
        await currentActive.save();
    }

    // 3. Create New Version
    const newVersion = await PolicyContent.create({
        policy_master: masterId,
        content,
        updates_summary,
        version_number: currentActive ? currentActive.version_number + 1 : 1,
        is_active: true
    });

    res.status(200).json({ success: true, data: { master, content: newVersion } });
  } catch (error) { 
    res.status(400).json({ success: false, error: error.message });
  }
};
