import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import serviceService from '../../../services/serviceService';
import toast from 'react-hot-toast';

const EditService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        sort_order: 1,
        button_text: 'Update Now',
        featured: false,
        status: true
    });

    const [plans, setPlans] = useState([]);
    const [customMonths, setCustomMonths] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await serviceService.getServicePlanById(id);
                const plan = res.data;
                
                setFormData({
                    name: plan.name,
                    tagline: plan.tagline,
                    sort_order: plan.sort_order,
                    button_text: plan.button_text,
                    featured: plan.featured,
                    status: plan.status
                });

                // Default options to show in sidebar
                const defaultOptions = [
                    { label: 'Monthly', type: 'monthly', months: 1, selected: false, price: '', features: [{ svg: '✔', text: '' }] },
                    { label: 'Half Yearly', type: 'half_yearly', months: 6, selected: false, price: '', features: [{ svg: '✔', text: '' }] },
                    { label: 'Yearly', type: 'yearly', months: 12, selected: false, price: '', features: [{ svg: '✔', text: '' }] }
                ];

                // Merge with actual data
                const actualPlans = plan.durations.map(d => ({
                    label: d.duration,
                    type: d.duration_type,
                    months: d.duration_months,
                    selected: true,
                    price: d.price,
                    features: d.features.map(f => ({
                        svg: f.svg || '✔',
                        text: f.text
                    }))
                }));

                // Combine defaults and actuals, removing duplicates by months
                const combined = [...actualPlans];
                defaultOptions.forEach(opt => {
                    if (!combined.some(c => c.months === opt.months)) {
                        combined.push(opt);
                    }
                });

                setPlans(combined.sort((a, b) => a.months - b.months));
            } catch (error) {
                toast.error('Failed to load service plan');
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const togglePlanSelection = (index) => {
        const newPlans = [...plans];
        newPlans[index].selected = !newPlans[index].selected;
        setPlans(newPlans);
    };

    const addCustomDuration = () => {
        const months = parseInt(customMonths);
        if (isNaN(months) || months <= 0) {
            toast.error('Please enter valid months');
            return;
        }
        
        const existingIndex = plans.findIndex(p => p.months === months);
        if (existingIndex !== -1) {
            if (!plans[existingIndex].selected) {
                const newPlans = [...plans];
                newPlans[existingIndex].selected = true;
                setPlans(newPlans);
                setCustomMonths('');
                toast.success(`Enabled existing duration!`);
            } else {
                toast.error('Duration is already enabled!');
            }
            return;
        }

        const label = `${months} ${months === 1 ? 'Month' : 'Months'}`;

        setPlans([...plans, {
            label: label,
            type: 'custom',
            months: months,
            selected: true,
            price: '',
            features: [{ svg: '✔', text: '' }]
        }]);
        setCustomMonths('');
    };

    const handlePlanPriceChange = (index, value) => {
        const newPlans = [...plans];
        newPlans[index].price = value;
        setPlans(newPlans);
    };

    const handlePlanLabelChange = (index, value) => {
        const newPlans = [...plans];
        newPlans[index].label = value;
        setPlans(newPlans);
    };

    const addFeature = (planIndex) => {
        const newPlans = [...plans];
        newPlans[planIndex].features.push({ svg: '✔', text: '' });
        setPlans(newPlans);
    };

    const removeFeature = (planIndex, featIndex) => {
        const newPlans = [...plans];
        if (newPlans[planIndex].features.length > 1) {
            newPlans[planIndex].features.splice(featIndex, 1);
            setPlans(newPlans);
        }
    };

    const handleFeatureChange = (planIndex, featIndex, field, value) => {
        const newPlans = [...plans];
        newPlans[planIndex].features[featIndex][field] = value;
        setPlans(newPlans);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedPlans = plans.filter(p => p.selected);
        if (selectedPlans.length === 0) {
            return toast.error('Select at least one pricing plan');
        }

        setSaving(true);
        try {
            const payload = {
                ...formData,
                durations: selectedPlans.map(p => ({
                    duration: p.label,
                    duration_type: p.type,
                    duration_months: p.months,
                    price: parseFloat(p.price) || 0,
                    features: p.features.filter(f => f.text.trim())
                }))
            };
            
            await serviceService.updateServicePlan(id, payload);
            toast.success('Service Plan updated successfully');
            navigate('/admin/services');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update service plan');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="mx-auto h-screen flex flex-col bg-transparent">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {/* FIXED HEADER */}
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                        <h1 className="text-xs font-semibold font-bold text-slate-800">Edit Service Plan</h1>
                        <p className="text-xs text-slate-500">Updating: <span className="font-semibold text-[[#011d52]]">{formData.name}</span></p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/admin/services" className="px-4 py-2 bg-white border border-slate-200 rounded text-xs font-medium text-slate-500 hover:bg-slate-50 transition">
                            Cancel
                        </Link>
                        <button type="submit" disabled={saving} className="px-5 py-2 bg-[[#011d52]] hover:bg-[[#011d52]] disabled:opacity-50 text-[#020210] text-xs font-semibold rounded-lg shadow-sm font-bold-sm transition flex items-center gap-2">
                            {saving ? 'Updating...' : (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    Update Plan
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden h-full">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-1 space-y-5 overflow-y-auto scrollbar-hide pb-20 pr-1" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">1. Essentials</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Plan Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none transition" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Short Description</label>
                                    <textarea 
                                        name="tagline"
                                        value={formData.tagline}
                                        onChange={handleInputChange}
                                        rows="2" 
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none transition" 
                                        required
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sort Order</label>
                                        <input 
                                            type="number" 
                                            name="sort_order"
                                            value={formData.sort_order}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none transition" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Button Text</label>
                                        <input 
                                            type="text" 
                                            name="button_text"
                                            value={formData.button_text}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none transition" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">2. Manage Durations</h3>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {plans.map((plan, index) => (
                                    <label 
                                        key={index}
                                        className={`flex items-center p-2 rounded border cursor-pointer transition-all select-none group ${plan.selected ? 'border-blue-500 bg-[[#011d52]]/10' : 'border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        <input 
                                            type="checkbox" 
                                            checked={plan.selected}
                                            onChange={() => togglePlanSelection(index)}
                                            className="w-3.5 h-3.5 text-[[#011d52]] border-gray-300 rounded" 
                                        />
                                        <span className="ml-2 text-[11px] font-semibold text-gray-700">{plan.label}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="pt-3 border-t border-slate-200">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Add Custom Months</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        value={customMonths}
                                        onChange={(e) => setCustomMonths(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomDuration())}
                                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded outline-none focus:border-[[#011d52]]" 
                                        placeholder="e.g. 3" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={addCustomDuration}
                                        className="bg-[[#011d52]] text-[#020210] px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-800 transition"
                                    >Add</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">3. Visibility</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 font-medium">Featured Plan</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-8 h-4 bg-[slate-200] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[[#011d52]]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 font-medium">Published Status</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="status"
                                            checked={formData.status}
                                            onChange={handleInputChange}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-8 h-4 bg-[slate-200] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 space-y-4 overflow-y-auto scrollbar-hide pb-20 pr-1" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                        <div className="flex items-center justify-between sticky top-0 bg-transparent backdrop-blur-md py-2 z-10 border-b border-slate-200 mb-2">
                            <h3 className="text-xs font-bold text-slate-800">Pricing Tiers Configuration</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Scroll to edit features</p>
                        </div>

                        {plans.map((plan, index) => plan.selected && (
                            <div 
                                key={index}
                                className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 relative group transition-all hover:border-blue-200 mb-4"
                            >
                                <div className="grid grid-cols-2 gap-6 mb-5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duration Label</label>
                                        <input 
                                            type="text" 
                                            value={plan.label}
                                            onChange={(e) => handlePlanLabelChange(index, e.target.value)}
                                            className="w-full px-0 py-1 bg-transparent border-b border-slate-200 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Price (INR)</label>
                                        <div className="flex items-center">
                                            <span className="text-xs font-bold text-slate-500 mr-1">₹</span>
                                            <input 
                                                type="number" 
                                                value={plan.price}
                                                onChange={(e) => handlePlanPriceChange(index, e.target.value)}
                                                className="w-full px-0 py-1 bg-transparent border-b border-slate-200 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded p-4 border border-slate-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Features Inclusion</label>
                                        <button 
                                            type="button" 
                                            onClick={() => addFeature(index)} 
                                            className="text-[10px] bg-[[#011d52]]/10 text-[[#011d52]] px-2 py-1 rounded font-bold hover:bg-blue-100 transition"
                                        >
                                            + Add Feature
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {plan.features.map((feat, fIndex) => (
                                            <div key={fIndex} className="flex gap-2 items-center">
                                                <div className="w-28 shrink-0 relative">
                                                    <select 
                                                        value={feat.svg}
                                                        onChange={(e) => handleFeatureChange(index, fIndex, 'svg', e.target.value)}
                                                        className="w-full pl-7 pr-2 py-1.5 bg-white border border-slate-200 rounded text-[11px] appearance-none outline-none focus:border-[[#011d52]]"
                                                    >
                                                        <option value="✔">Included</option>
                                                        <option value="✖">Excluded</option>
                                                        <option value="Premium">Premium</option>
                                                    </select>
                                                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        {feat.svg === '✔' && <span className="text-green-500 text-[10px] font-bold">✔</span>}
                                                        {feat.svg === '✖' && <span className="text-red-400 text-[10px] font-bold">✖</span>}
                                                        {feat.svg === 'Premium' && <span className="text-[[#011d52]] text-[10px] font-bold">★</span>}
                                                    </div>
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={feat.text}
                                                    onChange={(e) => handleFeatureChange(index, fIndex, 'text', e.target.value)}
                                                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-[#011d52]/20 outline-none" 
                                                    placeholder="Feature description..." 
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeFeature(index, fIndex)} 
                                                    className="p-1.5 text-gray-300 hover:text-red-400"
                                                    disabled={plan.features.length <= 1}
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditService;
