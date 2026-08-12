import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import kycService from '../../services/kycService';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const KycVerification = () => {
    const { user, checkAuth } = useContext(AuthContext); // in vistara-theme context, checkAuth is the refresh function
    const [searchParams] = useSearchParams();

    const [step, setStep] = useState('check');
    const [checking, setChecking] = useState(true);
    const [kycState, setKycState] = useState('none');
    const [kycDetails, setKycDetails] = useState('');

    const [consent, setConsent] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initial Status Check & Polling
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await kycService.checkStatus();
                if (res.success) {
                    setKycState(res.kyc_status);
                    setKycDetails(res.message || res.kyc_status?.toUpperCase());

                    // If approved, refresh user data
                    if (['approved', 'completed', 'success'].includes(res.kyc_status?.toLowerCase())) {
                        if (checkAuth) checkAuth();
                    }
                }
            } catch (err) {
                console.error("Error checking KYC status:", err);
                setError("Failed to fetch KYC status");
            } finally {
                setChecking(false);
            }
        };

        fetchStatus();

        // Polling for status updates every 10 seconds if pending
        const pendingStatuses = ['pending', 'approval_pending', 'processing', 'initiated', 'requested'];
        let interval;

        if (pendingStatuses.includes(kycState?.toLowerCase())) {
            interval = setInterval(fetchStatus, 10000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [kycState, checkAuth]);

    // Handle Callback redirect from Digio
    useEffect(() => {
        if (searchParams.get('kyc_status') === 'updated' || searchParams.get('kyc_callback') === 'true') {
            if (checkAuth) checkAuth(); // Refresh user context
            toast.success("KYC status updated!");
        }
    }, [searchParams, checkAuth]);

    const handleStartKyc = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await kycService.initiateKyc({
                phone: user.phone,
                name: user.name
            });

            if (res.success && res.redirect_url) {
                // Redirect user to Digio Gateway
                window.location.href = res.redirect_url;
            } else {
                setError(res.message || "Failed to initiate KYC");
            }
        } catch (err) {
            console.error("KYC Initiation Error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#1b2c42", paddingBottom: "40px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ color: "#1B2B40", fontWeight: "800", fontSize: "24px", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>KYC Verification</h2>
                    <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>Manage your identity verification status for secure trading.</p>
                </div>
                <Link to="/portal" style={{
                    padding: "8px 16px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    color: "#1B2B40",
                    fontWeight: "600",
                    fontSize: "12px",
                    textDecoration: "none",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                }}>
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div style={{ padding: "30px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", maxWidth: "800px", margin: "0 auto" }}>
                {/* ================= CHECK STATUS ================= */}
                {step === 'check' && (
                    <div className="animate-in fade-in duration-500">

                        {checking ? (
                            <div className="text-center" style={{ padding: "40px 0", color: "#64748b" }}>
                                <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Checking status...</p>
                            </div>
                        ) : (
                            <div>
                                {['approved', 'completed', 'success'].includes(kycState) && (
                                    <div className="text-center">
                                        <div style={{ width: "80px", height: "80px", backgroundColor: "rgba(40, 199, 111, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                            <span style={{ fontSize: "36px", color: "#28c76f" }}>✅</span>
                                        </div>
                                        <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#28c76f", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Verification Approved</h3>
                                        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "30px" }}>
                                            Your identity has been successfully verified. You now have full access to all features.
                                        </p>

                                        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "25px", textAlign: "left" }}>
                                            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#1b2b40", marginBottom: "15px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Verified Profile Details</h4>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                                        <span style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Full Name</span>
                                                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#1b2b40" }}>{user?.name || 'Verified User'}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                                        <span style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Registered Phone</span>
                                                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#1b2b40" }}>{user?.phone || 'Not available'}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                                        <span style={{ display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Status Detail</span>
                                                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#1b2b40" }}>
                                                            {kycDetails && kycDetails !== 'APPROVED' && kycDetails !== 'COMPLETED' && kycDetails !== 'SUCCESS'
                                                                ? kycDetails
                                                                : 'Aadhaar / PAN successfully matched with identity.'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {['pending', 'approval_pending', 'processing', 'initiated'].includes(kycState) && (
                                    <div className="text-center">
                                        <div style={{ width: "80px", height: "80px", backgroundColor: "rgba(255, 159, 67, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                            <span style={{ fontSize: "36px", color: "#ff9f43" }}>⏳</span>
                                        </div>
                                        <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#ff9f43", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Verification Pending</h3>
                                        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px", maxWidth: "450px", margin: "0 auto 25px" }}>
                                            Our compliance team is actively reviewing your submitted documents. This process typically takes 24 to 48 hours. We will notify you once approved.
                                        </p>
                                        <div style={{ padding: "10px 20px", backgroundColor: "#f8fafc", borderRadius: "20px", display: "inline-block", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
                                            Current Status: {kycState.toUpperCase()}
                                        </div>
                                        <br />
                                        <button onClick={() => setStep('agreement')} style={{ background: "none", border: "none", color: "#011D52", fontSize: "13px", fontWeight: "700", textDecoration: "underline", cursor: "pointer" }}>Restart Verification Process</button>
                                    </div>
                                )}

                                {['rejected', 'failed', 'expired'].includes(kycState) && (
                                    <div className="text-center">
                                        <div style={{ width: "80px", height: "80px", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                            <span style={{ fontSize: "36px", color: "#ef4444" }}>❌</span>
                                        </div>
                                        <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#ef4444", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Verification Failed</h3>
                                        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "25px", maxWidth: "450px", margin: "0 auto 25px" }}>
                                            We couldn't verify your documents. Please try again, ensuring that your details match exactly and the photos are clear.
                                        </p>
                                        <button onClick={() => setStep('agreement')}
                                            style={{
                                                padding: "14px 28px",
                                                background: "linear-gradient(135deg, #011D52 0%, #1B2B40 100%)",
                                                border: "none",
                                                borderRadius: "8px",
                                                color: "#ffffff",
                                                fontWeight: "700",
                                                fontSize: "13px",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                                cursor: "pointer",
                                                boxShadow: "0 4px 10px rgba(1, 29, 82, 0.2)"
                                            }}>
                                            Retry Verification
                                        </button>
                                    </div>
                                )}

                                {(kycState === 'none' || !kycState || kycState === 'requested') && (
                                    <div className="text-center">
                                        <div style={{ width: "80px", height: "80px", backgroundColor: "rgba(1, 29, 82, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                            <span style={{ fontSize: "36px", color: "#011D52" }}>🔐</span>
                                        </div>
                                        <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#011D52", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Action Required</h3>
                                        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "30px", maxWidth: "450px", margin: "0 auto 30px" }}>
                                            You must complete KYC identity verification to unlock premium market calls, dashboard features, and comply with SEBI guidelines.
                                        </p>
                                        <button onClick={() => setStep('agreement')}
                                            style={{
                                                padding: "14px 32px",
                                                background: "linear-gradient(135deg, #011D52 0%, #1B2B40 100%)",
                                                border: "none",
                                                borderRadius: "8px",
                                                color: "#ffffff",
                                                fontWeight: "800",
                                                fontSize: "13px",
                                                textTransform: "uppercase",
                                                letterSpacing: "1px",
                                                cursor: "pointer",
                                                boxShadow: "0 4px 12px rgba(1, 29, 82, 0.3)"
                                            }}>
                                            Start KYC Process &rarr;
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ================= AGREEMENT ================= */}
                {step === 'agreement' && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-4">
                            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#1b2b40", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Digio Consent</h3>
                            <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>Please review and agree before proceeding to identity verification.</p>
                        </div>

                        <div style={{ maxHeight: "200px", overflowY: "auto", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#64748b", lineHeight: "1.6", marginBottom: "20px" }}>
                            <p style={{ marginBottom: "12px" }}>I voluntarily give my consent for Aadhaar/PAN based KYC through UIDAI/NSDL for the purpose of identity verification for Vistara Capital Research.</p>
                            <p style={{ marginBottom: "12px" }}>I understand that my identity details will be used only for authentication and regulatory compliance, and will be handled securely in accordance with our Privacy Policy.</p>
                            <p>I agree to the terms and conditions of the Digio verification system gateway.</p>
                        </div>

                        <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px", backgroundColor: "rgba(1, 29, 82, 0.05)", borderRadius: "8px", border: "1px solid rgba(1, 29, 82, 0.15)", cursor: "pointer", marginBottom: "25px" }}>
                            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: "3px", width: "16px", height: "16px", accentColor: "#011D52" }} />
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#011D52", textTransform: "uppercase", letterSpacing: "0.5px" }}>I have read and agree to the verification terms</span>
                        </label>

                        <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                            <div style={{ display: "flex", gap: "15px" }}>
                                <button onClick={() => setStep('check')} style={{ flex: 1, padding: "14px", backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#64748b", fontWeight: "700", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", cursor: "pointer", transition: "all 0.2s" }}>
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStartKyc}
                                    disabled={!consent || loading}
                                    style={{
                                        flex: 2,
                                        padding: "14px",
                                        background: consent && !loading ? "linear-gradient(135deg, #011D52 0%, #1B2B40 100%)" : "#cbd5e1",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: consent && !loading ? "#ffffff" : "#94a3b8",
                                        fontWeight: "800",
                                        fontSize: "13px",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        cursor: consent && !loading ? "pointer" : "not-allowed",
                                        boxShadow: consent && !loading ? "0 4px 12px rgba(1, 29, 82, 0.3)" : "none",
                                        transition: "all 0.2s"
                                    }}>
                                    {loading ? 'Initializing Gateway...' : 'Continue to Digio &rarr;'}
                                </button>
                            </div>
                        </div>

                        {error && <p style={{ textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#ef4444", marginTop: "15px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KycVerification;
