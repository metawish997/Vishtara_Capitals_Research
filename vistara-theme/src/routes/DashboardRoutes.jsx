import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import UserDashboardLayout from '../layouts/UserDashboardLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Lazy Load Dashboard Pages
const UserDashboard = lazy(() => import('../pages/userDashboard/UserDashboard'));
const ConfirmSubscription = lazy(() => import('../pages/userDashboard/subscription/ConfirmSubscription'));
const MarketCalls = lazy(() => import('../pages/userDashboard/market-calls/MarketCalls'));
const LatestNews = lazy(() => import('../pages/userDashboard/latest-news/LatestNews'));
const Announcements = lazy(() => import('../pages/userDashboard/announcements/Announcements'));
const Watchlist = lazy(() => import('../pages/userDashboard/watchlist/Watchlist'));
const OptionChain = lazy(() => import('../pages/userDashboard/optionChain/OptionChain'));
const ChatSupport = lazy(() => import('../pages/userDashboard/chat/ChatSupport'));
const Notifications = lazy(() => import('../pages/userDashboard/notifications/Notifications'));
const UserTipDetails = lazy(() => import('../pages/userDashboard/market-calls/UserTipDetails.jsx'));
const SupportTicket = lazy(() => import('../pages/userDashboard/support/SupportTicket'));

// Settings
const Settings = lazy(() => import('../pages/userDashboard/settings/Settings'));
const EditProfile = lazy(() => import('../pages/userDashboard/settings/EditProfile'));
const PaymentInvoices = lazy(() => import('../pages/userDashboard/settings/PaymentInvoices'));
const InvoiceList = lazy(() => import('../pages/userDashboard/settings/InvoiceList'));
const KycVerification = lazy(() => import('../pages/userDashboard/settings/KycVerification'));
const Agreements = lazy(() => import('../pages/userDashboard/settings/Agreements'));
const KycDetails = lazy(() => import('../pages/userDashboard/settings/kyc-details/KycDetails'));

const DashboardRoutes = (
    <Route element={<ProtectedRoute allowedRoles={['customer', 'super admin', 'super_admin']} />}>
        <Route path="dashboard" element={<UserDashboardLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="subscription/confirm" element={<ConfirmSubscription />} />
            <Route path="market-calls" element={<MarketCalls />} />
            <Route path="market-calls/show/:id" element={<UserTipDetails />} />
            <Route path="latest-news" element={<LatestNews />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="option-chain/:symbol" element={<OptionChain />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="support" element={<SupportTicket />} />
            
            {/* Nested Settings */}
            <Route path="settings">
                <Route index element={<Settings />} />
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="payment-invoices" element={<PaymentInvoices />} />
                <Route path="payment-history" element={<InvoiceList />} />
                <Route path="kyc" element={<KycVerification />} />
                <Route path="kyc-details" element={<KycDetails />} />
                <Route path="agreements" element={<Agreements />} />
            </Route>
        </Route>
    </Route>
);

export default DashboardRoutes;
