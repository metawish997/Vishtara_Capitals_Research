import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import notificationService from '../services/notificationService';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, ChevronDown, LogOut, User, Settings, Search } from 'lucide-react';
import { BASE_URL } from '../services/api';

// Derive a readable page title from current route
const getPageTitle = (pathname) => {
    const segments = pathname.replace('/admin/', '').split('/');
    const map = {
        'dashboard': 'Dashboard',
        'customers': 'Customers',
        'manual-payments': 'Manual Payments',
        'tips': 'Trading Signals',
        'notifications': 'Notifications',
        'tickets': 'Support Tickets',
        'support-chat': 'Support Chat',
        'announcements': 'Announcements',
        'services': 'Service Plans',
        'blogs': 'Blogs',
        'news': 'News',
        'offer-banners': 'Offer Banners',
        'certificates': 'Certificates',
        'company-bank-details': 'Bank Details',
        'complaint-data': 'Complaint Data',
        'complaints': 'Complaints',
        'inquiries': 'Inquiries',
        'refunds': 'Refund Ledger',
        'reviews': 'Reviews',
        'roles': 'Roles',
        'campaigns': 'Campaigns',
        'popups': 'Popups',
        'contact-details': 'Contact Details',
        'coupons': 'Coupons',
        'marquees': 'Marquees',
        'policies': 'Policy Master',
        'faq': 'Website FAQs',
        'header': 'Header Builder',
        'footer': 'Footer Builder',
        'home': 'Home Settings',
        'about': 'About Us',
        'employees': 'Employees',
        'demo-subscriptions': 'Demo Subscriptions',
        'designations': 'Designations',
        'credentials': 'API Credentials',
        'system-health': 'System Health',
        'leads': 'Leads',
        'lead-pull-uploads': 'Lead Pull Uploads',
    };
    return map[segments[0]] || segments[0]?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Admin';
};

const AdminHeader = ({ pageTitle }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const profileRef = useRef(null);
    const notifRef = useRef(null);

    const derivedTitle = pageTitle || getPageTitle(location.pathname);

    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getNotifications();
            if (res.success) {
                setNotifications(res.data);
                setUnreadCount(res.data.length);
            }
        } catch (error) {
            // silent
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Signed out successfully');
        navigate('/login');
    };

    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <header className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-5 flex-shrink-0 z-40">

            {/* ── Left: Page Title ────────────────────────────────── */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                    <h1 className="text-[13px] font-bold text-slate-800 leading-tight truncate">{derivedTitle}</h1>
                </div>
            </div>

            {/* ── Right: Controls ──────────────────────────────────── */}
            <div className="flex items-center gap-2 flex-shrink-0">

                {/* Date Badge */}
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-400">📅</span>
                    <span className="text-[10px] font-bold text-slate-600">{today}</span>
                </div>

                {/* Search */}
                <div className="relative hidden md:block">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search pages..."
                        className="w-40 pl-8 pr-3 py-1.5 text-[11px] rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#011d52] focus:ring-1 focus:ring-[#011d52]/20 transition-all focus:w-52"
                    />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                </div>



                {/* Notifications */}
                <div ref={notifRef} className="relative">
                    <button
                        onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                        className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
                    >
                        <Bell className="w-3.5 h-3.5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-[9px] text-white rounded-full flex items-center justify-center font-bold px-0.5 leading-none">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                                <h4 className="text-[11px] font-bold text-slate-800">Notifications</h4>
                                {unreadCount > 0 && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200">
                                        {unreadCount} New
                                    </span>
                                )}
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map((n, i) => (
                                    <div key={i} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors">
                                        <p className="text-[11px] font-bold text-slate-800 leading-tight">{n.title}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                                    </div>
                                )) : (
                                    <div className="py-8 text-center">
                                        <Bell className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">All caught up!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div ref={profileRef} className="relative">
                    <button
                        onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all"
                    >
                        <div className="w-7 h-7 rounded-md bg-[#011d52] text-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
                            {user?.image
                                ? <img src={user?.image ? (user.image.startsWith('http') ? user.image : `${BASE_URL}${user.image}`) : ''} className="w-full h-full object-cover" alt="" />
                                : <span>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
                            }
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 hidden md:block max-w-[80px] truncate">
                            {user?.name?.split(' ')[0] || 'Admin'}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-slate-400 hidden md:block transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-[100] overflow-hidden">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-lg bg-[#011d52] text-white flex items-center justify-center text-[12px] font-bold overflow-hidden flex-shrink-0">
                                        {user?.image
                                            ? <img src={user?.image ? (user.image.startsWith('http') ? user.image : `${BASE_URL}${user.image}`) : ''} className="w-full h-full object-cover" alt="" />
                                            : <span>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[12px] font-bold text-slate-800 truncate leading-tight">{user?.name}</p>
                                        <p className="text-[10px] text-slate-500 truncate leading-tight">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#011d52]/8 text-[#011d52] border border-[#011d52]/20">
                                        Administrator
                                    </span>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-bold text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;