import React from "react";
import { Link } from "react-router-dom";
import aboutMain from "../assets/images/about_us_main.png";
import aboutSecondary from "../assets/images/about_us_secondary.png";
import professionalResearchBg from "../assets/images/professional_research_bg.png";
import ctaBannerBg from "../assets/images/cta_banner_bg.png";

export default function About() {
  return (
    <main>

         <style>{`
            body.high-contrast .tp-breadcrumb-content h2.tp-breadcrumb-title,
            body.high-contrast .tp-breadcrumb-content p,
            body.high-contrast .tp-breadcrumb-list li {
               color: #ffffff !important;
            }
            body.high-contrast .tp-about-wrapper h3.tp-section-title,
            body.high-contrast .tp-about-wrapper p {
               color: #222F30 !important;
            }
            body.high-contrast div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item h3,
            body.high-contrast div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item > div > span,
            body.high-contrast div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item > div > p,
            body.high-contrast div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item .tp-cn-success-item-wrap p,
            body.high-contrast div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item .tp-cn-success-item-wrap span {
               color: #222F30 !important;
            }
            body.high-contrast div.tp-cn-success-item-2.tp-cn-success-item-2.tp-cn-success-item-2 span,
            body.high-contrast div.tp-cn-success-item-2.tp-cn-success-item-2.tp-cn-success-item-2 p {
               color: #222F30 !important;
            }
            
            html[data-theme="dark"] div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item h3,
            html[data-theme="dark"] div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item > div > span,
            html[data-theme="dark"] div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item > div > p,
            html[data-theme="dark"] div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item .tp-cn-success-item-wrap p,
            html[data-theme="dark"] div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item .tp-cn-success-item-wrap span {
               color: #222F30 !important;
            }
            html[data-theme="dark"] div.tp-cn-success-item-2.tp-cn-success-item-2.tp-cn-success-item-2 span,
            html[data-theme="dark"] div.tp-cn-success-item-2.tp-cn-success-item-2.tp-cn-success-item-2 p {
               color: #222F30 !important;
            }
            
            body.high-contrast div.tp-cn-success-item a.tp-btn span.btn-text,
            html[data-theme="dark"] div.tp-cn-success-item a.tp-btn span.btn-text {
               color: #ffffff !important;
            }
         `}</style>
         
         <div className="tp-breadcrumb-ptb upt-90 upb-70 z-index-1">
            <div className="tp-cc-chose-bg">
               <img src="/assets/img/breadcrumb/image-1.jpg" alt="Vishtara Capital Research Team" />
            </div>
            <div className="container">
               <div className="row">
                  <div className="col-lg-5">
                     <div className="tp-breadcrumb-content p-relative">
                        <ul className="tp-breadcrumb-list" aria-label="Breadcrumb">
                           <li><Link to="/">Home</Link></li>
                           <li aria-hidden="true">&gt;</li>
                           <li aria-current="page">About</li>
                        </ul>
                        <h2 className="tp-breadcrumb-title">About us</h2>
                        <p>Providing disciplined, objective market research and analytics <br /> across Equity, F&O, and Commodities.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         


         
         <div className="tp-about-ptb tp-sec-ptb upt-135 upb-110">
            <div className="container">
               <div className="row">
                  <div className="col-lg-5">
                     <div className="tp-about-thumb-wrap umb-30 tp-fade-anim" data-fade-from="left">
                        <img className="radius-6" src={aboutMain} alt="Financial analysis charts on desk" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                     </div>
                  </div>
                  <div className="col-lg-7">
                     <div className="tp-about-wrapper">
                        <div className="tp-fi-about-content upb-50">
                           <span className="tp-section-sub tp-fade-anim">Know about us</span>
                           <h3 className="tp-section-title umb-20" data-text-split data-letters-fade-in>Disciplined Research. Objective Analysis. <br /> Independent Advisory Strategy.</h3>
                           <div className="tp-fade-anim" data-delay=".5">
                              <p>At Vishtara Capital Research, we specialize in offering data-driven, regulatory-compliant market insights. As a SEBI Registered Research Analyst, <br />
                              we focus on identifying high-probability setups with a strict emphasis on risk management and clear Stop-Loss discipline <br />
                              to empower investors and traders to navigate the markets confidently.</p>
                           </div>
                        </div>
                        <div className="row align-items-center">
                           <div className="col-lg-5">
                              <div className="tp-about-thumb umb-30 tp-fade-anim" data-delay=".5" data-fade-from="left">
                                 <img className="radius-6" src={aboutSecondary} alt="Professional discussing market strategy" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                              </div>
                           </div>
                           <div className="col-lg-7">
                              <div className="tp-about-feature umb-30 tp-fade-anim" data-delay=".7">
                                 <h4 className="tp-about-feature-title">Certified & Regulated</h4>
                                 <ul>
                                    <li><i className="fa-regular fa-check"></i> SEBI Registered (INH000027779)</li>
                                    <li><i className="fa-regular fa-check"></i> NISM Certified Professionals</li>
                                    <li><i className="fa-regular fa-check"></i> BSE Enlisted Firm</li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         


         
         <div className="tp-about-vision-ptb upt-80 upb-50" style={{backgroundColor: "#F4F5F7"}} >
            <div className="container">
               <div className="row">
                  <div className="col-lg-12">
                     <div className="tp-about-vision-content umb-55">
                        <span className="tp-section-sub tp-fade-anim">Our vision</span>
                        <h3 className="tp-section-title fs-32 umb-20" data-text-split data-letters-fade-in>Leading the future of wealth research and objective market insights</h3>
                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-lg-6">
                     <div className="tp-about-vision-item umb-30 tp-fade-anim" data-fade-from="left">
                        <div className="tp-about-vision-item-icon">
                           <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none" aria-hidden="true">
                                 <path d="M40.9706 6.87414C36.4697 2.47269 30.3652 0 24 0C17.6348 -7.5e-07 11.5303 2.47269 7.02944 6.87414C2.52857 11.2755 7.5e-07 17.2451 0 23.4697C-7.5e-07 29.6942 2.52856 35.6638 7.02944 40.0652L40.9706 6.87414Z" fill="#8FA5C2"/>
                                 <path d="M44.8086 23.2827H23.8086V44.2827H44.8086V23.2827H" fill="#243F63"/>
                              </svg>
                           </span>
                        </div>
                        <div className="tp-about-vision-item-content">
                           <h4 className="tp-about-vision-item-title">Empowering Trading Decisions</h4>
                           <p>Our vision is to provide objective, mathematical setups to help <br /> traders navigate short-term volatility with high accuracy.</p>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-6">
                     <div className="tp-about-vision-item umb-30 tp-fade-anim" data-delay=".7">
                        <div className="tp-about-vision-item-icon">
                           <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                                 <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#8FA5C2"/>
                                 <path d="M12 48C18.6274 48 24 42.6274 24 36C24 29.3726 18.6274 24 12 24C5.37258 24 0 29.3726 0 36C0 42.6274 5.37258 48 12 48Z" fill="#243F63"/>
                                 <path d="M36 24C42.6274 24 48 18.6274 48 12C48 5.37258 42.6274 0 36 0C29.3726 0 24 5.37258 24 12C24 18.6274 29.3726 24 36 24Z" fill="#243F63"/>
                                 <path d="M36 48C42.6274 48 48 42.6274 48 36C48 29.3726 42.6274 24 36 24C29.3726 24 24 29.3726 24 36C24 42.6274 29.3726 48 36 48Z" fill="#8FA5C2"/>
                              </svg>
                           </span>
                        </div>
                        <div className="tp-about-vision-item-content">
                           <h4 className="tp-about-vision-item-title">Protecting Client Capital</h4>
                           <p>We seek to build long-term trust by putting capital protection <br /> first through strict stop-loss management rules.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         
 
 
         
         <div className="tp-fi-value-ptb tp-sec-ptb upt-130 upb-100">
            <div className="container">
               <div className="row">
                  <div className="col-lg-6">
                     <div className="tp-fi-value-thumb-wrapper p-relative umb-30 umt-30">
                        <div className="tp-fi-value-thumb-main tp-fade-anim" data-fade-from="left">
                           <img src="/assets/img/finance/value/thumb-1.jpg" alt="Graph data presentation" />
                        </div>
                        <div className="tp-fi-value-graph p-relative tp-fade-anim" data-delay=".5" style={{ backgroundColor: "#243F63", backgroundImage: "linear-gradient(135deg, #243F63, #324E73)" }}>
                           <div className="tp-fi-value-graph-icon" style={{ backgroundColor: "#8FA5C2" }}>
                              <span aria-hidden="true">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                                    <path d="M7.16797 8.79303C8.27254 8.79303 9.16797 7.8976 9.16797 6.79303C9.16797 5.68846 8.27254 4.79303 7.16797 4.79303C6.0634 4.79303 5.16797 5.68846 5.16797 6.79303C5.16797 7.8976 6.0634 8.79303 7.16797 8.79303Z" stroke="#ffffff" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M0.5 7.37976V6.20642C0.5 5.51309 1.06667 4.93976 1.76667 4.93976C2.97333 4.93976 3.46667 4.08642 2.86 3.03976C2.51333 2.43976 2.72 1.65976 3.32667 1.31309L4.48 0.653089C5.00667 0.339756 5.68667 0.526423 6 1.05309L6.07333 1.17976C6.67333 2.22642 7.66 2.22642 8.26667 1.17976L8.34 1.05309C8.65333 0.526423 9.33333 0.339756 9.86 0.653089L11.0133 1.31309C11.62 1.65976 11.8267 2.43976 11.48 3.03976C10.8733 4.08642 11.3667 4.93976 12.5733 4.93976C13.2667 4.93976 13.84 5.50642 13.84 6.20642V7.37976C13.84 8.07309 13.2733 8.64642 12.5733 8.64642C11.3667 8.64642 10.8733 9.49975 11.48 10.5464C11.8267 11.1531 11.62 11.9264 11.0133 12.2731L9.86 12.9331C9.33333 13.2464 8.65333 13.0598 8.34 12.5331L8.26667 12.4064C7.66667 11.3598 6.68 11.3598 6.07333 12.4064L6 12.5331C5.68667 13.0598 5.00667 13.2464 4.48 12.9331L3.32667 12.2731C2.72 11.9264 2.51333 11.1464 2.86 10.5464C3.46667 9.49975 2.97333 8.64642 1.76667 8.64642C1.06667 8.64642 0.5 8.07309 0.5 7.37976Z" stroke="#ffffff" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                 </svg>
                              </span>
                           </div>
                           <h3 className="tp-fi-value-graph-title" style={{ color: "#ffffff" }}>Target accuracy</h3>
                           <span className="tp-fi-value-graph-date" style={{ color: "#ffffff" }}>Equity / F&O / Commodity</span>
                           <div className="tp-fi-value-graph-count d-flex justify-content-between">
                              <span style={{ color: "#ffffff" }}>1:2+ R:R</span>
                              <p style={{ color: "#ffffff" }}>Risk-to-reward ratio <br /> discipline</p>
                           </div>
                           <div className="tp-fi-value-graph-range" style={{ backgroundColor: "#ffffff" }}></div>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-6">
                     <div className="tp-fi-value-content umb-30">
                        <div className="tp-fi-value-heading">
                           <span className="tp-section-sub tp-fade-anim">Our core values</span>
                           <h3 className="tp-section-title umb-30" data-text-split data-letters-fade-in>Insight at the core. Independent <br /> strategy in action.</h3>
                           <div className="tp-fade-anim" data-delay=".5">
                              <p>We begin by listening—deeply and intentionally. Every decision is grounded in real data, market <br />
                              signals, and human insight, not assumptions or trends for the sake of trends. This foundation <br />
                              allows us to understand the true challenges and opportunities.</p>
                           </div>
                        </div>
                        <div className="tp-fi-value-list tp-fade-anim" data-delay=".7">
                           <ul>
                              <li><span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8" fill="none">
                                    <path d="M9.18182 1L3.55682 6.7754L1 4.15022" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                 </svg>
                                 </span>
                                 Precision powered by market research and chart analysis.
                              </li>
                              <li><span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8" fill="none">
                                    <path d="M9.18182 1L3.55682 6.7754L1 4.15022" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                 </svg>
                                 </span>
                                 Strict stop-loss discipline on every recommendation.
                              </li>
                              <li><span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8" fill="none">
                                    <path d="M9.18182 1L3.55682 6.7754L1 4.15022" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                 </svg>
                                 </span>
                                 No guaranteed returns—only realistic, data-backed setups.
                              </li>
                              <li><span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8" fill="none">
                                    <path d="M9.18182 1L3.55682 6.7754L1 4.15022" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                 </svg>
                                 </span>
                                 Compliance first in accordance with SEBI guidelines.
                              </li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         


         
         <div className="tp-cn-success-ptb upb-110">
             <div className="container">
                <div className="row">
                   <div className="col-lg-6">
                      <div className="tp-cn-success-item umb-30 radius-6 p-relative" style={{backgroundColor: "#ffffff", backgroundImage: "url(assets/img/consulting/success/bg.jpg)"}}>
                         <div className="tp-cn-success-item-content upb-200">
                            <span className="tp-cn-success-item-sub tp-fade-anim" style={{ color: "#243F63", fontWeight: "600" }}>Vishtara Capital Research</span> 
                            <h3 className="tp-cn-success-item-title" data-text-split data-letters-fade-in style={{ color: "#243F63" }}>Empowering clients with accurate <br />
                            technical analysis & premium <br />
                            market research alerts.</h3>
                            <div className="tp-fade-anim" data-delay=".5">
                               <Link className="tp-btn tp-btn-switch-animation" to="/services">
                                  <span className="d-flex align-items-center justify-content-center">
                                     <span className="btn-text">
                                        Explore Services
                                     </span>
                                     <i className="btn-icon"></i>
                                     <i className="btn-icon"></i>
                                  </span>
                               </Link>
                            </div>
                         </div>
                         <div className="tp-cn-success-item-bottom">
                            <div className="tp-cn-success-item-icon">
                               <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                                     <path fillRule="evenodd" clipRule="evenodd" d="M23.2459 28.9911H34.0597C34.2531 28.9902 34.4383 28.913 34.575 28.7762C34.7118 28.6395 34.789 28.4543 34.7899 28.2609V25.1327C34.789 24.9394 34.7118 24.7541 34.575 24.6174C34.4383 24.4807 34.2531 24.4034 34.0597 24.4026H24.3884C24.3121 25.9922 23.9239 27.5513 23.2459 28.9911ZM26.1055 16.8893V23.1924H34.0597C34.574 23.1934 35.0669 23.3982 35.4305 23.7619C35.7941 24.1255 35.9989 24.6184 36 25.1327V28.2609C36.0001 28.7582 35.8085 29.2364 35.4652 29.5962C35.8085 29.956 36.0001 30.4342 36 30.9315V34.0596C35.9989 34.5739 35.7942 35.0668 35.4305 35.4305C35.0669 35.7941 34.574 35.9989 34.0598 36H13.5368C13.4129 35.9951 13.2894 35.9825 13.1671 35.9622C12.8486 35.9874 12.5267 36 12.2015 36C9.81404 36 7.47901 35.2994 5.48571 33.9852C3.49241 32.671 1.92843 30.8009 0.98752 28.6064C0.0466075 26.412 -0.229892 23.9897 0.192275 21.6397C0.614441 19.2896 1.71672 17.1151 3.36257 15.3854C5.00841 13.6557 7.1255 12.4469 9.45156 11.9088C11.7776 11.3706 14.2105 11.5267 16.4487 12.3578C18.6869 13.1888 20.6321 14.6583 22.0434 16.5842C23.4547 18.51 24.2701 20.8076 24.3884 23.1924H24.8952V16.8893L23.3444 14.2029C20.5527 13.8038 18.0619 11.6111 16.5896 9.06096C15.7342 7.57925 15.2302 6.02364 15.0639 4.55365C14.8888 3.00674 15.0865 1.54537 15.6402 0.349642L15.6411 0.350171C15.6931 0.237576 15.7786 0.143752 15.8858 0.0814892C15.9931 0.0192263 16.1169 -0.00844595 16.2404 0.00224469C17.5552 0.12054 18.9212 0.680701 20.1741 1.60641C22.6787 3.45715 24.4893 6.59515 24.8395 9.68859C25.0007 11.1124 24.8461 12.4636 24.3887 13.602L25.5005 15.5276L26.6123 13.602C26.1549 12.4636 26.0003 11.1124 26.1615 9.68867C26.5117 6.59515 28.3223 3.45708 30.827 1.60641C32.0799 0.680626 33.4458 0.12054 34.7606 0.00224469C34.8841 -0.00844595 35.0079 0.0192263 35.1152 0.0814892C35.2224 0.143752 35.3079 0.237576 35.3599 0.350171L35.3608 0.349642C35.9148 1.54537 36.1122 3.00674 35.9372 4.55365C35.587 7.64717 33.7763 10.7852 31.2716 12.6359C30.1197 13.4871 28.8721 14.0291 27.6565 14.2029L26.1055 16.8893ZM22.5173 12.7699L19.4293 7.42117C19.3899 7.35258 19.3644 7.27689 19.3542 7.19843C19.344 7.11997 19.3494 7.04027 19.3701 6.96389C19.4117 6.80963 19.5129 6.67825 19.6515 6.59863C19.79 6.51901 19.9545 6.49768 20.1087 6.53934C20.1851 6.55997 20.2566 6.59544 20.3193 6.64373C20.382 6.69202 20.4345 6.75218 20.4739 6.82077L23.5597 12.1655C23.9781 10.0925 23.39 7.72084 22.2692 5.7838C21.0185 3.6228 18.9233 1.6819 16.5705 1.26159C16.2389 2.17943 16.134 3.26595 16.2648 4.42144C16.5779 7.18746 18.2091 10.0125 20.4481 11.6669C21.0765 12.1399 21.7744 12.5117 22.5173 12.7699ZM27.4412 12.1655L30.5269 6.82077C30.6072 6.68365 30.7385 6.58382 30.8921 6.54302C31.0457 6.50222 31.2092 6.52376 31.3469 6.60295C31.4847 6.68213 31.5856 6.81255 31.6277 6.9658C31.6698 7.11905 31.6496 7.28272 31.5716 7.42117L28.4837 12.77C30.5018 12.0916 32.2418 10.4018 33.3666 8.45799C34.6175 6.29654 35.2382 3.49626 34.4307 1.26121C32.0777 1.68182 29.9824 3.62287 28.7319 5.7838C27.611 7.72077 27.0225 10.0926 27.4412 12.1655ZM15.1308 21.8135C15.1308 20.5066 14.0679 19.5151 12.8067 19.2796V18.2192C12.8067 18.0587 12.7429 17.9048 12.6294 17.7914C12.516 17.6779 12.3621 17.6141 12.2016 17.6141C12.0411 17.6141 11.8872 17.6779 11.7738 17.7914C11.6603 17.9048 11.5966 18.0587 11.5966 18.2192V19.2799C10.3354 19.515 9.27236 20.5065 9.27236 21.8138C9.27236 23.3252 10.6791 24.4029 12.2016 24.4029C13.6991 24.4029 14.4849 25.8449 13.4527 26.726C12.3812 27.6405 10.4822 27.015 10.4822 25.7814C10.4822 25.6209 10.4185 25.467 10.305 25.3535C10.1915 25.2401 10.0377 25.1763 9.87718 25.1763C9.71671 25.1763 9.56282 25.2401 9.44935 25.3535C9.33588 25.467 9.27214 25.6209 9.27214 25.7814C9.27214 27.0882 10.3352 28.0798 11.5963 28.3148V29.3756C11.5963 29.536 11.6601 29.6899 11.7736 29.8034C11.887 29.9169 12.0409 29.9806 12.2014 29.9806C12.3619 29.9806 12.5158 29.9169 12.6292 29.8034C12.7427 29.6899 12.8064 29.536 12.8064 29.3756V28.3148C14.0676 28.0798 15.1306 27.0882 15.1306 25.7814C15.1306 24.27 13.7238 23.1924 12.2014 23.1924C10.7039 23.1924 9.9181 21.7502 10.9503 20.8691C12.0219 19.9544 13.9205 20.5799 13.9205 21.8135C13.9205 21.9739 13.9842 22.1278 14.0977 22.2413C14.2112 22.3548 14.365 22.4185 14.5255 22.4185C14.686 22.4185 14.8399 22.3548 14.9533 22.2413C15.0668 22.1278 15.1308 21.9739 15.1308 21.8135ZM12.2016 14.7229C10.407 14.7229 8.65263 15.2551 7.16043 16.2522C5.66823 17.2493 4.5052 18.6666 3.81841 20.3247C3.13162 21.9829 2.95191 23.8075 3.30202 25.5678C3.65213 27.3281 4.51632 28.945 5.78532 30.2141C7.05432 31.4832 8.67113 32.3475 10.4313 32.6976C12.1914 33.0478 14.0159 32.8681 15.6739 32.1812C17.332 31.4944 18.7491 30.3313 19.7462 28.839C20.7432 27.3467 21.2754 25.5922 21.2754 23.7975C21.2754 21.3908 20.3194 19.0827 18.6177 17.3809C16.9161 15.6791 14.6081 14.723 12.2016 14.7229ZM17.7621 18.2365C16.6624 17.1366 15.2611 16.3876 13.7357 16.0841C12.2103 15.7807 10.6291 15.9364 9.19218 16.5316C7.75524 17.1269 6.52707 18.1349 5.66298 19.4282C4.79889 20.7215 4.33768 22.242 4.33768 23.7974C4.33768 25.3529 4.79889 26.8734 5.66298 28.1667C6.52707 29.46 7.75524 30.468 9.19218 31.0632C10.6291 31.6585 12.2103 31.8142 13.7357 31.5107C15.2611 31.2073 16.6624 30.4583 17.7621 29.3584C19.2368 27.8835 20.0653 25.8832 20.0653 23.7974C20.0653 21.7117 19.2368 19.7113 17.7621 18.2365ZM23.1932 23.7975C23.1932 21.6234 22.5486 19.4981 21.3408 17.6904C20.1331 15.8827 18.4164 14.4738 16.4079 13.6418C14.3995 12.8098 12.1894 12.5921 10.0573 13.0162C7.92512 13.4404 5.9666 14.4873 4.42939 16.0246C2.89218 17.5619 1.84532 19.5206 1.4212 21.6529C0.997076 23.7852 1.21474 25.9954 2.04665 28.004C2.87857 30.0126 4.28739 31.7294 6.09494 32.9373C7.90249 34.1452 10.0276 34.7899 12.2015 34.7899C13.645 34.7899 15.0743 34.5056 16.4079 33.9532C17.7415 33.4008 18.9532 32.5911 19.9739 31.5703C20.9945 30.5496 21.8042 29.3378 22.3566 28.0041C22.9089 26.6704 23.1932 25.241 23.1932 23.7975ZM17.5058 34.7898H34.0597C34.2531 34.7889 34.4383 34.7117 34.575 34.575C34.7118 34.4382 34.789 34.253 34.7899 34.0596V30.9315C34.789 30.7381 34.7118 30.5529 34.575 30.4161C34.4383 30.2794 34.2531 30.2022 34.0597 30.2013H22.5897C21.3656 32.183 19.6023 33.7748 17.5058 34.7898Z" fill="var(--primary)"/>
                                  </svg>
                               </span>
                            </div>
                            <div className="tp-cn-success-item-wrap">
                               <span style={{ color: "#243F63" }}>1:2+</span>
                               <p style={{ color: "#243F63" }}>Target Risk-to-Reward ratio <br /> maintained on alerts</p>
                            </div>
                         </div>
                         <div className="tp-cn-success-item-shape">
                            <img src="/assets/img/consulting/success/bg-shape.png" alt="" />
                         </div>
                      </div>
                   </div>
                   <div className="col-lg-6">
                      <div className="tp-cn-success-item-2 umb-30" style={{backgroundColor: "#CEF79E", backgroundImage: `url(${professionalResearchBg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                         <div className="tp-cn-success-item-2-shape">
                            <img src="/assets/img/consulting/success/shape.png" alt="" />
                         </div>
                          <div className="tp-cn-success-item-2-content tp-fade-anim" data-delay=".5" data-fade-from="right" style={{backgroundColor: "var(--tp-finance-primary)"}}>
                             <span className="tp-cn-success-item-2-title" style={{ color: "#243F63" }}>Professional Research</span>
                             <p style={{ color: "#243F63" }}>Providing SEBI compliant advisory, detailed <br /> market setups, and strict risk guidance. </p>
                          </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          
 
 
          
          <div className="tp-fa-cta-ptb">
             <div className="tp-fa-cta-thumb" style={{ position: 'relative', height: '21rem', width: '100%', overflow: 'hidden' }}>
                <img src={ctaBannerBg} alt="Premium financial advisory CTA banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
             </div>
          </div>
         
         

      
    </main>
  );
}
