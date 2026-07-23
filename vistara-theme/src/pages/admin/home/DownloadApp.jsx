import React, { useState } from 'react';

const DownloadApp = () => {
    const [pages, setPages] = useState({
        home: 'Home Page',
        services: 'Services Page',
        contact: 'Contact Page'
    });

    const [pageKey, setPageKey] = useState('home');
    const [editMode, setEditMode] = useState(false);
    
    const [sections, setSections] = useState({
        home: {
            id: 1,
            title: 'Download our app',
            heading: 'Experience the best trading service on your mobile',
            description: 'Get real-time alerts, manage your portfolio on the go, and never miss a market move with our award-winning mobile application.',
            image: null,
            is_active: true
        }
    });

    const section = sections[pageKey] || null;

    const [form, setForm] = useState({
        title: section?.title || '',
        heading: section?.heading || '',
        description: section?.description || '',
        is_active: section?.is_active ?? true,
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handlePageChange = (key) => {
        setPageKey(key);
        setEditMode(false);
        const current = sections[key] || { title: '', heading: '', description: '', is_active: true };
        setForm({
            title: current.title,
            heading: current.heading,
            description: current.description,
            is_active: current.is_active,
            image: null
        });
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSections({
            ...sections,
            [pageKey]: { ...form, id: section?.id || Date.now() }
        });
        setEditMode(false);
        alert('Settings saved successfully!');
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Download App Section</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage app download content blocks</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

                {/* Sidebar */}
                <aside className="xl:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50">
                            <h3 className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Pages</h3>
                        </div>

                        <div className="p-2 space-y-1">
                            {Object.entries(pages).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => handlePageChange(key)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors font-bold text-[10px] uppercase tracking-widest ${
                                        pageKey === key 
                                            ? 'bg-[#011d52] text-[slate-50]' 
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                                >
                                    <span>{label}</span>
                                    <div className="flex items-center">
                                        {sections[key] ? (
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex h-2 w-2">
                                                    {sections[key].is_active ? (
                                                        <>
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                        </>
                                                    ) : (
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-300"></span>
                                                    )}
                                                </span>
                                                <span className={`${pageKey === key ? 'text-[slate-50] opacity-80' : 'text-slate-500'}`}>
                                                    {sections[key].is_active ? 'Active' : 'Off'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-[[#011d52]]/10 text-[[#011d52]] border border-[[#011d52]]/20">New</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="xl:col-span-9 bg-white rounded-xl border border-slate-200 h-full flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                        <div>
                            <nav className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Admin / Home / Download Section</nav>
                            <h2 className="font-bold text-slate-800 text-xs font-semibold flex items-center gap-3">
                                {pageKey.charAt(0).toUpperCase() + pageKey.slice(1)}
                                {section && !section.is_active && (
                                    <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded-md uppercase tracking-widest border border-red-500/20">Hidden</span>
                                )}
                            </h2>
                        </div>

                        {section && (
                            <button 
                                onClick={() => setEditMode(!editMode)} 
                                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${
                                    editMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800' 
                                        : 'bg-[#011d52] text-[slate-50] hover:opacity-90 shadow-sm'
                                }`}
                            >
                                {editMode ? 'Cancel' : (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        Edit Section
                                    </span>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="p-4">
                        {!editMode ? (
                            <div className="grid lg:grid-cols-5 gap-10">
                                <div className="lg:col-span-3 space-y-8">
                                    <div>
                                        <span className="text-[[#011d52]] font-bold uppercase tracking-widest text-[10px] block mb-2 border-b border-slate-200 pb-2">Title Tag</span>
                                        <h4 className="text-xs font-semibold font-bold text-slate-800">{section?.title || 'Untitled'}</h4>
                                    </div>

                                    <div>
                                        <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] block mb-2 border-b border-slate-200 pb-2">Main Heading</span>
                                        <p className="text-xs font-semibold text-slate-800 font-medium leading-relaxed">{section?.heading || '—'}</p>
                                    </div>

                                    <div>
                                        <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] block mb-2 border-b border-slate-200 pb-2">Description</span>
                                        <p className="text-slate-500 font-medium leading-relaxed">{section?.description || 'No description provided.'}</p>
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] block mb-2 border-b border-slate-200 pb-2">Visual Preview</span>
                                    {section?.image || imagePreview ? (
                                        <div className="relative group">
                                            <img src={imagePreview || section.image} className="w-full aspect-video object-cover rounded-xl border border-slate-200 shadow-sm" alt="Preview" />
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-500">
                                            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">No media</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Selected Page</label>
                                            <select 
                                                disabled 
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-500 outline-none cursor-not-allowed opacity-70"
                                                value={pageKey}
                                            >
                                                {Object.entries(pages).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Title</label>
                                            <input 
                                                type="text" 
                                                value={form.title}
                                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                placeholder="e.g. Download our app"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Heading</label>
                                            <input 
                                                type="text" 
                                                value={form.heading}
                                                onChange={(e) => setForm({ ...form, heading: e.target.value })}
                                                placeholder="e.g. Experience the best service"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                                            <textarea 
                                                rows="4"
                                                value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                placeholder="Enter short description..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 focus:border-[[#011d52]] outline-none transition-colors resize-none"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Section Image</label>
                                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4">
                                                {(imagePreview || section?.image) && (
                                                    <img src={imagePreview || section.image} className="h-32 w-full object-cover mb-4 rounded-lg shadow-sm border border-slate-200" alt="Preview" />
                                                )}
                                                <input 
                                                    type="file" 
                                                    onChange={handleImageChange}
                                                    className="block w-full text-[10px] font-bold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-[#011d52] file:text-[slate-50] hover:file:opacity-90 transition-opacity cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Display on website</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={form.is_active}
                                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                                    className="sr-only peer" 
                                                />
                                                <div className="w-11 h-6 bg-[slate-200] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[[#011d52]]"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-slate-200">
                                    <button className="bg-[#011d52] hover:opacity-90 text-[slate-50] font-bold px-6 py-2.5 rounded-lg shadow-sm transition-opacity text-[10px] uppercase tracking-widest">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </main>
            </div>
        </main>
    );
};

export default DownloadApp;
