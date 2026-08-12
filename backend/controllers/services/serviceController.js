const ServicePlan = require('../../models/services/ServicePlan');
const ServicePlanDuration = require('../../models/services/ServicePlanDuration');
const ServicePlanFeature = require('../../models/services/ServicePlanFeature');

// --- Service Plan Controllers ---
// exports.getServicePlans = async (req, res, next) => {
//   try {
//     const plans = await ServicePlan.find().sort('sort_order');
//     res.status(200).json({ success: true, count: plans.length, data: plans });
//   } catch (error) { next(error); }
// };

// --- Updated Service Plan Controller ---
exports.getServicePlans = async (req, res, next) => {
  try {
    // 1. Fetch all plans and use .lean() to allow adding custom properties
    const plans = await ServicePlan.find().sort('sort_order').lean();

    // 2. Loop through each plan to attach its durations and features
    for (let i = 0; i < plans.length; i++) {
        // Find durations for this specific plan
        const durations = await ServicePlanDuration.find({ service_plan: plans[i]._id }).lean();
        
        // For each duration, find its specific features
        for (let j = 0; j < durations.length; j++) {
            durations[j].features = await ServicePlanFeature.find({ 
                service_plan_duration: durations[j]._id 
            });
        }
        
        // Attach the compiled durations array to the plan object
        plans[i].durations = durations;
    }

    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (error) { 
    next(error); 
  }
};

exports.createServicePlan = async (req, res, next) => {
  try {
    const { durations, ...planData } = req.body;
    
    // 1. Create Main Plan
    const plan = await ServicePlan.create(planData);

    // 2. Create Durations if any
    if (durations && durations.length > 0) {
      for (const d of durations) {
        const duration = await ServicePlanDuration.create({
          ...d,
          service_plan: plan._id
        });

        // 3. Create Features for each duration
        if (d.features && d.features.length > 0) {
          for (const f of d.features) {
            await ServicePlanFeature.create({
              ...f,
              service_plan_duration: duration._id
            });
          }
        }
      }
    }

    res.status(201).json({ success: true, data: plan });
  } catch (error) { next(error); }
};

exports.updateServicePlan = async (req, res, next) => {
  try {
    const { durations, ...planData } = req.body;
    console.log("UPDATE SERVICE PLAN PAYLOAD:", req.body);
    
    // 1. Update Main Plan
    const plan = await ServicePlan.findByIdAndUpdate(req.params.id, planData, { new: true });
    
    // 2. Manage Durations
    if (durations) {
      const existingDurations = await ServicePlanDuration.find({ service_plan: plan._id });
      console.log("EXISTING DURATIONS:", existingDurations.map(d => d.duration_months));
      const newDurationIds = [];
      
      for (const d of durations) {
        console.log("PROCESSING DURATION:", d);
        let duration = existingDurations.find(ex => ex.duration_months === d.duration_months);
        
        if (duration) {
          duration.duration = d.duration;
          duration.duration_type = d.duration_type;
          duration.price = d.price;
          await duration.save();
          console.log("UPDATED EXISTING DURATION:", duration._id);
        } else {
          duration = await ServicePlanDuration.create({
            ...d,
            service_plan: plan._id
          });
          console.log("CREATED NEW DURATION:", duration._id);
        }
        
        newDurationIds.push(duration._id.toString());
        
        // Delete existing features for this duration and recreate them
        await ServicePlanFeature.deleteMany({ service_plan_duration: duration._id });
        if (d.features && d.features.length > 0) {
          for (const f of d.features) {
            await ServicePlanFeature.create({
              ...f,
              service_plan_duration: duration._id
            });
          }
        }
      }
      
      // Remove any durations that are no longer in the plan
      for (const ex of existingDurations) {
        if (!newDurationIds.includes(ex._id.toString())) {
          console.log("DELETING REMOVED DURATION:", ex._id);
          await ServicePlanDuration.findByIdAndDelete(ex._id);
          await ServicePlanFeature.deleteMany({ service_plan_duration: ex._id });
        }
      }
    }
    
    res.status(200).json({ success: true, data: plan });
  } catch (error) { 
    console.error("ERROR IN UPDATESERVICEPLAN:", error);
    next(error); 
  }
};

exports.deleteServicePlan = async (req, res, next) => {
  try {
    const planId = req.params.id;
    
    // Find all durations for this plan to delete their features
    const durations = await ServicePlanDuration.find({ service_plan: planId });
    const durationIds = durations.map(d => d._id);
    
    if (durationIds.length > 0) {
      await ServicePlanFeature.deleteMany({ service_plan_duration: { $in: durationIds } });
    }
    
    // Delete all durations for this plan
    await ServicePlanDuration.deleteMany({ service_plan: planId });
    
    // Finally, delete the plan itself
    await ServicePlan.findByIdAndDelete(planId);
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.getServicePlanById = async (req, res, next) => {
  try {
    const plan = await ServicePlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    
    // Get durations and their features
    const durations = await ServicePlanDuration.find({ service_plan: plan._id }).lean();
    for (let i = 0; i < durations.length; i++) {
        durations[i].features = await ServicePlanFeature.find({ service_plan_duration: durations[i]._id });
    }

    res.status(200).json({ success: true, data: { ...plan._doc, durations } });
  } catch (error) { next(error); }
};

// --- Service Plan Duration Controllers ---
exports.getPlanDurations = async (req, res, next) => {
  try {
    const durations = await ServicePlanDuration.find({ service_plan: req.params.planId });
    res.status(200).json({ success: true, count: durations.length, data: durations });
  } catch (error) { next(error); }
};

exports.createPlanDuration = async (req, res, next) => {
  try {
    const duration = await ServicePlanDuration.create(req.body);
    res.status(201).json({ success: true, data: duration });
  } catch (error) { next(error); }
};

// --- Service Plan Feature Controllers ---
exports.getDurationFeatures = async (req, res, next) => {
  try {
    const features = await ServicePlanFeature.find({ service_plan_duration: req.params.durationId });
    res.status(200).json({ success: true, count: features.length, data: features });
  } catch (error) { next(error); }
};

exports.createPlanFeature = async (req, res, next) => {
  try {
    const feature = await ServicePlanFeature.create(req.body);
    res.status(201).json({ success: true, data: feature });
  } catch (error) { next(error); }
};
