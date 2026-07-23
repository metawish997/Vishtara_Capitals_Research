import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import employeeService from '../../../services/employeeService';
import designationService from '../../../services/designationService';
import { BASE_URL } from '../../../services/api';
import toast from 'react-hot-toast';

const HierarchyNode = ({ node, getPhotoUrl }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="flex flex-col items-center">
            {/* The Node Block Card (Flowchart Pill) */}
            <div className="w-[145px] bg-[#ffffff] border border-[#e2e8f0] rounded-full py-1.5 pl-1.5 pr-3.5 flex items-center gap-2 relative z-10 shadow-sm hover:border-[#011d52]/60 hover:shadow-md transition-all">
                {/* Photo / Initials */}
                {node.profilePhoto ? (
                    <img
                        src={getPhotoUrl(node.profilePhoto)}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-[#e2e8f0] shadow-sm"
                    />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-[#011d52]/10 flex items-center justify-center text-[#011d52] font-black text-[9px] border border-[#011d52]/20 uppercase shadow-sm">
                        {node.firstName[0]}{node.lastName[0]}
                    </div>
                )}
                
                {/* Details */}
                <div className="text-left min-w-0 flex-1">
                    <p className="text-[9px] font-black text-[#1e293b] uppercase truncate leading-none">
                        {node.firstName} {node.lastName}
                    </p>
                    <p className="text-[6.5px] font-extrabold text-[#64748b] uppercase truncate mt-0.5">
                        {node.designationId?.name || 'Staff'}
                    </p>
                </div>
                
                {/* Status Dot */}
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${node.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                {/* Expand/Collapse Button (positioned under card if has children) */}
                {hasChildren && (
                    <button 
                        onClick={() => setExpanded(!expanded)} 
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] hover:text-[#011d52] hover:border-[#011d52]/50 flex items-center justify-center text-[7px] font-black transition-all shadow-sm active:scale-90 z-20"
                    >
                        {expanded ? '−' : '+'}
                    </button>
                )}
            </div>

            {/* If has children and is expanded, draw connector lines and recursively render children */}
            {hasChildren && expanded && (
                <div className="flex flex-col items-center w-full">
                    {/* Vertical line coming down from parent card */}
                    <div className="w-[1px] h-5 bg-[#e2e8f0]"></div>
                    
                    {/* Children Row container (no gaps to allow continuous connecting lines) */}
                    <div className="flex items-start gap-0 relative">
                        {node.children.map((child, index) => (
                            <div key={child._id} className="relative flex flex-col items-center flex-1 px-4">
                                {/* Horizontal connector lines (meet perfectly at item boundaries) */}
                                {index > 0 && (
                                    <div className="absolute top-0 left-0 w-[50%] h-[1px] bg-[#e2e8f0]"></div>
                                )}
                                {index < node.children.length - 1 && (
                                    <div className="absolute top-0 right-0 w-[50%] h-[1px] bg-[#e2e8f0]"></div>
                                )}
                                
                                {/* Vertical branch connector line */}
                                <div className="w-[1px] h-5 bg-[#e2e8f0]"></div>
                                
                                {/* Child Node */}
                                <HierarchyNode node={child} getPhotoUrl={getPhotoUrl} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const buildHierarchy = (employeesList) => {
    const map = {};
    employeesList.forEach(emp => {
        map[emp._id] = { ...emp, children: [] };
    });

    const roots = [];
    employeesList.forEach(emp => {
        const mappedEmp = map[emp._id];
        const managerId = emp.reportingTo?._id || emp.reportingTo;

        if (managerId && map[managerId]) {
            map[managerId].children.push(mappedEmp);
        } else {
            roots.push(mappedEmp);
        }
    });

    roots.sort((a, b) => {
        const lvlA = a.designationId?.level || 999;
        const lvlB = b.designationId?.level || 999;
        return lvlA - lvlB;
    });

    return roots;
};

const EmployeeList = () => {
    const navigate = useNavigate();

    // List & Filter States
    const [employees, setEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]); // Used for Reporting Manager dropdown selection
    const [designations, setDesignations] = useState([]);
    const [activeTab, setActiveTab] = useState('table'); // 'table' or 'hierarchy'
    const [loading, setLoading] = useState(true);

    // Search and Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [designationFilter, setDesignationFilter] = useState('All');

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    // Sorting
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // Modals & Drawers States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewDrawer, setShowViewDrawer] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Actions dropdown menu tracking
    const [activeMenuId, setActiveMenuId] = useState(null);
    const menuRef = useRef(null);

    // Form State (for Edit Employee only)
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        profilePhoto: null,
        profilePhotoPreview: null,
        designationId: '',
        reportingTo: '',
        joiningDate: '',
        status: 'Active'
    });

    // Close actions dropdown menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch master registries independently (avoids Promise.all fail-fast blockage)
    const fetchMasters = async () => {
        try {
            const desRes = await designationService.getDesignations();
            if (desRes && desRes.success) {
                setDesignations(desRes.data);
            }
        } catch (error) {
            console.error('Failed to load designations master registry', error);
        }

        try {
            const empRes = await employeeService.getEmployees({ limit: 1000 });
            if (empRes && empRes.success) {
                setAllEmployees(empRes.data);
            }
        } catch (error) {
            console.error('Failed to load employees for reporting manager selection', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const params = {
                search,
                status: statusFilter,
                designationId: designationFilter,
                page,
                limit,
                sortBy,
                sortOrder
            };
            const res = await employeeService.getEmployees(params);
            if (res.success) {
                setEmployees(res.data);
                setTotalPages(res.pagination.pages);
            }
        } catch (error) {
            toast.error('Failed to load employee list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMasters();
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [search, statusFilter, designationFilter, page, sortBy, sortOrder]);

    // Format profile picture URL safely
    const getPhotoUrl = (photoPath) => {
        if (!photoPath) return null;
        if (photoPath.startsWith('http')) return photoPath;
        return `${BASE_URL}${photoPath}`;
    };

    // Actions
    const handleToggleMenu = (e, id) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handleViewDetails = (emp) => {
        setSelectedEmployee(emp);
        setShowViewDrawer(true);
        setActiveMenuId(null);
    };

    const handleOpenEdit = (emp) => {
        setSelectedEmployee(emp);
        setForm({
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            phone: emp.phone,
            profilePhoto: null,
            profilePhotoPreview: getPhotoUrl(emp.profilePhoto),
            designationId: emp.designationId?._id || '',
            reportingTo: emp.reportingTo?._id || '',
            joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '',
            status: emp.status
        });
        setShowEditModal(true);
        setActiveMenuId(null);
    };

    const handleDelete = async (id) => {
        setActiveMenuId(null);
        if (window.confirm('Are you sure you want to delete this employee? (Soft delete will preserve historical followup data)')) {
            try {
                const res = await employeeService.deleteEmployee(id);
                if (res.success) {
                    toast.success('Employee deleted successfully.');
                    fetchEmployees();
                    fetchMasters(); // Refresh reporting managers list
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Delete operation failed');
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        setActiveMenuId(null);
        try {
            const res = await employeeService.changeEmployeeStatus(id, newStatus);
            if (res.success) {
                toast.success(`Employee status changed to ${newStatus}`);
                fetchEmployees();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Status update failed');
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({
                ...form,
                profilePhoto: file,
                profilePhotoPreview: URL.createObjectURL(file)
            });
        }
    };

    // Designation Level Checker for reportingTo validations
    const validateHierarchy = (empDesignationId, managerId) => {
        if (!managerId) return true;

        const empDesignation = designations.find(d => d._id === empDesignationId);
        const managerEmp = allEmployees.find(e => e._id === managerId);

        if (!empDesignation || !managerEmp || !managerEmp.designationId) return true;

        let managerDesignation = managerEmp.designationId;
        if (typeof managerDesignation === 'string') {
            managerDesignation = designations.find(d => d._id === managerDesignation);
        }
        if (!managerDesignation) return true;

        const isSalesHead = empDesignation.name?.trim().toLowerCase() === 'sales head';
        const isManagerAdmin = managerDesignation.name?.trim().toLowerCase() === 'admin';

        if (isSalesHead) {
            // Sales Head reports ONLY to Admin
            if (!isManagerAdmin) {
                toast.error('Hierarchy Warning: A Sales Head must report only to an Admin.');
                return false;
            }
            return true;
        }

        // Other designations cannot report directly to Admin
        if (isManagerAdmin) {
            toast.error('Hierarchy Warning: Only Sales Head can report directly to an Admin.');
            return false;
        }

        const managerLevel = managerDesignation.level;
        const employeeLevel = empDesignation.level;

        // Remember: level 1 is highest
        if (managerLevel >= employeeLevel) {
            toast.error(`Hierarchy Warning: A ${empDesignation.name} cannot report to a ${managerDesignation.name || 'subordinate'}. Manager must be higher in hierarchy.`);
            return false;
        }
        return true;
    };

    const handleUpdateEmployeeSubmit = async (e) => {
        e.preventDefault();

        if (!form.designationId || !form.joiningDate || !form.status) {
            toast.error('Required fields are missing.');
            return;
        }

        if (!validateHierarchy(form.designationId, form.reportingTo)) {
            return;
        }

        const formData = new FormData();
        formData.append('firstName', form.firstName);
        formData.append('lastName', form.lastName);
        formData.append('email', form.email);
        formData.append('phone', form.phone);
        formData.append('designationId', form.designationId);
        formData.append('reportingTo', form.reportingTo || ''); // Empty string deletes manager ref in backend
        formData.append('joiningDate', form.joiningDate);
        formData.append('status', form.status);
        if (form.profilePhoto) {
            formData.append('profilePhoto', form.profilePhoto);
        }

        try {
            const res = await employeeService.updateEmployee(selectedEmployee._id, formData);
            if (res.success) {
                toast.success('Employee updated successfully!');
                setShowEditModal(false);
                fetchEmployees();
                fetchMasters();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update employee details');
        }
    };

    const selectedDesig = designations.find(d => d._id === form.designationId);

    const getFilteredManagers = (selectedDesigId, currentEmployeeId = null) => {
        if (!selectedDesigId) return [];
        const selD = designations.find(d => d._id === selectedDesigId);
        if (!selD) return [];

        const isSh = selD.name?.trim().toLowerCase() === 'sales head';
        const isAdmin = selD.name?.trim().toLowerCase() === 'admin';

        if (isAdmin) return [];

        return allEmployees.filter(emp => {
            if (currentEmployeeId && emp._id === currentEmployeeId) return false;

            let empDesig = emp.designationId;
            if (!empDesig) return false;

            if (typeof empDesig === 'string') {
                empDesig = designations.find(d => d._id === empDesig);
            }
            if (!empDesig) return false;

            const isEmpAdmin = empDesig.name?.trim().toLowerCase() === 'admin';

            if (isSh) {
                return isEmpAdmin;
            } else {
                if (isEmpAdmin) return false;
                return empDesig.level < selD.level;
            }
        });
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-sans text-[10px]">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Employee Management</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Configure staff members, designations, and reporting lines</p>
                </div>
                <button
                    onClick={() => navigate('/admin/employees/create')}
                    className="px-4 py-2 bg-[#011d52] text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:opacity-90 shadow-sm transition mt-3 md:mt-0">
                    + Add Employee
                </button>
            </div>

            {/* Tabs Switcher */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-md w-fit">
                <button
                    onClick={() => setActiveTab('table')}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'table'
                        ? 'bg-[#011d52] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                        }`}
                >
                    Table View
                </button>
                <button
                    onClick={() => setActiveTab('hierarchy')}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'hierarchy'
                        ? 'bg-[#011d52] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                        }`}
                >
                    Hierarchy Tree
                </button>
            </div>

            {activeTab === 'table' ? (
                <>
                    {/* Filters Row */}
                    <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-sm flex flex-wrap gap-3 items-center">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search by code, name, email or phone..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-[#011d52] transition-colors"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="min-w-[120px]">
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 outline-none focus:border-[#011d52] cursor-pointer"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Resigned">Resigned</option>
                            </select>
                        </div>

                        {/* Designation Filter */}
                        <div className="min-w-[150px]">
                            <select
                                value={designationFilter}
                                onChange={(e) => { setDesignationFilter(e.target.value); setPage(1); }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 outline-none focus:border-[#011d52] cursor-pointer"
                            >
                                <option value="All">All Designations</option>
                                {designations.map(d => (
                                    <option key={d._id} value={d._id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Main Table Card */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Employee Code</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Employee Name</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Designation & Role</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reporting Manager</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact details</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Joining Date</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {loading ? (
                                        [1, 2, 3].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="8" className="px-4 py-3">
                                                    <div className="h-3 bg-[#e2e8f0]/20 rounded-full w-full"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : employees.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-8 text-center text-[#64748b] font-black uppercase tracking-wider text-[9px]">
                                                No employees found matching the filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        employees.map((emp) => (
                                            <tr key={emp._id} className="hover:bg-slate-50 transition-colors group">
                                                {/* Code */}
                                                <td className="px-4 py-3 font-bold text-slate-800 font-mono text-[10px]">
                                                    {emp.employeeCode}
                                                </td>

                                                {/* Profile & Name */}
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        {emp.profilePhoto ? (
                                                            <img
                                                                src={getPhotoUrl(emp.profilePhoto)}
                                                                alt={`${emp.firstName} ${emp.lastName}`}
                                                                className="w-6 h-6 rounded-full object-cover border border-slate-200"
                                                            />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[8px] border border-slate-200 uppercase">
                                                                {emp.firstName[0]}{emp.lastName[0]}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800">
                                                                {emp.firstName} {emp.lastName}
                                                            </p>
                                                            <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">Staff User</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Designation & Role */}
                                                <td className="px-4 py-3 align-middle">
                                                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                                                        {emp.designationId?.name || <span className="text-slate-400 italic">Unassigned</span>}
                                                    </p>
                                                    <p className="text-[9px] text-[#011d52] font-bold uppercase tracking-widest mt-0.5">
                                                        {emp.roleId?.name || 'Employee'}
                                                    </p>
                                                </td>

                                                {/* Reporting Manager */}
                                                <td className="px-4 py-3 align-middle">
                                                    {emp.reportingTo ? (
                                                        <div>
                                                            <p className="font-bold text-slate-800 uppercase text-[10px]">
                                                                {emp.reportingTo.firstName} {emp.reportingTo.lastName}
                                                            </p>
                                                            <p className="text-[9px] text-slate-500 font-medium mt-0.5 uppercase tracking-widest">
                                                                ({emp.reportingTo.designationId?.name || 'Manager'})
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 font-medium italic text-[10px]">No reporting manager</span>
                                                    )}
                                                </td>

                                                {/* Contact Details */}
                                                <td className="px-4 py-3 align-middle text-[10px]">
                                                    <p className="font-bold text-slate-800">{emp.email}</p>
                                                    <p className="text-[9px] text-slate-500 mt-0.5 font-mono">{emp.phone}</p>
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-3 align-middle">
                                                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] tracking-widest uppercase border ${emp.status === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-500 border-emerald-200'
                                                        : emp.status === 'Inactive'
                                                            ? 'bg-amber-50 text-amber-500 border-amber-200'
                                                            : 'bg-rose-50 text-rose-500 border-rose-200'
                                                        }`}>
                                                        {emp.status}
                                                    </span>
                                                </td>

                                                {/* Joining Date */}
                                                <td className="px-4 py-3 align-middle text-slate-500 font-medium text-[10px]">
                                                    {new Date(emp.joiningDate).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3 text-right align-middle relative">
                                                    <button
                                                        onClick={(e) => handleToggleMenu(e, emp._id)}
                                                        className="w-6 h-6 flex items-center justify-center bg-slate-50 hover:bg-[#011d52]/10 hover:text-[#011d52] rounded text-slate-500 border border-slate-200 transition-all font-bold"
                                                    >
                                                        ⋮
                                                    </button>
                                                    {activeMenuId === emp._id && (
                                                        <div
                                                            ref={menuRef}
                                                            className="absolute right-4 top-10 bg-[#ffffff] border border-[#e2e8f0] rounded-xl shadow-xl py-1.5 w-36 z-30 text-left animate-in fade-in slide-in-from-top-2 duration-150"
                                                        >
                                                            <button onClick={() => handleViewDetails(emp)} className="w-full px-3 py-1.5 hover:bg-[#f8fafc] text-[#1e293b] text-[9px] font-bold uppercase transition-all text-left flex items-center gap-2">
                                                                🔍 View Profile
                                                            </button>
                                                            <button onClick={() => handleOpenEdit(emp)} className="w-full px-3 py-1.5 hover:bg-[#f8fafc] text-[#1e293b] text-[9px] font-bold uppercase transition-all text-left flex items-center gap-2">
                                                                ✏️ Edit Profile
                                                            </button>

                                                            {emp.status !== 'Active' && (
                                                                <button onClick={() => handleStatusChange(emp._id, 'Active')} className="w-full px-3 py-1.5 hover:bg-[#f8fafc] text-emerald-500 text-[9px] font-bold uppercase transition-all text-left flex items-center gap-2">
                                                                    🟢 Activate
                                                                </button>
                                                            )}
                                                            {emp.status === 'Active' && (
                                                                <button onClick={() => handleStatusChange(emp._id, 'Inactive')} className="w-full px-3 py-1.5 hover:bg-[#f8fafc] text-amber-500 text-[9px] font-bold uppercase transition-all text-left flex items-center gap-2">
                                                                    🟡 Deactivate
                                                                </button>
                                                            )}
                                                            {emp.status !== 'Resigned' && (
                                                                <button onClick={() => handleStatusChange(emp._id, 'Resigned')} className="w-full px-3 py-1.5 hover:bg-[#f8fafc] text-rose-500 text-[9px] font-bold uppercase transition-all text-left flex items-center gap-2">
                                                                    🔴 Mark Resigned
                                                                </button>
                                                            )}

                                                            <div className="h-[1px] bg-[#e2e8f0]/30 my-1"></div>
                                                            <button onClick={() => handleDelete(emp._id)} className="w-full px-3 py-1.5 hover:bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase transition-all text-left flex items-center gap-2">
                                                                🗑️ Delete Employee
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {!loading && totalPages > 1 && (
                            <div className="p-3 border-t border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]/20">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 bg-[#ffffff] border border-[#e2e8f0] text-[#64748b] hover:text-[#1e293b] rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase text-[8px] tracking-widest"
                                >
                                    Previous
                                </button>
                                <span className="font-bold text-[#64748b] uppercase text-[8px] tracking-widest">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-3 py-1.5 bg-[#ffffff] border border-[#e2e8f0] text-[#64748b] hover:text-[#1e293b] rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase text-[8px] tracking-widest"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                /* Hierarchy Card */
                <div className="bg-[#ffffff] p-4 border border-[#e2e8f0] rounded-[4px] shadow-sm">
                    <div className="border-b border-[#e2e8f0] pb-3 mb-4">
                        <h2 className="text-xs font-black text-[#1e293b] uppercase tracking-wider">
                            Organizational Hierarchy
                        </h2>
                        <p className="text-[8px] text-[#64748b] font-bold uppercase tracking-wider mt-1">
                            Recursive reporting structure sorted by designation levels
                        </p>
                    </div>
                    {allEmployees.length === 0 ? (
                        <div className="text-center text-[#64748b] py-8 font-black uppercase text-[9px]">
                            No employees registry found to build hierarchy tree.
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto p-4 bg-[#f8fafc]/30 border border-[#e2e8f0] rounded-[4px] custom-scrollbar flex justify-center">
                            <div className="min-w-max flex justify-center items-start gap-8 py-4">
                                {buildHierarchy(allEmployees).map(root => (
                                    <HierarchyNode 
                                        key={root._id} 
                                        node={root} 
                                        getPhotoUrl={getPhotoUrl} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* EDIT EMPLOYEE MODAL */}
            {showEditModal && selectedEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f8fafc]/80 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-8 border-b border-[#e2e8f0] flex justify-between items-center bg-[#f8fafc]/30">
                            <div>
                                <h3 className="text-xs font-black text-[#1e293b] tracking-tight uppercase">Edit Employee Profile</h3>
                                <p className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest mt-1.5">Code: {selectedEmployee.employeeCode}</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="w-10 h-10 flex items-center justify-center bg-[#ffffff] border border-[#e2e8f0] rounded-full shadow-sm text-[#64748b] hover:text-[#1e293b] transition-all text-xs font-semibold">&times;</button>
                        </div>

                        <form onSubmit={handleUpdateEmployeeSubmit} className="p-10 space-y-5 overflow-y-auto max-h-[75vh] custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2 ml-1">First Name *</label>
                                    <input
                                        value={form.firstName}
                                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-5 py-3 rounded-2xl outline-none focus:border-[#011d52] text-[#1e293b] transition-all font-bold text-xs"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2 ml-1">Last Name *</label>
                                    <input
                                        value={form.lastName}
                                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-5 py-3 rounded-2xl outline-none focus:border-[#011d52] text-[#1e293b] transition-all font-bold text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2 ml-1">Email Address *</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-5 py-3 rounded-2xl outline-none focus:border-[#011d52] text-[#1e293b] transition-all font-bold text-xs"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2 ml-1">Phone Number *</label>
                                <input
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-5 py-3 rounded-2xl outline-none focus:border-[#011d52] text-[#1e293b] transition-all font-bold text-xs font-mono"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2 ml-1">Profile Photo</label>
                                <div className="flex items-center gap-4 mt-2">
                                    {form.profilePhotoPreview ? (
                                        <img src={form.profilePhotoPreview} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-[#e2e8f0]" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#64748b]">🖼️</div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="text-[10px] text-[#64748b] file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-[#011d52]/10 file:text-[#011d52] hover:file:bg-[#011d52]/20 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2 ml-1">Designation *</label>
                                <select
                                    value={form.designationId}
                                    onChange={(e) => {
                                        const desigId = e.target.value;
                                        const selD = designations.find(d => d._id === desigId);
                                        const isAdmin = !!(selD && selD.name?.trim().toLowerCase() === 'admin');

                                        setForm(prev => {
                                            let newReportingTo = prev.reportingTo;
                                            if (isAdmin) {
                                                newReportingTo = '';
                                            } else {
                                                const validManagers = getFilteredManagers(desigId, selectedEmployee?._id);
                                                const isValid = validManagers.some(m => m._id === prev.reportingTo);
                                                if (!isValid) {
                                                    newReportingTo = '';
                                                }
                                            }
                                            return {
                                                ...prev,
                                                designationId: desigId,
                                                reportingTo: newReportingTo
                                            };
                                        });
                                    }}
                                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-5 py-3 rounded-2xl outline-none focus:border-[#011d52] text-[#1e293b] transition-all font-bold text-xs"
                                    required
                                >
                                    <option value="">Select...</option>
                                    {designations.map(d => (
                                        <option key={d._id} value={d._id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedDesig && selectedDesig.name?.trim().toLowerCase() !== 'admin' && (
                                <div>
                                    <label className="block text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2 ml-1">Reporting Manager</label>
                                    <select
                                        value={form.reportingTo}
                                        onChange={(e) => setForm({ ...form, reportingTo: e.target.value })}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-5 py-3 rounded-2xl outline-none focus:border-[#011d52] text-[#1e293b] transition-all font-bold text-xs"
                                    >
                                        <option value="">Select Reporting Manager...</option>
                                        {getFilteredManagers(form.designationId, selectedEmployee?._id).map(e => (
                                            <option key={e._id} value={e._id}>
                                                {e.firstName} {e.lastName} ({e.designationId?.name || 'No Designation'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2 ml-1">Joining Date *</label>
                                    <input
                                        type="date"
                                        value={form.joiningDate}
                                        onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-5 py-3 rounded-2xl outline-none focus:border-[#011d52] text-[#1e293b] transition-all font-bold text-xs font-mono"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2 ml-1">Status *</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-5 py-3 rounded-2xl outline-none focus:border-[#011d52] text-[#1e293b] transition-all font-bold text-xs"
                                        required
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Resigned">Resigned</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4 justify-end border-t border-[#e2e8f0]/30">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-8 py-3 text-[10px] font-black text-[#64748b] hover:text-[#1e293b] uppercase tracking-widest transition-colors">Discard</button>
                                <button type="submit" className="bg-[#011d52] text-[#020210] px-10 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#011d52]/5 hover:opacity-90 transition-all active:scale-95">
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* VIEW EMPLOYEE DRAWER */}
            {showViewDrawer && selectedEmployee && (
                <div className="fixed inset-0 z-50 flex justify-end bg-[#f8fafc]/80 backdrop-blur-[1.5px] animate-in fade-in duration-200">
                    {/* Drawer Backdrop dismiss */}
                    <div className="flex-1" onClick={() => setShowViewDrawer(false)}></div>

                    {/* Content Panel */}
                    <div className="bg-[#ffffff] border-l border-[#e2e8f0] w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-350 overflow-hidden text-[#1e293b]">
                        {/* Header */}
                        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]/20">
                            <div>
                                <h3 className="text-xs font-black text-[#1e293b] uppercase tracking-tighter">Employee <span className="text-[#011d52]">Profile</span></h3>
                                <p className="text-[9px] text-[#64748b] font-bold uppercase tracking-wider mt-1">Registry node details</p>
                            </div>
                            <button
                                onClick={() => setShowViewDrawer(false)}
                                className="w-10 h-10 bg-[#ffffff] border border-[#e2e8f0] rounded-full flex items-center justify-center text-[#64748b] hover:text-[#1e293b] shadow-sm transition-all"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Profile Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
                            {/* Card Display */}
                            <div className="flex flex-col items-center text-center p-4 bg-[#f8fafc]/30 border border-[#e2e8f0] rounded-[2rem]">
                                {selectedEmployee.profilePhoto ? (
                                    <img
                                        src={getPhotoUrl(selectedEmployee.profilePhoto)}
                                        alt="profile"
                                        className="w-20 h-20 rounded-full object-cover border-2 border-[#e2e8f0] shadow-md mb-4"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-[#011d52]/10 text-[#011d52] font-black text-xs font-semibold flex items-center justify-center border-2 border-[#011d52]/20 shadow-md mb-4 uppercase">
                                        {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                                    </div>
                                )}
                                <h4 className="text-xs font-black text-[#1e293b] tracking-tight leading-none uppercase">
                                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                                </h4>
                                <p className="text-[9px] text-[#011d52] font-bold uppercase tracking-widest mt-2">{selectedEmployee.employeeCode}</p>
                                <div className="mt-4 flex gap-2">
                                    <span className="px-3 py-1 bg-[#ffffff] border border-[#e2e8f0] text-[#64748b] font-black uppercase text-[8px] rounded-full tracking-wider">
                                        {selectedEmployee.designationId?.name || 'Unassigned'}
                                    </span>
                                    <span className="px-3 py-1 bg-[#011d52]/10 border border-[#011d52]/20 text-[#011d52] font-black uppercase text-[8px] rounded-full tracking-wider">
                                        {selectedEmployee.roleId?.name || 'Employee'}
                                    </span>
                                </div>
                            </div>

                            {/* Section: Contact */}
                            <div className="space-y-4">
                                <h5 className="text-[9px] font-black text-[#64748b] uppercase tracking-widest border-b border-[#e2e8f0] pb-2">Contact Details</h5>
                                <div className="space-y-3 font-medium text-[#1e293b] text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Email:</span>
                                        <a href={`mailto:${selectedEmployee.email}`} className="font-bold text-[#011d52] hover:underline">{selectedEmployee.email}</a>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Phone:</span>
                                        <a href={`tel:${selectedEmployee.phone}`} className="font-bold font-mono tracking-tight">{selectedEmployee.phone}</a>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Employment */}
                            <div className="space-y-4">
                                <h5 className="text-[9px] font-black text-[#64748b] uppercase tracking-widest border-b border-[#e2e8f0] pb-2">Employment Settings</h5>
                                <div className="space-y-3 font-medium text-[#1e293b] text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Hierarchy Level:</span>
                                        <span className="font-bold text-[#1e293b]">
                                            {selectedEmployee.designationId?.level ? `Level ${selectedEmployee.designationId.level}` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Reporting Manager:</span>
                                        <span className="font-bold text-[#1e293b] uppercase">
                                            {selectedEmployee.reportingTo ? (
                                                `${selectedEmployee.reportingTo.firstName} ${selectedEmployee.reportingTo.lastName} (${selectedEmployee.reportingTo.designationId?.name || 'Manager'})`
                                            ) : (
                                                <span className="text-[#64748b]/30 italic font-normal">None</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Joining Date:</span>
                                        <span className="font-bold text-[#1e293b]">
                                            {new Date(selectedEmployee.joiningDate).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Current Status:</span>
                                        <span className={`px-2 py-0.5 rounded-full font-black text-[8px] tracking-widest uppercase border ${selectedEmployee.status === 'Active'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : selectedEmployee.status === 'Inactive'
                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                            }`}>
                                            {selectedEmployee.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Metadata */}
                            <div className="space-y-4">
                                <h5 className="text-[9px] font-black text-[#64748b] uppercase tracking-widest border-b border-[#e2e8f0] pb-2">Logs Registry</h5>
                                <div className="space-y-3 font-medium text-[#1e293b] text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Registration Date:</span>
                                        <span className="font-bold text-[#1e293b]">
                                            {new Date(selectedEmployee.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#64748b]">Last Updated:</span>
                                        <span className="font-bold text-[#1e293b]">
                                            {new Date(selectedEmployee.updatedAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="p-4 border-t border-[#e2e8f0] bg-[#f8fafc]/40 flex gap-4">
                            <button
                                onClick={() => { setShowViewDrawer(false); handleOpenEdit(selectedEmployee); }}
                                className="flex-1 bg-[#011d52] text-[#020210] py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center shadow-lg shadow-[#011d52]/5 hover:opacity-90 transition-all active:scale-95"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={() => setShowViewDrawer(false)}
                                className="flex-1 bg-[#ffffff] border border-[#e2e8f0] text-[#64748b] hover:text-[#1e293b] py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center transition-all active:scale-95"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default EmployeeList;

