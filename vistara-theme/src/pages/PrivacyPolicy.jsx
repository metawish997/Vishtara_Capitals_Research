import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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
                        <li>Privacy Policy</li>
                     </ul>
                     <h2 className="tp-breadcrumb-title">Privacy Policy</h2>
                     <p>How we protect your personal and subscription details.</p>
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
                     <h3 style={{ color: "var(--primary)", marginBottom: "25px" }}>Privacy Policy</h3>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        At Vishtara Capital Research, we value your privacy and trust. We gather and handle personal details (such as Name, Email, and Phone Number) solely for compliance purposes and to deliver subscribed research alerts.
                     </p>
                     
                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>Data Sharing &amp; Security</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        We employ strict digital encryption methods to store client records safely. Vishtara Capital Research does not sell, distribute, or leak database records to third-party advertisers. All collected details are kept confidential.
                     </p>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>Policy Modifications</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)" }}>
                        Any changes to this policy will be highlighted on this page. Subscribers are encouraged to review these privacy guidelines periodically.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
