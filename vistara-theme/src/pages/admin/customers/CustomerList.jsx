import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import CustomerTable from './components/CustomerTable';
import RefundModal from './components/RefundModal';
import CustomerSidePanel from './components/CustomerSidePanel';

const CustomerList = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);

    // Modal & Side Panel State
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [selectedRefundData, setSelectedRefundData] = useState({ userId: null, subscriptionId: null });
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/customers');
            setAllUsers(data.data || []);
        } catch (error) {
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredUsers = allUsers.filter(user => {
        // Tab Filter
        const status = user.status?.toLowerCase() || 'inactive';
        if (activeTab === 'active' && status !== 'active') return false;
        if (activeTab === 'inactive' && status === 'active') return false;

        // Search Filter
        if (search) {
            const searchStr = `${user.name} ${user.email} ${user.phone}`.toLowerCase();
            if (!searchStr.includes(search.toLowerCase())) return false;
        }

        return true;
    });

    const handleRefund = (userId, subscriptionId) => {
        setSelectedRefundData({ userId, subscriptionId });
        setIsRefundModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await api.delete(`/customers/${id}`);
                setAllUsers(allUsers.filter(u => u._id !== id));
                toast.success('Customer deleted');
            } catch (error) {
                toast.error('Failed to delete customer');
            }
        }
    };

    const handleShowPanel = (customer) => {
        setSelectedCustomer(customer);
        setIsSidePanelOpen(true);
    };

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 ">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Customer List</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Institutional records of platform subscribers</p>
                </div>
                <div className="flex items-center gap-3 text-right mt-3 md:mt-0">
                    <div className="px-3 border-r border-slate-100">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Active</p>
                        <p className="text-[14px] font-bold text-slate-800">{allUsers.filter(u => u.status?.toLowerCase() === 'active').length}</p>
                    </div>
                    <div className="px-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Customers</p>
                        <p className="text-[14px] font-bold text-slate-800">{allUsers.length}</p>
                    </div>
                </div>
            </div>

            {/* TABS & SEARCH */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto border-b border-slate-100">
                    <button onClick={() => setActiveTab('active')}
                        className={`pb-2 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'active' ? 'text-[#011d52] border-[#011d52]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
                        Active Clients
                    </button>
                    <button onClick={() => setActiveTab('inactive')}
                        className={`pb-2 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'inactive' ? 'text-[#011d52] border-[#011d52]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
                        Inactive Clients
                    </button>
                </div>

                <div className="relative w-full md:w-64">
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Identity..."
                        className="w-full rounded-md pl-8 pr-3 py-1.5 text-[11px] outline-none transition-all border border-slate-200 focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 bg-white" />
                    <svg className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Decrypting Records...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No matching records found in this segment.</p>
                    <button onClick={() => { setSearch(''); setActiveTab('active') }} className="mt-3 text-[9px] font-bold uppercase tracking-widest text-[#011d52] hover:underline">Clear All Filters</button>
                </div>
            ) : (
                <CustomerTable
                    users={filteredUsers}
                    onRefund={handleRefund}
                    onDelete={handleDelete}
                    onShowPanel={handleShowPanel}
                />
            )}

            {/* Modals & Panels */}
            <RefundModal
                isOpen={isRefundModalOpen}
                onClose={() => setIsRefundModalOpen(false)}
                userId={selectedRefundData.userId}
                subscriptionId={selectedRefundData.subscriptionId}
            />

            <CustomerSidePanel
                isOpen={isSidePanelOpen}
                onClose={() => setIsSidePanelOpen(false)}
                customer={selectedCustomer}
            />
        </main>
    );
};

export default CustomerList;
