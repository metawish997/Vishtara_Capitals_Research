import React, { useState, useEffect } from 'react';
import couponService from '../../../services/couponService';
import toast from 'react-hot-toast';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [form, setForm] = useState({
        code: '',
        type: 'flat',
        value: '',
        min_amount: '',
        per_user_limit: '',
        global_limit: '',
        expires_at: '',
        active: true
    });

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await couponService.getCoupons();
            setCoupons(res.data);
        } catch (error) {
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleOpenModal = (coupon = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setForm({
                ...coupon,
                expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : ''
            });
        } else {
            setEditingCoupon(null);
            setForm({
                code: '',
                type: 'flat',
                value: '',
                min_amount: '',
                per_user_limit: '',
                global_limit: '',
                expires_at: '',
                active: true
            });
        }
        setShowModal(true);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await couponService.updateCoupon(id, { active: !currentStatus });
            toast.success('Status updated');
            fetchCoupons();
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCoupon) {
                await couponService.updateCoupon(editingCoupon._id, form);
                toast.success('Coupon updated successfully');
            } else {
                await couponService.createCoupon(form);
                toast.success('Coupon created successfully');
            }
            setShowModal(false);
            fetchCoupons();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const confirmDelete = (id) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await couponService.deleteCoupon(deletingId);
            toast.success('Coupon deleted');
            setShowDeleteModal(false);
            fetchCoupons();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="min-h-full font-plus-jakarta" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Quick Stats (Ultra-Compact & Fully Colored) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div 
                    className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', boxShadow: '0 2px 10px -4px #05966940' }}
                >
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">🏷️</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#059669' }}>
                                Total Registry
                            </h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">
                        {coupons.length}
                    </p>
                </div>
                
                <div 
                    className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', boxShadow: '0 2px 10px -4px #4f46e540' }}
                >
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">✅</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#4f46e5' }}>
                                Active Codes
                            </h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">
                        {coupons.filter(c => c.active).length}
                    </p>
                </div>
                
                <div 
                    className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', boxShadow: '0 2px 10px -4px #d9770640' }}
                >
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">🛒</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#d97706' }}>
                                Global Redeemed
                            </h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">
                        {coupons.reduce((acc, c) => acc + (c.used_global || 0), 0)}
                    </p>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                {/* Header Row */}
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[12px] font-bold text-slate-800">Coupon Management</h3>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                            <span className="text-[9px] text-slate-400 font-medium">Manage and track discount campaigns</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleOpenModal()}
                            className="text-[10px] font-semibold bg-[#011d52] text-white border border-[#011d52] px-2.5 py-1 rounded-md hover:bg-[#03173d] transition-colors flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                            Create New Coupon
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-white">
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Coupon Code</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Benefit Type</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Global Limit</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">User Limit</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Expiry</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Status</th>
                                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[slate-200]">
                                 {loading ? (
                                     <tr><td colSpan="7" className="text-center py-10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">SYNCING DATA...</td></tr>
                                 ) : coupons.length === 0 ? (
                                     <tr><td colSpan="7" className="text-center py-10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">No coupons found. Create one to get started.</td></tr>
                                 ) : coupons.map((coupon) => (
                                     <tr key={coupon._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                         <td className="px-4 py-2">
                                             <span className="font-mono font-medium text-slate-500 group-hover:text-[#011d52] transition-colors text-[10px]">{coupon.code}</span>
                                             <div className="mt-0.5 text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                                                 Min: ₹{coupon.min_amount || 0}
                                             </div>
                                         </td>
                                         <td className="px-4 py-2">
                                             <div className="flex flex-col">
                                                 <span className="text-[11px] font-semibold text-slate-800 leading-tight">{coupon.value}</span>
                                                 <span className="text-[9px] text-slate-400 uppercase font-semibold">{coupon.type === 'flat' ? 'Flat INR' : '% Percent'}</span>
                                             </div>
                                         </td>
                                         <td className="px-4 py-2">
                                             <div className="flex items-center gap-1.5">
                                                 <span className="text-[11px] font-semibold text-slate-800">{coupon.used_global || 0}</span>
                                                 <span className="text-slate-400 text-[10px]">/</span>
                                                 <span className="text-[11px] font-semibold text-slate-800">{coupon.global_limit || '∞'}</span>
                                             </div>
                                             <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                 <div className="h-full bg-slate-400 transition-all duration-500" style={{ width: coupon.global_limit ? `${Math.min((coupon.used_global / coupon.global_limit) * 100, 100)}%` : '0%' }}></div>
                                             </div>
                                         </td>
                                         <td className="px-4 py-2">
                                             <div className="inline-flex items-center px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[8px] font-bold text-slate-500 uppercase">
                                                 {coupon.per_user_limit ? `${coupon.per_user_limit} Times` : 'Unlimited'}
                                             </div>
                                         </td>
                                         <td className="px-4 py-2">
                                             <span className="text-[9px] font-medium text-slate-500">{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Permanent'}</span>
                                         </td>
                                         <td className="px-4 py-2">
                                             <label className="relative inline-flex items-center cursor-pointer">
                                                 <input type="checkbox" checked={coupon.active} onChange={() => handleToggleStatus(coupon._id, coupon.active)} className="sr-only peer" />
                                                 <div className="w-7 h-4 bg-slate-200 rounded-full peer peer-checked:bg-[#10b981] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-3"></div>
                                             </label>
                                         </td>
                                         <td className="px-4 py-2 text-right">
                                             <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <button onClick={() => handleOpenModal(coupon)} className="p-1 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded transition-colors">
                                                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                 </button>
                                                 <button onClick={() => confirmDelete(coupon._id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                                                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                 </button>
                                             </div>
                                         </td>
                                     </tr>
                                 ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            {/* Form Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-xs font-semibold font-bold text-slate-800">{editingCoupon ? 'Modify Coupon' : 'New Promotional Code'}</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Institutional Campaign Settings</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-800 transition-colors p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Unique Access Code *</label>
                                    <input 
                                        value={form.code} 
                                        onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                                        className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-md outline-none focus:border-[[#011d52]] transition-colors font-mono font-bold tracking-widest text-xs text-slate-800" 
                                        placeholder="e.g. LAUNCH2026" 
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Discount Type</label>
                                    <select 
                                        value={form.type} 
                                        onChange={(e) => setForm({...form, type: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-md outline-none focus:border-[[#011d52]] transition-colors text-xs text-slate-800">
                                        <option value="flat">Flat Discount (INR)</option>
                                        <option value="percent">Percentage Off (%)</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Benefit Value *</label>
                                    <input 
                                        type="number"
                                        value={form.value} 
                                        onChange={(e) => setForm({...form, value: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-md outline-none focus:border-[[#011d52]] transition-colors text-xs text-slate-800" 
                                        placeholder="0.00" 
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2 mt-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Usage Guardrails</span>
                                        <span className="h-px flex-1 bg-[slate-200]"></span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Min. Transaction (₹)</label>
                                    <input 
                                        type="number"
                                        value={form.min_amount} 
                                        onChange={(e) => setForm({...form, min_amount: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-md outline-none focus:border-[[#011d52]] transition-colors text-xs text-slate-800" 
                                        placeholder="Optional"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Global Usage Limit</label>
                                    <input 
                                        type="number"
                                        value={form.global_limit} 
                                        onChange={(e) => setForm({...form, global_limit: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-md outline-none focus:border-[[#011d52]] transition-colors text-xs text-slate-800" 
                                        placeholder="Unlimited if empty"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Per-User Limit</label>
                                    <input 
                                        type="number"
                                        value={form.per_user_limit} 
                                        onChange={(e) => setForm({...form, per_user_limit: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-md outline-none focus:border-[[#011d52]] transition-colors text-xs text-slate-800" 
                                        placeholder="Unlimited if empty"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Expiration Date</label>
                                    <input 
                                        type="date"
                                        value={form.expires_at} 
                                        onChange={(e) => setForm({...form, expires_at: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-md outline-none focus:border-[[#011d52]] transition-colors text-xs text-slate-800"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3 justify-end border-t border-slate-200 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-[10px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest transition-colors">Discard</button>
                                <button type="submit" className="bg-[slate-800] text-[slate-50] px-6 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm hover:opacity-90 transition-all flex items-center justify-center">
                                    {editingCoupon ? 'Apply Updates' : 'Launch Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl p-4 max-w-sm w-full text-center shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </div>
                        <h3 className="text-xs font-semibold font-bold text-slate-800 mb-1">Delete Coupon?</h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6">This action is permanent and will invalidate the code.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-md font-bold text-[10px] uppercase tracking-widest hover:text-slate-800 transition-colors">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-slate-800 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-red-700 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
