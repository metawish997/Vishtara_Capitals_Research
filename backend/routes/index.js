const express = require('express');
const router = express.Router();

// Welcome Route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Stock Market Master API',
    status: 'Healthy',
    timestamp: new Date()
  });
});

// Import all sub-routes
const authRoutes = require('./authRoutes');
const mediaRoutes = require('./mediaRoutes');
const announcementRoutes = require('./announcementRoutes');
const blogRoutes = require('./blogRoutes');
const certificateRoutes = require('./certificateRoutes');
const bankRoutes = require('./bankRoutes');
const complaintRoutes = require('./complaintRoutes');
const contactRoutes = require('./contactRoutes');
const customerRoutes = require('./customerRoutes');
const couponRoutes = require('./couponRoutes');
const faqRoutes = require('./faqRoutes');
const footerRoutes = require('./footerRoutes');
const headerRoutes = require('./headerRoutes');
const heroRoutes = require('./hero/heroRoutes');
const homeRoutes = require('./home/homeRoutes');
const inquiryRoutes = require('./inquiryRoutes');
const userInvoiceRoutes = require('./user/invoiceRoutes');
const userWatchlistRoutes = require('./watchlist/watchlistRoutes');
const kycRoutes = require('./kycRoutes');
const agreementRoutes = require('./user/agreementRoutes');
const angelRoutes = require('./angelRoutes');
const optionChainRoutes = require('./optionChainRoutes');
const manualPaymentRoutes = require('./manualPaymentRoutes');
const adminRoutes = require('./adminRoutes');

const marqueeRoutes = require('./marqueeRoutes');
const notificationRoutes = require('./notificationRoutes');
const newsRoutes = require('./newsRoutes');
const offerBannerRoutes = require('./offerBannerRoutes');
const policyRoutes = require('./policy/policyRoutes');
const popupRoutes = require('./popupRoutes');
const refundRequestRoutes = require('./refundRequestRoutes');
const reviewRoutes = require('./reviewRoutes');
const roleRoutes = require('./roleRoutes');
const riskRewardRoutes = require('./riskRewardRoutes');
const serviceRoutes = require('./services/serviceRoutes');
const ticketRoutes = require('./ticketRoutes');
const tipRoutes = require('./tips/tipRoutes');
const userRoutes = require('./userRoutes');
const aboutRoutes = require('./aboutRoutes');
const profileRoutes = require('./profileRoutes');
const campaignRoutes = require('./campaignRoutes');
const designationRoutes = require('./designationRoutes');
const employeeRoutes = require('./employeeRoutes');
const leadRoutes = require('./leadRoutes');
const leadImportRoutes = require('./leadImportRoutes');
// const stockRoutes = require('./stockRoutes'); // Example for future

// Register routes
router.get('/test-banks', (req, res) => res.json({ msg: 'hit' }));
router.use('/banks', bankRoutes);
router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.use('/announcements', announcementRoutes);
router.use('/blogs', blogRoutes);
router.use('/certificates', certificateRoutes);
router.use('/complaints', complaintRoutes);
router.use('/contacts', contactRoutes);
router.use('/customers', customerRoutes);
router.use('/coupons', couponRoutes);
router.use('/faqs', faqRoutes);
router.use('/footer', footerRoutes);
router.use('/header', headerRoutes);
router.use('/hero', heroRoutes);
router.use('/home', homeRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/user/invoices', userInvoiceRoutes);
router.use('/user/watchlists', userWatchlistRoutes);
router.use('/kyc', kycRoutes);
router.use('/user/agreements', agreementRoutes);

router.use('/marquees', marqueeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/news', newsRoutes);
router.use('/offer-banners', offerBannerRoutes);
router.use('/policies', policyRoutes);
router.use('/popups', popupRoutes);
router.use('/refund-requests', refundRequestRoutes);
router.use('/reviews', reviewRoutes);
router.use('/roles', roleRoutes);
router.use('/risk-rewards', riskRewardRoutes);
router.use('/services', serviceRoutes);
router.use('/tickets', ticketRoutes);
router.use('/tips', tipRoutes);
router.use('/users', userRoutes);
router.use('/about', aboutRoutes);
router.use('/profile', profileRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/designations', designationRoutes);
router.use('/employees', employeeRoutes);
router.use('/leads', leadRoutes);
router.use('/lead-imports', leadImportRoutes);
router.use('/angel', angelRoutes);
router.use('/chat', require('./chatRoutes'));
router.use('/digio-credentials', require('./digioCredentialRoutes'));
router.use('/angel-credentials', require('./angelCredentialRoutes'));
router.use('/smtp-credentials', require('./smtpCredentialRoutes'));
router.use('/sms-credentials', require('./smsCredentialRoutes'));
router.use('/razorpay-credentials', require('./razorpayCredentialRoutes'));
router.use('/option-chain', optionChainRoutes);
router.use('/manual-payments', manualPaymentRoutes);
router.use('/admin', adminRoutes);


// Health check for API
router.get('/health', (req, res) => {
  res.json({
    status: 'API is working perfectly',
    timestamp: new Date()
  });
});

module.exports = router;
