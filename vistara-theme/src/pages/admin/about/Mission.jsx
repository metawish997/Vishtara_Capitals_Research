import React, { useState, useEffect } from 'react';
import aboutService from '../../../services/aboutService';
import { toast } from 'react-hot-toast';

const Mission = () => {
    const [form, setForm] = useState({
        badge: '',
        title: '',
        mission_text: '',
        is_active: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await aboutService.getMission();
            if (res.data.data) {
                setForm({
                    badge: res.data.data.badge || '',
                    title: res.data.data.title || '',
                    mission_text: res.data.data.mission_text || '',
                    is_active: res.data.data.is_active ?? true,
                    _id: res.data.data._id
                });
            }
        } catch (err) {
            toast.error('Failed to load mission');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await aboutService.updateMission(form);
            toast.success('Mission updated');
            fetchData();
        } catch (err) {
            toast.error('Failed to save mission');
        }
    };

    if (loading) return <div className="p-10 text-center font-black text-slate-400">SYNCING CORE PURPOSE...</div>;

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Mission & Values</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Define your core purpose</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-3xl">

                <div className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Badge */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Badge Text</label>
                            <input 
                                type="text" 
                                name="badge" 
                                value={form.badge} 
                                onChange={handleChange}
                                placeholder="e.g. OUR MISSION"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                            />
                        </div>

                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Title (optional)</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={form.title} 
                                onChange={handleChange}
                                placeholder="e.g. Empowering Financial Freedom"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                            />
                        </div>

                        {/* Mission Text */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Mission Text</label>
                            <textarea 
                                name="mission_text" 
                                rows="5" 
                                value={form.mission_text} 
                                onChange={handleChange}
                                placeholder="Describe your mission..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 focus:border-[[#011d52]] outline-none transition-colors resize-none leading-relaxed"
                            ></textarea>
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <label className="flex items-center gap-3 cursor-pointer select-none group w-full justify-between">
                                <span className="text-slate-800 font-bold text-[10px] uppercase tracking-widest group-hover:text-[[#011d52]] transition-colors">Display publicly on website</span>
                                <input 
                                    type="checkbox" 
                                    name="is_active" 
                                    checked={form.is_active} 
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-slate-200 text-[[#011d52]] focus:ring-[[#011d52]]"
                                />
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-slate-200">
                            <button 
                                type="submit" 
                                className="w-full bg-[#011d52] hover:opacity-90 text-[slate-50] font-bold py-3 rounded-lg shadow-sm transition-opacity text-[10px] uppercase tracking-widest"
                            >
                                {form._id ? 'Update Mission Assets' : 'Initialize Mission'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Mission;
