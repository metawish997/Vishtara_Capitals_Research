import React from 'react';

const PaymentMethodModal = ({ isOpen, onClose, onSelect, finalPrice }) => {
    if (!isOpen) return null;

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 110, backgroundColor: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
            <div style={{ width: "100%", maxWidth: "512px", backgroundColor: "#ffffff", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                
                {/* HEADER */}
                <div style={{ padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f8fafc" }}>
                    <div>
                        <h2 style={{ fontSize: "14px", fontWeight: "900", color: "#011D52", textTransform: "uppercase", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>Select Payment Gateway</h2>
                        <p style={{ fontSize: "9px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", letterSpacing: "2px", margin: 0 }}>Secure Institutional Settlement</p>
                    </div>
                    <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", backgroundColor: "transparent", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                        ✕
                    </button>
                </div>

                {/* OPTIONS */}
                <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    
                    {/* Instant Payment Option */}
                    <button 
                        onClick={() => onSelect('instant')}
                        style={{ width: "100%", position: "relative", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", gap: "20px", cursor: "pointer", textAlign: "left", transition: "all 0.3s" }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = "#011D52"; e.currentTarget.style.backgroundColor = "rgba(1, 29, 82, 0.05)" }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "#ffffff" }}
                    >
                        <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                            ⚡
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: "12px", fontWeight: "900", color: "#011D52", textTransform: "uppercase", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>Instant Activation</h3>
                            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Net Banking / UPI / Cards (via Razorpay)</p>
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: "900", color: "#011D52" }}>
                            SELECT &rarr;
                        </div>
                    </button>

                    {/* Manual Payment Option */}
                    <button 
                        onClick={() => onSelect('manual')}
                        style={{ width: "100%", position: "relative", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", gap: "20px", cursor: "pointer", textAlign: "left", transition: "all 0.3s" }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.backgroundColor = "rgba(22, 163, 74, 0.05)" }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "#ffffff" }}
                    >
                        <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                            🏦
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: "12px", fontWeight: "900", color: "#011D52", textTransform: "uppercase", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>Manual Offline Settlement</h3>
                            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>NEFT / RTGS / IMPS / QR Transfer</p>
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: "900", color: "#16a34a" }}>
                            SELECT &rarr;
                        </div>
                    </button>

                    {/* PAYABLE INDICATOR */}
                    <div style={{ paddingTop: "16px", borderTop: "1px solid #f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                        <div>
                            <p style={{ fontSize: "9px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px 0" }}>Signed Payable</p>
                            <p style={{ fontSize: "18px", fontWeight: "900", color: "#011D52", margin: 0, letterSpacing: "-1px" }}>₹{finalPrice}</p>
                        </div>
                        <div style={{ backgroundColor: "#f8fafc", padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                            <span style={{ fontSize: "9px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Digital Order Verified</span>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div style={{ padding: "20px 32px", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "center", gap: "24px" }}>
                    <button onClick={onClose} style={{ fontSize: "9px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>&larr;</span> Cancel Transaction
                    </button>
                    <div style={{ width: "1px", height: "16px", backgroundColor: "#cbd5e1", alignSelf: "center" }}></div>
                    <span style={{ fontSize: "9px", fontWeight: "bold", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <svg style={{ width: "12px", height: "12px" }} fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"></path></svg>
                        SSL Secured
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodModal;
