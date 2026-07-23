import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const NewsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetching
        const fetchNews = async () => {
            const mockNews = {
                id: id,
                title: "Global Stock Markets Surge as Tech Sector Gains Momentum",
                news_type: "breaking",
                location: "New York, USA",
                short_description: "Investors react positively to new earnings reports from major tech companies.",
                content: "<p>The global financial landscape witnessed a significant upswing today as technology stocks led a broad-based rally across major exchanges. Analysts point to stronger-than-expected quarterly results from Silicon Valley heavyweights as the primary catalyst for the surge.</p><p>In New York, the NASDAQ Composite jumped 2.4%, while the S&P 500 reached a new all-time high. Similar gains were observed in European and Asian markets, signaling a renewed confidence in the tech-driven growth narrative.</p>",
                source_name: "Reuters",
                source_url: "https://reuters.com",
                status: "published",
                category: { name: "Finance" },
                is_featured: true,
                is_trending: true,
                created_at: "May 04, 2024",
                thumbnail: null
            };
            setNews(mockNews);
            setLoading(false);
        };
        fetchNews();
    }, [id]);

    if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Article Details...</div>;

    return (
        <div className="font-plus-jakarta">
            {/* Header / Actions */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link to="/admin/news" className="text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                            Back to News
                        </Link>
                    </div>
                    <h2 className="text-xs font-semibold font-bold text-slate-800 leading-tight">{news.title}</h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => navigate(`/admin/news/edit/${id}`)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-md hover:bg-slate-50 transition shadow-sm">
                        EDIT ARTICLE
                    </button>
                    <button className="px-4 py-2 bg-[[#011d52]] text-[#020210] border border-transparent text-xs font-bold rounded-md hover:opacity-90 transition shadow-sm uppercase">
                        View Live Site
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Featured Image Placeholder */}
                    <div className="bg-white h-[350px] rounded-xl flex items-center justify-center text-gray-400 border border-slate-200 overflow-hidden relative">
                        {news.thumbnail ? (
                            <img src={news.thumbnail} className="w-full h-full object-cover" alt="Featured" />
                        ) : (
                            <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white text-slate-800 rounded-md text-[10px] font-bold uppercase tracking-widest border border-slate-200 shadow-sm">
                                {news.category?.name || 'Category'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-6">
                        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 border-b border-slate-200 pb-4 mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 uppercase">Posted:</span>
                                <span>{news.created_at}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 uppercase">Type:</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${news.news_type === 'breaking' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                                    {news.news_type}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 uppercase">Location:</span>
                                <span>{news.location}</span>
                            </div>
                        </div>

                        <div className="text-xs font-semibold font-medium text-slate-500 italic leading-relaxed border-l-4 border-[[#011d52]] pl-5 bg-slate-50 py-4 rounded-r-md">
                            "{news.short_description}"
                        </div>

                        <div className="prose max-w-none text-slate-800 leading-[1.7] text-xs"
                             dangerouslySetInnerHTML={{ __html: news.content }} />
                    </div>

                    {/* Source Info */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-50 rounded-lg text-slate-500 border border-slate-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.803a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.103-1.103" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Original Source</p>
                                <p className="text-xs font-bold text-slate-800">{news.source_name}</p>
                            </div>
                        </div>
                        <a href={news.source_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-md border border-slate-200 hover:bg-white hover:text-slate-800 transition flex items-center gap-2">
                            Visit Website
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-3">Article Metrics</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 uppercase">Status</span>
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase border border-emerald-100">
                                    {news.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 uppercase">Visibility</span>
                                <div className="flex gap-2">
                                    {news.is_featured && <span className="px-2 py-0.5 bg-slate-50 text-slate-800 border border-slate-200 rounded text-[9px] font-bold uppercase">Featured</span>}
                                    {news.is_trending && <span className="px-2 py-0.5 bg-slate-50 text-slate-800 border border-slate-200 rounded text-[9px] font-bold uppercase">Trending</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-3">SEO Performance</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Index Status</p>
                                <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Indexed in Search Engine
                                </p>
                            </div>
                            <button className="w-full py-2 bg-slate-50 border border-slate-200 hover:bg-white rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors text-slate-800">
                                Analyze Performance
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetails;
