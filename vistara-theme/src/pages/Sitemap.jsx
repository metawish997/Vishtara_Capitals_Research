import React from "react";
import { Link } from "react-router-dom";

export default function Sitemap() {
  return (
    <main>
       <style>{`
          .sitemap-widget {
             background: #f8fafc;
             border: 1px solid var(--card-border, #D9E1EA);
          }
          html[data-theme="dark"] .sitemap-widget,
          body.high-contrast .sitemap-widget {
             background: #1A2735;
             border-color: rgba(255, 255, 255, 0.1);
          }
          html[data-theme="dark"] .sitemap-widget h2,
          body.high-contrast .sitemap-widget h2 {
             color: #F8FAFC !important;
          }
          html[data-theme="dark"] .sitemap-widget a,
          body.high-contrast .sitemap-widget a {
             color: #CBD5E1 !important;
          }
          html[data-theme="dark"] .sitemap-widget a:hover,
          body.high-contrast .sitemap-widget a:hover {
             color: #FBB040 !important;
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
                         <li>Sitemap</li>
                      </ul>
                      <h1 className="tp-breadcrumb-title">Sitemap</h1>
                      <p>A complete overview of all public pages and resources available on Vishtara Capital Research.</p>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div className="tp-contact-ptb tp-sec-ptb upt-80 upb-120">
          <div className="container">
             <div className="row">
                <div className="col-lg-4 col-md-6 umb-40">
                   <div className="sitemap-widget" style={{ padding: "30px", borderRadius: "10px", height: "100%" }}>
                      <h2 style={{ fontSize: "22px", marginBottom: "20px", color: "var(--tp-theme-primary)" }}>Main Pages</h2>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "2.5" }}>
                         <li><Link to="/" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Home</Link></li>
                         <li><Link to="/about" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">About Us</Link></li>
                         <li><Link to="/services" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Services</Link></li>
                         <li><Link to="/blog" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Market Insights (Blog)</Link></li>
                         <li><Link to="/contact" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Contact Us</Link></li>
                      </ul>
                   </div>
                </div>

                <div className="col-lg-4 col-md-6 umb-40">
                   <div className="sitemap-widget" style={{ padding: "30px", borderRadius: "10px", height: "100%" }}>
                      <h2 style={{ fontSize: "22px", marginBottom: "20px", color: "var(--tp-theme-primary)" }}>Account & Resources</h2>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "2.5" }}>
                         <li><Link to="/login" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Login / Sign Up</Link></li>
                         <li><Link to="/payments" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Payments</Link></li>
                         <li><Link to="/certificates" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Certificates & Credentials</Link></li>
                      </ul>
                   </div>
                </div>

                <div className="col-lg-4 col-md-6 umb-40">
                   <div className="sitemap-widget" style={{ padding: "30px", borderRadius: "10px", height: "100%" }}>
                      <h2 style={{ fontSize: "22px", marginBottom: "20px", color: "var(--tp-theme-primary)" }}>Policies & Legal</h2>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "2.5" }}>
                         <li><Link to="/privacy-policy" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Privacy Policy</Link></li>
                         <li><Link to="/terms-and-conditions" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Terms & Conditions</Link></li>
                         <li><Link to="/refund-policy" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Refund Policy</Link></li>
                         <li><Link to="/sebi-disclosures" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">SEBI Disclosures</Link></li>
                         <li><Link to="/disclaimers" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Disclaimers</Link></li>
                         <li><Link to="/investor-charter" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Investor Charter</Link></li>
                         <li><Link to="/grievance-redressal-policy" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Grievance Redressal Policy</Link></li>
                         <li><Link to="/grievance-escalation-matrix" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Grievance Escalation Matrix</Link></li>
                         <li><Link to="/complaints" style={{ color: "var(--text-dark)", textDecoration: "none", fontWeight: "500" }} className="tp-line-anim">Complaint Board</Link></li>
                      </ul>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </main>
  );
}
