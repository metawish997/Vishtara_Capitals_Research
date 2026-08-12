import React, { useState } from 'react';

const WhyChooseUs = () => {
    const [sections, setSections] = useState([
        { 
            id: 1, 
            title: 'Quality Assurance', 
            badge: '01', 
            heading: 'Uncompromising Quality', 
            description: 'We adhere to the highest standards of financial integrity and technical excellence.', 
            image_url: 'https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=200', 
            is_active: true 
        },
        { 
            id: 2, 
            title: 'Expert Support', 
            badge: '02', 
            heading: '24/7 Professional Guidance', 
            description: 'Our team of expert analysts is always available to help you navigate market complexities.', 
            image_url: 'https://images.unsplash.com/photo-1521791136064-7986c295944b?auto=format&fit=crop&q=80&w=200', 
            is_active: true 
        }
    ]);

    const [form, setForm] = useState({
        id: null,
        title: '',
        badge: '',
        heading: '',
        description: '',
        is_active: true,
        image_url: ''
    });

    const [imagePreview, setImagePreview] = useState(null);

    const reset = () => {
        setForm({
            id: null,
            title: '',
            badge: '',
            heading: '',
            description: '',
            is_active: true,
            image_url: ''
        });
        setImagePreview(null);
    };

    const edit = (item) => {
        setForm({ ...item });
        setImagePreview(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const updatedData = { ...form, image_url: imagePreview || form.image_url };
        if (form.id) {
            setSections(sections.map(s => s.id === form.id ? updatedData : s));
            alert('Section updated successfully! (mock)');
        } else {
            setSections([...sections, { ...updatedData, id: Date.now() }]);
            alert('Section created successfully! (mock)');
        }
        reset();
    };

    const remove = (id) => {
        if (window.confirm('Delete section?')) {
            setSections(sections.filter(s => s.id !== id));
            if (form.id === id) reset();
        }
    };

    const toggle = (id) => {
        setSections(sections.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s));
    };

    const move = (index, direction) => {
        const newSections = [...sections];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newSections.length) {
            [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
            setSections(newSections);
        }
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Why Choose Us</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage the 'Why Choose Us' sections</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">

                {/* Left Side: List */}
                <aside className="xl:col-span-5 flex flex-col space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 bg-[#011d52] text-[slate-50] rounded-lg shadow-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </span>
                                <h3 className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Why Choose Sections</h3>
                            </div>
                            <button onClick={reset} className="bg-[#011d52] hover:opacity-90 text-[slate-50] px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-opacity uppercase tracking-widest">
                                + New Section
                            </button>
                        </div>

                        <div className="divide-y divide-[slate-200] max-h-[600px] overflow-y-auto custom-scrollbar">
                            {sections.map((item, index) => (
                                <div 
                                    key={item.id}
                                    className={`group relative bg-white px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 ${form.id === item.id ? 'bg-slate-50 border-l-2 border-l-[[#011d52]]' : ''}`}
                                >
                                    <div className="flex flex-col gap-0.5 opacity-30 group-hover:opacity-100 transition-opacity">
                                        <button disabled={index === 0} onClick={() => move(index, 'up')} className="hover:text-[[#011d52]] disabled:opacity-0 p-0.5">▲</button>
                                        <button disabled={index === sections.length - 1} onClick={() => move(index, 'down')} className="hover:text-[[#011d52]] disabled:opacity-0 p-0.5">▼</button>
                                    </div>

                                    <div className="w-10 h-10 rounded bg-slate-50 overflow-hidden border border-slate-200 flex-shrink-0">
                                        {item.image_url ? (
                                            <img src={item.image_url} className="w-full h-full object-cover" alt={item.title} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 cursor-pointer min-w-0" onClick={() => edit(item)}>
                                        <p className="font-bold text-slate-800 text-xs truncate">{item.title || 'Untitled'}</p>
                                        <p className="text-slate-500 font-medium truncate text-[11px] mt-0.5">{item.heading}</p>
                                    </div>

                                    <button 
                                        onClick={() => toggle(item.id)}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${item.is_active ? 'bg-[[#011d52]]' : 'bg-[slate-200]'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${item.is_active ? 'translate-x-4' : 'translate-x-0'}`}></span>
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
                            <h2 className="font-bold text-slate-800 text-xs uppercase tracking-widest">{form.id ? 'Edit Section Content' : 'Create New Section'}</h2>
                        </div>

                        <form onSubmit={submit} className="p-4 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Admin Title</label>
                                    <input 
                                        value={form.title} 
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="e.g. Quality Assurance"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-colors"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Badge</label>
                                    <input 
                                        value={form.badge} 
                                        onChange={(e) => setForm({ ...form, badge: e.target.value })}
                                        placeholder="e.g. 01, NEW, BEST"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Heading</label>
                                <input 
                                    value={form.heading} 
                                    onChange={(e) => setForm({ ...form, heading: e.target.value })}
                                    placeholder="Enter display heading"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[[#011d52]] transition-colors"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                                <textarea 
                                    value={form.description} 
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows="4" 
                                    placeholder="Explain why this feature is great..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-[[#011d52]] transition-colors resize-none"
                                ></textarea>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Section Image</label>
                                <div className="flex items-start gap-4 p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                                    <div className="relative w-24 h-24 rounded-lg bg-white border border-slate-200 overflow-hidden group shadow-sm flex-shrink-0">
                                        {(imagePreview || form.image_url) ? (
                                            <img src={imagePreview || form.image_url} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange}
                                            className="block w-full text-[11px] text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-[#011d52] file:text-[slate-50] hover:file:opacity-90 cursor-pointer transition-opacity"
                                        />
                                        <p className="text-[10px] text-slate-500 font-medium">Recommended: Transparent PNG or high-quality JPG (Max 2MB).</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <label className="flex items-center gap-3 cursor-pointer select-none group w-full justify-between">
                                    <span className="text-slate-800 font-bold text-[10px] uppercase tracking-widest group-hover:text-[[#011d52]] transition-colors">Section Visibility on Platform</span>
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
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    Save Changes
                                </button>
                                {form.id && (
                                    <button 
                                        type="button"
                                        onClick={() => remove(form.id)}
                                        className="inline-flex items-center gap-2 text-red-500 hover:bg-red-50 font-bold px-4 py-2 rounded-lg transition-colors text-[10px] uppercase tracking-widest"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
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

export default WhyChooseUs;
