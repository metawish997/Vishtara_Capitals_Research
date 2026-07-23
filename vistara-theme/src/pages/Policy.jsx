import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Policy() {
  const [activeTab, setActiveTab] = useState("privacy");

  const tabs = [
    { id: "privacy", label: "Privacy Policy" },
    { id: "terms", label: "Terms & Conditions" },
    { id: "refund", label: "Refund Policy" },
    { id: "disclosure", label: "SEBI Disclosure" }
  ];

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
                           <li>Policies</li>
                        </ul>
                        <h2 className="tp-breadcrumb-title">Our Policies</h2>
                        <p>Important disclosures, terms of service, refund rules, and privacy protections at Vishtara Capital Research.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         

         
         <div className="tp-contact-ptb tp-sec-ptb upt-120 upb-120">
            <div className="container">
               <div className="row">
                  
                  
                  <div className="col-lg-3 col-md-12 umb-40">
                     <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--card-border, #D9E1EA)" }}>
                        {tabs.map((tab) => (
                           <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              style={{
                                 padding: "12px 20px",
                                 textAlign: "left",
                                 borderRadius: "6px",
                                 border: "none",
                                 fontSize: "15px",
                                 fontWeight: "600",
                                 cursor: "pointer",
                                 transition: "all 0.3s",
                                 backgroundColor: activeTab === tab.id ? "var(--primary)" : "transparent",
                                 color: activeTab === tab.id ? "#ffffff" : "var(--text-dark, #1B2B40)"
                              }}
                           >
                              {tab.label}
                           </button>
                        ))}
                     </div>
                  </div>

                  
                  <div className="col-lg-9 col-md-12">
                     <div style={{ padding: "40px", borderRadius: "10px", border: "1px solid var(--card-border, #D9E1EA)", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", minHeight: "500px" }}>
                        
                        {activeTab === "privacy" && (
                           <div>
                              <h3 style={{ color: "var(--primary)", marginBottom: "20px" }}>Privacy Policy</h3>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "15px" }}>
                                 At Vishtara Capital Research, we value your trust and are committed to protecting the personal information you share with us. This Privacy Policy details how we collect, store, and utilize your personal data when you subscribe to our advisory alerts or use our website.
                              </p>
                              <h4 style={{ color: "var(--text-dark, #1B2B40)", marginTop: "20px", marginBottom: "10px" }}>1. Information Collection</h4>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "15px" }}>
                                 We collect only the essential details required to deliver our research alerts, including your name, email address, mobile number, and compliance documents as needed by regulatory guidelines.
                              </p>
                              <h4 style={{ color: "var(--text-dark, #1B2B40)", marginTop: "20px", marginBottom: "10px" }}>2. Data Security &amp; Usage</h4>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)" }}>
                                 Your personal data is encrypted and kept secure. We never sell, lease, or distribute subscriber details to third-party marketing companies. Data is exclusively used to send research alerts and compliance updates.
                              </p>
                           </div>
                        )}

                        {activeTab === "terms" && (
                           <div>
                              <h3 style={{ color: "var(--primary)", marginBottom: "20px" }}>Terms &amp; Conditions</h3>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "15px" }}>
                                 By subscribing to the advisory alerts or visiting the website of Vishtara Capital Research, you agree to comply with the terms and conditions outlined below.
                              </p>
                              <h4 style={{ color: "var(--text-dark, #1B2B40)", marginTop: "20px", marginBottom: "10px" }}>1. Nature of Advisory</h4>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "15px" }}>
                                 All alerts and research insights are provided strictly for informational and educational purposes. We do not run portfolio management services (PMS), execute trades on behalf of clients, or handle client capital directly.
                              </p>
                              <h4 style={{ color: "var(--text-dark, #1B2B40)", marginTop: "20px", marginBottom: "10px" }}>2. Investment Risk</h4>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)" }}>
                                 Stock market investments are subject to market risks. Subscribers are advised to practice proper position sizing and execute stop-losses as research alerts contain structured risk levels. We are not liable for trading losses.
                              </p>
                           </div>
                        )}

                        {activeTab === "refund" && (
                           <div>
                              <h3 style={{ color: "var(--primary)", marginBottom: "20px" }}>Refund &amp; Cancellation Policy</h3>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "15px" }}>
                                 Our research alerts are sent dynamically based on live market analysis. Please review our refund terms before registering.
                              </p>
                              <h4 style={{ color: "var(--text-dark, #1B2B40)", marginTop: "20px", marginBottom: "10px" }}>1. No Refund Policy</h4>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "15px" }}>
                                 Due to the digital and real-time advisory nature of our research feeds, all subscription fee payments are non-refundable once the service access has been activated on your registered number/email.
                              </p>
                              <h4 style={{ color: "var(--text-dark, #1B2B40)", marginTop: "20px", marginBottom: "10px" }}>2. Service Cancellation</h4>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)" }}>
                                 Subscribers may cancel their auto-renewal configurations at any time. Active service access will remain valid until the expiration of the current billing cycle.
                              </p>
                           </div>
                        )}

                        {activeTab === "disclosure" && (
                           <div>
                              <h3 style={{ color: "var(--primary)", marginBottom: "20px" }}>SEBI Regulatory Disclosure</h3>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "15px" }}>
                                 Vishtara Capital Research operates in strict compliance with the SEBI (Research Analyst) Regulations, 2014.
                              </p>
                              <h4 style={{ color: "var(--text-dark, #1B2B40)", marginTop: "20px", marginBottom: "10px" }}>1. Registration Details</h4>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "15px" }}>
                                 <strong>SEBI Registered Research Analyst:</strong> Anujay Chouhan <br />
                                 <strong>Registration Number:</strong> INH000027779 <br />
                                 <strong>Registered Address:</strong> C-20/1, Mahananda Nagar, Ujjain (M.P.), India
                              </p>
                              <h4 style={{ color: "var(--text-dark, #1B2B40)", marginTop: "20px", marginBottom: "10px" }}>2. Disclaimers</h4>
                              <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)" }}>
                                 We do not provide guaranteed returns, target assurances, or profit-sharing accounts. Stock recommendations are based purely on technical indicators and structural market setups. Past performance does not guarantee future results.
                              </p>
                           </div>
                        )}

                     </div>
                  </div>

               </div>
            </div>
         </div>
         
    </main>
  );
}
