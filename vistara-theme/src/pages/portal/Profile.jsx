import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from 'react-hot-toast';
import api, { BASE_URL } from "../../services/api";
import agreementService from "../../services/agreementService";
import kycService from "../../services/kycService";
import AgreementModal from "./AgreementModal";

export default function Profile() {
    const { user, updateProfile, sendUpdateOtp, verifyUpdateContact, forgotPassword, resetPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Local states for forms
    const [formData, setFormData] = useState({
        name: user?.name || '',
        father_name: user?.father_name || '',
        dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        gender: user?.gender || 'male',
        email: user?.email || '',
        phone: user?.phone || '',
        city: user?.city || '',
        state: user?.state || '',
        pincode: user?.pincode || '',
        address: user?.address || '',
        image: user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`
    });

    const [imageUrl, setImageUrl] = useState(formData.image);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [accountData, setAccountData] = useState({ subscriptions: [], pending_payments: [], invoices: [], agreements: [] });
    const [fetchingData, setFetchingData] = useState(true);

    // E-Sign from Profile flow
    const [kycData, setKycData] = useState(null);
    const [pendingEsignAgreement, setPendingEsignAgreement] = useState(null); // the draft agr being re-esigned
    const [isEsignModalOpen, setIsEsignModalOpen] = useState(false);
    const [isEsignProcessing, setIsEsignProcessing] = useState(false);

    useEffect(() => {
        const fetchAccountServices = async () => {
            try {
                const res = await agreementService.getAccountServices();
                if (res.success) {
                    setAccountData({
                        subscriptions: res.subscriptions || [],
                        pending_payments: res.pending_payments || [],
                        invoices: res.invoices || [],
                        agreements: res.agreements || []
                    });
                }
            } catch (err) {
                console.error("Failed to load account data:", err);
            } finally {
                setFetchingData(false);
            }
        };

        const fetchKyc = async () => {
            try {
                const kycRes = await kycService.getFullDetails();
                if (kycRes.success) setKycData(kycRes.kyc);
            } catch (err) {
                console.error("KYC fetch failed:", err);
            }
        };

        fetchAccountServices();
        fetchKyc();
    }, []);

    // ── Digio redirect handler ─────────────────────────────────────────────────
    // When Digio redirects back: ?status=success&digio_doc_id=DID...&message=...
    // We detect this, find the matching UserAgreement, poll Digio & update the DB
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const digioStatus = params.get('status');
        const digioDocId = params.get('digio_doc_id');

        if (digioStatus === 'success' && digioDocId && accountData.agreements.length > 0) {
            // Find the UserAgreement that matches this digio_document_id
            const matchingAgreement = accountData.agreements.find(
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
                            setAccountData(prev => ({ ...prev, agreements: refreshed.agreements || [] }));
                        }

                        // Clean up URL (remove Digio params without full reload)
                        window.history.replaceState({}, '', '/portal/profile');

                    } catch (err) {
                        toast.dismiss(toastId);
                        console.error('Digio return handling failed:', err);
                        toast.error('Could not update agreement status. Please refresh.');
                    }
                };

                handleDigioReturn();
            }
        }
    }, [location.search, accountData.agreements.length]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                father_name: user.father_name || '',
                dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                gender: user.gender || 'male',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || '',
                state: user.state || '',
                pincode: user.pincode || '',
                address: user.address || '',
                image: user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
            });
            setImageUrl(user.image ? (user.image.startsWith('http') ? user.image : `${BASE_URL}${user.image}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`);
        }
    }, [user]);

    const PHONE_CHANGE_LIMIT = 2;
    const phoneChangesRemaining = Math.max(0, PHONE_CHANGE_LIMIT - (user?.phone_change_count || 0));

    // Modals state
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [modal, setModal] = useState({
        open: false,
        type: '',
        step: 1,
        title: '',
        subtitle: '',
        targetValue: '',
        otpCode: ''
    });
    const [otpError, setOtpError] = useState('');

    const [passwordResetModal, setPasswordResetModal] = useState({
        open: false,
        step: 1,
        type: 'email',
        otp: '',
        newPassword: ''
    });
    const [passwordResetError, setPasswordResetError] = useState('');

    const kycStatus = user?.kyc_status || 'none';
    const isKycComplete = ['approved', 'verified', 'completed', 'success'].includes(kycStatus.toLowerCase())
        || (kycData?.status && ['approved', 'completed', 'success'].includes(kycData.status.toLowerCase()));

    // --- Profile E-Sign Handler ---
    const handleOpenEsignForAgreement = (agr) => {
        if (!isKycComplete) {
            toast.error('Please complete your KYC first before e-signing.');
            return;
        }
        setPendingEsignAgreement(agr);
        // UserAgreements (payment done, just need e-sign) don't need the modal preview
        // They go directly to Digio — skip the agreement review modal for them
        if (agr.is_user_agreement) {
            handleUserAgreementEsign(agr);
        } else {
            setIsEsignModalOpen(true);
        }
    };

    // For UserAgreements (payment already done): directly call backend → redirect to Digio
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

    // For DraftAgreements (KYC skip flow): open modal first, then storeDraftAgreement
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
                navigate('/portal/plans');
            } else {
                toast.error(res.message || 'Failed to initiate e-sign.');
                setIsEsignModalOpen(false);
            }
        } catch (error) {
            console.error('Profile E-Sign error:', error);
            toast.error(error.message || 'Something went wrong during e-sign.');
            setIsEsignModalOpen(false);
        } finally {
            setIsEsignProcessing(false);
        }
    };

    const getAgreementStatusBadge = (agr) => {
        if (!agr.is_draft && !agr.is_user_agreement) {
            return { label: 'Finalized', color: '#16a34a', bg: 'rgba(40,199,111,0.1)' };
        }
        if (agr.status === 'Finalized') {
            return { label: 'Finalized', color: '#16a34a', bg: 'rgba(40,199,111,0.1)' };
        }
        if (agr.pdf_path) {
            return { label: 'Signed', color: '#16a34a', bg: 'rgba(40,199,111,0.1)' };
        }
        if (agr.status === 'payment_pending') {
            return { label: 'Payment Review', color: '#d97706', bg: 'rgba(245,158,11,0.1)' };
        }
        if (agr.status === 'esign_required' || agr.needs_esign) {
            return { label: 'E-Sign Pending', color: '#dc2626', bg: 'rgba(239,68,68,0.1)' };
        }
        if (agr.status === 'kyc_pending') {
            return { label: 'KYC Pending', color: '#dc2626', bg: 'rgba(239,68,68,0.1)' };
        }
        if (agr.status === 'esign_pending') {
            return { label: 'E-Sign Pending', color: '#dc2626', bg: 'rgba(239,68,68,0.1)' };
        }
        if (agr.status === 'signed') {
            return { label: 'Signed', color: '#16a34a', bg: 'rgba(40,199,111,0.1)' };
        }
        return { label: agr.status || 'Pending', color: '#64748b', bg: '#f1f5f9' };
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImageUrl(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('father_name', formData.father_name);
            data.append('dob', formData.dob);
            data.append('gender', formData.gender);
            data.append('city', formData.city);
            data.append('state', formData.state);
            data.append('pincode', formData.pincode);
            data.append('address', formData.address);
            if (imageFile) {
                data.append('profile_image', imageFile);
            }

            await updateProfile(data);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (deleteConfirmText !== "DELETE") return;
        setIsDeleting(true);
        try {
            const res = await api.delete('/users/delete-account');
            if (res.data.success) {
                toast.success('Account deleted successfully');
                localStorage.removeItem('bsmr_token');
                localStorage.removeItem('bsmr_user');
                navigate('/login');
                window.location.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete account');
            setShowDeleteModal(false);
            setDeleteConfirmText('');
        } finally {
            setIsDeleting(false);
        }
    };

    const initPasswordReset = () => {
        setPasswordResetError('');
        setPasswordResetModal({
            open: true,
            step: 1,
            type: 'email',
            otp: '',
            newPassword: ''
        });
    };

    const handleSendPasswordResetOtp = async () => {
        setLoading(true);
        setPasswordResetError('');
        try {
            const identifier = passwordResetModal.type === 'email' ? user?.email : user?.phone;
            if (!identifier) {
                setPasswordResetError(`No ${passwordResetModal.type} associated with this account.`);
                setLoading(false);
                return;
            }
            await forgotPassword({ identifier, type: passwordResetModal.type });
            setPasswordResetModal(prev => ({ ...prev, step: 2 }));
            toast.success(`OTP sent to your ${passwordResetModal.type}`);
        } catch (error) {
            setPasswordResetError(error.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordResetSubmit = async () => {
        if (!passwordResetModal.otp || !passwordResetModal.newPassword) {
            setPasswordResetError("Please provide both OTP and a new password.");
            return;
        }
        setLoading(true);
        setPasswordResetError('');
        try {
            const identifier = passwordResetModal.type === 'email' ? user?.email : user?.phone;
            await resetPassword({
                identifier,
                type: passwordResetModal.type,
                otp: passwordResetModal.otp,
                newPassword: passwordResetModal.newPassword
            });
            toast.success("Password updated successfully!");
            setPasswordResetModal(prev => ({ ...prev, open: false }));
        } catch (error) {
            setPasswordResetError(error.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    const initUpdateModal = (type) => {
        if (type === 'phone' && phoneChangesRemaining <= 0) {
            toast.error('Maximum phone number change limit reached.');
            return;
        }
        setOtpError('');
        setModal({
            open: true,
            type: type,
            step: 1,
            title: type === 'email' ? 'Change Email' : 'Update Phone',
            subtitle: 'Enter your new contact details to receive OTP',
            targetValue: '',
            otpCode: ''
        });
    };

    const sendOtpRequest = async () => {
        if (modal.type === 'phone' && (user.phone_change_count || 0) >= 2) {
            setOtpError('Maximum phone number change limit reached.');
            return;
        }

        setLoading(true);
        setOtpError('');
        try {
            await sendUpdateOtp({ type: modal.type, value: modal.targetValue });
            setModal(prev => ({
                ...prev,
                step: 2,
                subtitle: 'OTP sent successfully to ' + modal.targetValue
            }));
        } catch (error) {
            setOtpError(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtpRequest = async () => {
        setLoading(true);
        setOtpError('');
        try {
            await verifyUpdateContact({
                type: modal.type,
                value: modal.targetValue,
                otp: modal.otpCode
            });
            setModal(prev => ({ ...prev, open: false }));
            toast.success(modal.type.charAt(0).toUpperCase() + modal.type.slice(1) + ' updated successfully!');
            setFormData(prev => ({ ...prev, [modal.type]: modal.targetValue }));
        } catch (error) {
            setOtpError(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#1b2c42", paddingBottom: "40px" }}>
            <div className="mb-4">
                <h2 style={{ color: "#011D52", fontWeight: "800", fontSize: "24px", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>Client Profile</h2>
                <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>Manage your personal details, subscription configurations, and account security.</p>
            </div>

            <div className="row">

                {/* Personal Details Form */}
                <div className="col-lg-8 mb-4">
                    <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 style={{ fontSize: "18px", color: "#011D52", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "4px", height: "16px", backgroundColor: "#2B4365", borderRadius: "2px" }}></span>
                                Personal Details
                            </h3>
                        </div>

                        <form onSubmit={handleUpdate}>

                            {/* Image Upload Section */}
                            <div className="d-flex align-items-center gap-4 mb-4">
                                <div className="position-relative" style={{ width: "80px", height: "80px" }}>
                                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", padding: "4px", border: "2px dashed #011D52", overflow: "hidden" }}>
                                        <img src={imageUrl} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                                    </div>
                                    <label className="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center cursor-pointer shadow-sm" style={{ width: "24px", height: "24px", backgroundColor: "#2B4365", borderRadius: "50%", color: "white", border: "2px solid white", right: "-4px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                        </svg>
                                        <input type="file" className="d-none" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700", color: "#1B2B40" }}>Profile Photo</p>
                                    <p style={{ margin: 0, fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>Accepts JPG, PNG or GIF</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "13px", color: "#1B2B40", fontWeight: "600", outline: "none" }}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Father's Name</label>
                                    <input
                                        type="text"
                                        value={formData.father_name}
                                        onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "13px", color: "#1B2B40", fontWeight: "600", outline: "none" }}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "13px", color: "#1B2B40", fontWeight: "600", outline: "none" }}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        style={{ width: "100%", padding: "14px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "13px", color: "#1B2B40", fontWeight: "600", outline: "none" }}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</label>
                                    <div className="position-relative">
                                        <input
                                            type="email"
                                            disabled
                                            value={formData.email}
                                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed", fontWeight: "600" }}
                                        />
                                        <button type="button" onClick={() => initUpdateModal('email')}
                                            className="position-absolute border-0"
                                            style={{ right: "6px", top: "50%", transform: "translateY(-50%)", padding: "4px 8px", backgroundColor: "rgba(1, 29, 82, 0.1)", color: "#011D52", borderRadius: "6px", fontSize: "10px", fontWeight: "700" }}>
                                            Change
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                        Phone Number
                                        <span style={{ fontSize: "9px", color: phoneChangesRemaining > 0 ? "#16a34a" : "#dc2626" }}>({phoneChangesRemaining} / 2 changes left)</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            disabled
                                            value={formData.phone}
                                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed", fontWeight: "600" }}
                                        />
                                        <button type="button" onClick={() => initUpdateModal('phone')}
                                            className="position-absolute border-0"
                                            style={{ right: "6px", top: "50%", transform: "translateY(-50%)", padding: "4px 8px", backgroundColor: "rgba(1, 29, 82, 0.1)", color: "#011D52", borderRadius: "6px", fontSize: "10px", fontWeight: "700" }}>
                                            Change
                                        </button>
                                    </div>
                                </div>

                                {/* Address Fields */}
                                <div className="col-md-12 mb-3">
                                    <hr style={{ borderColor: "#e2e8f0", margin: "16px 0" }} />
                                    <h4 style={{ fontSize: "14px", color: "#011D52", fontWeight: "700", marginBottom: "16px" }}>Address Details</h4>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>City</label>
                                    <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "13px", color: "#1B2B40", fontWeight: "600", outline: "none" }} />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>State</label>
                                    <input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "13px", color: "#1B2B40", fontWeight: "600", outline: "none" }} />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pincode</label>
                                    <input type="text" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "13px", color: "#1B2B40", fontWeight: "600", outline: "none" }} />
                                </div>
                                <div className="col-md-12 mb-4">
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Address</label>
                                    <textarea rows="3" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "13px", color: "#1B2B40", fontWeight: "600", outline: "none", resize: "none" }}></textarea>
                                </div>

                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{ padding: "12px 28px", fontSize: "13px", fontWeight: "700", backgroundColor: "#2B4365", color: "#ffffff", border: "none", borderRadius: "8px", textTransform: "uppercase", letterSpacing: "0.5px", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 10px rgba(1, 29, 82, 0.2)", opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </div>



                    {/* Payment History / Invoices (Moved here) */}
                    <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", marginTop: "24px" }}>
                        <h3 style={{ fontSize: "18px", color: "#011D52", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ width: "4px", height: "16px", backgroundColor: "#2B4365", borderRadius: "2px" }}></span>
                            Payment History
                        </h3>
                        {fetchingData ? (
                            <div style={{ textAlign: "center", padding: "20px" }}>Loading account details...</div>
                        ) : accountData.invoices && accountData.invoices.length > 0 ? (
                            <div style={{ overflowX: "auto", marginBottom: "20px" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#f1f5f9", textAlign: "left" }}>
                                            <th style={{ padding: "8px", borderBottom: "1px solid #cbd5e1" }}>Invoice #</th>
                                            <th style={{ padding: "8px", borderBottom: "1px solid #cbd5e1" }}>Amount</th>
                                            <th style={{ padding: "8px", borderBottom: "1px solid #cbd5e1" }}>Date</th>
                                            <th style={{ padding: "8px", borderBottom: "1px solid #cbd5e1" }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accountData.invoices.map((inv, idx) => (
                                            <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                                <td style={{ padding: "8px", color: "#0f172a" }}>{inv.invoice_number || '-'}</td>
                                                <td style={{ padding: "8px", fontWeight: "700", color: "#011D52" }}>₹{inv.amount}</td>
                                                <td style={{ padding: "8px", color: "#64748b" }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                                                <td style={{ padding: "8px", color: (inv.status === 'paid' || !inv.status) ? "#16a34a" : "#dc2626", fontWeight: "800" }}>{inv.status ? inv.status.toUpperCase() : 'PAID'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#f8fafc", border: "1px dashed #cbd5e1", textAlign: "center" }}>
                                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>No payment history available.</p>
                            </div>
                        )}
                    </div>

                    {/* Client Agreements */}
                    {isKycComplete && (
                        <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", marginTop: "24px" }}>
                            <h3 style={{ fontSize: "18px", color: "#011D52", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "4px", height: "16px", backgroundColor: "#2B4365", borderRadius: "2px" }}></span>
                                Client Agreements
                            </h3>

                            {!isKycComplete && accountData.agreements?.some(a =>
                                (a.needs_esign) || (a.is_draft && (a.status === 'esign_pending' || a.status === 'kyc_pending'))
                            ) && (
                                    <div style={{ marginBottom: "16px", padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                                        <span style={{ fontSize: "16px" }}>⚠️</span>
                                        <div>
                                            <p style={{ margin: "0 0 6px 0", fontSize: "13px", color: "#dc2626", fontWeight: "700" }}>E-Sign Pending — KYC Required</p>
                                            <p style={{ margin: 0, fontSize: "12px", color: "#991b1b", lineHeight: "1.5" }}>You have agreement(s) that need to be e-signed. Please complete your KYC first, then return here to complete the e-sign process.</p>
                                            <button onClick={() => navigate('/portal/kyc')} style={{ marginTop: "8px", padding: "6px 14px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>Complete KYC Now →</button>
                                        </div>
                                    </div>
                                )}

                            {fetchingData ? (
                                <div style={{ textAlign: "center", padding: "20px" }}>Loading agreements...</div>
                            ) : accountData.agreements && accountData.agreements.length > 0 ? (
                                <div style={{ overflowX: "auto", marginBottom: "20px" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                        <thead>
                                            <tr style={{ backgroundColor: "#f1f5f9", textAlign: "left" }}>
                                                <th style={{ padding: "8px", borderBottom: "1px solid #cbd5e1" }}>Agreement #</th>
                                                <th style={{ padding: "8px", borderBottom: "1px solid #cbd5e1" }}>Plan</th>
                                                <th style={{ padding: "8px", borderBottom: "1px solid #cbd5e1" }}>Date</th>
                                                <th style={{ padding: "8px", borderBottom: "1px solid #cbd5e1" }}>Status</th>
                                                <th style={{ padding: "8px", borderBottom: "1px solid #cbd5e1", textAlign: "center" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accountData.agreements.map((agr, idx) => {
                                                const badge = getAgreementStatusBadge(agr);
                                                // needsEsign:
                                                // - UserAgreement: needs_esign flag = true (payment done, no PDF)
                                                // - DraftAgreement: status esign_pending or kyc_pending and no PDF
                                                const needsEsign = agr.needs_esign
                                                    || (agr.is_draft && (agr.status === 'esign_pending' || agr.status === 'kyc_pending') && !agr.pdf_path);
                                                const canEsign = needsEsign && isKycComplete;
                                                return (
                                                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                                        <td style={{ padding: "8px", color: "#0f172a", fontWeight: "600" }}>{agr.agreement_number || '-'}</td>
                                                        <td style={{ padding: "8px", color: "#64748b" }}>{agr.plan_name || '-'}</td>
                                                        <td style={{ padding: "8px", color: "#64748b" }}>{new Date(agr.createdAt).toLocaleDateString()}</td>
                                                        <td style={{ padding: "8px" }}>
                                                            <span style={{ padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: "800", backgroundColor: badge.bg, color: badge.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                                {badge.label}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "8px", textAlign: "center" }}>
                                                            {agr.pdf_path ? (
                                                                <a href={agr.pdf_path.startsWith('http') ? agr.pdf_path : `http://localhost:5001${agr.pdf_path}`} target="_blank" rel="noreferrer"
                                                                    style={{ color: "#ffffff", backgroundColor: "#2B4365", padding: "6px 12px", borderRadius: "6px", fontWeight: "700", textDecoration: "none", fontSize: "10px", textTransform: "uppercase" }}>
                                                                    View PDF
                                                                </a>
                                                            ) : canEsign ? (
                                                                <button
                                                                    onClick={() => handleOpenEsignForAgreement(agr)}
                                                                    disabled={isEsignProcessing}
                                                                    style={{ padding: "6px 12px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 2px 6px rgba(220,38,38,0.3)", letterSpacing: "0.5px" }}>
                                                                    ✍️ Complete E-Sign
                                                                </button>
                                                            ) : needsEsign && !isKycComplete ? (
                                                                <span style={{ color: "#d97706", fontSize: "10px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
                                                                    🔒 KYC Required
                                                                </span>
                                                            ) : agr.status === 'payment_pending' ? (
                                                                <span style={{ color: "#d97706", fontSize: "11px", fontWeight: "600" }}>Under Review</span>
                                                            ) : (
                                                                <span style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "600" }}>Processing...</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#f8fafc", border: "1px dashed #cbd5e1", textAlign: "center" }}>
                                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>No agreements found.</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Right Sidebar: Security & Subscriptions */}
                <div className="col-lg-4 mb-4">

                    {/* Security Section */}
                    <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "18px", color: "#011D52", fontWeight: "800", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ width: "4px", height: "16px", backgroundColor: "#2B4365", borderRadius: "2px" }}></span>
                            Security
                        </h3>
                        <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px", lineHeight: "1.5" }}>We will send a secure reset link to your registered email address.</p>
                        <button
                            onClick={initPasswordReset}
                            style={{ width: "100%", padding: "10px", background: "white", color: "#011D52", border: "1px solid #011D52", borderRadius: "8px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", cursor: "pointer" }}>
                            Change Password
                        </button>
                    </div>

                    {/* Removed Subscriptions Block from here */}



                    {/* Advisory Subscriptions (Moved to Right Sidebar) */}
                    <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", marginTop: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h3 style={{ fontSize: "18px", color: "#011D52", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "4px", height: "16px", backgroundColor: "#2B4365", borderRadius: "2px" }}></span>
                                Advisory Subscriptions
                            </h3>
                            <button
                                onClick={() => navigate('/portal/plans')}
                                style={{ padding: "6px 12px", backgroundColor: "#2B4365", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", textTransform: "uppercase" }}>
                                + Add Plan
                            </button>
                        </div>
                        {fetchingData ? (
                            <div style={{ textAlign: "center", padding: "20px" }}>Loading details...</div>
                        ) : accountData.subscriptions && accountData.subscriptions.length > 0 ? (
                            accountData.subscriptions.map((sub, index) => (
                                <div key={index} style={{ padding: "20px", borderRadius: "8px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", marginBottom: "20px", flex: 1 }}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                {sub.is_legacy ? 'Legacy Plan' : (sub.type === 'demo' ? 'Demo Segment' : 'Purchased Segment')}
                                            </span>
                                            <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#011D52", margin: "4px 0 0 0" }}>
                                                {sub.service_plan?.name || sub.service_name || "Premium Tier"}
                                            </h4>
                                        </div>
                                        <span style={{ padding: "6px 12px", borderRadius: "30px", fontSize: "10px", fontWeight: "800", backgroundColor: sub.status === 'active' || sub.status === 'approved' ? "rgba(40, 199, 111, 0.15)" : sub.status === 'pending' ? "rgba(245, 158, 11, 0.15)" : "rgba(239, 68, 68, 0.15)", color: sub.status === 'active' || sub.status === 'approved' ? "#16a34a" : sub.status === 'pending' ? "#d97706" : "#dc2626", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                            {sub.status || 'Active'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
                                        {sub.is_legacy ? 'Active legacy subscription.' : (sub.type === 'demo' ? 'You are currently on a trial or demo subscription.' : 'You have an active paid subscription plan for this service.')}
                                        {sub.end_date && (
                                            <div style={{ marginTop: "8px", fontSize: "12px", fontWeight: "600", color: "#011D52" }}>
                                                Valid until: {new Date(sub.end_date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: "20px", borderRadius: "8px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", marginBottom: "20px", flex: 1, textAlign: "center" }}>
                                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>You have no active subscriptions.</p>
                            </div>
                        )}

                        {!isKycComplete && (
                            <div style={{ padding: "16px", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "8px", marginBottom: "20px" }}>
                                <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#dc2626", fontWeight: "600" }}>
                                    ⚠️ KYC Required: Please complete your KYC verification before purchasing any plans.
                                </p>
                                <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                                    <button
                                        onClick={() => navigate('/portal/kyc')}
                                        style={{ width: "100%", padding: "10px 16px", backgroundColor: "#dc2626", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", cursor: "pointer", boxShadow: "0 4px 10px rgba(239, 68, 68, 0.2)" }}>
                                        Complete KYC Now
                                    </button>
                                    <button
                                        onClick={() => navigate('/portal/plans')}
                                        style={{ width: "100%", padding: "10px 16px", backgroundColor: "transparent", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "6px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", cursor: "pointer" }}>
                                        Skip & Purchase First &rarr;
                                    </button>
                                </div>
                            </div>
                        )}

                        <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
                            <strong style={{ color: "#64748b" }}>Compliance Alert:</strong> To modify your subscribed segment or trigger early terminations, please submit a request to the support helpdesk.
                        </div>
                    </div>
                </div>
            </div> {/* End of main row */}

            {/* Danger Zone (Delete Account) */}
            <div className="row mt-5">
                <div className="col-lg-12">
                    <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.3)", backgroundColor: "rgba(239, 68, 68, 0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
                        <div>
                            <h3 style={{ fontSize: "18px", color: "#dc2626", fontWeight: "800", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "20px" }}>⚠️</span> Danger Zone
                            </h3>
                            <p style={{ margin: 0, fontSize: "13px", color: "#991b1b" }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
                        </div>

                        {!showDeleteModal ? (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                style={{ padding: "12px 24px", backgroundColor: "#ef4444", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", cursor: "pointer", boxShadow: "0 4px 10px rgba(239, 68, 68, 0.3)" }}>
                                Delete Account
                            </button>
                        ) : (
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <input
                                    type="text"
                                    placeholder="Type DELETE to confirm"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #fca5a5", fontSize: "13px", width: "200px", outline: "none" }}
                                />
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== "DELETE" || isDeleting}
                                    style={{ padding: "12px 20px", backgroundColor: deleteConfirmText === "DELETE" ? "#dc2626" : "#fca5a5", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", cursor: deleteConfirmText === "DELETE" ? "pointer" : "not-allowed" }}>
                                    {isDeleting ? "Deleting..." : "Confirm"}
                                </button>
                                <button
                                    onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
                                    style={{ padding: "12px 20px", backgroundColor: "transparent", color: "#991b1b", border: "1px solid #f87171", borderRadius: "6px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", cursor: "pointer" }}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* OTP Modal */}
            {modal.open && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                    <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "24px", width: "100%", maxWidth: "400px", position: "relative", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
                        <button onClick={() => setModal({ ...modal, open: false })} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "20px" }}>
                            ✕
                        </button>

                        <h2 style={{ fontSize: "20px", fontWeight: "900", textAlign: "center", marginBottom: "4px", color: "#011D52" }}>{modal.title}</h2>
                        <p style={{ fontSize: "12px", textAlign: "center", color: "#64748b", marginBottom: "24px" }}>{modal.subtitle}</p>

                        {otpError && (
                            <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", color: "#dc2626", fontSize: "12px", fontWeight: "700", borderRadius: "12px", textAlign: "center" }}>
                                {otpError}
                            </div>
                        )}

                        {modal.step === 1 ? (
                            <div>
                                <div style={{ marginBottom: "16px" }}>
                                    <label style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                                        {modal.type === 'email' ? 'New Email' : 'New Phone Number'}
                                    </label>
                                    <input type="text" value={modal.targetValue}
                                        onChange={(e) => setModal({ ...modal, targetValue: e.target.value })}
                                        placeholder={modal.type === 'email' ? 'example@mail.com' : 'Enter 10 digit number'}
                                        style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "12px", backgroundColor: "#f8fafc", outline: "none", fontSize: "14px", fontWeight: "700" }} />
                                </div>
                                <button onClick={sendOtpRequest} disabled={loading}
                                    style={{ width: "100%", padding: "12px", backgroundColor: "#2B4365", color: "white", borderRadius: "12px", fontWeight: "700", fontSize: "14px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div style={{ marginBottom: "16px" }}>
                                    <label style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", display: "block", textAlign: "center", marginBottom: "4px" }}>Enter 6-Digit OTP</label>
                                    <input type="text" value={modal.otpCode} maxLength="6"
                                        onChange={(e) => setModal({ ...modal, otpCode: e.target.value })}
                                        style={{ width: "100%", textAlign: "center", fontSize: "24px", letterSpacing: "8px", fontWeight: "900", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "12px", backgroundColor: "#f8fafc", outline: "none" }} />
                                </div>
                                <button onClick={verifyOtpRequest} disabled={loading}
                                    style={{ width: "100%", padding: "12px", backgroundColor: "#2B4365", color: "white", borderRadius: "12px", fontWeight: "700", fontSize: "14px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                                    {loading ? 'Verifying...' : 'Verify & Update'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {passwordResetModal.open && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                    <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "24px", width: "100%", maxWidth: "400px", position: "relative", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
                        <button onClick={() => setPasswordResetModal({ ...passwordResetModal, open: false })} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "20px" }}>
                            ✕
                        </button>

                        <h2 style={{ fontSize: "20px", fontWeight: "900", textAlign: "center", marginBottom: "4px", color: "#011D52" }}>Reset Password</h2>
                        <p style={{ fontSize: "12px", textAlign: "center", color: "#64748b", marginBottom: "24px" }}>
                            {passwordResetModal.step === 1 ? "Choose where to receive your OTP" : "Enter the OTP and your new password"}
                        </p>

                        {passwordResetError && (
                            <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", color: "#dc2626", fontSize: "12px", fontWeight: "700", borderRadius: "12px", textAlign: "center" }}>
                                {passwordResetError}
                            </div>
                        )}

                        {passwordResetModal.step === 1 ? (
                            <div>
                                <div style={{ marginBottom: "20px", textAlign: "center" }}>
                                    <p style={{ fontSize: "14px", color: "#1B2B40", fontWeight: "600", margin: 0 }}>
                                        {passwordResetModal.type === 'email'
                                            ? `OTP will be sent to your email:`
                                            : `OTP will be sent to your mobile:`}
                                    </p>
                                    <p style={{ fontSize: "15px", color: "#011D52", fontWeight: "800", marginTop: "4px" }}>
                                        {passwordResetModal.type === 'email' ? user?.email : user?.phone}
                                    </p>
                                </div>
                                <button onClick={handleSendPasswordResetOtp} disabled={loading}
                                    style={{ width: "100%", padding: "12px", backgroundColor: "#2B4365", color: "white", borderRadius: "12px", fontWeight: "700", fontSize: "14px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginBottom: "16px" }}>
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                                <div style={{ textAlign: "center" }}>
                                    <button
                                        onClick={() => setPasswordResetModal({ ...passwordResetModal, type: passwordResetModal.type === 'email' ? 'phone' : 'email' })}
                                        style={{ background: "none", border: "none", color: "#64748b", fontSize: "12px", fontWeight: "600", textDecoration: "underline", cursor: "pointer" }}>
                                        {passwordResetModal.type === 'email' ? "Not receiving it? Send OTP on SMS" : "Not receiving it? Send OTP on Email"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ marginBottom: "16px" }}>
                                    <label style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", display: "block", textAlign: "center", marginBottom: "4px" }}>Enter 6-Digit OTP</label>
                                    <input type="text" value={passwordResetModal.otp} maxLength="6"
                                        onChange={(e) => setPasswordResetModal({ ...passwordResetModal, otp: e.target.value })}
                                        style={{ width: "100%", textAlign: "center", fontSize: "24px", letterSpacing: "8px", fontWeight: "900", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "12px", backgroundColor: "#f8fafc", outline: "none" }} />
                                </div>
                                <div style={{ marginBottom: "24px" }}>
                                    <label style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", display: "block", textAlign: "center", marginBottom: "4px" }}>New Password</label>
                                    <input type="password" value={passwordResetModal.newPassword}
                                        onChange={(e) => setPasswordResetModal({ ...passwordResetModal, newPassword: e.target.value })}
                                        style={{ width: "100%", textAlign: "center", fontSize: "16px", fontWeight: "700", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "12px", backgroundColor: "#f8fafc", outline: "none" }} />
                                </div>
                                <button onClick={handlePasswordResetSubmit} disabled={loading}
                                    style={{ width: "100%", padding: "12px", backgroundColor: "#2B4365", color: "white", borderRadius: "12px", fontWeight: "700", fontSize: "14px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                                    {loading ? 'Updating...' : 'Verify & Change Password'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* E-Sign from Profile: Agreement Modal */}
            {pendingEsignAgreement && (
                <AgreementModal
                    isOpen={isEsignModalOpen}
                    onClose={() => { setIsEsignModalOpen(false); setPendingEsignAgreement(null); }}
                    onAccept={handleProfileEsignAccept}
                    selectedPlan={{ name: pendingEsignAgreement.plan_name }}
                    selectedDuration={{ duration: pendingEsignAgreement.duration, price: pendingEsignAgreement.amount }}
                    user={user}
                    agreementNo={pendingEsignAgreement.agreement_number}
                    invoiceNo={"-"}
                    aadhaarNumber={kycData?.kyc_details?.aadhaar || 'Verified'}
                    panNumber={kycData?.kyc_details?.pan || 'Verified'}
                    planAmount={String(pendingEsignAgreement.amount)}
                    kycData={kycData}
                />
            )}

        </div>
    );
}
