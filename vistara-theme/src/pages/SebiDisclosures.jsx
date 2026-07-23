import React from "react";
import { Link } from "react-router-dom";

export default function SebiDisclosures() {
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
                        <li>SEBI Disclosures</li>
                     </ul>
                     <h2 className="tp-breadcrumb-title">SEBI Disclosures</h2>
                     <p>Official regulatory and licensing disclosures for Vishtara Capital Research.</p>
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
                     <h3 style={{ color: "var(--primary)", marginBottom: "25px" }}>SEBI Registration &amp; Intermediary Status</h3>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-dark, #1B2B40)", marginBottom: "15px" }}>
                        Vishtara Capital Research is registered with the Securities and Exchange Board of India (SEBI) as a Research Analyst. We operate in strict compliance with the SEBI (Research Analyst) Regulations, 2014, and subsequent circulars.
                     </p>
                     
                     <div style={{ padding: "25px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "30px" }}>
                        <h4 style={{ fontSize: "18px", color: "var(--primary)", marginBottom: "15px" }}>Key Registration Information</h4>
                        <ul style={{ listStyleType: "none", padding: 0, margin: 0, fontSize: "15px", lineHeight: "2" }}>
                           <li><strong>Name of Research Analyst:</strong> Anujay Chouhan</li>
                           <li><strong>SEBI Registration Number:</strong> INH000027779</li>
                           <li><strong>Type of Registration:</strong> Individual</li>
                           <li><strong>Validity of Registration:</strong> Perpetual</li>
                           <li><strong>Registered Office Address:</strong> C-20/1, Mahananda Nagar, Ujjain (M.P.), India</li>
                           <li><strong>Phone:</strong> +91 86020 27324</li>
                           <li><strong>Email:</strong> chouhananujay@gmail.com</li>
                        </ul>
                     </div>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>Regulatory Standard Declaration</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "15px" }}>
                        Registration granted by SEBI, membership of BASL (if applicable), and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.
                     </p>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>CeFCoM Notification</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)" }}>
                        For payments towards research services, clients can avail themselves of the optional Centralised Fee Collection Mechanism (CeFCoM) managed by BSE Limited (RAASB) as per regulatory norms.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
