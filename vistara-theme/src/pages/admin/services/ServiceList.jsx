import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { canAccess, hasPermission } from '../../../utils/rbac';
import { Link } from 'react-router-dom';
import serviceService from '../../../services/serviceService';
import toast from 'react-hot-toast';

const ServiceList = () => {
    const { user } = useAuth();
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await serviceService.getServicePlans();
            
            // For the cards, we need to fetch durations for each plan
            const fullPlans = await Promise.all(res.data.map(async (plan) => {
                const durRes = await serviceService.getPlanDurations(plan._id);
                const durations = durRes.data;
                
                // Get features for each duration
                for (let i = 0; i < durations.length; i++) {
                    const featRes = await serviceService.getDurationFeatures(durations[i]._id);
                    durations[i].features = featRes.data;
                }
                
                return { ...plan, durations };
            }));

            setPlans(fullPlans);
        } catch (error) {
            toast.error('Failed to load service plans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const togglePlanSelection = (id) => {
        setSelectedPlans(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const confirmDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this plan?")) {
            try {
                await serviceService.deleteServicePlan(id);
                toast.success('Service Plan deleted');
                fetchPlans();
            } catch (error) {
                toast.error('Failed to delete plan');
            }
        }
    };

    const bulkDelete = async () => {
        if (window.confirm(`Delete ${selectedPlans.length} selected plans?`)) {
            try {
                await Promise.all(selectedPlans.map(id => serviceService.deleteServicePlan(id)));
                toast.success('Selected plans deleted');
                setSelectedPlans([]);
                fetchPlans();
            } catch (error) {
                toast.error('Failed to delete some plans');
            }
        }
    };

    return (
        <div className="min-h-full p-4 flex flex-col gap-4 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                    <h1 className="text-[13px] font-bold text-slate-800">Service Plans</h1>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage subscription packages and pricing tiers.</p>
                </div>

                <div className="flex items-center gap-2">
                    {selectedPlans.length > 0 && (
                        <button 
                            onClick={bulkDelete}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-md font-bold text-[10px] hover:bg-rose-100 transition flex items-center gap-1.5"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            Delete Selected ({selectedPlans.length})
                        </button>
                    )}

                    <button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold hover:bg-slate-50 transition"
                    >
                        {showFilters ? 'Hide Filters' : 'Filters'}
                    </button>

                    {(canAccess(user, 'admin') || hasPermission(user, 'create_services')) && (
<Link to="/admin/services/create" className="px-3 py-1.5 bg-[#011d52] text-white rounded-md font-bold text-[10px] hover:bg-[#03173d] transition">
                        + Add New Plan
                    </Link>
)}
                </div>
            </div>

            {showFilters && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 transition-all">
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-[11px] text-slate-800">Filter Tools</div>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Search by Name</label>
                            <input type="text" placeholder="Plan name..." className="w-full mt-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-[11px] outline-none focus:border-[#011d52]" />
                        </div>
                        <div>
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Status</label>
                            <select className="w-full mt-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-[11px] outline-none focus:border-[#011d52] bg-white">
                                <option value="">All Status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Featured</label>
                            <select className="w-full mt-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-[11px] outline-none focus:border-[#011d52] bg-white">
                                <option value="">All</option>
                                <option value="1">Featured</option>
                                <option value="0">Not Featured</option>
                            </select>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading plans...</div>
            ) : plans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <PlanCard 
                            key={plan._id} 
                            plan={plan} 
                            isSelected={selectedPlans.includes(plan._id)}
                            onToggleSelect={() => togglePlanSelection(plan._id)}
                            onDelete={() => confirmDelete(plan._id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No Service Plans Found</p>
                    {(canAccess(user, 'admin') || hasPermission(user, 'create_services')) && (
<Link to="/admin/services/create" className="mt-3 inline-block px-3 py-1.5 bg-[#011d52] text-white font-bold rounded-md text-[10px]">
                        + Add New Plan
                    </Link>
)}
                </div>
            )}
        </div>
    );
};

const PlanCard = ({ plan, isSelected, onToggleSelect, onDelete }) => {
    const [activeDuration, setActiveDuration] = useState(0);
    const durations = plan.durations || [];

    return (
        <div className={`bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border p-4 hover:border-blue-300 transition relative ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>
            <input 
                type="checkbox" 
                checked={isSelected}
                onChange={onToggleSelect}
                className="absolute top-4 left-4 w-3.5 h-3.5 rounded border-slate-300 text-[#011d52] cursor-pointer" 
            />

            <div className="absolute top-4 right-4 flex gap-1">
                {(canAccess(user, 'admin') || hasPermission(user, 'update_services')) && (
<Link to={`/admin/services/edit/${plan._id}`} className="p-1 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded transition">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </Link>
)}
                <button type="button" onClick={onDelete} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>

            <div className="mt-5">
                <h3 className="font-bold text-slate-800 text-[12px] truncate pr-12">{plan.name}</h3>
                
                <div className="flex gap-1.5 mt-1.5">
                    {plan.status ? (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#a7f3d0] text-[#10b981] bg-[#ecfdf5]">Active</span>
                    ) : (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#fde68a] text-[#f59e0b] bg-[#fffbeb]">Inactive</span>
                    )}
                    {plan.featured && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-blue-200 text-[#011d52] bg-blue-50">Featured</span>
                    )}
                </div>

                <div className="my-4">
                    {durations.length > 0 && (
                        <div>
                            <div className="text-[14px] font-black text-slate-800">
                                ₹{durations[activeDuration].price.toLocaleString()}
                            </div>
                            <div className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5 font-bold">Incl. GST • Subscription</div>
                        </div>
                    )}
                </div>

                <div className="flex gap-1.5 mb-4 flex-wrap">
                    {durations.map((d, index) => (
                        <button 
                            key={index}
                            onClick={() => setActiveDuration(index)} 
                            className={`px-2 py-1 rounded-md text-[9px] font-bold transition border ${activeDuration === index ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                        >
                            {d.duration}
                        </button>
                    ))}
                </div>

                <div className="border-t border-slate-100 pt-3">
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">Plan Features</div>
                    <ul className="space-y-1.5 text-[10px] text-slate-600 font-medium">
                        {durations[activeDuration]?.features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex justify-between items-center">
                                <span>{feature.text}</span>
                                <span>
                                    {feature.svg === '✔' ? <span className="text-[#10b981] font-black">✔</span> : 
                                     feature.svg === '✖' ? <span className="text-rose-500 font-black">✖</span> : 
                                     feature.svg === 'Premium' ? <span className="text-amber-500 font-black">★</span> : 
                                     feature.svg}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {(canAccess(user, 'admin') || hasPermission(user, 'update_services')) && (
<Link to={`/admin/services/edit/${plan._id}`} className="mt-4 w-full block text-center py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-[10px] font-bold hover:bg-slate-100 transition">
                    Edit Plan Details
                </Link>
)}
            </div>
        </div>
    );
};

export default ServiceList;
