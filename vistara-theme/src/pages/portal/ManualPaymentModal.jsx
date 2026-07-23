import React, { useState } from 'react';
import agreementService from '../../services/agreementService';
import toast from 'react-hot-toast';

const ManualPaymentModal = ({ isOpen, onClose, finalPrice, selectedPlan, selectedDuration }) => {
    const [screenshot, setScreenshot] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paidAmount, setPaidAmount] = useState(finalPrice?.replace(/[^0-9.]/g, '') || '');

    const actualPrice = Number(finalPrice?.toString().replace(/[^0-9.]/g, '') || 0);
    const isFree = actualPrice === 0;

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemovePreview = () => {
        setScreenshot(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFree && !screenshot) return;

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            if (screenshot) {
                formData.append('screenshot', screenshot);
            }
            formData.append('plan_id', selectedPlan._id);
            formData.append('duration_id', selectedDuration._id);
            formData.append('amount', paidAmount);

            const res = await agreementService.submitManualPayment(formData);
            if (res.success) {
                toast.success(res.message || "Payment proof submitted successfully!");
                onClose();
                window.location.reload();
            } else {
                toast.error(res.message || "Failed to submit payment");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const upiLink = `upi://pay?pa=The Rapid Investorsresearch@upi&pn=BSMR&am=${paidAmount}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 120, backgroundColor: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
            <div style={{ width: "100%", maxWidth: "768px", backgroundColor: "#ffffff", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", overflow: "hidden", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>

                {/* HEADER */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", backgroundColor: "#011D52", color: "#ffffff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px", borderRadius: "8px" }}>
                            <svg style={{ width: "16px", height: "16px", color: "#e0f2fe" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                        </div>
                        <h3 style={{ fontSize: "12px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Manual Payment Gateway</h3>
                    </div>
                    <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                        ✕
                    </button>
                </div>

                <div className="row m-0">
                    {/* LEFT SIDE: QR CODE SECTION */}
                    <div className="col-md-6 p-4 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#f8fafc", borderRight: "1px solid #e2e8f0" }}>
                        {!isFree ? (
                            <div style={{ textAlign: "center", width: "100%" }}>
                                <div style={{ marginBottom: "24px" }}>
                                    <p style={{ fontSize: "9px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px 0" }}>Step 1: Scan & Pay</p>
                                    <h4 style={{ fontSize: "12px", fontWeight: "900", color: "#011D52", textTransform: "uppercase", margin: 0 }}>Institutional UPI QR</h4>
                                </div>

                                <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", display: "inline-block", marginBottom: "24px" }}>
                                    <img src={qrCodeUrl} style={{ width: "160px", height: "160px", objectFit: "contain" }} alt="Payment QR" />
                                </div>

                                <div>
                                    <p style={{ fontSize: "10px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 0" }}>Use any UPI app</p>
                                    <div style={{ display: "flex", justifyContent: "center", gap: "12px", color: "#94a3b8", fontWeight: "bold", fontSize: "9px" }}>
                                        <span>GPay</span>
                                        <span>PhonePe</span>
                                        <span>Paytm</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", width: "100%" }}>
                                <div style={{ width: "80px", height: "80px", backgroundColor: "#d1fae5", color: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", margin: "0 auto 24px auto" }}>
                                    🎉
                                </div>
                                <div>
                                    <h4 style={{ fontSize: "14px", fontWeight: "900", color: "#059669", textTransform: "uppercase", margin: "0 0 8px 0" }}>100% Discount Applied</h4>
                                    <p style={{ fontSize: "10px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>No payment required. Submit to activate your subscription instantly.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: UPLOAD SECTION */}
                    <div className="col-md-6 p-4 d-flex flex-column justify-content-between" style={{ backgroundColor: "#ffffff" }}>
                        <div>
                            <div style={{ marginBottom: "20px" }}>
                                <p style={{ fontSize: "9px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px 0" }}>
                                    {!isFree ? "Step 2: Upload Proof" : "Confirmation"}
                                </p>

                                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: "10px", fontWeight: "900", color: "#011D52", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "0 0 2px 0" }}>{selectedPlan?.name}</p>
                                        <p style={{ fontSize: "8px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>{selectedDuration?.duration}</p>
                                    </div>
                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                        <p style={{ fontSize: "8px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 2px 0" }}>Payable</p>
                                        <p style={{ fontSize: "12px", fontWeight: "900", color: "#011D52", margin: 0 }}>₹{finalPrice}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div>
                                    <label style={{ fontSize: "9px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", display: "block", margin: "0 0 6px 4px" }}>Paid Amount</label>
                                    <div style={{ position: "relative" }}>
                                        <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#011D52", fontWeight: "900", fontSize: "12px" }}>₹</span>
                                        <input
                                            type="number"
                                            value={paidAmount}
                                            onChange={(e) => setPaidAmount(e.target.value)}
                                            style={{ width: "100%", padding: "12px 16px 12px 32px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", fontWeight: "900", color: "#011D52", fontSize: "12px", outline: "none", transition: "all 0.2s" }}
                                            onFocus={(e) => { e.target.style.borderColor = "#011D52"; e.target.style.backgroundColor = "#ffffff"; }}
                                            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.backgroundColor = "#f8fafc"; }}
                                            required
                                        />
                                    </div>
                                </div>

                                {!isFree && (
                                    <div style={{ position: "relative" }}>
                                        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "128px", border: "1px dashed #cbd5e1", borderRadius: "12px", backgroundColor: "#f8fafc", cursor: "pointer", overflow: "hidden", position: "relative", transition: "all 0.2s" }}
                                            onMouseOver={(e) => { e.currentTarget.style.borderColor = "#011D52"; e.currentTarget.style.backgroundColor = "#ffffff"; }}
                                            onMouseOut={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                                        >
                                            {!previewUrl ? (
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                                    <svg style={{ width: "24px", height: "24px", marginBottom: "8px", color: "#cbd5e1" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                    <p style={{ fontSize: "9px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Upload Screenshot</p>
                                                </div>
                                            ) : (
                                                <img src={previewUrl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} alt="Preview" />
                                            )}
                                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} required={!isFree} />
                                        </label>
                                        {previewUrl && (
                                            <button type="button" onClick={handleRemovePreview} style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#ef4444", color: "#ffffff", width: "24px", height: "24px", borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", zIndex: 20, cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>✕</button>
                                        )}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={(!isFree && !screenshot) || isSubmitting}
                                    style={{ width: "100%", padding: "16px", backgroundColor: (!isFree && !screenshot) || isSubmitting ? "#94a3b8" : "#011D52", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", cursor: (!isFree && !screenshot) || isSubmitting ? "not-allowed" : "pointer", boxShadow: (!isFree && !screenshot) || isSubmitting ? "none" : "0 10px 15px -3px rgba(1, 29, 82, 0.3)", transition: "all 0.2s" }}
                                >
                                    {isSubmitting ? 'Processing...' : (!isFree ? 'Submit Payment Proof' : 'Activate Free Subscription')}
                                </button>
                            </form>
                        </div>

                        <div style={{ textAlign: "center", marginTop: "16px" }}>
                            <p style={{ fontSize: "8px", color: "#94a3b8", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                                Verification typically within <span style={{ color: "#011D52" }}>2-4 hours</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualPaymentModal;
