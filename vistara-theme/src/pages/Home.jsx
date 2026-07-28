import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
   const { theme } = useTheme();
   const isDark = theme === 'black-green';
   const sliderTextColor = '#1B2B40';

   const [activeFaq, setActiveFaq] = useState('collapseOne');

   const toggleFaq = (id) => {
      setActiveFaq(activeFaq === id ? null : id);
   };

   useEffect(() => {
      if (window.Swiper) {
         var thumbSwiper = new window.Swiper(".tp-testimonial-bottom-thumb-active", {
            spaceBetween: 24,
            slidesPerView: 4,
            loop: true,
            watchSlidesProgress: true,
            loopedSlides: 4,
            breakpoints: {
               1400: { slidesPerView: 4 },
               1200: { slidesPerView: 4 },
               992: { slidesPerView: 4 },
               768: { slidesPerView: 4 },
               576: { slidesPerView: 3 },
               0: { slidesPerView: 2 },
            },
         });

         var mainSwiper = new window.Swiper(".tp-testimonial-content-active", {
            spaceBetween: 24,
            slidesPerView: 1,
            loop: true,
            loopedSlides: 4,
            autoplay: {
               delay: 6000,
               disableOnInteraction: false,
            },
         });

         var authorSwiper = new window.Swiper(".tp-testimonial-bottom-author-active", {
            spaceBetween: 24,
            slidesPerView: 1,
            loop: true,
            loopedSlides: 4,
            autoplay: {
               delay: 6000,
               disableOnInteraction: false,
            },
         });

         mainSwiper.on('slideChange', function () {
            if (thumbSwiper && thumbSwiper.slideToLoop) thumbSwiper.slideToLoop(mainSwiper.realIndex);
            if (authorSwiper && authorSwiper.slideToLoop) authorSwiper.slideToLoop(mainSwiper.realIndex);
         });
      }
   }, []);

   return (
      <main>
         <style>{`
            body.high-contrast .tp-fi-hero-wrapper h3.tp-fi-hero-title.tp-fi-hero-title,
            body.high-contrast .tp-fi-hero-wrapper div.tp-fi-hero-trust.tp-fi-hero-trust,
            body.high-contrast .tp-fi-hero-wrapper p.text.text {
               color: #222F30 !important;
            }
            body.high-contrast div.tp-fi-cta-wrapper.tp-fi-cta-wrapper.tp-fi-cta-wrapper h3.tp-fi-cta-title,
            body.high-contrast div.tp-fi-cta-wrapper.tp-fi-cta-wrapper.tp-fi-cta-wrapper p,
            body.high-contrast div.tp-fi-cta-wrapper.tp-fi-cta-wrapper.tp-fi-cta-wrapper input {
               color: #111111 !important;
            }
            body.high-contrast .tp-fi-text-slider-wrapper div.tp-fi-text-slider-item.tp-fi-text-slider-item.tp-fi-text-slider-item p,
            body.high-contrast .tp-fi-text-slider-wrapper div.tp-fi-text-slider-item.tp-fi-text-slider-item.tp-fi-text-slider-item span {
               color: #222F30 !important;
            }
            body.high-contrast .sebi-list-item,
            body.high-contrast .tp-fi-brand-slider-item,
            body.high-contrast .tp-fi-brand-slider-item span {
               color: #ffffff !important;
            }
            body.high-contrast .tp-fi-brand-slider-item svg {
               stroke: #ffffff !important;
            }
            body.high-contrast .hero-top-contact a,
            body.high-contrast .hero-top-contact a strong {
               color: #222F30 !important;
            }
            body.high-contrast .hero-top-contact a span {
               background-color: #CEF79E !important;
            }
            body.high-contrast .hero-top-contact a svg path {
               fill: #222F30 !important;
            }
         `}</style>
         <div className="tp-fi-hero-ptb tp-fi-hero-overlay include-bg upt-140 upb-100 p-relative fix"
            style={{ backgroundColor: "#ffffff", backgroundImage: "url(/assets/img/finance/hero/bg.jpg)" }}>
            <div className="tp-fi-hero-shape">
               <svg xmlns="http://www.w3.org/2000/svg" width="747" height="600" viewBox="0 0 747 600" fill="none"
                  className="tp-svg-drawing">
                  <path
                     d="M390.481 0.158447C389.52 60.8155 333.774 194.453 118.481 243.749C-150.636 305.369 132.898 30.9684 405.859 76.2204C422.518 78.1461 448.725 93.551 420.275 139.766C384.713 197.534 3.14443 522.001 542.339 265.894C973.694 61.008 584.949 314.034 336.657 466.158"
                     stroke="var(--tp-theme-primary, #CEF79E)" strokeWidth="20" strokeLinecap="round"
                     strokeLinejoin="round" />
               </svg>
            </div>
            <div className="container">
               <div className="row">
                  <div className="col-lg-12">
                     <div className="tp-fi-hero-wrapper z-index-1">
                        <div className="tp-fi-hero-content upb-145">
                           <h3 className="tp-fi-hero-title" style={{ color: "#222F30" }} data-text-split data-letters-fade-in>Empowering Decisions <br />
                              Through Research.</h3>
                           <div className="tp-fi-hero-trust umb-15 tp-fade-anim" style={{ fontWeight: 700, color: "#222F30", letterSpacing: "2px", fontSize: "12px", textTransform: "uppercase" }}>
                              SEBI REGISTERED &nbsp;•&nbsp; BSE ENLISTED &nbsp;•&nbsp; NISM CERTIFIED
                           </div>
                           <div className="tp-fi-hero-sub tp-fade-anim">
                              <span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38"
                                    fill="none">
                                    <path d="M37 37.7V0.699951H0" stroke="#222F30" strokeWidth="1.4" />
                                    <path d="M36.7533 0.946655L0.740005 36.96" stroke="#222F30" strokeWidth="1.4" />
                                 </svg>
                              </span>
                              <p className="text" style={{ color: "#222F30" }}>
                                 Disciplined, research-driven market insights across Equity, F&O, and <br /> Commodities with a strong emphasis on risk management.
                              </p>
                           </div>
                        </div>
                        <div className="tp-fi-hero-bottom">
                           <div className="tp-fi-hero-btn umb-15 tp-fade-anim" data-delay=".5">
                              <a href="/services" className="tp-btn-event">
                                 <div className="button-text">View Our Services</div>
                                 <div className="button-icon-wrapper">
                                    <img src="/assets/img/finance/hero/btn-arrow.svg" loading="lazy" width="16"
                                       height="16" alt="" className="button-image" />
                                    <div className="button-dot"></div>
                                 </div>
                              </a>
                           </div>
                           <div className="tp-fi-hero-contact tp-fade-anim hero-top-contact">
                              <a href="tel:08602027324" style={{ textDecoration: "none" }}>
                                 <span style={{ backgroundColor: "#CEF79E", color: "#222F30" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                       viewBox="0 0 18 18" fill="none">
                                       <path
                                          d="M13.2811 17.9971C7.18994 18.2031 -3.78322 7.31835 1.31157 1.41675L2.17306 0.667624C2.60914 0.246066 3.19368 0.0131721 3.80018 0.0193408C4.40667 0.0255095 4.98635 0.270245 5.41377 0.700585C5.43687 0.724111 5.45839 0.749136 5.47819 0.775498L6.82662 2.5277C7.2364 2.96132 7.46409 3.5357 7.4627 4.13232C7.46131 4.72894 7.23093 5.30225 6.81912 5.73395L5.95164 6.82468C6.43192 7.99112 7.13782 9.05123 8.02883 9.94417C8.91984 10.8371 9.97842 11.5453 11.1438 12.0281L12.2405 11.1554C12.6778 10.7537 13.2498 10.5305 13.8435 10.5296C14.4373 10.5288 15.0098 10.7505 15.4483 11.1509L17.2012 12.4993C17.2274 12.519 17.2524 12.5403 17.2761 12.563C17.7084 12.9993 17.951 13.5886 17.951 14.2028C17.951 14.817 17.7084 15.4063 17.2761 15.8426L16.5937 16.6292C16.1608 17.0668 15.6447 17.4133 15.0757 17.6483C14.5068 17.8832 13.8966 18.0018 13.2811 17.9971ZM3.77394 1.51638C3.66628 1.5163 3.55967 1.53743 3.46018 1.57856C3.36069 1.61969 3.27028 1.68002 3.19412 1.7561L2.33187 2.50523C-1.89768 7.59028 11.0449 19.8122 15.497 15.6059L16.1802 14.8186C16.2614 14.7463 16.3275 14.6587 16.3747 14.5607C16.4219 14.4628 16.4492 14.3565 16.4551 14.2479C16.4611 14.1393 16.4454 14.0307 16.4092 13.9282C16.3729 13.8257 16.3167 13.7314 16.2438 13.6507L14.5006 12.312C14.4739 12.2924 14.4489 12.2706 14.4257 12.2468C14.2694 12.0979 14.0618 12.0148 13.8459 12.0148C13.63 12.0148 13.4224 12.0979 13.2661 12.2468C13.2462 12.267 13.2252 12.286 13.2032 12.3038L11.7364 13.4724C11.6345 13.5535 11.5134 13.6066 11.3848 13.6265C11.2562 13.6465 11.1246 13.6326 11.003 13.5863C9.49284 13.0237 8.12126 12.1431 6.98116 11.0042C5.84106 9.86524 4.95908 8.49455 4.39496 6.98499C4.34502 6.86166 4.32883 6.72726 4.34805 6.59559C4.36727 6.46393 4.42122 6.33977 4.50433 6.23587L5.66847 4.77058C5.68579 4.74838 5.70456 4.72736 5.72466 4.70765C5.87768 4.55332 5.96353 4.34479 5.96353 4.12745C5.96353 3.91012 5.87768 3.70159 5.72466 3.54726C5.70131 3.52396 5.67977 3.49892 5.66023 3.47235L4.32454 1.73138C4.17362 1.59502 3.97734 1.51971 3.77394 1.52013V1.51638ZM16.8784 9.43912C20.6165 3.9368 14.0317 -2.64126 8.53537 1.09612C8.45248 1.15146 8.38147 1.22278 8.32649 1.30591C8.27152 1.38904 8.23368 1.4823 8.2152 1.58024C8.19672 1.67817 8.19797 1.77881 8.21887 1.87625C8.23977 1.9737 8.27991 2.06599 8.33692 2.14773C8.39394 2.22947 8.4667 2.29902 8.55093 2.35228C8.63516 2.40555 8.72918 2.44148 8.82747 2.45796C8.92576 2.47444 9.02635 2.47114 9.12335 2.44825C9.22035 2.42537 9.3118 2.38336 9.39236 2.32469C13.4931 -0.491271 18.4642 4.48516 15.6498 8.58287C15.5898 8.66336 15.5467 8.75508 15.5229 8.85257C15.4991 8.95006 15.4951 9.05134 15.5112 9.1504C15.5273 9.24946 15.5631 9.34428 15.6165 9.42923C15.67 9.51417 15.7399 9.58751 15.8223 9.6449C15.9046 9.70228 15.9976 9.74254 16.0958 9.76327C16.194 9.78401 16.2954 9.7848 16.3939 9.76561C16.4924 9.74641 16.586 9.70762 16.6693 9.65154C16.7525 9.59545 16.8236 9.52322 16.8784 9.43912ZM13.9882 8.042C14.1287 7.90152 14.2076 7.71101 14.2076 7.51237C14.2076 7.31373 14.1287 7.12322 13.9882 6.98274L12.7102 5.70399V3.76375C12.7102 3.56507 12.6313 3.37453 12.4908 3.23404C12.3503 3.09356 12.1598 3.01463 11.9611 3.01463C11.7624 3.01463 11.5719 3.09356 11.4314 3.23404C11.2909 3.37453 11.212 3.56507 11.212 3.76375V6.01113C11.212 6.20979 11.291 6.4003 11.4315 6.54076L12.9297 8.03901C13.0702 8.17945 13.2607 8.25834 13.4594 8.25834C13.658 8.25834 13.8485 8.17945 13.989 8.03901L13.9882 8.042Z"
                                          fill="#222F30" />
                                    </svg>
                                 </span>
                                 <strong style={{ color: "#222F30" }}>+91-8602027324</strong>
                              </a>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-fi-brand-ptb tp-sec-line tp-sec-ptb upt-130 upb-80">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8">
                     <div className="tp-fi-brand-top text-center upb-70">
                        <h3 className="tp-section-title umb-20" data-text-split data-letters-fade-in>
                           Built on experience, research, <br /> and disciplined market strategies.
                        </h3>
                        <div className="tp-fade-anim" data-delay=".3">
                           <a className="tp-btn-underline" href="/services">Explore our services</a>
                        </div>
                     </div>
                     <div className="tp-fi-brand-wrapper">
                        <div className="tp-fi-brand-slider">
                           <div className="swiper tp-brand-slider-active">
                              <div className="swiper-wrapper">
                                 <div className="swiper-slide">
                                    <div className="tp-fi-brand-slider-item d-flex align-items-center justify-content-center gap-2" style={{ color: sliderTextColor, opacity: 1, fontWeight: 700, letterSpacing: "1px" }}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <line x1="18" y1="20" x2="18" y2="10"></line>
                                          <line x1="12" y1="20" x2="12" y2="4"></line>
                                          <line x1="6" y1="20" x2="6" y2="14"></line>
                                       </svg>
                                       <span style={{ color: sliderTextColor }}>CASH EQUITY</span>
                                    </div>
                                 </div>
                                 <div className="swiper-slide">
                                    <div className="tp-fi-brand-slider-item d-flex align-items-center justify-content-center gap-2" style={{ color: sliderTextColor, opacity: 1, fontWeight: 700, letterSpacing: "1px" }}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                          <polyline points="16 7 22 7 22 13"></polyline>
                                       </svg>
                                       <span style={{ color: sliderTextColor }}>INDEX F&O</span>
                                    </div>
                                 </div>
                                 <div className="swiper-slide">
                                    <div className="tp-fi-brand-slider-item d-flex align-items-center justify-content-center gap-2" style={{ color: sliderTextColor, opacity: 1, fontWeight: 700, letterSpacing: "1px" }}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                                          <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                                       </svg>
                                       <span style={{ color: sliderTextColor }}>STOCK F&O</span>
                                    </div>
                                 </div>
                                 <div className="swiper-slide">
                                    <div className="tp-fi-brand-slider-item d-flex align-items-center justify-content-center gap-2" style={{ color: sliderTextColor, opacity: 1, fontWeight: 700, letterSpacing: "1px" }}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                          <path d="M2 17l10 5 10-5"></path>
                                          <path d="M2 12l10 5 10-5"></path>
                                       </svg>
                                       <span style={{ color: sliderTextColor }}>COMMODITIES</span>
                                    </div>
                                 </div>
                                 <div className="swiper-slide">
                                    <div className="tp-fi-brand-slider-item d-flex align-items-center justify-content-center gap-2" style={{ color: sliderTextColor, opacity: 1, fontWeight: 700, letterSpacing: "1px" }}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                       </svg>
                                       <span style={{ color: sliderTextColor }}>RISK FOCUS</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-fi-stories-ptb tp-sec-line  upb-50">
            <div className="container">
               <div className="row">
                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                     <div className="tp-fi-stories-content h-100 tp-fade-anim">
                        <div className="tp-fi-stories-logo umb-55">
                           <img src="/assets/img/finance/stories/logo-1.png" alt="" />
                        </div>
                        <p>Vishtara Capital Research delivers <br />
                           disciplined, research-backed insights. <br />
                           We focus on structured analysis and <br />
                           risk management to support your <br />
                           investment decisions with clarity <br />
                           and conviction.</p>
                        <div className="tp-fi-stories-btn">
                           <a className="tp-btn-underline" href="/services">View subscriptions</a>
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                     <div className="tp-fi-stories-item h-100 tp-fade-anim" data-delay=".5"
                        style={{ backgroundColor: "#111111", backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/assets/img/finance/stories/card-bg.jpg)" }}>
                        <div className="tp-fi-stories-item-logo">
                           <img src="/assets/img/finance/stories/logo-2.png" alt="" />
                        </div>
                        <div className="tp-fi-stories-item-content">
                           <span style={{ color: "#f1f1f1" }}>Professional market experience</span>
                           <h4 className="tp-fi-stories-item-title" style={{ color: "#fff" }}>5+ Years</h4>
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                     <div className="tp-fi-stories-item d-flex flex-column h-100 tp-fade-anim" data-delay=".7" style={{ backgroundColor: "#F7F7F5" }}>
                        <div className="tp-fi-stories-item-thumb flex-grow-1 d-flex align-items-center justify-content-center pb-4">
                           <img src="/assets/img/finance/stories/mba_qualification.png" alt="" style={{ height: "220px", width: "100%", objectFit: "cover" }} />
                        </div>
                        <div className="tp-fi-stories-item-content style-2" style={{ position: "relative", bottom: "auto", paddingBottom: "30px" }}>
                           <span>Academic qualification</span>
                           <h4 className="tp-fi-stories-item-title">MBA</h4>
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
                     <div className="tp-fi-stories-item style-3 d-flex flex-column h-100 tp-fade-anim" data-delay=".9">
                        <div className="tp-fi-stories-item-content style-2 flex-grow-1" style={{ position: "relative", bottom: "auto", paddingBottom: "30px" }}>
                           <span>Segments covered</span>
                           <h4 className="tp-fi-stories-item-title sebi-list-item" style={{ color: "#1B2B40", fontWeight: "bold" }}>Equity & F&O</h4>
                        </div>
                        <div className="tp-fi-stories-item-icon">
                           <img src="/assets/img/finance/stories/logo-3.png" alt="" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-fi-about-ptb upt-100 umt-130 upb-70" style={{ backgroundColor: "#F7F7F5" }}>
            <div className="container">
               <div className="row align-items-stretch">
                  <div className="col-lg-6 mb-4">
                     <div className="tp-fi-about-content h-100 d-flex flex-column justify-content-center align-items-start umb-30">
                        <span className="tp-section-sub tp-fade-anim">About Vishtara Capital</span>
                        <h3 className="tp-section-title umb-30" data-text-split data-letters-fade-in>Guided by research, <br />
                           driven by discipline, <br />
                           focused on risk.</h3>
                        <div className="tp-fade-anim" data-delay=".5">
                           <p>Vishtara Capital Research is dedicated to delivering objective, structured <br />
                              market insights with a strict emphasis on risk management. Founded by a NISM <br />
                              certified and MBA qualified research analyst, we help you navigate complex <br />
                              financial markets with confidence and clarity, filtering out short-term noise <br />
                              to support informed decision-making.</p>
                        </div>
                        <div className="tp-fi-about-btn-wrap tp-fade-anim" data-delay=".7">
                           <a href="#compliance" className="tp-btn-event">
                              <div className="button-text">Compliance details</div>
                              <div className="button-icon-wrapper">
                                 <img src="/assets/img/finance/hero/btn-arrow.svg" loading="lazy" width="16"
                                    height="16" alt="" className="button-image" />
                                 <div className="button-dot"></div>
                              </div>
                           </a>
                           <a href="/services" className="tp-btn-event tp-btn-border">
                              <div className="button-text">Our offerings</div>
                              <div className="button-icon-wrapper">
                                 <img src="/assets/img/finance/hero/btn-arrow.svg" loading="lazy" width="16"
                                    height="16" alt="" className="button-image" />
                                 <div className="button-dot"></div>
                              </div>
                           </a>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-6 mb-4">
                     <div className="tp-fi-about-thumb-wrap h-100 p-relative text-xl-end umb-30">
                        <img src="/assets/img/finance/about/thumb-1.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
                        <div className="tp-fi-about-thumb-shape" style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", width: "172px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                           <img src="/vistaralogo.svg" alt="Vishtara Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        </div>
                        <div className="tp-fi-about-list tp-fade-anim" data-delay=".7">
                           <div className="tp-fi-about-list-item">
                              <p style={{ backgroundColor: "#1B2B40", color: "#ffffff", border: "none" }}>
                                 <i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9"
                                       fill="none">
                                       <path d="M10.75 0.75L3.875 7.75L0.75 4.56818" stroke="#ffffff"
                                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                 </i>
                                 SEBI Registered Research Analyst (INH000027779)
                              </p>
                           </div>
                           <div className="tp-fi-about-list-item">
                              <p style={{ backgroundColor: "#1B2B40", color: "#ffffff", border: "none" }}>
                                 <i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9"
                                       fill="none">
                                       <path d="M10.75 0.75L3.875 7.75L0.75 4.56818" stroke="#ffffff"
                                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                 </i>
                                 Disciplined Risk Management & Stoploss Focus
                              </p>
                           </div>
                           <div className="tp-fi-about-list-item">
                              <p style={{ backgroundColor: "#1B2B40", color: "#ffffff", border: "none" }}>
                                 <i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9"
                                       fill="none">
                                       <path d="M10.75 0.75L3.875 7.75L0.75 4.56818" stroke="#ffffff"
                                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                 </i>
                                 Multi-Segment Coverage (Equity, F&O & Commodities)
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="tp-fi-service-ptb tp-sec-ptb upt-130 upb-110">
            <div className="container">
               <div className="row align-items-end">
                  <div className="col-lg-8">
                     <div className="tp-fi-service-heading umb-60">
                        <span className="tp-section-sub tp-fade-anim">What We Offer</span>
                        <h3 className="tp-section-title" data-text-split data-letters-fade-in>Research-backed insights <br />
                           designed for structured <br />
                           decisions.</h3>
                     </div>
                  </div>
                  <div className="col-lg-4">
                     <div className="tp-fi-service-right text-lg-end umb-60 tp-fade-anim">
                        <a href="/services" className="tp-btn-event">
                           <div className="button-text">View Pricing</div>
                           <div className="button-icon-wrapper">
                              <img src="/assets/img/finance/hero/btn-arrow.svg" loading="lazy" width="16" height="16"
                                 alt="" className="button-image" />
                              <div className="button-dot"></div>
                           </div>
                        </a>
                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-xl-3 col-lg-4 col-md-6">
                     <div className="tp-fi-service-item text-center umb-30 tp-fade-anim" data-delay=".2">
                        <div className="tp-fi-service-item-icon">
                           <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"
                                 fill="none">
                                 <g clip-path="url(#clip0_966_1460)">
                                    <mask id="mask0_966_1460" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse"
                                       x="0" y="0" width="48" height="48">
                                       <path d="M48 0H0V48H48V0Z" fill="#D9D9D9" />
                                    </mask>
                                    <g mask="url(#mask0_966_1460)">
                                       <path
                                          d="M41.1617 7.59582C36.6608 3.19437 30.5564 0.72168 24.1911 0.72168C17.8259 0.721679 11.7215 3.19437 7.22057 7.59582C2.7197 11.9972 0.191132 17.9668 0.191132 24.1914C0.191131 30.4159 2.71969 36.3855 7.22057 40.7869L24.1911 24.1914L41.1617 7.59582Z"
                                          fill="#222F30" />
                                       <path d="M45 24.0044H24V45.0044H45V24.0044Z" fill="#222F30"
                                          fill-opacity="0.5" />
                                    </g>
                                 </g>
                                 <defs>
                                    <clipPath id="clip0_966_1460">
                                       <rect width="48" height="48" fill="white" />
                                    </clipPath>
                                 </defs>
                              </svg>
                           </span>
                        </div>
                        <div className="tp-fi-service-item-content">
                           <h3 className="tp-fi-service-item-title">
                              <a className="tp-line-anim" href="/services">Cash Market Research</a>
                           </h3>
                           <p>
                              Swing and positional opportunities <br />
                              with stock-specific analysis, precise <br />
                              entry/exit levels, and live updates.
                           </p>
                        </div>
                        <div className="tp-fi-service-item-btn">
                           <a href="/services">
                              <span>
                                 Read more
                              </span>
                              <span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"
                                    fill="none">
                                    <path d="M0.75 6.75H12.75M12.75 6.75L6.75 0.75M12.75 6.75L6.75 12.75"
                                       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                       strokeLinejoin="round" />
                                 </svg>
                              </span>
                           </a>
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                     <div className="tp-fi-service-item text-center umb-30 tp-fade-anim" data-delay=".5">
                        <div className="tp-fi-service-item-icon">
                           <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"
                                 fill="none">
                                 <g clip-path="url(#clip0_966_1480)">
                                    <path
                                       d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                                       fill="#222F30" />
                                    <path
                                       d="M12 48C18.6274 48 24 42.6274 24 36C24 29.3726 18.6274 24 12 24C5.37258 24 0 29.3726 0 36C0 42.6274 5.37258 48 12 48Z"
                                       fill="#222F30" fill-opacity="0.1" />
                                    <path
                                       d="M36 24C42.6274 24 48 18.6274 48 12C48 5.37258 42.6274 0 36 0C29.3726 0 24 5.37258 24 12C24 18.6274 29.3726 24 36 24Z"
                                       fill="#222F30" fill-opacity="0.1" />
                                    <path
                                       d="M36 48C42.6274 48 48 42.6274 48 36C48 29.3726 42.6274 24 36 24C29.3726 24 24 29.3726 24 36C24 42.6274 29.3726 48 36 48Z"
                                       fill="#222F30" />
                                 </g>
                                 <defs>
                                    <clipPath id="clip0_966_1480">
                                       <rect width="48" height="48" fill="white" />
                                    </clipPath>
                                 </defs>
                              </svg>
                           </span>
                        </div>
                        <div className="tp-fi-service-item-content">
                           <h3 className="tp-fi-service-item-title">
                              <a className="tp-line-anim" href="/services">Index F&O Strategy</a>
                           </h3>
                           <p>
                              Strategic Nifty and Bank Nifty <br />
                              recommendations focused on market <br />
                              volatility and trend directional moves.
                           </p>
                        </div>
                        <div className="tp-fi-service-item-btn">
                           <a href="/services">
                              <span>
                                 Read more
                              </span>
                              <span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"
                                    fill="none">
                                    <path d="M0.75 6.75H12.75M12.75 6.75L6.75 0.75M12.75 6.75L6.75 12.75"
                                       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                       strokeLinejoin="round" />
                                 </svg>
                              </span>
                           </a>
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                     <div className="tp-fi-service-item text-center umb-30 tp-fade-anim" data-delay=".7">
                        <div className="tp-fi-service-item-icon">
                           <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"
                                 fill="none">
                                 <g clip-path="url(#clip0_966_1498)">
                                    <mask id="mask0_966_1498" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse"
                                       x="0" y="0" width="48" height="48">
                                       <path d="M48 0H0V48H48V0Z" fill="#D9D9D9" />
                                    </mask>
                                    <g mask="url(#mask0_966_1498)">
                                       <path
                                          d="M0 24C0 17.6348 2.52856 11.5303 7.02943 7.02943C11.5303 2.52856 17.6348 4.80559e-07 24 0C30.3652 -4.80559e-07 36.4697 2.52856 40.9706 7.02943C45.4715 11.5303 48 17.6348 48 24H24H0Z"
                                          fill="#222F30" />
                                       <path
                                          d="M0 48C0 41.6348 2.52856 35.5303 7.02943 31.0295C11.5303 26.5286 17.6348 24 24 24C30.3652 24 36.4697 26.5286 40.9706 31.0295C45.4715 35.5303 48 41.6348 48 48H24H0Z"
                                          fill="#222F30" fill-opacity="0.5" />
                                    </g>
                                 </g>
                                 <defs>
                                    <clipPath id="clip0_966_1498">
                                       <rect width="48" height="48" fill="white" />
                                    </clipPath>
                                 </defs>
                              </svg>
                           </span>
                        </div>
                        <div className="tp-fi-service-item-content">
                           <h3 className="tp-fi-service-item-title">
                              <a className="tp-line-anim" href="/services">Stock F&O Insight</a>
                           </h3>
                           <p>
                              Actionable derivative trading ideas <br />
                              for blue-chip stocks with rigorous <br />
                              risk-to-reward ratio assessment.
                           </p>
                        </div>
                        <div className="tp-fi-service-item-btn">
                           <a href="/services">
                              <span>
                                 Read more
                              </span>
                              <span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"
                                    fill="none">
                                    <path d="M0.75 6.75H12.75M12.75 6.75L6.75 0.75M12.75 6.75L6.75 12.75"
                                       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                       strokeLinejoin="round" />
                                 </svg>
                              </span>
                           </a>
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                     <div className="tp-fi-service-item-2 umb-30 tp-fade-anim" data-delay=".9"
                        style={{ backgroundColor: "#111111", backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/assets/img/finance/about/service-1.jpg)" }}>
                        <div className="tp-fi-service-item-2-content">
                           <div className="tp-fi-service-item-2-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="46" height="43" viewBox="0 0 46 43"
                                 fill="none">
                                 <path
                                    d="M44.036 15.3834V7.81584L24.5766 1.05908L3.76575 8.35638V21.0591L24.5766 27.8158L44.036 21.0591V33.4915L24.5766 41.0591L3.76575 33.4915L13.7657 31.5996"
                                    stroke="var(--tp-theme-primary)" strokeWidth="2" />
                                 <path d="M24.7655 40.8091V12.0591" stroke="var(--tp-theme-primary)" strokeWidth="2" />
                                 <path
                                    d="M24.7654 40.8091V12.0591"
                                    stroke="var(--tp-theme-primary)" strokeWidth="2" />
                                 <path
                                    d="M24.7654 6.05908C26.4222 6.05908 27.7654 7.40223 27.7654 9.05908C27.7654 10.7159 26.4222 12.0591 24.7654 12.0591C23.1085 12.0591 21.7654 10.7159 24.7654 9.05908C21.7654 7.40223 23.1085 6.05908 24.7654 6.05908Z"
                                    stroke="var(--tp-theme-primary)" strokeWidth="2" />
                              </svg>
                           </div>
                           <h3 className="tp-fi-service-item-2-title" style={{ color: "#fff", position: "relative", zIndex: 10 }}>Commodities Research <br />
                              Gold, Silver & Crude <br />
                              market sentiment analysis</h3>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="tp-fi-banner-ptb">
            <div className="tp-fi-banner-wrapper p-relative fix">
               <img src="/assets/img/finance/banner/banner-bg.jpg" alt="" />
               <div className="tp-fi-banner-content tp-fade-anim" data-delay=".5" data-fade-from="right">
                  <h3 className="tp-fi-banner-title">Research-Driven Advisory</h3>
                  <p>Helping investors make informed, structured, and risk-managed <br /> decisions in complex financial markets.</p>
               </div>
               <div className="tp-cn-success-item-2-shape">
                  <img src="/assets/img/consulting/success/shape.png" alt="" />
               </div>
            </div>
         </div>
         <div className="tp-fi-text-ptb upt-10 upb-10" style={{ backgroundColor: "var(--tp-theme-primary)" }}>
            <div className="tp-fi-text-slider-wrapper">
               <div className="swiper tp-text-slider-active">
                  <div className="swiper-wrapper tp-slide-transtion">
                     <div className="swiper-slide">
                        <div className="tp-fi-text-slider-item">
                           <p>VISHTARA CAPITAL RESEARCH
                              <i className="uml-30">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"
                                    fill="none">
                                    <path d="M9.5 0.5V9.5H0.5V0.5H9.5Z" stroke="#222F30" />
                                 </svg>
                              </i>
                           </p>
                        </div>
                     </div>
                     <div className="swiper-slide">
                        <div className="tp-fi-text-slider-item">
                           <p>EMPOWERING DECISIONS THROUGH RESEARCH <i className="uml-30"><svg
                              xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"
                              fill="none">
                              <path d="M9.5 0.5V9.5H0.5V0.5H9.5Z" stroke="#222F30" />
                           </svg></i>
                           </p>
                        </div>
                     </div>
                     <div className="swiper-slide">
                        <div className="tp-fi-text-slider-item">
                           <p>SEBI REGISTERED RESEARCH ANALYST <i className="uml-30"><svg
                              xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"
                              fill="none">
                              <path d="M9.5 0.5V9.5H0.5V0.5H9.5Z" stroke="#222F30" />
                           </svg></i>
                           </p>
                        </div>
                     </div>
                     <div className="swiper-slide">
                        <div className="tp-fi-text-slider-item">
                           <p>REGISTRATION NO. INH000027779 <i className="uml-30"><svg
                              xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"
                              fill="none">
                              <path d="M9.5 0.5V9.5H0.5V0.5H9.5Z" stroke="#222F30" />
                           </svg></i>
                           </p>
                        </div>
                     </div>
                     <div className="swiper-slide">
                        <div className="tp-fi-text-slider-item">
                           <p>CASH EQUITY &nbsp;•&nbsp; INDEX F&O &nbsp;•&nbsp; STOCK F&O <i className="uml-30"><svg
                              xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"
                              fill="none">
                              <path d="M9.5 0.5V9.5H0.5V0.5H9.5Z" stroke="#222F30" />
                           </svg></i>
                           </p>
                        </div>
                     </div>
                     <div className="swiper-slide">
                        <div className="tp-fi-text-slider-item">
                           <p>COMMODITIES & RISK FOCUSED INSIGHTS <i className="uml-30"><svg
                              xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"
                              fill="none">
                              <path d="M9.5 0.5V9.5H0.5V0.5H9.5Z" stroke="#222F30" />
                           </svg></i>
                           </p>
                        </div>
                     </div>
                     <div className="swiper-slide">
                        <div className="tp-fi-text-slider-item">
                           <p>OBJECTIVE MARKET ANALYSIS <i className="uml-30"><svg
                              xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"
                              fill="none">
                              <path d="M9.5 0.5V9.5H0.5V0.5H9.5Z" stroke="#222F30" />
                           </svg></i>
                           </p>
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
                     <div className="tp-fi-value-thumb-wrapper p-relative  umb-30 umt-30">
                        <div className="tp-fi-value-thumb-main">
                           <img src="/assets/img/finance/value/thumb-1.jpg" alt="" />
                        </div>
                        <div className="tp-fi-value-graph p-relative tp-fade-anim">
                           <div className="tp-fi-value-graph-icon">
                              <span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14"
                                    fill="none">
                                    <path
                                       d="M7.16797 8.79303C8.27254 8.79303 9.16797 7.8976 9.16797 6.79303C9.16797 5.68846 8.27254 4.79303 7.16797 4.79303C6.0634 4.79303 5.16797 5.68846 5.16797 6.79303C5.16797 7.8976 6.0634 8.79303 7.16797 8.79303Z"
                                       stroke="#222F30" strokeMiterlimit="10" strokeLinecap="round"
                                       strokeLinejoin="round" />
                                    <path
                                       d="M0.5 7.37976V6.20642C0.5 5.51309 1.06667 4.93976 1.76667 4.93976C2.97333 4.93976 3.46667 4.08642 2.86 3.03976C2.51333 2.43976 2.72 1.65976 3.32667 1.31309L4.48 0.653089C5.00667 0.339756 5.68667 0.526423 6 1.05309L6.07333 1.17976C6.67333 2.22642 7.66 2.22642 8.26667 1.17976L8.34 1.05309C8.65333 0.526423 9.33333 0.339756 9.86 0.653089L11.0133 1.31309C11.62 1.65976 11.8267 2.43976 11.48 3.03976C10.8733 4.08642 11.3667 4.93976 12.5733 4.93976C13.2667 4.93976 13.84 5.50642 13.84 6.20642V7.37976C13.84 8.07309 13.2733 8.64642 12.5733 8.64642C11.3667 8.64642 10.8733 9.49975 11.48 10.5464C11.8267 11.1531 11.62 11.9264 11.0133 12.2731L9.86 12.9331C9.33333 13.2464 8.65333 13.0598 8.34 12.5331L8.26667 12.4064C7.66667 11.3598 6.68 11.3598 6.07333 12.4064L6 12.5331C5.68667 13.0598 5.00667 13.2464 4.48 12.9331L3.32667 12.2731C2.72 11.9264 2.51333 11.1464 2.86 10.5464C3.46667 9.49975 2.97333 8.64642 1.76667 8.64642C1.06667 8.64642 0.5 8.07309 0.5 7.37976Z"
                                       stroke="#222F30" strokeMiterlimit="10" strokeLinecap="round"
                                       strokeLinejoin="round" />
                                 </svg>
                              </span>
                           </div>
                           <h3 className="tp-fi-value-graph-title">Risk-to-Reward</h3>
                           <span className="tp-fi-value-graph-date">Tactical Trading</span>
                           <div className="tp-fi-value-graph-count d-flex justify-content-between">
                              <span>1:2+</span>
                              <p>Average risk to <br /> reward ratio</p>
                           </div>
                           <div className="tp-fi-value-graph-range"></div>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-6">
                     <div className="tp-fi-value-content umb-30">
                        <div className="tp-fi-value-heading">
                           <span className="tp-section-sub tp-fade-anim">Our Core Values</span>
                           <h3 className="tp-section-title umb-30" data-text-split data-letters-fade-in>Research-backed. <br />
                              Risk-conscious. <br />
                              Client-focused.</h3>
                           <div className="tp-fade-anim" data-delay=".5">
                              <p>At Vishtara Capital, we believe that successful trading is built on rigorous <br />
                                 analysis and strict emotional discipline. Every insight is grounded in technical <br />
                                 chart signals, objective data, and market trend parameters—never on speculation <br />
                                 or short-term hype.
                              </p>
                           </div>
                        </div>
                        <div className="tp-fi-value-list tp-fade-anim" data-delay=".7">
                           <ul>
                              <li><span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8"
                                    fill="none">
                                    <path d="M9.18182 1L3.55682 6.7754L1 4.15022" stroke="currentColor"
                                       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </span>
                                 Objectivity in market analysis.
                              </li>
                              <li><span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8"
                                    fill="none">
                                    <path d="M9.18182 1L3.55682 6.7754L1 4.15022" stroke="currentColor"
                                       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </span>
                                 Strict adherence to stoploss rules.
                              </li>
                              <li><span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8"
                                    fill="none">
                                    <path d="M9.18182 1L3.55682 6.7754L1 4.15022" stroke="currentColor"
                                       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </span>
                                 Complete transparency in disclosures.
                              </li>
                              <li><span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8"
                                    fill="none">
                                    <path d="M9.18182 1L3.55682 6.7754L1 4.15022" stroke="currentColor"
                                       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </span>
                                 Client interest and capital focus.
                              </li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-fi-testimonial-ptb tp-sec-ptb upt-130 upb-130" style={{ backgroundColor: "#F7F7F5" }}>
            <div className="container">
               <div className="row">
                  <div className="col-lg-12">
                     <div className="tp-fi-testimonial-heading umb-30">
                        <span className="tp-section-sub tp-fade-anim">Our Research Methodology</span>
                     </div>
                     <div className="tp-fi-testimonial-slider-text upb-110">
                        <div className="swiper tp-testimonial-content-active">
                           <div className="swiper-wrapper">
                              <div className="swiper-slide">
                                 <h3 className="tp-fi-testimonial-title">“ We utilize technical chart patterns, support & resistance zones, <br />
                                    and momentum indicators to identify high-probability <br />
                                    entry and exit points for swing and positional opportunities. “
                                 </h3>
                              </div>
                              <div className="swiper-slide">
                                 <h3 className="tp-fi-testimonial-title">“ Every trade research setup comes with a pre-defined stoploss <br />
                                    and target level, ensuring capital protection is <br />
                                    always prioritized above all else. “
                                 </h3>
                              </div>
                              <div className="swiper-slide">
                                 <h3 className="tp-fi-testimonial-title">“ Our analysis is entirely data-driven, filtering out speculative <br />
                                    rumors and media noise to deliver clear, <br />
                                    unbiased market insights. “
                                 </h3>
                              </div>
                              <div className="swiper-slide">
                                 <h3 className="tp-fi-testimonial-title">“ We provide structured, disciplined research coverage across <br />
                                    Cash Equity (Swing & Positional), Index F&O, <br />
                                    Stock F&O, and Commodities. “
                                 </h3>
                              </div>
                              <div className="swiper-slide">
                                 <h3 className="tp-fi-testimonial-title">“ We utilize technical chart patterns, support & resistance zones, <br />
                                    and momentum indicators to identify high-probability <br />
                                    entry and exit points for swing and positional opportunities. “
                                 </h3>
                              </div>
                              <div className="swiper-slide">
                                 <h3 className="tp-fi-testimonial-title">“ Every trade research setup comes with a pre-defined stoploss <br />
                                    and target level, ensuring capital protection is <br />
                                    always prioritized above all else. “
                                 </h3>
                              </div>
                              <div className="swiper-slide">
                                 <h3 className="tp-fi-testimonial-title">“ Our analysis is entirely data-driven, filtering out speculative <br />
                                    rumors and media noise to deliver clear, <br />
                                    unbiased market insights. “
                                 </h3>
                              </div>
                              <div className="swiper-slide">
                                 <h3 className="tp-fi-testimonial-title">“ We provide structured, disciplined research coverage across <br />
                                    Cash Equity (Swing & Positional), Index F&O, <br />
                                    Stock F&O, and Commodities. “
                                 </h3>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="row align-items-center">
                  <div className="col-lg-3">
                     <div className="tp-fi-testimonial-author-wrap">
                        <div className="swiper tp-testimonial-bottom-author-active">
                           <div className="swiper-wrapper">
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-quote d-flex align-items-center">
                                    <div className="tp-fi-testimonial-quote-icon">
                                       <span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20"
                                             fill="none">
                                             <path
                                                d="M6.47189 0C10.2296 0 12.9422 3.10229 12.9421 7.69573C12.9181 14.3697 7.90087 19.0885 0.662843 19.9946C-0.00867188 20.0787 -0.2676 19.1485 0.35078 18.8735C3.12807 17.6386 4.53074 16.0715 4.71192 14.5204C4.84728 13.3616 4.21731 12.3464 3.42628 12.1563C1.37556 11.6636 0.00155861 9.10975 0.00155861 6.47033C0.00155861 2.89687 2.89842 0 6.47189 0Z"
                                                fill="currentColor" />
                                             <path
                                                d="M20.5891 0C24.3468 0 27.0594 3.10229 27.0593 7.69573C27.0353 14.3697 22.0181 19.0885 14.78 19.9946C14.1085 20.0787 13.8496 19.1485 14.468 18.8735C17.2453 17.6386 18.6479 16.0715 18.8291 14.5204C18.9645 13.3616 18.3345 12.3464 17.5435 12.1563C15.4927 11.6636 14.1187 9.10975 14.1187 6.47033C14.1187 2.89687 17.0156 0 20.5891 0Z"
                                                fill="currentColor" />
                                          </svg>
                                       </span>
                                    </div>
                                    <div className="tp-fi-testimonial-quote-content">
                                       <span>Technical Analysis</span>
                                       <p>Vishtara Methodology</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-quote d-flex align-items-center">
                                    <div className="tp-fi-testimonial-quote-icon">
                                       <span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20"
                                             fill="none">
                                             <path
                                                d="M6.47189 0C10.2296 0 12.9422 3.10229 12.9421 7.69573C12.9181 14.3697 7.90087 19.0885 0.662843 19.9946C-0.00867188 20.0787 -0.2676 19.1485 0.35078 18.8735C3.12807 17.6386 4.53074 16.0715 4.71192 14.5204C4.84728 13.3616 4.21731 12.3464 3.42628 12.1563C1.37556 11.6636 0.00155861 9.10975 0.00155861 6.47033C0.00155861 2.89687 2.89842 0 6.47189 0Z"
                                                fill="currentColor" />
                                             <path
                                                d="M20.5891 0C24.3468 0 27.0594 3.10229 27.0593 7.69573C27.0353 14.3697 22.0181 19.0885 14.78 19.9946C14.1085 20.0787 13.8496 19.1485 14.468 18.8735C17.2453 17.6386 18.6479 16.0715 18.8291 14.5204C18.9645 13.3616 18.3345 12.3464 17.5435 12.1563C15.4927 11.6636 14.1187 9.10975 14.1187 6.47033C14.1187 2.89687 17.0156 0 20.5891 0Z"
                                                fill="currentColor" />
                                          </svg>
                                       </span>
                                    </div>
                                    <div className="tp-fi-testimonial-quote-content">
                                       <span>Risk Management</span>
                                       <p>Vishtara Methodology</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-quote d-flex align-items-center">
                                    <div className="tp-fi-testimonial-quote-icon">
                                       <span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20"
                                             fill="none">
                                             <path
                                                d="M6.47189 0C10.2296 0 12.9422 3.10229 12.9421 7.69573C12.9181 14.3697 7.90087 19.0885 0.662843 19.9946C-0.00867188 20.0787 -0.2676 19.1485 0.35078 18.8735C3.12807 17.6386 4.53074 16.0715 4.71192 14.5204C4.84728 13.3616 4.21731 12.3464 3.42628 12.1563C1.37556 11.6636 0.00155861 9.10975 0.00155861 6.47033C0.00155861 2.89687 2.89842 0 6.47189 0Z"
                                                fill="currentColor" />
                                             <path
                                                d="M20.5891 0C24.3468 0 27.0594 3.10229 27.0593 7.69573C27.0353 14.3697 22.0181 19.0885 14.78 19.9946C14.1085 20.0787 13.8496 19.1485 14.468 18.8735C17.2453 17.6386 18.6479 16.0715 18.8291 14.5204C18.9645 13.3616 18.3345 12.3464 17.5435 12.1563C15.4927 11.6636 14.1187 9.10975 14.1187 6.47033C14.1187 2.89687 17.0156 0 20.5891 0Z"
                                                fill="currentColor" />
                                          </svg>
                                       </span>
                                    </div>
                                    <div className="tp-fi-testimonial-quote-content">
                                       <span>Data Integrity</span>
                                       <p>Vishtara Methodology</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-quote d-flex align-items-center">
                                    <div className="tp-fi-testimonial-quote-icon">
                                       <span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20"
                                             fill="none">
                                             <path
                                                d="M6.47189 0C10.2296 0 12.9422 3.10229 12.9421 7.69573C12.9181 14.3697 7.90087 19.0885 0.662843 19.9946C-0.00867188 20.0787 -0.2676 19.1485 0.35078 18.8735C3.12807 17.6386 4.53074 16.0715 4.71192 14.5204C4.84728 13.3616 4.21731 12.3464 3.42628 12.1563C1.37556 11.6636 0.00155861 9.10975 0.00155861 6.47033C0.00155861 2.89687 2.89842 0 6.47189 0Z"
                                                fill="currentColor" />
                                             <path
                                                d="M20.5891 0C24.3468 0 27.0594 3.10229 27.0593 7.69573C27.0353 14.3697 22.0181 19.0885 14.78 19.9946C14.1085 20.0787 13.8496 19.1485 14.468 18.8735C17.2453 17.6386 18.6479 16.0715 18.8291 14.5204C18.9645 13.3616 18.3345 12.3464 17.5435 12.1563C15.4927 11.6636 14.1187 9.10975 14.1187 6.47033C14.1187 2.89687 17.0156 0 20.5891 0Z"
                                                fill="currentColor" />
                                          </svg>
                                       </span>
                                    </div>
                                    <div className="tp-fi-testimonial-quote-content">
                                       <span>Segment Coverage</span>
                                       <p>Vishtara Methodology</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-quote d-flex align-items-center">
                                    <div className="tp-fi-testimonial-quote-icon">
                                       <span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20"
                                             fill="none">
                                             <path
                                                d="M6.47189 0C10.2296 0 12.9422 3.10229 12.9421 7.69573C12.9181 14.3697 7.90087 19.0885 0.662843 19.9946C-0.00867188 20.0787 -0.2676 19.1485 0.35078 18.8735C3.12807 17.6386 4.53074 16.0715 4.71192 14.5204C4.84728 13.3616 4.21731 12.3464 3.42628 12.1563C1.37556 11.6636 0.00155861 9.10975 0.00155861 6.47033C0.00155861 2.89687 2.89842 0 6.47189 0Z"
                                                fill="currentColor" />
                                             <path
                                                d="M20.5891 0C24.3468 0 27.0594 3.10229 27.0593 7.69573C27.0353 14.3697 22.0181 19.0885 14.78 19.9946C14.1085 20.0787 13.8496 19.1485 14.468 18.8735C17.2453 17.6386 18.6479 16.0715 18.8291 14.5204C18.9645 13.3616 18.3345 12.3464 17.5435 12.1563C15.4927 11.6636 14.1187 9.10975 14.1187 6.47033C14.1187 2.89687 17.0156 0 20.5891 0Z"
                                                fill="currentColor" />
                                          </svg>
                                       </span>
                                    </div>
                                    <div className="tp-fi-testimonial-quote-content">
                                       <span>Technical Analysis</span>
                                       <p>Vishtara Methodology</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-quote d-flex align-items-center">
                                    <div className="tp-fi-testimonial-quote-icon">
                                       <span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20"
                                             fill="none">
                                             <path
                                                d="M6.47189 0C10.2296 0 12.9422 3.10229 12.9421 7.69573C12.9181 14.3697 7.90087 19.0885 0.662843 19.9946C-0.00867188 20.0787 -0.2676 19.1485 0.35078 18.8735C3.12807 17.6386 4.53074 16.0715 4.71192 14.5204C4.84728 13.3616 4.21731 12.3464 3.42628 12.1563C1.37556 11.6636 0.00155861 9.10975 0.00155861 6.47033C0.00155861 2.89687 2.89842 0 6.47189 0Z"
                                                fill="currentColor" />
                                             <path
                                                d="M20.5891 0C24.3468 0 27.0594 3.10229 27.0593 7.69573C27.0353 14.3697 22.0181 19.0885 14.78 19.9946C14.1085 20.0787 13.8496 19.1485 14.468 18.8735C17.2453 17.6386 18.6479 16.0715 18.8291 14.5204C18.9645 13.3616 18.3345 12.3464 17.5435 12.1563C15.4927 11.6636 14.1187 9.10975 14.1187 6.47033C14.1187 2.89687 17.0156 0 20.5891 0Z"
                                                fill="currentColor" />
                                          </svg>
                                       </span>
                                    </div>
                                    <div className="tp-fi-testimonial-quote-content">
                                       <span>Risk Management</span>
                                       <p>Vishtara Methodology</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-quote d-flex align-items-center">
                                    <div className="tp-fi-testimonial-quote-icon">
                                       <span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20"
                                             fill="none">
                                             <path
                                                d="M6.47189 0C10.2296 0 12.9422 3.10229 12.9421 7.69573C12.9181 14.3697 7.90087 19.0885 0.662843 19.9946C-0.00867188 20.0787 -0.2676 19.1485 0.35078 18.8735C3.12807 17.6386 4.53074 16.0715 4.71192 14.5204C4.84728 13.3616 4.21731 12.3464 3.42628 12.1563C1.37556 11.6636 0.00155861 9.10975 0.00155861 6.47033C0.00155861 2.89687 2.89842 0 6.47189 0Z"
                                                fill="currentColor" />
                                             <path
                                                d="M20.5891 0C24.3468 0 27.0594 3.10229 27.0593 7.69573C27.0353 14.3697 22.0181 19.0885 14.78 19.9946C14.1085 20.0787 13.8496 19.1485 14.468 18.8735C17.2453 17.6386 18.6479 16.0715 18.8291 14.5204C18.9645 13.3616 18.3345 12.3464 17.5435 12.1563C15.4927 11.6636 14.1187 9.10975 14.1187 6.47033C14.1187 2.89687 17.0156 0 20.5891 0Z"
                                                fill="currentColor" />
                                          </svg>
                                       </span>
                                    </div>
                                    <div className="tp-fi-testimonial-quote-content">
                                       <span>Data Integrity</span>
                                       <p>Vishtara Methodology</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-quote d-flex align-items-center">
                                    <div className="tp-fi-testimonial-quote-icon">
                                       <span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20"
                                             fill="none">
                                             <path
                                                d="M6.47189 0C10.2296 0 12.9422 3.10229 12.9421 7.69573C12.9181 14.3697 7.90087 19.0885 0.662843 19.9946C-0.00867188 20.0787 -0.2676 19.1485 0.35078 18.8735C3.12807 17.6386 4.53074 16.0715 4.71192 14.5204C4.84728 13.3616 4.21731 12.3464 3.42628 12.1563C1.37556 11.6636 0.00155861 9.10975 0.00155861 6.47033C0.00155861 2.89687 2.89842 0 6.47189 0Z"
                                                fill="currentColor" />
                                             <path
                                                d="M20.5891 0C24.3468 0 27.0594 3.10229 27.0593 7.69573C27.0353 14.3697 22.0181 19.0885 14.78 19.9946C14.1085 20.0787 13.8496 19.1485 14.468 18.8735C17.2453 17.6386 18.6479 16.0715 18.8291 14.5204C18.9645 13.3616 18.3345 12.3464 17.5435 12.1563C15.4927 11.6636 14.1187 9.10975 14.1187 6.47033C14.1187 2.89687 17.0156 0 20.5891 0Z"
                                                fill="currentColor" />
                                          </svg>
                                       </span>
                                    </div>
                                    <div className="tp-fi-testimonial-quote-content">
                                       <span>Segment Coverage</span>
                                       <p>Vishtara Methodology</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-9">
                     <div className="tp-fi-testimonial-slider-wrap">
                        <div className="swiper tp-testimonial-bottom-thumb-active">
                           <div className="swiper-wrapper">
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-slider-thumb">
                                    <img src="/assets/img/finance/testimonial/thumb-1.jpg" alt="" />
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-slider-thumb">
                                    <img src="/assets/img/finance/testimonial/thumb-2.jpg" alt="" />
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-slider-thumb">
                                    <img src="/assets/img/finance/testimonial/thumb-3.jpg" alt="" />
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-slider-thumb">
                                    <img src="/assets/img/finance/testimonial/thumb-4.jpg" alt="" />
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-slider-thumb">
                                    <img src="/assets/img/finance/testimonial/thumb-1.jpg" alt="" />
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-slider-thumb">
                                    <img src="/assets/img/finance/testimonial/thumb-2.jpg" alt="" />
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-slider-thumb">
                                    <img src="/assets/img/finance/testimonial/thumb-3.jpg" alt="" />
                                 </div>
                              </div>
                              <div className="swiper-slide">
                                 <div className="tp-fi-testimonial-slider-thumb">
                                    <img src="/assets/img/finance/testimonial/thumb-4.jpg" alt="" />
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="tp-fi-testimonial-navigation">
                           <span className="tp-testimonial-next">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                                 fill="none">
                                 <path d="M1 9H17M17 9L9 1M17 9L9 17" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>


         <div className="tp-fi-partner-ptb tp-sec-ptb upt-80 upb-60" style={{ backgroundColor: "#243F63", backgroundImage: "linear-gradient(160deg, #243F63 0%, #324E73 60%, #243F63 100%)" }}>
            <div className="container">
               <div className="row align-items-center">
                  <div className="col-lg-7">
                     <div className="tp-fi-partner-wrapper umb-30">
                        <div className="tp-fi-partner-heading" style={{ marginBottom: "40px" }}>
                           <span className="tp-section-sub primary-color tp-fade-anim">Trusted Advisory</span>
                           <h3 className="tp-section-title" style={{ color: "#ffffff" }} data-text-split data-letters-fade-in>SEBI Registered <br />
                              Research Analyst <br />
                              INH000027779</h3>
                        </div>
                        <div className="tp-fi-partner-wrap">
                           <div className="tp-fade-anim" data-delay=".5">
                              <p style={{ color: "#F8FAFC", fontSize: "16px", lineHeight: "1.7", opacity: 0.9 }}>Vishtara Capital Research is committed to delivering disciplined, objective insights with <br />
                                 a strict emphasis on risk management. Every research recommendation is backed by <br />
                                 structured technical analysis and market signals to support your financial decisions.</p>
                           </div>
                           <div className="tp-fi-partner-btn-wrap tp-fade-anim" data-delay=".7">
                              <a href="/services" className="tp-btn-event theme-bg-color">
                                 <div className="button-text">Explore Subscriptions</div>
                                 <div className="button-icon-wrapper">
                                    <img src="/assets/img/finance/hero/btn-arrow.svg" loading="lazy" width="16"
                                       height="16" alt="" className="button-image" />
                                    <div className="button-dot"></div>
                                 </div>
                              </a>
                              <div className="tp-fi-hero-contact">
                                 <a href="tel:08602027324" style={{ color: "#ffffff", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px", opacity: 1, textDecoration: "none" }}>
                                    <span style={{
                                       display: "flex", alignItems: "center", justifyContent: "center",
                                       width: "45px", height: "45px", borderRadius: "50%",
                                       backgroundColor: isDark ? "#1E293B" : "#0F172A",
                                       border: "none", opacity: 1
                                    }}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                          viewBox="0 0 18 18" fill="none">
                                          <path
                                             d="M13.2811 17.9971C7.18994 18.2031 -3.78322 7.31835 1.31157 1.41675L2.17306 0.667624C2.60914 0.246066 3.19368 0.0131721 3.80018 0.0193408C4.40667 0.0255095 4.98635 0.270245 5.41377 0.700585C5.43687 0.724111 5.45839 0.749136 5.47819 0.775498L6.82662 2.5277C7.2364 2.96132 7.46409 3.5357 7.4627 4.13232C7.46131 4.72894 7.23093 5.30225 6.81912 5.73395L5.95164 6.82468C6.43192 7.99112 7.13782 9.05123 8.02883 9.94417C8.91984 10.8371 9.97842 11.5453 11.1438 12.0281L12.2405 11.1554C12.6778 10.7537 13.2498 10.5305 13.8435 10.5296C14.4373 10.5288 15.0098 10.7505 15.4483 11.1509L17.2012 12.4993C17.2274 12.519 17.2524 12.5403 17.2761 12.563C17.7084 12.9993 17.951 13.5886 17.951 14.2028C17.951 14.817 17.7084 15.4063 17.2761 15.8426L16.5937 16.6292C16.1608 17.0668 15.6447 17.4133 15.0757 17.6483C14.5068 17.8832 13.8966 18.0018 13.2811 17.9971ZM3.77394 1.51638C3.66628 1.5163 3.55967 1.53743 3.46018 1.57856C3.36069 1.61969 3.27028 1.68002 3.19412 1.7561L2.33187 2.50523C-1.89768 7.59028 11.0449 19.8122 15.497 15.6059L16.1802 14.8186C16.2614 14.7463 16.3275 14.6587 16.3747 14.5607C16.4219 14.4628 16.4492 14.3565 16.4551 14.2479C16.4611 14.1393 16.4454 14.0307 16.4092 13.9282C16.3729 13.8257 16.3167 13.7314 16.2438 13.6507L14.5006 12.312C14.4739 12.2924 14.4489 12.2706 14.4257 12.2468C14.2694 12.0979 14.0618 12.0148 13.8459 12.0148C13.63 12.0148 13.4224 12.0979 13.2661 12.2468C13.2462 12.267 13.2252 12.286 13.2032 12.3038L11.7364 13.4724C11.6345 13.5535 11.5134 13.6066 11.3848 13.6265C11.2562 13.6465 11.1246 13.6326 11.003 13.5863C9.49284 13.0237 8.12126 12.1431 6.98116 11.0042C5.84106 9.86524 4.95908 8.49455 4.39496 6.98499C4.34502 6.86166 4.32883 6.72726 4.34805 6.59559C4.36727 6.46393 4.42122 6.33977 4.50433 6.23587L5.66847 4.77058C5.68579 4.74838 5.70456 4.72736 5.72466 4.70765C5.87768 4.55332 5.96353 4.34479 5.96353 4.12745C5.96353 3.91012 5.87768 3.70159 5.72466 3.54726C5.70131 3.52396 5.67977 3.49892 5.66023 3.47235L4.32454 1.73138C4.17362 1.59502 3.97734 1.51971 3.77394 1.52013V1.51638ZM16.8784 9.43912C20.6165 3.9368 14.0317 -2.64126 8.53537 1.09612C8.45248 1.15146 8.38147 1.22278 8.32649 1.30591C8.27152 1.38904 8.23368 1.4823 8.2152 1.58024C8.19672 1.67817 8.19797 1.77881 8.21887 1.87625C8.23977 1.9737 8.27991 2.06599 8.33692 2.14773C8.39394 2.22947 8.4667 2.29902 8.55093 2.35228C8.63516 2.40555 8.72918 2.44148 8.82747 2.45796C8.92576 2.47444 9.02635 2.47114 9.12335 2.44825C9.22035 2.42537 9.3118 2.38336 9.39236 2.32469C13.4931 -0.491271 18.4642 4.48516 15.6498 8.58287C15.5898 8.66336 15.5467 8.75508 15.5229 8.85257C15.4991 8.95006 15.4951 9.05134 15.5112 9.1504C15.5273 9.24946 15.5631 9.34428 15.6165 9.42923C15.67 9.51417 15.7399 9.58751 15.8223 9.6449C15.9046 9.70228 15.9976 9.74254 16.0958 9.76327C16.194 9.78401 16.2954 9.7848 16.3939 9.76561C16.4924 9.74641 16.586 9.70762 16.6693 9.65154C16.7525 9.59545 16.8236 9.52322 16.8784 9.43912ZM13.9882 8.042C14.1287 7.90152 14.2076 7.71101 14.2076 7.51237C14.2076 7.31373 14.1287 7.12322 13.9882 6.98274L12.7102 5.70399V3.76375C12.7102 3.56507 12.6313 3.37453 12.4908 3.23404C12.3503 3.09356 12.1598 3.01463 11.9611 3.01463C11.7624 3.01463 11.5719 3.09356 11.4314 3.23404C11.2909 3.37453 11.212 3.56507 11.212 3.76375V6.01113C11.212 6.20979 11.291 6.4003 11.4315 6.54076L12.9297 8.03901C13.0702 8.17945 13.2607 8.25834 13.4594 8.25834C13.658 8.25834 13.8485 8.17945 13.989 8.03901L13.9882 8.042Z"
                                             fill="#D2AF4D"></path>
                                       </svg>
                                    </span>
                                    +91 8602027324
                                 </a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-5">
                     <div className="tp-fi-partner-thumb-wrap text-lg-end p-relative fix umb-30">
                        <div className="main-thumb">
                           <img className="radius-6" src="/assets/img/finance/partner/thumb-1.jpg?v=2" alt="" />
                        </div>
                        <div className="shape-1" style={{ background: "white", padding: "15px 25px", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                           <img src="/vistaralogo.svg" alt="Vishtara Logo" style={{ maxHeight: "45px", objectFit: "contain" }} />
                        </div>
                        <div className="tp-fi-hero-shape">
                           <svg xmlns="http://www.w3.org/2000/svg" width="406" height="262" viewBox="0 0 406 262"
                              fill="none" className="tp-svg-drawing">
                              <path
                                 d="M249.625 0.119141C249.437 11.9514 245.962 28.1556 237.267 45.8374M237.267 45.8374C217.65 85.7325 171.465 133.15 76.5343 154.846C-87.4472 192.324 71.0149 34.1117 237.267 45.8374ZM237.267 45.8374C244.642 46.3576 252.033 47.2122 259.411 48.4332C270.013 49.6563 286.689 59.4415 268.585 88.7968C245.955 125.491 3.13843 331.59 346.262 168.913C620.761 38.7704 373.378 199.491 215.374 296.119"
                                 stroke="var(--tp-theme-primary, #CEF79E)" strokeWidth="15" strokeLinecap="round"
                                 strokeLinejoin="round" />
                           </svg>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-fi-team-ptb tp-sec-ptb upt-130 upb-90">
            <div className="container">
               <div className="row align-items-center">
                  <div className="col-lg-5 tp-fade-anim" data-delay=".3">
                     <div className="tp-fi-team-item umb-30 p-relative" style={{ height: "480px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <div className="tp-fi-team-item-thumb" style={{ position: "relative", left: "0", top: "0", opacity: 1, backgroundColor: "white", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", width: "80px", height: "80px", borderRadius: "50%", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", marginBottom: "25px" }}>
                           <img src="/vistaralogo.svg" alt="Vishtara Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "0" }} />
                        </div>
                        <div className="tp-fi-team-item-content" style={{ transform: "none" }}>
                           <h3 className="tp-fi-team-item-title">Anujay Chouhan</h3>
                           <span>Lead Research Analyst & Founder</span>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-7 tp-fade-anim" data-delay=".5">
                     <div className="tp-fi-team-heading umb-30">
                        <span className="tp-section-sub tp-fade-anim">Founder & Lead Analyst</span>
                        <h3 className="tp-section-title">Anujay Chouhan</h3>
                     </div>
                     <div className="tp-fi-team-details-content">
                        <p style={{ fontSize: "18px", lineHeight: "1.8", marginBottom: "25px" }}>
                           Anujay Chouhan is a SEBI Registered Research Analyst (Reg No. INH000027779) and the founder of Vishtara Capital Research. With an MBA qualification and professional NISM Certification, he brings over 5+ years of active market research experience.
                        </p>
                        <p style={{ fontSize: "16px", lineHeight: "1.7", marginBottom: "30px" }}>
                           Dedicated to providing disciplined, objective research insights across Cash Equity, Index F&O, Stock F&O, and Commodities segments. His research philosophy is built entirely on rule-based trading, data integrity, and strict risk-to-reward ratios, helping market participants make structured, informed decisions.
                        </p>
                        <ul className="tp-fi-hero-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                           <li className="sebi-list-item d-flex align-items-center umb-15" style={{ fontSize: "16px", fontWeight: "500", color: "#1B2B40" }}>
                              <span style={{ color: "#7A5C00", marginRight: "10px", fontWeight: "bold" }}>✓</span> SEBI Registration No: INH000027779
                           </li>
                           <li className="sebi-list-item d-flex align-items-center umb-15" style={{ fontSize: "16px", fontWeight: "500", color: "#1B2B40" }}>
                              <span style={{ color: "#7A5C00", marginRight: "10px", fontWeight: "bold" }}>✓</span> Academic Qualification: MBA
                           </li>
                           <li className="sebi-list-item d-flex align-items-center umb-15" style={{ fontSize: "16px", fontWeight: "500", color: "#1B2B40" }}>
                              <span style={{ color: "#7A5C00", marginRight: "10px", fontWeight: "bold" }}>✓</span> NISM Certified Research Analyst
                           </li>
                           <li className="sebi-list-item d-flex align-items-center umb-15" style={{ fontSize: "16px", fontWeight: "500", color: "#1B2B40" }}>
                              <span style={{ color: "#7A5C00", marginRight: "10px", fontWeight: "bold" }}>✓</span> 5+ Years Active Market Experience
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-fi-banner-ptb">
            <div className="tp-fi-banner-wrapper">
               <img src="/assets/img/finance/banner/banner-bg-2.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="tp-fi-banner-wrap" style={{ backgroundColor: "#243F63", backgroundImage: "linear-gradient(160deg, #243F63 0%, #324E73 60%, #243F63 100%)" }}>
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-lg-8">
                        <p className="tp-fi-banner-text" style={{ color: "#ffffff" }}>
                           Access research-backed insights to navigate the markets with confidence.
                           <a className="link tp-btn-underline" href="/services" style={{ color: "#ffffff" }}>Subscribe to our services today.</a>
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-fi-faq-ptb tp-sec-ptb upt-130 upb-90">
            <div className="container">
               <div className="row">
                  <div className="col-lg-7">
                     <div className="tp-fi-faq-wrapper umb-30">
                        <div className="tp-fi-faq-heading umb-60">
                           <span className="tp-section-sub tp-fade-anim">Vishtara FAQ</span>
                           <h3 className="tp-section-title" data-text-split data-letters-fade-in>
                              Simplifying regulatory and <br /> research questions.
                           </h3>
                        </div>
                        <div className="tp-faq-wrap tp-fade-anim" data-delay=".5">
                           <div className="accordion" id="accordionExample">
                              <div className="accordion-items">
                                 <div className="accordion-header">
                                    <button
                                       className={`accordion-buttons ${activeFaq === 'collapseOne' ? '' : 'collapsed'}`}
                                       type="button"
                                       onClick={() => toggleFaq('collapseOne')}
                                       aria-expanded={activeFaq === 'collapseOne'}
                                    >
                                       Is Vishtara Capital Research SEBI registered?
                                       <span className="tp-faq-icon"></span>
                                    </button>
                                 </div>
                                 <div id="collapseOne" style={{ display: activeFaq === 'collapseOne' ? 'block' : 'none', marginTop: '15px' }}>
                                    <div className="accordion-body">
                                       <p style={{ color: 'var(--text-secondary, #4f5568)', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                                          Yes, Vishtara Capital Research is a SEBI Registered Research Analyst with Registration No. INH000027779. We operate in strict compliance with the SEBI (Research Analysts) Regulations, 2014.
                                       </p>
                                    </div>
                                 </div>
                              </div>
                              <div className="accordion-items">
                                 <div className="accordion-header">
                                    <button
                                       className={`accordion-buttons ${activeFaq === 'collapseTwo' ? '' : 'collapsed'}`}
                                       type="button"
                                       onClick={() => toggleFaq('collapseTwo')}
                                       aria-expanded={activeFaq === 'collapseTwo'}
                                    >
                                       What market segments do you cover in your research?
                                       <span className="tp-faq-icon"></span>
                                    </button>
                                 </div>
                                 <div id="collapseTwo" style={{ display: activeFaq === 'collapseTwo' ? 'block' : 'none', marginTop: '15px' }}>
                                    <div className="accordion-body">
                                       <p style={{ color: 'var(--text-secondary, #4f5568)', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                                          We provide structured research coverage across Cash Equities (swing and positional opportunities), Index F&O (Nifty and Bank Nifty), Stock F&O, and Commodities (Gold, Silver, and Crude Oil).
                                       </p>
                                    </div>
                                 </div>
                              </div>
                              <div className="accordion-items">
                                 <div className="accordion-header">
                                    <button
                                       className={`accordion-buttons ${activeFaq === 'collapseThree' ? '' : 'collapsed'}`}
                                       type="button"
                                       onClick={() => toggleFaq('collapseThree')}
                                       aria-expanded={activeFaq === 'collapseThree'}
                                    >
                                       Do you provide guaranteed returns or manage client portfolios?
                                       <span className="tp-faq-icon"></span>
                                    </button>
                                 </div>
                                 <div id="collapseThree" style={{ display: activeFaq === 'collapseThree' ? 'block' : 'none', marginTop: '15px' }}>
                                    <div className="accordion-body">
                                       <p style={{ color: 'var(--text-secondary, #4f5568)', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                                          No. Under SEBI regulations, Research Analysts are strictly prohibited from offering guaranteed returns, profit-sharing models, or portfolio management services. All stock market investments carry risk, and our research recommendations are designed with structured risk-to-reward parameters to manage that risk.
                                       </p>
                                    </div>
                                 </div>
                              </div>
                              <div className="accordion-items">
                                 <div className="accordion-header">
                                    <button
                                       className={`accordion-buttons ${activeFaq === 'collapseFour' ? '' : 'collapsed'}`}
                                       type="button"
                                       onClick={() => toggleFaq('collapseFour')}
                                       aria-expanded={activeFaq === 'collapseFour'}
                                    >
                                       How are research recommendations delivered to subscribers?
                                       <span className="tp-faq-icon"></span>
                                    </button>
                                 </div>
                                 <div id="collapseFour" style={{ display: activeFaq === 'collapseFour' ? 'block' : 'none', marginTop: '15px' }}>
                                    <div className="accordion-body">
                                       <p style={{ color: 'var(--text-secondary, #4f5568)', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                                          All active research recommendations, market updates, and detailed technical chart analyses are shared instantly with our subscribers through our official channels (Telegram/WhatsApp/Email) to ensure real-time execution support.
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-5">
                     <div className="d-flex justify-content-lg-end tp-fade-anim" data-delay=".7">
                        <div className="tp-fi-faq-support p-relative" style={{ backgroundColor: "#F7F7F5" }}>
                           <div className="tp-fi-faq-support-shape">
                              <img src="/assets/img/finance/banner/faq-bg.png" alt="" />
                           </div>
                           <h3 className="tp-fi-faq-support-title">Hey, do you have any <br /> more questions?</h3>
                           <div className="tp-fi-faq-support-list upb-60">
                              <ul>
                                 <li>
                                    <span>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8"
                                          viewBox="0 0 10 8" fill="none">
                                          <path d="M8.93182 0.75L3.30682 6.5254L0.75 3.90022" stroke="#222F30"
                                             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                    </span>
                                    Real time performance tracking
                                 </li>
                                 <li>
                                    <span>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8"
                                          viewBox="0 0 10 8" fill="none">
                                          <path d="M8.93182 0.75L3.30682 6.5254L0.75 3.90022" stroke="#222F30"
                                             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                    </span>
                                    Automated risk assessment
                                 </li>
                                 <li>
                                    <span>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8"
                                          viewBox="0 0 10 8" fill="none">
                                          <path d="M8.93182 0.75L3.30682 6.5254L0.75 3.90022" stroke="#222F30"
                                             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                    </span>
                                    Multi layered security login
                                 </li>
                                 <li>
                                    <span>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8"
                                          viewBox="0 0 10 8" fill="none">
                                          <path d="M8.93182 0.75L3.30682 6.5254L0.75 3.90022" stroke="#222F30"
                                             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                    </span>
                                    Smart goal setting
                                 </li>
                              </ul>
                           </div>
                           <div className="tp-fi-support-btn">
                              <a href="contact.html" className="tp-btn-event">
                                 <div className="button-text">Schedule a free consultation</div>
                                 <div className="button-icon-wrapper">
                                    <img src="/assets/img/finance/hero/btn-arrow.svg" loading="lazy" width="16"
                                       height="16" alt="" className="button-image" />
                                    <div className="button-dot"></div>
                                 </div>
                              </a>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="tp-fi-cta-ptb upb-80">
            <div className="container">
               <div className="tp-fi-cta-bg radius-6 include-bg" style={{ backgroundColor: "var(--tp-theme-primary)", backgroundImage: "url(/assets/img/finance/cta/cta-bg.png)" }}>
                  <div className="row align-items-center">
                     <div className="col-lg-6">
                        <div className="tp-fi-cta-wrapper">
                           <h3 className="tp-fi-cta-title" style={{ color: "#111111" }} data-text-split data-letters-fade-in>Fresh perspectives, news <br /> &
                              Financial resources</h3>
                           <div className="tp-fi-cta-input d-flex tp-fade-anim">
                              <input type="text" placeholder="Your email address" />
                              <button className="tp-btn-event">
                                 <i className="button-text">Subscribe</i>
                                 <i className="button-icon-wrapper">
                                    <img src="/assets/img/finance/hero/btn-arrow.svg" loading="lazy" width="16"
                                       height="16" alt="" className="button-image" />
                                    <i className="button-dot"></i>
                                 </i>
                              </button>
                           </div>
                           <p style={{ color: "#111111" }}>Over $100 million in contracts closed</p>
                        </div>
                     </div>
                     <div className="col-lg-6">
                        <div className="tp-fi-cta-thumb p-relative text-lg-end tp-fade-anim" data-fade-from="right">
                           <img className="radius-6" src="/assets/img/finance/cta/cta-thumb.png" alt="" />
                           <div className="tp-fi-cta-thumb-shape">
                              <img src="/assets/img/finance/cta/shape.svg" alt="" />
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
