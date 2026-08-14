import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { canAccess, hasPermission } from '../../../../utils/rbac';

const CustomerTable = ({ users, onRefund, onDelete, onShowPanel, showDeletedUserAlert }) => {
    const { user: currentUser } = useAuth();
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">#</th>
                            <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Identity</th>
                            <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Contact Info</th>
                            <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-center">Status</th>
                            <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-center">Joined Date</th>
                            <th className="px-4 py-2 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user._id} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                                    <td className="px-4 py-2">
                                        <span className="text-[10px] font-mono font-medium text-slate-500 group-hover:text-[#011d52] transition-colors">
                                            {index + 1}
                                        </span>
                                    </td>

                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-3">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-sm" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                                                    {user.name?.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}

                                            <div className="flex flex-col">
                                                <Link to={`/admin/customers/show/${user._id}`}
                                                    className={`text-[11px] font-semibold transition-colors block text-left ${user.status?.toLowerCase() !== 'active' ? 'text-rose-600 hover:text-rose-500' : 'text-slate-800 hover:text-[#011d52]'}`}>
                                                    {user.name}
                                                </Link>
                                                <button 
                                                    onClick={() => onShowPanel(user)}
                                                    className="text-[9px] font-medium text-slate-400 hover:text-[#011d52] transition-colors text-left">
                                                    ID: {user.smra_id || user.bsmr_id || user._id}
                                                </button>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-medium text-slate-700">{user.email}</span>
                                            <span className="text-[9px] text-slate-400 font-mono">{user.phone || 'NO PHONE'}</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-2 text-center">
                                        {user.status?.toLowerCase() === 'active' ? (
                                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#a7f3d0] text-[#10b981] bg-[#ecfdf5]">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-[#fde68a] text-[#f59e0b] bg-[#fffbeb]">
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-2 text-center">
                                        <span className="text-[10px] font-medium text-slate-500">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </td>

                                    <td className="px-4 py-2 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {user.can_refund && (
                                                <button
                                                    type="button"
                                                    onClick={() => onRefund(user._id, user.subscription_id)}
                                                    className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-[#011d52] hover:bg-blue-100 transition-colors border border-blue-200">
                                                    Refund
                                                </button>
                                            )}

                                            {user.role?.slug !== 'super-admin' && (canAccess(currentUser, 'admin') || hasPermission(currentUser, 'delete_customers')) && (
                                                <button
                                                    onClick={() => onDelete(user._id)}
                                                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                                    title="Delete Customer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3.5 w-3.5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 011-1z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    No customers found for the selected filters
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-4 py-2 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 border-t border-slate-100">
                <p className="text-[10px] font-medium text-slate-500">
                    Showing {users.length} Users
                </p>
                {/* Pagination placeholder */}
                <div className="flex gap-1.5">
                    <button className="px-2 py-1 rounded text-[9px] font-semibold text-slate-400 border border-slate-200 bg-white" disabled>Previous</button>
                    <button className="px-2 py-1 rounded text-[9px] font-bold bg-[#011d52] text-white border border-[#011d52]">1</button>
                    <button className="px-2 py-1 rounded text-[9px] font-semibold text-slate-400 border border-slate-200 bg-white" disabled>Next</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerTable;
