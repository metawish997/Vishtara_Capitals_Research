import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const RefundList = () => {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchRefunds = async () => {
        try {
            setLoading(true);
            const res = await api.get('/refunds');
            setRefunds(res.data?.data || []);
        } catch (error) {
            toast.error('Failed to load refunds');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRefunds(); }, []);

    const filtered = refunds.filter(r => !search ||
        r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.transaction_id?.toLowerCase().includes(search.toLowerCase())
    );

    const totalAmount = filtered.reduce((acc, r) => acc + (r.amount || 0), 0);

    const getStatusBadge = (status) => {
        const map = {
            'completed': 'bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0]',
            'pending': 'bg-[#fffbeb] text-[#f59e0b] border-[#fde68a]',
            'failed': 'bg-[#fef2f2] text-[#ef4444] border-[#fecaca]',
        };
        return map[status?.toLowerCase()] || map['pending'];
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Refund Ledger</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Audit completed refunds and transaction records</p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <div className="px-3 border-r border-slate-100 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Refunds</p>
                        <p className="text-[14px] font-bold text-slate-800">{refunds.length}</p>
                    </div>
                    <div className="px-3 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Value</p>
                        <p className="text-[14px] font-bold text-slate-800">₹{totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="flex justify-end">
                <div className="relative w-full md:w-64">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by user or transaction..."
                        className="w-full rounded-md pl-8 pr-3 py-1.5 text-[11px] outline-none border border-slate-200 focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 bg-white" />
                    <svg className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading refunds...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No refund records found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Beneficiary</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Subscription</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Transaction</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Amount</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Reason</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Status</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r) => (
                                    <tr key={r._id || r.id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="text-[11px] font-semibold text-slate-800 leading-tight">{r.user?.name || 'N/A'}</p>
                                            <p className="text-[9px] text-slate-400 mt-0.5">UID #{r.user?._id?.slice(-6) || r.user?.id || 'N/A'}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-[10px] font-medium text-slate-700">#{r.subscription?._id?.slice(-6) || r.subscription?.id || 'N/A'}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-[10px] font-mono text-slate-700">{r.transaction_id || r.refund_id || 'N/A'}</p>
                                            <p className="text-[8px] text-slate-400 uppercase tracking-wider mt-0.5">{r.gateway || ''}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-[12px] font-black text-slate-800">₹{(r.amount || 0).toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="px-4 py-3 max-w-[160px]">
                                            <p className="text-[10px] text-slate-500 italic line-clamp-2">{r.reason || '—'}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${getStatusBadge(r.status)}`}>
                                                {r.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link to={`/admin/refunds/${r._id || r.id}`}
                                                className="text-[9px] font-bold uppercase tracking-widest text-[#011d52] hover:underline transition-all">
                                                View
                                            </Link>
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

export default RefundList;
