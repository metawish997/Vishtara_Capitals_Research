import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import PublicRoute from '../components/auth/PublicRoute';

// Lazy Load Pages
const Home = lazy(() => import('../pages/user/Home'));
const About = lazy(() => import('../pages/user/About'));
const Contact = lazy(() => import('../pages/user/Contact'));
const LegalCenter = lazy(() => import('../pages/user/legal/LegalCenter'));
const BankDetails = lazy(() => import('../pages/user/payments/BankDetails'));
const ComplaintData = lazy(() => import('../pages/user/complaints/ComplaintData'));
const Certificates = lazy(() => import('../pages/user/certificates/Certificates'));
const Services = lazy(() => import('../pages/user/Services'));
const NewsList = lazy(() => import('../pages/user/news/NewsList'));
const NewsDetails = lazy(() => import('../pages/user/news/NewsDetails'));
const BlogList = lazy(() => import('../pages/user/blogs/BlogList'));
const BlogDetails = lazy(() => import('../pages/user/blogs/BlogDetails'));
const ReviewForm = lazy(() => import('../pages/user/ReviewForm'));
const PrivacyPolicy = lazy(() => import('../pages/user/allpolicy/PrivacyPolicy'));
const RefundPolicy = lazy(() => import('../pages/user/allpolicy/RefundPolicy'));
const Compliance = lazy(() => import('../pages/user/allpolicy/Compliance'));
const RegistrationGrievance = lazy(() => import('../pages/user/allpolicy/RegistrationGrievance'));
const DisclaimerDisclosure = lazy(() => import('../pages/user/allpolicy/DisclaimerDisclosure'));
const MitcScamAwareness = lazy(() => import('../pages/user/allpolicy/MitcScamAwareness'));
const InvestorCharter = lazy(() => import('../pages/user/allpolicy/InvestorCharter'));
const TermsAndConditions = lazy(() => import('../pages/user/allpolicy/TermsAndConditions'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const VerifyOtp = lazy(() => import('../pages/auth/VerifyOtp'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));

const PublicRoutes = (
    <>
        <Route element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="legal" element={<LegalCenter />} />
            <Route path="bank-details" element={<BankDetails />} />
            <Route path="complaint-data" element={<ComplaintData />} />
            <Route path="certificates" element={<Certificates />} />

            {/* News & Blogs */}
            <Route path="news" element={<NewsList />} />
            <Route path="news/:slug" element={<NewsDetails />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogs/:slug" element={<BlogDetails />} />
            <Route path="give-review" element={<ReviewForm />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="refund-policy" element={<RefundPolicy />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="registration-grievance" element={<RegistrationGrievance />} />
            <Route path="disclaimer-disclosure" element={<DisclaimerDisclosure />} />
            <Route path="mitc-scam-awareness" element={<MitcScamAwareness />} />
            <Route path="investor-charter" element={<InvestorCharter />} />
            <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        </Route>

        {/* Auth - Wrapped in PublicRoute to redirect logged-in users */}
        <Route element={<PublicRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify-otp" element={<VerifyOtp />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
    </>
);

export default PublicRoutes;
