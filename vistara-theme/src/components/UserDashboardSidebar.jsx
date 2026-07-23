import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { BASE_URL } from '../services/api';
import footerService from '../services/footerService';
import headerService from '../services/headerService';
import { LayoutDashboard, TrendingUp, Newspaper, Megaphone, Eye, Bell, Settings, LogOut, HelpCircle } from 'lucide-react';

const UserDashboardSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [brand, setBrand] = useState(null);
    const [headerSettings, setHeaderSettings] = useState(null);

    useEffect(() => {
        // No footer data needed in sidebar anymore
    }, []);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" strokeWidth={2} /> },
        { path: '/dashboard/market-calls', label: 'Market Calls', icon: <TrendingUp className="w-5 h-5" strokeWidth={2} /> },
        { path: '/dashboard/latest-news', label: 'Latest News', icon: <Newspaper className="w-5 h-5" strokeWidth={2} /> },
        { path: '/dashboard/announcements', label: 'Announcement', icon: <Megaphone className="w-5 h-5" strokeWidth={2} /> },
        { path: '/dashboard/watchlist', label: 'Watchlist', icon: <Eye className="w-5 h-5" strokeWidth={2} /> },
        { path: '/dashboard/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" strokeWidth={2} /> },
        { path: '/dashboard/support', label: 'Support Ticket', icon: <HelpCircle className="w-5 h-5" strokeWidth={2} /> },
    ];

    return (
        <aside className={`
            ${isCollapsed ? 'md:w-20' : 'md:w-64'}
            fixed bottom-0 left-0 right-0 z-[100] md:relative md:h-screen bg-white md:border-r border-t md:border-t-0 border-[var(--border)]
            flex flex-row md:flex-col transition-all duration-300 sidebar-hide-scrollbar
            overflow-x-auto md:overflow-y-auto md:overflow-x-hidden shadow-[0_1px_0_rgba(31,45,68,0.06),0_8px_30px_rgba(31,45,68,0.05)]
        `}>

            {/* Collapse Toggle Button (Hidden on Mobile) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex absolute -right-3 top-10 bg-white border border-[var(--border)] shadow-md rounded-full p-1.5 hover:bg-[#F2F5FA] transition-all z-50 text-[var(--primary)]"
            >
                <svg className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div className={`px-2 py-2 md:px-6 md:py-6 flex flex-row md:flex-col justify-between md:justify-start h-full md:h-full w-full ${isCollapsed ? 'md:items-center' : ''}`}>

                {/* Main Navigation */}
                <div className={`flex flex-row md:flex-col gap-1 md:w-full items-center ${isCollapsed ? 'md:items-center' : 'md:items-stretch'}`}>
                    <p className={`hidden md:block text-[9px] font-black text-[var(--text-secondary)] mb-4 uppercase tracking-widest ${isCollapsed ? 'md:hidden' : ''}`}>Overview</p>
                    <nav className="flex flex-row md:flex-col space-x-1 md:space-x-0 md:space-y-1 w-full">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all group shrink-0 ${isActive ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[#F2F5FA] hover:text-[var(--primary)]'}`}
                            >
                                <span className="flex items-center justify-center text-current">{item.icon}</span>
                                {!isCollapsed && <span className="hidden md:inline text-[13px] font-semibold group-hover:translate-x-1 transition-transform">{item.label}</span>}
                                {isCollapsed && (
                                    <div className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-[var(--primary)] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] uppercase tracking-widest shadow-xl">
                                        {item.label}
                                    </div>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Bottom Action Section: Settings */}
                <div className={`md:mt-auto md:pt-8 flex flex-row md:flex-col gap-1 md:gap-3 items-center border-l md:border-l-0 md:border-t border-[var(--border)] pl-2 md:pl-0 ml-1 md:ml-0 ${isCollapsed ? 'md:items-center' : 'md:items-stretch'}`}>
                    <p className={`hidden md:block text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1 ${isCollapsed ? 'md:hidden' : ''}`}>Account</p>

                    <NavLink
                        to="/dashboard/settings"
                        className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all group shrink-0 ${isActive ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[#F2F5FA] hover:text-[var(--primary)]'}`}
                    >
                        <span className="flex items-center justify-center"><Settings className="w-5 h-5" strokeWidth={2} /></span>
                        {!isCollapsed && <span className="hidden md:inline text-[13px] font-semibold group-hover:translate-x-1 transition-transform">Settings</span>}
                        {isCollapsed && (
                            <div className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-[var(--primary)] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] uppercase tracking-widest shadow-xl">
                                Settings
                            </div>
                        )}
                    </NavLink>

                    {/* Logout Button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            logout();
                            setTimeout(() => {
                                window.location.href = '/login';
                            }, 100);
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl transition-all group shrink-0 w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                        <span className="flex items-center justify-center">
                            <LogOut className="w-5 h-5" strokeWidth={2} />
                        </span>
                        {!isCollapsed && <span className="hidden md:inline text-[13px] font-semibold group-hover:translate-x-1 transition-transform">Logout</span>}
                        {isCollapsed && (
                            <div className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] uppercase tracking-widest shadow-xl">
                                Logout
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Custom Styles for Scrollbar Hiding */}
            <style>{`
                .sidebar-hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .sidebar-hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </aside>
    );
};

export default UserDashboardSidebar;