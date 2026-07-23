import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetching
        const fetchBlog = async () => {
            const mockBlog = {
                id: id,
                title: "How AI can automate your business processes",
                slug: "how-ai-can-automate-your-business-processes",
                short_description: "Learn how to use AI tools to streamline your daily operations.",
                content: "<p>Artificial intelligence is no longer just a buzzword. It's a powerful tool that can help businesses of all sizes automate repetitive tasks, improve efficiency, and gain valuable insights.</p><p>In this article, we'll explore some of the most effective ways to use AI for business automation...</p>",
                status: "published",
                is_featured: true,
                published_at: "2024-05-01 10:00 AM",
                category: { name: "Technology" },
                reading_time: 5,
                view_count: 120,
                meta_title: "Automate Business with AI",
                meta_description: "Guide to AI automation for businesses.",
                meta_keywords: ["AI", "Automation", "Business"],
                canonical_url: "https://example.com/blog/ai-automation",
                thumbnail: null
            };
            setBlog(mockBlog);
            setLoading(false);
        };
        fetchBlog();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="font-plus-jakarta">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-semibold text-xs font-semibold text-slate-800 leading-tight">Blog Details</h2>
                    <p className="text-xs text-slate-500 mt-1">Viewing blog: <span className="font-medium text-slate-800">{blog.title}</span></p>
                </div>
                <div className="flex gap-3">
                    <Link to="/admin/blogs" className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-md font-semibold text-xs text-slate-800 uppercase tracking-widest shadow-sm hover:bg-slate-50 transition">
                        Back to List
                    </Link>
                    <Link to={`/admin/blogs/edit/${id}`} className="inline-flex items-center px-4 py-2 bg-[[#011d52]] border border-transparent rounded-md font-semibold text-xs text-slate-800 uppercase tracking-widest hover:opacity-90 bg-[[#011d52]] transition">
                        Edit Blog
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4 border border-slate-200">
                        <div className="mb-6">
                            <h1 className="text-xs font-semibold font-bold text-slate-800 mb-2">{blog.title}</h1>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="bg-slate-50 px-2 py-1 rounded text-xs font-mono">/{blog.slug}</span>
                            </div>
                        </div>
                        {blog.short_description && (
                            <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Excerpt</h4>
                                <p className="text-slate-800 text-xs leading-relaxed">{blog.short_description}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4 border border-slate-200">
                        <h3 className="font-bold text-slate-800 border-b pb-4 mb-4">Content Body</h3>
                        <div className="prose max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4 border border-slate-200">
                        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide border-b pb-2 mb-4">Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Current Status</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    blog.status === 'published' ? 'bg-green-100 text-green-700' : 
                                    blog.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-[[#011d52]]'
                                }`}>
                                    {blog.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Visibility</span>
                                {blog.is_featured ? (
                                    <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                        Featured
                                    </span>
                                ) : <span className="text-xs text-slate-500">Standard</span>}
                            </div>
                            <div className="pt-3 border-t border-slate-200 space-y-2">
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase">Published Date</span>
                                    <span className="text-xs font-medium text-slate-800">{blog.published_at || 'Not Set'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4 border border-slate-200">
                        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide border-b pb-2 mb-4">Details</h3>
                        <div className="space-y-3">
                            <div>
                                <span className="block text-xs text-slate-500 uppercase">Category</span>
                                <span className="inline-block mt-1 px-2 py-1 bg-slate-50 rounded text-xs font-medium text-slate-800">
                                    {blog.category?.name || 'Uncategorized'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase">Reading Time</span>
                                    <span className="text-xs font-medium">{blog.reading_time || 0} mins</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase">Views</span>
                                    <span className="text-xs font-medium">{blog.view_count || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4 border border-slate-200">
                        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide border-b pb-2 mb-4">SEO & Meta</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="block text-xs text-slate-500 uppercase">Meta Title</span>
                                <p className="text-xs text-slate-800 mt-1 break-words">{blog.meta_title || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 uppercase">Meta Description</span>
                                <p className="text-xs text-slate-800 mt-1 break-words">{blog.meta_description || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 uppercase">Keywords</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {blog.meta_keywords?.map((kw, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded border border-slate-200">{kw}</span>
                                    )) || <span className="text-xs text-slate-500">None</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
