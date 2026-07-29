import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBankDetails } from "../services/bankService";
import { BASE_URL } from "../services/api";

export default function Payments() {
  const [banks, setBanks] = useState([]);
  const [upiDetails, setUpiDetails] = useState([]);
  
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await getBankDetails();
        if (res.data && res.data.success) {
          const items = res.data.data;
          console.log("Fetched Bank Data from API:", items);
          const bankData = items.filter(b => b.payment_type === 'bank');
          const upiData = items.filter(b => b.payment_type === 'qr');
          console.log("Filtered Banks:", bankData);
          console.log("Filtered UPIs (QR):", upiData);
          setBanks(bankData);
          setUpiDetails(upiData);
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };
    fetchBanks();
  }, []);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const getImageUrl = (imgObj) => {
    if (!imgObj || !imgObj.url) return null;
    if (imgObj.url.startsWith("http")) return imgObj.url;
    return `${BASE_URL}${imgObj.url}`;
  };

  return (
    <main>
         <style>{`
            html[data-theme="dark"] .tp-breadcrumb-content p,
            html[data-theme="dark"] .tp-breadcrumb-content h2.tp-breadcrumb-title,
            html[data-theme="dark"] .tp-breadcrumb-list li {
               color: #ffffff !important;
            }

            .payments-page-card .tp-section-title {
               color: #222F30 !important;
            }
            
            html[data-theme="dark"] .payments-page-card .tp-section-title,
            body.high-contrast .payments-page-card .tp-section-title,
            html[data-theme="dark"] .payments-page-card p,
            body.high-contrast .payments-page-card p {
               color: #ffffff !important;
            }

            html[data-theme="dark"] .payments-page-card,
            body.high-contrast .payments-page-card {
               background: #1A2735 !important;
               border-color: rgba(255, 255, 255, 0.1) !important;
            }
            
            .upi-copy-btn,
            .account-copy-btn {
               color: #243F63 !important;
            }
            
            html[data-theme="dark"] .upi-copy-btn,
            body.high-contrast .upi-copy-btn,
            html[data-theme="dark"] .account-copy-btn,
            body.high-contrast .account-copy-btn {
               color: #FBB040 !important;
            }
            
            html[data-theme="dark"] .payments-page-card .bank-item-val,
            body.high-contrast .payments-page-card .bank-item-val,
            html[data-theme="dark"] .payments-page-card .payment-upi-id span,
            body.high-contrast .payments-page-card .payment-upi-id span {
               color: #ffffff !important;
            }
         `}</style>
         
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
                        <h1 className="tp-breadcrumb-title">Payments</h1>
                        <p>Secure bank transfer options and instant UPI payment methods for Vishtara advisory subscriptions.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         

         
         <div className="tp-contact-ptb tp-sec-ptb upt-120 upb-120">
            <div className="container">
               <div className="row justify-content-center">
                  
                  {banks.length > 0 ? (
                     banks.map((bank, bankIndex) => (
                        <div key={bank._id || bankIndex} className="col-lg-6 col-md-12 umb-30">
                           <div className="tp-contact-wrapper payments-page-card" style={{ padding: "40px", borderRadius: "10px", border: "1px solid var(--card-border, #D9E1EA)", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", height: "100%" }}>
                              <div className="tp-contact-heading umb-40">
                                 <span className="tp-section-sub">Bank Transfer</span>
                                 <h3 className="tp-section-title" style={{ fontSize: "28px", color: "var(--primary)" }}>Direct Bank Account Details</h3>
                                 <p style={{ marginTop: "10px", fontSize: "15px" }}>Transfer funds securely using IMPS, NEFT, or RTGS directly to our corporate bank account.</p>
                              </div>

                              <div className="bank-details-list">
                                 {[
                                    { label: "Account Name", value: bank.account_holder_name || "-", copyable: false },
                                    { label: "Bank Name", value: bank.bank_name || "-", copyable: false },
                                    { label: "Account Number", value: bank.account_number || "-", copyable: true },
                                    { label: "IFSC Code", value: bank.ifsc_code || "-", copyable: true },
                                    { label: "Account Type", value: bank.account_type || "-", copyable: false },
                                    { label: "Branch", value: bank.branch_address || "-", copyable: false }
                                 ].map((item, index) => (
                                    <div key={index} className="d-flex justify-content-between align-items-center py-3 bank-item" style={{ borderBottom: "1px solid #f0f4f8" }}>
                                       <div>
                                          <span style={{ fontSize: "13px", color: "#4A5568", fontWeight: "600" }}>{item.label}</span>
                                          <div className="bank-item-val" style={{ fontSize: "16px", color: "var(--text-dark, #1B2B40)", fontWeight: "600", marginTop: "2px" }}>{item.value}</div>
                                       </div>
                                       {item.copyable && (
                                          <button 
                                             className="account-copy-btn"
                                             onClick={() => handleCopy(item.value, item.label)}
                                             aria-label={`Copy ${item.label}`}
                                             style={{ padding: "6px 12px", border: "1px solid var(--tp-finance-primary)", backgroundColor: "rgba(208, 168, 92, 0.1)", borderRadius: "4px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                                          >
                                             Copy
                                          </button>
                                       )}
                                    </div>
                                 ))}
                              </div>

                              <div className="mt-4 p-3 radius-6 payment-note" style={{ backgroundColor: "#f8fafc", borderLeft: "4px solid var(--tp-finance-primary)", fontSize: "14px", color: "var(--text-dark, #1B2B40)" }}>
                                 <strong>Note:</strong> Once payment is successfully transferred, please email the transaction screenshot to <a href="mailto:chouhananujay@gmail.com" style={{ color: "var(--primary)", fontWeight: "600" }}>chouhananujay@gmail.com</a> along with your contact details for instant service activation.
                              </div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="col-12 text-center py-5">
                        <p>No bank details available.</p>
                     </div>
                  )}

                  
                  {upiDetails.length > 0 ? (
                     upiDetails.map((upi, upiIndex) => (
                        <div key={upi._id || upiIndex} className="col-lg-6 col-md-12 umb-30">
                           <div className="tp-contact-wrapper text-center payments-page-card" style={{ padding: "40px", borderRadius: "10px", border: "1px solid var(--card-border, #D9E1EA)", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                              <div>
                                 <div className="tp-contact-heading umb-40 text-center">
                                    <span className="tp-section-sub">UPI Scan &amp; Pay</span>
                                    <h3 className="tp-section-title" style={{ fontSize: "28px", color: "var(--primary)" }}>Scan QR Code to Pay</h3>
                                    <p style={{ marginTop: "10px", fontSize: "15px" }}>Scan using any UPI App (Google Pay, PhonePe, Paytm, BHIM, or your bank app) for instant transfer.</p>
                                 </div>

                                 <div className="qr-container mb-4" style={{ display: "inline-block", padding: "15px", border: "1px solid var(--card-border, #D9E1EA)", borderRadius: "10px", background: "#fcfcfc" }}>
                                    <img 
                                       src={getImageUrl(upi.qr_code_image) || "/assets/img/upi_qr.png"} 
                                       alt="UPI payment QR code for Vishtara Capital Research UPI ID: vishatracapital@hdfcbank." 
                                       style={{ maxWidth: "260px", height: "auto", borderRadius: "6px" }} 
                                    />
                                 </div>

                                 <div className="d-flex justify-content-center align-items-center mb-3">
                                    <div className="payment-upi-id" style={{ padding: "10px 20px", background: "#f8fafc", borderRadius: "30px", border: "1px dashed var(--card-border, #D9E1EA)", display: "inline-flex", alignItems: "center" }}>
                                       <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-dark, #1B2B40)" }}>UPI ID: <strong>{upi.upi_id || "Not Available"}</strong></span>
                                       {upi.upi_id && (
                                          <button 
                                             className="upi-copy-btn"
                                             onClick={() => handleCopy(upi.upi_id, "UPI ID")}
                                             aria-label="Copy UPI ID"
                                             style={{ marginLeft: "15px", border: "none", background: "none", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                                          >
                                             Copy
                                          </button>
                                       )}
                                    </div>
                                 </div>
                              </div>

                              <div className="p-3 radius-6 payment-note" style={{ backgroundColor: "#f8fafc", borderLeft: "4px solid var(--primary)", fontSize: "14px", color: "var(--text-dark, #1B2B40)", textAlign: "left" }}>
                                 <strong>Compliance Note:</strong> All payments must be routed only to our registered banking channels. Avoid cash transactions.
                              </div>
                           </div>
                        </div>
                     ))
                  ) : null}

               </div>
            </div>
         </div>
         
    </main>
  );
}
