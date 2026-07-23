import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const { user } = useAuth();
  const [fontSizeState, setFontSizeState] = useState("reset"); // 'up', 'down', 'reset'
  const [contrastState, setContrastState] = useState("reset"); // 'high', 'reset'
  const [buttonText, setButtonText] = useState("Sign Up");
  const [fadeState, setFadeState] = useState("fade-in");

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

  const adjustFontSize = (action) => {
    const html = document.documentElement;
    if (action === "up") {
      html.style.fontSize = "18px";
      setFontSizeState("up");
    } else if (action === "down") {
      html.style.fontSize = "14px";
      setFontSizeState("down");
    } else {
      html.style.fontSize = ""; // Reset
      setFontSizeState("reset");
    }
  };

  const toggleContrast = (action) => {
    if (action === "high") {
      document.body.classList.add("high-contrast");
      setContrastState("high");
      if (!document.getElementById("high-contrast-styles")) {
        const style = document.createElement("style");
        style.id = "high-contrast-styles";
        style.innerHTML = `
          body.high-contrast {
            background-color: #121A24 !important;
            color: #E2E8F0 !important;
          }
          body.high-contrast p, 
          body.high-contrast span,
          body.high-contrast h1,
          body.high-contrast h2,
          body.high-contrast h3,
          body.high-contrast h4,
          body.high-contrast h5,
          body.high-contrast h6,
          body.high-contrast li,
          body.high-contrast td,
          body.high-contrast th,
          body.high-contrast a:not(.tp-btn-event) {
            color: #F8FAFC !important;
          }
          body.high-contrast .tp-footer-area,
          body.high-contrast .tp-header-area {
            background-color: #0A0F15 !important;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      document.body.classList.remove("high-contrast");
      setContrastState("reset");
      const style = document.getElementById("high-contrast-styles");
      if (style) style.remove();
    }
  };

  const getBtnStyle = (isActive) => ({
    background: "none",
    border: "none",
    padding: "2px 6px",
    fontSize: "14px",
    fontWeight: isActive ? "700" : "500",
    color: isActive ? "#D2AF4D" : "var(--text-muted, #6F7D90)",
    cursor: "pointer",
    outline: "none",
    transition: "color 0.2s ease"
  });

  return (
    <header className="tp-header-height">
         <div id="header-sticky" className="tp-header-area">
            <div className="container container-1800">
               <div className="row align-items-center">
                  <div className="col-xxl-3 col-xl-3 col-6">
                     <div className="tp-header-left-side">
                        <div className="tp-header-logo">
                           <a href="index.html" style={{textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap"}}>
                              <img src="/vistaralogo.svg" alt="Vishtara Logo" style={{width: "100px", height: "auto"}} />
                              <h4 style={{ margin: 0, fontWeight: "bold", color: "var(--tp-theme-secondary)", fontSize: "18px" }}>Vishtara Capital Research</h4>
                           </a>
                        </div>
                     </div>
                  </div>
                  <div className="col-xxl-5 col-xl-6 d-none d-xl-block">
                     <div className="tp-header-menu tp-header-dropdown text-center">
                        <nav className="tp-mobile-menu-active">
                            <ul>
                               <li>
                                  <Link to="/">Home</Link>
                               </li>
                               <li>
                                  <Link to="/about">About Us</Link>
                               </li>
                               <li>
                                  <Link to="/services">Services</Link>
                               </li>
                               <li>
                                  <Link to="/blog">Blog</Link>
                               </li>
                               <li>
                                  <Link to="/payments">Payments</Link>
                               </li>
                               <li>
                                  <Link to="/contact">Contact</Link>
                               </li>
                            </ul>
                        </nav>
                     </div>
                  </div>
                  <div className="col-xxl-4 col-xl-3 col-6">
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
                          `}</style>
                          {user ? (
                              <Link to={(user.role === 'admin' || user.role === 'superadmin' || user.role === 'super admin') ? '/admin/dashboard' : '/portal'} className="tp-btn-event d-none d-xxl-flex" style={{ minWidth: "130px", justifyContent: "center" }}>
                                 <div className="button-text" style={{ width: "auto", textAlign: "center", textTransform: "capitalize" }}>{user.name || user.first_name || 'Dashboard'}</div>
                                 <div className="button-icon-wrapper" style={{ marginLeft: "10px" }}>
                                    <div className="button-dot"></div>
                                 </div>
                              </Link>
                          ) : (
                              <Link to="/login" className="tp-btn-event d-none d-xxl-flex" style={{ minWidth: "130px", justifyContent: "center" }}>
                                 <div className={`button-text shuffle-text ${fadeState}`} style={{ width: "65px", textAlign: "center" }}>{buttonText}</div>
                                 <div className="button-icon-wrapper" style={{ marginLeft: "10px" }}>
                                    <img src="/assets/img/finance/hero/btn-arrow.svg" loading="lazy" width="16" height="16"
                                       alt="" className="button-image" />
                                    <div className="button-dot"></div>
                                 </div>
                              </Link>
                          )}
                         <div className="tp-header-lan d-none d-xl-block" style={{ position: "relative" }}>
                            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--text-dark, #1B2B40)" }}>
                               <span>
                                  <svg aria-labelledby="svg-inline--fa-title-zwy8pG9PvW5d" data-prefix="fas" data-icon="child-reaching" className="svg-inline--fa fa-child-reaching fa-icon access_icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-label="Accessibility List" style={{width: "22px", height: "22px", fill: "currentColor", verticalAlign: "middle"}}>
                                     <title id="svg-inline--fa-title-zwy8pG9PvW5d">Accessibility List</title>
                                     <path fill="currentColor" d="M256 64A64 64 0 1 0 128 64a64 64 0 1 0 128 0zM152.9 169.3c-23.7-8.4-44.5-24.3-58.8-45.8L74.6 94.2C64.8 79.5 45 75.6 30.2 85.4s-18.7 29.7-8.9 44.4L40.9 159c18.1 27.1 42.8 48.4 71.1 62.4L112 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96 32 0 0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-258.4c29.1-14.2 54.4-36.2 72.7-64.2l18.2-27.9c9.6-14.8 5.4-34.6-9.4-44.3s-34.6-5.5-44.3 9.4L291 122.4c-21.8 33.4-58.9 53.6-98.8 53.6c-12.6 0-24.9-2-36.6-5.8c-.9-.3-1.8-.7-2.7-.9z"></path>
                                  </svg>
                               </span>
                            </a>
                            <div className="tp-header-lan-content" style={{ minWidth: "220px", padding: "16px", borderRadius: "8px", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", background: "#ffffff", border: "1px solid var(--card-border, #D9E1EA)", right: 0, left: "auto" }}>
                               <div style={{ marginBottom: "14px" }}>
                                  <div style={{ fontWeight: "700", color: "var(--text-dark, #1B2B40)", marginBottom: "6px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Font Size</div>
                                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                                     <button onClick={() => adjustFontSize("up")} style={getBtnStyle(fontSizeState === "up")}>A+</button>
                                     <span style={{ color: "var(--card-border, #D9E1EA)" }}>|</span>
                                     <button onClick={() => adjustFontSize("reset")} style={getBtnStyle(fontSizeState === "reset")}>Reset</button>
                                     <span style={{ color: "var(--card-border, #D9E1EA)" }}>|</span>
                                     <button onClick={() => adjustFontSize("down")} style={getBtnStyle(fontSizeState === "down")}>A-</button>
                                  </div>
                                </div>
                               <div>
                                  <div style={{ fontWeight: "700", color: "var(--text-dark, #1B2B40)", marginBottom: "6px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contrast</div>
                                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                                     <button onClick={() => toggleContrast("high")} style={getBtnStyle(contrastState === "high")}>High Contrast</button>
                                     <span style={{ color: "var(--card-border, #D9E1EA)" }}>|</span>
                                     <button onClick={() => toggleContrast("reset")} style={getBtnStyle(contrastState === "reset")}>Reset</button>
                                  </div>
                               </div>
                            </div>
                         </div>
                        <button className="tp-header-bar tp-offcanvas-open-btn uml-25">
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
            padding: "4px 0"
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
                  animation: marquee 35s linear infinite;
                }
                .vistar-marquee-content:hover {
                  animation-play-state: paused;
                }
                .vistar-marquee-item {
                  display: inline-block;
                  margin-right: 50px;
                  font-size: 13px;
                  font-weight: 600;
                  color: ${window.location.pathname === "/home2" ? "#ffffff" : "#222F30"};
                }
                .vistar-marquee-item .dot {
                  color: ${window.location.pathname === "/home2" ? "#ffffff" : "#222F30"};
                  margin-right: 6px;
                  font-size: 14px;
                }
               @keyframes marquee {
                 0% { transform: translateX(100vw); }
                 100% { transform: translateX(-100%); }
               }
             `}</style>
             <div className="vistar-marquee-container">
               <div className="vistar-marquee-content">
                 <span className="vistar-marquee-item"><span className="dot">●</span> ALWAYS CONDUCT YOUR OWN RESEARCH BEFORE INVESTING.</span>
                 <span className="vistar-marquee-item"><span className="dot">●</span> PAST PERFORMANCE DOES NOT GUARANTEE FUTURE RESULTS.</span>
                 <span className="vistar-marquee-item"><span className="dot">●</span> TRADING INVOLVES FINANCIAL RISK.</span>
                 <span className="vistar-marquee-item"><span className="dot">●</span> INFORMATION SHARED SHOULD NOT BE CONSIDERED FINANCIAL ADVICE.</span>
               </div>
             </div>
          </div>
         
    </header>
  );
}
