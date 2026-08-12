import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import marqueeService from "../services/marqueeService";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
   const { user } = useAuth();
   const { theme, setTheme } = useTheme();
   const [zoomStep, setZoomStep] = useState(localStorage.getItem('user-zoom-step') !== null ? parseInt(localStorage.getItem('user-zoom-step')) : 1);
   const [buttonText, setButtonText] = useState("Sign Up");
   const [fadeState, setFadeState] = useState("fade-in");
   const [isAccessOpen, setIsAccessOpen] = useState(false);
   const [marquees, setMarquees] = useState([]);
   const [isTickerPaused, setIsTickerPaused] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   React.useEffect(() => {
      const offcanvas = document.querySelector('.tp-offcanvas-area');
      if (!offcanvas) return;
      const observer = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
               setIsMobileMenuOpen(offcanvas.classList.contains('opened'));
            }
         });
      });
      observer.observe(offcanvas, { attributes: true });
      return () => observer.disconnect();
   }, []);

   React.useEffect(() => {
      const fetchMarquees = async () => {
         try {
            const res = await marqueeService.getMarquees();
            console.log("Marquee API Response:", res);
            if (res && res.data) {
               // Show only active marquees, or all if we just want one? Wait, MarqueeManager treats it as a broadcast list, I'll filter active.
               const active = res.data.filter(m => m.is_active);
               console.log("Active Marquees:", active);
               setMarquees(active);
            }
         } catch (error) {
            console.error("Failed to load marquees", error);
         }
      };
      fetchMarquees();
   }, []);

   React.useEffect(() => {
      const interval = setInterval(() => {
         setFadeState("fade-out");
         setTimeout(() => {
            setButtonText((prev) => (prev === "Sign Up" ? "Login" : "Sign Up"));
            setFadeState("fade-in");
         }, 300);
      }, 3000);
      return () => clearInterval(interval);
   }, []);

   const applyZoom = (step) => {
      if (step === 0) {
         document.body.style.zoom = '';
         document.body.style.MozTransform = '';
         document.body.style.MozTransformOrigin = '';
         document.body.style.width = '';
         document.body.style.maxWidth = '';
      } else {
         const scale = 1 + (step * 0.1); // e.g., step 2 -> 1.2 (120%)
         document.body.style.zoom = scale;
         document.body.style.MozTransform = `scale(${scale})`;
         document.body.style.MozTransformOrigin = 'top left';

         // Fix white space bug when zooming out by dynamically calculating the inverse scale
         if (scale < 1) {
            document.body.style.width = `calc(100% / ${scale})`;
            document.body.style.maxWidth = `calc(100% / ${scale})`;
         } else {
            document.body.style.width = '';
            document.body.style.maxWidth = '';
         }
      }
   };

   React.useEffect(() => {
      applyZoom(zoomStep);
      return () => {
         applyZoom(0);
      };
   }, []);

   const adjustFontSize = (action) => {
      if (action === "up") {
         setZoomStep(prev => {
            const nextStep = Math.min(prev + 1, 3);
            localStorage.setItem('user-zoom-step', nextStep);
            applyZoom(nextStep);
            return nextStep;
         });
      } else if (action === "down") {
         setZoomStep(prev => {
            const nextStep = Math.max(prev - 1, -3);
            localStorage.setItem('user-zoom-step', nextStep);
            applyZoom(nextStep);
            return nextStep;
         });
      } else {
         setZoomStep(0);
         localStorage.setItem('user-zoom-step', 0);
         applyZoom(0);
      }
   };

   const toggleContrast = (action) => {
      if (action === "high") {
         setTheme('black-green');
      } else {
         setTheme('light');
      }
   };



   return (
      <header className="tp-header-height">
         <div id="header-sticky" className="tp-header-area">
            <div className="container container-1800">
               <div className="row align-items-center">
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-6">
                     <div className="tp-header-left-side">
                        <div className="tp-header-logo">
                           <a href="/" aria-label="Vishtara Capital Research Home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
                              <img className="header-logo-img" src="/vistaralogo.svg" alt="Vishtara Logo" style={{ width: "90px", height: "auto", flexShrink: 0, filter: theme === 'black-green' ? 'brightness(0) invert(1)' : 'none' }} />
                              <span className="header-logo-text" style={{ margin: 0, fontWeight: "bold", color: theme === 'black-green' ? '#F8FAFC' : 'var(--tp-theme-secondary)', fontSize: "17px", lineHeight: "1.2" }}>Vishtara Capital Research</span>
                           </a>
                        </div>
                     </div>
                  </div>
                  <div className="col-xxl-7 col-xl-7 col-lg-7 d-none d-lg-block">
                     <div className="tp-header-menu tp-header-dropdown text-center">
                        <nav className="tp-mobile-menu-active">
                           <ul style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "nowrap", margin: 0, padding: 0 }}>
                              <li>
                                 <Link to="/" style={{ whiteSpace: "nowrap" }}>Home</Link>
                              </li>
                              <li>
                                 <Link to="/about" style={{ whiteSpace: "nowrap" }}>About Us</Link>
                              </li>
                              <li>
                                 <Link to="/services" style={{ whiteSpace: "nowrap" }}>Services</Link>
                              </li>
                              <li>
                                 <Link to="/blog" style={{ whiteSpace: "nowrap" }}>Blog</Link>
                              </li>
                              <li>
                                 <Link to="/payments" style={{ whiteSpace: "nowrap" }}>Payments</Link>
                              </li>
                              <li>
                                 <Link to="/contact" style={{ whiteSpace: "nowrap" }}>Contact</Link>
                              </li>
                           </ul>
                        </nav>
                     </div>
                  </div>
                  <div className="col-xxl-2 col-xl-2 col-lg-2 col-6">
                     <div className="tp-header-action d-flex justify-content-end align-items-center">
                        <style>{`
                             .tp-header-action .tp-header-lan::before {
                                display: none !important;
                             }
                             .tp-header-action .tp-header-lan {
                                display: flex !important;
                                align-items: center !important;
                                height: 100% !important;
                                padding: 0 !important;
                                margin: 0 0 0 25px !important;
                             }
                             .tp-header-action .tp-header-lan > a {
                                display: flex !important;
                                align-items: center !important;
                                justify-content: center !important;
                                height: 100% !important;
                             }
                             .tp-header-action .tp-header-lan > a > span {
                                display: flex !important;
                                align-items: center !important;
                                justify-content: center !important;
                             }
                             .shuffle-text {
                                display: inline-block;
                                transition: opacity 0.3s ease, transform 0.3s ease;
                             }
                             .shuffle-text.fade-out {
                                opacity: 0;
                                transform: translateY(-4px);
                             }
                             .shuffle-text.fade-in {
                                opacity: 1;
                                transform: translateY(0);
                             }
                             
                             /* Accessibility Fix: Sign Up / Login Button */
                             .tp-header-action .tp-btn-event {
                                background-color: #011d52 !important;
                                border-color: #011d52 !important;
                                color: #ffffff !important;
                             }
                             .tp-header-action .tp-btn-event .button-text {
                                color: #ffffff !important;
                                font-weight: 700 !important;
                             }
                             body.high-contrast .tp-header-action .tp-btn-event {
                                background-color: #ffffff !important;
                                border-color: #ffffff !important;
                                color: #000000 !important;
                             }
                             body.high-contrast .tp-header-action .tp-btn-event .button-text {
                                color: #000000 !important;
                                font-weight: 900 !important;
                             }

                             /* Responsive scaling for desktop sizes */
                             @media (min-width: 1200px) and (max-width: 1399px) {
                                .header-logo-text { font-size: 13px !important; line-height: 1.1 !important; max-width: 100px; white-space: normal; }
                                .header-logo-img { width: 70px !important; }
                                .tp-header-logo a { gap: 5px !important; }
                                .tp-header-menu nav ul { gap: 10px !important; }
                                .tp-header-menu nav ul li a { font-size: 13px !important; padding: 0 4px !important; }
                                .tp-header-action .tp-btn-event { min-width: 100px !important; padding: 0 10px !important; height: 42px !important; }
                                .tp-header-action .tp-btn-event .button-text { font-size: 13px !important; min-width: auto !important; }
                                .tp-header-action .tp-header-lan { margin: 0 0 0 10px !important; }
                                .button-icon-wrapper { margin-left: 5px !important; }
                             }

                             @media (min-width: 992px) and (max-width: 1199px) {
                                .header-logo-text { font-size: 11px !important; line-height: 1.1 !important; max-width: 80px; white-space: normal; }
                                .header-logo-img { width: 60px !important; }
                                .tp-header-logo a { gap: 4px !important; }
                                .tp-header-menu nav ul { gap: 5px !important; }
                                .tp-header-menu nav ul li a { font-size: 11px !important; padding: 0 2px !important; }
                                .tp-header-action .tp-btn-event { min-width: 80px !important; padding: 0 8px !important; height: 36px !important; }
                                .tp-header-action .tp-btn-event .button-text { font-size: 11px !important; min-width: auto !important; }
                                .tp-header-action .tp-header-lan { margin: 0 0 0 5px !important; }
                                .button-icon-wrapper { margin-left: 3px !important; }
                                .access_icon { width: 16px !important; height: 16px !important; }
                                .tp-header-action .tp-offcanvas-open-btn { margin-left: 10px !important; }
                             }

                             @media (min-width: 768px) and (max-width: 991px) {
                                .header-logo-text { font-size: 12px !important; line-height: 1.1 !important; max-width: 90px; }
                                .header-logo-img { width: 55px !important; }
                                .tp-header-action .tp-btn-event { min-width: 90px !important; padding: 0 8px !important; }
                                .tp-header-action .tp-header-lan { margin: 0 0 0 8px !important; }
                             }

                             /* Mobile Header Logo Fix */
                             @media (max-width: 767px) {
                                .header-logo-img { width: 45px !important; }
                                .header-logo-text { font-size: 13px !important; line-height: 1.1 !important; max-width: 130px; }
                                .tp-header-action .tp-header-lan { margin: 0 0 0 10px !important; }
                             }

                             /* Accessibility Menu Buttons & Text */
                             .access-title {
                                color: #243F63 !important; /* Strict dark blue for light mode */
                             }
                             .access-btn {
                                background: none;
                                border: none;
                                border-radius: 4px;
                                padding: 4px 8px;
                                font-size: 14px;
                                font-weight: 600;
                                color: #243F63 !important; /* Strict dark blue for light mode */
                                cursor: pointer;
                                outline: none;
                                transition: all 0.2s ease;
                             }
                             .access-btn.active {
                                font-weight: 700;
                                color: #9B6800 !important;
                             }
                             
                             .access-separator {
                                color: #243F63 !important; /* Strict dark blue for light mode */
                             }
                             
                             /* Dark mode & High contrast styles */
                             body.high-contrast .access-btn,
                             body.high-contrast .access-separator {
                                color: #F8FAFC !important; /* Dark white for dark mode */
                             }
                             body.high-contrast .access-btn.active {
                                color: #FBB040 !important;
                             }
                             
                             body.high-contrast .tp-header-lan-content .access-title {
                                color: #F8FAFC !important; /* Dark white for dark mode */
                             }
                          `}</style>
                        {user ? (
                           <Link to={(user.role === 'admin' || user.role === 'superadmin' || user.role === 'super admin') ? '/admin/dashboard' : '/portal'} className="tp-btn-event d-none d-lg-flex" style={{ minWidth: "130px", justifyContent: "center" }}>
                              <div className="button-text" style={{ width: "auto", textAlign: "center", textTransform: "capitalize" }}>{user.name || user.first_name || 'Dashboard'}</div>
                              <div className="button-icon-wrapper" style={{ marginLeft: "10px" }}>
                                 <div className="button-dot"></div>
                              </div>
                           </Link>
                        ) : (
                           <Link to="/login" className="tp-btn-event d-none d-lg-flex" style={{ minWidth: "140px", justifyContent: "center" }}>
                              <div className={`button-text shuffle-text ${fadeState}`} style={{ width: "auto", minWidth: "65px", textAlign: "center", whiteSpace: "nowrap" }}>{buttonText}</div>
                              <div className="button-icon-wrapper" style={{ marginLeft: "10px" }}>
                                 <img src="/assets/img/finance/hero/btn-arrow.svg" loading="lazy" width="16" height="16"
                                    alt="" className="button-image" />
                                 <div className="button-dot"></div>
                              </div>
                           </Link>
                        )}
                        <div className="tp-header-lan d-none d-xl-block" style={{ position: "relative" }}>
                           <a href="#" onClick={(e) => { e.preventDefault(); setIsAccessOpen(!isAccessOpen); }} aria-label="Open accessibility options" aria-haspopup="true" aria-expanded={isAccessOpen} style={{ color: "var(--text-dark, #1B2B40)", cursor: "pointer" }}>
                              <span>
                                 <svg aria-hidden="true" data-prefix="fas" data-icon="child-reaching" className="svg-inline--fa fa-child-reaching fa-icon access_icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{ width: "22px", height: "22px", fill: "currentColor", verticalAlign: "middle" }}>
                                    <path fill="currentColor" d="M256 64A64 64 0 1 0 128 64a64 64 0 1 0 128 0zM152.9 169.3c-23.7-8.4-44.5-24.3-58.8-45.8L74.6 94.2C64.8 79.5 45 75.6 30.2 85.4s-18.7 29.7-8.9 44.4L40.9 159c18.1 27.1 42.8 48.4 71.1 62.4L112 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96 32 0 0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-258.4c29.1-14.2 54.4-36.2 72.7-64.2l18.2-27.9c9.6-14.8 5.4-34.6-9.4-44.3s-34.6-5.5-44.3 9.4L291 122.4c-21.8 33.4-58.9 53.6-98.8 53.6c-12.6 0-24.9-2-36.6-5.8c-.9-.3-1.8-.7-2.7-.9z"></path>
                                 </svg>
                              </span>
                           </a>
                           <div className="tp-header-lan-content" style={{ minWidth: "220px", padding: "16px", borderRadius: "8px", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", background: "#ffffff", border: "1px solid var(--card-border, #D9E1EA)", right: 0, left: "auto", opacity: isAccessOpen ? 1 : 0, visibility: isAccessOpen ? "visible" : "hidden", transition: "all 0.2s ease-in-out", transform: isAccessOpen ? "translateY(0)" : "translateY(10px)" }}>
                              <div style={{ marginBottom: "14px" }}>
                                 <div className="access-title" style={{ fontWeight: "700", color: "var(--text-dark, #1B2B40)", marginBottom: "6px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Font Size</div>
                                 <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                                    <button onClick={() => adjustFontSize("up")} className={`access-btn ${zoomStep > 0 ? "active" : ""}`}>A+</button>
                                    <span className="access-separator">|</span>
                                    <button onClick={() => adjustFontSize("reset")} className={`access-btn ${zoomStep === 0 ? "active" : ""}`}>Reset</button>
                                    <span className="access-separator">|</span>
                                    <button onClick={() => adjustFontSize("down")} className={`access-btn ${zoomStep < 0 ? "active" : ""}`}>A-</button>
                                 </div>
                              </div>
                              <div>
                                 <div className="access-title" style={{ fontWeight: "700", color: "var(--text-dark, #1B2B40)", marginBottom: "6px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contrast</div>
                                 <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                                    <button onClick={() => toggleContrast("high")} className={`access-btn ${theme === "black-green" ? "active" : ""}`}>High Contrast</button>
                                    <span className="access-separator">|</span>
                                    <button onClick={() => toggleContrast("reset")} className={`access-btn ${theme !== "black-green" ? "active" : ""}`}>Reset</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <button className="tp-header-bar tp-offcanvas-open-btn uml-25" aria-label="Open navigation menu" aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu" onClick={() => {
                           document.querySelector('.tp-offcanvas-area')?.classList.add('opened');
                           document.querySelector('.body-overlay')?.classList.add('opened');
                           setTimeout(() => {
                              document.querySelector('.tp-offcanvas-close-btn')?.focus();
                           }, 100);
                        }}>
                           <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="9" viewBox="0 0 40 9"
                                 fill="none">
                                 <path d="M0 0H40V1H0V0Z" fill="currentColor" />
                                 <path d="M0 8H40V9H0V8Z" fill="currentColor" />
                              </svg>
                           </span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="tp-header-bottom d-none d-md-block" style={{
            background: window.location.pathname === "/home2"
               ? "linear-gradient(160deg, rgb(36, 63, 99) 0%, rgb(50, 78, 115) 60%, rgb(36, 63, 99) 100%)"
               : "var(--tp-theme-primary)",
            padding: "0"
         }}>
            <style>{`
                .vistar-marquee-container {
                  overflow: hidden;
                  white-space: nowrap;
                  width: 100%;
                  padding: 0;
                  font-family: inherit;
                }
                .vistar-marquee-content {
                  display: inline-block;
                  padding: 4px 0;
                  animation: marquee 35s linear infinite;
                }
                .vistar-marquee-content:hover {
                  animation-play-state: paused;
                }
                .vistar-marquee-container {
                   display: flex;
                   align-items: stretch;
                }
                .vistar-marquee-item {
                  display: inline-block;
                  margin-right: 50px;
                  font-size: 13px;
                  font-weight: 600;
                  color: ${window.location.pathname === "/home2" ? "#222F30" : "#222F30 !important"};
                }
                .vistar-marquee-item .dot {
                  color: ${window.location.pathname === "/home2" ? "#222F30" : "#222F30 !important"};
                  margin-right: 6px;
                  font-size: 14px;
                }
               @keyframes marquee {
                 0% { transform: translateX(100vw); }
                 100% { transform: translateX(-100%); }
               }
                body.high-contrast .vistar-marquee-container span.vistar-marquee-item.vistar-marquee-item.vistar-marquee-item,
                body.high-contrast .vistar-marquee-container span.dot.dot.dot {
                  color: #222F30 !important;
                }
                .vistar-marquee-container * {
                  color: #222F30 !important;
                }
                .vistar-marquee-content * {
                  color: #222F30 !important;
                }
              `}</style>
            <div className="vistar-marquee-container">
               <button
                  onClick={() => setIsTickerPaused(!isTickerPaused)}
                  aria-label={isTickerPaused ? "Play announcement ticker" : "Pause announcement ticker"}
                  aria-pressed={isTickerPaused}
                  style={{
                     background: theme === 'black-green' ? '#011d52' : 'transparent',
                     border: 'none',
                     cursor: 'pointer',
                     padding: '0 15px',
                     color: theme === 'black-green' ? '#ffffff' : '#222F30',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     zIndex: 10,
                     flexShrink: 0,

                  }}
               >
                  {isTickerPaused ? (
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  )}
               </button>
               <div className="vistar-marquee-content" style={{ animationPlayState: isTickerPaused ? 'paused' : 'running' }}>
                  {marquees.length > 0 ? (
                     marquees.map(m => (
                        <span key={m._id} className="vistar-marquee-item">
                           <span className="dot">●</span>
                           {/* {m.title && <span style={{ fontWeight: 'bold', marginRight: '5px', textTransform: 'uppercase' }}>[{m.title}]</span>} */}
                           {m.content}
                        </span>
                     ))
                  ) : (
                     <span className="vistar-marquee-item"></span>
                  )}
               </div>
            </div>
         </div>

      </header>
   );
}
