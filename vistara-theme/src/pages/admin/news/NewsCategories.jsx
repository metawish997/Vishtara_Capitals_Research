import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import newsService from '../../../services/newsService';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { canAccess, hasPermission } from '../../../utils/rbac';

const NewsCategories = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', color_code: '#4f46e5' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await newsService.getCategories();
            setCategories(res.data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await newsService.createCategory(newCategory);
            toast.success('Category created successfully');
            setNewCategory({ name: '', color_code: '#4f46e5' });
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create category');
        }
    };

    const handleEdit = (category) => {
        setCurrentCategory(category);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await newsService.updateCategory(currentCategory._id, currentCategory);
            toast.success('Category updated successfully');
            setIsEditModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error('Failed to update category');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await newsService.deleteCategory(id);
                toast.success('Category deleted');
                fetchCategories();
            } catch (error) {
                toast.error('Failed to delete category');
            }
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            await newsService.updateCategoryStatus(id, !currentStatus);
            toast.success('Status updated');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="min-h-full font-plus-jakarta flex flex-col gap-4 bg-white" style={{ padding: '16px' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-[12px] font-bold text-slate-800">News Categories</h3>
                    <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                        <span className="text-[9px] text-slate-400 font-medium">Organize your stories into segments</span>
                    </div>
                </div>
                <Link to="/admin/news" className="inline-flex items-center px-2.5 py-1 bg-white border border-slate-200 rounded-md font-bold text-[10px] text-slate-600 hover:bg-slate-50 transition">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> Back to News
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Create Form */}
                <div className="lg:col-span-4">
                    {(canAccess(user, 'admin') || hasPermission(user, 'create_news')) && (
                        <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-4 sticky top-6">
                            <h3 className="font-bold text-[10px] text-slate-800 mb-3 uppercase tracking-wider">Create New Category</h3>
                            <form onSubmit={handleCreate}>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Category Name</label>
                                    <input 
                                        type="text" 
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                                        required 
                                        placeholder="e.g. Technology"
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 px-2.5 py-1.5 focus:border-[#011d52] text-[10px] shadow-sm outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Color Label</label>
                                    <input 
                                        type="color" 
                                        value={newCategory.color_code}
                                        onChange={(e) => setNewCategory({...newCategory, color_code: e.target.value})}
                                        className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer p-0.5" 
                                    />
                                </div>
                                <button type="submit"
                                    className="w-full py-1.5 mt-2 bg-[#011d52] text-white text-[10px] font-bold rounded-md hover:opacity-90 transition shadow-sm uppercase tracking-wider">
                                    Save Category
                                </button>
                            </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right: Table */}
                <div className="lg:col-span-8">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-2.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">Color</th>
                                    <th className="px-4 py-2.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                                    <th className="px-4 py-2.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-4 py-2.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-2.5">
                                            <div className="w-4 h-4 rounded-full shadow-sm"
                                                style={{ backgroundColor: category.color_code }}></div>
                                        </td>
                                        <td className="px-4 py-2.5 font-bold text-[10px] text-slate-700">{category.name}</td>
                                        <td className="px-4 py-2.5">
                                            <button onClick={() => handleStatusToggle(category._id, category.is_active)}
                                                className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-sm border transition-colors ${
                                                    category.is_active 
                                                    ? 'bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0] hover:bg-[#d1fae5]' 
                                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-gray-100'
                                                }`}>
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2.5 text-right flex justify-end gap-1.5">
                                            {(canAccess(user, 'admin') || hasPermission(user, 'update_news')) && (
                                                <button onClick={() => handleEdit(category)}
                                                    className="p-1.5 text-[#011d52] hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </button>
                                            )}
                                            {(canAccess(user, 'admin') || hasPermission(user, 'delete_news')) && (
                                                <button onClick={() => handleDelete(category._id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-slate-400 font-bold text-[9px] uppercase tracking-widest">No categories found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Edit Category</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-4 space-y-3">
                            <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Category Name</label>
                                <input 
                                    type="text" 
                                    value={currentCategory?.name}
                                    onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                                    required 
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 px-2.5 py-1.5 focus:border-[#011d52] text-[10px] shadow-sm outline-none"
                                    placeholder="Category Name" 
                                />
                            </div>
                            <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Color Label</label>
                                <input 
                                    type="color" 
                                    value={currentCategory?.color_code}
                                    onChange={(e) => setCurrentCategory({...currentCategory, color_code: e.target.value})}
                                    className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer p-0.5" 
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-3 mt-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)}
                                    className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors">Cancel</button>
                                <button type="submit"
                                    className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white bg-[#011d52] rounded-md hover:bg-[#03173d] shadow-sm transition-colors">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsCategories;
