import React from "react";
import { Link } from "react-router-dom";

export default function Complaints() {
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
                           <li>Complaints</li>
                        </ul>
                        <h2 className="tp-breadcrumb-title">Investor Complaints</h2>
                        <p>Transparency &amp; Disclosures: Monthly Investor Complaint Data as per SEBI regulations.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         

         
         <div className="tp-contact-ptb tp-sec-ptb upt-120 upb-120">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-12">
                     <div className="tp-contact-wrapper" style={{ padding: "40px", borderRadius: "10px", border: "1px solid var(--card-border, #D9E1EA)", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                        
                        <div className="tp-contact-heading umb-40">
                           <span className="tp-section-sub">Transparency &amp; Disclosures</span>
                           <h3 className="tp-section-title" style={{ fontSize: "28px", color: "var(--primary)" }}>Monthly Investor Complaint Data</h3>
                           <p style={{ marginTop: "10px", fontSize: "15px" }}>
                              In compliance with SEBI guidelines, the disclosure of investor complaints is updated by the 7th of every succeeding month in accordance with the SEBI Master Circular (Annexure E).
                           </p>
                        </div>

                        <div className="table-responsive" style={{ overflowX: "auto", marginTop: "30px" }}>
                           <table className="table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "15px" }}>
                              <thead>
                                 <tr style={{ backgroundColor: "#6E87A8", color: "#ffffff" }}>
                                    <th style={{ padding: "16px 20px", fontWeight: "600", textTransform: "uppercase", fontSize: "13px", letterSpacing: "0.5px" }}>Source</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "600", textTransform: "uppercase", fontSize: "13px", letterSpacing: "0.5px", textAlign: "center" }}>Pending (Prev.)</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "600", textTransform: "uppercase", fontSize: "13px", letterSpacing: "0.5px", textAlign: "center" }}>Received</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "600", textTransform: "uppercase", fontSize: "13px", letterSpacing: "0.5px", textAlign: "center" }}>Resolved</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "600", textTransform: "uppercase", fontSize: "13px", letterSpacing: "0.5px", textAlign: "center" }}>Total Pending</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "600", textTransform: "uppercase", fontSize: "13px", letterSpacing: "0.5px", textAlign: "center" }}>Pending &gt;3M</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "600", textTransform: "uppercase", fontSize: "13px", letterSpacing: "0.5px", textAlign: "center" }}>Avg. Days</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {[
                                    { source: "Directly from Investors", pendingPrev: 0, received: 0, resolved: 0, totalPending: 0, pendingOver3m: 0, avgDays: 0 },
                                    { source: "SEBI (SCORES)", pendingPrev: 0, received: 0, resolved: 0, totalPending: 0, pendingOver3m: 0, avgDays: 0 },
                                    { source: "Other Sources", pendingPrev: 0, received: 0, resolved: 0, totalPending: 0, pendingOver3m: 0, avgDays: 0 }
                                 ].map((row, index) => (
                                    <tr key={index} style={{ borderBottom: "1px solid #e9ecef" }}>
                                       <td style={{ padding: "18px 20px", fontWeight: "500", color: "#1B2B40" }}>{row.source}</td>
                                       <td style={{ padding: "18px 20px", textAlign: "center", color: "#1B2B40" }}>{row.pendingPrev}</td>
                                       <td style={{ padding: "18px 20px", textAlign: "center", color: "#1B2B40" }}>{row.received}</td>
                                       <td style={{ padding: "18px 20px", textAlign: "center", color: "#1B2B40" }}>{row.resolved}</td>
                                       <td style={{ padding: "18px 20px", textAlign: "center", color: "#1B2B40" }}>{row.totalPending}</td>
                                       <td style={{ padding: "18px 20px", textAlign: "center", color: "#1B2B40" }}>{row.pendingOver3m}</td>
                                       <td style={{ padding: "18px 20px", textAlign: "center", color: "#1B2B40" }}>{row.avgDays}</td>
                                    </tr>
                                 ))}
                                 <tr style={{ backgroundColor: "#f8fafc", fontWeight: "bold", borderBottom: "2px solid #e2e8f0" }}>
                                    <td style={{ padding: "18px 20px", color: "var(--primary)" }}>Grand Total</td>
                                    <td style={{ padding: "18px 20px", textAlign: "center", color: "var(--primary)" }}>0</td>
                                    <td style={{ padding: "18px 20px", textAlign: "center", color: "var(--primary)" }}>0</td>
                                    <td style={{ padding: "18px 20px", textAlign: "center", color: "var(--primary)" }}>0</td>
                                    <td style={{ padding: "18px 20px", textAlign: "center", color: "var(--primary)" }}>0</td>
                                    <td style={{ padding: "18px 20px", textAlign: "center", color: "var(--primary)" }}>0</td>
                                    <td style={{ padding: "18px 20px", textAlign: "center", color: "var(--primary)" }}>0</td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>

                        <div className="d-flex flex-wrap justify-content-between align-items-center mt-4 p-3 radius-6" style={{ backgroundColor: "#f8fafc", borderLeft: "4px solid var(--tp-finance-primary)", fontSize: "14px", color: "var(--text-dark, #1B2B40)" }}>
                           <div>
                              <strong>Data for month ending:</strong> June 2026
                           </div>
                           <div style={{ marginLeft: "auto" }}>
                              <strong>Complaints received due to impersonation by another entity:</strong> 0
                           </div>
                        </div>

                     </div>
                  </div>
               </div>
            </div>
         </div>

    </main>
  );
}
