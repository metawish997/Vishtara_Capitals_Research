import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
         <style>{`
            .social-name {
                font-size: 11px;
                font-weight: 700;
                color: #011D52;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 4px;
                transition: color 0.3s ease;
            }
            html[data-theme="dark"] .social-name,
            body.high-contrast .social-name {
                color: #e2e8f0;
            }
         `}</style>
         <div className="tp-footer-area upt-100" style={{backgroundColor: "#F7F7F5"}}>
            <div className="container">
               <div className="tp-footer-widget-wrap">
                  <div className="row">
                     <div className="col-xl-3 col-md-6 col-sm-6">
                        <div className="tp-footer-widget footer-col-6-1 umb-90">
                           <div className="tp-footer-logo umb-35">
                              <a href="index.html" style={{textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap"}}>
                                 <img src="/vistaralogo.svg" alt="Vishtara Logo" style={{width: "100px", height: "auto"}} />
                                 <h4 style={{ margin: 0, fontWeight: "bold", color: "var(--tp-theme-secondary)", fontSize: "18px" }}>Vishtara Capital Research</h4>
                              </a>
                           </div>
                            <div className="tp-footer-text umb-30">
                               <p style={{ lineHeight: "1.8" }}>
                                  Vishtara Capital Research <br />
                                  C-20/1, Mahananda Nagar, <br />
                                  Ujjain (M.P.) <br /><br />
                                  <strong>Phone:</strong> 8602027324 <br />
                                  <strong>Email:</strong> chouhananujay@gmail.com
                               </p>
                            </div>
                           <div className="tp-footer-widget-social" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                              <a href="#" aria-label="Facebook" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                                    fill="none">
                                    <path
                                       d="M9 0C7.21997 0 5.47991 0.527841 3.99987 1.51677C2.51983 2.50571 1.36628 3.91131 0.685088 5.55585C0.00389957 7.20038 -0.17433 9.00998 0.172936 10.7558C0.520203 12.5016 1.37737 14.1053 2.63604 15.364C3.89471 16.6226 5.49836 17.4798 7.24419 17.8271C8.99002 18.1743 10.7996 17.9961 12.4442 17.3149C14.0887 16.6337 15.4943 15.4802 16.4832 14.0001C17.4722 12.5201 18 10.78 18 9C17.9975 6.61382 17.0485 4.3261 15.3612 2.63882C13.6739 0.95154 11.3862 0.00251984 9 0ZM9.69231 16.5834V11.0769H11.7692C11.9528 11.0769 12.1289 11.004 12.2588 10.8741C12.3886 10.7443 12.4615 10.5682 12.4615 10.3846C12.4615 10.201 12.3886 10.0249 12.2588 9.89508C12.1289 9.76524 11.9528 9.69231 11.7692 9.69231H9.69231V7.61538C9.69231 7.24816 9.83819 6.89598 10.0979 6.63631C10.3575 6.37665 10.7097 6.23077 11.0769 6.23077H12.4615C12.6452 6.23077 12.8212 6.15783 12.9511 6.028C13.0809 5.89816 13.1538 5.72207 13.1538 5.53846C13.1538 5.35485 13.0809 5.17876 12.9511 5.04892C12.8212 4.91909 12.6452 4.84615 12.4615 4.84615H11.0769C10.3425 4.84615 9.63811 5.13791 9.11878 5.65724C8.59945 6.17657 8.30769 6.88094 8.30769 7.61538V9.69231H6.23077C6.04716 9.69231 5.87107 9.76524 5.74124 9.89508C5.6114 10.0249 5.53846 10.201 5.53846 10.3846C5.53846 10.5682 5.6114 10.7443 5.74124 10.8741C5.87107 11.004 6.04716 11.0769 6.23077 11.0769H8.30769V16.5834C6.35607 16.4052 4.54826 15.4815 3.26029 14.0045C1.97231 12.5274 1.30334 10.6107 1.39251 8.653C1.48168 6.69529 2.32213 4.84732 3.73905 3.49348C5.15597 2.13963 7.04027 1.38413 9 1.38413C10.9597 1.38413 12.844 2.13963 14.261 3.49348C15.6779 4.84732 16.5183 6.69529 16.6075 8.653C16.6967 10.6107 16.0277 12.5274 14.7397 14.0045C13.4517 15.4815 11.6439 16.4052 9.69231 16.5834Z"
                                       fill="#072929" />
                                 </svg>
                                 <span className="social-name">Facebook</span>
                              </a>
                              <a href="#" aria-label="X Twitter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18"
                                    fill="none">
                                    <path
                                       d="M15.8866 16.8372L10.1977 7.61989L15.8112 1.25359C15.9382 1.10604 16.0036 0.912859 15.9933 0.715913C15.983 0.518968 15.8979 0.334135 15.7563 0.201488C15.6147 0.0688409 15.4281 -0.000929265 15.237 0.00730397C15.0459 0.0155372 14.8656 0.10111 14.7352 0.24547L9.38801 6.30915L5.7084 0.347593C5.64278 0.241118 5.55216 0.153438 5.44493 0.0926771C5.33771 0.031916 5.21734 3.90975e-05 5.09498 8.86648e-08H0.732879C0.602526 -6.52684e-05 0.474553 0.0360029 0.362362 0.104428C0.25017 0.172853 0.157887 0.271117 0.095174 0.388932C0.0324615 0.506746 0.00162721 0.639777 0.00589964 0.774094C0.0101721 0.908411 0.0493941 1.03907 0.119459 1.1524L5.80836 10.3688L0.194887 16.7398C0.129334 16.8124 0.0784097 16.8976 0.0450649 16.9907C0.01172 17.0837 -0.00338233 17.1827 0.000633741 17.2818C0.00464981 17.3809 0.0277044 17.4782 0.0684608 17.568C0.109217 17.6578 0.166865 17.7385 0.238063 17.8052C0.309261 17.8719 0.392593 17.9233 0.48323 17.9566C0.573866 17.9899 0.670004 18.0042 0.766072 17.9989C0.86214 17.9936 0.956227 17.9687 1.04288 17.9256C1.12953 17.8825 1.20703 17.8221 1.27087 17.7479L6.61808 11.6842L10.2977 17.6458C10.3638 17.7514 10.4547 17.8381 10.5619 17.898C10.6691 17.958 10.7892 17.9891 10.9111 17.9887H15.2732C15.4034 17.9886 15.5312 17.9525 15.6433 17.8841C15.7553 17.8158 15.8475 17.7176 15.9102 17.6C15.9729 17.4823 16.0038 17.3494 15.9996 17.2153C15.9955 17.0811 15.9565 16.9505 15.8866 16.8372ZM11.3101 16.4896L2.05696 1.49906H4.69239L13.9491 16.4896H11.3101Z"
                                       fill="#072929" />
                                 </svg>
                                 <span className="social-name">X (Twitter)</span>
                              </a>
                              <a href="#" aria-label="Instagram" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                                    fill="none">
                                    <path
                                       d="M9 4.84615C8.17845 4.84615 7.37534 5.08977 6.69225 5.5462C6.00915 6.00263 5.47674 6.65138 5.16235 7.41039C4.84795 8.16941 4.76569 9.00461 4.92597 9.81038C5.08625 10.6161 5.48186 11.3563 6.06279 11.9372C6.64371 12.5181 7.38386 12.9138 8.18962 13.074C8.99539 13.2343 9.83059 13.152 10.5896 12.8377C11.3486 12.5233 11.9974 11.9909 12.4538 11.3078C12.9102 10.6247 13.1538 9.82155 13.1538 9C13.1527 7.89868 12.7147 6.8428 11.9359 6.06405C11.1572 5.2853 10.1013 4.8473 9 4.84615ZM9 11.7692C8.4523 11.7692 7.9169 11.6068 7.4615 11.3025C7.0061 10.9982 6.65116 10.5657 6.44156 10.0597C6.23197 9.55373 6.17713 8.99693 6.28398 8.45975C6.39083 7.92257 6.65457 7.42914 7.04186 7.04186C7.42914 6.65457 7.92257 6.39083 8.45975 6.28398C8.99693 6.17713 9.55373 6.23197 10.0597 6.44156C10.5657 6.65116 10.9982 7.0061 11.3025 7.4615C11.6068 7.9169 11.7692 8.4523 11.7692 9C11.7692 9.73445 11.4775 10.4388 10.9581 10.9581C10.4388 11.4775 9.73445 11.7692 9 11.7692ZM13.1538 0H4.84615C3.5613 0.00137443 2.32946 0.512391 1.42092 1.42092C0.512391 2.32946 0.00137443 3.5613 0 4.84615V13.1538C0.00137443 14.4387 0.512391 15.6705 1.42092 16.5791C2.32946 17.4876 3.5613 17.9986 4.84615 18H13.1538C14.4387 17.9986 15.6705 17.4876 16.5791 16.5791C17.4876 15.6705 17.9986 14.4387 18 13.1538V4.84615C17.9986 3.5613 17.4876 2.32946 16.5791 1.42092C15.6705 0.512391 14.4387 0.00137443 13.1538 0ZM16.6154 13.1538C16.6154 14.0719 16.2507 14.9524 15.6015 15.6015C14.9524 16.2507 14.0719 16.6154 13.1538 16.6154H4.84615C3.9281 16.6154 3.04764 16.2507 2.39848 15.6015C1.74931 14.9524 1.38462 14.0719 1.38462 13.1538V4.84615C1.38462 3.9281 1.74931 3.04764 2.39848 2.39848C3.04764 1.74931 3.9281 1.38462 4.84615 1.38462H13.1538C14.0719 1.38462 14.9524 1.74931 15.6015 2.39848C16.2507 3.04764 16.6154 3.9281 16.6154 4.84615V13.1538ZM14.5385 4.5C14.5385 4.70539 14.4776 4.90616 14.3634 5.07694C14.2493 5.24771 14.0872 5.38082 13.8974 5.45941C13.7076 5.53801 13.4988 5.55858 13.2974 5.51851C13.096 5.47844 12.9109 5.37953 12.7657 5.2343C12.6205 5.08907 12.5216 4.90404 12.4815 4.70259C12.4414 4.50115 12.462 4.29235 12.5406 4.1026C12.6192 3.91284 12.7523 3.75066 12.9231 3.63655C13.0938 3.52244 13.2946 3.46154 13.5 3.46154C13.7754 3.46154 14.0396 3.57095 14.2343 3.7657C14.4291 3.96045 14.5385 4.22458 14.5385 4.5Z"
                                       fill="#072929" />
                                 </svg>
                                 <span className="social-name">Instagram</span>
                              </a>
                              <a href="#" aria-label="Telegram" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18"
                                    fill="none">
                                    <path
                                       d="M19.7219 0.196937C19.6112 0.100607 19.4765 0.0365415 19.3324 0.0116422C19.1883 -0.0132572 19.0402 0.00195346 18.904 0.0556353L0.809497 7.1936C0.553057 7.29412 0.33595 7.47589 0.190863 7.71155C0.0457752 7.9472 -0.0194404 8.22399 0.00503418 8.50025C0.0295088 8.7765 0.142349 9.03726 0.326566 9.24327C0.510784 9.44929 0.756408 9.5894 1.02646 9.64252L5.71482 10.5704V15.84C5.7139 16.127 5.79852 16.4077 5.95771 16.6457C6.11691 16.8837 6.34334 17.068 6.60767 17.1747C6.87159 17.2833 7.16183 17.3094 7.44065 17.2495C7.71947 17.1897 7.97397 17.0466 8.17105 16.839L10.4317 14.4756L14.0183 17.64C14.2771 17.8714 14.6108 17.9994 14.9567 18C15.1083 17.9999 15.2589 17.9759 15.4031 17.9289C15.6388 17.8535 15.8508 17.7172 16.0179 17.5336C16.1851 17.3499 16.3016 17.1253 16.3558 16.8822L19.9799 0.989844C20.0123 0.846517 20.0054 0.696999 19.96 0.557318C19.9145 0.417637 19.8322 0.293059 19.7219 0.196937ZM14.263 3.43697L6.26392 9.21142L1.83538 8.33571L14.263 3.43697ZM7.14338 15.84V11.5667L9.35676 13.5234L7.14338 15.84ZM14.9585 16.56L7.57641 10.0349L18.2013 2.35876L14.9585 16.56Z"
                                       fill="#072929" />
                                 </svg>
                                 <span className="social-name">Telegram</span>
                              </a>
                           </div>
                        </div>
                     </div>
                     <div className="col-xl-3 col-md-6 col-sm-6">
                          <div className="tp-footer-widget umb-90">
                             <h2 className="tp-footer-widget-title" style={{ fontSize: "20px" }}>DISCLOSURES &amp; CHARTER</h2>
                             <div className="tp-footer-widget-menu">
                                <ul>
                                    <li><Link className="tp-line-anim" to="/sebi-disclosures">SEBI Disclosure</Link></li>
                                    <li><Link className="tp-line-anim" to="/certificates">Certificates</Link></li>
                                    <li><Link className="tp-line-anim" to="/disclaimers">Disclaimer</Link></li>
                                    <li><Link className="tp-line-anim" to="/investor-charter">Investor Charter</Link></li>
                                    <li><Link className="tp-line-anim" to="/complaints">Complaint Board</Link></li>
                                </ul>
                             </div>
                          </div>
                       </div>
                       <div className="col-xl-3 col-md-6 col-sm-6">
                          <div className="tp-footer-widget umb-90">
                             <h2 className="tp-footer-widget-title" style={{ fontSize: "20px" }}>POLICIES &amp; LEGAL</h2>
                             <div className="tp-footer-widget-menu">
                                <ul>
                                    <li><Link className="tp-line-anim" to="/privacy-policy">Privacy Policy</Link></li>
                                    <li><Link className="tp-line-anim" to="/refund-policy">Refund Policy</Link></li>
                                    <li><Link className="tp-line-anim" to="/terms-and-conditions">Terms &amp; Services</Link></li>
                                    <li><Link className="tp-line-anim" to="/grievance-escalation-matrix">Escalation Matrix</Link></li>
                                </ul>
                             </div>
                          </div>
                       </div>
                      <div className="col-xl-3 col-md-4 col-sm-6">
                         <div className="tp-footer-widget umb-60">
                            <h2 className="tp-footer-widget-title" style={{ fontSize: "20px" }}>LOCATION</h2>
                            <div className="tp-footer-contact-wrap">
                               <span className="tp-footer-contact-location"><a href="#">C-20/1, Mahananda Nagar, <br />
                                     Ujjain (M.P.) <br /> Support: Monday to Saturday </a></span>
                               <h2 className="tp-footer-widget-title" style={{ fontSize: "20px" }}>Contact Us</h2>
                               <a className="tp-footer-contact-tel d-inline-block umb-35 tp-line-anim "
                                  href="tel:8602027324">+91 8602027324</a>
                               <img src="/assets/img/finance/cta/footer-map.png" alt="" />
                            </div>
                         </div>
                      </div>
                  </div>
                  <hr style={{ borderColor: "rgba(34, 47, 48, 0.15)", margin: "40px 0 30px 0" }} />
                   <div className="row">
                      <div className="col-12">
                         <div style={{ color: "var(--text-secondary, #4f5568)", lineHeight: "1.7", marginBottom: "25px" }}>
                            <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "8px", color: "var(--tp-theme-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Accessibility Disclosure</h3>
                            <p className="mb-0" style={{ fontSize: "14px" }}>This website is committed to ensuring digital accessibility for all users, including persons with disabilities, in compliance with the Rights of Persons with Disabilities (RPwD) Act, 2016, SEBI Circular No. SEBI/HO/ITD-1/ITD_VIAP/P/CIR/2025/111, and WCAG 2.1 Level AA. Features include keyboard navigation, screen-reader compatibility, alt text on all images, sufficient color contrast, resizable text, semantic HTML structure, and ARIA landmarks. If you experience any accessibility barriers, please contact the Grievance Officer.</p>
                         </div>
                         <div style={{ color: "var(--text-secondary, #4f5568)", lineHeight: "1.7", marginBottom: "20px" }}>
                            <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "8px", color: "var(--tp-theme-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Regulatory Disclaimer</h3>
                            <p className="mb-0" style={{ fontSize: "14px" }}>Vishtara Capital Research is a SEBI Registered Research Analyst (Reg. No. INH000027779). Research reports and recommendations are for informational purposes only and do not constitute investment advice. Investments in securities are subject to market risks. Past performance is not indicative of future results. SEBI registration does not guarantee quality of service or returns. Registration granted by SEBI, enlistment with BSE and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. Investment in securities market are subject to market risks. Read all the related documents carefully before investing. No scheme of assured/guaranteed/fixed returns is offered. Past performance is not indicative of future results. Fees may be paid through cheque, online bank transfer, UPI, etc. Cash payment is not allowed. Optional Centralised Fee Collection Mechanism (CeFCoM) managed by BSE Limited (RAASB) available. Advance fee shall not exceed one quarter; proportionate refund available for premature termination. SEBI logo is not used by or associated with this entity.</p>
                         </div>
                      </div>
                   </div>
               </div>
            </div>
            <div className="tp-footer-copyright-area">
               <div className="container">
                  <div className="tp-footer-copyright-border upt-30 upb-10">
                     <div className="row align-items-center">
                        <div className="col-xl-4 col-lg-5 col-md-6">
                           <div className="tp-footer-copyright-text text-center text-md-start upb-20">
                              <p className="mb-0">© 2026 <a href="#">Vishtara Capital Research</a>. All Rights Reserved.</p>
                           </div>
                        </div>
                        <div className="col-xl-8 col-lg-7 col-md-6">
                           <div
                              className="tp-footer-copyright-link d-flex justify-content-center justify-content-md-end upb-20">
                              <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
                              <Link to="/privacy-policy">Privacy Policy</Link>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         
    </footer>
  );
}
