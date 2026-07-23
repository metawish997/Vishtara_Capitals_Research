import React from "react";
import { Link } from "react-router-dom";

export default function InvestorCharter() {
  return (
    <main>
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
                        <li>Investor Charter</li>
                     </ul>
                     <h2 className="tp-breadcrumb-title">Investor Charter</h2>
                     <p>SEBI mandated Investor Charter for Research Analysts.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="tp-contact-ptb tp-sec-ptb upt-120 upb-120">
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-lg-10">
                  <div style={{ padding: "40px", borderRadius: "10px", border: "1px solid var(--card-border, #D9E1EA)", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                     <h3 style={{ color: "var(--primary)", marginBottom: "25px" }}>Investor Charter - Research Analyst</h3>
                     
                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>A. Vision and Mission Statements for Investors</h4>
                     <ul style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        <li><strong>Vision:</strong> To provide high-quality and unbiased research reports to assist investors in taking informed investment decisions.</li>
                        <li><strong>Mission:</strong> To conduct research analysis with high standards of integrity, due diligence, and compliance with SEBI rules.</li>
                     </ul>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>B. Details of Business Transacted by Research Analyst</h4>
                     <ul style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        <li>Publishing research reports based on systematic analysis.</li>
                        <li>Providing buy/sell/hold recommendations.</li>
                        <li>Disclosing financial interest, shareholding, or associations.</li>
                     </ul>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>C. Rights and Duties of Investors</h4>
                     <ul style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        <li><strong>Rights:</strong> To receive unbiased research reports, verify credentials, and access grievance redressal processes.</li>
                        <li><strong>Duties:</strong> To pay fees via official banking channels and read disclosure reports thoroughly before acting.</li>
                     </ul>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>D. Timelines for Resolution of Investor Grievances</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)" }}>
                        Any grievance or complaint received directly from investors or via SEBI (SCORES) shall be addressed and resolved within a maximum period of 30 calendar days from receipt.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
