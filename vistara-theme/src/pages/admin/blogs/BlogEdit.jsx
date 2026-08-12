import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import blogService from '../../../services/blogService';
import toast from 'react-hot-toast';

const BlogEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        short_description: '',
        content: '',
        status: 'draft',
        scheduled_for: '',
        published_at: '',
        is_featured: false,
        category_id: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        canonical_url: '',
        reading_time: ''
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetching data
        const fetchBlog = async () => {
            const mockBlog = {
                id: id,
                title: "How AI can automate your business processes",
                slug: "how-ai-can-automate-your-business-processes",
                short_description: "Learn how to use AI tools to streamline your daily operations.",
                content: "<h1>Main Content</h1><p>Full article body goes here...</p>",
                status: "published",
                published_at: "2024-05-01T10:00",
                is_featured: true,
                category_id: 1,
                meta_title: "Automate Business with AI",
                meta_description: "Guide to AI automation for businesses.",
                meta_keywords: "AI, Automation, Business",
                canonical_url: "https://example.com/blog/ai-automation",
                reading_time: 5,
                thumbnail: null
            };

            setFormData({
                ...mockBlog,
                meta_keywords: mockBlog.meta_keywords || ''
            });
            setLoading(false);
        };
        fetchBlog();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await blogService.updateBlog(id, { ...formData });
            toast.success('Blog updated successfully');
            navigate('/admin/blogs');
        } catch (error) {
            console.error('Error updating blog:', error);
            toast.error(error.response?.data?.message || 'Failed to update blog');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="font-plus-jakarta">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#011d52] mb-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        <span className="text-xs font-bold uppercase tracking-wider">Editor Mode</span>
                    </div>
                    <h2 className="font-bold text-xs font-semibold text-slate-800 tracking-tight">Edit Blog</h2>
                    <p className="text-xs text-slate-500 mt-1">Updating: <span className="font-medium text-slate-800">{formData.title}</span></p>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition">
                        Cancel
                    </button>
                    <Link to={`/admin/blogs/show/${id}`}
                        className="px-4 py-2 bg-[#011d52]/10 border border-[#011d52]/20 rounded-md text-xs font-semibold text-[#011d52] shadow-sm hover:bg-[#011d52]/20 transition flex items-center gap-2">
                        <span>View Live</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </Link>
                    <button type="submit" form="blogForm"
                        className="px-4 py-2 bg-[#011d52] border border-transparent rounded-md text-xs font-semibold text-[#020210] shadow-sm hover:opacity-90 bg-[#011d52] focus:ring-4 focus:ring-[#011d52]/10 transition">
                        Update Blog
                    </button>
                </div>
            </div>

            <form id="blogForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border border-slate-200 bg-slate-50/50">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Content</h3>
                        </div>
                        <div className="p-4 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-800 mb-1">Blog Title <span className="text-red-400">*</span></label>
                                <input name="title" type="text" value={formData.title} onChange={handleInputChange} required
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 focus:border-[#011d52] focus:ring-[#011d52]/10 text-slate-800 shadow-sm px-4 py-2.5" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-800 mb-1">URL Slug</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs">/blog/</span>
                                        <input name="slug" type="text" value={formData.slug} readOnly
                                            className="w-full pl-14 rounded-md border border-slate-200 bg-slate-50 text-slate-800 bg-slate-50 text-slate-500 text-xs shadow-sm px-4 py-2.5" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                                    <span>Short Description</span>
                                    <span className="text-xs font-normal text-slate-500">{(formData.short_description || '').length}/160</span>
                                </label>
                                <textarea name="short_description" rows="2" value={formData.short_description} onChange={handleInputChange} maxLength="160"
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 focus:border-[#011d52] focus:ring-[#011d52]/10 text-xs shadow-sm px-4 py-2.5"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-800 mb-2">Article Body <span className="text-red-400">*</span></label>
                                <textarea name="content" rows="10" value={formData.content} onChange={handleInputChange}
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 focus:border-[#011d52] focus:ring-[#011d52]/10 shadow-sm text-xs px-4 py-2.5"
                                    placeholder="Write your article content here..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="px-6 py-4 border-b border border-slate-200 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Search Engine Optimization</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                                        <span>Meta Title</span>
                                        <span className="font-normal text-slate-500">{(formData.meta_title || '').length}/60</span>
                                    </label>
                                    <input name="meta_title" type="text" value={formData.meta_title} onChange={handleInputChange} maxLength="60"
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 text-xs shadow-sm focus:ring-[#011d52]/10 px-4 py-2.5" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Keywords</label>
                                    <input name="meta_keywords" type="text" value={formData.meta_keywords} onChange={handleInputChange}
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 text-xs shadow-sm focus:ring-[#011d52]/10 px-4 py-2.5" />
                                </div>
                            </div>
                            <div>
                                <label className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                                    <span>Meta Description</span>
                                    <span className="font-normal text-slate-500">{(formData.meta_description || '').length}/160</span>
                                </label>
                                <textarea name="meta_description" rows="2" value={formData.meta_description} onChange={handleInputChange} maxLength="160"
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 text-xs shadow-sm focus:ring-[#011d52]/10 px-4 py-2.5"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Canonical URL</label>
                                <input name="canonical_url" type="url" value={formData.canonical_url} onChange={handleInputChange}
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 text-xs shadow-sm focus:ring-[#011d52]/10 px-4 py-2.5" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Publishing Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-800 mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 text-xs shadow-sm px-4 py-2.5">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="scheduled">Scheduled</option>
                                </select>
                            </div>
                            {formData.status === 'scheduled' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-800 mb-1 text-xs">Schedule For</label>
                                    <input name="scheduled_for" type="datetime-local" value={formData.scheduled_for} onChange={handleInputChange}
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 text-xs shadow-sm px-4 py-2.5" />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-semibold text-slate-800 mb-1 text-xs">Publication Date</label>
                                <input name="published_at" type="datetime-local" value={formData.published_at} onChange={handleInputChange}
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 text-xs shadow-sm px-4 py-2.5" />
                            </div>
                            <div className="flex items-center gap-2 py-2">
                                <input name="is_featured" type="checkbox" checked={formData.is_featured || false} onChange={handleInputChange} className="w-4 h-4 text-[#011d52] border border-slate-200 bg-slate-50 rounded focus:ring-[#011d52]" />
                                <label className="text-xs text-slate-800 font-medium">Feature this post</label>
                            </div>
                            <button type="submit" className="w-full py-2.5 bg-[#011d52] text-[#020210] rounded-md text-xs font-bold shadow-md hover:opacity-90 bg-[#011d52] transition">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Featured Image</h3>
                        <div className="space-y-4">
                            {previewUrl && (
                                <div className="relative h-32 rounded-md overflow-hidden border border-[#011d52]/20 shadow-sm">
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="New Preview" />
                                    <span className="absolute top-2 left-2 bg-[#011d52] text-[#020210] text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">New</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleThumbnailChange}
                                className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#011d52]/10 file:text-[#011d52] hover:file:bg-[#011d52]/20 transition cursor-pointer" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Category</h3>
                        <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 text-xs shadow-sm px-4 py-2.5">
                            <option value="">Select Category</option>
                            <option value="1">Technology</option>
                            <option value="2">Finance</option>
                        </select>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Metrics</h3>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reading Time (Mins)</label>
                            <input name="reading_time" type="number" value={formData.reading_time} onChange={handleInputChange}
                                className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 bg-slate-50 text-xs shadow-sm px-4 py-2.5" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BlogEdit;

