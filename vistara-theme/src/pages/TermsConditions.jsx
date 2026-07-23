import React from "react";
import { Link } from "react-router-dom";

export default function TermsConditions() {
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
                        <li>Terms &amp; Conditions</li>
                     </ul>
                     <h2 className="tp-breadcrumb-title">Terms &amp; Conditions</h2>
                     <p>Rules and regulations for website use and advisory alerts.</p>
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
                     <h3 style={{ color: "var(--primary)", marginBottom: "25px" }}>Terms &amp; Conditions</h3>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        Welcome to Vishtara Capital Research. By subscribing to our research recommendations or accessing our digital portal, you agree to comply with and be bound by the following terms of service.
                     </p>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>1. Advisory Limitations</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        All advice is non-discretionary and informational in nature. Subscribed users are solely responsible for executing trades in their brokerage accounts. We do not support profit-sharing pools or guaranteed performance products.
                     </p>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>2. Subscriber Responsibilities</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        Subscribers must pay fees only via official banking channels (UPI, Net Banking, NEFT, Cheque). Sharing or redistributing research alerts to non-subscribers is strictly prohibited and will lead to service termination.
                     </p>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>3. Jurisdiction</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)" }}>
                        Any legal disputes arising from advisory services or website usage will be subject to the exclusive jurisdiction of the courts of Ujjain, Madhya Pradesh, India.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
