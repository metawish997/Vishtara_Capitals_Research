import React from "react";
import { Link } from "react-router-dom";

export default function RefundPolicy() {
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
                        <li>Refund Policy</li>
                     </ul>
                     <h2 className="tp-breadcrumb-title">Refund Policy</h2>
                     <p>Subscription and cancellation refund terms.</p>
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
                     <h3 style={{ color: "var(--primary)", marginBottom: "25px" }}>Refund &amp; Cancellation Policy</h3>
                     
                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>1. Non-Refundable Nature</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        Due to the digital, instantaneous delivery of research alerts, all subscription fee payments made to Vishtara Capital Research are non-refundable once the service access has been activated on your registered number/email.
                     </p>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>2. Trial Service</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        We do not offer any paid or unpaid trials. All users are requested to evaluate our past performance history and read our policies carefully before making a subscription purchase.
                     </p>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>3. Premature Termination Refund</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)" }}>
                        In accordance with SEBI guidelines, in the event of a mutual premature termination of research analyst services, any advance fees collected (which shall not exceed one quarter's fee) will be refunded on a pro-rata basis for the remaining unexpired service period.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
