import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const SubscriptionList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [demoDays, setDemoDays] = useState(3);
    const [searchTerm, setSearchTerm] = useState('');
    const [subscriptionFilter, setSubscriptionFilter] = useState('');
    const [demoFilter, setDemoFilter] = useState('');

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/customers');
            setUsers(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleGrantDemo = (user) => {
        setSelectedUser(user);
        setDemoDays(3);
        setShowModal(true);
    };

    const confirmGrantDemo = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/customers/${selectedUser._id}/grant-demo`, { demoDays });
            toast.success(`Granted ${demoDays} days demo to ${selectedUser.name}`);
            setShowModal(false);
            fetchCustomers();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to assign demo');
        }
    };

    const filteredUsers = users.filter(user => {
        let match = true;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            if (!user.name?.toLowerCase().includes(term) && !user.email?.toLowerCase().includes(term)) {
                match = false;
            }
        }
        if (subscriptionFilter) {
            if (subscriptionFilter === 'active' && !user.hasActiveSubscription) match = false;
            if (subscriptionFilter === 'inactive' && user.hasActiveSubscription) match = false;
        }
        if (demoFilter) {
            if (demoFilter === 'eligible' && user.hasUsedDemo) match = false;
            if (demoFilter === 'used' && !user.hasUsedDemo) match = false;
        }
        return match;
    });

    return (
        <main className="min-h-full p-4 flex flex-col gap-4 font-plus-jakarta">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-800">Demo Subscription Management</h2>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Manage user eligibility and assign demo access to your platform.</p>
                </div>
            </div>

                {/* Filters */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px]">
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or email..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-[#011d52] transition-colors" />
                    </div>
                    <select value={subscriptionFilter} onChange={(e) => setSubscriptionFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 outline-none focus:border-[#011d52] cursor-pointer">
                        <option value="">All Subscriptions</option>
                        <option value="active">Active Subscription</option>
                        <option value="inactive">No Active Subscription</option>
                    </select>
                    <select value={demoFilter} onChange={(e) => setDemoFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 outline-none focus:border-[#011d52] cursor-pointer">
                        <option value="">All Demo Statuses</option>
                        <option value="eligible">Eligible for Demo</option>
                        <option value="used">Demo Already Used</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subscription Status</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Demo Status</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr><td colSpan="4" className="px-8 py-10 text-center text-xs font-bold text-slate-400">Loading customers...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="4" className="px-8 py-10 text-center text-xs font-bold text-slate-400">No customers found.</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-bold text-slate-800">{user.name}</p>
                                            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{user.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.hasActiveSubscription ? (
                                                <span className="w-fit px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 inline-flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Active Subscription
                                                </span>
                                            ) : (
                                                <span className="w-fit px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100 inline-flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                    No Active Subscription
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.hasUsedDemo ? (
                                                <span className="w-fit px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100 inline-flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                                    Demo Already Used
                                                </span>
                                            ) : (
                                                <span className="w-fit px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 inline-flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Eligible For Demo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => !user.hasActiveSubscription && !user.hasUsedDemo && handleGrantDemo(user)}
                                                disabled={user.hasActiveSubscription || user.hasUsedDemo}
                                                title={user.hasActiveSubscription ? "User already has an active subscription" : user.hasUsedDemo ? "Demo already used" : "Assign Demo to user"}
                                                className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md transition-all ${
                                                    (user.hasActiveSubscription || user.hasUsedDemo)
                                                    ? 'text-slate-400 border border-slate-200 bg-slate-50 cursor-not-allowed'
                                                    : 'text-white border border-[#011d52] bg-[#011d52] hover:bg-[#03173d] shadow-sm'
                                                }`}>
                                                Assign Demo
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            {/* Grant Demo Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h3 className="text-xs font-semibold font-bold text-slate-800">Assign Demo</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Assign a demo subscription to <span className="font-bold text-slate-800">{selectedUser.name}</span>.</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Demo Duration (Days)</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={demoDays}
                                        onChange={(e) => setDemoDays(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#011d52] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-md font-bold text-[10px] text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors">Cancel</button>
                            <button onClick={confirmGrantDemo} className="bg-[#011d52] text-white px-6 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#03173d] transition-colors">Assign Demo</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default SubscriptionList;
