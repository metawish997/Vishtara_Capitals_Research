import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
   const [showModal, setShowModal] = useState(false);

   useEffect(() => {
      const today = new Date().toISOString().split("T")[0];
      const lastShown = localStorage.getItem("vishtara_complaint_modal_last_shown");
      if (lastShown !== today) {
         setShowModal(true);
      }
   }, []);

   // Dismiss preloader from React so it works even if jQuery/main.js fails to load
   useEffect(() => {
      const loader = document.getElementById('loading');
      if (loader) {
         loader.style.transition = 'opacity 0.5s';
         loader.style.opacity = '0';
         setTimeout(() => { loader.style.display = 'none'; }, 500);
      }
   }, []);

   const closeModal = () => {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("vishtara_complaint_modal_last_shown", today);
      setShowModal(false);
   };

   return (
      <>
         {showModal && (
            <div className="complaint-modal-overlay" style={{
               position: "fixed",
               top: 0,
               left: 0,
               width: "100%",
               height: "100%",
               backgroundColor: "rgba(0, 0, 0, 0.6)",
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               zIndex: 99999,
               padding: "20px"
            }}>
               <div style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  width: "100%",
                  maxWidth: "900px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  position: "relative",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.15)"
               }}>
                  <button
                     onClick={closeModal}
                     style={{
                        position: "absolute",
                        top: "15px",
                        right: "20px",
                        border: "none",
                        background: "none",
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#6F7D90",
                        cursor: "pointer"
                     }}
                  >
                     &times;
                  </button>

                  <div style={{ padding: "40px" }}>
                     <div className="tp-contact-heading umb-30">
                        <span className="tp-section-sub">Transparency &amp; Disclosures</span>
                        <h3 className="tp-section-title" style={{ fontSize: "24px", color: "var(--primary)" }}>Monthly Investor Complaint Data</h3>
                        <p style={{ marginTop: "10px", fontSize: "14px", color: "#6F7D90" }}>
                           In compliance with SEBI guidelines, the disclosure of investor complaints is updated by the 7th of every succeeding month in accordance with the SEBI Master Circular (Annexure E).
                        </p>
                     </div>

                     <div className="table-responsive" style={{ overflowX: "auto" }}>
                        <table className="table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                           <thead>
                              <tr style={{ backgroundColor: "#6E87A8", color: "#ffffff" }}>
                                 <th style={{ padding: "12px 15px", fontWeight: "600", textTransform: "uppercase", fontSize: "12px" }}>Source</th>
                                 <th style={{ padding: "12px 15px", fontWeight: "600", textTransform: "uppercase", fontSize: "12px", textAlign: "center" }}>Pending (Prev.)</th>
                                 <th style={{ padding: "12px 15px", fontWeight: "600", textTransform: "uppercase", fontSize: "12px", textAlign: "center" }}>Received</th>
                                 <th style={{ padding: "12px 15px", fontWeight: "600", textTransform: "uppercase", fontSize: "12px", textAlign: "center" }}>Resolved</th>
                                 <th style={{ padding: "12px 15px", fontWeight: "600", textTransform: "uppercase", fontSize: "12px", textAlign: "center" }}>Total Pending</th>
                                 <th style={{ padding: "12px 15px", fontWeight: "600", textTransform: "uppercase", fontSize: "12px", textAlign: "center" }}>Pending &gt;3M</th>
                                 <th style={{ padding: "12px 15px", fontWeight: "600", textTransform: "uppercase", fontSize: "12px", textAlign: "center" }}>Avg. Days</th>
                              </tr>
                           </thead>
                           <tbody>
                              {[
                                 { source: "Directly from Investors", pendingPrev: 0, received: 0, resolved: 0, totalPending: 0, pendingOver3m: 0, avgDays: 0 },
                                 { source: "SEBI (SCORES)", pendingPrev: 0, received: 0, resolved: 0, totalPending: 0, pendingOver3m: 0, avgDays: 0 },
                                 { source: "Other Sources", pendingPrev: 0, received: 0, resolved: 0, totalPending: 0, pendingOver3m: 0, avgDays: 0 }
                              ].map((row, index) => (
                                 <tr key={index} style={{ borderBottom: "1px solid #e9ecef" }}>
                                    <td style={{ padding: "12px 15px", fontWeight: "500", color: "#1B2B40" }}>{row.source}</td>
                                    <td style={{ padding: "12px 15px", textAlign: "center", color: "#1B2B40" }}>{row.pendingPrev}</td>
                                    <td style={{ padding: "12px 15px", textAlign: "center", color: "#1B2B40" }}>{row.received}</td>
                                    <td style={{ padding: "12px 15px", textAlign: "center", color: "#1B2B40" }}>{row.resolved}</td>
                                    <td style={{ padding: "12px 15px", textAlign: "center", color: "#1B2B40" }}>{row.totalPending}</td>
                                    <td style={{ padding: "12px 15px", textAlign: "center", color: "#1B2B40" }}>{row.pendingOver3m}</td>
                                    <td style={{ padding: "12px 15px", textAlign: "center", color: "#1B2B40" }}>{row.avgDays}</td>
                                 </tr>
                              ))}
                              <tr style={{ backgroundColor: "#f8fafc", fontWeight: "bold", borderBottom: "2px solid #e2e8f0" }}>
                                 <td style={{ padding: "12px 15px", color: "var(--primary)" }}>Grand Total</td>
                                 <td style={{ padding: "12px 15px", textAlign: "center", color: "var(--primary)" }}>0</td>
                                 <td style={{ padding: "12px 15px", textAlign: "center", color: "var(--primary)" }}>0</td>
                                 <td style={{ padding: "12px 15px", textAlign: "center", color: "var(--primary)" }}>0</td>
                                 <td style={{ padding: "12px 15px", textAlign: "center", color: "var(--primary)" }}>0</td>
                                 <td style={{ padding: "12px 15px", textAlign: "center", color: "var(--primary)" }}>0</td>
                                 <td style={{ padding: "12px 15px", textAlign: "center", color: "var(--primary)" }}>0</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>

                     <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginTop: "20px", padding: "15px", borderRadius: "6px", backgroundColor: "#f8fafc", borderLeft: "4px solid var(--tp-finance-primary)", fontSize: "13px", color: "#1B2B40" }}>
                        <div>
                           <strong>Data for month ending:</strong> June 2026
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                           <strong>Impersonation complaints:</strong> 0
                        </div>
                     </div>

                     <div className="text-center umt-30">
                        <button
                           onClick={closeModal}
                           className="tp-btn"
                           style={{ padding: "10px 30px", fontSize: "14px", backgroundColor: "var(--primary)", borderColor: "var(--primary)" }}
                        >
                           Acknowledge &amp; Proceed
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         <div id="loading">
            <div className="loader-mask">
               <li className="tp-fading-circle">
                  <div className="tp-circle1 tp-circle"></div>
                  <div className="tp-circle2 tp-circle"></div>
                  <div className="tp-circle3 tp-circle"></div>
                  <div className="tp-circle4 tp-circle"></div>
                  <div className="tp-circle5 tp-circle"></div>
                  <div className="tp-circle6 tp-circle"></div>
                  <div className="tp-circle7 tp-circle"></div>
                  <div className="tp-circle8 tp-circle"></div>
                  <div className="tp-circle9 tp-circle"></div>
                  <div className="tp-circle10 tp-circle"></div>
                  <div className="tp-circle11 tp-circle"></div>
                  <div className="tp-circle12 tp-circle"></div>
               </li>
               <h3 className="loading-title">Vishtara</h3>
            </div>
         </div>


         <div className="back-to-top-wrapper">
            <button id="back_to_top" type="button" className="back-to-top-btn">
               <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 6L6 1L1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                     strokeLinejoin="round" />
               </svg>
            </button>
         </div>


         <style>{`
            /* Prevent Mobile Horizontal Scroll Space */
            html, body {
               overflow-x: hidden !important;
            }

            /* Hide Complaint Modal on Mobile */
            @media (max-width: 767px) {
               .complaint-modal-overlay {
                  display: none !important;
               }
            }

            /* Mobile Offcanvas Full Height Fixes */
            .tp-offcanvas-area {
               position: fixed !important;
               top: 0 !important;
               left: 0 !important;
               right: 0 !important;
               bottom: 0 !important;
               height: 100% !important;
               min-height: 100vh !important;
               z-index: 9999 !important;
               pointer-events: none !important;
            }
            .tp-offcanvas-area.opened {
               pointer-events: auto !important;
            }
            .tp-offcanvas-wrapper {
               position: fixed !important;
               top: 0 !important;
               bottom: 0 !important;
               right: 0 !important;
               height: 100% !important;
               min-height: 100vh !important;
               overflow-y: auto !important;
               z-index: 99999 !important;
               transform: translateX(120%) !important;
               transition: transform 0.3s ease-in-out !important;
            }
            .tp-offcanvas-area.opened .tp-offcanvas-wrapper {
               transform: translateX(0) !important;
            }
            html[data-theme="dark"] .tp-offcanvas-wrapper,
            body.high-contrast .tp-offcanvas-wrapper {
               background-color: #0d131c !important;
            }
            html[data-theme="dark"] .tp-offcanvas-area .tp-offcanvas-title,
            html[data-theme="dark"] .tp-offcanvas-area h4,
            html[data-theme="dark"] .tp-offcanvas-area p,
            html[data-theme="dark"] .tp-offcanvas-area a,
            html[data-theme="dark"] .tp-offcanvas-area li,
            html[data-theme="dark"] .tp-offcanvas-close-btn,
            body.high-contrast .tp-offcanvas-area .tp-offcanvas-title,
            body.high-contrast .tp-offcanvas-area h4,
            body.high-contrast .tp-offcanvas-area p,
            body.high-contrast .tp-offcanvas-area a,
            body.high-contrast .tp-offcanvas-area li,
            body.high-contrast .tp-offcanvas-close-btn {
               color: #ffffff !important;
            }
            html[data-theme="dark"] .tp-offcanvas-close-btn,
            body.high-contrast .tp-offcanvas-close-btn {
               background-color: rgba(255, 255, 255, 0.1) !important;
            }
            html[data-theme="dark"] .mobile-nav-link,
            body.high-contrast .mobile-nav-link {
               color: #ffffff !important;
               border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            html[data-theme="dark"] .mobile-register-btn,
            body.high-contrast .mobile-register-btn {
               border-color: #ffffff !important;
               color: #ffffff !important;
            }
         `}</style>
         <div className="tp-offcanvas-area">
            <div className="tp-offcanvas-wrapper">
               <div className="tp-offcanvas-top d-flex align-items-center justify-content-between">
                  <div className="tp-offcanvas-logo">
                     <a href="/" aria-label="Vishtara Capital Research Home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
                        <img className="logo-1" src="/vistaralogo.svg" alt="Vishtara Logo" style={{ width: "70px", height: "auto", flexShrink: 0 }} />
                        <h4 style={{ margin: 0, fontWeight: "bold", color: "var(--tp-theme-secondary)", fontSize: "16px", lineHeight: "1.2" }}>Vishtara Capital Research</h4>
                     </a>
                  </div>
                  <div className="tp-offcanvas-close">
                     <button className="tp-offcanvas-close-btn" aria-label="Close menu" onClick={() => {
                        document.querySelector('.tp-offcanvas-area')?.classList.remove('opened');
                        document.querySelector('.body-overlay')?.classList.remove('opened');
                     }}>
                        <svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M9.19141 9.80762L27.5762 28.1924" stroke="currentColor" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round" />
                           <path d="M9.19141 28.1924L27.5762 9.80761" stroke="currentColor" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </button>
                  </div>
               </div>
               <div className="tp-offcanvas-main">
                  <div className="tp-offcanvas-content d-none d-xl-block">
                     <h3 className="tp-offcanvas-title">Hello There!</h3>
                     <p>Empowering investors with deep market insights, comprehensive equity research, and transparent financial analysis to drive confident decisions.</p>
                  </div>
                  <div className="tp-offcanvas-menu d-xl-none" style={{ marginTop: "20px", marginBottom: "30px" }}>
                     <nav>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }} onClick={(e) => {
                           if(e.target.tagName === 'A') {
                              document.querySelector('.tp-offcanvas-area')?.classList.remove('opened');
                              document.querySelector('.body-overlay')?.classList.remove('opened');
                           }
                        }}>
                           <li><a href="/" className="mobile-nav-link" style={{ display: "block", padding: "12px 0", borderBottom: "1px solid #eaeaea", fontSize: "16px", fontWeight: "600", textDecoration: "none", color: "#1B2B40" }}>Home</a></li>
                           <li><a href="/about" className="mobile-nav-link" style={{ display: "block", padding: "12px 0", borderBottom: "1px solid #eaeaea", fontSize: "16px", fontWeight: "600", textDecoration: "none", color: "#1B2B40" }}>About Us</a></li>
                           <li><a href="/services" className="mobile-nav-link" style={{ display: "block", padding: "12px 0", borderBottom: "1px solid #eaeaea", fontSize: "16px", fontWeight: "600", textDecoration: "none", color: "#1B2B40" }}>Services</a></li>
                           <li><a href="/blog" className="mobile-nav-link" style={{ display: "block", padding: "12px 0", borderBottom: "1px solid #eaeaea", fontSize: "16px", fontWeight: "600", textDecoration: "none", color: "#1B2B40" }}>Blog</a></li>
                           <li><a href="/payments" className="mobile-nav-link" style={{ display: "block", padding: "12px 0", borderBottom: "1px solid #eaeaea", fontSize: "16px", fontWeight: "600", textDecoration: "none", color: "#1B2B40" }}>Payments</a></li>
                           <li><a href="/contact" className="mobile-nav-link" style={{ display: "block", padding: "12px 0", borderBottom: "1px solid #eaeaea", fontSize: "16px", fontWeight: "600", textDecoration: "none", color: "#1B2B40" }}>Contact</a></li>
                        </ul>
                        
                        <div style={{ marginTop: "25px", display: "flex", gap: "10px", flexDirection: "column" }}>
                           <a href="/login" className="tp-btn w-100" style={{ textAlign: "center", padding: "12px", background: "#FBB040", color: "#222F30", fontWeight: "700", display: "block" }}>Login</a>
                           <a href="/login" className="mobile-register-btn w-100" style={{ textAlign: "center", padding: "12px", border: "1px solid #1B2B40", color: "#1B2B40", fontWeight: "700", display: "block", borderRadius: "6px" }}>Register</a>
                        </div>
                     </nav>
                  </div>
                  <div className="tp-offcanvas-gallery d-none d-xl-block">
                     <div className="row gx-2">
                        <div className="col-md-4 col-3">
                           <div className="tp-offcanvas-gallery-img fix">
                              <a className="popup-image" href="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80" aria-label="View trading chart">
                                 <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80" alt="Trading chart" style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
                              </a>
                           </div>
                        </div>
                        <div className="col-md-4 col-3">
                           <div className="tp-offcanvas-gallery-img fix">
                              <a className="popup-image" href="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80" aria-label="View stock market board">
                                 <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80" alt="Stock market board" style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
                              </a>
                           </div>
                        </div>
                        <div className="col-md-4 col-3">
                           <div className="tp-offcanvas-gallery-img fix">
                              <a className="popup-image" href="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=800&q=80" aria-label="View analytics">
                                 <img src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=400&q=80" alt="Analytics on screen" style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
                              </a>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="tp-offcanvas-contact">
                     <h3 className="tp-offcanvas-title sm">Information</h3>
                     <ul>
                        <li><a href="tel:+918602027324">+91 86020 27324</a></li>
                        <li><a href="mailto:chouhananujay@gmail.com">chouhananujay@gmail.com</a></li>
                        <li><a href="#">C-20/1, Mahananda Nagar, Ujjain (M.P.)</a></li>
                     </ul>
                  </div>
                  <div className="tp-offcanvas-social">
                     <h3 className="tp-offcanvas-title sm">Follow Us</h3>
                     <ul>
                        <li>
                           <a href="#" aria-label="Facebook">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path
                                    d="M11.25 1.5H4.75C2.95507 1.5 1.5 2.95507 1.5 4.75V11.25C1.5 13.0449 2.95507 14.5 4.75 14.5H11.25C13.0449 14.5 14.5 13.0449 14.5 11.25V4.75C14.5 2.95507 13.0449 1.5 11.25 1.5Z"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                 <path
                                    d="M10.6016 7.5907C10.6818 8.13166 10.5894 8.68414 10.3375 9.16955C10.0856 9.65497 9.68711 10.0486 9.19862 10.2945C8.71014 10.5404 8.15656 10.6259 7.61663 10.5391C7.0767 10.4522 6.57791 10.1972 6.19121 9.81055C5.80451 9.42385 5.54959 8.92506 5.46271 8.38513C5.37583 7.8452 5.46141 7.29163 5.70728 6.80314C5.95315 6.31465 6.34679 5.91613 6.83221 5.66425C7.31763 5.41238 7.87011 5.31998 8.41107 5.4002C8.96287 5.48202 9.47372 5.73915 9.86817 6.1336C10.2626 6.52804 10.5197 7.0389 10.6016 7.5907Z"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                 <path d="M11.5742 4.42578H11.5842" stroke="currentColor" strokeWidth="1.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           </a>
                        </li>
                        <li>
                           <a href="#" aria-label="X Twitter">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path
                                    d="M2.50589 12.7494C4.57662 16.336 9.16278 17.5648 12.7494 15.4941C14.2113 14.65 15.2816 13.388 15.8962 11.9461C16.7895 9.85066 16.7208 7.37526 15.4941 5.25063C14.2674 3.12599 12.1581 1.82872 9.89669 1.55462C8.34063 1.366 6.71259 1.66183 5.25063 2.50589C1.66403 4.57662 0.435172 9.16278 2.50589 12.7494Z"
                                    stroke="currentColor" strokeWidth="1.5" />
                                 <path
                                    d="M12.7127 15.4292C12.7127 15.4292 12.0086 10.4867 10.5011 7.87559C8.99362 5.26451 5.28935 2.57155 5.28935 2.57155M5.68449 15.6124C6.79553 12.2606 12.34 8.54524 16.3975 9.43537M12.311 2.4082C11.1953 5.72344 5.75732 9.38453 1.71875 8.58915"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                           </a>
                        </li>
                        <li>
                           <a href="#" aria-label="Instagram">
                              <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path
                                    d="M1 5.5715H6.33342C7.62867 5.5715 8.61917 6.56199 8.61917 7.85725C8.61917 9.15251 7.62867 10.143 6.33342 10.143H1.76192C1.30477 10.143 1 9.83823 1 9.38108V1.76192C1 1.30477 1.30477 1 1.76192 1H5.5715C6.86676 1 7.85725 1.99049 7.85725 3.28575C7.85725 4.58101 6.86676 5.5715 5.5715 5.5715H1Z"
                                    stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
                                 <path
                                    d="M10.9062 7.09454H17.0016C17.0016 5.41832 15.6301 4.04688 13.9539 4.04688C12.2777 4.04688 10.9062 5.41832 10.9062 7.09454ZM10.9062 7.09454C10.9062 8.77076 12.2777 10.1422 13.9539 10.1422H15.2492"
                                    stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                    strokeLinejoin="round"></path>
                                 <path d="M16.1125 1.44434H11.668" stroke="currentColor" strokeWidth="1.2"
                                    strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                           </a>
                        </li>
                        <li>
                           <a href="#" aria-label="Telegram">
                              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path
                                    d="M12.75 13H5.25C3 13 1.5 11.5 1.5 9.25V4.75C1.5 2.5 3 1 5.25 1H12.75C15 1 16.5 2.5 16.5 4.75V9.25C16.5 11.5 15 13 12.75 13Z"
                                    stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                    strokeLinejoin="round" />
                                 <path
                                    d="M8.70676 5.14837L10.8006 6.40465C11.5543 6.90716 11.5543 7.66093 10.8006 8.16344L8.70676 9.41972C7.86923 9.92224 7.19922 9.50348 7.19922 8.5822V6.06964C7.19922 4.98086 7.86923 4.64585 8.70676 5.14837Z"
                                    fill="currentColor" />
                              </svg>
                           </a>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
         <div className="body-overlay" onClick={() => {
            document.querySelector('.tp-offcanvas-area')?.classList.remove('opened');
            document.querySelector('.body-overlay')?.classList.remove('opened');
         }}></div>

         <div className="tp-search-area p-relative">
            <div className="tp-search-wrapper">
               <div className="tp-search-close">
                  <button type="button" className="tp-search-close-btn" aria-label="Close search window">
                     <svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.19141 9.80762L27.5762 28.1924" stroke="currentColor" strokeWidth="1.5"
                           strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M9.19141 28.1924L27.5762 9.80761" stroke="currentColor" strokeWidth="1.5"
                           strokeLinecap="round" strokeLinejoin="round"></path>
                     </svg>
                  </button>
               </div>
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-lg-8">
                        <div className="tp-search-input p-relative umb-60">
                           <input type="text" placeholder="What are you looking for?" />
                           <button type="submit" className="tp-search-input-btn" aria-label="Submit search">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                 <path
                                    d="M13.6792 12.6197C13.3863 12.3268 12.9114 12.3268 12.6185 12.6197C12.3256 12.9126 12.3256 13.3875 12.6185 13.6804L13.1489 13.15L13.6792 12.6197ZM13.1489 13.15L12.6185 13.6804L16.2185 17.2803L16.7489 16.75L17.2792 16.2197L13.6792 12.6197L13.1489 13.15ZM15.1499 7.94997H15.8999C15.8999 3.55932 12.3406 0 7.94997 0V0.75V1.5C11.5122 1.5 14.3999 4.38775 14.3999 7.94997H15.1499ZM7.94997 0.75V0C3.55932 0 0 3.55932 0 7.94997H0.75H1.5C1.5 4.38775 4.38775 1.5 7.94997 1.5V0.75ZM0.75 7.94997H0C0 12.3406 3.55932 15.8999 7.94997 15.8999V15.1499V14.3999C4.38775 14.3999 1.5 11.5122 1.5 7.94997H0.75ZM7.94997 15.1499V15.8999C12.3406 15.8999 15.8999 12.3406 15.8999 7.94997H15.1499H14.3999C14.3999 11.5122 11.5122 14.3999 7.94997 14.3999V15.1499Z"
                                    fill="currentcolor"></path>
                              </svg>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>


         <Header />
         <Outlet />
         <Footer />
      </>
   );
}
