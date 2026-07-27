import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import blogService from '../../../services/blogService';
import mediaService from '../../../services/mediaService';
import { BASE_URL } from '../../../services/api';
import toast from 'react-hot-toast';

const BlogCreate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const editorRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        short_description: '',
        content: '',
        full_description: '',
        status: 'draft',
        scheduled_for: '',
        is_featured: false,
        category: '',
        meta_title: '',
        meta_description: '',
        reading_time: ''
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(isEdit);
    const initialContentRef = useRef('');

    useEffect(() => {
        fetchInitialData();
    }, [id]);

    const isInitializingRef = useRef(false);

    useEffect(() => {
        // Initialize CKEditor after loading
        if (window.ClassicEditor && !loading) {
            const editorElement = document.querySelector('#blog-editor');
            if (editorElement && !editorRef.current && !isInitializingRef.current) {
                isInitializingRef.current = true;
                window.ClassicEditor
                    .create(editorElement, {
                        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'],
                        placeholder: 'Write your story here...'
                    })
                    .then(editor => {
                        editorRef.current = editor;
                        isInitializingRef.current = false;
                        if (initialContentRef.current) {
                            editor.setData(initialContentRef.current);
                        }
                        editor.model.document.on('change:data', () => {
                            const data = editor.getData();
                            setFormData(prev => ({ ...prev, content: data, full_description: data }));
                        });
                    })
                    .catch(error => {
                        isInitializingRef.current = false;
                        console.error('CKEditor init error:', error);
                    });
            }
        }
        return () => {
            if (editorRef.current) {
                editorRef.current.destroy()
                    .then(() => { editorRef.current = null; })
                    .catch(err => console.error(err));
            }
        };
    }, [loading]);

    const fetchInitialData = async () => {
        try {
            const catRes = await blogService.getCategories();
            setCategories(catRes.data);

            if (isEdit) {
                const blogRes = await blogService.getBlogs();
                const blog = blogRes.data.find(b => b._id === id);
                if (blog) {
                    const contentToSet = blog.full_description || blog.content || '';
                    initialContentRef.current = contentToSet;
                    setFormData({
                        ...blog,
                        category: blog.category?._id || '',
                        short_description: blog.short_description || '',
                        meta_title: blog.meta_title || '',
                        meta_description: blog.meta_description || '',
                        content: contentToSet,
                        full_description: contentToSet
                    });
                    if (blog.image) {
                        setPreviewUrl(`${BASE_URL}${blog.image.url}`);
                    }
                    // In case editor is already ready, set data immediately
                    if (editorRef.current) {
                        editorRef.current.setData(contentToSet);
                    } else {
                        // Retry setting it after a short delay if it's still mounting
                        setTimeout(() => {
                            if (editorRef.current) {
                                editorRef.current.setData(contentToSet);
                            }
                        }, 500);
                    }
                }
            }
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'title') {
            const slug = value.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, slug, title: value }));
        }
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
        setLoading(true);
        try {
            let imageId = formData.image?._id || formData.image;

            if (thumbnail) {
                const uploadRes = await mediaService.upload(thumbnail, 'blogs');
                imageId = uploadRes.data[0]._id;
            }

            const payload = {
                ...formData,
                image: imageId
            };

            if (isEdit) {
                await blogService.updateBlog(id, payload);
                toast.success('Blog updated successfully');
            } else {
                await blogService.createBlog(payload);
                toast.success('Blog created successfully');
            }
            navigate('/admin/blogs');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-full font-plus-jakarta flex flex-col gap-4 bg-white" style={{ padding: '16px' }}>
            {/* Main Content Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex-1 flex flex-col">
                {/* Header Row */}
                <div className="px-4 py-2 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[12px] font-bold text-slate-800">
                            {isEdit ? 'Edit Blog Article' : 'Create New Blog'}
                        </h3>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                            <span className="text-[9px] text-slate-400 font-medium">Blog Management System</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => navigate(-1)}
                            className="text-[10px] font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" form="blogForm"
                            className="text-[10px] font-semibold bg-[#011d52] text-white border border-[#011d52] px-3 py-1.5 rounded-md hover:bg-[#03173d] transition-colors">
                            {isEdit ? 'Update Blog' : 'Save Blog'}
                        </button>
                    </div>
                </div>

                {/* Scrollable Form Area */}
                <div className="p-4 bg-slate-50/30 flex-1 overflow-y-auto">
                    <form id="blogForm" onSubmit={handleSubmit} className="space-y-4 max-w-5xl mx-auto">

                        {/* Row 1: Title + Category */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Blog Title *</label>
                                <input name="title" type="text" value={formData.title} onChange={handleInputChange}
                                    className="w-full rounded-md border border-slate-200 bg-white text-[10px] px-2.5 py-1.5 focus:border-[#011d52] outline-none text-slate-800 font-medium"
                                    placeholder="E.g. How AI can automate your business processes" required />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Category *</label>
                                <select name="category" value={formData.category} onChange={handleInputChange} required
                                    className="w-full rounded-md border border-slate-200 bg-white text-[10px] px-2.5 py-1.5 focus:border-[#011d52] outline-none text-slate-800 font-medium">
                                    <option value="">Choose Category</option>
                                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Row 2: Slug + Status + Reading Time */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">URL Slug</label>
                                <input name="slug" type="text" value={formData.slug} readOnly
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-[10px] px-2.5 py-1.5 outline-none text-slate-400 font-medium" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange}
                                    className="w-full rounded-md border border-slate-200 bg-white text-[10px] px-2.5 py-1.5 focus:border-[#011d52] outline-none text-slate-800 font-medium">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="scheduled">Scheduled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Reading Time (mins)</label>
                                <input name="reading_time" type="number" value={formData.reading_time} onChange={handleInputChange}
                                    className="w-full rounded-md border border-slate-200 bg-white text-[10px] px-2.5 py-1.5 focus:border-[#011d52] outline-none text-slate-800 font-medium" placeholder="Auto" />
                            </div>
                        </div>

                        {/* Row 3: Schedule + Featured */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {formData.status === 'scheduled' && (
                                <div>
                                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Schedule Date</label>
                                    <input name="scheduled_for" type="datetime-local" value={formData.scheduled_for} onChange={handleInputChange}
                                        className="w-full rounded-md border border-slate-200 bg-white text-[10px] px-2.5 py-1.5 focus:border-[#011d52] outline-none text-slate-800 font-medium" />
                                </div>
                            )}
                            <div className="flex items-center gap-2 mt-4 h-[26px]">
                                <input name="is_featured" type="checkbox" checked={formData.is_featured} onChange={handleInputChange}
                                    className="w-3.5 h-3.5 border-slate-300 rounded text-[#011d52] focus:ring-[#011d52]" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Mark as Featured Post</span>
                            </div>
                        </div>

                        {/* Short Description */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400">Short Description (Excerpt)</label>
                                <span className="text-[9px] font-bold text-slate-400">{formData.short_description.length}/160</span>
                            </div>
                            <textarea name="short_description" rows="2" value={formData.short_description} onChange={handleInputChange} maxLength="160"
                                className="w-full rounded-md border border-slate-200 bg-white text-[10px] px-2.5 py-1.5 focus:border-[#011d52] outline-none text-slate-800 font-medium resize-none"
                                placeholder="A brief summary for listing cards..."></textarea>
                        </div>

                        {/* Full Description - CKEditor */}
                        <div>
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Full Description *</label>
                            <div className="ck-editor-container border border-slate-200 rounded-lg overflow-hidden text-slate-800 bg-white">
                                <div id="blog-editor"></div>
                            </div>
                        </div>

                        {/* SEO Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                            <div>
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Meta Title</label>
                                <input name="meta_title" type="text" value={formData.meta_title} onChange={handleInputChange} maxLength="60"
                                    className="w-full rounded-md border border-slate-200 bg-white text-[10px] px-2.5 py-1.5 focus:border-[#011d52] outline-none text-slate-800 font-medium" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Featured Image</label>
                                <div className="flex items-center gap-3">
                                    <input type="file" accept="image/*" onChange={handleThumbnailChange}
                                        className="w-full text-[9px] file:text-[9px] file:font-bold file:px-2.5 file:py-1 file:bg-[#011d52]/10 file:text-[#011d52] hover:file:bg-[#011d52]/20 file:rounded file:border-0 file:cursor-pointer cursor-pointer text-slate-500 font-medium" />
                                    {previewUrl && <img src={previewUrl} className="h-8 w-12 object-cover rounded border border-slate-200 shadow-sm" alt="Preview" />}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Meta Description</label>
                            <textarea name="meta_description" rows="2" value={formData.meta_description} onChange={handleInputChange} maxLength="160"
                                className="w-full rounded-md border border-slate-200 bg-white text-[10px] px-2.5 py-1.5 focus:border-[#011d52] outline-none text-slate-800 font-medium resize-none"></textarea>
                        </div>

                    </form>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .ck-editor__editable_inline {
                    min-height: 250px;
                    font-size: 9px !important;
                    font-weight: 600 !important;
                    line-height: 1.5 !important;
                    color: #1e293b !important;
                    border-bottom-left-radius: 8px !important;
                    border-bottom-right-radius: 8px !important;
                }
                .ck-editor__editable_inline p {
                    font-size: 9px !important;
                    margin-bottom: 0.5em !important;
                }
                .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused) {
                    border-color: #e2e8f0;
                }
                .ck-focused {
                    border-color: #011d52 !important;
                    box-shadow: 0 0 0 1px #011d52 !important;
                }
                .ck.ck-toolbar {
                    border-color: #e2e8f0;
                    background: #f8fafc;
                    border-top-left-radius: 8px !important;
                    border-top-right-radius: 8px !important;
                }
                input::placeholder, textarea::placeholder {
                    color: #d1d5db !important;
                }
            ` }} />
        </div>
    );
};

export default BlogCreate;
