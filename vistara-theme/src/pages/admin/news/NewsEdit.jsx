import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const NewsEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        news_type: 'regular',
        location: '',
        short_description: '',
        content: '',
        source_name: '',
        source_url: '',
        status: 'published',
        category_id: '',
        meta_title: '',
        meta_description: '',
        canonical_url: '',
        is_featured: false,
        is_trending: false,
        video_url: ''
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    const categories = [
        { id: 1, name: 'Finance' },
        { id: 2, name: 'Technology' },
        { id: 3, name: 'Politics' },
        { id: 4, name: 'Sports' }
    ];

    useEffect(() => {
        // Mock fetching data
        const fetchNews = async () => {
            const mockNews = {
                id: id,
                title: "Global Stock Markets Surge as Tech Sector Gains Momentum",
                news_type: "breaking",
                location: "New York, USA",
                short_description: "Investors react positively to new earnings reports from major tech companies.",
                content: "Detailed content of the surging markets...",
                source_name: "Reuters",
                source_url: "https://reuters.com",
                status: "published",
                category_id: 1,
                meta_title: "Stock Markets Surge",
                meta_description: "Tech sector leads gains in global markets.",
                canonical_url: "https://example.com/news/stock-surge",
                is_featured: true,
                is_trending: true,
                video_url: "https://youtube.com/watch?v=example"
            };
            setFormData(mockNews);
            setLoading(false);
        };
        fetchNews();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updating News:', formData);
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading Article...</div>;

    return (
        <div className="max-w-[1600px] mx-auto p-4 font-plus-jakarta bg-slate-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xs font-semibold font-black text-slate-800 tracking-tight leading-tight">Edit News Article</h2>
                    <p className="text-xs text-slate-500 mt-1">Updating: <span className="text-indigo-600 font-bold">{formData.title}</span></p>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigate(-1)}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition shadow-sm">
                        Cancel
                    </button>
                    <button type="submit" form="newsForm"
                        className="px-8 py-2.5 bg-[[#011d52]] text-[#020210] text-xs font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                        Update Article
                    </button>
                </div>
            </div>

            <form id="newsForm" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Main Story Content</h3>
                                <span className="text-[10px] bg-blue-50 text-[#011d52] px-2 py-1 rounded font-black border border-blue-100 uppercase">Editor Mode</span>
                            </div>
                            <div className="p-4 space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Headline *</label>
                                    <input name="title" type="text" value={formData.title} onChange={handleInputChange} required
                                        className="w-full text-xs font-semibold font-semibold rounded-xl border border-slate-200 focus:ring-4 focus:ring-[[#011d52]]/10/10 focus:border-[[#011d52]] py-3 transition-all outline-none px-4" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">News Type</label>
                                        <select name="news_type" value={formData.news_type} onChange={handleInputChange}
                                            className="w-full rounded-xl border border-slate-200 focus:ring-4 focus:ring-[[#011d52]]/10/10 focus:border-[[#011d52]] transition-all outline-none py-2.5 text-xs font-medium text-slate-500">
                                            <option value="regular">Regular News</option>
                                            <option value="breaking">Breaking News</option>
                                            <option value="exclusive">Exclusive</option>
                                            <option value="live">Live Update</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
                                        <input name="location" type="text" value={formData.location} onChange={handleInputChange}
                                            className="w-full rounded-xl border border-slate-200 focus:ring-4 focus:ring-[[#011d52]]/10/10 focus:border-[[#011d52]] transition-all outline-none py-2.5 text-xs px-4" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Short Summary</label>
                                    <textarea name="short_description" rows="2" value={formData.short_description} onChange={handleInputChange}
                                        className="w-full rounded-xl border border-slate-200 focus:ring-4 focus:ring-[[#011d52]]/10/10 focus:border-[[#011d52]] transition-all outline-none py-2.5 text-xs px-4"></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detailed Article Body *</label>
                                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                         <textarea name="content" value={formData.content} onChange={handleInputChange} className="w-full min-h-[400px] p-4 focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider border-b pb-4">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.803a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.103-1.103" />
                                </svg>
                                Attribution & Source
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input name="source_name" type="text" value={formData.source_name} onChange={handleInputChange} placeholder="Source Agency"
                                    className="w-full rounded-xl border border-slate-200 focus:ring-4 focus:ring-[[#011d52]]/10/10 focus:border-[[#011d52]] transition-all outline-none py-2.5 text-xs px-4" />
                                <input name="source_url" type="url" value={formData.source_url} onChange={handleInputChange} placeholder="Source Link"
                                    className="w-full rounded-xl border border-slate-200 focus:ring-4 focus:ring-[[#011d52]]/10/10 focus:border-[[#011d52]] transition-all outline-none py-2.5 text-xs px-4" />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Publishing Details</label>
                            <div className="space-y-4">
                                <select name="status" value={formData.status} onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-200 focus:ring-4 focus:ring-[[#011d52]]/10/10 focus:border-[[#011d52]] font-semibold text-slate-500 py-2.5 outline-none transition-all">
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="scheduled">Scheduled</option>
                                </select>

                                <div className="pt-2">
                                    <label className="text-xs font-bold text-slate-500 block mb-2">Category</label>
                                    <select name="category_id" value={formData.category_id} onChange={handleInputChange} required
                                        className="w-full rounded-xl border border-slate-200 focus:ring-4 focus:ring-[[#011d52]]/10/10 focus:border-[[#011d52]] py-2.5 text-xs outline-none transition-all">
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Post Thumbnail</label>
                            {(previewUrl || formData.thumbnail) && (
                                <div className="mb-4 relative group">
                                    <img src={previewUrl || formData.thumbnail} className="w-full h-44 object-cover rounded-xl border border-slate-200" alt="Thumbnail" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center">
                                        <p className="text-slate-800 text-xs font-bold">Replace Image</p>
                                    </div>
                                </div>
                            )}
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer bg-slate-50 hover:bg-gray-100 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <p className="text-xs text-slate-500 font-medium text-center">Click to upload new image</p>
                                </div>
                                <input type="file" name="thumbnail" className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Video Integration</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                </span>
                                <input name="video_url" type="url" value={formData.video_url} onChange={handleInputChange} placeholder="YouTube URL"
                                    className="w-full pl-10 rounded-xl border border-slate-200 focus:ring-4 focus:ring-[[#011d52]]/10/10 focus:border-[[#011d52]] transition-all py-2.5 text-xs outline-none px-4" />
                            </div>
                        </div>

                        <div className="bg-indigo-900 rounded-2xl shadow-lg p-4 text-slate-800 border border-indigo-800">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-indigo-500/30 rounded-lg text-indigo-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <h3 className="font-bold text-xs uppercase tracking-wider">SEO Optimization</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Meta Title</label>
                                    <input name="meta_title" type="text" value={formData.meta_title} onChange={handleInputChange}
                                        className="w-full bg-indigo-800/50 border border-indigo-700 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 py-2.5 outline-none px-4" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Meta Description</label>
                                    <textarea name="meta_description" rows="3" value={formData.meta_description} onChange={handleInputChange}
                                        className="w-full bg-indigo-800/50 border border-indigo-700 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 py-2.5 outline-none px-4"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 space-y-4">
                            <label className="flex items-center justify-between p-3 bg-slate-50 border border-gray-100 rounded-xl cursor-pointer group hover:bg-indigo-50 transition-colors">
                                <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-700">Featured Post</span>
                                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange}
                                    className="w-5 h-5 rounded text-indigo-600 focus:ring-[[#011d52]]/10 border-slate-200" />
                            </label>
                            <label className="flex items-center justify-between p-3 bg-slate-50 border border-gray-100 rounded-xl cursor-pointer group hover:bg-rose-50 transition-colors">
                                <span className="text-xs font-bold text-slate-500 group-hover:text-rose-700">Trending Now</span>
                                <input type="checkbox" name="is_trending" checked={formData.is_trending} onChange={handleInputChange}
                                    className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 border-slate-200" />
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewsEdit;
