import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import notificationService from '../services/notificationService';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Home, Search, Bell, ChevronDown } from 'lucide-react';
import { BASE_URL } from '../services/api';
import footerService from '../services/footerService';
import headerService from '../services/headerService';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const UserDashboardHeader = ({ pageTitle, user: propUser }) => {
    const { theme, toggleTheme } = useTheme();
    const { user: authUser, logout } = useAuth();
    const user = propUser || authUser;
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [brand, setBrand] = useState(null);
    const [headerSettings, setHeaderSettings] = useState(null);

    const fetchData = async () => {
        try {
            const notifRes = await notificationService.getNotifications();
            if (notifRes.success) {
                setNotifications(notifRes.data);
                setUnreadCount(notifRes.data.length);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchHeaderData = async () => {
        try {
            const footerRes = await footerService.getFullData();
            if (footerRes?.data?.data?.brand) {
                setBrand(footerRes.data.data.brand);
            }
        } catch (err) {
            console.error('Error fetching dynamic footer data:', err);
        }

        try {
            const headerRes = await headerService.getSettings();
            if (headerRes?.data?.data) {
                setHeaderSettings(headerRes.data.data);
            }
        } catch (err) { }
    };

    useEffect(() => {
        fetchData();
        fetchHeaderData();

        const handleRefresh = () => fetchData();
        window.addEventListener('refreshNotifications', handleRefresh);

        const interval = setInterval(fetchData, 30000);
        return () => {
            clearInterval(interval);
            window.removeEventListener('refreshNotifications', handleRefresh);
        };
    }, []);

    const handleMarkAsRead = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const res = await notificationService.markAsRead(id);
            if (res.success) {
                fetchData();
            }
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const res = await notificationService.markAllAsRead();
            if (res.success) {
                fetchData();
            }
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    return (
        <header className="h-16 bg-white border-b border-[var(--border)] flex items-center justify-between px-3 md:px-6 z-40 relative shadow-[0_1px_0_rgba(31,45,68,0.04),0_8px_30px_rgba(31,45,68,0.05)]">
            <div className="flex items-center gap-3 min-w-0">
                {/* Logo Section */}
                <Link to="/" className="flex-shrink-0 transition-opacity hover:opacity-80 min-w-0">
                    {brand?.icon_svg ? (
                        <div
                            className="h-7 md:h-8 w-auto text-[var(--primary)] flex items-center justify-start [&>svg]:h-7 md:[&>svg]:h-8 [&>svg]:w-auto [&>svg]:object-contain [&>svg_path]:fill-[var(--primary)] [&>svg_circle]:fill-[var(--primary)]"
                            dangerouslySetInnerHTML={{ __html: brand.icon_svg }}
                        />
                    ) : brand?.image ? (
                        <img
                            src={brand.image.startsWith('http')
                                ? brand.image
                                : brand.image.startsWith('/')
                                    ? `${BASE_URL}${brand.image}`
                                    : `${BASE_URL}/uploads/footer/${brand.image}`}
                            alt="Brand Logo"
                            className="h-7 md:h-8 object-contain"
                        />
                    ) : headerSettings?.logo_svg ? (
                        <div
                            className="h-7 md:h-8 w-auto flex items-center justify-start [&>svg]:h-7 md:[&>svg]:h-8 [&>svg]:w-auto [&>svg]:object-contain"
                            dangerouslySetInnerHTML={{ __html: headerSettings.logo_svg }}
                        />
                    ) : (
                        <img src={`${BASE_URL}/storage/logo/Primarylogo2.png`} alt="BSMR Logo" className="h-7 md:h-8 object-contain" />
                    )}
                </Link>
                {pageTitle && (
                    <span className="hidden md:block text-[15px] font-semibold text-[var(--text-primary)] border-l border-[var(--border)] pl-3 truncate">
                        {pageTitle}
                    </span>
                )}
            </div>

            <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                {/* Search */}
                <button
                    className="relative inline-flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full bg-[#F2F5FA] text-[var(--text-secondary)] hover:bg-[#E9EEF5] hover:text-[var(--primary)] border border-[var(--border)] transition-colors"
                    title="Search"
                >
                    <Search className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                </button>

                {/* Home Link */}
                <Link
                    to="/"
                    className="relative inline-flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full bg-[#F2F5FA] text-[var(--text-secondary)] hover:bg-[#E9EEF5] hover:text-[var(--primary)] border border-[var(--border)] transition-colors"
                >
                    <Home className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                </Link>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="relative inline-flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full bg-[#F2F5FA] text-[var(--text-secondary)] hover:bg-[#E9EEF5] hover:text-[var(--primary)] border border-[var(--border)] transition-colors"
                >
                    {theme === 'black-green' ? (
                        <Sun className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                    ) : (
                        <Moon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                    )}
                </button>

                {/* Notification Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative inline-flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full bg-[#F2F5FA] text-[var(--text-secondary)] hover:bg-[#E9EEF5] hover:text-[var(--primary)] border border-[var(--border)] transition-colors"
                    >
                        <Bell className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 md:h-4 md:w-4 bg-[var(--primary)] text-[8px] md:text-[9px] text-white rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white border border-[var(--border)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-scale-in origin-top-right">
                            <div className="px-4 py-3 border-b bg-[#F2F5FA] flex justify-between items-center">
                                <div>
                                    <span className="font-bold text-[10px] text-[var(--text-primary)] uppercase tracking-wider">Updates & Alerts</span>
                                    <span className="ml-2 text-[9px] bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-[9px] font-bold text-[var(--primary)] hover:underline uppercase tracking-tight"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto scrollbar-thin">
                                {notifications.length > 0 ? notifications.map((n, i) => (
                                    <div key={i} className={`px-4 py-2.5 hover:bg-[#F4F6FA] border-b border-[var(--border)] cursor-pointer transition-colors relative group/item ${n.type === 'announcement' ? 'bg-[var(--primary)]/5' : ''}`}>
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0"></span>}
                                                    <p className={`text-[10px] font-black uppercase tracking-tight truncate ${n.type === 'announcement' ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'}`}>
                                                        {n.type === 'announcement' && <span className="mr-1">📢</span>}
                                                        {n.title}
                                                    </p>
                                                </div>
                                                <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-tight line-clamp-1 pr-6">{n.message}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[8px] text-[var(--text-secondary)] font-bold uppercase">
                                                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {n.type === 'announcement' && (
                                                        <Link to="/dashboard/announcements" className="text-[8px] text-[var(--primary)] font-black uppercase hover:underline">View →</Link>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => handleMarkAsRead(e, n._id)}
                                                className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-[var(--border)] rounded-full transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0"
                                                title="Mark as read"
                                            >
                                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-12 text-center flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-[#F2F5FA] rounded-full flex items-center justify-center text-[var(--text-secondary)]">
                                            <Bell className="w-6 h-6" strokeWidth={2} />
                                        </div>
                                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">System Clear</p>
                                    </div>
                                )}
                            </div>
                            <div className="px-4 py-2 bg-[#F2F5FA] border-t text-center">
                                <Link to="/dashboard/notifications" className="text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--primary)] uppercase tracking-tighter transition-colors">See all notifications</Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sign Out Button (Explicit) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        logout();
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 100);
                    }}
                    className="relative hidden md:inline-flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 border border-red-100 transition-colors"
                    title="Sign Out"
                >
                    🚪
                </button>

                {/* User Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 md:gap-3 focus:outline-none hover:bg-[#F2F5FA] transition-colors p-1 pr-2 md:pr-3 rounded-full bg-[#F8FAFC] border border-transparent hover:border-[#cbd5e1]"
                    >
                        <div className="h-8 w-8 md:h-9 md:w-9 rounded-full border border-[#cbd5e1] overflow-hidden flex items-center justify-center bg-[#1B2B40] shadow-sm">
                            <img
                                src={user?.image ? (user.image.startsWith('http') ? user.image : `${BASE_URL}${user.image}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || user?.name}`}
                                alt={user?.name || 'User'}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <span className="hidden md:block text-sm font-bold text-[#011D52] truncate max-w-[100px]">
                            {user?.name?.split(' ')[0]}
                        </span>
                        <ChevronDown className="hidden md:block w-3.5 h-3.5 text-[#64748b]" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-[var(--border)] z-[100] overflow-hidden animate-scale-in">
                            <div className="px-4 py-3 bg-[#F2F5FA] border-b border-[var(--border)]">
                                <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user?.name}</p>
                                <p className="text-[11px] text-[var(--text-secondary)] truncate">{user?.email}</p>
                            </div>

                            <div className="p-2">
                                <Link to="/dashboard/settings/edit-profile" className="flex items-center px-4 py-2 text-xs text-[var(--text-primary)] hover:bg-[#F4F6FA] rounded-lg transition-colors">
                                    <span className="mr-2">👤</span> Profile Settings
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        logout();
                                        setTimeout(() => {
                                            window.location.href = '/login';
                                        }, 100);
                                    }}
                                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1 font-bold"
                                >
                                    <span className="mr-2">🚪</span> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default UserDashboardHeader;