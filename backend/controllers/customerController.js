const User = require('../models/User');
const Role = require('../models/Role');
const UserSubscription = require('../models/user/UserSubscription');
const Invoice = require('../models/user/Invoice');
const KycVerification = require('../models/user/KycVerification');
const UserAgreement = require('../models/user/UserAgreement');
const RefundRequest = require('../models/RefundRequest');
const mongoose = require('mongoose');

// @desc    Get all customers
// @route   GET /api/v1/customers
// @access  Private/Admin
exports.getCustomers = async (req, res, next) => {
  try {
    // 1. Fetch all users and populate their roles
    // We do this to ensure we can filter by the actual populated role slug
    const users = await User.find()
      .populate('role')
      .sort('-createdAt');

    // 2. Filter users to only include those with the 'customer' role slug
    // This is a 100% accurate way to ensure no Admin or other roles leak through
    const customers = users.filter(user => {
        return user.role && user.role.slug === 'customer';
    });

    const customerIds = customers.map(user => user._id);
    const allSubs = await UserSubscription.find({ user: { $in: customerIds } })
        .sort('-createdAt')
        .lean();

    const customersWithSubs = customers.map((user) => {
        const subs = allSubs.filter(s => s.user.toString() === user._id.toString());
            
        let bestSub = null;
        if (subs.length > 0) {
            // Prioritize active, then demo, then pending, then suspended
            bestSub = subs.find(s => s.status === 'active' && new Date(s.end_date) >= new Date())
                || subs.find(s => s.status === 'demo' && new Date(s.end_date) >= new Date())
                || subs.find(s => s.status === 'pending')
                || subs.find(s => s.status === 'active') // fallback if active but expired
                || subs.find(s => s.status === 'demo') // fallback if demo but expired
                || subs.find(s => s.status === 'suspended')
                || subs[0]; // ultimate fallback to the most recently created
        }
            
        const hasUsedDemo = subs.some(s => 
            (s.payment_gateway && s.payment_gateway.toLowerCase() === 'demo') || 
            (s.status && s.status.toLowerCase() === 'demo') || 
            (s.payment_status && s.payment_status.toLowerCase() === 'demo')
        );
        const hasActiveSubscription = subs.some(s => ['active', 'pending'].includes(s.status) && new Date(s.end_date) >= new Date());

        return {
            ...user.toObject(),
            latestSubscription: bestSub,
            hasUsedDemo,
            hasActiveSubscription
        };
    });

    // console.log(`[Admin Directory] Total Users: ${users.length}, Filtered Customers: ${customers.length}`);

    res.status(200).json({
      success: true,
      count: customersWithSubs.length,
      data: customersWithSubs
    });
  } catch (error) {
    console.error('getCustomers Error:', error);
    next(error);
  }
};

// @desc    Get single customer details
// @route   GET /api/v1/customers/:id
// @access  Private/Admin
exports.getCustomer = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid Customer ID format' });
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    
    // 1. Fetch User with Role
    const user = await User.findById(objectId).populate('role');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // 2. Fetch all related data
    const [kycRecords, subscriptions, invoices, agreements, refunds] = await Promise.all([
      KycVerification.find({ user: objectId }).sort('-createdAt'),
      UserSubscription.find({ user: objectId })
        .populate('service_plan')
        .populate('service_plan_duration')
        .sort('-createdAt'),
      Invoice.find({ user: objectId })
        .populate({
          path: 'user_subscription',
          populate: [
            { path: 'service_plan' },
            { path: 'service_plan_duration' }
          ]
        })
        .sort('-createdAt'),
      UserAgreement.find({ user: objectId }).sort('-createdAt'),
      RefundRequest.find({ user: objectId }).sort('-createdAt')
    ]);

    // Get the latest KYC record
    const kyc = kycRecords.length > 0 ? kycRecords[0] : null;

    res.status(200).json({
      success: true,
      data: {
        user,
        kyc,
        kycHistory: kycRecords,
        subscriptions,
        invoices,
        agreements,
        refunds
      }
    });
  } catch (error) {
    console.error('getCustomer Error:', error);
    next(error);
  }
};

// @desc    Delete a customer
// @route   DELETE /api/v1/customers/:id
// @access  Private/Admin
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grant demo subscription to a customer
// @route   POST /api/v1/customers/:id/grant-demo
// @access  Private/Admin
exports.grantDemo = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { demoDays } = req.body;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid Customer ID format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Business Requirement Validations
    const userSubs = await UserSubscription.find({ user: userId }).lean();
    
    const hasUsedDemo = userSubs.some(s => s.payment_gateway === 'demo');
    if (hasUsedDemo) {
        return res.status(400).json({ success: false, message: 'Demo already used. A user can receive only one demo per lifetime.' });
    }

    const hasActiveSubscription = userSubs.some(s => ['active', 'pending'].includes(s.status) && new Date(s.end_date) >= new Date());
    if (hasActiveSubscription) {
        return res.status(400).json({ success: false, message: 'User already has an active subscription.' });
    }

    const days = parseInt(demoDays) || 3;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

    const demoSubscription = await UserSubscription.create({
      user: user._id,
      payment_gateway: 'demo',
      payment_status: 'demo',
      status: 'demo',
      start_date: startDate,
      end_date: endDate,
      amount: 0
    });

    res.status(200).json({
      success: true,
      message: `Granted ${days} days demo access`,
      data: demoSubscription
    });
  } catch (error) {
    console.error('grantDemo Error:', error);
    next(error);
  }
};

// @desc    Toggle demo subscription status
// @route   POST /api/v1/customers/:id/toggle-demo-status
// @access  Private/Admin
exports.toggleDemoStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { status } = req.body; // 'suspended' or 'active'

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid Customer ID format' });
    }

    const subscription = await UserSubscription.findOne({ user: userId, payment_gateway: 'demo' }).sort('-createdAt');

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'No demo subscription found for this user' });
    }

    subscription.status = status;
    
    // If we are suspending, we could optionally update the end_date to now
    // if (status === 'suspended') {
    //   subscription.end_date = new Date();
    // }

    await subscription.save();

    res.status(200).json({
      success: true,
      message: `Demo subscription marked as ${status}`,
      data: subscription
    });
  } catch (error) {
    console.error('toggleDemoStatus Error:', error);
    next(error);
  }
};

