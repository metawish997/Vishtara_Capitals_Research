import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../../../services/blogService';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { canAccess, hasPermission } from '../../../utils/rbac';

const BlogCategories = () => {
    const { user } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryStatus, setCategoryStatus] = useState('active');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await blogService.getCategories();
            setCategories(data.data);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const initCreate = () => {
        setEditMode(false);
        setCategoryName('');
        setCategoryStatus('active');
        setOpenModal(true);
    };

    const initEdit = (category) => {
        setEditMode(true);
        setCurrentId(category._id);
        setCategoryName(category.name);
        setCategoryStatus(category.status);
        setOpenModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await blogService.updateCategory(currentId, { 
                    name: categoryName, 
                    status: categoryStatus 
                });
                toast.success('Category updated successfully');
            } else {
                await blogService.createCategory({ 
                    name: categoryName, 
                    status: categoryStatus 
                });
                toast.success('Category created successfully');
            }
            setOpenModal(false);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category? This might affect blogs using it.')) {
            try {
                await blogService.deleteCategory(id);
                toast.success('Category deleted');
                fetchCategories();
            } catch (error) {
                toast.error('Failed to delete category');
            }
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await blogService.updateCategoryStatus(id, newStatus);
            toast.success(`Category ${newStatus}`);
            fetchCategories();
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    return (
        <div className="font-plus-jakarta">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex flex-col">
                    <Link to="/admin/blogs"
                        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-2">
                        <i className="fa-solid fa-arrow-left mr-2"></i> BACK TO BLOGS
                    </Link>
                    <h2 className="font-bold text-xs font-semibold text-slate-800 tracking-tight">Blog Categories</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage and organize your blog topics.</p>
                </div>

                {(canAccess(user, 'admin') || hasPermission(user, 'create_blogs')) && (
                    <button onClick={initCreate}
                        className="inline-flex items-center px-4 py-2 bg-[[#011d52]] border border-transparent rounded-md font-bold text-xs text-[#020210] uppercase tracking-widest hover:opacity-90 shadow-md transition">
                        + Add New Category
                    </button>
                )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[slate-200]">
                            {categories.map((category, index) => (
                                <tr key={category._id || category.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-xs text-slate-500">#{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-semibold text-slate-800">
                                            {category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleStatusToggle(category._id, category.status)}
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors ${
                                                category.status === 'active' 
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                                : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-gray-200'
                                            }`}
                                        >
                                            {category.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        {(canAccess(user, 'admin') || hasPermission(user, 'update_blogs')) && (
                                            <button onClick={() => initEdit(category)}
                                                className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-[[#011d52]] transition-colors">
                                                Edit
                                            </button>
                                        )}
                                        {(canAccess(user, 'admin') || hasPermission(user, 'delete_blogs')) && (
                                            <button onClick={() => handleDelete(category._id)}
                                                className="inline-flex items-center text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors">
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 text-xs">
                                        No blog categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {openModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setOpenModal(false)}></div>
                    <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xs font-semibold font-bold text-slate-800">
                                {editMode ? 'Edit Category' : 'New Category'}
                            </h3>
                            <button onClick={() => setOpenModal(false)} className="text-slate-500 hover:text-slate-800 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Category Name</label>
                                    <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:border-[[#011d52]] focus:ring-[[#011d52]]/10 shadow-sm"
                                        placeholder="e.g. Technology" />
                                </div>

                                <div className="flex items-center py-2">
                                    <input 
                                        type="checkbox" 
                                        checked={categoryStatus === 'active'} 
                                        onChange={(e) => setCategoryStatus(e.target.checked ? 'active' : 'inactive')} 
                                        className="w-4 h-4 rounded border border-slate-200 text-[[#011d52]] bg-slate-50 focus:ring-[[#011d52]]" 
                                    />
                                    <div className="ml-2 flex flex-col">
                                        <span className="text-xs font-medium text-slate-800">Active Status</span>
                                        <span className="text-xs text-slate-500">Visible in blog filters</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <button type="button" onClick={() => setOpenModal(false)}
                                    className="px-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="px-4 py-2 text-xs font-bold text-[#020210] bg-[[#011d52]] rounded-md hover:opacity-90 shadow-sm transition-colors">
                                    {editMode ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogCategories;
