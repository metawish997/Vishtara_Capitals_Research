const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const AngelScrip = require('../models/AngelScrip');
const Announcement = require('../models/Announcement');
const Blog = require('../models/Blog');
const BlogCategory = require('../models/BlogCategory');
const Certificate = require('../models/Certificate');
const CompanyBankDetail = require('../models/CompanyBankDetail');
const ComplaintData = require('../models/ComplaintData');
const ComplaintRecord = require('../models/ComplaintRecord');
const ContactDetail = require('../models/ContactDetail');
const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const DraftAgreement = require('../models/user/DraftAgreement');
const Faq = require('../models/Faq');
const FooterBrandSetting = require('../models/footer/FooterBrandSetting');
const FooterColumn = require('../models/footer/FooterColumn');
const FooterLink = require('../models/footer/FooterLink');
const FooterSetting = require('../models/footer/FooterSetting');
const FooterSocialLink = require('../models/footer/FooterSocialLink');
const HeaderMenu = require('../models/header/HeaderMenu');
const HeaderSetting = require('../models/header/HeaderSetting');
const HeroBanner = require('../models/hero/HeroBanner');
const HomeCounter = require('../models/home/HomeCounter');
const HomeKeyFeatureSection = require('../models/home/HomeKeyFeatureSection');
const HomeKeyFeatureItem = require('../models/home/HomeKeyFeatureItem');
const HowItWorksSection = require('../models/home/HowItWorksSection');
const HowItWorksStep = require('../models/home/HowItWorksStep');
const Inquiry = require('../models/Inquiry');
const Invoice = require('../models/user/Invoice');
const KycVerification = require('../models/user/KycVerification');
const ManualPayment = require('../models/user/ManualPayment');
const Marquee = require('../models/Marquee');
const MasterNotification = require('../models/notification/MasterNotification');
const MasterNotificationRead = require('../models/notification/MasterNotificationRead');
const News = require('../models/News');
const NewsCategory = require('../models/NewsCategory');
const OfferBanner = require('../models/OfferBanner');
const PolicyMaster = require('../models/policy/PolicyMaster');
const PolicyContent = require('../models/policy/PolicyContent');
const Popup = require('../models/Popup');
const RefundRequest = require('../models/RefundRequest');
const Review = require('../models/Review');
const RiskRewardMaster = require('../models/RiskRewardMaster');
const ServicePlan = require('../models/services/ServicePlan');
const ServicePlanDuration = require('../models/services/ServicePlanDuration');
const ServicePlanFeature = require('../models/services/ServicePlanFeature');
const Ticket = require('../models/Ticket');
const Tip = require('../models/tips/Tip');
const TipCategory = require('../models/tips/TipCategory');
const TipPlanAccess = require('../models/tips/TipPlanAccess');
const UserAgreement = require('../models/user/UserAgreement');
const UserSubscription = require('../models/user/UserSubscription');
const Watchlist = require('../models/user/Watchlist');
const WatchlistScript = require('../models/user/WatchlistScript');
const WhyChooseSection = require('../models/home/WhyChooseSection');

const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Role.deleteMany();
    await Permission.deleteMany();
    await AngelScrip.deleteMany();
    await Announcement.deleteMany();
    await Blog.deleteMany();
    await BlogCategory.deleteMany();
    await Certificate.deleteMany();
    await CompanyBankDetail.deleteMany();
    await ComplaintData.deleteMany();
    await ComplaintRecord.deleteMany();
    await ContactDetail.deleteMany();
    await Coupon.deleteMany();
    await CouponUsage.deleteMany();
    await DraftAgreement.deleteMany();
    await Faq.deleteMany();
    await FooterBrandSetting.deleteMany();
    await FooterColumn.deleteMany();
    await FooterLink.deleteMany();
    await FooterSetting.deleteMany();
    await FooterSocialLink.deleteMany();
    await HeaderMenu.deleteMany();
    await HeaderSetting.deleteMany();
    await HeroBanner.deleteMany();
    await HomeCounter.deleteMany();
    await HomeKeyFeatureSection.deleteMany();
    await HomeKeyFeatureItem.deleteMany();
    await HowItWorksSection.deleteMany();
    await HowItWorksStep.deleteMany();
    await Inquiry.deleteMany();
    await Invoice.deleteMany();
    await KycVerification.deleteMany();
    await ManualPayment.deleteMany();
    await Marquee.deleteMany();
    await MasterNotification.deleteMany();
    await MasterNotificationRead.deleteMany();
    await News.deleteMany();
    await NewsCategory.deleteMany();
    await OfferBanner.deleteMany();
    await PolicyMaster.deleteMany();
    await PolicyContent.deleteMany();
    await Popup.deleteMany();
    await RefundRequest.deleteMany();
    await Review.deleteMany();
    await RiskRewardMaster.deleteMany();
    await ServicePlan.deleteMany();
    await ServicePlanDuration.deleteMany();
    await ServicePlanFeature.deleteMany();
    await Ticket.deleteMany();
    await Tip.deleteMany();
    await TipCategory.deleteMany();
    await TipPlanAccess.deleteMany();
    await UserAgreement.deleteMany();
    await UserSubscription.deleteMany();
    await Watchlist.deleteMany();
    await WatchlistScript.deleteMany();
    await WhyChooseSection.deleteMany();

    console.log('Data Destroyed...'.red.inverse);

    // 1. Create Initial Permissions
    const permissions = await Permission.insertMany([
      { name: 'All Access', slug: 'all_access', description: 'Can perform any action' },
      { name: 'Manage Users', slug: 'manage_users', description: 'Can create/edit/delete users' },
      { name: 'Manage Roles', slug: 'manage_roles', description: 'Can create/edit roles' }
    ]);

    // 2. Create Super Admin Role
    const superAdminRole = await Role.create({
      name: 'Super Admin',
      slug: 'super_admin',
      permissions: permissions.map(p => p._id) // Give all permissions
    });

    // 3. Create Admin User
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: '11111111',
      phone: '9999999999',
      role: superAdminRole._id
    });

    console.log('Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Role.deleteMany();
    await Permission.deleteMany();
    await AngelScrip.deleteMany();
    await Announcement.deleteMany();
    await Blog.deleteMany();
    await BlogCategory.deleteMany();
    await Certificate.deleteMany();
    await CompanyBankDetail.deleteMany();
    await ComplaintData.deleteMany();
    await ComplaintRecord.deleteMany();
    await ContactDetail.deleteMany();
    await Coupon.deleteMany();
    await CouponUsage.deleteMany();
    await DraftAgreement.deleteMany();
    await Faq.deleteMany();
    await FooterBrandSetting.deleteMany();
    await FooterColumn.deleteMany();
    await FooterLink.deleteMany();
    await FooterSetting.deleteMany();
    await FooterSocialLink.deleteMany();
    await HeaderMenu.deleteMany();
    await HeaderSetting.deleteMany();
    await HeroBanner.deleteMany();
    await HomeCounter.deleteMany();
    await HomeKeyFeatureSection.deleteMany();
    await HomeKeyFeatureItem.deleteMany();
    await HowItWorksSection.deleteMany();
    await HowItWorksStep.deleteMany();
    await Inquiry.deleteMany();
    await Invoice.deleteMany();
    await KycVerification.deleteMany();
    await ManualPayment.deleteMany();
    await Marquee.deleteMany();
    await MasterNotification.deleteMany();
    await MasterNotificationRead.deleteMany();
    await News.deleteMany();
    await NewsCategory.deleteMany();
    await OfferBanner.deleteMany();
    await PolicyMaster.deleteMany();
    await PolicyContent.deleteMany();
    await Popup.deleteMany();
    await RefundRequest.deleteMany();
    await Review.deleteMany();
    await RiskRewardMaster.deleteMany();
    await ServicePlan.deleteMany();
    await ServicePlanDuration.deleteMany();
    await ServicePlanFeature.deleteMany();
    await Ticket.deleteMany();
    await Tip.deleteMany();
    await TipCategory.deleteMany();
    await TipPlanAccess.deleteMany();
    await UserAgreement.deleteMany();
    await UserSubscription.deleteMany();
    await Watchlist.deleteMany();
    await WatchlistScript.deleteMany();
    await WhyChooseSection.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
