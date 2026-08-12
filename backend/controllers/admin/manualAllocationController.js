const { allocateServiceManually } = require('../../services/manualAllocationService');

// @desc    Manually allocate a subscription to a customer
// @route   POST /api/v1/customers/:id/manual-allocation
// @access  Private/Admin
exports.allocateService = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { planId, durationId, amountReceived, notes } = req.body;

        if (!planId || !durationId || !amountReceived) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Service Plan, Plan Duration, and Amount Received.'
            });
        }

        const result = await allocateServiceManually({
            userId,
            planId,
            durationId,
            amountReceived,
            notes
        });

        res.status(200).json({
            success: true,
            message: 'Service manually allocated successfully',
            data: result
        });
    } catch (error) {
        console.error('allocateService Error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
