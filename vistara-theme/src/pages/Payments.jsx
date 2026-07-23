import React from "react";
import { Link } from "react-router-dom";

export default function Payments() {
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <main>
         
         <div className="tp-breadcrumb-ptb upt-90 upb-70 z-index-1">
            <div className="tp-cc-chose-bg">
               <img src="/assets/img/breadcrumb/image-1.jpg" alt="" />
            </div>
            <div className="container">
               <div className="row">
                  <div className="col-lg-5">
                     <div className="tp-breadcrumb-content p-relative">
                        <ul className="tp-breadcrumb-list">
                           <li><Link to="/">Home</Link></li>
                           <li>&gt;</li>
                           <li>Payments</li>
                        </ul>
                        <h2 className="tp-breadcrumb-title">Payments</h2>
                        <p>Secure bank transfer options and instant UPI payment methods for Vishtara advisory subscriptions.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         

         
         <div className="tp-contact-ptb tp-sec-ptb upt-120 upb-120">
            <div className="container">
               <div className="row justify-content-center">
                  
                  <div className="col-lg-6 col-md-12 umb-30">
                     <div className="tp-contact-wrapper" style={{ padding: "40px", borderRadius: "10px", border: "1px solid var(--card-border, #D9E1EA)", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", height: "100%" }}>
                        <div className="tp-contact-heading umb-40">
                           <span className="tp-section-sub">Bank Transfer</span>
                           <h3 className="tp-section-title" style={{ fontSize: "28px", color: "var(--primary)" }}>Direct Bank Account Details</h3>
                           <p style={{ marginTop: "10px", fontSize: "15px" }}>Transfer funds securely using IMPS, NEFT, or RTGS directly to our corporate bank account.</p>
                        </div>

                        <div className="bank-details-list">
                           {[
                              { label: "Account Name", value: "Vishtara Capital Research", copyable: false },
                              { label: "Bank Name", value: "HDFC Bank", copyable: false },
                              { label: "Account Number", value: "50200087654321", copyable: true },
                              { label: "IFSC Code", value: "HDFC0001234", copyable: true },
                              { label: "Account Type", value: "Current Account", copyable: false },
                              { label: "Branch", value: "Mahananda Nagar, Ujjain", copyable: false }
                           ].map((item, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center py-3" style={{ borderBottom: "1px solid #f0f4f8" }}>
                                 <div>
                                    <span style={{ fontSize: "13px", color: "var(--text-muted, #6F7D90)", fontWeight: "500" }}>{item.label}</span>
                                    <div style={{ fontSize: "16px", color: "var(--text-dark, #1B2B40)", fontWeight: "600", marginTop: "2px" }}>{item.value}</div>
                                 </div>
                                 {item.copyable && (
                                    <button 
                                       onClick={() => handleCopy(item.value, item.label)}
                                       style={{ padding: "6px 12px", border: "1px solid var(--tp-finance-primary)", backgroundColor: "rgba(208, 168, 92, 0.1)", borderRadius: "4px", fontSize: "12px", fontWeight: "600", color: "#243F63", cursor: "pointer", transition: "all 0.2s" }}
                                       onMouseOver={(e) => { e.target.style.backgroundColor = "var(--tp-finance-primary)"; e.target.style.color = "#ffffff"; }}
                                       onMouseOut={(e) => { e.target.style.backgroundColor = "rgba(208, 168, 92, 0.1)"; e.target.style.color = "#243F63"; }}
                                    >
                                       Copy
                                    </button>
                                 )}
                              </div>
                           ))}
                        </div>

                        <div className="mt-4 p-3 radius-6" style={{ backgroundColor: "#f8fafc", borderLeft: "4px solid var(--tp-finance-primary)", fontSize: "14px", color: "var(--text-dark, #1B2B40)" }}>
                           <strong>Note:</strong> Once payment is successfully transferred, please email the transaction screenshot to <a href="mailto:chouhananujay@gmail.com" style={{ color: "var(--primary)", fontWeight: "600" }}>chouhananujay@gmail.com</a> along with your contact details for instant service activation.
                        </div>
                     </div>
                  </div>

                  
                  <div className="col-lg-6 col-md-12 umb-30">
                     <div className="tp-contact-wrapper text-center" style={{ padding: "40px", borderRadius: "10px", border: "1px solid var(--card-border, #D9E1EA)", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                           <div className="tp-contact-heading umb-40 text-center">
                              <span className="tp-section-sub">UPI Scan &amp; Pay</span>
                              <h3 className="tp-section-title" style={{ fontSize: "28px", color: "var(--primary)" }}>Scan QR Code to Pay</h3>
                              <p style={{ marginTop: "10px", fontSize: "15px" }}>Scan using any UPI App (Google Pay, PhonePe, Paytm, BHIM, or your bank app) for instant transfer.</p>
                           </div>

                           <div className="qr-container mb-4" style={{ display: "inline-block", padding: "15px", border: "1px solid var(--card-border, #D9E1EA)", borderRadius: "10px", background: "#fcfcfc" }}>
                              <img 
                                 src="/assets/img/upi_qr.png" 
                                 alt="UPI Payment QR Code" 
                                 style={{ maxWidth: "260px", height: "auto", borderRadius: "6px" }} 
                              />
                           </div>

                           <div className="d-flex justify-content-center align-items-center mb-3">
                              <div style={{ padding: "10px 20px", background: "#f8fafc", borderRadius: "30px", border: "1px dashed var(--card-border, #D9E1EA)", display: "inline-flex", alignItems: "center" }}>
                                 <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-dark, #1B2B40)" }}>UPI ID: <strong>vishtaracapital@hdfcbank</strong></span>
                                 <button 
                                    onClick={() => handleCopy("vishtaracapital@hdfcbank", "UPI ID")}
                                    style={{ marginLeft: "15px", border: "none", background: "none", color: "var(--primary)", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                                 >
                                    Copy
                                 </button>
                              </div>
                           </div>
                        </div>

                        <div className="p-3 radius-6" style={{ backgroundColor: "#f8fafc", borderLeft: "4px solid var(--primary)", fontSize: "14px", color: "var(--text-dark, #1B2B40)", textAlign: "left" }}>
                           <strong>Compliance Note:</strong> All payments must be routed only to our registered banking channels. Avoid cash transactions.
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </div>
         
    </main>
  );
}
