import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppDataProvider } from "./context/AppDataContext";
import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import About from "./pages/About";
import Service from "./pages/Service";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Contact from "./pages/Contact";
import Payments from "./pages/Payments";
import Complaints from "./pages/Complaints";
import SebiDisclosures from "./pages/SebiDisclosures";
import Disclaimers from "./pages/Disclaimers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import InvestorCharter from "./pages/InvestorCharter";
import TermsConditions from "./pages/TermsConditions";
import GrievanceMatrix from "./pages/GrievanceMatrix";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminRoutes from "./routes/AdminRoutes";

import PortalLayout from "./components/PortalLayout";
import PortalDashboard from "./pages/portal/PortalDashboard";
import MarketCalls from "./pages/portal/MarketCalls";
import LatestNews from "./pages/portal/LatestNews";
import Notifications from "./pages/portal/Notifications";
import SupportTickets from "./pages/portal/SupportTickets";
import Profile from "./pages/portal/Profile";

import KycVerification from "./pages/portal/KycVerification";
import Plans from "./pages/portal/Plans";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppDataProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home2" element={<Home2 />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Service />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog-details" element={<BlogDetails />} />
          <Route path="payments" element={<Payments />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="sebi-disclosures" element={<SebiDisclosures />} />
          <Route path="disclaimers" element={<Disclaimers />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="refund-policy" element={<RefundPolicy />} />
          <Route path="investor-charter" element={<InvestorCharter />} />
          <Route path="terms-and-conditions" element={<TermsConditions />} />
          <Route path="grievance-escalation-matrix" element={<GrievanceMatrix />} />
          <Route path="login" element={<Login />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<PortalDashboard />} />
          <Route path="kyc" element={<KycVerification />} />
          <Route path="market-calls" element={<MarketCalls />} />
          <Route path="latest-news" element={<LatestNews />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="support-tickets" element={<SupportTickets />} />
          <Route path="profile" element={<Profile />} />
          <Route path="plans" element={<Plans />} />
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
