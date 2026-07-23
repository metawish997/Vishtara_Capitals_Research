import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-full" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 4 Cards Row (Ultra-Compact & Fully Colored) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: '💰', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
          { label: 'Subscriptions', value: '2,350', change: '+18.1%', icon: '📈', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
          { label: 'Active Tickets', value: '12', change: '-2.0%', icon: '🎫', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
          { label: 'Total Users', value: '14,290', change: '+5.4%', icon: '👥', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' }
        ].map((stat, i) => (
          <div 
            key={i} 
            className="rounded-xl p-2.5 flex flex-col justify-center hover:-translate-y-0.5 transition-transform duration-200"
            style={{ 
              backgroundColor: stat.bg, 
              border: `1px solid ${stat.border}`,
              boxShadow: `0 2px 10px -4px ${stat.color}40`
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] drop-shadow-sm">{stat.icon}</span>
                <h4 className="text-[9px] font-bold uppercase tracking-wider" style={{ color: stat.color }}>
                  {stat.label}
                </h4>
              </div>
              <span 
                className="text-[8px] font-bold px-1 py-0.5 rounded bg-white/70 backdrop-blur-sm shadow-sm"
                style={{ color: stat.change.startsWith('+') ? '#059669' : '#dc2626' }}
              >
                {stat.change}
              </span>
            </div>
            
            <p className="text-[18px] font-black tracking-tight leading-none text-slate-800 ml-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        
        {/* Header Row */}
        <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h3 className="text-[12px] font-bold text-slate-800">Recent Transactions</h3>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="text-[9px] font-semibold bg-blue-50 text-[#011d52] px-1.5 py-0.5 rounded-full border border-blue-100">
                24 New
              </span>
              <span className="text-[9px] text-slate-400 font-medium">Last updated: Just now</span>
            </div>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search..." 
              className="text-[10px] px-2.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 bg-white w-32" 
            />
            <button className="text-[10px] font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-50 transition-colors">
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Transaction ID</th>
                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">User Details</th>
                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Plan Type</th>
                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest">Status</th>
                <th className="px-4 py-1.5 text-[8px] text-slate-400 uppercase font-bold tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '#TRX-9021', user: 'John Doe', email: 'john@example.com', plan: 'Premium Yearly', status: 'Success', date: 'Oct 23, 2023' },
                { id: '#TRX-9020', user: 'Sarah Smith', email: 'sarah@example.com', plan: 'Basic Monthly', status: 'Success', date: 'Oct 22, 2023' },
                { id: '#TRX-9019', user: 'Mike Ross', email: 'mike@example.com', plan: 'Pro Monthly', status: 'Pending', date: 'Oct 22, 2023' },
                { id: '#TRX-9018', user: 'Emma Watson', email: 'emma@example.com', plan: 'Premium Yearly', status: 'Success', date: 'Oct 21, 2023' },
                { id: '#TRX-9017', user: 'Alice Brown', email: 'alice@example.com', plan: 'Basic Monthly', status: 'Success', date: 'Oct 20, 2023' }
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-[#f8fafc] transition-colors group">
                  <td className="px-4 py-2">
                    <span className="text-[10px] font-mono font-medium text-slate-500 group-hover:text-[#011d52] transition-colors">{row.id}</span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold text-slate-800 leading-tight">{row.user}</span>
                      <span className="text-[9px] text-slate-400">{row.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-[9px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{row.plan}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span 
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                      style={{ 
                        backgroundColor: row.status === 'Success' ? '#ecfdf5' : '#fffbeb',
                        color: row.status === 'Success' ? '#10b981' : '#f59e0b',
                        border: `1px solid ${row.status === 'Success' ? '#a7f3d0' : '#fde68a'}`
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className="text-[9px] font-medium text-slate-500">{row.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
