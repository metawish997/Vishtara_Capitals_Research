import React from "react";
import { Link } from "react-router-dom";

export default function GrievanceMatrix() {
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
                        <li>Grievance Matrix</li>
                     </ul>
                     <h2 className="tp-breadcrumb-title">Grievance Matrix</h2>
                     <p>Step-by-step escalation path for investor complaints.</p>
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
                     <h3 style={{ color: "var(--primary)", marginBottom: "25px" }}>Grievance Redressal &amp; Escalation Matrix</h3>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)", marginBottom: "20px" }}>
                        In case of any grievance or query, please follow the escalation path below to reach our compliance desk for a prompt resolution.
                     </p>

                     <div className="table-responsive" style={{ overflowX: "auto", marginBottom: "30px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "15px" }}>
                           <thead>
                              <tr style={{ backgroundColor: "#6E87A8", color: "#ffffff" }}>
                                 <th style={{ padding: "12px 15px" }}>Level</th>
                                 <th style={{ padding: "12px 15px" }}>Designation</th>
                                 <th style={{ padding: "12px 15px" }}>Contact Person</th>
                                 <th style={{ padding: "12px 15px" }}>Email</th>
                                 <th style={{ padding: "12px 15px" }}>Contact No</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr style={{ borderBottom: "1px solid #e9ecef" }}>
                                 <td style={{ padding: "15px", fontWeight: "600" }}>Level 1</td>
                                 <td style={{ padding: "15px" }}>Support Helpdesk</td>
                                 <td style={{ padding: "15px" }}>Support Team</td>
                                 <td style={{ padding: "15px" }}><a href="mailto:chouhananujay@gmail.com" style={{ color: "var(--primary)" }}>chouhananujay@gmail.com</a></td>
                                 <td style={{ padding: "15px" }}>+91 86020 27324</td>
                              </tr>
                              <tr style={{ borderBottom: "1px solid #e9ecef", backgroundColor: "#f8fafc" }}>
                                 <td style={{ padding: "15px", fontWeight: "600" }}>Level 2</td>
                                 <td style={{ padding: "15px" }}>Compliance Officer</td>
                                 <td style={{ padding: "15px" }}>Anujay Chouhan</td>
                                 <td style={{ padding: "15px" }}><a href="mailto:chouhananujay@gmail.com" style={{ color: "var(--primary)" }}>chouhananujay@gmail.com</a></td>
                                 <td style={{ padding: "15px" }}>+91 86020 27324</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>

                     <h4 style={{ color: "var(--text-dark, #1B2B40)", marginBottom: "10px" }}>Escalation to SEBI</h4>
                     <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-muted, #6F7D90)" }}>
                        If the grievance is not resolved to your satisfaction within 30 days, you can lodge a formal complaint with SEBI through the SCORES (SEBI Complaints Redress System) online portal at <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", fontWeight: "600" }}>scores.sebi.gov.in</a>.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
