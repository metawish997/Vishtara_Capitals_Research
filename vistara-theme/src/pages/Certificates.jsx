import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import certificateService from "../services/certificateService";
import { BASE_URL } from "../services/api";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const res = await certificateService.getCertificates();
        if (res.data && res.data.success) {
          setCertificates(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

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

          .payments-page-card h4 {
             color: #222F30 !important;
          }
          
          html[data-theme="dark"] .payments-page-card h4,
          body.high-contrast .payments-page-card h4,
          html[data-theme="dark"] .payments-page-card p,
          body.high-contrast .payments-page-card p {
             color: #ffffff !important;
          }

          html[data-theme="dark"] .payments-page-card,
          body.high-contrast .payments-page-card {
             background: #1A2735 !important;
             border-color: rgba(255, 255, 255, 0.1) !important;
          }
          
          html[data-theme="dark"] .payments-page-card .payment-note,
          body.high-contrast .payments-page-card .payment-note {
             background: #121A24 !important;
             color: #ffffff !important;
          }
       `}</style>
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
                         <li>Certificates</li>
                      </ul>
                      <h1 className="tp-breadcrumb-title">Certificates & Credentials</h1>
                      <p>View our official registrations, certifications, and licenses authorizing us to provide research and advisory services.</p>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div className="tp-contact-ptb tp-sec-ptb upt-120 upb-120">
          <div className="container">
             <div className="row justify-content-center">
                
                {loading ? (
                   <div className="col-12 text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                         <span className="visually-hidden">Loading...</span>
                      </div>
                   </div>
                ) : certificates.length > 0 ? (
                   certificates.map((cert) => (
                      <div key={cert._id} className="col-lg-5 col-md-6 umb-40">
                         <div className="payments-page-card" style={{ padding: "30px", borderRadius: "10px", border: "1px solid var(--card-border, #D9E1EA)", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", textAlign: "center", height: "100%", display: "flex", flexDirection: "column" }}>
                            <h4 style={{ color: "var(--primary)", marginBottom: "25px", fontSize: "22px" }}>{cert.certificate_name}</h4>
                            <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid var(--card-border, #D9E1EA)", flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                               {cert.media && (
                                  <img src={getImageUrl(cert.media)} alt={cert.certificate_name} style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }} />
                               )}
                            </div>
                            <p style={{ marginTop: "20px", fontSize: "15px", color: "#4A5568", fontWeight: "500", lineHeight: "1.6" }}>
                               {cert.description || `Issued by ${cert.issued_by || "Authority"}`}
                            </p>
                            {cert.certificate_number && (
                               <div className="payment-note" style={{ marginTop: "15px", background: "#f8fafc", padding: "10px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "var(--text-dark, #1B2B40)" }}>
                                  Reg. No: {cert.certificate_number}
                               </div>
                            )}
                         </div>
                      </div>
                   ))
                ) : (
                   <div className="col-12 text-center py-5">
                      <p>No certificates available.</p>
                   </div>
                )}

             </div>
          </div>
       </div>
    </main>
  );
}
