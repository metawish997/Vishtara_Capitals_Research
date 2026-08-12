import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import leadService from '../../../services/leadService';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { Target, ArrowLeft, MessageSquare, Clipboard, User, Calendar, RefreshCw, Trash2, Edit, ChevronLeft, ChevronRight, UserPlus, ShieldCheck } from 'lucide-react';

const LeadDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [activities, setActivities] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [meta, setMeta] = useState({ statuses: [], employees: [], sources: [], categories: [] });
    const [expandedDates, setExpandedDates] = useState([]);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
    const [demoDays, setDemoDays] = useState(3);
    const [adjacentLeads, setAdjacentLeads] = useState({ prev: null, next: null });
    const [registeredUser, setRegisteredUser] = useState(null);
    const [checkingRegistration, setCheckingRegistration] = useState(false);

    // Modals & Forms
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: '',
        mobileNumber: '',
        email: '',
        leadSource: '',
        leadCategory: ''
    });

    const fetchLeadData = async () => {
        setLoading(true);
        try {
            const res = await leadService.getLead(id);
            if (res.success) {
                setLead(res.data);
                setEditForm({
                    fullName: res.data.fullName || '',
                    mobileNumber: res.data.mobileNumber || '',
                    email: res.data.email || '',
                    leadSource: res.data.leadSource?._id || '',
                    leadCategory: res.data.leadCategory?._id || ''
                });
            }
        } catch (err) {
            toast.error('Failed to load lead details');
            navigate('/admin/leads');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await leadService.getComments(id);
            if (res.success) {
                setComments(res.data);
            }
        } catch (err) {
            console.error('Failed to load comments:', err);
        }
    };

    const fetchActivities = async () => {
        try {
            const res = await leadService.getActivityLogs(id);
            if (res.success) {
                setActivities(res.data);
            }
        } catch (err) {
            console.error('Failed to load activities:', err);
        }
    };

    const fetchMetadata = async () => {
        try {
            const res = await leadService.getMetadata();
            if (res.success) {
                setMeta({
                    statuses: res.data.statuses,
                    employees: res.data.employees,
                    sources: res.data.sources,
                    categories: res.data.categories
                });
            }
        } catch (err) {
            console.error('Failed to load metadata dropdowns:', err);
        }
    };

    useEffect(() => {
        fetchLeadData();
        fetchComments();
        fetchActivities();
        fetchMetadata();

        const fetchNavLeads = async () => {
            try {
                const res = await leadService.getLeads({ limit: 500, sortBy: 'createdAt', sortOrder: 'desc' });
                if (res.success && res.data) {
                    const idx = res.data.findIndex(l => l._id === id);
                    if (idx !== -1) {
                        setAdjacentLeads({
                            prev: idx > 0 ? res.data[idx - 1]._id : null,
                            next: idx < res.data.length - 1 ? res.data[idx + 1]._id : null
                        });
                    }
                }
            } catch (err) { }
        };
        fetchNavLeads();
    }, [id]);

    useEffect(() => {
        if (lead && (lead.email || lead.mobileNumber)) {
            const checkReg = async () => {
                setCheckingRegistration(true);
                try {
                    const res = await api.post('/users/check-registration', {
                        email: lead.email,
                        phone: lead.mobileNumber
                    });
                    if (res.data.success && res.data.isRegistered) {
                        const userData = res.data.data;
                        // Fetch full customer details to get demo history reliably without backend restart
                        try {
                            const custRes = await api.get(`/customers/${userData.id}`);
                            if (custRes.data.success) {
                                const subs = custRes.data.data.subscriptions || [];
                                userData.demoHistory = subs
                                    .filter(s => s.payment_gateway === 'demo')
                                    .map(s => ({
                                        id: s._id,
                                        start_date: s.start_date,
                                        end_date: s.end_date,
                                        status: s.status
                                    }))
                                    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
                                userData.hasUsedDemo = subs.some(s => s.payment_gateway === 'demo');
                                const now = new Date();
                                const tomorrow = new Date(now);
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                
                                userData.hasActiveSubscription = subs.some(s => ['active', 'pending', 'demo'].includes(s.status) && new Date(s.end_date) >= now);
                                userData.isExpiringSoon = subs.some(s => {
                                    if (!['active', 'pending', 'demo'].includes(s.status)) return false;
                                    const endDate = new Date(s.end_date);
                                    return endDate <= tomorrow;
                                });
                            }
                        } catch (err) {
                            console.error("Failed to fetch customer subscriptions", err);
                        }
                        
                        setRegisteredUser(userData);
                    } else {
                        setRegisteredUser(null);
                    }
                } catch (err) {
                    console.error("Failed to check registration", err);
                    setRegisteredUser(null);
                } finally {
                    setCheckingRegistration(false);
                }
            };
            checkReg();
        }
    }, [lead?.email, lead?.mobileNumber]);

    useEffect(() => {
        if (activities.length > 0 && expandedDates.length === 0) {
            const dateKey = new Date(activities[0].createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
            setExpandedDates([dateKey]);
        }
    }, [activities]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setIsSubmittingComment(true);
        try {
            const res = await leadService.addComment(id, newComment);
            if (res.success) {
                toast.success('Comment added successfully');
                setNewComment('');
                // Refresh data
                fetchComments();
                fetchActivities();
                // Refresh lead to update commentsCount and readStatus
                const leadRes = await leadService.getLead(id);
                if (leadRes.success) setLead(leadRes.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post comment');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleStatusChange = async (statusId) => {
        try {
            const res = await leadService.changeLeadStatus(id, statusId);
            if (res.success) {
                toast.success('Status updated successfully');
                setLead(prev => ({ ...prev, status: meta.statuses.find(s => s._id === statusId) }));
                fetchActivities();
            }
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleOwnerChange = async (ownerId) => {
        try {
            const res = await leadService.changeLeadOwner(id, ownerId);
            if (res.success) {
                toast.success('Owner updated successfully');
                setLead(prev => ({
                    ...prev,
                    ownerLead: meta.employees.find(e => e._id === ownerId),
                    readStatus: 'Unread'
                }));
                fetchActivities();
            }
        } catch (err) {
            toast.error('Failed to update owner');
        }
    };

    const handleReadStatusToggle = async () => {
        const nextStatus = lead.readStatus === 'Read' ? 'Unread' : 'Read';
        try {
            const res = await leadService.changeLeadReadStatus(id, nextStatus);
            if (res.success) {
                toast.success(`Marked as ${nextStatus}`);
                setLead(prev => ({ ...prev, readStatus: nextStatus }));
                fetchActivities();
            }
        } catch (err) {
            toast.error('Failed to change read status');
        }
    };

    const handleSaveDetails = async () => {
        try {
            const payload = {
                ...editForm,
                status: lead.status?._id,
                ownerLead: lead.ownerLead?._id
            };
            const res = await leadService.updateLead(id, payload);
            if (res.success) {
                toast.success('Lead details updated successfully');
                setIsEditing(false);
                setLead(res.data);
                fetchActivities();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update lead details');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to permanently delete this lead? This cannot be undone.')) {
            try {
                const res = await leadService.deleteLead(id);
                if (res.success) {
                    toast.success('Lead deleted successfully');
                    navigate('/admin/leads');
                }
            } catch (err) {
                toast.error('Failed to delete lead');
            }
        }
    };

    const handleGrantDemo = async (e) => {
        if (e) e.preventDefault();
        if (!registeredUser || !registeredUser.id) return;
        try {
            toast.loading('Assigning Demo...');
            const res = await api.post(`/customers/${registeredUser.id}/grant-demo`, { demoDays: parseInt(demoDays) || 3 });
            toast.dismiss();
            toast.success(`Granted ${demoDays} days demo access`);
            setIsDemoModalOpen(false);
            
            // Refresh registration details
            setCheckingRegistration(true);
            const regRes = await api.post('/users/check-registration', {
                email: lead.email,
                phone: lead.mobileNumber
            });
            if (regRes.data?.success && regRes.data?.isRegistered) {
                const userData = regRes.data.data;
                try {
                    const custRes = await api.get(`/customers/${userData.id}`);
                    if (custRes.data.success) {
                        const subs = custRes.data.data.subscriptions || [];
                        userData.demoHistory = subs
                            .filter(s => s.payment_gateway === 'demo')
                            .map(s => ({
                                id: s._id,
                                start_date: s.start_date,
                                end_date: s.end_date,
                                status: s.status
                            }))
                            .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
                        userData.hasUsedDemo = subs.some(s => s.payment_gateway === 'demo');
                        const now = new Date();
                        const tomorrow = new Date(now);
                        tomorrow.setDate(tomorrow.getDate() + 1);

                        userData.hasActiveSubscription = subs.some(s => ['active', 'pending', 'demo'].includes(s.status) && new Date(s.end_date) >= now);
                        userData.isExpiringSoon = subs.some(s => {
                            if (!['active', 'pending', 'demo'].includes(s.status)) return false;
                            const endDate = new Date(s.end_date);
                            return endDate <= tomorrow;
                        });
                    }
                } catch (err) {}
                setRegisteredUser(userData);
            }
            setCheckingRegistration(false);
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || 'Failed to assign demo');
        }
    };

    // Helper to format date key
    const formatDateKey = (dateString) => {
        const d = new Date(dateString);
        const datePart = d.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
        return `${datePart}, ${dayName}`;
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " year ago" : " years ago");
        interval = seconds / 2592000;
        if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " month ago" : " months ago");
        interval = seconds / 86400;
        if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " day ago" : " days ago");
        interval = seconds / 3600;
        if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " hour ago" : " hours ago");
        interval = seconds / 60;
        if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " minute ago" : " minutes ago");
        return (seconds < 0 ? 0 : Math.floor(seconds)) + " seconds ago";
    };

    // Merge activities and comments
    const mergedActivities = [
        ...activities.map(a => ({ ...a, itemType: 'activity' })),
        ...comments.map(c => ({ ...c, itemType: 'comment' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate grouped activities
    const groupedActivities = mergedActivities.reduce((acc, item) => {
        const dateKey = formatDateKey(item.createdAt);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
    }, {});

    const sortedDateKeys = Object.keys(groupedActivities).sort((a, b) => new Date(b) - new Date(a));

    const toggleDate = (dateKey) => {
        setExpandedDates(prev =>
            prev.includes(dateKey) ? prev.filter(d => d !== dateKey) : [...prev, dateKey]
        );
    };

    // Calculate Most Active User
    const userActivityCounts = activities.reduce((acc, act) => {
        if (act.employeeId) {
            const uid = act.employeeId._id;
            if (!acc[uid]) acc[uid] = { count: 0, user: act.employeeId };
            acc[uid].count += 1;
        }
        return acc;
    }, {});

    let topUser = null;
    let maxCount = 0;
    Object.values(userActivityCounts).forEach(item => {
        if (item.count > maxCount) {
            maxCount = item.count;
            topUser = item.user;
        }
    });

    if (loading) {
        return (
            <div className="w-full text-center py-24 text-[10px] uppercase font-black text-[slate-500]">
                <div className="w-8 h-8 border-2 border-[[#011d52]]/20 border-t-[[#011d52]] rounded-full animate-spin mx-auto mb-4"></div>
                Loading prospect history ledger...
            </div>
        );
    }

    if (!lead) return null;

    const hasChanges = (
        editForm.fullName !== (lead.fullName || '') ||
        editForm.mobileNumber !== (lead.mobileNumber || '') ||
        editForm.email !== (lead.email || '') ||
        editForm.leadSource !== (lead.leadSource?._id || '') ||
        editForm.leadCategory !== (lead.leadCategory?._id || '')
    );

    const quickReplySection = (
        <div className="space-y-4">
            <h3 className="text-[14px] font-bold text-[slate-800]">Quick Reply</h3>
            <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center font-bold text-[12px] text-orange-600 mt-1">
                    S
                </div>
                <form onSubmit={handleAddComment} className="flex-1 relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type a reply / comment"
                        className="w-full bg-[#f8fafc] border border-[slate-200] rounded-[6px] px-4 py-3 text-[13px] text-[slate-800] outline-none focus:border-[[#011d52]] transition-all resize-none min-h-[50px] overflow-hidden"
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = (e.target.scrollHeight) + 'px';
                        }}
                    />
                    {newComment.trim() && (
                        <button
                            type="submit"
                            disabled={isSubmittingComment}
                            className="absolute right-3 bottom-3 bg-[[#011d52]] text-[#020210] px-4 py-1.5 rounded-[4px] text-[11px] font-bold shadow-sm"
                        >
                            {isSubmittingComment ? 'Posting...' : 'Post'}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-6 text-[10px] font-sans pb-10 -mt-5">
            {/* Header section */}
            <div className="sticky top-[-25px] z-30 flex items-center justify-between gap-4 pb-[0.55rem] pt-[0.5rem] bg-[slate-50]/95 backdrop-blur-md border-b border-[slate-200]/60 -mx-4 sm:-mx-6 px-4 sm:px-6 mb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/leads')}
                        className="p-1.5 bg-[slate-50] border border-[slate-200] rounded hover:bg-[slate-200]/15 text-[slate-500] transition-all"
                        title="Back to listing"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-[slate-500] mb-1">
                            <span>Leads</span>
                            <span>/</span>
                            <span className="text-[slate-800]">Lead Details</span>
                            <span className="ml-1 px-1.5 py-0.5 rounded bg-[[#011d52]]/10 text-[[#011d52]] border border-[[#011d52]]/20 font-black text-[7px] tracking-wider uppercase">
                                {lead.leadCode}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-[20px] font-extrabold text-[slate-800] tracking-tight leading-none">{editForm.fullName || 'No Name'}</h2>
                            {hasChanges ? (
                                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-[20px] text-[11px] font-medium leading-none">Unsaved</span>
                            ) : (
                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-[20px] text-[11px] font-medium leading-none">Saved</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-1.5 mr-2">
                        <button
                            onClick={() => adjacentLeads.prev && navigate(`/admin/leads/${adjacentLeads.prev}`)}
                            disabled={!adjacentLeads.prev}
                            className="p-1.5 bg-[slate-50] border border-[slate-200] rounded hover:bg-[slate-200]/15 text-[slate-500] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => adjacentLeads.next && navigate(`/admin/leads/${adjacentLeads.next}`)}
                            disabled={!adjacentLeads.next}
                            className="p-1.5 bg-[slate-50] border border-[slate-200] rounded hover:bg-[slate-200]/15 text-[slate-500] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={handleReadStatusToggle}
                        className={`px-3 py-1.5 rounded-[4px] font-black text-[8px] uppercase tracking-widest transition-all border ${lead.readStatus === 'Read'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25'
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/25'
                            }`}
                    >
                        {lead.readStatus === 'Read' ? '🟢 Read' : '🔴 Unread'}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/25 px-3 py-1.5 rounded-[4px] font-black text-[8px] uppercase tracking-widest transition-all"
                    >
                        Delete Lead
                    </button>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="flex flex-col xl:flex-row gap-6">

                {/* Left Sidebar */}
                {registeredUser && (
                    <div className="w-full xl:w-[260px] flex-shrink-0 space-y-8">
                        {/* Free Trial Section */}
                        <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[slate-200]/60 text-[#6366f1]">
                            <div className="flex items-center gap-2">
                                <UserPlus className="w-[16px] h-[16px]" />
                                <h3 className="text-[15px] text-[slate-800]">Free Trial</h3>
                            </div>
                            {registeredUser && (!registeredUser.hasActiveSubscription || registeredUser.isExpiringSoon) && (
                                <span 
                                    onClick={() => { setDemoDays(3); setIsDemoModalOpen(true); }}
                                    className="text-[slate-500] cursor-pointer hover:text-[slate-800] text-[16px] font-light"
                                    title="Assign Free Trial"
                                >
                                    +
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-[slate-800] text-[13px]">Trial History</h4>
                                    <span className="text-[slate-500] text-[11px]">
                                        Trials: {registeredUser?.demoHistory?.length || 0} • <span className={registeredUser?.hasActiveSubscription ? "text-slate-400" : "text-emerald-600"}>
                                            {registeredUser?.hasActiveSubscription ? "Currently Active" : "Eligible for Trial"}
                                        </span>
                                    </span>
                                </div>
                                {(!registeredUser || !registeredUser.demoHistory || registeredUser.demoHistory.length === 0) ? (
                                    <p className="text-[slate-500]/50 italic py-2">No free trial history yet.</p>
                                ) : (
                                    <div className="space-y-2 mt-2">
                                        {registeredUser.demoHistory.map(demo => (
                                            <div key={demo.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-[6px]">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-wider ${
                                                        demo.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                                        demo.status === 'demo' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-rose-100 text-rose-700'
                                                    }`}>
                                                        {demo.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-[10px] text-slate-500">
                                                    <span>{new Date(demo.start_date).toLocaleDateString()}</span>
                                                    <span>to</span>
                                                    <span>{new Date(demo.end_date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="w-full h-px bg-[slate-200]/50"></div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-[slate-800] text-[13px] leading-tight mt-0.5">Payment<br />Requests</h4>
                                    <div className="text-[slate-500] text-[11px] text-right">
                                        <span className="block">Pending: 0 |</span>
                                        <span className="block">Approved: 0</span>
                                    </div>
                                </div>
                                <p className="text-[#64748b] text-[13px] pt-1">No payment requests yet.</p>
                            </div>
                        </div>
                    </div>
                        {/* Quick Reply / Comments */}
                        {quickReplySection}
                    </div>
                )}

                {/* Right Content Area */}
                <div className={`flex-1 flex flex-col ${!registeredUser ? 'xl:flex-row' : ''} gap-6 min-w-0`}>
                    {/* Left Column (Lead Details) */}
                    <div className="flex-1 space-y-8 min-w-0">
                        {/* 1. Lead Details Card */}
                        <div className="bg-white border-0 border-l-[3px] border-[#e2e8f0] p-4 shadow-sm">
                        <div className="mb-5 flex justify-between items-start">
                            <div>
                                <h3 className="text-[14px] font-bold text-[#0f172a]">Lead Details</h3>
                                <p className="text-[12px] text-[#64748b] mt-0.5">
                                    Owner: {lead.ownerLead ? `${lead.ownerLead.firstName} ${lead.ownerLead.lastName}` : 'Unassigned'} (auto-assigned at creation)
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {hasChanges && (
                                    <>
                                        <button onClick={() => {
                                            setIsEditing(false);
                                            setEditForm({
                                                fullName: lead.fullName || '',
                                                mobileNumber: lead.mobileNumber || '',
                                                email: lead.email || '',
                                                leadSource: lead.leadSource?._id || '',
                                                leadCategory: lead.leadCategory?._id || ''
                                            });
                                        }} className="px-3 py-1.5 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] rounded-[4px] text-[11px] font-bold transition-all text-[#64748b] shadow-sm">
                                            Cancel
                                        </button>
                                        <button onClick={handleSaveDetails} className="px-3 py-1.5 bg-[#84cc16] hover:bg-[#65a30d] rounded-[4px] text-[11px] font-bold transition-all text-black shadow-sm">
                                            Save
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <label className="block text-[12px] text-[#64748b] mb-1.5">Full Name</label>
                                {isEditing === 'fullName' ? (
                                    <input
                                        autoFocus
                                        onBlur={() => setIsEditing(false)}
                                        value={editForm.fullName}
                                        onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[4px] px-3 py-1.5 text-[13px] text-[#0f172a] outline-none focus:border-indigo-400 transition-all"
                                    />
                                ) : (
                                    <div onClick={() => setIsEditing('fullName')} className="text-[13px] font-medium text-[#1e293b] py-1.5 cursor-pointer hover:bg-slate-50 px-2 -ml-2 rounded border border-transparent hover:border-slate-200 transition-all">
                                        {editForm.fullName || '-'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[12px] text-[#64748b] mb-1.5">Mobile No</label>
                                {isEditing === 'mobileNumber' ? (
                                    <div className="flex">
                                        <input
                                            autoFocus
                                            onBlur={(e) => {
                                                if (!e.relatedTarget) setIsEditing(false);
                                            }}
                                            value={editForm.mobileNumber}
                                            onChange={e => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-[#e2e8f0] border-r-0 rounded-l-[4px] px-3 py-1.5 text-[13px] text-[#0f172a] outline-none focus:border-indigo-400 transition-all"
                                        />
                                        <button className="bg-[#f1f5f9] border border-[#e2e8f0] rounded-r-[4px] px-3 flex items-center justify-center text-[#64748b] hover:bg-[#e2e8f0] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-slate-50 px-2 -ml-2 rounded border border-transparent hover:border-slate-200 transition-all" onClick={() => setIsEditing('mobileNumber')}>
                                        <p className="text-[13px] font-medium text-[#1e293b]">{editForm.mobileNumber || '-'}</p>
                                        {editForm.mobileNumber && (
                                            <button className="text-[#64748b] hover:text-indigo-600 transition-colors" onClick={(e) => e.stopPropagation()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[12px] text-[#64748b] mb-1.5">Email</label>
                                {isEditing === 'email' ? (
                                    <input
                                        autoFocus
                                        onBlur={() => setIsEditing(false)}
                                        type="email"
                                        value={editForm.email}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[4px] px-3 py-1.5 text-[13px] text-[#0f172a] outline-none focus:border-indigo-400 transition-all"
                                    />
                                ) : (
                                    <div onClick={() => setIsEditing('email')} className="text-[13px] font-medium text-[#1e293b] py-1.5 cursor-pointer hover:bg-slate-50 px-2 -ml-2 rounded border border-transparent hover:border-slate-200 transition-all">
                                        {editForm.email || '-'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[12px] text-[#64748b] mb-1.5">Status</label>
                                {isEditing === 'status' ? (
                                    <select
                                        autoFocus
                                        onBlur={() => setIsEditing(false)}
                                        value={lead.status?._id || ''}
                                        onChange={(e) => {
                                            handleStatusChange(e.target.value);
                                            setIsEditing(false);
                                        }}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[4px] px-3 py-1.5 text-[13px] text-[#0f172a] outline-none focus:border-indigo-400 transition-all cursor-pointer"
                                    >
                                        <option value="">Select status</option>
                                        {meta.statuses.map(st => (
                                            <option key={st._id} value={st._id}>{st.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div onClick={() => setIsEditing('status')} className="text-[13px] font-medium text-[#1e293b] py-1.5 cursor-pointer hover:bg-slate-50 px-2 -ml-2 rounded border border-transparent hover:border-slate-200 transition-all">
                                        {lead.status?.name || '-'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[12px] text-[#64748b] mb-1.5">Lead Source</label>
                                {isEditing === 'leadSource' ? (
                                    <select
                                        autoFocus
                                        onBlur={() => setIsEditing(false)}
                                        value={editForm.leadSource}
                                        onChange={e => {
                                            setEditForm({ ...editForm, leadSource: e.target.value });
                                            setIsEditing(false);
                                        }}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[4px] px-3 py-1.5 text-[13px] text-[#0f172a] outline-none focus:border-indigo-400 transition-all cursor-pointer"
                                    >
                                        <option value="">Select source</option>
                                        {meta.sources?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                ) : (
                                    <div onClick={() => setIsEditing('leadSource')} className="text-[13px] font-medium text-[#1e293b] py-1.5 cursor-pointer hover:bg-slate-50 px-2 -ml-2 rounded border border-transparent hover:border-slate-200 transition-all">
                                        {meta.sources?.find(s => s._id === editForm.leadSource)?.name || '-'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[12px] text-[#64748b] mb-1.5">Lead Category</label>
                                {isEditing === 'leadCategory' ? (
                                    <select
                                        autoFocus
                                        onBlur={() => setIsEditing(false)}
                                        value={editForm.leadCategory}
                                        onChange={e => {
                                            setEditForm({ ...editForm, leadCategory: e.target.value });
                                            setIsEditing(false);
                                        }}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[4px] px-3 py-1.5 text-[13px] text-[#0f172a] outline-none focus:border-indigo-400 transition-all cursor-pointer"
                                    >
                                        <option value="">Select category</option>
                                        {meta.categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                ) : (
                                    <div onClick={() => setIsEditing('leadCategory')} className="text-[13px] font-medium text-[#1e293b] py-1.5 cursor-pointer hover:bg-slate-50 px-2 -ml-2 rounded border border-transparent hover:border-slate-200 transition-all">
                                        {meta.categories?.find(c => c._id === editForm.leadCategory)?.name || '-'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    </div> {/* End Left Column */}

                    {/* Right Column (Quick Reply & Activity) */}
                    <div className={!registeredUser ? "w-full xl:w-[380px] flex-shrink-0 space-y-6" : "space-y-6"}>
                        {!registeredUser && (
                            <div className="pb-2">
                                {quickReplySection}
                            </div>
                        )}

                        {/* 2. Activity Timeline */}
                    <div className="space-y-4 px-1 pb-10">
                        <h3 className="text-[14px] font-bold text-[slate-800]">Activity</h3>

                        <div className="space-y-8">
                            {sortedDateKeys.length === 0 ? (
                                <p className="text-[slate-500]/50 italic py-4">No audit logs recorded.</p>
                            ) : (
                                sortedDateKeys.map(dateKey => {
                                    const isExpanded = expandedDates.includes(dateKey);
                                    return (
                                        <div key={dateKey} className="relative">
                                            <div
                                                className="flex justify-between items-start mb-2 cursor-pointer group"
                                                onClick={() => toggleDate(dateKey)}
                                            >
                                                <div>
                                                    <h4 className="text-[13px] font-bold text-[slate-800]">
                                                        {dateKey}
                                                    </h4>
                                                    <p className="text-[11px] text-[#94a3b8] mt-0.5">
                                                        {groupedActivities[dateKey].length} record(s)
                                                    </p>
                                                </div>
                                                <span className="text-[11px] text-[#94a3b8] group-hover:text-[slate-800] font-medium">
                                                    Toggle
                                                </span>
                                            </div>

                                            {isExpanded && (
                                                <div className="relative pt-4 pl-1 space-y-6">
                                                    {/* Vertical line for the group */}
                                                    <div className="absolute left-[7px] top-6 bottom-4 w-px bg-[#e2e8f0]"></div>

                                                    {groupedActivities[dateKey].map((item) => {
                                                        if (item.itemType === 'comment') {
                                                            const empName = item.employeeId ? `${item.employeeId.firstName}` : 'System';
                                                            const initial = item.employeeId?.firstName?.charAt(0) || 'S';
                                                            return (
                                                                <div key={`comm-${item._id}`} className="relative flex items-start gap-4">
                                                                    <div className="w-2 h-2 mt-4 rounded-full bg-amber-400 flex-shrink-0 relative z-10 border-[1.5px] border-white shadow-sm ml-[3px]"></div>
                                                                    <div className="flex-1 bg-white border border-[#e2e8f0] rounded-[8px] p-4 shadow-sm relative z-10">
                                                                        <div className="flex items-center gap-2 mb-3">
                                                                            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center font-bold text-[11px] text-orange-600">
                                                                                {initial}
                                                                            </div>
                                                                            <div className="text-[13px] text-[slate-500]">
                                                                                <span className="text-[slate-800]">{empName}</span> commented <span className="text-[12px] text-[#94a3b8] ml-1">• {timeAgo(item.createdAt)}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="w-full h-px bg-[#e2e8f0] mb-3"></div>
                                                                        <p className="text-[13px] text-[slate-800] whitespace-pre-wrap leading-relaxed">
                                                                            {item.comment}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div key={`act-${item._id}`} className="relative flex items-center gap-4">
                                                                    <div className="w-2 h-2 rounded-full bg-[#94a3b8] flex-shrink-0 relative z-10 ml-[3px]"></div>
                                                                    <div className="text-[13px] text-[slate-800]">
                                                                        <span dangerouslySetInnerHTML={{ __html: item.description.replace(/(assigned|transferred|changed|viewed)/gi, '<strong class="text-[slate-800] font-bold">$1</strong>') }} />
                                                                        <span className="text-[12px] text-[#94a3b8] ml-1">
                                                                            • {timeAgo(item.createdAt)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                    </div> {/* End Right Column */}
                </div>

                {/* Right Sidebar - Registered Account Info */}
                {(registeredUser || checkingRegistration) && (
                    <div className="w-full xl:w-[300px] flex-shrink-0 space-y-6">
                        <div className="bg-white p-4 rounded-[8px] border border-[#e2e8f0] shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e2e8f0]">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-[#0f172a] uppercase tracking-wider leading-none">Registered User</h3>
                                <p className="text-[10px] text-[#64748b] mt-1">Platform Account Info</p>
                            </div>
                        </div>

                        {checkingRegistration ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin mb-2" />
                                <p className="text-[11px] text-[#64748b]">Checking account...</p>
                            </div>
                        ) : registeredUser ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-[6px] mb-2 flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 animate-pulse"></div>
                                    <div>
                                        <p className="text-[12px] font-bold text-emerald-800 leading-tight">Active Account Found</p>
                                        <p className="text-[10px] text-emerald-600 mt-0.5">Matched by email/phone</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] text-[#64748b] font-medium uppercase mb-0.5">Name</p>
                                        <p className="text-[13px] font-bold text-[#0f172a]">{registeredUser.name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[10px] text-[#64748b] font-medium uppercase mb-0.5">Phone</p>
                                            <p className="text-[12px] font-medium text-[#0f172a]">{registeredUser.phone}</p>
                                        </div>
                                        {registeredUser.smra_id && (
                                            <div>
                                                <p className="text-[10px] text-[#64748b] font-medium uppercase mb-0.5">SMRA ID</p>
                                                <p className="text-[12px] font-medium text-[#0f172a]">{registeredUser.smra_id}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#64748b] font-medium uppercase mb-0.5">Email</p>
                                        <p className="text-[12px] font-medium text-[#0f172a] break-all">{registeredUser.email}</p>
                                    </div>

                                    <div className="w-full h-px bg-[#e2e8f0] my-2"></div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[10px] text-[#64748b] font-medium uppercase mb-1">Subscription</p>
                                            <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold ${
                                                registeredUser.subscription === 'Paid' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                (registeredUser.subscription === 'Demo' || registeredUser.hasUsedDemo) ? 'bg-blue-50 text-[#011d52] border border-blue-200' :
                                                'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                                {registeredUser.subscription === 'Paid' ? 'Paid' : 
                                                 registeredUser.subscription === 'Demo' ? 'Free Trial' : 
                                                 registeredUser.hasUsedDemo ? 'Free Trialed' : 'None'}
                                            </span>
                                        </div>
                                        {(registeredUser.kyc_status && registeredUser.kyc_status.toLowerCase() !== 'none') && (
                                            <div>
                                                <p className="text-[10px] text-[#64748b] font-medium uppercase mb-1">KYC Status</p>
                                                <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold ${
                                                    registeredUser.kyc_status === 'verified' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                    registeredUser.kyc_status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                    registeredUser.kyc_status === 'rejected' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                                    'bg-slate-100 text-slate-600 border border-slate-200'
                                                }`}>
                                                    {registeredUser.kyc_status.toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {registeredUser.plans && registeredUser.plans.length > 0 && (
                                        <div className="pt-2">
                                            <p className="text-[10px] text-[#64748b] font-medium uppercase mb-1">Active Plans</p>
                                            <div className="flex flex-wrap gap-1">
                                                {registeredUser.plans.map((p, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[10px] font-medium">
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
            </div>

            {/* Comments Modal */}
            {isCommentsModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[white] border border-[slate-200] rounded-[8px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-[slate-200] flex items-center justify-between bg-[slate-50]">
                            <h3 className="text-[11px] font-black text-[slate-800] uppercase tracking-wider">All Comments ({comments.length})</h3>
                            <button onClick={() => setIsCommentsModalOpen(false)} className="text-[slate-500] hover:text-rose-500 transition-colors px-2 font-bold">
                                ✖
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto space-y-4">
                            {comments.length === 0 ? (
                                <p className="text-center text-[slate-500]/50 italic py-6">No comments available.</p>
                            ) : (
                                comments.map((comm) => (
                                    <div key={comm._id} className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[[#011d52]]/10 border border-[[#011d52]]/20 flex-shrink-0 flex items-center justify-center font-black text-[9px] text-[[#011d52]] uppercase mt-1">
                                            {comm.employeeId?.firstName?.charAt(0) || 'E'}
                                        </div>
                                        <div className="flex-1 bg-[slate-50] border border-[slate-200] p-3 rounded-2xl rounded-tl-sm space-y-1.5 shadow-sm relative">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-extrabold text-[slate-800] text-[9px]">
                                                    {comm.employeeId ? `${comm.employeeId.firstName} ${comm.employeeId.lastName}` : 'System'}
                                                </span>
                                                <span className="text-[7px] text-[slate-500] font-bold">
                                                    {new Date(comm.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-[9px] font-bold text-[slate-500] whitespace-pre-wrap leading-relaxed">
                                                {comm.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Grant Demo Modal */}
            {isDemoModalOpen && registeredUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="p-4">
                            <h3 className="text-xs font-semibold font-black text-slate-900 tracking-tight mb-2">Assign Free Trial</h3>
                            <p className="text-xs text-slate-500 mb-6">Assign a demo subscription to <span className="font-bold text-slate-900">{registeredUser.name}</span>.</p>
                            
                            <form onSubmit={handleGrantDemo} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Demo Duration (Days)</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        max="30"
                                        required
                                        value={demoDays}
                                        onChange={(e) => setDemoDays(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                </div>

                                <div className="mt-8 flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setIsDemoModalOpen(false)} className="px-5 py-2 rounded-lg font-bold text-xs text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
                                    <button type="submit" className="bg-indigo-600 text-[slate-800] px-5 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-indigo-700 transition-all">Assign Demo</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadDetails;

