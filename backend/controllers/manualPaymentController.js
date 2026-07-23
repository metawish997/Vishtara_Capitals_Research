const ManualPayment = require('../models/user/ManualPayment');
const UserSubscription = require('../models/user/UserSubscription');
const UserAgreement = require('../models/user/UserAgreement');
const User = require('../models/User');
const leadConversionService = require('../services/leadConversionService');

// @desc    Get all manual payments (Admin)
// @route   GET /api/v1/manual-payments
// @access  Private/Admin
exports.getAllManualPayments = async (req, res) => {
    try {
        const payments = await ManualPayment.find()
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        console.error('Error fetching manual payments:', error);
        res.status(500).json({ success: false, message: 'Server error fetching payments' });
    }
};

// @desc    Approve or Reject Manual Payment (Admin)
// @route   PUT /api/v1/manual-payments/:id/status
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const paymentId = req.params.id;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const payment = await ManualPayment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        if (payment.status !== 'pending') {
            return res.status(400).json({ success: false, message: `Payment is already ${payment.status}` });
        }

        payment.status = status;
        await payment.save();

        // Also update Subscription and Agreement status
        if (status === 'approved') {
            // Find subscription and agreement that match this plan and user and are pending
            const subscription = await UserSubscription.findOne({
                user: payment.user,
                service_plan: payment.plan_id,
                service_plan_duration: payment.duration_id,
                status: 'pending'
            }).sort({ createdAt: -1 });

            if (subscription) {
                const ServicePlanDuration = require('../models/services/ServicePlanDuration');
                const planDuration = await ServicePlanDuration.findById(payment.duration_id);

                const startDate = new Date();
                const endDate = new Date(startDate);
                
                if (planDuration) {
                    if (planDuration.duration_months) {
                        endDate.setMonth(endDate.getMonth() + planDuration.duration_months);
                    }
                }

                subscription.status = 'active';
                subscription.payment_status = 'completed';
                subscription.start_date = startDate;
                subscription.end_date = endDate;
                await subscription.save();
                
                const agreement = await UserAgreement.findOne({
                    subscription: subscription._id
                });
                if (agreement) {
                    agreement.status = 'active';
                    await agreement.save();
                }

                const user = await User.findById(payment.user);
                try {
                    await leadConversionService.convertLeadAfterSuccessfulPayment(user);
                } catch(error) {
                    console.error('Lead Conversion Error:', error);
                }
            }
        } else if (status === 'rejected') {
            // If rejected, mark subscription as rejected/failed
            const subscription = await UserSubscription.findOne({
                user: payment.user,
                service_plan: payment.plan_id,
                service_plan_duration: payment.duration_id,
                status: 'pending'
            }).sort({ createdAt: -1 });

            if (subscription) {
                subscription.status = 'rejected';
                subscription.payment_status = 'failed';
                await subscription.save();

                const agreement = await UserAgreement.findOne({
                    subscription: subscription._id
                });
                if (agreement) {
                    agreement.status = 'rejected';
                    await agreement.save();
                }
            }
        }

        res.status(200).json({ success: true, message: `Payment ${status} successfully`, data: payment });
    } catch (error) {
        console.error('Error updating manual payment status:', error);
        res.status(500).json({ success: false, message: 'Server error updating payment' });
    }
};
