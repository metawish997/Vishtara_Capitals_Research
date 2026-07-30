import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import roleService from '../../../services/roleService';
import toast from 'react-hot-toast';

const PermissionModal = ({ isOpen, onClose, roleName, permissions }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-[12px] font-bold text-slate-800">Permissions</h3>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Role: {roleName}</p>
                    </div>
                    <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors text-xs">✕</button>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-2">
                        {permissions?.map((p, idx) => (
                            <div key={idx} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                                {p.name}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 bg-white text-right">
                    <button onClick={onClose} className="px-4 py-1.5 bg-[#011d52] text-white rounded-md text-[9px] font-bold uppercase tracking-widest hover:bg-[#02143a] transition-all">Close</button>
                </div>
            </div>
        </div>
    );
};

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState({ isOpen: false, roleName: '', permissions: [] });

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const res = await roleService.getRoles();
            setRoles(res.data);
        } catch (error) {
            toast.error('Failed to load roles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRoles(); }, []);

    const handleDelete = async (role) => {
        const isSuperAdmin = role.name?.toLowerCase() === 'super admin';
        const isEmployee = role.name?.toLowerCase() === 'employee';
        const isCustomer = role.name?.toLowerCase() === 'customer';
        
        if (role.is_locked || isSuperAdmin || isEmployee || isCustomer) {
            toast.error('This role is protected and cannot be deleted.');
            return;
        }
        
        if (window.confirm('Delete this role?')) {
            try {
                await roleService.deleteRole(role._id);
                toast.success('Role deleted');
                fetchRoles();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Delete failed');
            }
        }
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Roles & Permissions</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage authorization hierarchy and access control</p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <div className="px-3 border-r border-slate-100 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Roles</p>
                        <p className="text-[14px] font-bold text-slate-800">{roles.length}</p>
                    </div>
                    <Link to="/admin/roles/create"
                        className="px-3 py-1.5 bg-[#011d52] text-white rounded-md font-bold text-[10px] hover:bg-[#02143a] transition">
                        + New Role
                    </Link>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading roles...</p>
                </div>
            ) : roles.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No roles found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role) => {
                        const isSuperAdmin = role.name?.toLowerCase() === 'super admin';
                        const isEmployee = role.name?.toLowerCase() === 'employee';
                        const isCustomer = role.name?.toLowerCase() === 'customer';
                        const canDelete = !role.is_locked && !isSuperAdmin && !isEmployee && !isCustomer;

                        return (
                        <div key={role._id}
                            className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-4 hover:border-blue-200 transition-all flex flex-col gap-3">
                            {/* Card Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[14px] flex-shrink-0 ${role.is_locked ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'}`}>
                                        {role.is_locked ? '🔐' : '🔒'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-tight">{role.name}</h3>
                                            {(role.is_locked || isSuperAdmin || isEmployee || isCustomer) && (
                                                <span className="text-[7px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded uppercase tracking-widest">Protected</span>
                                            )}
                                        </div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                                            {role.permissions?.length || 0} permissions
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1.5">
                                    {!isSuperAdmin && (
                                        <Link to={`/admin/roles/edit/${role._id}`}
                                            className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition-all flex items-center justify-center text-[11px]">
                                            ✏️
                                        </Link>
                                    )}
                                    <button onClick={() => handleDelete(role)}
                                        disabled={!canDelete}
                                        className={`w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 transition-all flex items-center justify-center text-[11px] ${!canDelete ? 'opacity-30 cursor-not-allowed' : 'text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200'}`}>
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {/* Permissions Preview */}
                            <div className="flex flex-wrap gap-1.5">
                                {(role.permissions || []).slice(0, 5).map((p, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                                        {p.name}
                                    </span>
                                ))}
                                {(!role.permissions || role.permissions.length === 0) && (
                                    <span className="text-[9px] text-slate-400 italic">No permissions defined</span>
                                )}
                            </div>

                            {/* More button */}
                            {role.permissions?.length > 5 && (
                                <button onClick={() => setModalData({ isOpen: true, roleName: role.name, permissions: role.permissions })}
                                    className="text-[9px] font-bold uppercase tracking-widest text-[#011d52] hover:underline text-left">
                                    + {role.permissions.length - 5} more permissions
                                </button>
                            )}

                            {/* Footer */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
                                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">ID-{role._id?.slice(-6)}</span>
                                {!isSuperAdmin && (
                                    <Link to={`/admin/roles/edit/${role._id}`}
                                        className="text-[9px] font-bold uppercase tracking-widest text-[#011d52] hover:underline">
                                        Edit Role →
                                    </Link>
                                )}
                            </div>
                        </div>
                    )})}
                </div>
            )}

            <PermissionModal
                isOpen={modalData.isOpen}
                onClose={() => setModalData({ ...modalData, isOpen: false })}
                roleName={modalData.roleName}
                permissions={modalData.permissions}
            />
        </main>
    );
};

export default RoleList;
