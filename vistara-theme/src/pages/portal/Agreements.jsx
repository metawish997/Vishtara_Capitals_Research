import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import agreementService from "../../services/agreementService";
import kycService from "../../services/kycService";
import toast from "react-hot-toast";
import AgreementModal from "./AgreementModal";

export default function Agreements() {
    const navigate = useNavigate();
    const location = useLocation();
    const [agreements, setAgreements] = useState([]);
    const [fetchingData, setFetchingData] = useState(true);
    const [isKycComplete, setIsKycComplete] = useState(false);

    // E-Sign from Agreements flow
    const [pendingEsignAgreement, setPendingEsignAgreement] = useState(null); 
    const [isEsignModalOpen, setIsEsignModalOpen] = useState(false);
    const [isEsignProcessing, setIsEsignProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch KYC and Agreements
                const [kycRes, accRes] = await Promise.all([
                    kycService.getFullDetails(),
                    agreementService.getAccountServices()
                ]);

                if (kycRes.success) {
                    // Similar logic to profile
                    const status = kycRes.data?.status || kycRes.kyc?.status || '';
                    setIsKycComplete(['approved', 'verified', 'completed', 'success'].includes(status.toLowerCase()));
                }

                if (accRes.success) {
                    setAgreements(accRes.agreements || []);
                }
            } catch (err) {
                console.error("Failed to load agreements:", err);
            } finally {
                setFetchingData(false);
            }
        };
        fetchData();
    }, []);

    // ── Digio redirect handler ─────────────────────────────────────────────────
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const digioStatus = params.get('status');
        const digioDocId = params.get('digio_doc_id');

        if (digioStatus === 'success' && digioDocId && agreements.length > 0) {
            const matchingAgreement = agreements.find(
                a => a.is_user_agreement && a.digio_document_id === digioDocId
            );

            if (matchingAgreement) {
                const handleDigioReturn = async () => {
                    const toastId = toast.loading(`Processing e-sign for ${matchingAgreement.agreement_number}...`);
                    try {
                        const res = await agreementService.checkUserAgreementEsignStatus(matchingAgreement._id);
                        toast.dismiss(toastId);

                        if (res.success && res.status === 'signed') {
                            toast.success(`✅ ${matchingAgreement.agreement_number} — E-Sign completed! Agreement is now active.`, { duration: 5000 });
                        } else {
                            toast(res.message || 'E-sign status updated.', { icon: 'ℹ️' });
                        }

                        // Refresh agreements list
                        const refreshed = await agreementService.getAccountServices();
                        if (refreshed.success) {
                            setAgreements(refreshed.agreements || []);
                        }

                        // Clean up URL
                        window.history.replaceState({}, '', '/portal/agreements');

                    } catch (err) {
                        toast.dismiss(toastId);
                        console.error('Digio return handling failed:', err);
                        toast.error('Could not update agreement status. Please refresh.');
                    }
                };

                handleDigioReturn();
            }
        }
    }, [location.search, agreements.length]);

    const getAgreementStatusBadge = (agr) => {
        if (agr.is_draft) {
            if (agr.status === 'kyc_pending') return { label: 'KYC Pending', bg: '#fef3c7', color: '#d97706' };
            if (agr.status === 'esign_pending') return { label: 'E-Sign Pending', bg: '#fee2e2', color: '#dc2626' };
            if (agr.status === 'signed') return { label: 'Active', bg: '#dcfce7', color: '#16a34a' };
            return { label: 'Draft', bg: '#f1f5f9', color: '#64748b' };
        }
        if (agr.status === 'active') return { label: 'Active', bg: '#dcfce7', color: '#16a34a' };
        if (agr.status === 'expired') return { label: 'Expired', bg: '#f1f5f9', color: '#64748b' };
        if (agr.status === 'terminated') return { label: 'Terminated', bg: '#fee2e2', color: '#dc2626' };
        return { label: agr.status || 'Unknown', bg: '#f1f5f9', color: '#64748b' };
    };

    const handleOpenEsignForAgreement = (agr) => {
        if (!isKycComplete) {
            toast.error('Please complete your KYC first before e-signing.');
            return;
        }
        setPendingEsignAgreement(agr);
        if (agr.is_user_agreement) {
            handleUserAgreementEsign(agr);
        } else {
            setIsEsignModalOpen(true);
        }
    };

    const handleUserAgreementEsign = async (agr) => {
        setIsEsignProcessing(true);
        try {
            toast.loading('Preparing your agreement for e-sign...', { id: 'esign-loading' });
            const res = await agreementService.completeUserAgreementEsign(agr._id);
            toast.dismiss('esign-loading');
            if (res.success && res.redirect_url) {
                toast.success('Redirecting to E-Sign Gateway...');
                window.location.href = res.redirect_url;
            } else {
                toast.error(res.message || 'Failed to initiate e-sign.');
            }
        } catch (error) {
            toast.dismiss('esign-loading');
            console.error('UserAgreement E-Sign error:', error);
            toast.error(error.message || 'Something went wrong during e-sign.');
        } finally {
            setIsEsignProcessing(false);
        }
    };

    const handleProfileEsignAccept = async () => {
        if (!pendingEsignAgreement) return;
        setIsEsignProcessing(true);
        try {
            const payload = {
                plan_id: pendingEsignAgreement.plan_id,
                duration_id: pendingEsignAgreement.duration_id,
                plan_name: pendingEsignAgreement.plan_name,
                duration: pendingEsignAgreement.duration,
                features: pendingEsignAgreement.features || [],
                planAmount: String(pendingEsignAgreement.amount),
                coupon_code: null,
                current_url: window.location.href
            };
            const res = await agreementService.storeDraftAgreement(payload);
            if (res.success && res.redirect_url && res.status === 'esign_pending') {
                toast.success('Redirecting to E-Sign Gateway...');
                setIsEsignModalOpen(false);
                window.location.href = res.redirect_url;
            } else if (res.success && res.status === 'signed') {
                toast.success('Agreement signed!');
                setIsEsignModalOpen(false);
                const refreshed = await agreementService.getAccountServices();
                if (refreshed.success) {
                    setAgreements(refreshed.agreements || []);
                }
            } else {
                toast.error(res.message || 'Failed to initiate e-sign.');
            }
        } catch (error) {
            console.error("Draft E-sign error:", error);
            toast.error(error.message || 'Error processing agreement');
        } finally {
            setIsEsignProcessing(false);
        }
    };

    const handleViewPdfAndVerify = async (agr) => {
        if (!agr.digio_document_id) {
            const pdfUrl = agr.pdf_path?.startsWith('http') ? agr.pdf_path : `http://localhost:5001${agr.pdf_path}`;
            window.open(pdfUrl, '_blank');
            return;
        }

        try {
            toast.loading("Verifying document status...", { id: 'verifyPdf' });
            const res = await agreementService.checkUserAgreementEsignStatusStrict(agr.digio_document_id);

            if (res.status === 'signed' && res.pdf_path) {
                toast.dismiss('verifyPdf');
                const pdfUrl = res.pdf_path.startsWith('http') ? res.pdf_path : `http://localhost:5001${res.pdf_path}`;
                window.open(pdfUrl, '_blank');
            } else {
                toast.error("Document not signed on Digio. Please sign again.", { id: 'verifyPdf' });
                // If not signed, they can use the e-sign button
                const refreshed = await agreementService.getAccountServices();
                if (refreshed.success) {
                    setAgreements(refreshed.agreements || []);
                }
            }
        } catch (error) {
            toast.error(error.message || "Failed to verify document.", { id: 'verifyPdf' });
        }
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#1b2c42", paddingBottom: "40px", maxWidth: "1000px", margin: "0 auto" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ color: "#011D52", fontWeight: "800", fontSize: "24px", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>All Agreements</h2>
                    <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>View and manage your active, pending, and past agreements.</p>
                </div>
                <button
                    onClick={() => navigate('/portal/profile')}
                    style={{ padding: "8px 16px", backgroundColor: "#f1f5f9", color: "#011D52", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
                >
                    &larr; Back to Profile
                </button>
            </div>

            <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                {fetchingData ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>Loading agreements...</div>
                ) : agreements && agreements.length > 0 ? (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f8fafc", textAlign: "left" }}>
                                    <th style={{ padding: "12px 16px", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "700" }}>Agreement #</th>
                                    <th style={{ padding: "12px 16px", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "700" }}>Plan</th>
                                    <th style={{ padding: "12px 16px", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "700" }}>Date</th>
                                    <th style={{ padding: "12px 16px", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "700" }}>Status</th>
                                    <th style={{ padding: "12px 16px", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "700", textAlign: "center" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agreements.map((agr, idx) => {
                                    const badge = getAgreementStatusBadge(agr);
                                    const needsEsign = agr.needs_esign
                                        || (agr.is_draft && (agr.status === 'esign_pending' || agr.status === 'kyc_pending') && !agr.pdf_path);
                                    const canEsign = needsEsign && isKycComplete;

                                    return (
                                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "16px", color: "#0f172a", fontWeight: "600" }}>{agr.agreement_number || '-'}</td>
                                            <td style={{ padding: "16px", color: "#64748b" }}>{agr.plan_name || '-'}</td>
                                            <td style={{ padding: "16px", color: "#64748b" }}>{new Date(agr.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: "16px" }}>
                                                <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", backgroundColor: badge.bg, color: badge.color, textTransform: "uppercase" }}>
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: "16px", textAlign: "center" }}>
                                                {agr.pdf_path ? (
                                                    <button onClick={() => handleViewPdfAndVerify(agr)}
                                                        style={{ color: "#ffffff", backgroundColor: "#2B4365", padding: "6px 12px", borderRadius: "6px", fontWeight: "700", border: "none", fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}>
                                                        View PDF
                                                    </button>
                                                ) : canEsign ? (
                                                    <button
                                                        onClick={() => handleOpenEsignForAgreement(agr)}
                                                        disabled={isEsignProcessing}
                                                        style={{ padding: "6px 12px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 2px 6px rgba(220,38,38,0.3)" }}>
                                                        ✍️ Complete E-Sign
                                                    </button>
                                                ) : needsEsign && !isKycComplete ? (
                                                    <button
                                                        onClick={() => navigate('/portal/kyc')}
                                                        style={{ padding: "6px 12px", backgroundColor: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", cursor: "pointer" }}>
                                                        Complete KYC First
                                                    </button>
                                                ) : (
                                                    <span style={{ color: "#94a3b8", fontSize: "11px", fontStyle: "italic" }}>No action needed</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: "40px", borderRadius: "8px", backgroundColor: "#f8fafc", border: "1px dashed #cbd5e1", textAlign: "center" }}>
                        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>No agreements available.</p>
                    </div>
                )}
            </div>

            {/* Agreement Terms Modal */}
            <AgreementModal
                isOpen={isEsignModalOpen}
                onClose={() => setIsEsignModalOpen(false)}
                onAccept={handleProfileEsignAccept}
                planDetails={pendingEsignAgreement ? {
                    plan_name: pendingEsignAgreement.plan_name,
                    duration: pendingEsignAgreement.duration,
                    planAmount: pendingEsignAgreement.amount,
                    features: pendingEsignAgreement.features || []
                } : null}
                isLoading={isEsignProcessing}
            />
        </div>
    );
}
