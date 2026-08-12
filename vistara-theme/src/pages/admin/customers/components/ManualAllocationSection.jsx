import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import toast from 'react-hot-toast';

const ManualAllocationModal = ({ isOpen, onClose, userId, onAllocationSuccess }) => {
    const [plans, setPlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [durations, setDurations] = useState([]);
    const [selectedDurationId, setSelectedDurationId] = useState('');
    const [amountReceived, setAmountReceived] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [successData, setSuccessData] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchPlans();
        } else {
            // Reset when closed
            setSuccessData(null);
            setSelectedPlanId('');
            setSelectedDurationId('');
            setAmountReceived('');
            setNotes('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedPlanId) {
            fetchDurations(selectedPlanId);
        } else {
            setDurations([]);
            setSelectedDurationId('');
        }
    }, [selectedPlanId]);

    const fetchPlans = async () => {
        try {
            const res = await api.get('/services');
            if (res.data.success) {
                setPlans(res.data.data.filter(p => p.status)); // Active plans
            }
        } catch (error) {
            toast.error('Failed to load service plans');
        }
    };

    const fetchDurations = async (planId) => {
        try {
            const res = await api.get(`/services/${planId}/durations`);
            if (res.data.success) {
                setDurations(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to load plan durations');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessData(null);

        if (!selectedPlanId || !selectedDurationId || !amountReceived) {
            return toast.error('Please fill all required fields');
        }

        try {
            setLoading(true);
            const res = await api.post(`/customers/${userId}/manual-allocation`, {
                planId: selectedPlanId,
                durationId: selectedDurationId,
                amountReceived: Number(amountReceived),
                notes
            });

            if (res.data.success) {
                toast.success('Service manually allocated successfully');
                setSuccessData({
                    planName: res.data.data.planName,
                    amountReceived: amountReceived,
                    grantedDays: res.data.data.grantedDays,
                    startDate: res.data.data.startDate,
                    endDate: res.data.data.endDate,
                    paymentStatus: res.data.data.subscription.payment_status
                });
                // Reset form
                setSelectedPlanId('');
                setSelectedDurationId('');
                setAmountReceived('');
                setNotes('');
                if (onAllocationSuccess) onAllocationSuccess();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to allocate service');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-4 shadow-2xl relative bg-white border border-slate-200">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2.5">
                    <h3 className="text-[11px] font-bold uppercase tracking-tight text-slate-800">Manual Service Allocation</h3>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-md transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                    
                    <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Service Plan</label>
                        <select 
                            className="w-full bg-white border border-slate-200 rounded-md !h-7 !py-0 !px-2 text-[10px] text-slate-800 focus:border-[#011D52] focus:ring-1 focus:ring-[#011D52] outline-none transition-all m-0" 
                            value={selectedPlanId}
                            onChange={(e) => setSelectedPlanId(e.target.value)}
                            required
                        >
                            <option value="">Select Plan</option>
                            {plans.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Plan Duration</label>
                        <select 
                            className="w-full bg-white border border-slate-200 rounded-md !h-7 !py-0 !px-2 text-[10px] text-slate-800 focus:border-[#011D52] focus:ring-1 focus:ring-[#011D52] outline-none transition-all disabled:opacity-50 disabled:bg-slate-50 m-0" 
                            value={selectedDurationId}
                            onChange={(e) => setSelectedDurationId(e.target.value)}
                            required
                            disabled={!selectedPlanId}
                        >
                            <option value="">Select Duration</option>
                            {durations.map(d => (
                                <option key={d._id} value={d._id}>{d.duration} (₹{d.price})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Amount Received (₹)</label>
                        <input 
                            type="number" 
                            className="w-full bg-white border border-slate-200 rounded-md !h-7 !py-0 !px-2 text-[10px] text-slate-800 focus:border-[#011D52] focus:ring-1 focus:ring-[#011D52] outline-none transition-all m-0" 
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                            placeholder="E.g. 5000"
                            min="1"
                            required
                        />
                    </div>

                    <div className="space-y-1 lg:col-span-1">
                        <label className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Notes / Remarks (Optional)</label>
                        <input 
                            type="text" 
                            className="w-full bg-white border border-slate-200 rounded-md !h-7 !py-0 !px-2 text-[10px] text-slate-800 focus:border-[#011D52] focus:ring-1 focus:ring-[#011D52] outline-none transition-all m-0" 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="E.g. Bank Transfer Ref: XYZ"
                        />
                    </div>

                    <div className="lg:col-span-4 flex justify-end mt-1 pt-3 border-t border-slate-100">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-3 !h-7 rounded-md text-[8px] font-bold uppercase tracking-widest transition shadow-sm bg-[#10b981] text-white hover:bg-[#059669] disabled:opacity-50"
                        >
                            {loading ? 'Allocating...' : 'Assign Service'}
                        </button>
                    </div>
                </form>

                {successData && (
                    <div className="mt-4 p-3 rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] animate-fade-in">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 text-[#10b981]">
                            <i className="fa-solid fa-circle-check"></i> Allocation Successful
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <div className="bg-white p-2 rounded border border-[#a7f3d0]/50 shadow-sm">
                                <p className="text-[7px] font-bold uppercase tracking-widest mb-0.5 text-[#059669]">Plan</p>
                                <p className="text-[9px] font-bold text-slate-800">{successData.planName}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-[#a7f3d0]/50 shadow-sm">
                                <p className="text-[7px] font-bold uppercase tracking-widest mb-0.5 text-[#059669]">Granted Days</p>
                                <p className="text-[9px] font-bold text-slate-800">{successData.grantedDays} Days</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-[#a7f3d0]/50 shadow-sm">
                                <p className="text-[7px] font-bold uppercase tracking-widest mb-0.5 text-[#059669]">Amount Received</p>
                                <p className="text-[9px] font-bold text-slate-800">₹{successData.amountReceived}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-[#a7f3d0]/50 shadow-sm">
                                <p className="text-[7px] font-bold uppercase tracking-widest mb-0.5 text-[#059669]">Start Date</p>
                                <p className="text-[9px] font-bold text-slate-800">{new Date(successData.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-[#a7f3d0]/50 shadow-sm">
                                <p className="text-[7px] font-bold uppercase tracking-widest mb-0.5 text-[#059669]">Expiry Date</p>
                                <p className="text-[9px] font-bold text-slate-800">{new Date(successData.endDate).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-[#a7f3d0]/50 shadow-sm flex flex-col justify-center items-start">
                                <p className="text-[7px] font-bold uppercase tracking-widest mb-0.5 text-[#059669]">Payment Status</p>
                                <span className="px-1 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest text-[#10b981] bg-[#d1fae5]">
                                    {successData.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManualAllocationModal;
