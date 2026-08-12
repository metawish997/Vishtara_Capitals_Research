import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import serviceService from '../../../services/serviceService';
import toast from 'react-hot-toast';

const CreateService = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        sort_order: 1,
        button_text: 'Subscribe Now',
        featured: false,
        status: true
    });

    const [plans, setPlans] = useState([
        { label: 'Monthly', type: 'monthly', months: 1, selected: true, price: '', features: [{ svg: '✔', text: '' }] },
        { label: 'Half Yearly', type: 'half_yearly', months: 6, selected: false, price: '', features: [{ svg: '✔', text: '' }] },
        { label: 'Yearly', type: 'yearly', months: 12, selected: false, price: '', features: [{ svg: '✔', text: '' }] }
    ]);

    const [customMonths, setCustomMonths] = useState('');

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

        setLoading(true);
        try {
            const payload = {
                ...formData,
                durations: selectedPlans.map(p => ({
                    duration: p.label,
                    duration_type: p.type,
                    duration_months: p.months,
                    price: parseFloat(p.price) || 0,
                    features: p.features.filter(f => f.text.trim()).map(f => ({
                        svg_icon: f.svg,
                        text: f.text
                    }))
                }))
            };

            await serviceService.createServicePlan(payload);
            toast.success('Service Plan created successfully');
            navigate('/admin/services');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create service plan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full p-4 flex flex-col gap-4 bg-white h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {/* FIXED HEADER */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
                    <div>
                        <h1 className="text-[13px] font-bold text-slate-800">Create Service Plan</h1>
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Configure plan details and pricing tiers.</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Link to="/admin/services" className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold hover:bg-slate-50 transition">
                            Cancel
                        </Link>
                        <button type="submit" disabled={loading} className="px-3 py-1.5 bg-[#011d52] hover:bg-[#03173d] text-white rounded-md font-bold text-[10px] transition flex items-center gap-1.5 disabled:opacity-50">
                            {loading ? 'Saving...' : (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    Save Plan
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* SCROLLABLE GRID AREA */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden h-full mt-2">

                    {/* LEFT COLUMN: CONTROLS */}
                    <div className="lg:col-span-1 space-y-4 overflow-y-auto scrollbar-hide pb-20 pr-1" style={{ maxHeight: 'calc(100vh - 120px)' }}>

                        {/* 1. PLAN ESSENTIALS */}
                        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
                            <h3 className="text-[11px] font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">1. Essentials</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Plan Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] outline-none focus:border-[#011d52]"
                                        placeholder="e.g. Basic Intraday"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Short Description</label>
                                    <textarea
                                        name="tagline"
                                        value={formData.tagline}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] outline-none focus:border-[#011d52]"
                                        placeholder="Best for beginners..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Sort Order</label>
                                        <input
                                            type="number"
                                            name="sort_order"
                                            value={formData.sort_order}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] outline-none focus:border-[#011d52]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Button Text</label>
                                        <input
                                            type="text"
                                            name="button_text"
                                            value={formData.button_text}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] outline-none focus:border-[#011d52]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. DURATION SELECTOR */}
                        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
                            <h3 className="text-[11px] font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">2. Durations</h3>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {plans.map((plan, index) => (
                                    <label
                                        key={index}
                                        className={`flex items-center p-2 rounded border cursor-pointer transition-all select-none group ${plan.selected ? 'border-[#011d52] ring-1 ring-[#011d52] bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={plan.selected}
                                            onChange={() => togglePlanSelection(index)}
                                            className="w-3.5 h-3.5 text-[#011d52] border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-[11px] font-bold text-slate-700">{plan.label}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="pt-3 border-t border-slate-100">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Add Custom Months</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={customMonths}
                                        onChange={(e) => setCustomMonths(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomDuration())}
                                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] outline-none focus:border-[#011d52]"
                                        placeholder="e.g. 3"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCustomDuration}
                                        className="bg-[#011d52] text-white px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-[#03173d] transition"
                                    >Add</button>
                                </div>
                            </div>
                        </div>

                        {/* 3. VISIBILITY */}
                        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-4">
                            <h3 className="text-[11px] font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">3. Visibility</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-slate-700 font-bold">Featured Plan</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#011d52]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-slate-700 font-bold">Published Status</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="status"
                                            checked={formData.status}
                                            onChange={handleInputChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PRICING CONFIG */}
                    <div className="lg:col-span-2 space-y-4 overflow-y-auto scrollbar-hide pb-20 pr-1" style={{ maxHeight: 'calc(100vh - 120px)' }}>

                        <div className="flex items-center justify-between sticky top-0 py-2 z-10 border-b border-slate-100 mb-2 bg-white">
                            <h3 className="text-[13px] font-bold text-slate-800">Pricing Tiers Configuration</h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Active selections</p>
                        </div>

                        {plans.map((plan, index) => plan.selected && (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-4 relative group transition-all hover:border-[#011d52]/30 mb-4"
                            >
                                <button
                                    type="button"
                                    onClick={() => togglePlanSelection(index)}
                                    className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Duration Label</label>
                                        <input
                                            type="text"
                                            value={plan.label}
                                            onChange={(e) => handlePlanLabelChange(index, e.target.value)}
                                            className="w-full px-0 py-1 bg-transparent border-b border-slate-200 text-[12px] font-bold text-slate-800 focus:border-[#011d52] outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Price (INR)</label>
                                        <div className="flex items-center">
                                            <span className="text-[12px] font-bold text-slate-500 mr-1">₹</span>
                                            <input
                                                type="number"
                                                value={plan.price}
                                                onChange={(e) => handlePlanPriceChange(index, e.target.value)}
                                                className="w-full px-0 py-1 bg-transparent border-b border-slate-200 text-[12px] font-bold text-slate-800 focus:border-[#011d52] outline-none"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Features Section */}
                                <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                                    <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Features Inclusion</label>
                                        <button
                                            type="button"
                                            onClick={() => addFeature(index)}
                                            className="text-[9px] text-[#011d52] font-bold hover:bg-blue-100 transition px-2 py-1 rounded"
                                        >
                                            + Add Feature
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {plan.features.map((feat, fIndex) => (
                                            <div key={fIndex} className="flex gap-2 items-center">
                                                <div className="w-24 shrink-0 relative">
                                                    <select
                                                        value={feat.svg}
                                                        onChange={(e) => handleFeatureChange(index, fIndex, 'svg', e.target.value)}
                                                        className="w-full pl-6 pr-1 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 appearance-none outline-none focus:border-[#011d52]"
                                                    >
                                                        <option value="✔">Included</option>
                                                        <option value="✖">Excluded</option>
                                                        <option value="Premium">Premium</option>
                                                    </select>
                                                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        {feat.svg === '✔' && <span className="text-emerald-500 text-[10px] font-black">✔</span>}
                                                        {feat.svg === '✖' && <span className="text-rose-500 text-[10px] font-black">✖</span>}
                                                        {feat.svg === 'Premium' && <span className="text-amber-500 text-[10px] font-black">★</span>}
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={feat.text}
                                                    onChange={(e) => handleFeatureChange(index, fIndex, 'text', e.target.value)}
                                                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] focus:border-[#011d52] outline-none font-medium text-slate-700"
                                                    placeholder="Feature description..."
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(index, fIndex)}
                                                    className="p-1.5 text-slate-300 hover:text-rose-500"
                                                    disabled={plan.features.length <= 1}
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {!plans.some(p => p.selected) && (
                            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-200">
                                <p className="text-slate-500 text-xs font-medium">Select durations from the sidebar to configure pricing.</p>
                            </div>
                        )}
                    </div>

                </div>
            </form>
        </div>
    );
};

export default CreateService;
