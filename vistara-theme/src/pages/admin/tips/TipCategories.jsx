import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { canAccess, hasPermission } from '../../../utils/rbac';
import tipService from '../../../services/tipService';

const TipCategories = () => {
    const { user } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryStatus, setCategoryStatus] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await tipService.getCategories();
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const initCreate = () => {
        setEditMode(false);
        setCategoryName('');
        setCategoryStatus(true);
        setEditingId(null);
        setOpenModal(true);
    };

    const initEdit = (category) => {
        setEditMode(true);
        setCategoryName(category.name);
        setCategoryStatus(category.status === true);
        setEditingId(category._id);
        setOpenModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category permanently?')) {
            try {
                await tipService.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { 
                name: categoryName, 
                status: categoryStatus 
            };

            if (editMode) {
                await tipService.updateCategory(editingId, data);
            } else {
                await tipService.createCategory(data);
            }
            setOpenModal(false);
            fetchCategories();
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-4 font-plus-jakarta">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div className="flex flex-col gap-3">
                    <Link to="/admin/tips" className="inline-flex items-center text-[10px] font-black text-slate-500 hover:text-sky-600 transition-colors group w-fit">
                        <div className="p-1 bg-slate-50 group-hover:bg-sky-50 rounded-[4px] mr-1.5 transition-colors">
                            <i className="fa-solid fa-arrow-left stroke-[3]"></i>
                        </div>
                        BACK
                    </Link>

                    <div>
                        <h1 className="text-xs font-semibold font-black text-slate-800 tracking-tighter">Tips Categories</h1>
                        <p className="text-[9px] text-slate-500 mt-0.5 font-bold uppercase tracking-widest">Manage platform content structure and visibility</p>
                    </div>
                </div>

                {(canAccess(user, 'admin') || hasPermission(user, 'create_tips')) && (
                    <button 
                        onClick={initCreate}
                        className="inline-flex items-center justify-center px-4 py-2 text-[10px] font-black text-white bg-sky-500 hover:bg-sky-600 rounded-[4px] transition-all shadow-sm"
                    >
                        <i className="fa-solid fa-plus mr-1.5 stroke-[3]"></i>
                        Add New Category
                    </button>
                )}
            </div>

            {/* Table Section */}
            <div className="bg-white border border-slate-200 rounded-[4px] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-transparent border-b border-slate-200">
                                <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">ID</th>
                                <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">Category Name</th>
                                <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">Status</th>
                                <th className="px-4 py-3 text-right text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">Actions</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-[slate-200]">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-4 py-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading Categories...</td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-4 py-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">No categories found</td>
                                </tr>
                            ) : categories.map((category, index) => (
                                <tr key={category._id} className="group hover:bg-slate-50 transition-all duration-200">
                                    <td className="px-4 py-3 text-[11px] text-slate-500 font-bold">#{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-[11px] font-black text-slate-800 tracking-tight group-hover:text-sky-600 transition-colors">
                                            {category.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {category.status ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-[4px] text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-[4px] text-[8px] font-black uppercase tracking-widest bg-slate-50 border border-slate-200 text-slate-500">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-1.5">
                                        {(canAccess(user, 'admin') || hasPermission(user, 'update_tips')) && (
                                            <button 
                                                onClick={() => initEdit(category)}
                                                className="inline-flex items-center px-3 py-1.5 text-[9px] font-black text-sky-600 hover:bg-sky-50 rounded-[4px] border border-sky-100 transition-all duration-200 uppercase tracking-widest"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {(canAccess(user, 'admin') || hasPermission(user, 'delete_tips')) && (
                                            <button 
                                                onClick={() => handleDelete(category._id)}
                                                className="inline-flex items-center px-3 py-1.5 text-[9px] font-black text-rose-500 hover:bg-rose-50 rounded-[4px] border border-rose-100 transition-all duration-200 uppercase tracking-widest"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {openModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenModal(false)}></div>
                    <div className="relative w-full max-w-sm bg-white rounded-[4px] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-[11px] font-semibold font-black text-slate-800 tracking-tighter">
                                    {editMode ? 'Edit Category' : 'New Category'}
                                </h3>
                                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Signal Architecture Definition</p>
                            </div>
                            <button onClick={() => setOpenModal(false)} className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-[4px] transition-colors">
                                <i className="fa-solid fa-xmark text-[10px] font-semibold"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Category Name</label>
                                    <input 
                                        type="text" 
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        required 
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[4px] focus:border-sky-500 focus:bg-white transition-all outline-none text-[11px] font-black tracking-tight text-slate-800 placeholder:text-slate-400"
                                        placeholder="Enter category title..."
                                    />
                                </div>

                                <label className="flex items-center group cursor-pointer p-3 bg-slate-50 rounded-[4px] border border-transparent hover:border-sky-200 hover:bg-sky-50 transition-all duration-300">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="checkbox" 
                                            checked={categoryStatus}
                                            onChange={(e) => setCategoryStatus(e.target.checked)}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:bg-sky-500 transition-all duration-300"></div>
                                        <div className="absolute left-[2px] top-[2px] w-3 h-3 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform duration-300"></div>
                                    </div>
                                    <div className="ml-3 flex flex-col">
                                        <span className="text-[10px] font-black text-slate-800 group-hover:text-sky-700 transition-colors uppercase tracking-tight">
                                            Visible on Website
                                        </span>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter leading-tight mt-0.5">
                                            Enable to broadcast this segment
                                        </span>
                                    </div>
                                </label>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button type="button" onClick={() => setOpenModal(false)} className="flex-1 px-4 py-2 text-[9px] font-black text-slate-500 bg-slate-50 border border-slate-200 rounded-[4px] hover:bg-slate-100 transition-all uppercase tracking-widest">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-[2] px-4 py-2 text-[9px] font-black text-white bg-sky-500 rounded-[4px] hover:opacity-90 shadow-sm transition-all uppercase tracking-widest">
                                    {editMode ? 'Update Category' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TipCategories;
