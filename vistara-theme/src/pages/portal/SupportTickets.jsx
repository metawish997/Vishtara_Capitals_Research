import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ticketService from '../../services/ticketService';

const CATEGORIES = ['Account Issue', 'Payment/Billing', 'KYC Verification', 'Technical Bug', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function SupportTickets() {
    const [activeTab, setActiveTab] = useState('raise'); // 'raise' | 'history'

    // Form State
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [otherCategory, setOtherCategory] = useState('');
    const [priority, setPriority] = useState(PRIORITIES[1]);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // History State
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchTickets();
        }
    }, [activeTab]);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const response = await ticketService.getMyTickets();
            let data = [];
            if (response?.data && Array.isArray(response.data)) {
                data = response.data;
            } else if (Array.isArray(response)) {
                data = response;
            }
            setTickets(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load tickets.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 15 * 1024 * 1024) {
                toast.error('File size must be less than 15MB');
                return;
            }
            setAttachment(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject.trim() || !description.trim()) {
            toast.error('Please provide a subject and description.');
            return;
        }

        if (category === 'Other' && !otherCategory.trim()) {
            toast.error('Please specify your actual category.');
            return;
        }

        setIsSubmitting(true);
        try {
            const finalCategory = category === 'Other' ? otherCategory.trim() : category;
            let payload;

            if (attachment) {
                payload = new FormData();
                payload.append('issue', finalCategory);
                payload.append('subject', subject);
                payload.append('priority', priority);
                payload.append('description', description);
                payload.append('attachment', attachment);
            } else {
                payload = {
                    issue: finalCategory,
                    subject,
                    priority,
                    description
                };
            }

            await ticketService.createTicket(payload);
            toast.success('Ticket submitted successfully!');

            // Reset form
            setCategory(CATEGORIES[0]);
            setOtherCategory('');
            setPriority(PRIORITIES[1]);
            setSubject('');
            setDescription('');
            setAttachment(null);
            setPreview(null);

            // Switch to history tab
            setActiveTab('history');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to submit ticket.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        const lower = status?.toLowerCase() || '';
        if (lower === 'resolved' || lower === 'closed') return { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' };
        if (lower === 'rejected') return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
    };

    const renderTimelineModal = () => {
        if (!selectedTicket) return null;

        const status = (selectedTicket.status || 'pending').toLowerCase();

        // Timeline calculations
        const createdDate = new Date(selectedTicket.createdAt || selectedTicket.created_at || Date.now());
        const updatedDate = new Date(selectedTicket.updatedAt || selectedTicket.updated_at || Date.now());

        const expectedResolutionDate = new Date(updatedDate);
        expectedResolutionDate.setDate(expectedResolutionDate.getDate() + 4);
        const isOverdue = new Date() > expectedResolutionDate;

        let expectedTimelineText = '';
        if (status === 'open') {
            if (isOverdue) {
                expectedTimelineText = 'Expected admin responding soon...';
            } else {
                expectedTimelineText = `Issue will be resolved by ${expectedResolutionDate.toLocaleDateString()}`;
            }
        }

        return (
            <div style={{ position: "fixed", inset: 0, zIndex: 200, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <div style={{ width: "100%", maxWidth: "672px", backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", display: "flex", flexDirection: "column", maxHeight: "90vh", border: "1px solid #e2e8f0" }}>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#011D52", margin: 0 }}>Ticket Details</h3>
                        <button onClick={() => setSelectedTicket(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b", padding: "4px" }}>
                            ✕
                        </button>
                    </div>

                    <div style={{ padding: "24px", overflowY: "auto" }}>
                        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
                            <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#011D52", marginBottom: "8px" }}>{selectedTicket.subject}</h4>
                            <p style={{ fontSize: "13px", color: "#475569", whiteSpace: "pre-wrap", marginBottom: "16px", lineHeight: "1.6" }}>{selectedTicket.description}</p>
                            
                            {selectedTicket.attachment && (
                                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                                    <h5 style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8", marginBottom: "8px" }}>Attachment</h5>
                                    <a 
                                        href={selectedTicket.attachment} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "800", color: "#0ea5e9", textDecoration: "none" }}
                                    >
                                        View Attached File
                                    </a>
                                </div>
                            )}
                        </div>

                        <h4 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", marginBottom: "20px" }}>Ticket Timeline</h4>
                        
                        <div style={{ position: "relative", paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "32px" }}>
                            <div style={{ position: "absolute", top: 0, bottom: 0, left: "15px", width: "2px", backgroundColor: "#e2e8f0" }}></div>
                            
                            {/* Created */}
                            <div style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: "-32px", width: "32px", height: "32px", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10b981", border: "4px solid #ffffff" }}></div>
                                </div>
                                <h5 style={{ fontSize: "14px", fontWeight: "800", color: "#011D52", margin: "0 0 4px 0" }}>Ticket Raised</h5>
                                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{createdDate.toLocaleString()}</p>
                            </div>

                            {/* Open / In Progress */}
                            <div style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: "-32px", width: "32px", height: "32px", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: (status === 'open' || status === 'in progress' || status === 'resolved' || status === 'closed') ? "#0ea5e9" : "#cbd5e1", border: "4px solid #ffffff" }}></div>
                                </div>
                                <h5 style={{ fontSize: "14px", fontWeight: "800", color: (status === 'open' || status === 'in progress' || status === 'resolved' || status === 'closed') ? "#011D52" : "#94a3b8", margin: "0 0 4px 0" }}>
                                    {status === 'open' ? 'Admin Reviewing' : (status === 'resolved' || status === 'closed' ? 'Reviewed by Admin' : 'Awaiting Review')}
                                </h5>
                                {(status === 'open' || status === 'in progress' || status === 'resolved' || status === 'closed') && (
                                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{updatedDate.toLocaleString()}</p>
                                )}
                                {status === 'open' && (
                                    <p style={{ fontSize: "12px", fontWeight: "800", marginTop: "8px", color: isOverdue ? "#f59e0b" : "#0ea5e9" }}>
                                        {expectedTimelineText}
                                    </p>
                                )}
                            </div>

                            {/* Resolved */}
                            {(status === 'resolved' || status === 'closed') && (
                                <div style={{ position: "relative" }}>
                                    <div style={{ position: "absolute", left: "-32px", width: "32px", height: "32px", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10b981", border: "4px solid #ffffff" }}></div>
                                    </div>
                                    <h5 style={{ fontSize: "14px", fontWeight: "800", color: "#011D52", margin: "0 0 4px 0" }}>Ticket Resolved</h5>
                                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{updatedDate.toLocaleString()}</p>
                                    
                                    {selectedTicket.admin_note && (
                                        <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px" }}>
                                            <p style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", color: "#059669", marginBottom: "8px", margin: 0 }}>Resolution Note:</p>
                                            <p style={{ fontSize: "13px", fontStyle: "italic", color: "#065f46", margin: "8px 0 0 0" }}>{selectedTicket.admin_note}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#1b2c42", paddingBottom: "40px" }}>
            <div className="mb-4">
                <h2 style={{ color: "#011D52", fontWeight: "800", fontSize: "24px", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>Help & Support</h2>
                <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>Raise a new support ticket or track your previous requests.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "24px" }}>
                <button
                    onClick={() => setActiveTab('raise')}
                    style={{ flex: 1, padding: "16px", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", backgroundColor: "transparent", border: "none", borderBottom: activeTab === 'raise' ? "2px solid #011D52" : "2px solid transparent", color: activeTab === 'raise' ? "#011D52" : "#94a3b8", cursor: "pointer", transition: "all 0.2s" }}
                >
                    Raise Ticket
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    style={{ flex: 1, padding: "16px", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", backgroundColor: "transparent", border: "none", borderBottom: activeTab === 'history' ? "2px solid #011D52" : "2px solid transparent", color: activeTab === 'history' ? "#011D52" : "#94a3b8", cursor: "pointer", transition: "all 0.2s" }}
                >
                    My History
                </button>
            </div>

            {/* Content area */}
            <div>
                {activeTab === 'raise' ? (
                    <div className="row">
                        {/* Left Column: Form Details */}
                        <div className="col-lg-8 mb-4">
                            <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                                <h3 style={{ fontSize: "18px", color: "#011D52", fontWeight: "800", marginBottom: "20px" }}>Create New Ticket</h3>
                                <form id="ticketForm" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Category *</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#1B2B40", outline: "none", backgroundColor: "#ffffff" }}
                                            >
                                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Priority *</label>
                                            <select
                                                value={priority}
                                                onChange={(e) => setPriority(e.target.value)}
                                                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#1B2B40", outline: "none", backgroundColor: "#ffffff" }}
                                            >
                                                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {category === 'Other' && (
                                        <div style={{ marginBottom: "16px" }}>
                                            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Specify Category *</label>
                                            <input
                                                type="text"
                                                value={otherCategory}
                                                onChange={(e) => setOtherCategory(e.target.value)}
                                                placeholder="e.g. Request new feature"
                                                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#1B2B40", outline: "none", backgroundColor: "#ffffff" }}
                                            />
                                        </div>
                                    )}

                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Subject *</label>
                                        <input
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Brief summary of the issue"
                                            style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#1B2B40", outline: "none", backgroundColor: "#ffffff" }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: "20px" }}>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Description *</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Provide detailed information about your inquiry..."
                                            rows={6}
                                            style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#1B2B40", outline: "none", resize: "none", backgroundColor: "#ffffff" }}
                                        ></textarea>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: Actions & Attachments */}
                        <div className="col-lg-4 mb-4">
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                <button
                                    type="submit"
                                    form="ticketForm"
                                    disabled={isSubmitting}
                                    style={{ width: "100%", padding: "16px", backgroundColor: "#011D52", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, boxShadow: "0 6px 16px rgba(1, 29, 82, 0.25)", transition: "all 0.2s ease" }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                                </button>

                                {/* Attachment Section */}
                                <div style={{ padding: "20px", borderRadius: "12px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#64748b", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Attachment (Optional)</label>
                                    
                                    {!preview ? (
                                        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "128px", border: "2px dashed #cbd5e1", borderRadius: "12px", backgroundColor: "#ffffff", cursor: "pointer", transition: "all 0.2s" }}>
                                            <div style={{ textAlign: "center", padding: "16px" }}>
                                                <div style={{ fontSize: "24px", color: "#94a3b8", marginBottom: "8px" }}>📁</div>
                                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#1B2B40", margin: "0 0 4px 0" }}>Click to upload file</p>
                                                <p style={{ fontSize: "10px", color: "#94a3b8", margin: 0 }}>SVG, PNG, JPG (Max 15MB)</p>
                                            </div>
                                            <input type="file" style={{ display: "none" }} accept="image/*,.pdf,.doc,.docx,.csv,.xlsx" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div style={{ position: "relative", width: "100%", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", backgroundColor: "#ffffff" }}>
                                            <div style={{ width: "100%", height: "128px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                                {attachment?.type?.startsWith('image/') ? (
                                                    <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <div style={{ fontSize: "32px", color: "#94a3b8" }}>📄</div>
                                                )}
                                                <button 
                                                    type="button" 
                                                    onClick={removeAttachment}
                                                    style={{ position: "absolute", top: "8px", right: "8px", padding: "4px", backgroundColor: "rgba(0,0,0,0.5)", color: "#ffffff", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "12px" }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <div style={{ width: "100%", textAlign: "center" }}>
                                                <p style={{ fontSize: "11px", fontWeight: "700", color: "#1B2B40", margin: "0 0 2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{attachment?.name}</p>
                                                <p style={{ fontSize: "10px", color: "#94a3b8", margin: 0 }}>{(attachment?.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {isLoading ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
                                <div className="spinner-border text-primary" role="status"></div>
                                <p style={{ fontSize: "12px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginTop: "16px" }}>Loading History...</p>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                                <div style={{ width: "64px", height: "64px", backgroundColor: "#f8fafc", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", fontSize: "24px" }}>
                                    ⚠️
                                </div>
                                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#011D52" }}>No Tickets Found</h3>
                                <p style={{ color: "#64748b", fontSize: "14px", marginTop: "8px", maxWidth: "300px" }}>You haven't raised any support tickets yet. Switch to the Raise Ticket tab to create one.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: "auto", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                                <table style={{ width: "100%", textAlign: "left", fontSize: "13px", color: "#475569", borderCollapse: "collapse" }}>
                                    <thead style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", color: "#1B2B40", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                        <tr>
                                            <th style={{ padding: "16px 24px" }}>S.No.</th>
                                            <th style={{ padding: "16px 24px" }}>Category</th>
                                            <th style={{ padding: "16px 24px" }}>Subject</th>
                                            <th style={{ padding: "16px 24px" }}>Status</th>
                                            <th style={{ padding: "16px 24px" }}>Date</th>
                                            <th style={{ padding: "16px 24px", textAlign: "right" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map((ticket, index) => {
                                            const statusStyle = getStatusColor(ticket.status);
                                            return (
                                                <tr key={ticket._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                                                    <td style={{ padding: "16px 24px", fontFamily: "monospace", fontSize: "12px", fontWeight: "700" }}>{index + 1}</td>
                                                    <td style={{ padding: "16px 24px" }}>
                                                        <span style={{ backgroundColor: "#f1f5f9", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", color: "#64748b", border: "1px solid #e2e8f0" }}>
                                                            {ticket.issue || ticket.category || 'Other'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "16px 24px", fontWeight: "600", color: "#1B2B40", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        {ticket.subject}
                                                    </td>
                                                    <td style={{ padding: "16px 24px" }}>
                                                        <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: "30px", fontSize: "11px", fontWeight: "800", backgroundColor: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}` }}>
                                                            {ticket.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "16px 24px" }}>
                                                        {new Date(ticket.createdAt || ticket.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </td>
                                                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                                                        <button 
                                                            onClick={() => setSelectedTicket(ticket)}
                                                            style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "800", color: "#0ea5e9", border: "none", background: "transparent", cursor: "pointer" }}
                                                        >
                                                            Timeline &rarr;
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {renderTimelineModal()}
        </div>
    );
}
