import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const InquiryList = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchInquiries = async () => {
        try {
            const { data } = await api.get('/inquiries');
            setInquiries(data.data || []);
        } catch (error) {
            toast.error('Failed to fetch inquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInquiries(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
        try {
            await api.delete(`/inquiries/${id}`);
            setInquiries(inquiries.filter(iq => iq._id !== id));
            if (selectedInquiry?._id === id) setSelectedInquiry(null);
            toast.success('Inquiry deleted');
        } catch (error) {
            toast.error('Failed to delete inquiry');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/inquiries/${id}`, { status });
            setInquiries(inquiries.map(iq => iq._id === id ? { ...iq, status } : iq));
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusBadge = (status) => {
        if (status === 1) return <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-blue-200 text-[#011d52] bg-blue-50">Contacted</span>;
        if (status === 2) return <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#a7f3d0] text-[#10b981] bg-[#ecfdf5]">Resolved</span>;
        return <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#fde68a] text-[#f59e0b] bg-[#fffbeb]">New</span>;
    };

    const filtered = inquiries.filter(iq => {
        const fullName = `${iq.first_name || ''} ${iq.last_name || ''}`.toLowerCase();
        const matchSearch = !search || fullName.includes(search.toLowerCase()) || iq.email?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all'
            || (statusFilter === 'new' && (iq.status === 0 || iq.status === undefined))
            || (statusFilter === 'contacted' && iq.status === 1)
            || (statusFilter === 'resolved' && iq.status === 2);
        return matchSearch && matchStatus;
    });

    return (
        <main className="min-h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Inquiries</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Customer communications and support requests</p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <div className="px-3 border-r border-slate-100 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">New</p>
                        <p className="text-[14px] font-bold text-amber-500">{inquiries.filter(iq => !iq.status || iq.status === 0).length}</p>
                    </div>
                    <div className="px-3 border-r border-slate-100 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total</p>
                        <p className="text-[14px] font-bold text-slate-800">{inquiries.length}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="flex items-center gap-3 border-b border-slate-100">
                    {['all', 'new', 'contacted', 'resolved'].map(f => (
                        <button key={f} onClick={() => setStatusFilter(f)}
                            className={`pb-2 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${statusFilter === f ? 'text-[#011d52] border-[#011d52]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative ml-auto w-full sm:w-64">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full rounded-md pl-8 pr-3 py-1.5 text-[11px] outline-none border border-slate-200 focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 bg-white" />
                    <svg className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading inquiries...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No inquiries found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Contact</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Source</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Message</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Status</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((iq) => (
                                    <tr key={iq._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="text-[11px] font-semibold text-slate-800 leading-tight">{iq.first_name} {iq.last_name}</p>
                                            <p className="text-[9px] text-slate-400 mt-0.5">{iq.email}</p>
                                            <p className="text-[9px] text-slate-400 font-mono">{iq.phone}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {iq.user ? (
                                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#a7f3d0] text-[#10b981] bg-[#ecfdf5]">Auth User</span>
                                            ) : (
                                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-slate-200 text-slate-500 bg-slate-50">Guest</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 max-w-[200px]">
                                            <p className="text-[10px] text-slate-500 italic line-clamp-2">"{iq.message}"</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(iq.status)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                {(!iq.status || iq.status === 0) && (
                                                    <button onClick={() => handleUpdateStatus(iq._id, 1)}
                                                        className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded bg-blue-50 text-[#011d52] border border-blue-200 hover:bg-blue-100 transition-colors">
                                                        Contact
                                                    </button>
                                                )}
                                                {iq.status !== 2 && (
                                                    <button onClick={() => handleUpdateStatus(iq._id, 2)}
                                                        className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                                                        Resolve
                                                    </button>
                                                )}
                                                <button onClick={() => setSelectedInquiry(selectedInquiry?._id === iq._id ? null : iq)}
                                                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(iq._id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Inquiry Detail Side Panel */}
            {selectedInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-[12px] font-bold text-slate-800">Inquiry Details</h3>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Ref #{selectedInquiry._id?.slice(-8)}</p>
                            </div>
                            <button onClick={() => setSelectedInquiry(null)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors text-xs">✕</button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                                    <p className="text-[11px] font-semibold text-slate-800 mt-0.5">{selectedInquiry.first_name} {selectedInquiry.last_name}</p>
                                </div>
                                <div>
                                    <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Source</label>
                                    <p className={`text-[11px] font-semibold mt-0.5 ${selectedInquiry.user ? 'text-emerald-600' : 'text-slate-500'}`}>
                                        {selectedInquiry.user ? 'Authenticated User' : 'Guest'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Email</label>
                                    <p className="text-[11px] font-semibold text-slate-800 mt-0.5">{selectedInquiry.email}</p>
                                </div>
                                <div>
                                    <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Phone</label>
                                    <p className="text-[11px] font-mono font-semibold text-slate-800 mt-0.5">{selectedInquiry.phone}</p>
                                </div>
                                {selectedInquiry.subject && (
                                    <div className="col-span-2">
                                        <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Subject</label>
                                        <p className="text-[11px] font-semibold text-slate-800 mt-0.5">{selectedInquiry.subject}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Message</label>
                                <div className="mt-1.5 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                    <p className="text-[11px] text-slate-600 italic leading-relaxed">"{selectedInquiry.message}"</p>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2 border-t border-slate-100">
                                <button onClick={() => setSelectedInquiry(null)}
                                    className="px-4 py-1.5 bg-[#011d52] text-white rounded-md text-[9px] font-bold uppercase tracking-widest hover:bg-[#02143a] transition-all">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default InquiryList;
