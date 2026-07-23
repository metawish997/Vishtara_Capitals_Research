import React, { useState } from 'react';

const HomeCounters = () => {
    const [counters, setCounters] = useState([
        { id: 1, value: '10K+', description: 'Active Traders', is_active: true, sort_order: 1 },
        { id: 2, value: '₹500Cr+', description: 'AUM Managed', is_active: true, sort_order: 2 },
        { id: 3, value: '99.9%', description: 'Uptime', is_active: true, sort_order: 3 },
        { id: 4, value: '15+', description: 'Years Experience', is_active: false, sort_order: 4 }
    ]);

    const [form, setForm] = useState({
        id: null,
        value: '',
        description: '',
        is_active: true
    });

    const reset = () => {
        setForm({
            id: null,
            value: '',
            description: '',
            is_active: true
        });
    };

    const edit = (item) => {
        setForm({ ...item });
    };

    const submit = (e) => {
        e.preventDefault();
        if (form.id) {
            setCounters(counters.map(c => c.id === form.id ? { ...c, ...form } : c));
            alert('Counter updated (mock)');
        } else {
            setCounters([...counters, { ...form, id: Date.now(), sort_order: counters.length + 1 }]);
            alert('Counter added (mock)');
        }
        reset();
    };

    const remove = (id) => {
        if (window.confirm('Are you sure? This will also re-order all other items.')) {
            setCounters(counters.filter(c => c.id !== id));
            reset();
        }
    };

    const toggle = (id) => {
        setCounters(counters.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
    };

    const move = (index, direction) => {
        const newCounters = [...counters];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newCounters.length) {
            [newCounters[index], newCounters[newIndex]] = [newCounters[newIndex], newCounters[index]];
            setCounters(newCounters);
        }
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Home Counters</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage statistical counters</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">

                {/* Left Side: Counter List */}
                <aside className="xl:col-span-5 flex flex-col space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 bg-[#011d52] text-[slate-50] rounded-lg shadow-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                                    </svg>
                                </span>
                                <h3 className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Home Counters</h3>
                            </div>
                            <button onClick={reset} className="bg-[#011d52] hover:opacity-90 text-[slate-50] px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-opacity uppercase tracking-widest">
                                + Add New
                            </button>
                        </div>

                        <div className="divide-y divide-[slate-200] max-h-[600px] overflow-y-auto custom-scrollbar">
                            {counters.map((item, index) => (
                                <div 
                                    key={item.id}
                                    className={`group bg-white px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors ${form.id === item.id ? 'bg-slate-50 border-l-2 border-l-[[#011d52]]' : ''}`}
                                >
                                    <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <button disabled={index === 0} onClick={() => move(index, 'up')} className="hover:text-[[#011d52]] disabled:opacity-0 p-0.5">▲</button>
                                        <button disabled={index === counters.length - 1} onClick={() => move(index, 'down')} className="hover:text-[[#011d52]] disabled:opacity-0 p-0.5">▼</button>
                                    </div>

                                    <div className="flex-1 cursor-pointer" onClick={() => edit(item)}>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-800 text-xs">{item.value}</span>
                                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 font-bold uppercase tracking-widest rounded">#{index + 1}</span>
                                        </div>
                                        <p className="text-slate-500 font-medium truncate text-[11px] mt-0.5">{item.description}</p>
                                    </div>

                                    <button 
                                        onClick={() => toggle(item.id)}
                                        className={`relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 ${item.is_active ? 'bg-[[#011d52]]' : 'bg-[slate-200]'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 shadow-sm ${item.is_active ? 'translate-x-4' : 'translate-x-0'}`}></span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Right Side: Form */}
                <section className="xl:col-span-7">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                            <h2 className="font-bold text-slate-800 text-xs uppercase tracking-widest">{form.id ? 'Edit Counter' : 'New Counter'}</h2>
                        </div>

                        <form onSubmit={submit} className="p-4 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Value</label>
                                <input 
                                    value={form.value}
                                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-colors"
                                    required
                                    placeholder="e.g. 10,000+"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                                <textarea 
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows="4"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-[[#011d52]] transition-colors resize-none"
                                    placeholder="e.g. Traders trust us worldwide"
                                ></textarea>
                            </div>

                            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <label className="flex items-center gap-3 cursor-pointer group w-full justify-between">
                                    <span className="text-slate-800 font-bold text-[10px] uppercase tracking-widest group-hover:text-[[#011d52]] transition-colors">Show on Homepage</span>
                                    <input 
                                        type="checkbox" 
                                        checked={form.is_active}
                                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-200 text-[[#011d52]] focus:ring-[[#011d52]]"
                                    />
                                </label>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                                <button className="bg-[#011d52] hover:opacity-90 text-[slate-50] font-bold px-6 py-2.5 rounded-lg shadow-sm transition-opacity flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                    Save Changes
                                </button>

                                {form.id && (
                                    <button 
                                        type="button"
                                        onClick={() => remove(form.id)}
                                        className="inline-flex items-center gap-2 text-red-500 hover:bg-red-50 font-bold px-4 py-2 rounded-lg transition-colors text-[10px] uppercase tracking-widest"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default HomeCounters;
