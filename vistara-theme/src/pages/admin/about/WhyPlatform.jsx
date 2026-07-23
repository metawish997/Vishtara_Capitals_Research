import React, { useState, useEffect } from 'react';
import aboutService from '../../../services/aboutService';
import { toast } from 'react-hot-toast';

const WhyPlatform = () => {
    const [sections, setSections] = useState([]);
    const [currentSection, setCurrentSection] = useState({
        badge: '',
        heading: '',
        subheading: '',
        closing_text: '',
        content: '',
        is_active: true,
    });
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await aboutService.getWhyPlatform();
            setSections(res.data.data);
        } catch (err) {
            toast.error('Failed to load sections');
        } finally {
            setLoading(false);
        }
    };

    const loadSection = (s) => {
        setCurrentSection({
            id: s._id,
            badge: s.badge || '',
            heading: s.heading || '',
            subheading: s.subheading || '',
            closing_text: s.closing_text || '',
            content: s.contents?.[0]?.content || '',
            is_active: s.is_active ?? true,
        });
        setImagePreview(s.image?.url || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const createNew = () => {
        setCurrentSection({
            badge: '',
            heading: '',
            subheading: '',
            closing_text: '',
            content: '',
            is_active: true,
        });
        setImagePreview(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentSection({
            ...currentSection,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await aboutService.upsertWhyPlatformSection(currentSection);
            toast.success('Section saved');
            fetchData();
        } catch (err) {
            toast.error('Save failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Permanently delete this section? This action cannot be undone.')) return;
        try {
            await aboutService.deleteWhyPlatformSection(id);
            toast.success('Deleted');
            fetchData();
            if (currentSection.id === id) createNew();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    if (loading) return <div className="p-10 text-center font-black text-slate-400">ARCHITECTING PLATFORM NARRATIVE...</div>;

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Why Platform</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Architecting platform narrative</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            
            {/* Sidebar */}
            <aside className="xl:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">Platform Sections</h3>
                        <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-widest">Manage your highlights</p>
                    </div>
                    <button 
                        onClick={createNew}
                        className="bg-[#011d52] text-[slate-50] px-3 py-1.5 rounded-lg border border-[#011d52] font-bold hover:opacity-90 transition-opacity text-[9px] uppercase tracking-widest"
                    >
                        + New Section
                    </button>
                </div>

                <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {sections.map((s) => (
                        <div 
                            key={s._id}
                            className={`border rounded-xl p-3 cursor-pointer flex justify-between items-center transition-colors group ${
                                currentSection.id === s._id ? 'bg-slate-50 border-[[#011d52]]' : 'border-slate-200 hover:bg-slate-50 bg-white'
                            } ${!s.is_active ? 'opacity-60' : ''}`}
                            onClick={() => loadSection(s)}
                        >
                            <div className="truncate mr-2">
                                <p className="font-bold text-slate-800 text-xs truncate">
                                    {s.heading || 'Untitled Section'}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                    {s.subheading || 'No subheading'}
                                </p>
                            </div>

                            <div className={`w-2 h-2 rounded-full shadow-sm flex-shrink-0 ${s.is_active ? 'bg-emerald-500' : 'bg-[slate-500]'}`}></div>
                        </div>
                    ))}
                    {sections.length === 0 && (
                        <div className="text-center py-10 text-slate-500 font-bold text-[10px] uppercase tracking-widest">No sections found.</div>
                    )}
                </div>
            </aside>

            {/* Main Form */}
            <main className="xl:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-xs text-slate-800 tracking-widest uppercase">
                            {currentSection.id ? 'Edit Content Block' : 'Create New Block'}
                        </h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                            {currentSection.id ? `Editing entry ID: #${currentSection.id}` : 'Drafting a new platform highlight'}
                        </p>
                    </div>

                    {currentSection.id && (
                        <button 
                            onClick={() => handleDelete(currentSection.id)}
                            className="text-red-500 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-slate-800 transition-colors font-bold text-[10px] uppercase tracking-widest border border-red-100"
                        >
                            Delete Section
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Badge Text</label>
                            <input 
                                type="text"
                                name="badge"
                                value={currentSection.badge}
                                onChange={handleInputChange}
                                placeholder="e.g. INNOVATION"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Subheading</label>
                            <input 
                                type="text"
                                name="subheading"
                                value={currentSection.subheading}
                                onChange={handleInputChange}
                                placeholder="e.g. Why we lead the market"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                            />
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Main Heading</label>
                            <input 
                                type="text"
                                name="heading"
                                value={currentSection.heading}
                                onChange={handleInputChange}
                                placeholder="Enter primary section title..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-[[#011d52]] outline-none transition-colors"
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Section Media</label>
                            <div className="border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center transition-colors hover:border-[slate-500]">
                                <input 
                                    type="file" 
                                    className="text-[10px] mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[#011d52] file:text-[slate-50] hover:file:opacity-90 cursor-pointer file:uppercase file:tracking-widest"
                                />
                                
                                {imagePreview ? (
                                    <div className="relative w-full max-w-md rounded-lg overflow-hidden shadow-sm border border-slate-200">
                                        <img src={imagePreview} className="h-48 w-full object-cover" alt="Preview" />
                                        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-md text-[9px] font-bold border border-slate-200">LIVE PREVIEW</div>
                                    </div>
                                ) : (
                                    <div className="text-slate-500 flex flex-col items-center">
                                        <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Upload high-resolution section graphic</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Closing Text</label>
                            <textarea 
                                name="closing_text"
                                value={currentSection.closing_text}
                                onChange={handleInputChange}
                                rows="2"
                                placeholder="Short text at the bottom..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 focus:border-[[#011d52]] outline-none transition-colors resize-none"
                            ></textarea>
                        </div>

                        <div className="col-span-2 flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <label className="flex items-center gap-3 cursor-pointer select-none group w-full justify-between">
                                <span className="text-slate-800 font-bold text-[10px] uppercase tracking-widest group-hover:text-[[#011d52]] transition-colors">Visible on Platform</span>
                                <input 
                                    type="checkbox" 
                                    name="is_active" 
                                    checked={currentSection.is_active} 
                                    onChange={handleInputChange}
                                    className="w-4 h-4 rounded border-slate-200 text-[[#011d52]] focus:ring-[[#011d52]]"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-200">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Paragraph Content (HTML Support)</label>
                        <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-[[#011d52]] transition-colors shadow-sm bg-slate-50">
                            <textarea 
                                name="content"
                                value={currentSection.content}
                                onChange={handleInputChange}
                                rows="8"
                                placeholder="<p>Describe the benefits here...</p>"
                                className="w-full p-4 text-xs outline-none bg-transparent font-mono text-slate-800 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
                        <button className="bg-[#011d52] hover:opacity-90 text-[slate-50] font-bold px-8 py-3 rounded-lg shadow-sm transition-opacity text-[10px] tracking-widest uppercase">
                            Save Section Changes
                        </button>
                    </div>
                </form>
            </main>
            </div>
        </main>
    );
};

export default WhyPlatform;
