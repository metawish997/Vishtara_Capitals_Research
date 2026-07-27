import React from "react";
import PolicyLayout from "../components/PolicyLayout";

export default function Complaints() {
   return (
      <PolicyLayout title="Complaint Board" description="Monthly investor complaint data and metrics.">
         <h3 style={{ fontSize: "28px", color: "var(--primary)", marginBottom: "10px" }}>Monthly Investor Complaint Data</h3>
         <p style={{ marginTop: "10px", fontSize: "15px", color: "var(--text-muted, #6F7D90)" }}>
            In compliance with SEBI guidelines, the disclosure of investor complaints is updated by the 7th of every succeeding month in accordance with the SEBI Master Circular (Annexure E).
         </p>

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
                     <tr key={index} className="bank-item" style={{ borderBottom: "1px solid #e9ecef" }}>
                        <td className="bank-item-val" style={{ padding: "18px 20px", fontWeight: "500" }}>{row.source}</td>
                        <td className="bank-item-val" style={{ padding: "18px 20px", textAlign: "center" }}>{row.pendingPrev}</td>
                        <td className="bank-item-val" style={{ padding: "18px 20px", textAlign: "center" }}>{row.received}</td>
                        <td className="bank-item-val" style={{ padding: "18px 20px", textAlign: "center" }}>{row.resolved}</td>
                        <td className="bank-item-val" style={{ padding: "18px 20px", textAlign: "center" }}>{row.totalPending}</td>
                        <td className="bank-item-val" style={{ padding: "18px 20px", textAlign: "center" }}>{row.pendingOver3m}</td>
                        <td className="bank-item-val" style={{ padding: "18px 20px", textAlign: "center" }}>{row.avgDays}</td>
                     </tr>
                  ))}
                  <tr className="payment-note" style={{ backgroundColor: "#f8fafc", fontWeight: "bold", borderBottom: "2px solid #e2e8f0" }}>
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

         <div className="payment-note d-flex flex-wrap justify-content-between align-items-center mt-4 p-3 radius-6" style={{ backgroundColor: "#f8fafc", borderLeft: "4px solid var(--tp-finance-primary)", fontSize: "14px", color: "var(--text-dark, #1B2B40)" }}>
            <div><strong>Data for month ending:</strong> June 2026</div>
            <div style={{ marginLeft: "auto" }}><strong>Complaints received due to impersonation by another entity:</strong> 0</div>
         </div>
      </PolicyLayout>
   );
}
