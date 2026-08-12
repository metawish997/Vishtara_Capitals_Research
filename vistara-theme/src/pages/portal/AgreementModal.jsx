import React from 'react';
import { BASE_URL } from '../../services/api';

const AgreementModal = ({ isOpen, onClose, onAccept, selectedPlan, selectedDuration, user, agreementNo, invoiceNo, aadhaarNumber, panNumber, planAmount, kycData }) => {
    const [isChecked, setIsChecked] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) setIsChecked(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];

    const PageFooter = ({ page }) => (
        <div style={{ position: "absolute", bottom: "24px", left: 0, right: 0, textAlign: "center", fontSize: "11px", fontFamily: "sans-serif", color: "#94a3b8" }}>
            Page {page} of 6
        </div>
    );

    const AuthorizedSignature = () => (
        <div style={{ position: "absolute", bottom: "64px", left: "48px", display: "flex", flexDirection: "column", alignItems: "flex-start", opacity: 0.8 }}>
            {kycData?.signature_image ? (
                <img
                    src={`${BASE_URL}${kycData.signature_image}`}
                    alt="Signature"
                    style={{ height: "40px", width: "auto", objectFit: "contain", mixBlendMode: "multiply" }}
                />
            ) : (
                <div style={{ height: "40px", width: "128px", backgroundColor: "#f8fafc", border: "1px dashed #e2e8f0", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "-0.5px" }}>
                    Signature Pending
                </div>
            )}
            <div style={{ fontSize: "10px", fontWeight: "bold", color: "#64748b", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>Authorized Signature</div>
        </div>
    );

    const Page = ({ page, children }) => (
        <div style={{ maxWidth: "800px", margin: "0 auto 40px auto", backgroundColor: "#ffffff", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", padding: "64px 96px", fontSize: "13px", lineHeight: "1.5", position: "relative", minHeight: "1100px", color: "#000000", textAlign: "justify" }}>
            {children}
            <PageFooter page={page} />
        </div>
    );

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", overflow: "hidden" }}>
            <div style={{ width: "100%", maxWidth: "896px", backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "hidden" }}>
                
                {/* HEADER */}
                <div style={{ padding: "16px 32px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#011D52", color: "#ffffff", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px", borderRadius: "8px" }}>
                            <svg style={{ width: "20px", height: "20px", color: "#e0f2fe" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h2 style={{ fontSize: "12px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>Institutional Agreement Terminal</h2>
                    </div>
                    <button onClick={onClose} style={{ color: "rgba(255,255,255,0.7)", background: "transparent", border: "none", cursor: "pointer", padding: "8px" }}>
                        <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* SCROLLABLE VIEWPORT */}
                <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#e2e8f0", padding: "40px", fontFamily: '"Times New Roman", serif', scrollBehavior: "smooth" }}>
                    
                    <Page page={1}>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px", marginBottom: "16px", textTransform: "uppercase" }}>COMPREHENSIVE TERMS AND CONDITIONS FOR<br/>RESEARCH ANALYST SERVICES</div>
                        <p style={{ marginBottom: "16px" }}>Please read these Terms carefully before subscribing to or using any of Our Services. By accessing or using Our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.</p>
                        
                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>1. Introduction</div>
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>1.1 Parties</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li style={{ marginBottom: "8px" }}><b>Research Analyst (hereinafter &ldquo;RA,&rdquo; &ldquo;We,&rdquo; &ldquo;Our,&rdquo; or &ldquo;Us&rdquo;)</b>
                                <ul style={{ listStyleType: "circle", marginLeft: "20px", marginTop: "4px" }}>
                                    <li>Registered with the Securities and Exchange Board of India (SEBI) under Registration No. INH00002779 valid as of 03/06/2026<br/><b>Registered Name: ANUJAY CHOUHAN</b></li>
                                    <li>Our BSE Enlistment Number (if applicable) is</li>
                                    <li>Subject to all rules and regulations framed by SEBI, including the SEBI (Research Analysts) Regulations, 2014, as amended.</li>
                                </ul>
                            </li>
                            <li><b>Client or User (&ldquo;You,&rdquo; &ldquo;Your,&rdquo; or &ldquo;Client&rdquo;)</b>
                                <ul style={{ listStyleType: "circle", marginLeft: "20px", marginTop: "4px" }}>
                                    <li>The individual or entity subscribing to or availing research services.</li>
                                    <li>Must meet the eligibility requirements set forth herein and under Indian law.</li>
                                </ul>
                            </li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>1.2 Purpose</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>These Terms &amp; Conditions (&ldquo;T&amp;C&rdquo;) govern the Client&rsquo;s use or subscription of Our research services (&ldquo;Services&rdquo;), including any digital platforms, mobile/web applications, or technology solutions that We or our service provider(s) operate.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>1.3 Compliance with SEBI Circular</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>This document incorporates the minimum mandatory provisions contained in the SEBI circular SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2025/004 dated January 08, 2025 (&ldquo;the Circular&rdquo;) and relevant amendments to the SEBI (Research Analysts) Regulations, 2014 (&ldquo;RA Regulations&rdquo;).</li>
                            <li>In case of conflict between these T&amp;C and any applicable regulations/guidelines issued by SEBI, the SEBI regulations/guidelines shall prevail.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>2. CLIENT DETAILS</div>
                        <p style={{ marginBottom: "12px" }}>Before availing of Our Services, the Client agrees to provide the following personal details as part of the registration process and Know Your Client (&ldquo;KYC&rdquo;) compliance:</p>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px", listStyleType: "disc" }}>
                            <li><b>Full Name:</b> {user?.name}</li>
                            <li><b>Permanent Account Number (PAN):</b> {panNumber}</li>
                            <li><b>Date of Birth:</b> {user?.dob || ''}</li>
                            <li><b>Email Address:</b> {user?.email}</li>
                            <li><b>State/City:</b> {user?.state ? `${user?.state} / ${user?.city || ''}` : (user?.city || '')}</li>
                        </ul>
                        <p style={{ marginBottom: "16px" }}>You affirm that all details provided are true, accurate, and complete. Inaccurate or incomplete information may result in suspension or termination of your access to Our Services.</p>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>3. Definitions</div>
                        <p style={{ marginBottom: "8px" }}>Unless the context otherwise requires, the following definitions apply in this T&amp;C:</p>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>&ldquo;Client&rdquo; or &ldquo;User&rdquo;: Any person or entity that registers with the RA and agrees to these T&amp;C to avail the Services.</li>
                            <li>&ldquo;Services&rdquo;: Includes (a) research reports, data, model portfolios, Recommendations or analyses pertaining to Indian-listed securities; (b) any online or offline research support (c) any communications related thereto.</li>
                            <li>&ldquo;Digital Platform&rdquo;: Includes websites, mobile or web applications, or other technology platforms (including third-party service providers) used for delivering the Services.</li>
                            <li>&ldquo;KYC&rdquo;: Know Your Customer&mdash;verification process mandated by SEBI (and other applicable laws) to establish the identity of Clients.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>4. Scope of Services</div>
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>4.1 Research-Only / No Execution</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>The RA provides research reports, recommendations, model portfolios, analysis and related content about indian-</li>
                        </ul>
                    </Page>

                    <Page page={2}>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li style={{ listStyle: "none" }}>listed securities.</li>
                            <li>We do not execute trades on behalf of Clients, hold Clients&rsquo; funds, or provide any assured returns. You retain full control and discretion over any investment decision.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>4.2 Model Portfolios</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Where offered, Our model portfolios are recommendations for basket(s) of securities with weightages. Such recommendations are for informational purposes and do not guarantee performance or returns.</li>
                            <li>We will maintain compliance with SEBI&rsquo;s model portfolio guidelines (per the Circular&rsquo;s Annexure-A).</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>4.3 Use of Artificial Intelligence (AI)</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>If We use AI tools (in whole or part) to generate or support research outputs, We remain solely responsible for the quality, accuracy, security, and confidentiality of data.</li>
                            <li>We shall disclose the extent of AI usage to the Client when providing Services (or whenever material changes occur).</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>4.4 No Guarantee of Returns</div>
                        <p style={{ marginBottom: "16px" }}>All investments or trading carry market risk. Past performance is not indicative of future returns, and the RA does not assure or promise any specific gain or outcome. We do not offer any profit-sharing model or assure any returns.</p>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>5. Eligibility</div>
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>5.1 Legal Capacity</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Only individuals aged 18 years or older (and otherwise competent to contract) or legally incorporated entities may register.</li>
                            <li>If you are a minor or otherwise incapacitated to contract, you are not permitted to use or subscribe to the Services.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>5.2 KYC Compliance</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Clients must provide accurate and complete information for KYC.</li>
                            <li>RA shall verify or store such KYC in accordance with SEBI regulations.</li>
                            <li>The RA may terminate or suspend Services if KYC requirements are not met or if the information provided is incomplete, false, or misleading.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>6. Registration &amp; Accounts</div>
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>6.1 Registration Process</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>To access Our paid Services, Clients must complete the registration form, provide all mandatory details, and accept these T&amp;C.</li>
                            <li>The RA reserves the right to reject or cancel registration if the information is incorrect or if the Client is ineligible under law.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>6.2 Security of Credentials (If Applicable)</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Keep login information (username, password, etc.) confidential (if any). You are liable for unauthorized use of your account due to negligence or sharing of credentials.</li>
                            <li>Notify Us immediately if you suspect any breach.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>6.3 Use of Services</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>You shall not reproduce, distribute, copy, sell, or exploit Our research content without express written consent from the RA.</li>
                            <li>Any unauthorized use is grounds for termination of Services and may lead to legal action.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>7. Fees &amp; Payment</div>
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>7.1 Maximum Fee for Individual/HUF Clients</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Per Regulation 15A of the RA Regulations and the Circular, We may charge fees up to INR 1,51,000 (Rupees One Lakh Fifty-One Thousand) per annum per &ldquo;family of client&rdquo; (for individual and HUF clients).</li>
                            <li>This amount excludes any statutory taxes and charges.</li>
                            <li>We may revise fees in line with the Cost Inflation Index or as specified by SEBI / RAASB every three years.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>7.2 Fees for Non-Individual or Accredited Investors</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>For corporates, institutions, or accredited investors, fees may be negotiated bilaterally without the above limit, subject to fairness and reasonableness.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>7.3 Billing &amp; Mode of Payment</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Payment shall be made through recognized modes: NEFT, IMPS, payment gateways (Instamojo, Cashfree, Razorpay, Stripe, Jodo), CeFCoM, cheque, UPI or any other method communicated by Us.</li>
                            <li>Fees may be charged quarterly or yearly in advance or in another mutually agreed schedule, subject to the advance limit mandated by SEBI.</li>
                            <li>We may offer or guide you regarding the Centralised Fee Collection Mechanism (CeFCoM) as an optional method of fee payment if made available by SEBI.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>7.4 Refund Policy</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>If Our SEBI registration is suspended for more than sixty (60) days or canceled, we shall refund the subscription fees to you on a pro-rata basis for the remaining period of the subscription.</li>
                            <li>No &ldquo;breakage&rdquo; fee or penalty shall be imposed.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>8. Mandatory Terms &amp; Conditions (as per SEBI Circular Annexure-B)</div>
                        <p style={{ marginBottom: "16px" }}>Below are the minimum mandatory T&amp;C required by the Circular. These provisions are integral to Our agreement with You:</p>
                        
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.1 Availing the Research Services</div>
                    </Page>

                    <Page page={3}>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>By subscribing to or otherwise using Our research Services, You confirm that You do so at Your sole discretion.</li>
                            <li>Our Services are rendered in accordance with the applicable SEBI (Research Analysts) Regulations, 2014.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.2 Obligations on RA</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Both RA and Client agree to be bound by the SEBI Act, SEBI (RA) Regulations, and all rules/regulations/circulars in force from time to time.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.3 Client Information &amp; KYC</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>You shall furnish all required details for KYC in the form mandated by SEBI/RAASB.</li>
                            <li>We will collect, store, verify, and update KYC records as per SEBI norms.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.4 Standard Terms of Service</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>By giving consent (online/offline) to these T&amp;C, You acknowledge and accept the RA&rsquo;s fee structure and disclaimers.</li>
                            <li><b>You confirm that any reliance on research recommendations is at Your own risk and that market risks apply.</b></li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.5 Consideration &amp; Mode of Payment</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>You shall pay the agreed fees plus any statutory charges via permissible methods.</li>
                            <li>We shall not render any research services until the Client&rsquo;s consent is received and initial fees are paid (as applicable).</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.6 Risk Factors</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Investing in securities is subject to market risk, including but not limited to volatility and potential loss of principal.</li>
                            <li>Market and economic conditions vary, and Past performance is no indicator of future performance, and no return is guaranteed.</li>
                            <li>Recommendations or research content are purely educational and do not serve as an absolute guarantee of performance.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.7 Conflict of Interest</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>We will disclose any conflicts of interest as mandated by SEBI, and take steps to mitigate or avoid them.</li>
                            <li>Full disclosures, if required, will be provided in each research report or at the time of giving a recommendation.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.8 Termination of Service &amp; Refund of Fees</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>If Our registration is suspended or canceled by SEBI, We shall refund any residual amount for the unexpired subscription period.</li>
                            <li>We may also suspend/terminate services if You breach these T&amp;C or as otherwise allowed by law.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.9 Grievance Redressal &amp; Dispute Resolution</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>For any service-related issues, including non-receipt of research reports or any other deficiency in service, please email: chouhananujay@gmail.com</li>
                            <li>If you are not satisfied with the resolution, escalate the matter to the designated<br/>
                                Grievance Officer: ANUJAY CHOUHAN(Research Analyst)<br/>
                                <b>Email Id: chouhananujay@gmail.com</b><br/>
                                Phone No.: 8602027324<br/>
                                For more details regarding grievance-related matters, please refer to the grievance redressal section of our website: www.vishtaracapitalresearch.in
                            </li>
                            <li>We will endeavor to address complaints within 7 business days (or any updated SEBI timeline).</li>
                            <li>If unresolved, You may escalate the complaint to SEBI via the SCORES portal or use any other dispute resolution mechanism specified by SEBI (e.g., arbitration).</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.10 Mandatory Notice</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Clients must refer to the Do&rsquo;s and Don&rsquo;ts while dealing with RAs as specified by SEBI (e.g., SEBI Master Circular No. SEBI/HO/MIRSD-POD-1/P/CIR/2024/49 dated May 21, 2024).</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.11 Additional Clauses</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Any additional voluntary clauses in this T&amp;C shall not conflict with SEBI regulations/circulars.</li>
                            <li>Any changes to such voluntary clauses shall be preceded by 15 days&rsquo; notice.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.12 Most Important Terms &amp; Conditions (MITC)</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>We shall also disclose MITC (as standardized by the Industry Standards Forum, in consultation with SEBI/RAASB).</li>
                            <li>The MITC explicitly informs Clients that the RA cannot execute trades on behalf of Clients.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>8.13 Optional Centralised Fee Collection Mechanism (CeFCoM)</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>If and when available, We will inform you of the optional CeFCoM to facilitate fee payment.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>9. Representations &amp; Warranties</div>
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>9.1 RA&rsquo;s Declarations</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>The RA declares that it is duly registered under the SEBI (Research Analysts) Regulations, 2014 &amp;<br/>
                            <b>Registration Details are:</b><br/>
                            Name of the RA : ANUJAY CHOUHAN<br/>
                            SEBI Registration Number : INH00002779<br/>
                            Date of Registration : 03/06/2026
                            </li>
                        </ul>
                    </Page>

                    <Page page={4}>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>The RA meets or exceeds the qualification and certification requirements mandated by SEBI or NISM.</li>
                            <li>The recommendations provided by the RA do not provide any assurance of returns.</li>
                            <li>The RA&rsquo;s services do not conflict with or violate any law or regulation to which it is subject.</li>
                            <li><b>The RA not engaged in any additional professional or business activities, on a whole-time basis or in an executive capacity, which may interfere with, influence, or have the potential to interfere with/influence the independence of the research report and/or recommendations contained therein.</b></li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>9.2 Client&rsquo;s Declarations</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>You represent that You are legally entitled to enter this Agreement and that Your KYC details are true and correct.</li>
                            <li>You understand the nature of market risks and volatility inherent in securities investments.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>10. Confidentiality &amp; Data Protection</div>
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>10.1 Privacy of Client Data</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>We respect Your privacy and will not share or disclose Your personal data except as required by law or to fulfill regulatory obligations (e.g., KYC checks).</li>
                            <li>However, We may share aggregated or anonymized data for research or compliance purposes, without revealing individual identities.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>10.2 Security of Client Data</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>While We endeavor to protect data transmissions, We cannot guarantee the complete security of data over the internet.</li>
                            <li>You acknowledge that data transfers may be unencrypted and may pass over multiple networks.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>11. Limitation of Liability</div>
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>11.1 No Assured Returns</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>We shall not be liable for any direct, indirect, incidental, or consequential losses, including lost profits, due to Your reliance on Our research reports, research recommendations or model portfolios.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>11.2 Force Majeure</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>The RA is not liable for failures or delays in performance arising from events beyond its control, including natural disasters, war, riots, pandemics, power outages, or disruptions in telecommunication systems.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>11.3 Third-Party Data</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>We rely on third-party market data providers. We do not audit or guarantee the correctness of such data, and shall not be held liable for inaccuracies.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>12. Indemnification</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>You agree to indemnify and hold harmless the RA, its officers, employees, and affiliates from any and all claims, damages, losses, or liabilities arising out of:
                                <ol style={{ marginTop: "4px" }}>
                                    <li>Your breach of these T&amp;C or violation of law.</li>
                                    <li>Unauthorized or improper use of Your account or services.</li>
                                    <li>Third-party claims related to Your actions or inactions.</li>
                                </ol>
                            </li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>13. Suspension &amp; Termination</div>
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>13.1 Suspension</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>We reserve the right to suspend Your account or access to Services with or without notice if You breach these T&amp;C or if required by SEBI/regulators.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>13.2 Termination</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>We may terminate this Agreement immediately upon:
                                <ol style={{ marginTop: "4px" }}>
                                    <li>Violation of T&amp;C by You.</li>
                                    <li>Directions from SEBI or any competent regulatory authority.</li>
                                    <li>Non-payment of fees (beyond the grace period, if any).</li>
                                </ol>
                            </li>
                            <li>Refunds (if any) shall be governed by Section 7.4 above.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>14. Grievances &amp; Dispute Resolution</div>
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>14.1 Internal Mechanism</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>For any concerns, complaints, or grievances, any service-related issues, please email:<br/>chouhananujay@gmail.com</li>
                            <li>If you are not satisfied with the resolution, escalate the matter to the designated<br/>
                                <b>Grievance Officer: ANUJAY CHOUHAN</b><br/>
                                <b>Email Id: chouhananujay@gmail.com</b><br/>
                                Phone No.: 8602027324
                            </li>
                            <li>We aim to resolve such grievances within 7 business days or as per the timeline mandated by SEBI.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>14.2 Escalation to SEBI</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>If unresolved, You may approach SEBI&rsquo;s SCORES platform or seek redressal through the dispute resolution mechanisms prescribed by SEBI (e.g., arbitration).</li>
                        </ul>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>15. Miscellaneous</div>
                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>15.1 Amendments</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>We may modify or update these T&amp;C in accordance with SEBI regulations. Notice of material changes will be posted</li>
                        </ul>
                    </Page>

                    <Page page={5}>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li style={{ listStyle: "none" }}>on Our website/app or emailed to You. Continued use of the Services indicates Your acceptance of updated T&amp;C.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>15.2 Severability</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>If any provision is held invalid by a competent authority, the remaining provisions shall continue in effect.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>15.3 Governing Law &amp; Jurisdiction</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>These T&amp;C shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts/tribunals in Maharashtra or as directed by SEBI.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>15.4 No Agency</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Nothing in these T&amp;C shall be deemed to constitute a partnership, agency, or joint venture between the RA and the Client.</li>
                        </ul>

                        <div style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>15.5 Disclaimer</div>
                        <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li>Registration granted by SEBI and certification from NISM in no way guarantee the performance of the intermediary or provide any assurance of returns to investors.</li>
                            <li>Investing in stocks/ETFs is subject to market risks. Read all related documents carefully before investing. Consult a qualified financial advisor to understand suitability.</li>
                        </ul>

                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "15px", marginTop: "24px", marginBottom: "8px" }}>Most Important Terms and Conditions (MITC)</div>
                        <div style={{ textAlign: "center", marginBottom: "16px" }}>[Forming part of the Terms and Conditions for providing research services]</div>
                        
                        <ol style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li style={{ marginBottom: "8px" }}>These terms and conditions, and consent thereon are for the research services provided by the Research Analyst (RA) and RA cannot execute/carry out any trade (purchase/sell transaction) on behalf of, the client. Thus, the clients are advised not to permit RA to execute any trade on their behalf.</li>
                            <li style={{ marginBottom: "8px" }}>The fee charged by RA to the client will be subject to the maximum of amount prescribed by SEBI/ Research Analyst Administration and Supervisory Body (RAASB) from time to time (applicable only for Individual and HUF Clients).<br/>Note:<br/>
                            2.1. The current fee limit is Rs 1,51,000/- per annum per family of client for all research services of the RA.<br/>
                            2.2. The fee limit does not include statutory charges.<br/>
                            2.3. The fee limits do not apply to a non-individual client / accredited investor.</li>
                            <li style={{ marginBottom: "8px" }}>RA may charge fees in advance if agreed by the client. Such advance shall not exceed the period stipulated by SEBI; presently it is one quarter. In case of pre-mature termination of the RA services by either the client or the RA, the client shall be entitled to seek refund of proportionate fees only for unexpired period.</li>
                            <li style={{ marginBottom: "8px" }}>Fees to RA may be paid by the client through any of the specified modes like cheque, online bank transfer, UPI, etc. Cash payment is not allowed. Optionally the client can make payments through Centralized Fee Collection Mechanism (CeFCoM) managed by BSE Limited (i.e. currently recognized RAASB).</li>
                            <li style={{ marginBottom: "8px" }}>The RA is required to abide by the applicable regulations/ circulars/ directions specified by SEBI and RAASB from time to time in relation to disclosure and mitigation of any actual or potential conflict of interest. The RA will endeavor to promptly inform the client of any conflict of interest that may affect the services being rendered to the client.</li>
                            <li style={{ marginBottom: "8px" }}>Any assured/guaranteed/fixed returns schemes or any other schemes of similar nature are prohibited by law. No scheme of this nature shall be offered to the client by the RA.</li>
                            <li style={{ marginBottom: "8px" }}>The RA cannot guarantee returns, profits, accuracy, or risk-free investments from the use of the RA&rsquo;s research services. All opinions, projections, estimates of the RA are based on the analysis of available data under certain assumptions as of the date of preparation/publication of research report.</li>
                            <li style={{ marginBottom: "8px" }}>Any investment made based on recommendations in research reports are subject to market risks, and recommendations do not provide any assurance of returns. There is no recourse to claim any losses incurred on the investments made based on the recommendations in the research report. Any reliance placed on the research report provided by the RA shall be as per the client&rsquo;s own judgement and assessment of the conclusions contained in the research report.</li>
                            <li style={{ marginBottom: "8px" }}>The SEBI registration, Enlistment with RAASB, and NISM certification do not guarantee the performance of the RA or assure any returns to the client.</li>
                            <li style={{ marginBottom: "8px" }}>For any grievances,<br/>
                            Step 1: the client should first contact the RA using the details on its website or following contact details: (RA to provide details as per &lsquo;Grievance Redressal / Escalation Matrix&rsquo;)<br/>
                            Step 2: If the resolution is unsatisfactory, the client can also lodge grievances through SEBI&rsquo;s SCORES platform at www.scores.sebi.gov.in<br/>
                            Step 3: The client may also consider the Online Dispute Resolution (ODR) through the Smart ODR portal at https://smartodr.in</li>
                            <li style={{ marginBottom: "8px" }}>Clients are required to keep contact details, including email id and mobile number/s updated with the RA at all times.</li>
                            <li style={{ marginBottom: "8px" }}>The RA shall never ask for the client&rsquo;s login credentials and OTPs for the client&rsquo;s Trading Account Demat Account and Bank Account. Never share such information with anyone including RA.</li>
                        </ol>

                        <div style={{ fontWeight: "bold", fontSize: "15px", marginTop: "16px", marginBottom: "8px" }}>16. DECLARATION &amp; CONSENT</div>
                        <p style={{ marginBottom: "8px" }}>By signing, or otherwise indicating assent:</p>
                        <ol style={{ marginLeft: "20px", marginBottom: "16px" }}>
                            <li style={{ marginBottom: "4px" }}>You acknowledge that you have read, understood, and agree to these Terms, including the fee structure, disclaimers and limitations of liability.</li>
                            <li style={{ marginBottom: "4px" }}>You confirm that you have provided accurate personal details (Name, PAN, DOB, Email, City, State).</li>
                            <li style={{ marginBottom: "4px" }}>You agree that no research service will be rendered, until your explicit consent to these Terms is received.</li>
                        </ol>
                    </Page>

                    <Page page={6}>
                        <ol start="4" style={{ marginLeft: "20px", marginBottom: "32px" }}>
                            <li style={{ marginBottom: "8px" }}>You understand that any investments or trading made pursuant to Our research reports or recommendations are at your sole discretion and risk, and no assurance or warranty of returns or profitability is provided. There is no recourse to claim any losses incurred on the investments/Trading made based on the recommendations.</li>
                        </ol>
                        
                        <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: "32px", marginTop: "48px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "40px" }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: "bold", fontSize: "14px", textTransform: "uppercase", marginBottom: "8px" }}>DIGITAL CONSENT RECORDED</p>
                                <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>(By signing or clicking &ldquo;I Agree,&rdquo; you are agreeing to the above Terms and Conditions.)</p>
                                <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
                                    <p><b>Signed By (Client&rsquo;s Signature/Name):</b> {user?.name}</p>
                                    <p><b>PAN:</b> {panNumber}</p>
                                    <p><b>Timestamp:</b> <span style={{ fontFamily: "monospace" }}>{timestamp}</span></p>
                                </div>
                            </div>
                            <div style={{ textAlign: "center", width: "192px", flexShrink: 0 }}>
                                <div style={{ height: "80px", borderBottom: "1px solid #000000", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontStyle: "italic", color: "#cbd5e1", userSelect: "none" }}>
                                    {kycData?.signature_image ? (
                                        <img
                                            src={`${BASE_URL}${kycData.signature_image}`}
                                            alt="Signature"
                                            style={{ height: "64px", width: "auto", objectFit: "contain", mixBlendMode: "multiply" }}
                                        />
                                    ) : (
                                        "Digitally Signed"
                                    )}
                                </div>
                                <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Authorized Signatory</p>
                            </div>
                        </div>
                    </Page>
                </div>

                {/* ACTION FOOTER */}
                <div style={{ padding: "24px 32px", borderTop: "1px solid #e2e8f0", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
                    <div style={{ flex: 1, marginRight: "24px" }}>
                        <label style={{ display: "flex", alignItems: "flex-start", gap: "16px", cursor: "pointer", padding: "20px", borderRadius: "16px", backgroundColor: "#f8fafc", border: "2px solid transparent", transition: "all 0.2s" }}>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                                style={{ marginTop: "4px", width: "24px", height: "24px", cursor: "pointer" }}
                            />
                            <span style={{ fontSize: "11px", fontWeight: "900", color: "#011D52", textTransform: "uppercase", letterSpacing: "-0.5px", lineHeight: "1.2" }}>
                                I confirm that I have read all pages and I accept the terms of the Agreement.
                                <span style={{ display: "block", fontSize: "9px", fontWeight: "bold", color: "#94a3b8", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>Digital Consent recorded with secure timestamp</span>
                            </span>
                        </label>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <button onClick={onClose} style={{ padding: "12px 24px", fontSize: "10px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", border: "none", background: "transparent", cursor: "pointer" }}>
                            Cancel
                        </button>
                        <button
                            disabled={!isChecked}
                            onClick={onAccept}
                            style={{ padding: "16px 48px", backgroundColor: isChecked ? "#011D52" : "#94a3b8", color: "#ffffff", borderRadius: "16px", fontWeight: "900", textTransform: "uppercase", fontSize: "11px", letterSpacing: "2px", border: "none", cursor: isChecked ? "pointer" : "not-allowed", boxShadow: isChecked ? "0 10px 15px -3px rgba(1, 29, 82, 0.3)" : "none", transition: "all 0.2s" }}
                        >
                            Sign &amp; Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgreementModal;
