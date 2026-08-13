import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppDataProvider } from "./context/AppDataContext";
import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";
// import Home2 from "./pages/Home2";
import About from "./pages/About";
import Service from "./pages/Service";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Contact from "./pages/Contact";
import Payments from "./pages/Payments";
import Complaints from "./pages/Complaints";
import SebiDisclosures from "./pages/policies/SebiDisclosures";
import Disclaimers from "./pages/policies/Disclaimers";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import RefundPolicy from "./pages/policies/RefundPolicy";
import InvestorCharter from "./pages/policies/InvestorCharter";
import TermsConditions from "./pages/policies/TermsAndConditions";
import GrievanceMatrix from "./pages/policies/GrievanceEscalationMatrix";
import AccountDeletion from "./pages/policies/AccountDeletion";
import CodeOfConduct from "./pages/policies/CodeOfConduct";
import GrievanceRedressalPolicy from "./pages/policies/GrievanceRedressalPolicy";
import InternalPolicy from "./pages/policies/InternalPolicy";
import Mitc from "./pages/policies/Mitc";
import PmlaPolicy from "./pages/policies/PmlaPolicy";
import RiskWarnings from "./pages/policies/RiskWarnings";
import Certificates from "./pages/Certificates";
import Login from "./pages/Login";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";
import AdminRoutes from "./routes/AdminRoutes";

import PortalLayout from "./components/PortalLayout";
import PortalDashboard from "./pages/portal/PortalDashboard";
import MarketCalls from "./pages/portal/MarketCalls";
import LatestNews from "./pages/portal/LatestNews";
import Notifications from "./pages/portal/Notifications";
import SupportTickets from "./pages/portal/SupportTickets";
import Profile from "./pages/portal/Profile";
import PortalChat from "./pages/portal/PortalChat";

import KycVerification from "./pages/portal/KycVerification";
import Plans from "./pages/portal/Plans";
import Invoices from "./pages/portal/Invoices";
import Agreements from "./pages/portal/Agreements";
import InvoiceDetails from "./pages/portal/InvoiceDetails";
import PageMetaTracker from "./components/PageMetaTracker";

function App() {
  return (
    <BrowserRouter>
      <PageMetaTracker />
      <ThemeProvider>
        <AuthProvider>
          <AppDataProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                {/* <Route path="home2" element={<Home2 />} /> */}
                <Route path="about" element={<About />} />
                <Route path="services" element={<Service />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogDetails />} />
                <Route path="payments" element={<Payments />} />
                <Route path="complaints" element={<Complaints />} />
                <Route path="sebi-disclosures" element={<SebiDisclosures />} />
                <Route path="disclaimers" element={<Disclaimers />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="refund-policy" element={<RefundPolicy />} />
                <Route path="investor-charter" element={<InvestorCharter />} />
                <Route path="terms-and-conditions" element={<TermsConditions />} />
                <Route path="grievance-escalation-matrix" element={<GrievanceMatrix />} />
                <Route path="account-deletion" element={<AccountDeletion />} />
                <Route path="code-of-conduct" element={<CodeOfConduct />} />
                <Route path="grievance-redressal-policy" element={<GrievanceRedressalPolicy />} />
                <Route path="internal-policy" element={<InternalPolicy />} />
                <Route path="mitc" element={<Mitc />} />
                <Route path="pmla-policy" element={<PmlaPolicy />} />
                <Route path="risk-warnings" element={<RiskWarnings />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="login" element={<Login />} />
                <Route path="contact" element={<Contact />} />
                <Route path="sitemap" element={<Sitemap />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="/portal" element={<PortalLayout />}>
                <Route index element={<PortalDashboard />} />
                <Route path="kyc" element={<KycVerification />} />
                <Route path="market-calls" element={<MarketCalls />} />
                <Route path="latest-news" element={<LatestNews />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="support-tickets" element={<SupportTickets />} />
                <Route path="chat" element={<PortalChat />} />
                <Route path="profile" element={<Profile />} />
                <Route path="plans" element={<Plans />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="agreements" element={<Agreements />} />
                <Route path="invoices/:id" element={<InvoiceDetails />} />
              </Route>

              {AdminRoutes}
            </Routes>
          </AppDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
