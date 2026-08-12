const User = require('../models/User');
const ServicePlan = require('../models/services/ServicePlan');
const ServicePlanDuration = require('../models/services/ServicePlanDuration');
const UserSubscription = require('../models/user/UserSubscription');

/**
 * Manually allocate a service to a customer.
 * Calculates granted days based on amount received and plan duration.
 */
exports.allocateServiceManually = async ({ userId, planId, durationId, amountReceived, notes }) => {
    // 1. Fetch related entities
    const user = await User.findById(userId);
    if (!user) throw new Error('Customer not found');

    const plan = await ServicePlan.findById(planId);
    if (!plan) throw new Error('Service Plan not found');

    const duration = await ServicePlanDuration.findById(durationId);
    if (!duration) throw new Error('Service Plan Duration not found');

    // 2. Validate Service Plan Duration relationship
    if (duration.service_plan.toString() !== planId.toString()) {
        throw new Error('Service Plan Duration does not belong to the selected Service Plan');
    }

    // 3. Validate amount
    const amount = Number(amountReceived);
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Valid amount received is required');
    }

    // 4. Calculate Granted Days based ONLY on duration_months
    const planDurationDays = duration.duration_months * 30;
    
    // Formula: (Paid Amount / Plan Price) * Plan Duration Days
    // Use Math.floor() to avoid granting extra un-paid time
    let grantedDays = Math.floor((amount / duration.price) * planDurationDays);
    
    // Guarantee minimum 1 day if any amount > 0 is paid
    if (amount > 0 && grantedDays < 1) {
        grantedDays = 1;
    }

    if (grantedDays <= 0) {
        throw new Error('Amount too low to grant any days.');
    }

    // 5. Calculate Start Date (Start of tomorrow)
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);

    // 6. Calculate Expiry Date strictly from Start Date (Tomorrow + grantedDays)
    // This perfectly handles 30, 31, 28-day months using native JavaScript Date math
    let finalEndDate = new Date(startDate);
    finalEndDate.setDate(finalEndDate.getDate() + grantedDays);

    // 7. Create new UserSubscription
    const subscription = await UserSubscription.create({
        user: userId,
        service_plan: planId,
        service_plan_duration: durationId,
        amount: amount,
        currency: 'INR',
        payment_gateway: 'manual_allocation',
        start_date: startDate,
        end_date: finalEndDate,
        status: 'active',
        payment_status: 'completed',
        payment_reference: notes, // Store notes in payment_reference
        payment_payload: { grantedDays } // Save grantedDays here so UI can display it
    });

    return {
        subscription,
        grantedDays,
        startDate,
        endDate: finalEndDate,
        planName: plan.name
    };
};
