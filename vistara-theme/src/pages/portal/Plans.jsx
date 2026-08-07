import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import serviceService from '../../services/serviceService';
import couponService from '../../services/couponService';
import kycService from '../../services/kycService';
import agreementService from '../../services/agreementService';
import AgreementModal from './AgreementModal';
import PaymentMethodModal from './PaymentMethodModal';
import ManualPaymentModal from './ManualPaymentModal';
import toast from 'react-hot-toast';

const Plans = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const passedPlan = location.state?.plan;

    // --- STATE ---
    const [plans, setPlans] = useState([]);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(passedPlan || null);
    const [selectedDuration, setSelectedDuration] = useState(passedPlan?.durations?.[0] || null);
    const [activeCoupon, setActiveCoupon] = useState(null);
    const [couponMsg, setCouponMsg] = useState({ text: "", type: "" });
    const [finalPrice, setFinalPrice] = useState("");
    const [savings, setSavings] = useState(0);
    const [existingDraft, setExistingDraft] = useState(null);
    const [isDigioActive, setIsDigioActive] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [kycData, setKycData] = useState(null);

    // Modal States
    const [isAgreementOpen, setIsAgreementOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    const { user } = useContext(AuthContext);

    // Meta for Agreement
    const agreementNo = "AGR-2026-" + Math.floor(1000 + Math.random() * 9000);
    const invoiceNo = "INV-" + Math.floor(100000 + Math.random() * 900000);
    const aadhaarNumber = kycData?.kyc_details?.aadhaar || "Pending Verification";
    const panNumber = kycData?.kyc_details?.pan || "Pending Verification";

    const isKycComplete = (kycData?.status && ['approved', 'completed', 'success'].includes(kycData.status.toLowerCase())) || ['approved', 'completed', 'success'].includes(user?.kyc_status?.toLowerCase());

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [plansRes, couponsRes] = await Promise.all([
                    serviceService.getServicePlans(),
                    couponService.getCoupons()
                ]);

                if (plansRes.success) {
                    setPlans(plansRes.data);
                    if (!passedPlan && plansRes.data.length > 0) {
                        setSelectedPlan(plansRes.data[0]);
                        setSelectedDuration(plansRes.data[0].durations?.[0]);
                    }
                }

                if (couponsRes.success) {
                    setAvailableCoupons(couponsRes.data);
                }
            } catch (error) {
                console.error("Error fetching plans or coupons:", error);
            }

            try {
                const kycRes = await kycService.getFullDetails();
                if (kycRes.success) {
                    setKycData(kycRes.kyc);
                    if (kycRes.digio_active !== undefined) setIsDigioActive(kycRes.digio_active);
                }
            } catch (error) {
                console.error("Error fetching KYC data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [passedPlan]);

    // Recalculate Final Price whenever selection or coupon changes
    useEffect(() => {
        if (!selectedDuration) return;

        const basePrice = parseInt(String(selectedDuration.price).replace(/,/g, '')) || 0;
        let calculatedPrice = basePrice;
        let currentSavings = 0;

        if (activeCoupon) {
            if (activeCoupon.min_amount && basePrice < activeCoupon.min_amount) {
                setCouponMsg({ text: `Min ₹${activeCoupon.min_amount.toLocaleString()} required`, type: "error" });
                setActiveCoupon(null);
                calculatedPrice = basePrice;
                currentSavings = 0;
            } else {
                let discount = 0;
                if (activeCoupon.type === 'percent') {
                    discount = (basePrice * activeCoupon.value) / 100;
                } else {
                    discount = activeCoupon.value;
                }
                calculatedPrice = basePrice - discount;
                currentSavings = discount;
                setCouponMsg({ text: `Discount Applied`, type: "success" });
            }
        } else {
            setCouponMsg({ text: "", type: "" });
            currentSavings = 0;
        }

        if (existingDraft) return;

        setFinalPrice(calculatedPrice.toLocaleString('en-IN'));
        setSavings(currentSavings);
    }, [selectedDuration, activeCoupon, existingDraft]);

    // Check for existing draft whenever plan or duration changes
    useEffect(() => {
        if (!selectedPlan || !selectedDuration) return;
        const checkDraft = async () => {
            try {
                const res = await agreementService.findDraft(selectedPlan._id, selectedDuration._id);
                if (res.success && res.draft) {
                    let currentDraft = res.draft;

                    if (currentDraft.status === 'esign_pending') {
                        try {
                            const statusRes = await agreementService.checkAgreementStatus(currentDraft._id);
                            if (statusRes.success && statusRes.status === 'signed') {
                                currentDraft = { ...currentDraft, status: 'signed' };
                                setIsPaymentModalOpen(true);
                            }
                        } catch (err) {
                            console.error("Status check failed:", err);
                        }
                    }

                    setExistingDraft(currentDraft);
                    setFinalPrice(currentDraft.amount.toLocaleString('en-IN'));

                    const basePrice = parseInt(String(selectedDuration.price).replace(/,/g, '')) || 0;
                    setSavings(Math.max(0, basePrice - res.draft.amount));

                    if (res.draft.coupon_code) {
                        setActiveCoupon({ code: res.draft.coupon_code });
                        setCouponMsg({ text: "Promo locked from pending agreement", type: "success" });
                    }
                } else {
                    setExistingDraft(null);
                }
            } catch (err) {
                console.error("Draft check failed:", err);
            }
        };
        checkDraft();
    }, [selectedPlan, selectedDuration]);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setSelectedDuration(plan.durations[0]);
        setExistingDraft(null);
    };

    const handleCouponToggle = (coupon) => {
        if (existingDraft) return;
        if (activeCoupon?.code === coupon.code) {
            setActiveCoupon(null);
        } else {
            setActiveCoupon(coupon);
        }
    };

    const handleProceedToSettlement = async () => {
        if (!selectedPlan || !selectedDuration) return;

        if (existingDraft) {
            if (existingDraft.status === 'payment_pending') {
                toast.error("Your payment is already under verification.");
                return;
            }
            if (existingDraft.status === 'esign_pending') {
                // Bypass Digio redirect and upgrade draft to signed by creating/updating it
                handleAgreementAccept();
                return;
            }
            if (existingDraft.status === 'signed') {
                setIsPaymentModalOpen(true);
                return;
            }
        }

        // If KYC is complete, user MUST review and sign the agreement first
        if (isKycComplete) {
            setIsAgreementOpen(true);
        } else {
            // Bypass Agreement modal as requested by user if KYC is incomplete
            handleAgreementAccept();
        }
    };

    const handleAgreementAccept = async () => {
        try {
            setIsProcessing(true);
            const payload = {
                plan_id: selectedPlan._id,
                duration_id: selectedDuration._id,
                coupon_code: activeCoupon?.code || null,
                plan_name: selectedPlan.name,
                duration: selectedDuration.duration,
                features: selectedDuration.features,
                planAmount: finalPrice,
                current_url: window.location.href
            };

            const res = await agreementService.storeDraftAgreement(payload);
            if (res.success && res.redirect_url && res.status === 'esign_pending') {
                toast.success("Redirecting to E-Sign Gateway...");
                window.location.href = res.redirect_url;
            } else if (res.success && (res.status === 'signed' || res.status === 'esign_pending')) {
                // If it's signed (or esign pending but no URL for some reason), go to payment
                toast.success("Proceeding to payment gateway...");
                setIsAgreementOpen(false);
                setExistingDraft({ _id: res.draft_id, status: res.status, amount: parseInt(finalPrice.replace(/,/g, '')) || 0 });
                setIsPaymentModalOpen(true);
            } else {
                toast.error(res.message || "Failed to initiate e-sign");
                setIsAgreementOpen(false);
            }
        } catch (error) {
            console.error("Agreement error:", error);
            toast.error(error.message || "Something went wrong");
            setIsAgreementOpen(false);
        } finally {
            setIsProcessing(false);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePaymentMethodSelect = async (method) => {
        setIsPaymentModalOpen(false);
        if (method === 'instant') {
            try {
                setIsProcessing(true);
                const isLoaded = await loadRazorpayScript();
                if (!isLoaded) {
                    toast.error("Razorpay SDK failed to load. Check your connection.");
                    return;
                }

                const res = await agreementService.createRazorpayOrder(selectedPlan._id, selectedDuration._id);
                if (!res.success) {
                    toast.error(res.message || "Failed to create payment order");
                    return;
                }

                const options = {
                    key: res.key,
                    amount: res.order.amount,
                    currency: res.order.currency,
                    name: "The Rapid Investors",
                    description: `${selectedPlan.name} - ${selectedDuration.duration}`,
                    order_id: res.order.id,
                    handler: async (response) => {
                        try {
                            const verifyRes = await agreementService.verifyRazorpayPayment({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                plan_id: selectedPlan._id,
                                duration_id: selectedDuration._id
                            });

                            if (verifyRes.success) {
                                toast.success("Payment Successful! Subscription Activated.");
                                navigate('/portal/profile');
                            } else {
                                toast.error(verifyRes.message || "Payment verification failed.");
                            }
                        } catch (err) {
                            toast.error(err.message || "Payment verification failed.");
                        }
                    },
                    prefill: res.user_details,
                    theme: { color: "#011D52" },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();

            } catch (err) {
                console.error("Razorpay Error:", err);
                toast.error(err.message || "Instant payment initiation failed");
            } finally {
                setIsProcessing(false);
            }
        } else {
            setIsManualModalOpen(true);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#1b2c42", paddingBottom: "40px" }}>
            <div className="mb-4">
                <h2 style={{ color: "#011D52", fontWeight: "800", fontSize: "24px", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>Subscription Plans</h2>
                <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>Choose the best advisory plan tailored for your trading segment.</p>
            </div>

            <div className="row">
                {/* Left Side: Plans */}
                <div className="col-lg-8 mb-4">
                    
                    {/* Promos */}
                    {availableCoupons.length > 0 && (
                        <div style={{ marginBottom: "24px" }}>
                            <p style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Active Promos</p>
                            <div className="d-flex gap-2 overflow-auto" style={{ paddingBottom: "8px" }}>
                                {availableCoupons.map((c, i) => (
                                    <button
                                        key={i}
                                        disabled={!!existingDraft}
                                        onClick={() => handleCouponToggle(c)}
                                        style={{
                                            padding: "8px 16px",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                            fontWeight: "800",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                            border: activeCoupon?.code === c.code ? "none" : "1px dashed #cbd5e1",
                                            backgroundColor: activeCoupon?.code === c.code ? "#011D52" : "#ffffff",
                                            color: activeCoupon?.code === c.code ? "#ffffff" : "#64748b",
                                            cursor: existingDraft ? "not-allowed" : "pointer",
                                            opacity: existingDraft ? 0.5 : 1,
                                            whiteSpace: "nowrap",
                                            boxShadow: activeCoupon?.code === c.code ? "0 4px 10px rgba(1, 29, 82, 0.2)" : "none",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        {activeCoupon?.code === c.code && <span style={{ marginRight: "6px" }}>✓</span>}
                                        {c.code}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Plans Grid */}
                    <div className="row">
                        {plans.map((plan) => {
                            const isCurrentPlanSelected = selectedPlan?._id === plan._id;
                            const displayDuration = isCurrentPlanSelected ? selectedDuration : plan.durations?.[0];
                            const isBestValue = plan.featured;

                            return (
                                <div key={plan._id} className="col-md-6 mb-4">
                                    <div 
                                        onClick={() => handlePlanSelect(plan)}
                                        style={{
                                            padding: "16px",
                                            borderRadius: "16px",
                                            backgroundColor: "#ffffff",
                                            border: isCurrentPlanSelected ? "2px solid #011D52" : "1px solid #e2e8f0",
                                            boxShadow: isCurrentPlanSelected ? "0 10px 25px rgba(1, 29, 82, 0.1)" : "0 4px 12px rgba(0,0,0,0.02)",
                                            cursor: "pointer",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            position: "relative",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        {isBestValue && (
                                            <div style={{ position: "absolute", top: "-10px", right: "16px", backgroundColor: "#011D52", color: "#ffffff", fontSize: "10px", fontWeight: "800", padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 4px 10px rgba(1, 29, 82, 0.3)" }}>
                                                Recommended
                                            </div>
                                        )}

                                        <h3 style={{ fontSize: "18px", color: "#011D52", fontWeight: "800", marginBottom: "8px" }}>{plan.name}</h3>

                                        <div style={{ marginBottom: "12px", display: "flex", alignItems: "baseline", gap: "4px" }}>
                                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#1B2B40" }}>₹</span>
                                            <span style={{ fontSize: "28px", fontWeight: "900", color: "#011D52", lineHeight: "1" }}>
                                                {(Number(displayDuration?.price) || 0).toLocaleString('en-IN')}
                                            </span>
                                            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginLeft: "4px" }}>
                                                / {displayDuration?.duration || 'Start'}
                                            </span>
                                        </div>

                                        {plan.tagline && (
                                            <div style={{
                                                borderLeft: '3px solid #84cc16',
                                                paddingLeft: '10px',
                                                marginBottom: '16px',
                                                color: '#64748b',
                                                fontSize: '11px',
                                                lineHeight: '1.4',
                                                textAlign: 'left'
                                            }}>
                                                {plan.tagline}
                                            </div>
                                        )}

                                        {/* Durations Toggle */}
                                        <div style={{ display: "flex", backgroundColor: "#f1f5f9", borderRadius: "8px", padding: "4px", marginBottom: "16px", gap: "4px" }}>
                                            {plan.durations?.map((d) => {
                                                const isSelected = isCurrentPlanSelected && selectedDuration?._id === d._id;
                                                return (
                                                    <button
                                                        key={d._id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedPlan(plan);
                                                            setSelectedDuration(d);
                                                        }}
                                                        style={{
                                                            flex: 1,
                                                            padding: "8px 0",
                                                            borderRadius: "6px",
                                                            border: "none",
                                                            fontSize: "11px",
                                                            fontWeight: "700",
                                                            backgroundColor: isSelected ? "#ffffff" : "transparent",
                                                            color: isSelected ? "#011D52" : "#64748b",
                                                            boxShadow: isSelected ? "0 2px 5px rgba(0,0,0,0.05)" : "none",
                                                            transition: "all 0.2s"
                                                        }}
                                                    >
                                                        {d.duration}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", flex: 1 }}>
                                            <p style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Inclusions</p>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                {displayDuration?.features?.map((f, fi) => (
                                                    <div key={fi} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        {f.svg_icon === 'Premium' ? (
                                                            <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "rgba(245, 158, 11, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontSize: "10px", fontWeight: "bold" }}>★</div>
                                                        ) : f.svg_icon === '✖' ? (
                                                            <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}>✖</div>
                                                        ) : (
                                                            <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "rgba(40, 199, 111, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a", fontSize: "10px", fontWeight: "bold" }}>✔</div>
                                                        )}
                                                        <span style={{ fontSize: "12px", color: f.svg_icon === '✖' ? "#94a3b8" : "#1B2B40", fontWeight: f.svg_icon === '✖' ? "400" : "600", textDecoration: f.svg_icon === '✖' ? 'line-through' : 'none' }}>{f.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>

                {/* Right Side: Summary Terminal */}
                <div className="col-lg-4 mb-4">
                    <div style={{ position: "sticky", top: "24px", padding: "24px", borderRadius: "16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", boxShadow: "0 8px 20px rgba(0,0,0,0.03)" }}>
                        <h3 style={{ fontSize: "14px", color: "#011D52", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ width: "6px", height: "6px", backgroundColor: "#011D52", borderRadius: "50%" }}></span>
                            Summary Terminal
                        </h3>

                        <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Active Plan</span>
                                <span style={{ fontSize: "13px", color: "#1B2B40", fontWeight: "800" }}>{selectedPlan?.name || 'None'}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Duration</span>
                                <span style={{ fontSize: "13px", color: "#1B2B40", fontWeight: "800" }}>{selectedDuration?.duration || 'None'}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Applied Promo</span>
                                {existingDraft?.status === 'payment_pending' ? (
                                    <span style={{ fontSize: "10px", fontWeight: "800", color: "#d97706", textTransform: "uppercase", backgroundColor: "rgba(245, 158, 11, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>Reviewing</span>
                                ) : activeCoupon ? (
                                    <span style={{ fontSize: "10px", fontWeight: "800", color: "#16a34a", textTransform: "uppercase", backgroundColor: "rgba(40,199,111,0.1)", padding: "2px 6px", borderRadius: "4px" }}>{activeCoupon.code}</span>
                                ) : null}
                            </div>
                            {!activeCoupon && !existingDraft && <span style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>No promo code applied</span>}
                            {activeCoupon && <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "600" }}>{couponMsg.text}</span>}
                        </div>

                        <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "20px", marginBottom: "24px" }}>
                            {savings > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "700" }}>Total Savings</span>
                                    <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "700" }}>-₹{savings.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                <span style={{ fontSize: "14px", color: "#011D52", fontWeight: "800" }}>Net Total</span>
                                <span style={{ fontSize: "32px", color: "#011D52", fontWeight: "900", lineHeight: "1" }}>₹{finalPrice}</span>
                            </div>
                        </div>

                        {!isKycComplete && (
                            <div style={{ marginBottom: "16px", padding: "10px", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                <span style={{ fontSize: "14px" }}>⚠️</span>
                                <span style={{ fontSize: "11px", color: "#b91c1c", fontWeight: "600", lineHeight: "1.4" }}>
                                    Skipping KYC for now. Proceeding to direct payments. Agreement will be pending.
                                </span>
                            </div>
                        )}

                        {!isKycComplete ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <button 
                                    onClick={() => navigate('/portal/profile')}
                                    style={{ 
                                        width: "100%", 
                                        padding: "16px", 
                                        backgroundColor: "#011D52", 
                                        color: "#ffffff", 
                                        border: "none", 
                                        borderRadius: "12px", 
                                        fontSize: "14px", 
                                        fontWeight: "800", 
                                        textTransform: "uppercase", 
                                        letterSpacing: "1px", 
                                        cursor: "pointer", 
                                        boxShadow: "0 6px 16px rgba(1, 29, 82, 0.25)",
                                        transition: "all 0.2s ease"
                                    }}>
                                    Do KYC First
                                </button>
                                <button 
                                    onClick={handleProceedToSettlement}
                                    disabled={isProcessing || existingDraft?.status === 'payment_pending'}
                                    style={{ 
                                        width: "100%", 
                                        padding: "16px", 
                                        backgroundColor: "transparent", 
                                        color: existingDraft?.status === 'payment_pending' ? "#64748b" : "#011D52", 
                                        border: "2px solid", 
                                        borderColor: existingDraft?.status === 'payment_pending' ? "#cbd5e1" : "#011D52", 
                                        borderRadius: "12px", 
                                        fontSize: "14px", 
                                        fontWeight: "800", 
                                        textTransform: "uppercase", 
                                        letterSpacing: "1px", 
                                        cursor: (isProcessing || existingDraft?.status === 'payment_pending') ? "not-allowed" : "pointer", 
                                        transition: "all 0.2s ease"
                                    }}>
                                    {isProcessing ? 'Processing...' : 'Skip KYC & Do Payment'}
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={handleProceedToSettlement}
                                disabled={isProcessing || existingDraft?.status === 'payment_pending'}
                                style={{ 
                                    width: "100%", 
                                    padding: "16px", 
                                    backgroundColor: existingDraft?.status === 'payment_pending' ? "#cbd5e1" : "#011D52", 
                                    color: existingDraft?.status === 'payment_pending' ? "#64748b" : "#ffffff", 
                                    border: "none", 
                                    borderRadius: "12px", 
                                    fontSize: "14px", 
                                    fontWeight: "800", 
                                    textTransform: "uppercase", 
                                    letterSpacing: "1px", 
                                    cursor: (isProcessing || existingDraft?.status === 'payment_pending') ? "not-allowed" : "pointer", 
                                    boxShadow: existingDraft?.status === 'payment_pending' ? "none" : "0 6px 16px rgba(1, 29, 82, 0.25)",
                                    transition: "all 0.2s ease"
                                }}>
                                {isProcessing ? 'Processing...' : (
                                    existingDraft?.status === 'payment_pending' ? 'Payment Under Review' :
                                        (existingDraft?.status === 'signed' ? 'Proceed to Payment' :
                                        (existingDraft?.status === 'esign_pending' ?
                                                (existingDraft.try_count >= 3 ? 'Contact Admin (Max)' : 'Resume E-Sign')
                                                : 'Proceed to Payment'))
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <AgreementModal
                isOpen={isAgreementOpen}
                onClose={() => setIsAgreementOpen(false)}
                onAccept={handleAgreementAccept}
                selectedPlan={selectedPlan}
                selectedDuration={selectedDuration}
                user={user}
                agreementNo={agreementNo}
                invoiceNo={invoiceNo}
                aadhaarNumber={aadhaarNumber}
                panNumber={panNumber}
                planAmount={finalPrice}
                kycData={kycData}
            />

            <PaymentMethodModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSelect={handlePaymentMethodSelect}
                finalPrice={finalPrice}
            />

            <ManualPaymentModal
                isOpen={isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                finalPrice={finalPrice}
                selectedPlan={selectedPlan}
                selectedDuration={selectedDuration}
            />
        </div>
    );
};

export default Plans;
