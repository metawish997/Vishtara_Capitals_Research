import React, { useState, useEffect } from 'react';
import designationService from '../../../services/designationService';
import toast from 'react-hot-toast';

const DesignationList = () => {
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDesignation, setEditingDesignation] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', status: 'active' });

    // Drag and drop states
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const fetchDesignations = async () => {
        try {
            setLoading(true);
            const res = await designationService.getDesignations();
            if (res.success) setDesignations(res.data);
        } catch (error) {
            toast.error('Failed to load designations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDesignations(); }, []);

    const handleOpenModal = (des = null) => {
        if (des) {
            setEditingDesignation(des);
            setForm({ name: des.name, description: des.description || '', status: des.status });
        } else {
            setEditingDesignation(null);
            setForm({ name: '', description: '', status: 'active' });
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this designation?')) {
            try {
                const res = await designationService.deleteDesignation(id);
                if (res.success) {
                    toast.success('Designation deleted successfully');
                    fetchDesignations();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Delete failed');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDesignation) {
                const res = await designationService.updateDesignation(editingDesignation._id, form);
                if (res.success) { toast.success('Designation updated'); fetchDesignations(); }
            } else {
                const res = await designationService.createDesignation(form);
                if (res.success) { toast.success('Designation created'); fetchDesignations(); }
            }
            setShowModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Save failed');
        }
    };

    // Drag & Drop Handlers
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => { e.target.classList.add('opacity-40'); }, 0);
    };
    const handleDragEnd = (e) => {
        setDraggedIndex(null); setDragOverIndex(null);
        e.target.classList.remove('opacity-40');
    };
    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        setDragOverIndex(index);
    };
    const handleDrop = async (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        const updatedList = [...designations];
        const [draggedItem] = updatedList.splice(draggedIndex, 1);
        updatedList.splice(index, 0, draggedItem);
        setDesignations(updatedList);
        setDraggedIndex(null); setDragOverIndex(null);
        try {
            const designationIds = updatedList.map(d => d._id);
            await designationService.reorderDesignations(designationIds);
            toast.success('Hierarchy order updated.');
        } catch (error) {
            toast.error('Failed to update hierarchy');
            fetchDesignations();
        }
    };

    const inputClass = "w-full px-3 py-2 border border-slate-200 rounded-md text-[11px] text-slate-800 focus:outline-none focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 transition-all bg-white placeholder:text-slate-400";
    const labelClass = "block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5";

    return (
        <main className="min-h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Designations</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage institutional roles, hierarchical order, and levels</p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <div className="px-3 border-r border-slate-100 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total</p>
                        <p className="text-[14px] font-bold text-slate-800">{designations.length}</p>
                    </div>
                    <button onClick={() => handleOpenModal()}
                        className="px-3 py-1.5 bg-[#011d52] text-white rounded-md font-bold text-[10px] hover:bg-[#02143a] transition">
                        + Add Designation
                    </button>
                </div>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-500 font-bold text-[13px] flex-shrink-0">ℹ</span>
                <p className="text-[10px] text-[#011d52] font-medium leading-relaxed">
                    Drag rows using the <span className="font-bold">☰</span> handle to reorder the designation hierarchy. Changes are saved automatically.
                </p>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading designations...</p>
                </div>
            ) : designations.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No designations defined yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-center">Order</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Name</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Description</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Level</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Status</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Created</th>
                                    <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {designations.map((des, index) => {
                                    const isAdmin = des.name?.toLowerCase() === 'admin';
                                    const isHoveredTarget = dragOverIndex === index && draggedIndex !== index && !isAdmin;
                                    return (
                                        <tr key={des._id}
                                            draggable={!isAdmin}
                                            onDragStart={!isAdmin ? (e) => handleDragStart(e, index) : undefined}
                                            onDragEnd={!isAdmin ? handleDragEnd : undefined}
                                            onDragOver={!isAdmin ? (e) => handleDragOver(e, index) : undefined}
                                            onDrop={!isAdmin ? (e) => handleDrop(e, index) : undefined}
                                            className={`border-b border-slate-50 group transition-all ${isHoveredTarget ? 'bg-blue-50 border-y-2 border-blue-200' : 'hover:bg-[#f8fafc]'}`}>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`select-none font-bold text-[14px] ${isAdmin ? 'text-slate-200 cursor-not-allowed' : 'text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500'}`}
                                                    title={isAdmin ? 'Admin cannot be reordered' : 'Drag to reorder'}>
                                                    ☰
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-[11px] font-semibold text-slate-800 uppercase tracking-tight">{des.name}</p>
                                            </td>
                                            <td className="px-4 py-3 max-w-xs">
                                                <p className="text-[10px] text-slate-500 truncate">{des.description || <span className="italic text-slate-300">No description</span>}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-[10px] font-mono font-bold text-slate-500">L{des.level || index + 1}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {des.status === 'active' ? (
                                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#a7f3d0] text-[#10b981] bg-[#ecfdf5]">Active</span>
                                                ) : (
                                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#fecaca] text-[#ef4444] bg-[#fef2f2]">Inactive</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-[10px] text-slate-500">{new Date(des.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleOpenModal(des)}
                                                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    {!isAdmin && (
                                                        <button onClick={() => handleDelete(des._id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-[12px] font-bold text-slate-800">{editingDesignation ? 'Edit Designation' : 'New Designation'}</h3>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Institutional Roles Registry</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors text-xs">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className={labelClass}>Designation Name *</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Sales Head" required className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Brief summary of duties..."
                                    className={`${inputClass} h-20 resize-none`} />
                            </div>
                            <div>
                                <label className={labelClass}>Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                    className={`${inputClass} cursor-pointer`}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-md font-bold text-[10px] hover:bg-slate-50 transition">
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="px-4 py-1.5 bg-[#011d52] text-white rounded-md font-bold text-[10px] hover:bg-[#02143a] transition active:scale-95">
                                    {editingDesignation ? 'Save Changes' : 'Create Designation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default DesignationList;
