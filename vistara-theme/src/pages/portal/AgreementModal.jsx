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
            Page {page} of 10
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
            <AuthorizedSignature />
            <PageFooter page={page} />
        </div>
    );

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", overflow: "hidden" }}>
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
                        <div style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline", fontSize: "16px", marginBottom: "8px", textTransform: "uppercase" }}>CLIENT AGREEMENT AND TERMS AND CONDITIONS</div>
                        <div style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline", marginBottom: "16px" }}>PART A</div>
                        <div style={{ fontWeight: "bold", textDecoration: "underline", marginTop: "16px", marginBottom: "8px" }}>INTRODUCTION</div>
                        <p style={{ marginBottom: "16px" }}>This Agreement (“Agreement”) is entered into by and between:</p>
                        <p style={{ marginLeft: "24px", marginBottom: "16px" }}>(a) Research Analyst (hereinafter referred to as the “RA,” “We,” “Our” or “Us”), being a person/entity duly registered with the Securities and Exchange Board of India (“SEBI”) under Registration No. <b>INH000018559</b> and in the name of <b>Subham Sharma Proprietor of The Rapid Investors</b>; and</p>
                        <p style={{ marginLeft: "24px", marginBottom: "16px" }}>(b) Client / User (hereinafter referred to as “You,” “Your” or “the Client”), being the individual or legal entity subscribing to or availing of the research services provided by the RA, and who satisfies the eligibility criteria set out in this Agreement and under all applicable laws of India.</p>
                        <p style={{ marginBottom: "16px" }}>The RA and the Client are hereinafter collectively referred to as the “Parties” and individually as a “Party.”</p>
                    </Page>

                    <Page page={10}>
                        <div style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline", marginBottom: "32px", textTransform: "uppercase", fontSize: "16px" }}>Customer Details*</div>
                        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000000", marginBottom: "40px", fontSize: "14px" }}>
                            <tbody>
                                <tr><td style={{ border: "1px solid #000000", padding: "12px", fontWeight: "bold", backgroundColor: "#f8fafc", width: "33%" }}>Name</td><td style={{ border: "1px solid #000000", padding: "12px" }}>{user?.name}</td></tr>
                                <tr><td style={{ border: "1px solid #000000", padding: "12px", fontWeight: "bold", backgroundColor: "#f8fafc" }}>E-Mail</td><td style={{ border: "1px solid #000000", padding: "12px" }}>{user?.email}</td></tr>
                                <tr><td style={{ border: "1px solid #000000", padding: "12px", fontWeight: "bold", backgroundColor: "#f8fafc" }}>Phone Number</td><td style={{ border: "1px solid #000000", padding: "12px" }}>{user?.phone || user?.mobile}</td></tr>
                                <tr><td style={{ border: "1px solid #000000", padding: "12px", fontWeight: "bold", backgroundColor: "#f8fafc" }}>PAN Number</td><td style={{ border: "1px solid #000000", padding: "12px" }}>{panNumber || 'Verified'}</td></tr>
                                <tr><td style={{ border: "1px solid #000000", padding: "12px", fontWeight: "bold", backgroundColor: "#f8fafc" }}>Aadhaar (Masked)</td><td style={{ border: "1px solid #000000", padding: "12px" }}>{aadhaarNumber}</td></tr>
                                <tr><td style={{ border: "1px solid #000000", padding: "12px", fontWeight: "bold", backgroundColor: "#f8fafc" }}>Amount Paid (In INR)</td><td style={{ border: "1px solid #000000", padding: "12px", fontWeight: "bold", color: "#011D52" }}>₹{planAmount || selectedDuration?.price}</td></tr>
                                <tr><td style={{ border: "1px solid #000000", padding: "12px", fontWeight: "bold", backgroundColor: "#f8fafc" }}>Date of Agreement</td><td style={{ border: "1px solid #000000", padding: "12px" }}>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</td></tr>
                                <tr><td style={{ border: "1px solid #000000", padding: "12px", fontWeight: "bold", backgroundColor: "#f8fafc" }}>Service Plan</td><td style={{ border: "1px solid #000000", padding: "12px", fontWeight: "bold" }}>{selectedPlan?.name}</td></tr>
                                <tr><td style={{ border: "1px solid #000000", padding: "12px", fontWeight: "bold", backgroundColor: "#f8fafc" }}>Subscription Duration</td><td style={{ border: "1px solid #000000", padding: "12px" }}>{selectedDuration?.duration}</td></tr>
                            </tbody>
                        </table>

                        <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: "32px", marginTop: "48px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "40px" }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: "bold", fontSize: "14px", textTransform: "uppercase", marginBottom: "8px" }}>DIGITAL CONSENT RECORDED</p>
                                <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>I hereby declare that I have read, understood and accepted all terms.</p>
                                <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
                                    <p><b>Signed By:</b> {user?.name}</p>
                                    <p><b>Aadhaar (Masked):</b> {aadhaarNumber}</p>
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
                            Sign & Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgreementModal;
