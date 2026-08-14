import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Lazy Load Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ServiceList = lazy(() => import('../pages/admin/services/ServiceList'));
const CreateService = lazy(() => import('../pages/admin/services/CreateService'));
const EditService = lazy(() => import('../pages/admin/services/EditService'));
const BlogList = lazy(() => import('../pages/admin/blogs/BlogList'));
const BlogCategories = lazy(() => import('../pages/admin/blogs/BlogCategories'));
const BlogCreate = lazy(() => import('../pages/admin/blogs/BlogCreate'));
const BlogEdit = lazy(() => import('../pages/admin/blogs/BlogEdit'));
const BlogDetails = lazy(() => import('../pages/admin/blogs/BlogDetails'));
const NewsList = lazy(() => import('../pages/admin/news/NewsList'));
const NewsCategories = lazy(() => import('../pages/admin/news/NewsCategories'));
const NewsCreate = lazy(() => import('../pages/admin/news/NewsCreate'));
const NewsEdit = lazy(() => import('../pages/admin/news/NewsEdit'));
const NewsDetails = lazy(() => import('../pages/admin/news/NewsDetails'));
const OfferBannerList = lazy(() => import('../pages/admin/offer-banners/OfferBannerList'));
const OfferBannerCreate = lazy(() => import('../pages/admin/offer-banners/OfferBannerCreate'));
const OfferBannerEdit = lazy(() => import('../pages/admin/offer-banners/OfferBannerEdit'));
const AnnouncementList = lazy(() => import('../pages/admin/announcements/AnnouncementList'));
const AnnouncementCreate = lazy(() => import('../pages/admin/announcements/AnnouncementCreate'));
const AnnouncementEdit = lazy(() => import('../pages/admin/announcements/AnnouncementEdit'));
const Certificates = lazy(() => import('../pages/admin/certificates/Certificates'));
const BankDetailList = lazy(() => import('../pages/admin/company-bank-details/BankDetailList'));
const BankDetailCreate = lazy(() => import('../pages/admin/company-bank-details/BankDetailCreate'));
const BankDetailEdit = lazy(() => import('../pages/admin/company-bank-details/BankDetailEdit'));
const ComplaintDataDashboard = lazy(() => import('../pages/admin/complaint-data/ComplaintDataDashboard'));
const ComplaintDataCreate = lazy(() => import('../pages/admin/complaint-data/ComplaintDataCreate'));
const ComplaintDataEdit = lazy(() => import('../pages/admin/complaint-data/ComplaintDataEdit'));
const ComplaintList = lazy(() => import('../pages/admin/complaints/ComplaintList'));
const ComplaintCreate = lazy(() => import('../pages/admin/complaints/ComplaintCreate'));
const ContactDetails = lazy(() => import('../pages/admin/contact/ContactDetails'));
const Coupons = lazy(() => import('../pages/admin/coupons/Coupons'));
const EmployeeList = lazy(() => import('../pages/admin/employees/EmployeeList'));
const CreateEmployee = lazy(() => import('../pages/admin/employees/CreateEmployee'));
const SubscriptionList = lazy(() => import('../pages/admin/demo-subscriptions/SubscriptionList'));
const FaqManager = lazy(() => import('../pages/admin/faq/FaqManager'));
const FooterBuilder = lazy(() => import('../pages/admin/footer/FooterBuilder'));
const HeaderBuilder = lazy(() => import('../pages/admin/header/HeaderBuilder'));
const InquiryList = lazy(() => import('../pages/admin/inquiries/InquiryList'));
const MarqueeManager = lazy(() => import('../pages/admin/marquees/MarqueeManager'));
const CampaignList = lazy(() => import('../pages/admin/campaigns/CampaignList'));
const CampaignCreate = lazy(() => import('../pages/admin/campaigns/CampaignCreate'));
const PopupList = lazy(() => import('../pages/admin/popups/PopupList'));
const PopupEdit = lazy(() => import('../pages/admin/popups/PopupEdit'));
const PolicyList = lazy(() => import('../pages/admin/policies/PolicyList'));
const PolicyCreate = lazy(() => import('../pages/admin/policies/PolicyCreate'));
const RefundList = lazy(() => import('../pages/admin/refunds/RefundList'));
const RefundDetails = lazy(() => import('../pages/admin/refunds/RefundDetails'));
const ReviewList = lazy(() => import('../pages/admin/reviews/ReviewList'));
const RoleList = lazy(() => import('../pages/admin/roles/RoleList'));
const RoleEdit = lazy(() => import('../pages/admin/roles/RoleEdit'));
const DesignationList = lazy(() => import('../pages/admin/designations/DesignationList'));
const TicketDashboard = lazy(() => import('../pages/admin/tickets/TicketDashboard'));
const CustomerList = lazy(() => import('../pages/admin/customers/CustomerList'));
const CustomerDetails = lazy(() => import('../pages/admin/customers/CustomerDetails'));
const AdminInvoiceDetails = lazy(() => import('../pages/admin/customers/AdminInvoiceDetails'));
const LeadList = lazy(() => import('../pages/admin/leads/LeadList'));
const LeadDetails = lazy(() => import('../pages/admin/leads/LeadDetails'));
const LeadPullUploads = lazy(() => import('../pages/admin/leads/LeadPullUploads'));
const SupportChat = lazy(() => import('../pages/admin/chat/SupportChat'));
const ManualPayments = lazy(() => import('../pages/admin/manualPayments/ManualPayments'));

// Tips Intelligence
const TipsDashboard = lazy(() => import('../pages/admin/tips/TipsDashboard'));
const CreateEquityTip = lazy(() => import('../pages/admin/tips/CreateEquityTip'));
const CreateFOTip = lazy(() => import('../pages/admin/tips/CreateFOTip'));
const RiskRewardMaster = lazy(() => import('../pages/admin/tips/RiskRewardMaster'));
const TipCategories = lazy(() => import('../pages/admin/tips/TipCategories'));
const TipsAnalysis = lazy(() => import('../pages/admin/tips/TipsAnalysis'));
const TipDetails = lazy(() => import('../pages/admin/tips/TipDetails.jsx'));

// About Section
const Mission = lazy(() => import('../pages/admin/about/Mission'));
const CoreValues = lazy(() => import('../pages/admin/about/CoreValues'));
const WhyPlatform = lazy(() => import('../pages/admin/about/WhyPlatform'));

// Home Section
const DownloadApp = lazy(() => import('../pages/admin/home/DownloadApp'));
const HowItWorks = lazy(() => import('../pages/admin/home/HowItWorks'));
const HomeCounters = lazy(() => import('../pages/admin/home/HomeCounters'));
const KeyFeatures = lazy(() => import('../pages/admin/home/KeyFeatures'));
const WhyChooseUs = lazy(() => import('../pages/admin/home/WhyChooseUs'));

// Notification Section
const NotificationCenter = lazy(() => import('../pages/admin/notifications/NotificationCenter'));

// System Health
const SystemHealth = lazy(() => import('../pages/admin/system-health/SystemHealth'));

// Unified Credentials Manager
const CredentialManager = lazy(() => import('../pages/admin/credentials/CredentialManager'));

const AdminRoutes = (
    <Route element={<ProtectedRoute requiredLevel="all" />}>
        <Route path="admin" element={<AdminLayout />}>
            
            {/* Dashboard (Needs specific permission) */}
            <Route element={<ProtectedRoute requiredPermission="view_admin_dashboard" />}>
                <Route path="dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Core Management */}
            <Route path="services">
                <Route element={<ProtectedRoute requiredPermission="view_services" />}>
                    <Route index element={<ServiceList />} />
                </Route>
                <Route element={<ProtectedRoute requiredPermission="create_services" />}>
                    <Route path="create" element={<CreateService />} />
                </Route>
                <Route element={<ProtectedRoute requiredPermission="update_services" />}>
                    <Route path="edit/:id" element={<EditService />} />
                </Route>
            </Route>

            <Route path="blogs">
                <Route element={<ProtectedRoute requiredPermission="view_blogs" />}>
                    <Route index element={<BlogList />} />
                    <Route path="categories" element={<BlogCategories />} />
                    <Route path="show/:id" element={<BlogDetails />} />
                </Route>
                <Route element={<ProtectedRoute requiredPermission="create_blogs" />}>
                    <Route path="create" element={<BlogCreate />} />
                </Route>
                <Route element={<ProtectedRoute requiredPermission="update_blogs" />}>
                    <Route path="edit/:id" element={<BlogCreate />} />
                </Route>
            </Route>

            <Route path="news">
                <Route element={<ProtectedRoute requiredPermission="view_news" />}>
                    <Route index element={<NewsList />} />
                    <Route path="categories" element={<NewsCategories />} />
                    <Route path="show/:id" element={<NewsDetails />} />
                </Route>
                <Route element={<ProtectedRoute requiredPermission="create_news" />}>
                    <Route path="create" element={<NewsCreate />} />
                </Route>
                <Route element={<ProtectedRoute requiredPermission="update_news" />}>
                    <Route path="edit/:id" element={<NewsCreate />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute requiredPermission="manage_settings" />}>
                <Route path="offer-banners">
                    <Route index element={<OfferBannerList />} />
                    <Route path="create" element={<OfferBannerCreate />} />
                    <Route path="edit/:id" element={<OfferBannerEdit />} />
                </Route>

                <Route path="announcements">
                    <Route index element={<AnnouncementList />} />
                    <Route path="create" element={<AnnouncementCreate />} />
                    <Route path="edit/:id" element={<AnnouncementEdit />} />
                </Route>
            </Route>

            {/* Compliance & Settings */}
            <Route element={<ProtectedRoute requiredPermission="manage_settings" />}>
                <Route path="certificates" element={<Certificates />} />
                <Route path="company-bank-details">
                    <Route index element={<BankDetailList />} />
                    <Route path="create" element={<BankDetailCreate />} />
                    <Route path="edit/:id" element={<BankDetailEdit />} />
                </Route>
                <Route path="complaint-data">
                    <Route index element={<ComplaintDataDashboard />} />
                    <Route path="create/:type" element={<ComplaintDataCreate />} />
                    <Route path="edit/:type" element={<ComplaintDataEdit />} />
                </Route>
                <Route path="complaints">
                    <Route index element={<ComplaintList />} />
                    <Route path="create" element={<ComplaintCreate />} />
                    <Route path="edit/:id" element={<ComplaintCreate />} />
                </Route>
                <Route path="refunds">
                    <Route index element={<RefundList />} />
                    <Route path=":id" element={<RefundDetails />} />
                </Route>
                <Route path="tickets" element={<TicketDashboard />} />
                <Route path="support-chat" element={<SupportChat />} />
                <Route path="manual-payments" element={<ManualPayments />} />
                <Route path="demo-subscriptions" element={<SubscriptionList />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="inquiries" element={<InquiryList />} />
                <Route path="reviews" element={<ReviewList />} />
                <Route path="designations" element={<DesignationList />} />
                <Route path="contact-details" element={<ContactDetails />} />
            </Route>

            <Route path="roles">
                <Route element={<ProtectedRoute requiredPermission="view_roles" />}>
                    <Route index element={<RoleList />} />
                </Route>
                <Route element={<ProtectedRoute requiredPermission="create_roles" />}>
                    <Route path="create" element={<RoleEdit />} />
                </Route>
                <Route element={<ProtectedRoute requiredPermission="update_roles" />}>
                    <Route path="edit/:id" element={<RoleEdit />} />
                </Route>
            </Route>

            <Route path="employees">
                <Route element={<ProtectedRoute requiredPermission="view_users" />}>
                    <Route index element={<EmployeeList />} />
                </Route>
                <Route element={<ProtectedRoute requiredPermission="create_users" />}>
                    <Route path="create" element={<CreateEmployee />} />
                </Route>
            </Route>

            {/* CRM & Masters (Accessible based on specific permissions) */}
            <Route element={<ProtectedRoute requiredPermission="view_customers" />}>
                <Route path="customers">
                    <Route index element={<CustomerList />} />
                    <Route path=":id" element={<CustomerDetails />} />
                    <Route path="show/:id" element={<CustomerDetails />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute requiredPermission="view_leads" />}>
                <Route path="leads">
                    <Route index element={<LeadList />} />
                    <Route path=":id" element={<LeadDetails />} />
                </Route>
                <Route path="lead-pull-uploads" element={<LeadPullUploads />} />
            </Route>

            {/* Website Builder (Admin Only) */}
            <Route element={<ProtectedRoute requiredLevel="admin" />}>
                <Route path="faq" element={<FaqManager />} />
                <Route path="footer" element={<FooterBuilder />} />
                <Route path="header" element={<HeaderBuilder />} />
                <Route path="marquees" element={<MarqueeManager />} />
                <Route path="popups">
                    <Route index element={<PopupList />} />
                    <Route path="create" element={<PopupEdit />} />
                    <Route path="edit/:id" element={<PopupEdit />} />
                </Route>
            </Route>
            <Route path="policies">
                <Route index element={<PolicyList />} />
                <Route path="create" element={<PolicyCreate />} />
                <Route path="edit/:id" element={<PolicyCreate />} />
            </Route>

            {/* Intelligence & Campaigns */}
            <Route element={<ProtectedRoute requiredPermission="view_tips" />}>
                <Route path="tips">
                    <Route index element={<TipsDashboard />} />
                    <Route element={<ProtectedRoute requiredPermission="create_tips" />}>
                        <Route path="create-equity" element={<CreateEquityTip />} />
                        <Route path="create-fo" element={<CreateFOTip />} />
                        <Route path="categories" element={<TipCategories />} />
                    </Route>
                    <Route path="risk-reward" element={<RiskRewardMaster />} />
                    <Route path="analysis" element={<TipsAnalysis />} />
                    <Route path="show/:id" element={<TipDetails />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute requiredPermission="view_campaigns" />}>
                <Route path="campaigns">
                    <Route index element={<CampaignList />} />
                    <Route element={<ProtectedRoute requiredPermission="create_campaigns" />}>
                        <Route path="create" element={<CampaignCreate />} />
                    </Route>
                    <Route element={<ProtectedRoute requiredPermission="update_campaigns" />}>
                        <Route path="edit/:id" element={<CampaignCreate />} />
                    </Route>
                </Route>
            </Route>
            
            <Route element={<ProtectedRoute requiredPermission="view_notifications" />}>
                <Route path="notifications" element={<NotificationCenter />} />
            </Route>

            {/* Content Modules */}
            <Route path="about">
                <Route path="mission" element={<Mission />} />
                <Route path="values" element={<CoreValues />} />
                <Route path="why-platform" element={<WhyPlatform />} />
            </Route>
            <Route path="home">
                <Route path="download-app" element={<DownloadApp />} />
                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="counters" element={<HomeCounters />} />
                <Route path="features" element={<KeyFeatures />} />
                <Route path="why-us" element={<WhyChooseUs />} />
            </Route>

            {/* Unified Credentials */}
            <Route path="credentials" element={<CredentialManager />} />

            {/* System Health */}
            <Route path="system-health" element={<SystemHealth />} />
        </Route>
    </Route>
);

export default AdminRoutes;
