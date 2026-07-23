import React from "react";
import { Link } from "react-router-dom";

export default function Disclaimers() {
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
                        <li>Disclaimers</li>
                     </ul>
                     <h2 className="tp-breadcrumb-title">Disclaimers</h2>
                     <p>Investment and research advisory risks disclaimer.</p>
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
                     <h3 style={{ color: "var(--primary)", marginBottom: "25px" }}>Standard Disclaimers</h3>
                     
                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>1. Market Risks</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        Investment in securities market are subject to market risks. Read all the related documents carefully before investing. Recommendations are based on technical analysis and historical data, which do not guarantee future performance.
                     </p>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>2. No Guaranteed Returns</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        Vishtara Capital Research does not offer any schemes of assured, guaranteed, fixed, or portfolio-sharing returns. Subscribers should exercise caution and practice proper risk control.
                     </p>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>3. Execution Disclaimer</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        We only provide research-backed alerts. Execution of trades (buying/selling) is at the sole discretion of the subscriber, and we are not liable for any capital gains or losses resulting from these actions.
                     </p>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>4. SEBI Disclaimer</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)" }}>
                        SEBI Registration No. INH000027779. Registration granted by SEBI, enlistment with BSE, and certification from NISM in no way guarantee the performance of the intermediary or provide any assurance of returns to investors.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
