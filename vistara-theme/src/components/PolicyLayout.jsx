import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function PolicyLayout({ title, description, children }) {
   const location = useLocation();

   const tabs = [
      { url: "/privacy-policy", label: "Privacy Policy" },
      { url: "/terms-and-conditions", label: "Terms & Conditions" },
      { url: "/refund-policy", label: "Refund Policy" },
      { url: "/sebi-disclosures", label: "SEBI Disclosures" },
      { url: "/disclaimers", label: "Disclaimers" },
      { url: "/investor-charter", label: "Investor Charter" },
      { url: "/grievance-redressal-policy", label: "Grievance Redressal" },
      { url: "/grievance-escalation-matrix", label: "Escalation Matrix" },
      { url: "/complaints", label: "Complaint Board" },
      { url: "/pmla-policy", label: "PMLA Policy" },
      { url: "/internal-policy", label: "Internal Policy" },
      { url: "/code-of-conduct", label: "Code Of Conduct" },
      { url: "/mitc", label: "MITC" },
      { url: "/risk-warnings", label: "Risk Warnings" },
      { url: "/account-deletion", label: "Account Deletion" }
   ];

   return (
      <main>
         <style>{`
          html[data-theme="dark"] .tp-breadcrumb-content p,
          html[data-theme="dark"] .tp-breadcrumb-content h2.tp-breadcrumb-title,
          html[data-theme="dark"] .tp-breadcrumb-list li {
             color: #ffffff !important;
          }
          
          html[data-theme="dark"] .payments-page-card,
          body.high-contrast .payments-page-card {
             background: #1A2735 !important;
             border-color: rgba(255, 255, 255, 0.1) !important;
          }
          
          .payments-page-card p,
          .payments-page-card li {
             color: #334155 !important;
             font-weight: 500 !important;
          }
          
          html[data-theme="dark"] .payments-page-card h3,
          html[data-theme="dark"] .payments-page-card h4,
          html[data-theme="dark"] .payments-page-card p,
          html[data-theme="dark"] .payments-page-card li,
          body.high-contrast .payments-page-card h3,
          body.high-contrast .payments-page-card h4,
          body.high-contrast .payments-page-card p,
          body.high-contrast .payments-page-card li {
             color: #ffffff !important;
          }
          
          html[data-theme="dark"] .policy-sidebar-btn:not(.active-tab),
          body.high-contrast .policy-sidebar-btn:not(.active-tab) {
             color: #ffffff !important;
          }
          
          .policy-sidebar-btn.active-tab,
          html[data-theme="dark"] .policy-sidebar-btn.active-tab,
          body.high-contrast .policy-sidebar-btn.active-tab {
             color: #222F30 !important;
          }

          /* ROBUST DARK MODE OVERRIDES FOR POLICY CONTENT (ACCESSIBILITY FIX) */
          html[data-theme="dark"] .policy-content-wrapper div,
          html[data-theme="dark"] .policy-content-wrapper section {
             background-color: transparent !important;
             border-color: rgba(255, 255, 255, 0.1) !important;
          }
          
          html[data-theme="dark"] .policy-content-wrapper h1,
          html[data-theme="dark"] .policy-content-wrapper h2,
          html[data-theme="dark"] .policy-content-wrapper h3,
          html[data-theme="dark"] .policy-content-wrapper h4,
          html[data-theme="dark"] .policy-content-wrapper h5,
          html[data-theme="dark"] .policy-content-wrapper h6,
          html[data-theme="dark"] .policy-content-wrapper strong,
          html[data-theme="dark"] .policy-content-wrapper [class*="text-slate-900"],
          html[data-theme="dark"] .policy-content-wrapper [class*="text-slate-800"] {
             color: #F8FAFC !important;
          }

          html[data-theme="dark"] .policy-content-wrapper p,
          html[data-theme="dark"] .policy-content-wrapper li,
          html[data-theme="dark"] .policy-content-wrapper span,
          html[data-theme="dark"] .policy-content-wrapper [class*="text-slate-700"],
          html[data-theme="dark"] .policy-content-wrapper [class*="text-slate-600"],
          html[data-theme="dark"] .policy-content-wrapper [class*="text-slate-500"] {
             color: #CBD5E1 !important;
          }
          
          html[data-theme="dark"] .policy-content-wrapper .text-\[\#0939a4\] {
             color: #FBB040 !important;
          }
          
          html[data-theme="dark"] .policy-content-wrapper .bg-\[\#0939a4\]\/10,
          html[data-theme="dark"] .policy-content-wrapper .bg-\[\#0939a4\]\/5 {
             background-color: rgba(251, 176, 64, 0.15) !important;
          }

          .hide-scrollbar::-webkit-scrollbar {
             display: none;
          }
          .hide-scrollbar {
             -ms-overflow-style: none;
             scrollbar-width: none;
          }
       `}</style>
         <div className="tp-breadcrumb-ptb upt-90 upb-70 z-index-1">
            <div className="tp-cc-chose-bg">
               <img src="/assets/img/breadcrumb/image-1.jpg" alt="" />
            </div>
            <div className="container">
               <div className="row">
                  <div className="col-lg-6">
                     <div className="tp-breadcrumb-content p-relative">
                        <ul className="tp-breadcrumb-list">
                           <li><Link to="/">Home</Link></li>
                           <li>&gt;</li>
                           <li>Policies &amp; Legal</li>
                        </ul>
                        <h1 className="tp-breadcrumb-title">{title}</h1>
                        <p>{description}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="tp-contact-ptb tp-sec-ptb upt-120 upb-120">
            <div className="container">
               <div className="row">

                  <div className="col-lg-3 col-md-12 umb-40">
                     <div className="payments-page-card" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--card-border, #D9E1EA)" }}>
                        {tabs.map((tab) => {
                           const isActive = location.pathname === tab.url || location.pathname === tab.url + "/";
                           return (
                              <Link
                                 key={tab.url}
                                 to={tab.url}
                                 className={`policy-sidebar-btn ${isActive ? "active-tab" : ""}`}
                                 style={{
                                    padding: "12px 20px",
                                    textAlign: "left",
                                    borderRadius: "6px",
                                    border: "none",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s",
                                    backgroundColor: isActive ? "var(--tp-advisory-yellow, #F59E0B)" : "transparent",
                                    color: isActive ? "#222F30" : "var(--policy-sidebar-text, #1B2B40)",
                                    display: "block",
                                    textDecoration: "none"
                                 }}
                              >
                                 {tab.label}
                              </Link>
                           );
                        })}
                     </div>
                  </div>

                  <div className="col-lg-9 col-md-12">
                     <div className="payments-page-card hide-scrollbar policy-content-wrapper" style={{ padding: "40px", borderRadius: "10px", border: "1px solid var(--card-border, #D9E1EA)", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", height: "calc(100vh - 200px)", overflowY: "auto" }}>
                        {children}
                     </div>
                  </div>

               </div>
            </div>
         </div>
      </main>
   );
}
