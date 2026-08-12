import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Eye, Search, Clock, Image as ImageIcon, Filter, X } from 'lucide-react';
import api from '../../../services/api';

const ManualPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    const [statusFilter, setStatusFilter] = useState('All');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const filterRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowAdvancedFilters(false);
            }
        };
        if (showAdvancedFilters) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showAdvancedFilters]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/manual-payments');
            if (response.data.success) {
                setPayments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to load manual payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this payment?`)) return;

        try {
            setProcessingId(id);
            const response = await api.put(`/manual-payments/${id}/status`, { status });
            if (response.data.success) {
                toast.success(`Payment ${status} successfully`);
                fetchPayments(); // Refresh list
            }
        } catch (error) {
            console.error(`Error updating payment:`, error);
            toast.error(error.response?.data?.message || `Failed to update payment`);
        } finally {
            setProcessingId(null);
        }
    };

    const filteredPayments = payments.filter(payment => {
        const term = searchTerm.toLowerCase();
        const matchSearch = (
            payment.user?.name?.toLowerCase().includes(term) ||
            payment.user?.email?.toLowerCase().includes(term) ||
            payment.user?.phone?.toLowerCase().includes(term) ||
            payment.plan_name?.toLowerCase().includes(term)
        );
        const matchStatus = statusFilter === 'All' || payment.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#a7f3d0] text-[#10b981] bg-[#ecfdf5]">Approved</span>;
            case 'rejected':
                return <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#fecaca] text-[#ef4444] bg-[#fef2f2]">Rejected</span>;
            default:
                return <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#fde68a] text-[#f59e0b] bg-[#fffbeb] flex items-center gap-1 w-max"><Clock className="w-2.5 h-2.5" /> Pending</span>;
        }
    };

    return (
        <div className="min-h-full p-4 flex flex-col gap-4 bg-white">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                {/* Table Header with Search & Filter */}
                <div className="px-4 py-3 bg-slate-50/20 border-b border-slate-100 flex justify-between items-center gap-4">
                    <div className="flex-1 max-w-[280px] relative flex items-center group">
                        <Search className="absolute left-2.5 w-3 h-3 text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search users or plans..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-800 rounded-full ps-8 pl-7 pr-3 py-1 text-[9px] font-bold text-slate-800 outline-none focus:border-blue-600 transition-all placeholder-slate-400"
                        />
                    </div>

                    <div ref={filterRef} className="relative flex items-center gap-2 shrink-0">
                        {statusFilter !== 'All' && (
                            <button
                                onClick={() => setStatusFilter('All')}
                                className="flex items-center justify-center w-6 h-6 rounded-[4px] text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-slate-200 hover:border-rose-500/30"
                                title="Clear Filter"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider transition-all border ${showAdvancedFilters ? 'bg-[#011d52]/10 text-[#011d52] border-[#011d52]/30' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-200/10 shadow-sm'}`}
                        >
                            <Filter className="w-3 h-3" />
                            Filters
                            {statusFilter !== 'All' && (
                                <span className="ml-0.5 bg-[#011d52] text-[#020210] px-1.5 py-0.5 rounded-full text-[8px] font-black leading-none">
                                    1
                                </span>
                            )}
                        </button>

                        {showAdvancedFilters && (
                            <div className="absolute top-[calc(100%+8px)] right-0 w-[200px] bg-white border border-slate-200 rounded-[6px] shadow-2xl p-4 z-50 flex flex-col gap-3">
                                <div>
                                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[4px] px-3 py-1.5 text-[10px] font-bold text-slate-800 outline-none cursor-pointer focus:border-[#011d52]">
                                        <option value="All">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Date</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">User</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Plan Details</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Amount</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Proof</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Status</th>
                                <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading payments...</td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">No manual payments found.</td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <div className="text-[10px] font-mono font-medium text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</div>
                                            <div className="text-[8px] text-slate-400 mt-0.5">{new Date(payment.createdAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="font-semibold text-slate-800 text-[11px] leading-tight">{payment.user?.name || 'Unknown'}</div>
                                            <div className="text-[9px] text-slate-400 mt-0.5">{payment.user?.email}</div>
                                            <div className="text-[9px] text-slate-400 font-mono">{payment.user?.phone}</div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="font-semibold text-slate-700 text-[10px]">{payment.plan_name}</div>
                                            <div className="text-[9px] text-slate-500">{payment.duration_name}</div>
                                            {payment.coupon_code && (
                                                <div className="text-[8px] bg-blue-50 text-[#011d52] px-1.5 py-0.5 rounded mt-1 inline-block border border-blue-100">Code: {payment.coupon_code}</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 font-bold text-slate-800 text-[11px]">
                                            ₹{payment.amount?.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2">
                                            {payment.screenshot ? (
                                                <button
                                                    onClick={() => setSelectedImage(payment.screenshot)}
                                                    className="flex items-center gap-1.5 text-[9px] font-bold text-[#011d52] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors border border-blue-100"
                                                >
                                                    <ImageIcon className="w-3 h-3" /> View Proof
                                                </button>
                                            ) : (
                                                <span className="text-[9px] text-slate-400 italic">No File</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {getStatusBadge(payment.status)}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {payment.status === 'pending' && (
                                                <div className="flex justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleUpdateStatus(payment._id, 'approved')}
                                                        disabled={processingId === payment._id}
                                                        className="p-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded transition-colors disabled:opacity-50"
                                                        title="Approve Payment"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(payment._id, 'rejected')}
                                                        disabled={processingId === payment._id}
                                                        className="p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded transition-colors disabled:opacity-50"
                                                        title="Reject Payment"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-slate-200">
                        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-[12px] text-slate-800">Payment Proof</h3>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="text-slate-400 hover:text-rose-500 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 flex justify-center bg-slate-50 min-h-[300px]">
                            <img
                                src={selectedImage}
                                alt="Payment Proof"
                                className="max-w-full max-h-[60vh] object-contain rounded-lg border border-slate-200 shadow-sm bg-white"
                            />
                        </div>
                        <div className="px-4 py-3 bg-white border-t border-slate-100 flex justify-end">
                            <a
                                href={selectedImage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-1.5 bg-[#011d52] hover:bg-[#03173d] text-white text-[10px] font-bold rounded-md transition-colors"
                            >
                                Open Original
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManualPayments;
