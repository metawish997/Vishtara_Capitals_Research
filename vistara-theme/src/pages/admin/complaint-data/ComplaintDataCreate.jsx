import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createComplaintData } from '../../../services/complaintService';

const ComplaintDataCreate = () => {
    const { type } = useParams(); // monthly, monthly_trend, annual
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        sno: 1,
        received_from: '',
        period: '',
        pending_last_month: 0,
        carried_forward: 0,
        received: 0,
        resolved: 0,
        total_pending: 0,
        pending_gt_3months: 0,
        avg_resolution_time: 0.00
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submissionData = { 
                ...formData, 
                type,
                sno: Number(formData.sno) || 0,
                pending_last_month: Number(formData.pending_last_month) || 0,
                carried_forward: Number(formData.carried_forward) || 0,
                received: Number(formData.received) || 0,
                resolved: Number(formData.resolved) || 0,
                total_pending: Number(formData.total_pending) || 0,
                pending_gt_3months: Number(formData.pending_gt_3months) || 0,
                avg_resolution_time: Number(formData.avg_resolution_time) || 0
            };
            await createComplaintData(submissionData);
            navigate('/admin/complaint-data');
        } catch (error) {
            console.error('Error saving complaint data:', error);
            alert('Failed to save record: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (type === 'monthly') return 'Add Monthly Data';
        if (type === 'monthly_trend') return 'Add Monthly Trend Data';
        return 'Add Annual Data';
    };

    return (
        <div className="font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xs font-semibold font-bold text-slate-800 tracking-tight leading-none">{getTitle()}</h1>
                    <p className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Create a new complaint record for {type.replace('_', ' ')} statistics.</p>
                </div>
                <Link to="/admin/complaint-data" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors">
                    &larr; BACK TO DASHBOARD
                </Link>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-4 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {type === 'monthly' ? (
                            <>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">S.No.</label>
                                    <input type="number" name="sno" value={formData.sno} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Received From</label>
                                    <input type="text" name="received_from" value={formData.received_from} onChange={handleInputChange} className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" placeholder="e.g. SEBI (SCORES)" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Pending at the end of last month</label>
                                    <input type="number" name="pending_last_month" value={formData.pending_last_month} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{type === 'monthly_trend' ? 'Month' : 'Year'}</label>
                                    <input type="text" name="period" value={formData.period} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" placeholder={type === 'monthly_trend' ? 'e.g. August 2025' : 'e.g. 2024-2025'} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Carried forward from previous {type === 'monthly_trend' ? 'month' : 'year'}</label>
                                    <input type="number" name="carried_forward" value={formData.carried_forward} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">S.No.</label>
                                    <input type="number" name="sno" value={formData.sno} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                </div>
                            </>
                        )}
                        
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Received</label>
                            <input type="number" name="received" value={formData.received} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-blue-500 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Resolved</label>
                            <input type="number" name="resolved" value={formData.resolved} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-emerald-500 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Total Pending</label>
                            <input type="number" name="total_pending" value={formData.total_pending} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-red-500 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                        </div>
                        
                        {type === 'monthly' && (
                            <>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Pending complaints {'>'} 3months</label>
                                    <input type="number" name="pending_gt_3months" value={formData.pending_gt_3months} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-yellow-500 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Average Resolution time (in days)</label>
                                    <input type="number" step="0.01" name="avg_resolution_time" value={formData.avg_resolution_time} onChange={handleInputChange} required className="block w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-all shadow-sm" />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-8 flex items-center justify-end gap-3 border-t border-slate-200">
                        <Link to="/admin/complaint-data" className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-md hover:bg-slate-50 transition shadow-sm">CANCEL</Link>
                        <button type="submit" className="inline-flex items-center px-6 py-2 border border-transparent text-xs font-bold uppercase tracking-widest rounded-md shadow-sm bg-[[#011d52]] text-[#020210] hover:opacity-90 transition-all active:scale-95">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                            Save Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplaintDataCreate;
