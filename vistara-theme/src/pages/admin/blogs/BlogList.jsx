import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { canAccess, hasPermission } from '../../../utils/rbac';
import { Link } from 'react-router-dom';
import blogService from '../../../services/blogService';
import { BASE_URL } from '../../../services/api';
import toast from 'react-hot-toast';

const BlogList = () => {
    const { user } = useAuth();
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [blogsRes, catsRes] = await Promise.all([
                blogService.getBlogs(),
                blogService.getCategories()
            ]);
            setBlogs(blogsRes.data);
            setCategories(catsRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this article?')) {
            try {
                await blogService.deleteBlog(id);
                toast.success('Article deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete blog');
            }
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status ? blog.status === status : true;
        const matchesCategory = category ? blog.category?.name === category : true;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const stats = [
        { label: 'Total Blogs', value: blogs.length, color: 'blue', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { label: 'Published', value: blogs.filter(b => b.status === 'published').length, color: 'emerald', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'Drafts', value: blogs.filter(b => b.status === 'draft').length, color: 'amber', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { label: 'Featured', value: blogs.filter(b => b.is_featured).length, color: 'purple', icon: 'M11.049 2.927l1.519 4.674h4.914l-3.976 2.888 1.518 4.674-3.976-2.888-3.976 2.888 1.518-4.674L4.616 7.601h4.914z' }
    ];

    return (
        <div className="min-h-full font-plus-jakarta flex flex-col gap-4 bg-white" style={{ padding: '16px' }}>
            
            {/* Stats Cards (Ultra-Compact & Fully Colored) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', boxShadow: '0 2px 10px -4px #2563eb40' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">📝</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#2563eb' }}>Total Blogs</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{stats[0].value}</p>
                </div>
                
                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', boxShadow: '0 2px 10px -4px #05966940' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">✅</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#059669' }}>Published</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{stats[1].value}</p>
                </div>

                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', boxShadow: '0 2px 10px -4px #d9770640' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">✏️</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#d97706' }}>Drafts</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{stats[2].value}</p>
                </div>

                <div className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', boxShadow: '0 2px 10px -4px #9333ea40' }}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] drop-shadow-sm">⭐</span>
                            <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#9333ea' }}>Featured</h4>
                        </div>
                    </div>
                    <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">{stats[3].value}</p>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex-1 flex flex-col">
                {/* Header Row */}
                <div className="px-4 py-2 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4 relative">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[12px] font-bold text-slate-800">Articles</h3>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                            <span className="text-[9px] text-slate-400 font-medium">Manage and publish content</span>
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
                                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title..."
                                            className="w-full border border-slate-200 rounded-md text-[10px] px-2 py-1 outline-none focus:border-[#011d52]" />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</label>
                                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-slate-200 rounded-md text-[10px] px-2 py-1 outline-none focus:border-[#011d52]">
                                            <option value="">All</option>
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">Category</label>
                                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-md text-[10px] px-2 py-1 outline-none focus:border-[#011d52]">
                                            <option value="">All</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <button onClick={() => setShowFilters(false)} className="flex-1 py-1 bg-[#011d52] text-white rounded text-[9px] font-bold uppercase">Apply</button>
                                        <button onClick={() => { setSearch(''); setStatus(''); setCategory(''); }} className="flex-1 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[9px] font-bold uppercase">Reset</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <Link to="/admin/blogs/categories"
                            className="text-[10px] font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-50 transition-colors">
                            Categories
                        </Link>
                        {(canAccess(user, 'admin') || hasPermission(user, 'create_blogs')) && (
<Link to="/admin/blogs/create"
                            className="text-[10px] font-semibold bg-[#011d52] text-white border border-[#011d52] px-2.5 py-1 rounded-md hover:bg-[#03173d] transition-colors flex items-center gap-1">
                            + Add Blog
                        </Link>
)}
                    </div>
                </div>

                <div className="p-4 bg-slate-50/30 flex-1 overflow-y-auto">

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {filteredBlogs.map((blog) => (
                    <div key={blog._id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-blue-300 transition-all duration-300 flex flex-col">
                        <div className="relative h-32 overflow-hidden bg-slate-50 border-b border-slate-100">
                            {blog.image ? (
                                <img src={`${BASE_URL}${blog.image.url}`} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-sm border ${
                                    blog.status === 'published' ? 'bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0]' :
                                    blog.status === 'draft' ? 'bg-[#fffbeb] text-[#f59e0b] border-[#fde68a]' : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                    {blog.status}
                                </span>
                            </div>
                            <div className="absolute bottom-2 left-2">
                                <span className="px-1.5 py-0.5 bg-white/90 backdrop-blur-sm text-[#011d52] rounded text-[8px] font-bold uppercase border border-blue-100">
                                    {blog.category?.name || 'Uncategorized'}
                                </span>
                            </div>
                        </div>

                        <div className="p-3 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                {blog.is_featured && (
                                    <span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center border border-purple-100">
                                        <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        Featured
                                    </span>
                                )}
                                <span className="text-[9px] text-slate-400 font-medium">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="font-bold text-[11px] text-slate-800 mb-2 group-hover:text-[#011d52] transition-colors leading-tight">
                                {blog.title}
                            </h3>

                            <p className="text-[10px] text-slate-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
                                {blog.short_description}
                            </p>

                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-3 -mb-3 px-3 py-2">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="flex items-center text-[10px] font-semibold">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        {blog.view_count}
                                    </div>
                                    <div className="flex items-center text-[10px] font-semibold">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                        {blog.like_count}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {(canAccess(user, 'admin') || hasPermission(user, 'update_blogs')) && (
<Link to={`/admin/blogs/edit/${blog._id}`} className="p-1.5 text-[#011d52] hover:bg-blue-50 rounded-md transition-colors" title="Edit Article">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </Link>
)}
                                    {(canAccess(user, 'admin') || hasPermission(user, 'delete_blogs')) && (
<button onClick={() => handleDelete(blog._id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredBlogs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4">
                    <div className="bg-white p-3 rounded-full mb-3 border border-slate-100 shadow-sm">
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <h3 className="text-[11px] font-bold text-slate-800">No Articles Found</h3>
                    <p className="text-[9px] text-slate-400 mb-4 text-center mt-1">We couldn't find any blogs matching your current filters.</p>
                    {(canAccess(user, 'admin') || hasPermission(user, 'create_blogs')) && (
<Link to="/admin/blogs/create" className="px-4 py-1.5 bg-[#011d52] text-white font-bold text-[10px] rounded-md shadow-sm hover:bg-[#03173d] transition">Create Your First Blog</Link>
)}
                </div>
            )}
                </div>
            </div>
        </div>
    );
};

export default BlogList;
