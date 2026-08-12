import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main>
      <div className="tp-contact-ptb tp-sec-ptb upt-180 upb-120" style={{ backgroundColor: "#f8fafc", minHeight: "80vh", display: "flex", alignItems: "center" }}>
         <div className="container">
            <div className="row justify-content-center text-center">
               <div className="col-lg-6 col-md-8">
                  <div style={{ padding: "50px 40px", borderRadius: "10px", border: "1px solid var(--card-border, #D9E1EA)", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                     
                     <div className="umb-30">
                        <span style={{ fontSize: "120px", fontWeight: "900", color: "var(--primary)", lineHeight: "1", display: "block" }}>404</span>
                        <span style={{ fontSize: "20px", fontWeight: "700", color: "var(--tp-theme-secondary)", textTransform: "uppercase", letterSpacing: "2px", display: "block", marginTop: "10px" }}>Page Not Found</span>
                     </div>

                     <p style={{ fontSize: "16px", color: "var(--text-muted, #6F7D90)", lineHeight: "1.8", marginBottom: "35px" }}>
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                     </p>

                     <Link 
                        to="/" 
                        className="tp-btn" 
                        style={{ padding: "12px 35px", fontSize: "15px", backgroundColor: "var(--primary)", borderColor: "var(--primary)" }}
                     >
                        Go Back Home
                     </Link>

                  </div>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
