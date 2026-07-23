import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchReviews = async () => {
        try {
            const { data } = await api.get('/reviews');
            setReviews(data.data || []);
        } catch (error) {
            toast.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/reviews/${id}`, { status });
            setReviews(reviews.map(r => r._id === id ? { ...r, status } : r));
            toast.success(`Review ${status === 1 ? 'Approved' : 'Rejected'}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await api.delete(`/reviews/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
            toast.success('Review deleted');
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    const getStatusBadge = (status) => {
        if (status === 1) return <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#a7f3d0] text-[#10b981] bg-[#ecfdf5]">Approved</span>;
        if (status === 2) return <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#fecaca] text-[#ef4444] bg-[#fef2f2]">Rejected</span>;
        return <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#fde68a] text-[#f59e0b] bg-[#fffbeb]">Pending</span>;
    };

    const filtered = reviews.filter(r => {
        const matchSearch = !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.review?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || (filterStatus === 'pending' && r.status === 0) || (filterStatus === 'approved' && r.status === 1) || (filterStatus === 'rejected' && r.status === 2);
        return matchSearch && matchStatus;
    });

    return (
        <main className="min-h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Reviews</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Moderate and curate customer feedback</p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <div className="px-3 border-r border-slate-100 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Pending</p>
                        <p className="text-[14px] font-bold text-slate-800">{reviews.filter(r => r.status === 0).length}</p>
                    </div>
                    <div className="px-3 border-r border-slate-100 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Approved</p>
                        <p className="text-[14px] font-bold text-slate-800">{reviews.filter(r => r.status === 1).length}</p>
                    </div>
                    <div className="px-3 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total</p>
                        <p className="text-[14px] font-bold text-slate-800">{reviews.length}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full md:w-auto border-b border-slate-100">
                    {['all', 'pending', 'approved', 'rejected'].map(tab => (
                        <button key={tab} onClick={() => setFilterStatus(tab)}
                            className={`pb-2 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${filterStatus === tab ? 'text-[#011d52] border-[#011d52]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search reviewer or content..."
                        className="w-full rounded-md pl-8 pr-3 py-1.5 text-[11px] outline-none border border-slate-200 focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 bg-white" />
                    <svg className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading reviews...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No reviews found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Reviewer</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Feedback</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Rating</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-center">Status</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r) => (
                                    <tr key={r._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-[#011d52] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                                    {r.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-semibold text-slate-800 leading-tight">{r.name}</p>
                                                    <p className="text-[9px] text-slate-400">{r.city || 'Unknown City'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 max-w-xs">
                                            <p className="text-[11px] text-slate-600 italic line-clamp-2 leading-snug">"{r.review}"</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-amber-400 text-[12px]">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {getStatusBadge(r.status)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                {r.status !== 1 && (
                                                    <button onClick={() => handleUpdateStatus(r._id, 1)}
                                                        className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                                                        Approve
                                                    </button>
                                                )}
                                                {r.status !== 2 && (
                                                    <button onClick={() => handleUpdateStatus(r._id, 2)}
                                                        className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 transition-colors">
                                                        Reject
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(r._id)}
                                                    className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors">
                                                    Delete
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
        </main>
    );
};

export default ReviewList;
