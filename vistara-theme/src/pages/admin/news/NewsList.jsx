import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import newsService from '../../../services/newsService';
import { BASE_URL } from '../../../services/api';
import toast from 'react-hot-toast';

const NewsList = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ search: '', category: '', type: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [newsRes, catRes] = await Promise.all([
                newsService.getNews(),
                newsService.getCategories()
            ]);
            setNewsItems(newsRes.data);
            setCategories(catRes.data);
        } catch (error) {
            toast.error('Failed to load news data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this news article forever?')) {
            try {
                await newsService.deleteNews(id);
                toast.success('Article deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete article');
            }
        }
    };

    const filteredNews = newsItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = filters.category === '' || item.category?._id === filters.category;
        const matchesType = filters.type === '' || item.news_type === filters.type;
        return matchesSearch && matchesCategory && matchesType;
    });

    const stats = {
        total: newsItems.length,
        published: newsItems.filter(i => i.status === 'published').length,
        breaking: newsItems.filter(i => i.news_type === 'breaking').length,
        featured: newsItems.filter(i => i.is_featured).length
    };

    if (loading) return (
        <div className="min-h-full flex items-center justify-center bg-white p-4">
            <div className="w-8 h-8 border-2 border-t-transparent border-[#011d52] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-full font-plus-jakarta flex flex-col gap-4 bg-white" style={{ padding: '16px' }}>
            {/* Stats Cards (Ultra-Compact & Fully Colored) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', boxShadow: '0 2px 10px -4px #2563eb40' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">📰</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#2563eb' }}>Total News</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{stats.total}</p>
                </div>
                
                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', boxShadow: '0 2px 10px -4px #05966940' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">✅</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#059669' }}>Published</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{stats.published}</p>
                </div>

                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', boxShadow: '0 2px 10px -4px #dc262640' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">🔥</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#dc2626' }}>Breaking</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{stats.breaking}</p>
                </div>

                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', boxShadow: '0 2px 10px -4px #9333ea40' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">⭐</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#9333ea' }}>Featured</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{stats.featured}</p>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex-1 flex flex-col">
                {/* Header Row */}
                <div className="px-4 py-2 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4 relative">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[12px] font-bold text-slate-800">News Articles</h3>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                            <span className="text-[9px] text-slate-400 font-medium">Manage news and headlines</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 items-center relative">
                        <div className="relative">
                            <button onClick={() => setShowFilters(!showFilters)}
                                className="text-[10px] font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                                Filters
                            </button>
                            
                            {showFilters && (
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-50 animate-in slide-in-from-top-2 flex flex-col gap-3">
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">Search</label>
                                        <input type="text" value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} placeholder="Title..."
                                            className="w-full border border-slate-200 rounded-md text-[10px] px-2 py-1 outline-none focus:border-[#011d52]" />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">Category</label>
                                        <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="w-full border border-slate-200 rounded-md text-[10px] px-2 py-1 outline-none focus:border-[#011d52]">
                                            <option value="">All</option>
                                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">Type</label>
                                        <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})} className="w-full border border-slate-200 rounded-md text-[10px] px-2 py-1 outline-none focus:border-[#011d52]">
                                            <option value="">All</option>
                                            <option value="regular">Regular</option>
                                            <option value="breaking">Breaking</option>
                                            <option value="exclusive">Exclusive</option>
                                            <option value="live">Live</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <button onClick={() => setShowFilters(false)} className="flex-1 py-1 bg-[#011d52] text-white rounded text-[9px] font-bold uppercase">Apply</button>
                                        <button onClick={() => setFilters({search: '', category: '', type: ''})} className="flex-1 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[9px] font-bold uppercase">Reset</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <Link to="/admin/news/categories"
                            className="text-[10px] font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-50 transition-colors">
                            Categories
                        </Link>
                        <Link to="/admin/news/create"
                            className="text-[10px] font-semibold bg-[#011d52] text-white border border-[#011d52] px-2.5 py-1 rounded-md hover:bg-[#03173d] transition-colors flex items-center gap-1">
                            + Add News
                        </Link>
                    </div>
                </div>

                <div className="p-4 bg-slate-50/30 flex-1 overflow-y-auto">

            {/* 4. News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {filteredNews.map((news) => (
                    <div key={news._id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-blue-300 transition-all duration-300 flex flex-col">
                        <div className="relative h-32 overflow-hidden bg-slate-50 border-b border-slate-100">
                            {news.image ? (
                                <img src={`${BASE_URL}${news.image.url}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={news.title} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-sm border ${news.news_type === 'breaking' ? 'bg-[#fef2f2] text-[#ef4444] border-[#fecaca]' : 'bg-blue-50 text-[#011d52] border-blue-200'}`}>
                                    {news.news_type}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-sm border ${
                                    news.status === 'published' ? 'bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0]' : 'bg-[#fffbeb] text-[#f59e0b] border-[#fde68a]'
                                }`}>
                                    {news.status}
                                </span>
                            </div>
                            <div className="absolute bottom-2 left-2">
                                <span className="px-1.5 py-0.5 bg-white/90 backdrop-blur-sm text-[#011d52] rounded text-[8px] font-bold uppercase border border-blue-100">
                                    {news.category?.name || 'Uncategorized'}
                                </span>
                            </div>
                        </div>

                        <div className="p-3 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                {news.is_featured && (
                                    <span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center border border-purple-100">
                                        <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                        Featured
                                    </span>
                                )}
                                <span className="text-[9px] text-slate-400 font-medium">
                                    {news.created_at}
                                </span>
                            </div>

                            <h3 className="font-bold text-[11px] text-slate-800 mb-2 group-hover:text-[#011d52] transition-colors line-clamp-2 leading-tight">
                                {news.title}
                            </h3>

                            <p className="text-[10px] text-slate-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
                                {news.short_description}
                            </p>

                            <div className="pt-3 border-t border-slate-100 flex justify-end items-center gap-1.5 -mx-3 -mb-3 px-3 py-2 bg-slate-50/50">
                                <Link to={`/admin/news/edit/${news._id}`} className="p-1.5 text-[#011d52] hover:bg-blue-50 rounded-md transition-colors" title="Edit Article">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                </Link>
                                <button onClick={() => handleDelete(news._id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {newsItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4">
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">No news articles found.</p>
                    <Link to="/admin/news/create" className="mt-3 text-[10px] inline-block text-[#011d52] font-bold hover:underline">Create your first story</Link>
                </div>
            )}
                </div>
            </div>
        </div>
    );
};

export default NewsList;
