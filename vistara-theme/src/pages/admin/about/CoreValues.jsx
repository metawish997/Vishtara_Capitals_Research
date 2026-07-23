import React, { useState, useEffect } from 'react';
import aboutService from '../../../services/aboutService';
import { toast } from 'react-hot-toast';

const CoreValues = () => {
    const [values, setValues] = useState([]);
    const [header, setHeader] = useState({
        badge: '',
        title: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        icon: '',
        title: '',
        description: '',
        sort_order: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await aboutService.getCoreValues();
            if (res.data.data.section) setHeader(res.data.data.section);
            setValues(res.data.data.values);
        } catch (err) {
            toast.error('Failed to load core values');
        } finally {
            setLoading(false);
        }
    };

    const editValue = (v) => {
        setEditId(v._id);
        setForm({
            icon: v.icon,
            title: v.title,
            description: v.description,
            sort_order: v.sort_order
        });
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditId(null);
        setForm({ icon: '', title: '', description: '', sort_order: 0 });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await aboutService.deleteCoreValueCard(id);
            toast.success('Deleted');
            fetchData();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const handleHeaderSubmit = async (e) => {
        e.preventDefault();
        try {
            await aboutService.updateCoreValueSection(header);
            toast.success('Header updated');
            fetchData();
        } catch (err) {
            toast.error('Failed to update header');
        }
    };

    const handleCardSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await aboutService.updateCoreValueCard(editId, form);
                toast.success('Value updated');
            } else {
                await aboutService.createCoreValueCard(form);
                toast.success('Value created');
            }
            resetForm();
            fetchData();
        } catch (err) {
            toast.error('Save failed');
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-400">LOADING CORE ASSETS...</div>;

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Core Values</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage your core value cards and section header</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">

                {/* Sidebar: Current Values */}
                <aside className="xl:col-span-4 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Core Values</h3>
                                <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-widest">Manage and reorder</p>
                            </div>
                        </div>

                        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {values.map((v) => (
                                <div 
                                    key={v._id}
                                    className={`group border rounded-xl p-4 transition-colors cursor-pointer relative ${
                                        editId === v._id ? 'border-[[#011d52]] bg-slate-50' : 'border-slate-200 hover:bg-slate-50 bg-white'
                                    }`}
                                    onClick={() => editValue(v)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-800 flex items-center justify-center text-xs font-semibold shadow-sm border border-slate-200" dangerouslySetInnerHTML={{ __html: v.icon }}>
                                        </div>
                                        <div className="flex-1 pr-8">
                                            <h4 className="font-bold text-slate-800 text-xs leading-tight">{v.title}</h4>
                                            <p className="text-[11px] text-slate-500 mt-1 font-medium line-clamp-2">{v.description}</p>
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(v._id); }}
                                            className="p-1.5 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-slate-800 transition-colors shadow-sm"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {values.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">No values added yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="xl:col-span-8 space-y-4">

                    {/* Header Configuration */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-[#011d52] rounded-lg flex items-center justify-center text-[slate-50] shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-800 tracking-widest uppercase text-xs">Header Configuration</h3>
                        </div>

                        <form className="grid grid-cols-2 gap-4" onSubmit={handleHeaderSubmit}>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Badge</label>
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                                    value={header.badge}
                                    onChange={(e) => setHeader({ ...header, badge: e.target.value })}
                                    placeholder="e.g. CORE VALUES"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Section Title</label>
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                                    value={header.title}
                                    onChange={(e) => setHeader({ ...header, title: e.target.value })}
                                    placeholder="e.g. What We Stand For"
                                />
                            </div>

                            <div className="col-span-2 space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Short Description</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 focus:border-[[#011d52]] outline-none transition-colors resize-none"
                                    rows="3"
                                    value={header.description}
                                    onChange={(e) => setHeader({ ...header, description: e.target.value })}
                                    placeholder="Describe this section..."
                                ></textarea>
                            </div>

                            <div className="col-span-2 flex justify-end pt-4 border-t border-slate-200 mt-2">
                                <button className="bg-[#011d52] hover:opacity-90 text-[slate-50] px-6 py-2.5 rounded-lg text-[10px] font-bold transition-opacity uppercase tracking-widest shadow-sm">
                                    Update Header
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Value Card Configuration */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 text-[slate-50] opacity-30">
                            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[[#011d52]] rounded-lg flex items-center justify-center text-slate-800 shadow-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeWidth="3" d="M12 4v16m8-8H4"></path>
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800 tracking-widest uppercase text-xs">
                                        {editId ? 'Modify Core Value' : 'Add New Core Value'}
                                    </h3>
                                </div>
                                {editId && (
                                    <button 
                                        onClick={resetForm}
                                        className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-widest"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleCardSubmit} className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Icon (Emoji or SVG)</label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors font-mono"
                                        value={form.icon}
                                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                                        placeholder="🚀"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Value Title</label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="e.g. Innovation"
                                    />
                                </div>

                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Full Description</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 focus:border-[[#011d52]] outline-none transition-colors resize-none"
                                        rows="4"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Explain the value in detail..."
                                    ></textarea>
                                </div>

                                <div className="col-span-2 pt-6 border-t border-slate-200 mt-2">
                                    <button className="w-full bg-[#011d52] hover:opacity-90 text-[slate-50] font-bold py-3 rounded-lg shadow-sm transition-opacity text-[10px] uppercase tracking-widest">
                                        {editId ? 'Save Changes' : 'Create Value Card'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </main>
    );
};

export default CoreValues;
