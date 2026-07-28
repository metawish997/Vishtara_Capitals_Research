import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import serviceService from "../services/serviceService";
import useAuth from "../hooks/useAuth";

const PricingCard = ({ service }) => {
   const { user } = useAuth();
   const navigate = useNavigate();

   const [selectedDurationType, setSelectedDurationType] = useState(
      service.durations && service.durations.length > 0 ? service.durations[0].duration_type : ""
   );

   const currentPlan = service.durations?.find(d => d.duration_type === selectedDurationType) || service.durations?.[0];

   if (!currentPlan) return null;

   return (
      <div className="pricing-card" style={{
         background: '#1A2735',
         border: '1px solid rgba(255, 255, 255, 0.05)',
         borderRadius: '12px',
         padding: '30px 25px',
         color: '#ffffff',
         width: '100%',
         display: 'flex',
         flexDirection: 'column',
         height: '100%'
      }}>
         <h3 style={{ color: '#ffffff', textAlign: 'center', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>{service.name}</h3>

         <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px', flexWrap: 'wrap' }} role="group" aria-label="Select billing duration">
            {service.durations.map(dur => (
               <button
                  key={dur.duration_type}
                  onClick={() => setSelectedDurationType(dur.duration_type)}
                  aria-pressed={selectedDurationType === dur.duration_type}
                  style={{
                     padding: '6px 14px',
                     borderRadius: '20px',
                     border: selectedDurationType === dur.duration_type ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                     background: selectedDurationType === dur.duration_type ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                     color: selectedDurationType === dur.duration_type ? '#ffffff' : '#8FA5C2',
                     cursor: 'pointer',
                     textTransform: 'capitalize',
                     transition: 'all 0.3s ease',
                     fontSize: '12px',
                     outline: 'none'
                  }}
               >
                  {dur.duration}
               </button>
            ))}
         </div>

         <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '20px', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#ffffff', margin: 0, fontWeight: '700' }}>₹{currentPlan.price}</h2>
            <span style={{ color: '#8FA5C2', fontSize: '13px' }}>/ {currentPlan.duration}</span>
         </div>

         {service.tagline && (
            <div style={{
               borderLeft: '3px solid #84cc16',
               paddingLeft: '12px',
               marginBottom: '25px',
               color: '#94a3b8',
               fontSize: '13px',
               lineHeight: '1.5',
               textAlign: 'left'
            }}>
               {service.tagline}
            </div>
         )}

         <div style={{ marginBottom: '30px', flexGrow: 1, paddingLeft: '15px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
               {currentPlan.features && currentPlan.features.map((feature, idx) => (
                  <li key={feature._id || `inc-${idx}`} style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', lineHeight: '1.4' }}>
                     <span aria-hidden="true" style={{ 
                        color: feature.svg_icon === '✖' ? '#ef4444' : 
                               feature.svg_icon === 'Premium' ? '#f59e0b' : '#10b981',
                        fontWeight: 'bold',
                        minWidth: '16px'
                     }}>
                        {feature.svg_icon === 'Premium' ? '★' : feature.svg_icon || '✔'}
                     </span>
                     <span style={{ color: feature.svg_icon === '✖' ? '#8FA5C2' : '#ffffff', textDecoration: feature.svg_icon === '✖' ? 'line-through' : 'none' }}>{feature.text}</span>
                  </li>
               ))}
            </ul>
         </div>

         <button style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: 'none',
            background: '#2A4365',
            color: '#ffffff',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'background 0.3s ease'
         }}
            aria-label={`Choose ${service.name}`}
            onMouseOver={(e) => e.target.style.background = '#1E324D'}
            onMouseOut={(e) => e.target.style.background = '#2A4365'}
            onClick={() => {
               if (user) {
                  navigate('/portal/plans');
               } else {
                  navigate('/login');
               }
            }}
         >
            <span>{service.button_text || `Choose ${service.name}`}</span>
         </button>
      </div>
   );
};

export default function Service() {
   const [services, setServices] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchServices = async () => {
         try {
            const res = await serviceService.getServicePlans();
            if (res.success) {
               setServices(res.data);
            }
         } catch (error) {
            console.error("Error fetching services:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchServices();
   }, []);

   return (
      <main>
         <style>{`
            .tp-cn-counter-number .tp-cn-counter-suffix,
            .tp-cn-counter-number .tp-cn-counter-prefix {
               color: inherit !important;
            }
            /* Global visibility fix for section titles after removing GSAP animations */
            .tp-section-title,
            #services-counter-section p {
               opacity: 1 !important;
               visibility: visible !important;
               transform: none !important;
            }

            /* Light mode explicit styling for counter */
            #services-counter-section {
               background-color: #ffffff;
            }
            #services-counter-section .tp-section-title,
            #services-counter-section p,
            #services-counter-section .tp-cn-counter-title,
            #services-counter-section .tp-cn-counter-number,
            #services-counter-section .tp-cn-counter-suffix,
            #services-counter-section .tp-cn-counter-prefix {
               color: #01373D !important;
            }
            .custom-counter-wrapper {
               background-color: #ffffff !important;
               border: 1px solid #eaeaea !important;
            }
            .custom-counter-item {
               border-color: #eaeaea !important;
            }

            /* Dark mode overrides for counter */
            html[data-theme="dark"] #services-counter-section,
            body.high-contrast #services-counter-section {
               background-color: transparent !important;
            }
            html[data-theme="dark"] #services-counter-section .tp-section-title,
            html[data-theme="dark"] #services-counter-section p,
            html[data-theme="dark"] #services-counter-section .tp-cn-counter-title,
            html[data-theme="dark"] #services-counter-section .tp-cn-counter-number,
            html[data-theme="dark"] #services-counter-section .tp-cn-counter-suffix,
            html[data-theme="dark"] #services-counter-section .tp-cn-counter-prefix,
            body.high-contrast #services-counter-section .tp-section-title,
            body.high-contrast #services-counter-section p,
            body.high-contrast #services-counter-section .tp-cn-counter-title,
            body.high-contrast #services-counter-section .tp-cn-counter-number,
            body.high-contrast #services-counter-section .tp-cn-counter-suffix,
            body.high-contrast #services-counter-section .tp-cn-counter-prefix {
               color: #ffffff !important;
            }
            html[data-theme="dark"] .custom-counter-wrapper,
            body.high-contrast .custom-counter-wrapper,
            html[data-theme="dark"] .custom-counter-wrapper .custom-counter-item,
            body.high-contrast .custom-counter-wrapper .custom-counter-item {
               background-color: #1A2735 !important;
               border-color: rgba(255, 255, 255, 0.1) !important;
            }

            body.high-contrast div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item h3,
            body.high-contrast div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item span,
            body.high-contrast div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item p {
               color: #222F30 !important;
            }
            body.high-contrast div.tp-cn-success-item-2.tp-cn-success-item-2.tp-cn-success-item-2 span,
            body.high-contrast div.tp-cn-success-item-2.tp-cn-success-item-2.tp-cn-success-item-2 p {
               color: #222F30 !important;
            }
            html[data-theme="dark"] div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item h3,
            html[data-theme="dark"] div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item span,
            html[data-theme="dark"] div.tp-cn-success-item.tp-cn-success-item.tp-cn-success-item p {
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
               <img src="/assets/img/breadcrumb/image-1.jpg" alt="" />
            </div>
            <div className="container">
               <div className="row">
                  <div className="col-lg-5">
                     <div className="tp-breadcrumb-content p-relative">
                        <ul className="tp-breadcrumb-list">
                           <li><Link to="/">Home</Link></li>
                           <li>&gt;</li>
                           <li>Services</li>
                        </ul>
                        <h2 className="tp-breadcrumb-title">Services</h2>
                        <p>Disciplined, data-driven market intelligence to optimize <br /> execution accuracy and capital protection.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div id="services-counter-section" className="tp-cn-counter-ptb tp-sec-ptb fix upt-140 upb-110 custom-counter-section">
            <div className="container">
               <div className="row">
                  <div className="col-lg-6">
                     <div className="tp-cn-counter-heading umb-30">
                        <h3 className="tp-section-title">
                           Gain disciplined, <br /> mathematical setups
                        </h3>
                        <p>High-probability research alerts with strict target stop-losses <br /> across multiple asset segments.</p>
                     </div>
                  </div>
                  <div className="col-lg-6">
                     <div className="tp-cn-counter-wrapper custom-counter-wrapper umb-30" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: '8px', overflow: 'hidden' }}>
                        <div className="tp-cn-counter-item custom-counter-item" style={{ padding: '40px 30px', borderRightStyle: 'solid', borderRightWidth: '1px', borderBottomStyle: 'solid', borderBottomWidth: '1px' }}>
                           <span className="tp-cn-counter-title" style={{ fontSize: '13px' }}>Active subscribers</span>
                           <h2 className="tp-cn-counter-number" style={{ marginTop: '15px' }}><span className="purecounter">1000</span><span className="tp-cn-counter-suffix">+</span></h2>
                        </div>

                        <div className="tp-cn-counter-item custom-counter-item" style={{ padding: '40px 30px', borderBottomStyle: 'solid', borderBottomWidth: '1px' }}>
                           <span className="tp-cn-counter-title" style={{ fontSize: '13px' }}>SEBI Registered</span>
                           <h2 className="tp-cn-counter-number" style={{ marginTop: '15px' }}><span className="purecounter">100</span><span className="tp-cn-counter-suffix">% <span style={{fontSize:'20px', fontWeight: '500'}}>compliant</span></span></h2>
                        </div>

                        <div className="tp-cn-counter-item custom-counter-item" style={{ padding: '40px 30px', borderRightStyle: 'solid', borderRightWidth: '1px' }}>
                           <span className="tp-cn-counter-title" style={{ fontSize: '13px' }}>Market research</span>
                           <h2 className="tp-cn-counter-number" style={{ marginTop: '15px' }}><span className="purecounter">5</span><span className="tp-cn-counter-suffix">+ years</span></h2>
                        </div>

                        <div className="tp-cn-counter-item custom-counter-item" style={{ padding: '40px 30px' }}>
                           <span className="tp-cn-counter-title" style={{ fontSize: '13px' }}>Accuracy focus</span>
                           <h2 className="tp-cn-counter-number" style={{ marginTop: '15px' }}><span className="tp-cn-counter-prefix">&gt;</span><span className="purecounter">90</span><span className="tp-cn-counter-suffix">% <span style={{fontSize:'20px', fontWeight: '500'}}>target setups</span></span></h2>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-cn-philoshopy-ptb p-relative tp-sec-ptb upt-140 upb-110" style={{ backgroundColor: "#243F63" }}>
            <div className="tp-cn-philoshopy-shape">
               <svg xmlns="http://www.w3.org/2000/svg" width="473" height="563" viewBox="0 0 473 563" fill="none">
                  <path d="M323.421 -91C324.382 -30.343 395.506 191.295 610.799 240.591C879.915 302.211 596.382 27.8099 323.421 73.062C306.761 74.9876 280.555 90.3926 309.004 136.607C344.566 194.376 726.135 518.843 186.941 262.736C-244.415 57.8496 241.973 397.876 490.265 550" stroke="white" strokeOpacity="0.04" strokeWidth="30" />
               </svg>
            </div>
            <div className="container">
               <div className="row">
                  <div className="col-lg-12">
                     <div className="tp-cn-philoshopy-heading umb-70 z-index-1">
                        <span className="tp-section-cn-sub tp-fade-anim" style={{ color: "#ffffff" }}>Vishtara philosophy</span>
                        <h3 className="tp-section-title" style={{ color: "#ffffff" }} data-text-split data-letters-fade-in>Bold strategic interventions that <br /> change the course of trading</h3>
                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-lg-3 col-sm-6">
                     <div className="tp-cn-philoshopy-item text-center umb-30" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "40px 20px", height: "100%" }}>
                        <div className="tp-cn-philoshopy-item-content">
                           <div className="tp-cn-philoshopy-item-icon umb-30">
                              <span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="30" viewBox="0 0 28 30" fill="none">
                                    <path d="M14 0C6.14979 0 0 3.54808 0 8.07692V21.9231C0 26.4519 6.14979 30 14 30C21.8502 30 28 26.4519 28 21.9231V8.07692C28 3.54808 21.8502 0 14 0ZM25.6667 15C25.6667 16.3875 24.5175 17.8024 22.5152 18.8827C20.2606 20.0986 17.236 20.7692 14 20.7692C10.764 20.7692 7.73937 20.0986 5.48479 18.8827C3.4825 17.8024 2.33333 16.3875 2.33333 15V12.6C4.82125 14.7635 9.07521 16.1538 14 16.1538C18.9248 16.1538 23.1787 14.7577 25.6667 12.6V15ZM5.48479 4.19423C7.73937 2.97837 10.764 2.30769 14 2.30769C17.236 2.30769 20.2606 2.97837 22.5152 4.19423C24.5175 5.27452 25.6667 6.68942 25.6667 8.07692C25.6667 9.46442 24.5175 10.8793 22.5152 11.9596C20.2606 13.1755 17.236 13.8462 14 13.8462C10.764 13.8462 7.73937 13.1755 5.48479 11.9596C3.4825 10.8793 2.33333 9.46442 2.33333 8.07692C2.33333 6.68942 3.4825 5.27452 5.48479 4.19423ZM22.5152 25.8058C20.2606 27.0216 17.236 27.6923 14 27.6923C10.764 27.6923 7.73937 27.0216 5.48479 25.8058C3.4825 24.7255 2.33333 23.3106 2.33333 21.9231V19.5231C4.82125 21.6865 9.07521 23.0769 14 23.0769C18.9248 23.0769 23.1787 21.6808 25.6667 19.5231V21.9231C25.6667 23.3106 24.5175 24.7255 22.5152 25.8058Z" fill="#8FA5C2" />
                                 </svg>
                              </span>
                           </div>
                           <h3 className="tp-cn-philoshopy-item-title" style={{ color: "#ffffff", fontSize: "18px" }}>
                              Deep market expertise
                           </h3>
                        </div>
                        <div className="tp-cn-philoshopy-item-text">
                           <p style={{ color: "#ffffff", fontSize: "14px", lineHeight: "1.6", marginTop: "15px" }}>
                              Built around structural chart analysis, <br />
                              technicals, and fundamental macro setups <br />
                              shaping the markets.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                     <div className="tp-cn-philoshopy-item text-center umb-30" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "40px 20px", height: "100%" }}>
                        <div className="tp-cn-philoshopy-item-content">
                           <div className="tp-cn-philoshopy-item-icon umb-30">
                              <span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="39" height="30" viewBox="0 0 39 30" fill="none">
                                    <path d="M30.1935 13.125C30.1935 13.4958 30.0829 13.8584 29.8755 14.1667C29.6681 14.475 29.3734 14.7154 29.0286 14.8573C28.6838 14.9992 28.3043 15.0363 27.9383 14.964C27.5722 14.8916 27.236 14.713 26.9721 14.4508C26.7081 14.1886 26.5284 13.8545 26.4556 13.4908C26.3828 13.1271 26.4202 12.7501 26.563 12.4075C26.7058 12.0649 26.9477 11.772 27.258 11.566C27.5684 11.36 27.9332 11.25 28.3064 11.25C28.8069 11.25 29.2869 11.4475 29.6408 11.7992C29.9947 12.1508 30.1935 12.6277 30.1935 13.125ZM23.9032 5H17.6129C17.2792 5 16.9592 5.1317 16.7233 5.36612C16.4874 5.60054 16.3548 5.91848 16.3548 6.25C16.3548 6.25 16.4874 6.89946 16.7233 7.13388C16.9592 7.3683 17.2792 7.5 17.6129 7.5H23.9032C24.2369 7.5 24.5569 7.3683 24.7928 7.13388C25.0287 6.89946 25.1613 6.58152 25.1613 6.25C25.1613 5.91848 25.0287 5.60054 24.7928 5.36612C24.5569 5.1317 24.2369 5 23.9032 5ZM39 12.5V17.5C39 18.4946 38.6023 19.4484 37.8945 20.1517C37.1867 20.8549 36.2268 21.25 35.2258 21.25H34.8547L32.3055 28.3406C32.131 28.8263 31.8096 29.2465 31.3853 29.5435C30.961 29.8406 30.4547 30.0001 29.9356 30H27.9353C27.4163 30.0001 26.9099 29.8406 26.4856 29.5435C26.0614 29.2465 25.74 28.8263 25.5654 28.3406L25.2635 27.5H16.2526L15.9507 28.3406C15.7762 28.8263 15.4547 29.2465 15.0305 29.5435C14.6062 29.8406 14.0998 30.0001 13.5808 30H11.5805C11.0614 30.0001 10.5551 29.8406 10.1308 29.5435C9.70655 29.2465 9.38513 28.8263 9.2106 28.3406L7.23387 22.8469C5.35335 20.7322 4.17585 18.0921 3.86226 15.2875C3.45625 15.4994 3.11625 15.8175 2.879 16.2074C2.64175 16.5974 2.51627 17.0443 2.51613 17.5C2.51613 17.8315 2.38358 18.1495 2.14765 18.3839C1.91172 18.6183 1.59172 18.75 1.25806 18.75C0.924405 18.75 0.604411 18.6183 0.368478 18.3839C0.132546 18.1495 0 17.8315 0 17.5C0.00192229 16.3853 0.378713 15.3031 1.07051 14.4255C1.7623 13.5479 2.72943 12.9252 3.81822 12.6562C4.09927 9.21145 5.6739 5.99764 8.22944 3.65301C10.785 1.30837 14.1345 0.0043884 17.6129 0H33.9677C34.3014 0 34.6214 0.131696 34.8573 0.366117C35.0932 0.600537 35.2258 0.918479 35.2258 1.25C35.2258 1.58152 35.0932 1.89946 34.8573 2.13388C34.6214 2.3683 34.3014 2.5 33.9677 2.5H30.604C32.6918 3.95546 34.3338 5.9563 35.3484 8.28125C35.4161 8.4375 35.4821 8.59375 35.545 8.75C36.4897 8.82967 37.3696 9.25966 38.0097 9.95448C38.6498 10.6493 39.0034 11.558 39 12.5ZM36.4838 12.5C36.4838 12.1685 36.3513 11.8505 36.1154 11.6161C35.8794 11.3817 35.5594 11.25 35.2258 11.25H34.6502C34.3823 11.2503 34.1213 11.1656 33.9051 11.0082C33.689 10.8508 33.5292 10.629 33.4488 10.375C32.728 8.08958 31.291 6.09285 29.3475 4.67617C27.4039 3.25949 25.0556 2.49701 22.6451 2.5H17.6129C15.4156 2.49989 13.2657 3.13505 11.4254 4.32803C9.58508 5.52102 8.13392 7.22028 7.24885 9.21859C6.36378 11.2169 6.08304 13.4279 6.44087 15.582C6.7987 17.7362 7.77964 19.7403 9.26407 21.35C9.37758 21.4727 9.46527 21.6166 9.52197 21.7734L11.5805 27.5H13.5808L14.1815 25.8297C14.2687 25.587 14.4293 25.377 14.6413 25.2285C14.8533 25.0799 15.1063 25.0001 15.3657 25H26.1504C26.4098 25.0001 26.6628 25.0799 26.8748 25.2285C27.0868 25.377 27.2474 25.587 27.3346 25.8297L27.9353 27.5H29.9356L32.7836 19.5797C32.8708 19.337 33.0314 19.127 33.2434 18.9785C33.4553 18.8299 33.7083 18.7501 33.9677 18.75H35.2258C35.5594 18.75 35.8794 18.6183 36.1154 18.3839C36.3513 18.1495 36.4838 17.8315 36.4838 17.5V12.5Z" fill="#8FA5C2" />
                                 </svg>
                              </span>
                           </div>
                           <h3 className="tp-cn-philoshopy-item-title" style={{ color: "#ffffff", fontSize: "18px" }}>
                              Built on compliance
                           </h3>
                        </div>
                        <div className="tp-cn-philoshopy-item-text">
                           <p style={{ color: "#ffffff", fontSize: "14px", lineHeight: "1.6", marginTop: "15px" }}>
                              Strict adherence to SEBI regulations <br />
                              and transparent performance parameters <br />
                              across all alert channels.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                     <div className="tp-cn-philoshopy-item text-center umb-30" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "40px 20px", height: "100%" }}>
                        <div className="tp-cn-philoshopy-item-content">
                           <div className="tp-cn-philoshopy-item-icon umb-30">
                              <span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <path d="M8.08144 23.6539C8.08144 23.9962 7.97996 24.3308 7.78981 24.6154C7.59967 24.9 7.32942 25.1219 7.01323 25.2529C6.69704 25.3839 6.34911 25.4182 6.01344 25.3514C5.67777 25.2846 5.36945 25.1198 5.12744 24.8777C4.88544 24.6356 4.72063 24.3273 4.65387 23.9915C4.5871 23.6558 4.62137 23.3078 4.75234 22.9915C4.88331 22.6753 5.1051 22.405 5.38966 22.2148C5.67423 22.0246 6.00879 21.9231 6.35103 21.9231C6.80996 21.9231 7.2501 22.1055 7.57462 22.43C7.89913 22.7546 8.08144 23.1948 8.08144 23.6539ZM30 20.2197V27.6923C30 28.3043 29.7569 28.8913 29.3242 29.3241C28.8915 29.7569 28.3047 30 27.6928 30H6.35103C5.96727 30.0002 5.5842 29.9674 5.20607 29.9019C3.55645 29.6009 2.09305 28.659 1.13571 27.282C0.178365 25.905 -0.195067 24.2049 0.0970301 22.5534L3.70206 1.90972C3.7533 1.61143 3.86292 1.32619 4.02464 1.07038C4.18636 0.814558 4.39699 0.593197 4.64444 0.418993C4.8919 0.244788 5.1713 0.121169 5.46664 0.0552277C5.76197 -0.0107137 6.06742 -0.0176794 6.36545 0.0347304L14.259 1.44242C14.8596 1.55068 15.3929 1.89254 15.7421 2.39317C16.0912 2.89379 16.2279 3.51239 16.1221 4.11356L14.3801 14.0654L24.1584 10.5289C24.7316 10.3218 25.3634 10.35 25.9159 10.6073C26.4684 10.8645 26.8967 11.33 27.1073 11.902L29.8558 19.4265C29.9441 19.682 29.9927 19.9495 30 20.2197ZM10.2445 24.3563L13.8495 3.7126L5.98476 2.3078L2.37973 22.9471C2.19152 23.9969 2.42614 25.0786 3.03238 25.956C3.63863 26.8334 4.56727 27.4353 5.6156 27.6303C6.1288 27.7223 6.65517 27.7115 7.16413 27.5983C7.67309 27.4852 8.15449 27.272 8.58038 26.9712C9.01715 26.6673 9.38918 26.2797 9.67486 25.8308C9.96053 25.3819 10.1541 24.8807 10.2445 24.3563ZM12.2315 25.8173L27.6928 20.2082L24.9414 12.6924L13.9216 16.6875L12.5113 24.7529C12.4486 25.115 12.355 25.4712 12.2315 25.8173ZM27.6928 22.6616L13.812 27.6923H27.6928V22.6616Z" fill="#8FA5C2" />
                                 </svg>
                              </span>
                           </div>
                           <h3 className="tp-cn-philoshopy-item-title" style={{ color: "#ffffff", fontSize: "18px" }}>
                              Evidence led setups
                           </h3>
                        </div>
                        <div className="tp-cn-philoshopy-item-text">
                           <p style={{ color: "#ffffff", fontSize: "14px", lineHeight: "1.6", marginTop: "15px" }}>
                              Turning technical analysis, support/resistance, <br />
                              and volume profiles into data-backed <br />
                              market research alerts.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                     <div className="tp-cn-philoshopy-item text-center umb-30" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "40px 20px", height: "100%" }}>
                        <div className="tp-cn-philoshopy-item-content">
                           <div className="tp-cn-philoshopy-item-icon umb-30">
                              <span>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <path d="M15 0C12.0333 0 9.13319 0.879735 6.66645 2.52796C4.19971 4.17618 2.27713 6.51886 1.14181 9.25975C0.00649927 12.0006 -0.290551 15.0166 0.288227 17.9264C0.867006 20.8361 2.29562 23.5088 4.3934 25.6066C6.49119 27.7044 9.16393 29.133 12.0736 29.7118C14.9834 30.2906 17.9994 29.9935 20.7403 28.8582C23.4811 27.7229 25.8238 25.8003 27.472 23.3335C29.1203 20.8668 30 17.9667 30 15C29.9958 11.023 28.4141 7.21017 25.602 4.39804C22.7898 1.5859 18.977 0.00419974 15 0ZM20.6394 19.0082C21.4742 17.8384 21.923 16.4371 21.923 15C21.923 13.5629 21.4742 12.1616 20.6394 10.9918L24.75 6.88269C26.6511 9.16041 27.6925 12.0331 27.6925 15C27.6925 17.9668 26.6511 20.8396 24.75 23.1173L20.6394 19.0082ZM10.3846 15C10.3846 14.0872 10.6553 13.1948 11.1625 12.4358C11.6696 11.6768 12.3904 11.0853 13.2338 10.7359C14.0771 10.3866 15.0051 10.2952 15.9004 10.4733C16.7957 10.6514 17.6181 10.7159 18.2636 11.7364C18.909 12.3819 19.3486 13.2043 19.5267 14.0996C19.7048 14.9949 19.6134 15.9229 19.2641 16.7662C18.9147 17.6096 18.3232 18.3304 17.5642 18.8375C16.8052 19.3447 15.9128 19.6154 15 19.6154C13.7759 19.6154 12.602 19.1291 11.7364 18.2636C10.8709 17.398 10.3846 16.2241 15 19.6154ZM23.1173 5.25L19.0082 9.36057C17.8384 8.52576 16.4371 8.07703 15 8.07703C13.5629 8.07703 12.1616 8.52576 10.9918 9.36057L6.8827 5.25C9.16041 3.34889 12.0332 2.30755 15 2.30755C17.9669 2.30755 20.8396 3.34889 23.1173 5.25ZM5.25001 6.88269L9.36058 10.9918C8.52576 12.1616 8.07703 13.5629 8.07703 15C8.07703 16.4371 8.52576 17.8384 9.36058 19.0082L5.25001 23.1173C3.3489 20.8396 2.30755 17.9668 2.30755 15C2.30755 12.0331 3.3489 9.16041 5.25001 6.88269ZM6.8827 24.75L10.9918 20.6394C12.1616 21.4742 13.5629 21.923 15 21.923C16.4371 21.923 17.8384 21.4742 19.0082 20.6394L23.1173 24.75C20.8396 26.6511 17.9669 27.6924 15 27.6924C12.0332 27.6924 9.16041 26.6511 6.8827 24.75Z" fill="#8FA5C2" />
                                 </svg>
                              </span>
                           </div>
                           <h3 className="tp-cn-philoshopy-item-title" style={{ color: "#ffffff", fontSize: "18px" }}>
                              Risk management
                           </h3>
                        </div>
                        <div className="tp-cn-philoshopy-item-text">
                           <p style={{ color: "#ffffff", fontSize: "14px", lineHeight: "1.6", marginTop: "15px" }}>
                              Managing downside risk dynamically <br />
                              through predefined stop-losses <br />
                              and objective risk parameters.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-fi-service-ptb tp-sec-ptb upt-130 upb-110">
            <div className="container">
               <div className="row">
                  <div className="col-lg-12">
                     <div className="tp-fi-service-heading text-center umb-60">
                        <span className="tp-section-sub tp-fade-anim">What we provide</span>
                        <h3 className="tp-section-title">Disciplined market research &amp; advisory</h3>
                     </div>
                  </div>
               </div>
               <div className="row justify-content-center">
                  <div className="col-lg-3 col-md-6 col-sm-12">
                     <div className="tp-fi-service-item text-center umb-30" style={{ minHeight: "380px" }}>
                        <div className="tp-fi-service-item-icon">
                           <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                 <g clipPath="url(#clip0_966_1460)">
                                    <mask id="mask0_966_1460" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
                                       <path d="M48 0H0V48H48V0Z" fill="#D9D9D9" />
                                    </mask>
                                    <g mask="url(#mask0_966_1460)">
                                       <path d="M41.1617 7.59582C36.6608 3.19437 30.5564 0.72168 24.1911 0.72168C17.8259 0.721679 11.7215 3.19437 7.22057 7.59582C2.7197 11.9972 0.191132 17.9668 0.191132 24.1914C0.191131 30.4159 2.71969 36.3855 7.22057 40.7869L24.1911 24.1914L41.1617 7.59582Z" fill="var(--primary)" />
                                       <path d="M45 24.0044H24V45.0044H45V24.0044Z" fill="#8FA5C2" />
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
                              <Link className="tp-line-anim" to="/contact">Equity Research</Link>
                           </h3>
                           <p>
                              High-probability equity research alerts with strict target stop-losses and technical chart analysis.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-12">
                     <div className="tp-fi-service-item text-center umb-30" style={{ minHeight: "380px" }}>
                        <div className="tp-fi-service-item-icon">
                           <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                 <g clipPath="url(#clip0_966_1480)">
                                    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="var(--primary)" />
                                    <path d="M12 48C18.6274 48 24 42.6274 24 36C24 29.3726 18.6274 24 12 24C5.37258 24 0 29.3726 0 36C0 42.6274 5.37258 48 12 48Z" fill="#8FA5C2" />
                                    <path d="M36 24C42.6274 24 48 18.6274 48 12C48 5.37258 42.6274 0 36 0C29.3726 0 24 5.37258 24 12C24 18.6274 29.3726 24 36 24Z" fill="#8FA5C2" />
                                    <path d="M36 48C42.6274 48 48 42.6274 48 36C48 29.3726 42.6274 24 36 24C29.3726 24 24 29.3726 24 36C24 42.6274 29.3726 48 36 48Z" fill="var(--primary)" />
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
                              <Link className="tp-line-anim" to="/contact">F&amp;O Advisory</Link>
                           </h3>
                           <p>
                              Strategic derivative alerts targeting index and stock options with strict risk-to-reward parameters.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-12">
                     <div className="tp-fi-service-item text-center umb-30" style={{ minHeight: "380px" }}>
                        <div className="tp-fi-service-item-icon">
                           <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                 <g clipPath="url(#clip0_966_1498)">
                                    <mask id="mask0_966_1498" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
                                       <path d="M48 0H0V48H48V0Z" fill="#D9D9D9" />
                                    </mask>
                                    <g mask="url(#mask0_966_1498)">
                                       <path d="M0 24C0 17.6348 2.52856 11.5303 7.02943 7.02943C11.5303 2.52856 17.6348 4.80559e-07 24 0C30.3652 -4.80559e-07 36.4697 2.52856 40.9706 7.02943C45.4715 11.5303 48 17.6348 48 24H24H0Z" fill="var(--primary)" />
                                       <path d="M0 48C0 41.6348 2.52856 35.5303 7.02943 31.0295C11.5303 26.5286 17.6348 24 24 24C30.3652 24 36.4697 26.5286 40.9706 31.0295C45.4715 35.5303 48 41.6348 48 48H24H0Z" fill="#8FA5C2" />
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
                              <Link className="tp-line-anim" to="/contact">Commodity Trends</Link>
                           </h3>
                           <p>
                              Deep structural research across Gold, Silver, Crude Oil, and base metals for swing setup opportunities.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-12">
                     <div className="tp-fi-service-item text-center umb-30" style={{ minHeight: "380px" }}>
                        <div className="tp-fi-service-item-icon">
                           <span>
                              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M5.8125 37.9688V25.5H1.40625C0.62959 25.5 0 26.1296 0 26.9063V46.5938C0 47.3704 0.62959 48 1.40625 48H21.0938C21.8704 48 22.5 47.3704 22.5 46.5938V42.1875H10.0313C7.70508 42.1875 5.8125 40.2949 5.8125 37.9688Z" fill="#8FA5C2" />
                                 <path d="M46.5938 0H10.0313C9.25459 0 8.625 0.62959 8.625 1.40625V37.9688C8.625 38.7454 9.25459 39.375 10.0313 39.375H46.5938C47.3704 39.375 48 38.7454 48 37.9688V1.40625C48 0.62959 47.3704 0 46.5938 0ZM41.0414 14.417C41.0414 15.1934 40.4118 15.8232 39.6352 15.8232C38.8582 15.8232 38.2289 15.1934 38.2289 14.417V11.7129L26.4709 23.4709C26.1967 23.7454 25.8366 23.8828 25.4766 23.8828C25.1168 23.8828 24.757 23.7454 24.4822 23.4709C23.9329 22.9219 23.9329 22.0313 24.4822 21.4822L36.3064 9.65801H33.4617C32.6851 9.65801 32.0555 9.02871 32.0555 8.25176C32.0555 7.4751 32.6851 6.84551 33.4617 6.84551H39.6352C40.4118 6.84551 41.0414 7.4751 41.0414 8.25176V14.417Z" fill="var(--primary)" />
                              </svg>
                           </span>
                        </div>
                        <div className="tp-fi-service-item-content">
                           <h3 className="tp-fi-service-item-title">
                              <Link className="tp-line-anim" to="/contact">Strategic Asset Allocation</Link>
                           </h3>
                           <p>
                              Long-term investment models focusing on asset distribution aligned with risk profiles and capital protection.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         {/* Pricing Section */}
         <div className="tp-pricing-ptb tp-sec-ptb upt-110 upb-110" style={{ backgroundColor: "#030712" }}>
            <div className="container ps-12 pe-12">
               <div className="row">
                  <div className="col-lg-12">
                     <div className="text-center umb-60">
                        <span className="tp-section-sub" style={{ color: '#3b82f6', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '14px', fontWeight: 'bold' }}>Our Services</span>
                        <h3 className="tp-section-title" style={{ color: '#fff' }}>Choose the Plan That Fits You Best</h3>
                        <p style={{ color: '#9ca3af' }}>Flexible durations. Powerful features. Maximum value.</p>
                     </div>
                  </div>
               </div>
               <div className="row justify-content-center align-items-stretch">
                  {loading ? (
                     <div className="col-12 text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                           <span className="visually-hidden">Loading...</span>
                        </div>
                     </div>
                  ) : services && services.length > 0 ? (
                     services.map((service) => (
                        <div key={service._id} className="col-lg-4 col-md-6 col-sm-12 umb-30 d-flex">
                           <PricingCard service={service} />
                        </div>
                     ))
                  ) : (
                     <div className="col-12 text-center py-5">
                        <p style={{ color: '#9ca3af' }}>No services available at the moment.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>

         <div className="tp-fi-banner-ptb">
            <div className="tp-fi-banner-wrapper">
               <img src="/assets/img/finance/banner/banner-bg-2.webp" alt="" />
            </div>
            <div className="tp-fi-banner-wrap" style={{ backgroundColor: "#222F30" }}>
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-lg-8">
                        <p className="tp-fi-banner-text">
                           <span className="video">
                              <a href="#" className="popup-video">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none">
                                    <path d="M7.07143 5.08418C7.73809 4.69928 7.7381 3.73703 7.07143 3.35213L1.5 0.135466C0.833334 -0.249434 0 0.231691 0 1.00149V7.43482C0 8.20462 0.833333 8.68575 1.5 8.30085L7.07143 5.08418Z" fill="#222F30" />
                                 </svg>
                              </a>
                           </span>
                           Let’s make something great work together.
                           <a className="link tp-btn-underline" href="https://vimeo.com/706869971?fl=pl&fe=cm">Got a project in mind?</a>
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-cn-success-ptb tp-sec-ptb upt-140 upb-110">
            <div className="container">
               <div className="row">
                  <div className="col-lg-6">
                     <div className="tp-cn-success-item umb-30 radius-6 p-relative" style={{ backgroundColor: "#ffffff", backgroundImage: "url(assets/img/consulting/success/bg.jpg)" }}>
                        <div className="tp-cn-success-item-content upb-200">
                           <span className="tp-cn-success-item-sub tp-fade-anim" style={{ color: "#243F63", fontWeight: "600" }}>Vishtara Capital Research</span>
                           <h3 className="tp-cn-success-item-title" data-text-split data-letters-fade-in style={{ color: "#243F63" }}>Empowering clients with accurate <br />
                              technical analysis &amp; premium <br />
                              market research alerts.</h3>
                           <div className="tp-fade-anim" data-delay=".5">
                              <Link className="tp-btn tp-btn-switch-animation" to="/contact">
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
                                    <path fillRule="evenodd" clipRule="evenodd" d="M23.2459 28.9911H34.0597C34.2531 28.9902 34.4383 28.913 34.575 28.7762C34.7118 28.6395 34.789 28.4543 34.7899 28.2609V25.1327C34.789 24.9394 34.7118 24.7541 34.575 24.6174C34.4383 24.4807 34.2531 24.4034 34.0597 24.4026H24.3884C24.3121 25.9922 23.9239 27.5513 23.2459 28.9911ZM26.1055 16.8893V23.1924H34.0597C34.574 23.1934 35.0669 23.3982 35.4305 23.7619C35.7941 24.1255 35.9989 24.6184 36 25.1327V28.2609C36.0001 28.7582 35.8085 29.2364 35.4652 29.5962C35.8085 29.956 36.0001 30.4342 36 30.9315V34.0596C35.9989 34.5739 35.7942 35.0668 35.4305 35.4305C35.0669 35.7941 34.574 35.9989 34.0598 36H13.5368C13.4129 35.9951 13.2894 35.9825 13.1671 35.9622C12.8486 35.9874 12.5267 36 12.2015 36C9.81404 36 7.47901 35.2994 5.48571 33.9852C3.49241 32.671 1.92843 30.8009 0.98752 28.6064C0.0466075 26.412 -0.229892 23.9897 0.192275 21.6397C0.614441 19.2896 1.71672 17.1151 3.36257 15.3854C5.00841 13.6557 7.1255 12.4469 9.45156 11.9088C11.7776 11.3706 14.2105 11.5267 16.4487 12.3578C18.6869 13.1888 20.6321 14.6583 22.0434 16.5842C23.4547 18.51 24.2701 20.8076 24.3884 23.1924H24.8952V16.8893L23.3444 14.2029C20.5527 13.8038 18.0619 11.6111 16.5896 9.06096C15.7342 7.57925 15.2302 6.02364 15.0639 4.55365C14.8888 3.00674 15.0865 1.54537 15.6402 0.349642L15.6411 0.350171C15.6931 0.237576 15.7786 0.143752 15.8858 0.0814892C15.9931 0.0192263 16.1169 -0.00844595 16.2404 0.00224469C17.5552 0.12054 18.9212 0.680701 20.1741 1.60641C22.6787 3.45715 24.4893 6.59515 24.8395 9.68859C25.0007 11.1124 24.8461 12.4636 24.3887 13.602L25.5005 15.5276L26.6123 13.602C26.1549 12.4636 26.0003 11.1124 26.1615 9.68867C26.5117 6.59515 28.3223 3.45708 30.827 1.60641C32.0799 0.680626 33.4458 0.12054 34.7606 0.00224469C34.8841 -0.00844595 35.0079 0.0192263 35.1152 0.0814892C35.2224 0.143752 35.3079 0.237576 35.3599 0.350171L35.3608 0.349642C35.9148 1.54537 36.1122 3.00674 35.9372 4.55365C35.587 7.64717 33.7763 10.7852 31.2716 12.6359C30.1197 13.4871 28.8721 14.0291 27.6565 14.2029L26.1055 16.8893ZM22.5173 12.7699L19.4293 7.42117C19.3899 7.35258 19.3644 7.27689 19.3542 7.19843C19.344 7.11997 19.3494 7.04027 19.3701 6.96389C19.4117 6.80963 19.5129 6.67825 19.6515 6.59863C19.79 6.51901 19.9545 6.49768 20.1087 6.53934C20.1851 6.55997 20.2566 6.59544 20.3193 6.64373C20.382 6.69202 20.4345 6.75218 20.4739 6.82077L23.5597 12.1655C23.9781 10.0925 23.39 7.72084 22.2692 5.7838C21.0185 3.6228 18.9233 1.6819 16.5705 1.26159C16.2389 2.17943 16.134 3.26595 16.2648 4.42144C16.5779 7.18746 18.2091 10.0125 20.4481 11.6669C21.0765 12.1399 21.7744 12.5117 22.5173 12.7699ZM27.4412 12.1655L30.5269 6.82077C30.6072 6.68365 30.7385 6.58382 30.8921 6.54302C31.0457 6.50222 31.2092 6.52376 31.3469 6.60295C31.4847 6.68213 31.5856 6.81255 31.6277 6.9658C31.6698 7.11905 31.6496 7.28272 31.5716 7.42117L28.4837 12.77C30.5018 12.0916 32.2418 10.4018 33.3666 8.45799C34.6175 6.29654 35.2382 3.49626 34.4307 1.26121C32.0777 1.68182 29.9824 3.62287 28.7319 5.7838C27.611 7.72077 27.0225 10.0926 27.4412 12.1655ZM15.1308 21.8135C15.1308 20.5066 14.0679 19.5151 12.8067 19.2796V18.2192C12.8067 18.0587 12.7429 17.9048 12.6294 17.7914C12.516 17.6779 12.3621 17.6141 12.2016 17.6141C12.0411 17.6141 11.8872 17.6779 11.7738 17.7914C11.6603 17.9048 11.5966 18.0587 11.5966 18.2192V19.2799C10.3354 19.515 9.27236 20.5065 9.27236 21.8138C9.27236 23.3252 10.6791 24.4029 12.2016 24.4029C13.6991 24.4029 14.4849 25.8449 13.4527 26.726C12.3812 27.6405 10.4822 27.015 10.4822 25.7814C10.4822 25.6209 10.4185 25.467 10.305 25.3535C10.1915 25.2401 10.0377 25.1763 9.87718 25.1763C9.71671 25.1763 9.56282 25.2401 9.44935 25.3535C9.33588 25.467 9.27214 25.6209 9.27214 25.7814C9.27214 27.0882 10.3352 28.0798 11.5963 28.3148V29.3756C11.5963 29.536 11.6601 29.6899 11.7736 29.8034C11.887 29.9169 12.0409 29.9806 12.2014 29.9806C12.3619 29.9806 12.5158 29.9169 12.6292 29.8034C12.7427 29.6899 12.8064 29.536 12.8064 29.3756V28.3148C14.0676 28.0798 15.1306 27.0882 15.1306 25.7814C15.1306 24.27 13.7238 23.1924 12.2014 23.1924C10.7039 23.1924 9.9181 21.7502 10.9503 20.8691C12.0219 19.9544 13.9205 20.5799 13.9205 21.8135C13.9205 21.9739 13.9842 22.1278 14.0977 22.2413C14.2112 22.3548 14.365 22.4185 14.5255 22.4185C14.686 22.4185 14.8399 22.3548 14.9533 22.2413C15.0668 22.1278 15.1308 21.9739 15.1308 21.8135ZM12.2016 14.7229C10.407 14.7229 8.65263 15.2551 7.16043 16.2522C5.66823 17.2493 4.5052 18.6666 3.81841 20.3247C3.13162 21.9829 2.95191 23.8075 3.30202 25.5678C3.65213 27.3281 4.51632 28.945 5.78532 30.2141C7.05432 31.4832 8.67113 32.3475 10.4313 32.6976C12.1914 33.0478 14.0159 32.8681 15.6739 32.1812C17.332 31.4944 18.7491 30.3313 19.7462 28.839C20.7432 27.3467 21.2754 25.5922 21.2754 23.7975C21.2754 21.3908 20.3194 19.0827 18.6177 17.3809C16.9161 15.6791 14.6081 14.723 12.2016 14.7229ZM17.7621 18.2365C16.6624 17.1366 15.2611 16.3876 13.7357 16.0841C12.2103 15.7807 10.6291 15.9364 9.19218 16.5316C7.75524 17.1269 6.52707 18.1349 5.66298 19.4282C4.79889 20.7215 4.33768 22.242 4.33768 23.7974C4.33768 25.3529 4.79889 26.8734 5.66298 28.1667C6.52707 29.46 7.75524 30.468 9.19218 31.0632C10.6291 31.6585 12.2103 31.8142 13.7357 31.5107C15.2611 31.2073 16.6624 30.4583 17.7621 29.3584C19.2368 27.8835 20.0653 25.8832 20.0653 23.7974C20.0653 21.7117 19.2368 19.7113 17.7621 18.2365ZM23.1932 23.7975C23.1932 21.6234 22.5486 19.4981 21.3408 17.6904C20.1331 15.8827 18.4164 14.4738 16.4079 13.6418C14.3995 12.8098 12.1894 12.5921 10.0573 13.0162C7.92512 13.4404 5.9666 14.4873 4.42939 16.0246C2.89218 17.5619 1.84532 19.5206 1.4212 21.6529C0.997076 23.7852 1.21474 25.9954 2.04665 28.004C2.87857 30.0126 4.28739 31.7294 6.09494 32.9373C7.90249 34.1452 10.0276 34.7899 12.2015 34.7899C13.645 34.7899 15.0743 34.5056 16.4079 33.9532C17.7415 33.4008 18.9532 32.5911 19.9739 31.5703C20.9945 30.5496 21.8042 29.3378 22.3566 28.0041C22.9089 26.6704 23.1932 25.241 23.1932 23.7975ZM17.5058 34.7898H34.0597C34.2531 34.7889 34.4383 34.7117 34.575 34.575C34.7118 34.4382 34.789 34.253 34.7899 34.0596V30.9315C34.789 30.7381 34.7118 30.5529 34.575 30.4161C34.4383 30.2794 34.2531 30.2022 34.0597 30.2013H22.5897C21.3656 32.183 19.6023 33.7748 17.5058 34.7898Z" fill="#01373D" />
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
                     <div className="tp-cn-success-item-2 umb-30" style={{ backgroundColor: "#CEF79E", backgroundImage: "url(/assets/img/consulting/success/professional_research_thumb.png)", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100%' }}>
                        <div className="tp-cn-success-item-2-shape">
                           <img src="/assets/img/consulting/success/shape.png" alt="" />
                        </div>
                        <div className="tp-cn-success-item-2-content tp-fade-anim" data-delay=".5" data-fade-from="right" style={{ backgroundColor: "#EAB308", opacity: 0.95 }}>
                           <span className="tp-cn-success-item-2-title" style={{ color: "#01373D", fontWeight: "600" }}>Professional Research</span>
                           <p style={{ color: "#01373D" }}>Providing SEBI compliant advisory, detailed <br /> market setups, and strict risk guidance.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>




      </main>
   );
}
