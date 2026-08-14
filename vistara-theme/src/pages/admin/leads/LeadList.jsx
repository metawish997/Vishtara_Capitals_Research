import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import leadService from '../../../services/leadService';
import toast from 'react-hot-toast';
import { Search, Filter, Eye, Edit2, Trash2, UserPlus, ToggleLeft, ArrowUpDown, X, ArrowUp, ArrowDown } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { isAdminUser } from '../../../utils/rbac';

const InlineCustomDropdown = ({ value, options, onChange, renderValue, className, style, dropdownClass }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <div
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className={`${className} cursor-pointer flex items-center justify-between gap-1`}
                style={style}
            >
                {renderValue}
            </div>
            {isOpen && (
                <div className={`absolute left-0 top-full mt-1 z-[9999] bg-[white] border border-[slate-200] rounded shadow-xl flex flex-col py-1 min-w-[140px] max-h-[200px] overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] whitespace-nowrap ${dropdownClass || ''}`}>
                    {options.map((opt, i) => (
                        <div
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (opt.value !== value) onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`px-3 py-2 text-[10px] font-bold cursor-pointer transition-colors ${opt.value === value
                                ? 'bg-[[#011d52]] text-[slate-800]'
                                : 'text-[slate-800] hover:bg-[[#011d52]]/10 hover:text-[[#011d52]]'
                                }`}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MultiSelectFilter = ({ label, options, selectedValues, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const toggleOption = (value) => {
        const currentVals = Array.isArray(selectedValues) ? selectedValues : [];
        if (currentVals.includes(value)) {
            onChange(currentVals.filter(v => v !== value));
        } else {
            onChange([...currentVals, value]);
        }
    };

    const toggleAll = () => {
        onChange([]);
    };

    const safeSelectedLength = Array.isArray(selectedValues) ? selectedValues.length : 0;
    const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-3 py-1.5 text-[10px] font-bold text-[slate-800] outline-none cursor-pointer hover:border-[[#011d52]] transition-colors flex justify-between items-center"
            >
                <span className="truncate">
                    {safeSelectedLength === 0 ? 'All Selected' : `${safeSelectedLength} Selected`}
                </span>
                <span className="text-[slate-500] text-[8px]">▼</span>
            </div>
            {isOpen && (
                <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full bg-[white] border border-[slate-200] rounded-[6px] shadow-xl flex flex-col py-1 max-h-[200px] overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div
                        onClick={toggleAll}
                        className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold cursor-pointer hover:bg-[slate-50] border-b border-[slate-200]"
                    >
                        <input type="checkbox" checked={safeSelectedLength === 0} readOnly className="accent-[[#011d52]] w-3 h-3 cursor-pointer" />
                        <span>All (Clear Filter)</span>
                    </div>
                    {options.map((opt, i) => (
                        <div
                            key={i}
                            onClick={() => toggleOption(opt.value)}
                            className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold cursor-pointer hover:bg-[slate-50]"
                        >
                            <input
                                type="checkbox"
                                checked={safeSelectedValues.includes(opt.value)}
                                readOnly
                                className="accent-[[#011d52]] w-3 h-3 cursor-pointer"
                            />
                            <span className="truncate">{opt.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const LeadList = () => {
    const { user } = useAuth();
    const isAdmin = isAdminUser(user);
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ sources: [], categories: [], statuses: [], employees: [] });
    const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, newLeads: 0, interestedLeads: 0, convertedLeads: 0, lostLeads: 0 });

    // Filter & Query States
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({
        status: 'All',
        leadSource: [],
        leadCategory: [],
        ownerLead: [],
        readStatus: [],
        startDate: '',
        endDate: ''
    });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const filterRef = useRef(null);

    const activeFiltersCount = [
        filters.leadCategory.length > 0,
        filters.leadSource.length > 0,
        filters.ownerLead.length > 0,
        filters.readStatus.length > 0,
        filters.startDate !== '',
        filters.endDate !== ''
    ].filter(Boolean).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowAdvancedFilters(false);
            }
        };
        if (showAdvancedFilters) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAdvancedFilters]);

    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // Bulk Actions State
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [bulkOwnerId, setBulkOwnerId] = useState('');
    const [bulkAssigning, setBulkAssigning] = useState(false);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingLead, setEditingLead] = useState(null);

    // Form States
    const [addForm, setAddForm] = useState({
        fullName: '',
        mobileNumber: '',
        email: '',
        leadSource: '',
        leadCategory: '',
        status: '',
        ownerLead: '',
        initialComment: ''
    });

    const [editForm, setEditForm] = useState({
        fullName: '',
        mobileNumber: '',
        email: '',
        leadSource: '',
        leadCategory: '',
        status: '',
        ownerLead: ''
    });

    // Fetch dashboard stats
    const fetchStats = async () => {
        try {
            const res = await leadService.getDashboard();
            if (res.success) {
                setStats(res.data);
            }
        } catch (err) {
            console.error('Failed to load dashboard stats:', err);
        }
    };

    // Fetch dropdown metadata
    const fetchMetadata = async () => {
        try {
            const res = await leadService.getMetadata();
            if (res.success) {
                setMeta(res.data);
                // Pre-populate Add Form default dropdown values if available
                setAddForm(prev => ({
                    ...prev,
                    leadSource: res.data.sources[0]?._id || '',
                    leadCategory: res.data.categories[0]?._id || '',
                    status: res.data.statuses[0]?._id || '',
                    ownerLead: res.data.employees[0]?._id || ''
                }));
            }
        } catch (err) {
            toast.error('Failed to load filter dropdowns');
        }
    };

    // Handler for filter changes
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Fetch lead registry
    const fetchLeads = async () => {
        setLoading(true);
        try {
            const apiFilters = {
                ...filters,
                leadCategory: Array.isArray(filters.leadCategory) && filters.leadCategory.length > 0 ? filters.leadCategory : 'All',
                leadSource: Array.isArray(filters.leadSource) && filters.leadSource.length > 0 ? filters.leadSource : 'All',
                ownerLead: Array.isArray(filters.ownerLead) && filters.ownerLead.length > 0 ? filters.ownerLead : 'All',
                readStatus: Array.isArray(filters.readStatus) && filters.readStatus.length > 0 ? filters.readStatus : 'All',
            };
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                sortBy,
                sortOrder,
                search: debouncedSearch,
                ...apiFilters
            };
            const res = await leadService.getLeads(params);
            if (res.success) {
                // Ensure Unread leads are always sorted at the top visually on the frontend
                const sortedLeads = [...res.data].sort((a, b) => {
                    if (a.readStatus === 'Unread' && b.readStatus === 'Read') return -1;
                    if (a.readStatus === 'Read' && b.readStatus === 'Unread') return 1;
                    return 0;
                });

                setLeads(sortedLeads);
                setPagination(prev => ({
                    ...prev,
                    total: res.pagination.total,
                    pages: res.pagination.pages
                }));
            }
        } catch (err) {
            toast.error('Failed to load leads list');
        } finally {
            setLoading(false);
            setSelectedLeads([]); // Clear selection when data changes
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (debouncedSearch !== search) {
                setDebouncedSearch(search);
                setPagination(prev => ({ ...prev, page: 1 }));
            }
        }, 400);
        return () => clearTimeout(handler);
    }, [search, debouncedSearch]);

    useEffect(() => {
        fetchMetadata();
        fetchStats();
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [pagination.page, pagination.limit, sortBy, sortOrder, filters, debouncedSearch]);

    const handleClearFilters = () => {
        setSearch('');
        setFilters({
            status: 'All',
            leadSource: [],
            leadCategory: [],
            ownerLead: [],
            readStatus: [],
            startDate: '',
            endDate: ''
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const renderSortIcon = (field) => {
        const isActive = sortBy === field;
        const isAsc = isActive && sortOrder === 'asc';
        const isDesc = isActive && sortOrder === 'desc';
        return (
            <div className="flex flex-col ml-1 opacity-80">
                <ArrowUp strokeWidth={1} className={`w-2.0 h-2.5 -mb-[3px] ${isAsc ? 'text-[[#011d52]] stroke-[2.5px] opacity-100' : 'text-[slate-500] opacity-30'}`} />
                <ArrowDown strokeWidth={1} className={`w-2.5 h-2.5 ${isDesc ? 'text-[[#011d52]] stroke-[2.5px] opacity-100' : 'text-[slate-500] opacity-30'}`} />
            </div>
        );
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!addForm.fullName || !addForm.mobileNumber) {
            toast.error('Full Name and Mobile Number are required.');
            return;
        }
        try {
            const res = await leadService.createLead(addForm);
            if (res.success) {
                toast.success('Lead created successfully');
                setShowAddModal(false);
                setAddForm({
                    fullName: '',
                    mobileNumber: '',
                    email: '',
                    leadSource: meta.sources[0]?._id || '',
                    leadCategory: meta.categories[0]?._id || '',
                    status: meta.statuses[0]?._id || '',
                    ownerLead: meta.employees[0]?._id || '',
                    initialComment: ''
                });
                fetchLeads();
                fetchStats();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create lead');
        }
    };

    const handleOpenEdit = (lead) => {
        setEditingLead(lead);
        setEditForm({
            fullName: lead.fullName,
            mobileNumber: lead.mobileNumber,
            email: lead.email || '',
            leadSource: lead.leadSource?._id || '',
            leadCategory: lead.leadCategory?._id || '',
            status: lead.status?._id || '',
            ownerLead: lead.ownerLead?._id || ''
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editForm.fullName || !editForm.mobileNumber) {
            toast.error('Full Name and Mobile Number are required.');
            return;
        }
        try {
            const res = await leadService.updateLead(editingLead._id, editForm);
            if (res.success) {
                toast.success('Lead details updated successfully');
                setShowEditModal(false);
                fetchLeads();
                fetchStats();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update lead');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this lead? This will clear all comment and audit records.')) {
            try {
                const res = await leadService.deleteLead(id);
                if (res.success) {
                    toast.success('Lead deleted successfully');
                    fetchLeads();
                    fetchStats();
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete lead');
            }
        }
    };

    const handleQuickOwnerChange = async (leadId, ownerId) => {
        try {
            const res = await leadService.changeLeadOwner(leadId, ownerId);
            if (res.success) {
                toast.success('Lead owner updated successfully');
                fetchLeads();
                fetchStats();
            }
        } catch (err) {
            toast.error('Failed to change owner');
        }
    };

    const handleQuickStatusChange = async (leadId, statusId) => {
        try {
            const res = await leadService.changeLeadStatus(leadId, statusId);
            if (res.success) {
                toast.success('Lead status updated successfully');
                fetchLeads();
                fetchStats();
            }
        } catch (err) {
            toast.error('Failed to change status');
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedLeads(leads.map(l => l._id));
        } else {
            setSelectedLeads([]);
        }
    };

    const handleSelectLead = (id) => {
        setSelectedLeads(prev =>
            prev.includes(id) ? prev.filter(lId => lId !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to permanently delete ${selectedLeads.length} leads? This action cannot be undone.`)) {
            try {
                let successCount = 0;
                await Promise.all(selectedLeads.map(async (id) => {
                    const res = await leadService.deleteLead(id);
                    if (res.success) successCount++;
                }));
                toast.success(`Successfully deleted ${successCount} leads`);
                setSelectedLeads([]);
                fetchLeads();
                fetchStats();
            } catch (err) {
                toast.error('Failed to delete some leads');
            }
        }
    };

    const handleBulkAssign = async () => {
        if (!bulkOwnerId) {
            toast.error('Please select an owner to assign.');
            return;
        }
        if (selectedLeads.length === 0) {
            toast.error('No leads selected.');
            return;
        }
        setBulkAssigning(true);
        try {
            const res = await leadService.bulkAssignOwner(selectedLeads, bulkOwnerId);
            if (res.success) {
                toast.success(res.message || 'Leads assigned successfully.');
                setSelectedLeads([]);
                setBulkOwnerId('');
                fetchLeads();
                fetchStats();
            }
        } catch (err) {
            toast.error('Failed to assign leads.');
        } finally {
            setBulkAssigning(false);
        }
    };

    return (
        <div className="w-full space-y-6 text-[10px] font-sans pb-10">
            {/* Status Tabs — sticky at top, flush with no top gap */}
            <div className="sticky top-0 z-30 flex items-center bg-slate-50/90 backdrop-blur-md border-b border-slate-200 shadow-sm mb-0">

                {/* Scrollable Tabs */}
                <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <button
                        onClick={() => {
                            setFilters(prev => ({ ...prev, status: 'All' }));
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border-b-2 -mb-[1px] ${filters.status === 'All'
                            ? 'text-[[#011d52]] border-[[#011d52]]'
                            : 'text-[slate-500] border-transparent hover:text-[slate-800] hover:border-[slate-200]'
                            }`}
                    >
                        All Statuses
                    </button>
                    {meta.statuses.map(st => (
                        <button
                            key={st._id}
                            onClick={() => {
                                setFilters(prev => ({ ...prev, status: st._id }));
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border-b-2 -mb-[1px] ${filters.status === st._id
                                ? 'text-[[#011d52]] border-[[#011d52]]'
                                : 'text-[slate-500] border-transparent hover:text-[slate-800] hover:border-[slate-200]'
                                }`}
                        >
                            {st.name}
                        </button>
                    ))}
                </div>

                {/* Fixed Action Buttons */}
                <div ref={filterRef} className="flex items-center gap-2 pr-4 sm:pr-6 pl-3 shrink-0 relative bg-[slate-50]/90 backdrop-blur-md border-l border-[slate-200]/40 self-stretch">
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={handleClearFilters}
                            className="flex items-center justify-center w-6 h-6 rounded-[4px] text-[slate-500] hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-[slate-200] hover:border-rose-500/30"
                            title="Clear Filters"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-[9px] font-bold uppercase tracking-wider transition-all border ${showAdvancedFilters ? 'bg-[[#011d52]]/10 text-[[#011d52]] border-[[#011d52]]/30' : 'bg-[slate-50] text-[slate-500] border-[slate-200] hover:bg-[slate-200]/10'}`}
                    >
                        <Filter className="w-3 h-3" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <span className="ml-0.5 bg-[[#011d52]] text-[#020210] px-1.5 py-0.5 rounded-full text-[8px] font-black leading-none">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {/* Popover Modal for Filters */}
                    {showAdvancedFilters && (
                        <div className="absolute top-[calc(100%+8px)] right-4 sm:right-6 w-[280px] bg-[white] border border-[slate-200] rounded-[6px] shadow-2xl p-4 z-50 flex flex-col gap-3">
                            <MultiSelectFilter
                                label="Category"
                                options={meta.categories.map(c => ({ value: c._id, label: c.name }))}
                                selectedValues={filters.leadCategory}
                                onChange={(val) => handleFilterChange('leadCategory', val)}
                            />
                            <MultiSelectFilter
                                label="Source"
                                options={meta.sources.map(s => ({ value: s._id, label: s.name }))}
                                selectedValues={filters.leadSource}
                                onChange={(val) => handleFilterChange('leadSource', val)}
                            />
                            <MultiSelectFilter
                                label="Owner"
                                options={meta.employees.map(e => ({ value: e._id, label: `${e.firstName} ${e.lastName}` }))}
                                selectedValues={filters.ownerLead}
                                onChange={(val) => handleFilterChange('ownerLead', val)}
                            />
                            <MultiSelectFilter
                                label="Read / Unread"
                                options={[{ value: 'Unread', label: '🔴 Unread' }, { value: 'Read', label: '🟢 Read' }]}
                                selectedValues={filters.readStatus}
                                onChange={(val) => handleFilterChange('readStatus', val)}
                            />
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Start Date</label>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-2 py-1.5 text-[9px] font-bold text-[slate-800] outline-none focus:border-[[#011d52]]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">End Date</label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-2 py-1.5 text-[9px] font-bold text-[slate-800] outline-none focus:border-[[#011d52]]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Dashboard Stats Bar — compact inline */}
            <div className="bg-[white] border-b border-[slate-200] shadow-sm flex items-center overflow-hidden">
                <div className="flex-1 flex items-center overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] divide-x divide-[slate-200]">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-[slate-800]' },
                        { label: 'Unread', value: stats.unread, color: 'text-rose-500', dot: true },
                        { label: 'Read', value: stats.read, color: 'text-emerald-500' },
                        { label: 'New', value: stats.newLeads, color: 'text-blue-400' },
                        { label: 'Interested', value: stats.interestedLeads, color: 'text-purple-400' },
                        { label: 'Converted', value: stats.convertedLeads, color: 'text-emerald-400' },
                        { label: 'Lost', value: stats.lostLeads, color: 'text-rose-400' },
                    ].map(({ label, value, color, dot }) => (
                        <div key={label} className="flex items-center gap-2 px-4 py-2.5 shrink-0">
                            {dot && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />}
                            <span className="text-[8px] font-black text-[slate-500] uppercase tracking-wider whitespace-nowrap">{label}</span>
                            <span className={`text-[13px] font-black leading-none ${color}`}>{value}</span>
                        </div>
                    ))}
                </div>

                <div className="pl-4 pr-4 sm:pr-6 py-2 shrink-0 border-l border-[slate-200]/40 self-stretch flex items-center gap-2 bg-[white] z-10 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)]">
                    {(canAccess(user, 'admin') || hasPermission(user, 'delete_leads')) && selectedLeads.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="inline-flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-3 py-1.5 rounded-[4px] font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                            title="Delete Selected Leads"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                    )}
                    {(canAccess(user, 'admin') || hasPermission(user, 'create_leads')) && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-1 bg-[[#011d52]] hover:opacity-90 text-[#020210] px-3 py-1.5 rounded-[4px] font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 shadow-sm">
                            + Add Lead
                        </button>
                    )}
                </div>
            </div>



            {/* Leads Table Card */}
            <div className="bg-[white] border border-[slate-200] rounded-xl shadow-sm overflow-hidden mt-6">
                {/* Table Header with Search, Bulk Actions & Limit Selector */}
                <div className="px-4 sm:px-6 py-3 bg-[slate-50]/20 border-b border-[slate-200] flex flex-col lg:flex-row items-center gap-4">
                    {/* Small Search Bar */}
                    <div className="w-full lg:w-[200px] xl:w-[240px] relative flex items-center shrink-0">
                        <Search className="absolute left-3 w-4 h-4 text-[slate-500]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by Name, Mobile..."
                            className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] pl-10 pr-4 py-1.5 text-[10px] font-bold text-[slate-800] outline-none focus:border-[[#011d52]] transition-all placeholder-[slate-500]/50"
                        />
                    </div>

                    {/* Inline Bulk Actions Panel */}
                    {(canAccess(user, 'admin') || hasPermission(user, 'update_leads')) && selectedLeads.length > 0 && (
                        <div className="flex-1 w-full flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-left-2">
                            <span className="text-[10px] font-black text-[[#011d52]] uppercase tracking-wider bg-[[#011d52]]/10 px-2 py-1 rounded shrink-0">
                                {selectedLeads.length} selected
                            </span>
                            <div className="h-4 w-[1px] bg-[[#011d52]]/30 shrink-0"></div>
                            <select
                                value={bulkOwnerId}
                                onChange={(e) => setBulkOwnerId(e.target.value)}
                                className="bg-[slate-50] border border-[[#011d52]]/30 rounded-[4px] px-3 py-1.5 text-[9px] font-bold text-[slate-800] outline-none cursor-pointer focus:border-[[#011d52]] shrink-0"
                            >
                                <option value="">Select New Owner</option>
                                {meta.employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleBulkAssign}
                                disabled={bulkAssigning || !bulkOwnerId}
                                className="bg-[[#011d52]] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-[#020210] px-4 py-1.5 rounded-[4px] font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 shrink-0"
                            >
                                {bulkAssigning ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-[#020210]/20 border-t-[#020210] rounded-full animate-spin"></div>
                                        Assigning...
                                    </>
                                ) : (
                                    <>Assign to Owner</>
                                )}
                            </button>
                            <button
                                onClick={() => setSelectedLeads([])}
                                className="ml-auto text-[slate-500] hover:text-[slate-800] text-[9px] font-bold uppercase tracking-wider transition-colors shrink-0"
                            >
                                Clear Selection
                            </button>
                        </div>
                    )}

                    {/* Rows per page */}
                    <div className={`${!(isAdmin && selectedLeads.length > 0) ? 'ml-auto' : 'ml-4 shrink-0'} flex items-center gap-2`}>
                        <span className="text-[8px] font-black text-[slate-500] uppercase tracking-wider whitespace-nowrap">Rows per page:</span>
                        <select
                            value={pagination.limit}
                            onChange={(e) => setPagination(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
                            className="bg-[slate-50] border border-[slate-200] text-[9px] font-bold text-[slate-800] rounded-[4px] px-2 py-1 outline-none focus:border-[[#011d52]] transition-all cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[slate-50]/40 border-b border-[slate-200]">
                                {isAdmin && (
                                    <th className="px-4 py-3 w-10 text-center">
                                        <input
                                            type="checkbox"
                                            checked={leads.length > 0 && selectedLeads.length === leads.length}
                                            onChange={handleSelectAll}
                                            className="w-3.5 h-3.5 accent-[[#011d52]] cursor-pointer rounded-sm"
                                        />
                                    </th>
                                )}
                                <th onClick={() => handleSort('leadCode')} className="px-2 sm:px-4 py-3 text-[9px] font-black text-[slate-500] uppercase tracking-wider cursor-pointer hover:text-[slate-800] select-none">
                                    <div className="flex items-center">
                                        Code {renderSortIcon('leadCode')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('fullName')} className="px-2 sm:px-4 py-3 text-[9px] font-black text-[slate-500] uppercase tracking-wider cursor-pointer hover:text-[slate-800] select-none">
                                    <div className="flex items-center">
                                        Full Name {renderSortIcon('fullName')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('mobileNumber')} className="px-2 sm:px-4 py-3 text-[9px] font-black text-[slate-500] uppercase tracking-wider cursor-pointer hover:text-[slate-800] select-none">
                                    <div className="flex items-center">
                                        Contact Info {renderSortIcon('mobileNumber')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('leadSource')} className="px-2 sm:px-4 py-3 text-[9px] font-black text-[slate-500] uppercase tracking-wider cursor-pointer hover:text-[slate-800] select-none">
                                    <div className="flex items-center">
                                        Source {renderSortIcon('leadSource')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('leadCategory')} className="px-2 sm:px-4 py-3 text-[9px] font-black text-[slate-500] uppercase tracking-wider cursor-pointer hover:text-[slate-800] select-none">
                                    <div className="flex items-center">
                                        Category {renderSortIcon('leadCategory')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('status')} className="px-2 sm:px-4 py-3 text-[9px] font-black text-[slate-500] uppercase tracking-wider cursor-pointer hover:text-[slate-800] select-none">
                                    <div className="flex items-center">
                                        Status {renderSortIcon('status')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('ownerLead')} className="px-2 sm:px-4 py-3 text-[9px] font-black text-[slate-500] uppercase tracking-wider cursor-pointer hover:text-[slate-800] select-none">
                                    <div className="flex items-center">
                                        Lead Owner {renderSortIcon('ownerLead')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('updatedAt')} className="px-2 sm:px-4 py-3 text-[9px] font-black text-[slate-500] uppercase tracking-wider cursor-pointer hover:text-[slate-800] select-none">
                                    <div className="flex items-center">
                                        Last Updated {renderSortIcon('updatedAt')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-[slate-200]/30 ${loading && leads.length > 0 ? 'opacity-50 pointer-events-none transition-opacity duration-200' : ''}`}>
                            {loading && leads.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-12 text-center text-[slate-500] font-black uppercase tracking-wider text-[9px]">
                                        <div className="w-6 h-6 border-2 border-[[#011d52]]/20 border-t-[[#011d52]] rounded-full animate-spin mx-auto mb-3"></div>
                                        Fetching lead opportunities database...
                                    </td>
                                </tr>
                            ) : !loading && leads.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-12 text-center text-[slate-500] font-black uppercase tracking-wider text-[9px]">
                                        No leads found matching current query scope.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead._id} className={`transition-all duration-200 hover:bg-[[#011d52]]/5 group ${lead.readStatus === 'Read' ? 'opacity-60' : ''} ${selectedLeads.includes(lead._id) ? 'bg-[[#011d52]]/5' : ''}`}>
                                        {/* Checkbox */}
                                        {isAdmin && (
                                            <td className="px-4 py-3 w-10 text-center align-middle">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLeads.includes(lead._id)}
                                                    onChange={() => handleSelectLead(lead._id)}
                                                    className="w-3.5 h-3.5 accent-[[#011d52]] cursor-pointer rounded-sm"
                                                />
                                            </td>
                                        )}
                                        {/* Lead Code */}
                                        <td className={`px-2 sm:px-4 py-3 text-[[#011d52]] align-middle tracking-tight uppercase cursor-pointer ${lead.readStatus === 'Unread' ? 'font-extrabold' : 'font-medium'}`} onClick={() => navigate(`/admin/leads/${lead._id}`)}>
                                            {lead.leadCode}
                                        </td>
                                        {/* Name */}
                                        <td className={`px-2 sm:px-4 py-3 text-[slate-800] align-middle uppercase cursor-pointer ${lead.readStatus === 'Unread' ? 'font-black' : 'font-semibold'}`} onClick={() => navigate(`/admin/leads/${lead._id}`)}>
                                            {lead.fullName}
                                        </td>
                                        {/* Contact */}
                                        <td className={`px-2 sm:px-4 py-3 text-[9px] text-[slate-500] align-middle leading-tight ${lead.readStatus === 'Unread' ? 'font-bold' : 'font-medium'}`}>
                                            <div>{lead.mobileNumber}</div>
                                        </td>
                                        {/* Source */}
                                        <td className={`px-2 sm:px-4 py-3 text-[slate-800] align-middle uppercase ${lead.readStatus === 'Unread' ? 'font-bold' : 'font-medium'}`}>
                                            {lead.leadSource?.name || <span className="text-[slate-500]/30 italic">None</span>}
                                        </td>
                                        {/* Category */}
                                        <td className="px-2 sm:px-4 py-3 align-middle">
                                            {lead.leadCategory ? (
                                                <span
                                                    className="font-black text-[7px] tracking-wider uppercase"
                                                    style={{
                                                        color: lead.leadCategory.color
                                                    }}
                                                >
                                                    {lead.leadCategory.name}
                                                </span>
                                            ) : (
                                                <span className="text-[slate-500]/30 italic text-[7px]">Uncategorized</span>
                                            )}
                                        </td>
                                        {/* Status dropdown/badge */}
                                        <td className="px-2 sm:px-4 py-3 align-middle">
                                            {lead.status ? (
                                                <InlineCustomDropdown
                                                    value={lead.status._id}
                                                    options={meta.statuses.map(st => ({ value: st._id, label: st.name }))}
                                                    onChange={(val) => handleQuickStatusChange(lead._id, val)}
                                                    renderValue={<span>{lead.status.name}</span>}
                                                    className="border-b border-dashed text-[8px] font-black uppercase tracking-wider pb-0.5 outline-none"
                                                    style={{
                                                        color: lead.status.color,
                                                        borderColor: `${lead.status.color}60`
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-[slate-500]/30 italic text-[8px]">No Status</span>
                                            )}
                                        </td>
                                        {/* Owner select */}
                                        <td className="px-2 sm:px-4 py-3 align-middle">
                                            {isAdmin ? (
                                                <InlineCustomDropdown
                                                    value={lead.ownerLead?._id || ''}
                                                    options={[
                                                        { value: '', label: 'Unassigned' },
                                                        ...meta.employees.map(emp => ({ value: emp._id, label: `${emp.firstName} ${emp.lastName}` }))
                                                    ]}
                                                    onChange={(val) => handleQuickOwnerChange(lead._id, val)}
                                                    renderValue={<span className="truncate">{lead.ownerLead ? `${lead.ownerLead.firstName} ${lead.ownerLead.lastName}` : 'Unassigned'}</span>}
                                                    className="border-b border-dashed border-[slate-200] text-[9px] font-bold text-[slate-800] pb-0.5 outline-none max-w-[120px]"
                                                />
                                            ) : (
                                                <span className="text-[slate-800] font-bold text-[9px]">
                                                    {lead.ownerLead ? `${lead.ownerLead.firstName} ${lead.ownerLead.lastName}` : 'Unassigned'}
                                                </span>
                                            )}
                                        </td>
                                        {/* Dates */}
                                        <td className="px-2 sm:px-4 py-3 text-[slate-500] font-bold align-middle">
                                            {new Date(lead.updatedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-4 py-3 bg-[slate-50]/20 border-t border-[slate-200] flex flex-wrap items-center justify-between gap-4">
                    <span className="text-[8px] font-black text-[slate-500] uppercase tracking-wider">
                        Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                    </span>
                    <div className="flex gap-1">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            className="px-3 py-1 bg-[slate-50] border border-[slate-200] hover:bg-[slate-200]/15 disabled:opacity-30 rounded-[4px] font-bold text-[9px] transition-all"
                        >
                            Previous
                        </button>
                        <button
                            disabled={pagination.page >= pagination.pages}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            className="px-3 py-1 bg-[slate-50] border border-[slate-200] hover:bg-[slate-200]/15 disabled:opacity-30 rounded-[4px] font-bold text-[9px] transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* --- ADD LEAD MODAL --- */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[slate-50]/80 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div className="bg-[white] border border-[slate-200] rounded-[4px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-6 py-4 border-b border-[slate-200] flex justify-between items-center bg-[slate-50]/30">
                            <div>
                                <h3 className="text-xs font-black text-[slate-800] tracking-tight uppercase">
                                    + Add New Lead
                                </h3>
                                <p className="text-[8px] font-bold text-[slate-500] uppercase tracking-wider mt-1">Acquire prospective client opportunities</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-6 h-6 flex items-center justify-center bg-[white] border border-[slate-200] rounded-[4px] text-[slate-500] hover:text-[slate-800] transition-all text-xs"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Full Name *</label>
                                    <input
                                        value={addForm.fullName}
                                        onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-800] outline-none focus:border-[[#011d52]] transition-all placeholder-[slate-500]/50"
                                        placeholder="Enter Prospect Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Mobile Number *</label>
                                    <input
                                        value={addForm.mobileNumber}
                                        onChange={(e) => setAddForm({ ...addForm, mobileNumber: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-800] outline-none focus:border-[[#011d52]] transition-all placeholder-[slate-500]/50"
                                        placeholder="e.g. 9876543210"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Email Address</label>
                                <input
                                    type="email"
                                    value={addForm.email}
                                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                    className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-800] outline-none focus:border-[[#011d52]] transition-all placeholder-[slate-500]/50"
                                    placeholder="prospect@domain.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Lead Source *</label>
                                    <select
                                        value={addForm.leadSource}
                                        onChange={(e) => setAddForm({ ...addForm, leadSource: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-500] outline-none cursor-pointer focus:border-[[#011d52]] transition-all"
                                        required
                                    >
                                        <option value="" disabled>Select Source</option>
                                        {meta.sources.map(src => (
                                            <option key={src._id} value={src._id}>{src.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Lead Category *</label>
                                    <select
                                        value={addForm.leadCategory}
                                        onChange={(e) => setAddForm({ ...addForm, leadCategory: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-500] outline-none cursor-pointer focus:border-[[#011d52]] transition-all"
                                        required
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {meta.categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Lead Status *</label>
                                    <select
                                        value={addForm.status}
                                        onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-500] outline-none cursor-pointer focus:border-[[#011d52]] transition-all"
                                        required
                                    >
                                        <option value="" disabled>Select Status</option>
                                        {meta.statuses.map(st => (
                                            <option key={st._id} value={st._id}>{st.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Lead Owner *</label>
                                    <select
                                        value={addForm.ownerLead}
                                        onChange={(e) => setAddForm({ ...addForm, ownerLead: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-500] outline-none cursor-pointer focus:border-[[#011d52]] transition-all"
                                        required
                                    >
                                        <option value="" disabled>Select Owner</option>
                                        {meta.employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Initial Comment</label>
                                <textarea
                                    value={addForm.initialComment}
                                    onChange={(e) => setAddForm({ ...addForm, initialComment: e.target.value })}
                                    className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-800] outline-none focus:border-[[#011d52]] transition-all placeholder-[slate-500]/50 h-16 resize-none"
                                    placeholder="Enter initial client feedback, callback details, etc..."
                                />
                            </div>

                            <div className="pt-4 border-t border-[slate-200] flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="bg-[slate-50] border border-[slate-200] text-[slate-500] hover:text-[slate-800] px-4 py-2 rounded-[4px] font-black text-[9px] uppercase tracking-widest transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[[#011d52]] hover:opacity-90 text-[#020210] px-4 py-2 rounded-[4px] font-black text-[9px] uppercase tracking-widest transition-all active:scale-95"
                                >
                                    Create Lead
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- EDIT LEAD MODAL --- */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[slate-50]/80 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div className="bg-[white] border border-[slate-200] rounded-[4px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-6 py-4 border-b border-[slate-200] flex justify-between items-center bg-[slate-50]/30">
                            <div>
                                <h3 className="text-xs font-black text-[slate-800] tracking-tight uppercase">
                                    Edit Lead: {editingLead?.leadCode}
                                </h3>
                                <p className="text-[8px] font-bold text-[slate-500] uppercase tracking-wider mt-1">Modify opportunity profile fields</p>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="w-6 h-6 flex items-center justify-center bg-[white] border border-[slate-200] rounded-[4px] text-[slate-500] hover:text-[slate-800] transition-all text-xs"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Full Name *</label>
                                    <input
                                        value={editForm.fullName}
                                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-800] outline-none focus:border-[[#011d52]] transition-all placeholder-[slate-500]/50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Mobile Number *</label>
                                    <input
                                        value={editForm.mobileNumber}
                                        onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-800] outline-none focus:border-[[#011d52]] transition-all placeholder-[slate-500]/50"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Email Address</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-800] outline-none focus:border-[[#011d52]] transition-all placeholder-[slate-500]/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Lead Source *</label>
                                    <select
                                        value={editForm.leadSource}
                                        onChange={(e) => setEditForm({ ...editForm, leadSource: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-500] outline-none cursor-pointer focus:border-[[#011d52]] transition-all"
                                        required
                                    >
                                        {meta.sources.map(src => (
                                            <option key={src._id} value={src._id}>{src.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Lead Category *</label>
                                    <select
                                        value={editForm.leadCategory}
                                        onChange={(e) => setEditForm({ ...editForm, leadCategory: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-500] outline-none cursor-pointer focus:border-[[#011d52]] transition-all"
                                        required
                                    >
                                        {meta.categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Lead Status *</label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-500] outline-none cursor-pointer focus:border-[[#011d52]] transition-all"
                                        required
                                    >
                                        {meta.statuses.map(st => (
                                            <option key={st._id} value={st._id}>{st.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[8px] font-black text-[slate-500] uppercase tracking-wider mb-1.5 ml-0.5">Lead Owner *</label>
                                    <select
                                        value={editForm.ownerLead}
                                        onChange={(e) => setEditForm({ ...editForm, ownerLead: e.target.value })}
                                        className="w-full bg-[slate-50] border border-[slate-200] rounded-[4px] px-4 py-1.5 text-[10px] font-bold text-[slate-500] outline-none cursor-pointer focus:border-[[#011d52]] transition-all"
                                        required
                                    >
                                        {meta.employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[slate-200] flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-[slate-50] border border-[slate-200] text-[slate-500] hover:text-[slate-800] px-4 py-2 rounded-[4px] font-black text-[9px] uppercase tracking-widest transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[[#011d52]] hover:opacity-90 text-[#020210] px-4 py-2 rounded-[4px] font-black text-[9px] uppercase tracking-widest transition-all active:scale-95"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadList;

