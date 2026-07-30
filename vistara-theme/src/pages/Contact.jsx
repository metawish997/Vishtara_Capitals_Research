import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required. Please enter your full name.";
    if (!formData.email.trim() || !/^\\S+@\\S+\\.\\S+$/.test(formData.email)) newErrors.email = "A valid email address is required. For example: name@domain.com.";
    if (!formData.subject.trim()) newErrors.subject = "Mobile number is required. Please enter a valid 10-digit number.";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty. Please provide details of your inquiry.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus("Error: Please correct the invalid fields below.");
    } else {
      setErrors({});
      setSubmitStatus("Success: Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
       setErrors({ ...errors, [e.target.name]: null });
    }
  };

  return (
    <main>
         <style>{`
            .contact-submit-btn {
               color: #222F30 !important;
            }
            html[data-theme="dark"] .contact-submit-btn,
            body.high-contrast .contact-submit-btn {
               background-color: #FBB040 !important;
               border-color: #FBB040 !important;
               color: #222F30 !important;
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
                           <li>Contact us</li>
                        </ul>
                        <h1 className="tp-breadcrumb-title">Contact us</h1>
                        <p>Get in touch with Vishtara Capital Research for SEBI compliant advisory, equity research, and asset allocation queries.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         


         
         <div className="tp-contact-ptb tp-sec-ptb upt-135 upb-95">
            <div className="container">
               <div className="row">
                  <div className="col-lg-5">
                     <div className="tp-contact-wrapper umb-30">
                        <div className="tp-contact-heading umb-60">
                           <span className="tp-section-sub tp-fade-anim">Let’s Connect</span>
                           <h2 className="tp-section-title" data-text-split data-letters-fade-in>We’re ready to support <br /> your financial journey.</h2>
                        </div>
                        <div className="tp-contact-info tp-fade-anim" data-delay=".5">
                           <div className="tp-contact-info-item umb-30">
                              <div className="tp-contact-info-icon">
                                 <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                       <path d="M15.62 8.75025C15.19 8.75025 14.85 8.40025 14.85 7.98025C14.85 7.61025 14.48 6.84025 13.86 6.17026C13.25 5.52026 12.58 5.14026 12.02 5.14026C11.59 5.14026 11.25 4.79026 11.25 4.37026C11.25 3.95026 11.6 3.60026 12.02 3.60026C13.02 3.60026 14.07 4.14026 14.99 5.11026C15.85 6.02026 16.4 7.15025 16.4 7.97025C16.4 8.40025 16.05 8.75025 15.62 8.75025Z" fill="var(--primary)"/>
                                       <path d="M19.2278 8.74998C18.7978 8.74998 18.4578 8.39998 18.4578 7.97998C18.4578 4.42999 15.5678 1.55 12.0278 1.55C11.5978 1.55 11.2578 1.2 11.2578 0.779998C11.2578 0.359999 11.5978 0 12.0178 0C16.4178 0 19.9978 3.57999 19.9978 7.97998C19.9978 8.39998 19.6478 8.74998 19.2278 8.74998Z" fill="var(--primary)"/>
                                       <path d="M9.78998 12.21L6.51999 15.48C6.15999 15.16 5.80999 14.83 5.46999 14.49C4.43999 13.45 3.50999 12.36 2.67999 11.22C1.86 10.08 1.2 8.93998 0.719999 7.80999C0.24 6.66999 0 5.57999 0 4.53999C0 3.85999 0.12 3.20999 0.359999 2.60999C0.599999 2 0.979998 1.44 1.51 0.939998C2.15 0.309999 2.84999 0 3.58999 0C3.86999 0 4.14999 0.06 4.39999 0.18C4.65999 0.299999 4.88999 0.479999 5.06999 0.739999L7.38999 4.00999C7.56998 4.25999 7.69998 4.48999 7.78998 4.70999C7.87998 4.91999 7.92998 5.12999 7.92998 5.31999C7.92998 5.55999 7.85998 5.79999 7.71998 6.02999C7.58998 6.25999 7.39998 6.49999 7.15999 6.73999L6.39999 7.52998C6.28999 7.63998 6.23999 7.76999 6.23999 7.92998C6.23999 8.00998 6.24999 8.07998 6.26999 8.15998C6.29999 8.23998 6.32999 8.29998 6.34999 8.35998C6.52999 8.68998 6.83999 9.11998 7.27998 9.63998C7.72998 10.16 8.20998 10.69 8.72998 11.22C9.08998 11.57 9.43998 11.91 9.78998 12.21Z" fill="var(--primary)"/>
                                       <path d="M19.9715 16.33C19.9715 16.61 19.9215 16.9 19.8215 17.18C19.7915 17.26 19.7615 17.34 19.7215 17.42C19.5515 17.78 19.3315 18.12 19.0415 18.44C18.5515 18.98 18.0115 19.37 17.4015 19.62C17.3915 19.62 17.3815 19.63 17.3715 19.63C16.7815 19.87 16.1415 20 15.4515 20C14.4315 20 13.3415 19.76 12.1916 19.27C11.0416 18.78 9.89156 18.12 8.75156 17.29C8.36156 17 7.97156 16.71 7.60156 16.4L10.8716 13.13C11.1516 13.34 11.4016 13.5 11.6116 13.61C11.6616 13.63 11.7216 13.66 11.7916 13.69C11.8716 13.72 11.9516 13.73 12.0416 13.73C12.2116 13.73 12.3416 13.67 12.4516 13.56L13.2115 12.81C13.4615 12.56 13.7015 12.37 13.9315 12.25C14.1615 12.11 14.3915 12.04 14.6415 12.04C14.8315 12.04 15.0315 12.08 15.2515 12.17C15.4715 12.26 15.7015 12.39 15.9515 12.56L19.2615 14.91C19.5215 15.09 19.7015 15.3 19.8115 15.55C19.9115 15.8 19.9715 16.05 19.9715 16.33Z" fill="var(--primary)"/>
                                    </svg>
                                 </span>
                              </div>
                              <div className="tp-contact-info-content">
                                 <h3 className="tp-contact-info-title">Call Us Directly</h3>
                                 <p><a className="tp-line-anim" href="tel:+918602027324">+91 86020 27324</a></p>
                              </div>
                           </div>
                           <div className="tp-contact-info-item umb-30">
                              <div className="tp-contact-info-icon">
                                 <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none">
                                       <path d="M17.5 5C18.8807 5 20 3.88071 20 2.5C20 1.11929 18.8807 0 17.5 0C16.1193 0 15 1.11929 15 2.5C15 3.88071 16.1193 5 17.5 5Z" fill="var(--primary)"/>
                                       <path d="M17.5 5C18.8807 5 20 3.88071 20 2.5C20 1.11929 18.8807 0 17.5 0C16.1193 0 15 1.11929 15 2.5C15 3.88071 16.1193 5 17.5 5Z" fill="var(--primary)"/>
                                       <path d="M18.72 6.31C19.35 6.11 20 6.6 20 7.27V12.51C20 16.01 18 17.51 15 17.51H5C2 17.51 0 16.01 0 12.51V5.50999C0 2.00999 2 0.509995 5 0.509995H12.61C13.26 0.509995 13.7 1.11001 13.58 1.74001C13.46 2.33001 13.48 2.96 13.66 3.61C14.03 4.95 15.12 6.02 16.46 6.37C17.25 6.56999 18.02 6.53 18.72 6.31Z" fill="var(--primary)"/>
                                       <path d="M10.0027 9.86977C9.16271 9.86977 8.31271 9.60978 7.66271 9.07978L4.53271 6.57978C4.21271 6.31978 4.15271 5.84978 4.41271 5.52978C4.67271 5.20978 5.1427 5.14978 5.4627 5.40978L8.5927 7.90978C9.3527 8.51978 10.6427 8.51978 11.4027 7.90978L12.5827 6.96978C12.9027 6.70978 13.3827 6.75977 13.6327 7.08977C13.8927 7.40977 13.8427 7.88978 13.5127 8.13978L12.3327 9.07978C11.6927 9.60978 10.8427 9.86977 10.0027 9.86977Z" fill="white"/>
                                    </svg>
                                 </span>
                              </div>
                              <div className="tp-contact-info-content">
                                 <h3 className="tp-contact-info-title">Need Support?</h3>
                                 <p><a className="tp-line-anim" href="mailto:chouhananujay@gmail.com">chouhananujay@gmail.com</a></p>
                              </div>
                           </div>
                           <div className="tp-contact-info-item">
                              <div className="tp-contact-info-icon">
                                 <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M16.4738 14.83L16.8638 17.99C16.9638 18.82 16.0738 19.4 15.3638 18.97L11.1738 16.48C10.7138 16.48 10.2638 16.45 9.82376 16.39C10.5638 15.52 11.0038 14.42 11.0038 13.23C11.0038 10.39 8.54375 8.09003 5.50375 8.09003C4.34375 8.09003 3.27376 8.42 2.38376 9C2.35376 8.75 2.34375 8.49999 2.34375 8.23999C2.34375 3.68999 6.29375 0 11.1738 0C16.0538 0 20.0038 3.68999 20.0038 8.23999C20.0038 10.94 18.6138 13.33 16.4738 14.83Z" fill="var(--primary)"/>
                                    <path d="M11 13.23C11 14.42 10.56 15.52 9.82001 16.39C8.83001 17.59 7.26 18.36 5.5 18.36L2.89 19.91C2.45 20.18 1.89 19.81 1.95 19.3L2.2 17.33C0.859997 16.4 0 14.91 0 13.23C0 11.47 0.940005 9.92 2.38 9C3.27 8.42 4.34 8.09003 5.5 8.09003C8.54 8.09003 11 10.39 11 13.23Z" fill="var(--primary)"/>
                                    </svg>
                                 </span>
                              </div>
                              <div className="tp-contact-info-content">
                                 <p><a className="tp-line-anim" target="_blank" rel="noopener noreferrer" href="https://wa.me/918602027324">WhatsApp Chat</a></p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-7">
                     <div className="tp-contact-from umb-30 tp-fade-anim" data-delay=".5" data-fade-from="right">
                        <form id="contact-form" onSubmit={handleSubmit} noValidate>
                           <div className="row">
                              <div className="col-12">
                                 {submitStatus && (
                                    <div className={`alert ${submitStatus.startsWith('Error') ? 'alert-danger' : 'alert-success'} mb-4`} role="alert" aria-live="polite">
                                       {submitStatus}
                                    </div>
                                 )}
                                 <div className="tp-contact-input umb-15">
                                    <label htmlFor="contact_name" className="visually-hidden">Your full name</label>
                                    <input id="contact_name" placeholder="Your full name*" name="name" type="text" 
                                           required aria-required="true" 
                                           aria-invalid={!!errors.name} aria-describedby={errors.name ? "name_error" : undefined}
                                           value={formData.name} onChange={handleChange} />
                                    {errors.name && <span id="name_error" className="text-danger mt-1 d-block" style={{ fontSize: '13px' }}>{errors.name}</span>}
                                 </div>
                                 <div className="tp-contact-input umb-15">
                                    <label htmlFor="contact_email" className="visually-hidden">Email address</label>
                                    <input id="contact_email" placeholder="Email address*" name="email" type="email" 
                                           required aria-required="true" 
                                           aria-invalid={!!errors.email} aria-describedby={errors.email ? "email_error" : undefined}
                                           value={formData.email} onChange={handleChange} />
                                    {errors.email && <span id="email_error" className="text-danger mt-1 d-block" style={{ fontSize: '13px' }}>{errors.email}</span>}
                                 </div>
                                 <div className="tp-contact-input umb-15">
                                    <label htmlFor="contact_subject" className="visually-hidden">Mobile Number</label>
                                    <input id="contact_subject" placeholder="Mobile Number*" name="subject" type="text" 
                                           required aria-required="true" 
                                           aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "subject_error" : undefined}
                                           value={formData.subject} onChange={handleChange} />
                                    {errors.subject && <span id="subject_error" className="text-danger mt-1 d-block" style={{ fontSize: '13px' }}>{errors.subject}</span>}
                                 </div>
                                 <div className="tp-contact-input umb-15">
                                    <label htmlFor="contact_message" className="visually-hidden">How can we help? Feel free to write here</label>
                                    <textarea id="contact_message" placeholder="How can we help? Feel free to write here" name="message" 
                                              required aria-required="true" 
                                              aria-invalid={!!errors.message} aria-describedby={errors.message ? "message_error" : undefined}
                                              value={formData.message} onChange={handleChange}></textarea>
                                    {errors.message && <span id="message_error" className="text-danger mt-1 d-block" style={{ fontSize: '13px' }}>{errors.message}</span>}
                                 </div>
                                 <div className="tp-contact-input-btn">
                                    <button className="tp-btn w-100 contact-submit-btn" type="submit" style={{ backgroundColor: "var(--primary)", borderColor: "var(--primary)" }}>
                                       Send your message
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         


         
         <div className="tp-contact-banner-ptb upb-130">
            <div className="container">
               <div className="row">
                  <div className="col-lg-12">
                     <div className="tp-contact-banner-thumb">
                        <img className="radius-6" src="/assets/img/finance/banner/banner-bg-2.webp" alt="" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
         


         
         <div className="tp-contact-city-ptb upb-110">
            <div className="container">
               <div className="row">
                  <div className="col-lg-12">
                     <div className="tp-contact-city-heading text-center umb-70">
                        <span className="tp-section-sub tp-fade-anim">Our details</span>
                        <h2 className="tp-section-title" data-text-split data-letters-fade-in>Registered office address &amp; licensing details</h2>
                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-lg-4 col-md-6">
                     <div className="tp-contact-city-item text-center umb-30" style={{ minHeight: "360px" }}>
                        <div className="tp-contact-city-item-content">
                           <h3 className="tp-contact-city-item-title" style={{ color: "var(--primary)" }}>Registered Office</h3>
                           <p>Ujjain Headquarters</p>
                           <div className="tp-contact-city-item-dvdr"></div>
                           <div className="tp-contact-city-item-contact">
                              <span style={{ fontSize: "15px", display: "block", marginBottom: "10px" }}>
                                 C-20/1, Mahananda Nagar,<br /> Ujjain (M.P.), India
                              </span>
                              <a className="tp-line-anim" href="tel:+918602027324">+91 86020 27324</a>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                     <div className="tp-contact-city-item text-center umb-30" style={{ minHeight: "360px" }}>
                        <div className="tp-contact-city-item-content">
                           <h3 className="tp-contact-city-item-title" style={{ color: "var(--primary)" }}>Support Helpdesk</h3>
                           <p>Timings &amp; Email Inquiries</p>
                           <div className="tp-contact-city-item-dvdr"></div>
                           <div className="tp-contact-city-item-contact">
                              <span style={{ fontSize: "15px", display: "block", marginBottom: "10px" }}>
                                 Monday to Saturday<br /> 9:00 AM - 6:00 PM (IST)
                              </span>
                              <a className="tp-line-anim" href="mailto:chouhananujay@gmail.com">chouhananujay@gmail.com</a>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                     <div className="tp-contact-city-item text-center umb-30" style={{ minHeight: "360px" }}>
                        <div className="tp-contact-city-item-content">
                           <h3 className="tp-contact-city-item-title" style={{ color: "var(--primary)" }}>Compliance &amp; Licensing</h3>
                           <p>SEBI Registered Analyst</p>
                           <div className="tp-contact-city-item-dvdr"></div>
                           <div className="tp-contact-city-item-contact">
                              <span style={{ fontSize: "15px", display: "block", marginBottom: "5px" }}>
                                 <strong>SEBI Reg No:</strong> INH000027779
                              </span>
                              <span style={{ fontSize: "15px", display: "block", marginBottom: "5px" }}>
                                 <strong>Research Analyst:</strong> Anujay Chouhan
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         


         
         <div className="tp-contact-map-area">
            <div className="tp-contact-map-content p-relative">
               <iframe title="Vishtara Capital Research Google Maps Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117467.43324647346!2d75.71987309999999!3d23.17585095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39637469de00ff23%3A0x7f82abdf78506e0f!2sUjjain%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
               <div className="tp-contact-map-icon">
                  <a target="_blank" rel="noopener noreferrer" href="https://maps.google.com/?q=Ujjain,Madhya+Pradesh,India" aria-label="Open location in Google Maps">
                     <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="40" viewBox="0 0 34 40" fill="none">
                           <path d="M16.7598 10.0024C15.4414 10.0024 14.1526 10.3934 13.0564 11.1259C11.9601 11.8584 11.1057 12.8995 10.6012 14.1175C10.6012 14.1175 10.6012 14.1175 10.6012 14.1175C10.0966 15.3356 9.96463 16.6759 10.2218 17.969C10.4791 19.2621 11.1139 20.4499 12.0462 21.3822C12.9785 22.3144 14.1663 22.9493 15.4594 23.2065C16.7525 23.4638 18.0928 23.3317 19.3108 22.8272C20.5289 22.3227 21.57 21.4682 22.3025 20.372C23.035 19.2758 23.4259 17.987 23.4259 16.6685C23.4259 14.9006 22.7236 13.205 21.4735 11.9549C20.2233 10.7048 18.5278 10.0024 16.7598 10.0024ZM16.7598 20.0016C16.1006 20.0016 15.4562 19.8061 14.9081 19.4399C14.36 19.0736 13.9328 18.5531 13.6805 17.944C13.4282 17.335 13.3622 16.6648 13.4908 16.0183C13.6194 15.3717 13.9369 14.7778 14.403 14.3117C14.8692 13.8456 15.4631 13.5281 16.1096 13.3995C16.7561 13.2709 17.4263 13.3369 18.0353 13.5892C18.6444 13.8415 19.1649 14.2687 19.5312 14.8168C19.8974 15.3649 20.0929 16.0093 20.0929 16.6685C20.0929 17.5525 19.7417 18.4003 19.1167 19.0254C18.4916 19.6504 17.6438 20.0016 16.7598 20.0016Z" fill="var(--primary)"/>
                           <path d="M16.7569 39.9999C15.3536 40.0071 13.969 39.6779 12.719 39.0401C11.469 38.4022 10.3901 37.4741 9.57251 36.3335C3.22139 27.5726 0 20.9865 0 16.7569C0 12.3127 1.76545 8.05051 4.90798 4.90798C8.0505 1.76545 12.3127 0 16.7569 0C21.2011 0 25.4633 1.76545 28.6058 4.90798C31.7483 8.05051 33.5138 12.3127 33.5138 16.7569C33.5138 20.9865 30.2924 27.5726 23.9413 36.3335C23.1237 37.4741 22.0447 38.4022 20.7948 39.0401C19.5448 39.6779 18.1602 40.0071 16.7569 39.9999ZM16.7569 3.63802C13.2779 3.64199 9.9425 5.02578 7.48247 7.48581C5.02244 9.94584 3.63866 13.2812 3.63469 16.7602C3.63469 20.1099 6.78941 26.3044 12.5156 34.2021C13.0017 34.8716 13.6394 35.4166 14.3766 35.7924C15.1138 36.1681 15.9295 36.364 16.7569 36.364C17.5843 36.364 18.4 36.1681 19.1372 35.7924C19.8743 35.4166 20.5121 34.8716 20.9982 34.2021C26.7244 26.3044 29.8791 20.1099 29.8791 16.7602C29.8751 13.2812 28.4913 9.94584 26.0313 7.48581C23.5713 5.02578 20.2359 3.64199 16.7569 3.63802Z" fill="var(--primary)"/>
                        </svg>
                     </span>
                  </a>
               </div>
            </div>
         </div>
         
         
      
    </main>
  );
}
