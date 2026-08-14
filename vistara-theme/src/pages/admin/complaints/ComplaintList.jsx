import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { canAccess, hasPermission } from '../../../utils/rbac';
import { Link } from 'react-router-dom';
import { getComplaintRecords, deleteComplaintRecord, updateComplaintRecord } from '../../../services/complaintService';
import toast from 'react-hot-toast';

const ComplaintList = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolvingId, setResolvingId] = useState(null);
    const [resolutionData, setResolutionData] = useState({ description: '', date: '' });
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => { fetchComplaints(); }, []);

    const fetchComplaints = async () => {
        try {
            const response = await getComplaintRecords();
            setComplaints(response.data.data || []);
        } catch (error) {
            toast.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    const submitResolution = async (id) => {
        try {
            await updateComplaintRecord(id, {
                status: 'resolved',
                resolution_description: resolutionData.description,
                resolved_date: resolutionData.date
            });
            setComplaints(complaints.map(c =>
                c._id === id ? { ...c, status: 'resolved', resolution_description: resolutionData.description, resolved_date: resolutionData.date } : c
            ));
            setResolvingId(null);
            setResolutionData({ description: '', date: '' });
            toast.success('Complaint resolved');
        } catch (error) {
            toast.error('Failed to resolve complaint');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this complaint record?')) {
            try {
                await deleteComplaintRecord(id);
                setComplaints(complaints.filter(c => c._id !== id));
                toast.success('Complaint deleted');
            } catch (error) {
                toast.error('Failed to delete complaint');
            }
        }
    };

    const filtered = complaints.filter(c => {
        const matchSearch = !search || c.customer_name?.toLowerCase().includes(search.toLowerCase()) || c.complaint_number?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const inputClass = "px-3 py-1.5 border border-slate-200 rounded-md text-[11px] text-slate-800 focus:outline-none focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 transition-all bg-white";

    return (
        <main className="min-h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Complaint Tracking</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage individual investor complaints and resolutions</p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <div className="px-3 border-r border-slate-100 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Pending</p>
                        <p className="text-[14px] font-bold text-amber-500">{complaints.filter(c => c.status !== 'resolved').length}</p>
                    </div>
                    <div className="px-3 border-r border-slate-100 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Resolved</p>
                        <p className="text-[14px] font-bold text-emerald-500">{complaints.filter(c => c.status === 'resolved').length}</p>
                    </div>
                    {(canAccess(user, 'admin') || hasPermission(user, 'create_complaints')) && (
<Link to="/admin/complaints/create"
                        className="px-3 py-1.5 bg-[#011d52] text-white rounded-md font-bold text-[10px] hover:bg-[#02143a] transition">
                        + New Complaint
                    </Link>
)}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="flex items-center gap-3 border-b border-slate-100">
                    {['all', 'pending', 'resolved'].map(f => (
                        <button key={f} onClick={() => setStatusFilter(f)}
                            className={`pb-2 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${statusFilter === f ? 'text-[#011d52] border-[#011d52]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative ml-auto w-full sm:w-64">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or complaint ID..."
                        className="w-full rounded-md pl-8 pr-3 py-1.5 text-[11px] outline-none border border-slate-200 focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 bg-white" />
                    <svg className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading complaints...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No complaints found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Source</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Customer</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Complaint ID</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Date</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Status</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((c) => (
                                    <React.Fragment key={c._id}>
                                        <tr className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                            <td className="px-4 py-3">
                                                <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[8px] font-bold uppercase tracking-wider text-slate-600">
                                                    {c.received_from || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-[11px] font-semibold text-slate-800">{c.customer_name}</p>
                                                <p className="text-[9px] text-slate-400 font-mono">{c.customer_mobile || '-'}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-[10px] font-mono font-medium text-slate-700">{c.complaint_number || '-'}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-[10px] text-slate-600">{c.complaint_date ? new Date(c.complaint_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                {c.status === 'resolved' ? (
                                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#a7f3d0] text-[#10b981] bg-[#ecfdf5]">Resolved</span>
                                                ) : (
                                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#fde68a] text-[#f59e0b] bg-[#fffbeb]">{c.status || 'Pending'}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {c.status !== 'resolved' && (
                                                        <button onClick={() => setResolvingId(resolvingId === c._id ? null : c._id)}
                                                            className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                                                            Resolve
                                                        </button>
                                                    )}
                                                    {(canAccess(user, 'admin') || hasPermission(user, 'update_complaints')) && (
<Link to={`/admin/complaints/edit/${c._id}`}
                                                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </Link>
)}
                                                    {(canAccess(user, 'admin') || hasPermission(user, 'delete_complaints')) && (
<button onClick={() => handleDelete(c._id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
)}
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Resolve inline form */}
                                        {resolvingId === c._id && (
                                            <tr className="bg-slate-50">
                                                <td colSpan="6" className="px-4 py-4">
                                                    <div className="max-w-2xl ml-auto border-l-2 border-[#011d52] pl-5">
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-3">Resolve Complaint #{c.complaint_number}</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            <div className="md:col-span-2">
                                                                <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">Resolution Summary</label>
                                                                <input type="text" value={resolutionData.description}
                                                                    onChange={e => setResolutionData({ ...resolutionData, description: e.target.value })}
                                                                    placeholder="Enter resolution details..."
                                                                    className={`w-full ${inputClass}`} />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">Closing Date</label>
                                                                <input type="date" value={resolutionData.date}
                                                                    onChange={e => setResolutionData({ ...resolutionData, date: e.target.value })}
                                                                    className={`w-full ${inputClass}`} />
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end gap-2 mt-3">
                                                            <button onClick={() => setResolvingId(null)}
                                                                className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 px-3 py-1.5 transition-colors">
                                                                Cancel
                                                            </button>
                                                            <button onClick={() => submitResolution(c._id)}
                                                                className="px-4 py-1.5 bg-[#011d52] text-white rounded-md text-[9px] font-bold uppercase tracking-widest hover:bg-[#02143a] transition-all">
                                                                Mark Resolved
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ComplaintList;
