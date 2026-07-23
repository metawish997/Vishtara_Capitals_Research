import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import roleService from '../../../services/roleService';
import toast from 'react-hot-toast';

const RoleEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [roleName, setRoleName] = useState('');
    const [search, setSearch] = useState('');
    const [filterMode, setFilterMode] = useState('all');
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false);
    const [permissionsData, setPermissionsData] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const permRes = await roleService.getPermissions();
                const grouped = {};
                permRes.data.forEach(p => {
                    const category = p.name.split(' ')[0] || 'General';
                    if (!grouped[category]) grouped[category] = [];
                    grouped[category].push(p);
                });
                setPermissionsData(grouped);

                if (isEdit) {
                    const roleRes = await roleService.getRoles();
                    const currentRole = roleRes.data.find(r => r._id === id);
                    if (currentRole) {
                        setRoleName(currentRole.name);
                        setSelectedPermissions(currentRole.permissions.map(p => p._id));
                        setIsLocked(currentRole.is_locked);
                    }
                }
            } catch (error) {
                toast.error('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEdit]);

    const togglePermission = (permId) => {
        setSelectedPermissions(prev =>
            prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
        );
    };

    const toggleModule = (perms) => {
        const permIds = perms.map(p => p._id);
        const allSelected = permIds.every(id => selectedPermissions.includes(id));
        if (allSelected) {
            setSelectedPermissions(selectedPermissions.filter(id => !permIds.includes(id)));
        } else {
            setSelectedPermissions([...new Set([...selectedPermissions, ...permIds])]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { name: roleName, permissions: selectedPermissions };
            if (isEdit) {
                await roleService.updateRole(id, payload);
                toast.success('Role updated');
            } else {
                await roleService.createRole(payload);
                toast.success('Role created');
            }
            navigate('/admin/roles');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const filterPermissions = (perms) => {
        return perms.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const isSelected = selectedPermissions.includes(p._id);
            if (filterMode === 'selected') return matchesSearch && isSelected;
            if (filterMode === 'unselected') return matchesSearch && !isSelected;
            return matchesSearch;
        });
    };

    const totalSelected = selectedPermissions.length;
    const totalAll = Object.values(permissionsData).flat().length;

    return (
        <main className="min-h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">{isEdit ? 'Edit Role' : 'Create Role'}</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">
                        {isEdit ? `Configuring: ${roleName || '...'}` : 'Define a new access role and assign permissions'}
                        {isLocked && <span className="ml-2 text-amber-500">[System Protected]</span>}
                    </p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <Link to="/admin/roles" className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-md font-bold text-[10px] hover:bg-slate-50 transition">Cancel</Link>
                    <button form="roleForm" className="px-4 py-1.5 bg-[#011d52] text-white rounded-md font-bold text-[10px] hover:bg-[#02143a] transition">
                        {isEdit ? 'Save Changes' : 'Create Role'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading permissions...</p>
                </div>
            ) : (
                <form id="roleForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Controls Row */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                            {/* Role Name */}
                            <div className="flex-shrink-0">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Role Name *</label>
                                <input
                                    type="text" value={roleName}
                                    onChange={e => setRoleName(e.target.value)}
                                    required readOnly={isLocked}
                                    placeholder="e.g. Moderator"
                                    className={`px-3 py-1.5 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-800 focus:outline-none focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 transition-all ${isLocked ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'bg-white'}`}
                                />
                            </div>

                            {/* Separator */}
                            <div className="hidden lg:block w-px h-10 bg-slate-100" />

                            {/* Search */}
                            <div className="flex-1 relative">
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Search permissions..."
                                    className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-[11px] focus:outline-none focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 bg-white" />
                                <svg className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                                {['all', 'selected', 'unselected'].map(mode => (
                                    <button key={mode} type="button" onClick={() => setFilterMode(mode)}
                                        className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${filterMode === mode ? 'bg-white text-[#011d52] shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                                        {mode}
                                    </button>
                                ))}
                            </div>

                            {/* Select/Clear All */}
                            <div className="flex flex-col gap-1 text-right">
                                <button type="button"
                                    onClick={() => setSelectedPermissions(Object.values(permissionsData).flat().map(p => p._id))}
                                    className="text-[9px] font-bold uppercase tracking-wider text-[#011d52] hover:underline">
                                    Select All ({totalAll})
                                </button>
                                <button type="button" onClick={() => setSelectedPermissions([])}
                                    className="text-[9px] font-bold uppercase tracking-wider text-red-500 hover:underline">
                                    Clear All ({totalSelected})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Permissions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(permissionsData).map(([category, perms]) => {
                            const filteredPerms = filterPermissions(perms);
                            if (filteredPerms.length === 0) return null;
                            const checkedCount = perms.filter(p => selectedPermissions.includes(p._id)).length;

                            return (
                                <div key={category} className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                                    {/* Module Header */}
                                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-[#011d52]/8 border border-[#011d52]/20 flex items-center justify-center text-[10px] font-black text-[#011d52] uppercase">
                                                {category.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">{category}</h4>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase">{checkedCount}/{perms.length} selected</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => toggleModule(perms)}
                                            className="text-[8px] font-bold text-[#011d52] bg-blue-50 px-2.5 py-1 rounded border border-blue-200 hover:bg-[#011d52] hover:text-white transition-all uppercase tracking-wider">
                                            Toggle
                                        </button>
                                    </div>

                                    {/* Permissions */}
                                    <div className="p-3 grid grid-cols-2 gap-1.5">
                                        {filteredPerms.map(perm => (
                                            <label key={perm._id}
                                                className={`flex items-center gap-1.5 p-2 rounded-lg border cursor-pointer transition-all ${selectedPermissions.includes(perm._id) ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 hover:border-blue-200'}`}>
                                                <input type="checkbox"
                                                    checked={selectedPermissions.includes(perm._id)}
                                                    onChange={() => togglePermission(perm._id)}
                                                    className="w-3 h-3 text-[#011d52] rounded border-slate-300 focus:ring-0" />
                                                <span className={`text-[8px] font-bold uppercase tracking-wider leading-tight ${selectedPermissions.includes(perm._id) ? 'text-[#011d52]' : 'text-slate-500'}`}>
                                                    {perm.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </form>
            )}
        </main>
    );
};

export default RoleEdit;
