import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    Users,
    CreditCard,
    TrendingUp,
    Bell,
    FileText,
    Newspaper,
    Image as ImageIcon,
    Award,
    Landmark,
    AlertTriangle,
    Mail,
    DollarSign,
    Star,
    Lock,
    Send,
    Phone,
    Ticket,
    Volume2,
    ShieldCheck,
    HelpCircle,
    Settings,
    Key,
    Cpu,
    Wallet,
    Target,
    Upload,
    Home,
    Info,
    MessageSquare,
    PanelLeftClose,
    PanelLeftOpen,
    Activity,
    Megaphone,
    Tag,
    Layers,
    Clipboard,
    BarChart3,
    Globe,
    BookOpen,
    User
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { canAccess } from '../utils/rbac';
import { BASE_URL } from '../services/api';

// ─── Nav Item (single link) ────────────────────────────────────────────────
const NavItem = ({ to, icon: Icon, emoji, label, isCollapsed, badge }) => (
    <NavLink
        to={to}
        title={isCollapsed ? label : undefined}
        className={({ isActive }) =>
            `group relative flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-150 select-none
            ${isActive
                ? 'bg-[#011d52] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }
            ${isCollapsed ? 'justify-center px-0' : ''}
            `
        }
    >
        {({ isActive }) => (
            <>
                {/* Icon */}
                <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${isCollapsed ? 'mx-auto' : ''}`}>
                    {emoji
                        ? <span className="text-[15px] leading-none">{emoji}</span>
                        : Icon
                            ? <Icon className={`w-4 h-4 stroke-[2] ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
                            : null
                    }
                </span>

                {/* Label */}
                {!isCollapsed && (
                    <span className={`flex-1 truncate ${isActive ? 'font-semibold text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>
                        {label}
                    </span>
                )}

                {/* Badge */}
                {!isCollapsed && badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {badge}
                    </span>
                )}

                {/* Collapsed tooltip */}
                {isCollapsed && (
                    <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999] shadow-lg">
                        {label}
                        <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                    </span>
                )}
            </>
        )}
    </NavLink>
);

// ─── Dropdown Section ───────────────────────────────────────────────────────
const DropdownSection = ({ id, emoji, icon: Icon, label, links, isCollapsed, openDropdown, onToggle }) => {
    const location = useLocation();
    const isAnyChildActive = links.some(l => location.pathname.startsWith(l.to));
    const isOpen = openDropdown === id;

    // Popover for collapsed state
    const [popoverVisible, setPopoverVisible] = useState(false);
    const popoverTimeout = useRef(null);

    const handleMouseEnter = () => {
        if (!isCollapsed) return;
        clearTimeout(popoverTimeout.current);
        setPopoverVisible(true);
    };
    const handleMouseLeave = () => {
        if (!isCollapsed) return;
        popoverTimeout.current = setTimeout(() => setPopoverVisible(false), 120);
    };
    const handlePopoverEnter = () => clearTimeout(popoverTimeout.current);
    const handlePopoverLeave = () => setPopoverVisible(false);

    useEffect(() => () => clearTimeout(popoverTimeout.current), []);

    const triggerClass = `group relative flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer w-full select-none
        ${isAnyChildActive
            ? 'bg-[#011d52]/8 text-[#011d52]'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }
        ${isCollapsed ? 'justify-center px-0' : ''}
    `;

    return (
        <div className="relative">
            <button
                onClick={() => isCollapsed ? null : onToggle(id)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={triggerClass}
            >
                {/* Icon */}
                <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${isCollapsed ? 'mx-auto' : ''}`}>
                    {emoji
                        ? <span className="text-[15px] leading-none">{emoji}</span>
                        : Icon
                            ? <Icon className={`w-4 h-4 stroke-[2] ${isAnyChildActive ? 'text-[#011d52]' : 'text-slate-500 group-hover:text-slate-700'}`} />
                            : null
                    }
                </span>

                {!isCollapsed && (
                    <>
                        <span className={`flex-1 truncate text-left ${isAnyChildActive ? 'font-semibold text-[#011d52]' : 'text-slate-700 group-hover:text-slate-900'}`}>
                            {label}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#011d52]' : 'text-slate-400'}`} />
                    </>
                )}

                {/* Collapsed tooltip */}
                {isCollapsed && (
                    <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999] shadow-lg">
                        {label}
                        <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                    </span>
                )}
            </button>

            {/* Expanded submenu */}
            {!isCollapsed && isOpen && (
                <div className="mt-0.5 ml-8 border-l-2 border-slate-100 pl-3 space-y-0.5 pb-1">
                    {links.map((link, idx) => (
                        <NavLink
                            key={idx}
                            to={link.to}
                            className={({ isActive }) =>
                                `block py-1.5 px-2 text-[11px] font-medium rounded-md transition-all
                                ${isActive
                                    ? 'text-[#011d52] bg-blue-50 font-semibold'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            )}

            {/* Collapsed popover */}
            {isCollapsed && popoverVisible && (
                <div
                    onMouseEnter={handlePopoverEnter}
                    onMouseLeave={handlePopoverLeave}
                    className="fixed left-[72px] w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-[9999]"
                    style={{ top: 'auto' }}
                >
                    <div className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#011d52] border-b border-slate-100 mb-1">
                        {label}
                    </div>
                    {links.map((link, idx) => (
                        <NavLink
                            key={idx}
                            to={link.to}
                            onClick={() => setPopoverVisible(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 text-[11px] font-medium transition-all
                                ${isActive
                                    ? 'text-[#011d52] bg-blue-50 font-semibold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Section Divider ────────────────────────────────────────────────────────
const SectionLabel = ({ label, isCollapsed }) => (
    <div className={`pt-3 pb-1 ${isCollapsed ? 'flex justify-center' : 'px-3'}`}>
        {isCollapsed
            ? <div className="w-4 h-px bg-slate-200" />
            : <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        }
    </div>
);

// ─── Main Sidebar ───────────────────────────────────────────────────────────
const AdminSidebar = () => {
    const { user } = useAuth();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleDropdown = (id) => setOpenDropdown(prev => prev === id ? null : id);

    const checkPermission = () => canAccess(user, 'admin');

    // Submenu definitions
    const tradingSignalsLinks = [
        { to: '/admin/tips', label: 'Dashboard' },
        { to: '/admin/tips/create-equity', label: 'Create Equity Tip' },
        { to: '/admin/tips/create-fo', label: 'Create F&O Tip' },
        { to: '/admin/tips/analysis', label: 'Signals Analysis' },
        { to: '/admin/tips/categories', label: 'Tip Categories' },
    ];

    const notificationLinks = [
        { to: '/admin/notifications', label: 'All Alerts' },
        { to: '/admin/tickets', label: 'Support Tickets' },
        { to: '/admin/support-chat', label: 'Support Chat' },
        { to: '/admin/announcements', label: 'Announcements' },
    ];

    const homeSettingsLinks = [
        { to: '/admin/home/download-app', label: 'Download App' },
        { to: '/admin/home/how-it-works', label: 'How It Works' },
        { to: '/admin/home/counters', label: 'Home Counters' },
        { to: '/admin/home/key-features', label: 'Key Features' },
        { to: '/admin/home/why-choose-us', label: 'Why Choose Us' },
    ];

    const aboutUsLinks = [
        { to: '/admin/about/mission', label: 'Mission' },
        { to: '/admin/about/core-values', label: 'Core Values' },
        { to: '/admin/about/why-platform', label: 'Why Platform' },
    ];

    const managementLinks = [
        { to: '/admin/employees', label: 'Employees' },
        { to: '/admin/demo-subscriptions', label: 'Demo Subscriptions' },
        { to: '/admin/roles', label: 'Roles' },
        { to: '/admin/designations', label: 'Designations' },
    ];

    const crmLinks = [
        { to: '/admin/leads', label: 'Leads' },
        { to: '/admin/lead-pull-uploads', label: 'Lead Pull Uploads' },
    ];

    return (
        <aside className={`
            ${isCollapsed ? 'w-[72px]' : 'w-64'}
            flex-shrink-0 bg-white border-r border-slate-200
            flex flex-col h-screen overflow-hidden
            transition-all duration-300 ease-in-out relative
        `}>

            {/* ── Logo Header ───────────────────────────────────────── */}
            <div className={`h-[60px] flex items-center border-b border-slate-100 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between px-4'}`}>
                {!isCollapsed && (
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="flex-shrink-0 flex items-center justify-center">
                            <img src="/vistaralogo.svg" alt="Vistara" className="w-10 h-10 object-contain" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-bold text-slate-800 tracking-tight leading-tight truncate">Vistara</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#011d52] leading-tight">Admin Panel</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#011d52] hover:bg-slate-50 transition-all"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed
                        ? <PanelLeftOpen className="w-5 h-5 text-[#011d52]" />
                        : <PanelLeftClose className="w-4 h-4" />
                    }
                </button>
            </div>

            {/* ── Navigation ────────────────────────────────────────── */}
            <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5 scrollbar-hide ${isCollapsed ? 'px-2' : 'px-3'}`}>

                {/* ADMIN CORE */}
                {canAccess(user, 'admin') && (
                    <>
                        <NavItem to="/admin/dashboard" emoji="📊" label="Dashboard" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/customers" emoji="👥" label="Customers" isCollapsed={isCollapsed} />
                    </>
                )}

                {/* CRM — visible to all employees */}
                <SectionLabel label="CRM" isCollapsed={isCollapsed} />
                <DropdownSection
                    id="crm"
                    emoji="🎯"
                    label="CRM"
                    links={crmLinks}
                    isCollapsed={isCollapsed}
                    openDropdown={openDropdown}
                    onToggle={toggleDropdown}
                />

                {/* ADMIN ONLY SECTIONS */}
                {canAccess(user, 'admin') && (
                    <>
                        <SectionLabel label="Finance" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/manual-payments" emoji="💳" label="Manual Payments" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/refunds" emoji="💵" label="Refund Ledger" isCollapsed={isCollapsed} />

                        <SectionLabel label="Signals" isCollapsed={isCollapsed} />
                        <DropdownSection
                            id="trading-signals"
                            emoji="📈"
                            label="Trading Signals"
                            links={tradingSignalsLinks}
                            isCollapsed={isCollapsed}
                            openDropdown={openDropdown}
                            onToggle={toggleDropdown}
                        />

                        <SectionLabel label="Engagement" isCollapsed={isCollapsed} />
                        <DropdownSection
                            id="notifications"
                            emoji="🔔"
                            label="Notification Center"
                            links={notificationLinks}
                            isCollapsed={isCollapsed}
                            openDropdown={openDropdown}
                            onToggle={toggleDropdown}
                        />
                        <NavItem to="/admin/campaigns" emoji="🚀" label="Campaigns" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/marquees" emoji="📢" label="Marquees" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/popups" emoji="🗂️" label="Popups" isCollapsed={isCollapsed} />

                        <SectionLabel label="Catalog" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/services" emoji="🧾" label="Service Plans" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/coupons" emoji="🎟️" label="Coupons" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/blogs" emoji="📝" label="Blogs" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/news" emoji="📰" label="News" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/offer-banners" emoji="🖼️" label="Offer Banners" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/certificates" emoji="🏆" label="Certificates" isCollapsed={isCollapsed} />

                        <SectionLabel label="Support" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/complaints" emoji="⚠️" label="Complaints" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/complaint-data" emoji="📉" label="Complaint Data" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/inquiries" emoji="📩" label="Inquiries" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/reviews" emoji="⭐" label="Reviews" isCollapsed={isCollapsed} />

                        <SectionLabel label="Compliance" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/policies" emoji="🛡️" label="Policy Master" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/faq" emoji="❓" label="Website FAQs" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/company-bank-details" emoji="🏦" label="Bank Details" isCollapsed={isCollapsed} />

                        <SectionLabel label="Website" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/header" emoji="⬆️" label="Header Builder" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/footer" emoji="⬇️" label="Footer Builder" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/contact-details" emoji="📞" label="Contact Details" isCollapsed={isCollapsed} />
                        <DropdownSection
                            id="home-settings"
                            emoji="🏠"
                            label="Home Settings"
                            links={homeSettingsLinks}
                            isCollapsed={isCollapsed}
                            openDropdown={openDropdown}
                            onToggle={toggleDropdown}
                        />
                        <DropdownSection
                            id="about"
                            emoji="ℹ️"
                            label="About Us"
                            links={aboutUsLinks}
                            isCollapsed={isCollapsed}
                            openDropdown={openDropdown}
                            onToggle={toggleDropdown}
                        />

                        <SectionLabel label="Administration" isCollapsed={isCollapsed} />
                        {checkPermission() && (
                            <DropdownSection
                                id="management"
                                emoji="⚙️"
                                label="Management"
                                links={managementLinks}
                                isCollapsed={isCollapsed}
                                openDropdown={openDropdown}
                                onToggle={toggleDropdown}
                            />
                        )}
                        <NavItem to="/admin/roles" emoji="🔒" label="Roles" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/credentials" emoji="🔑" label="API Credentials" isCollapsed={isCollapsed} />
                        <NavItem to="/admin/system-health" emoji="🖥️" label="System Health" isCollapsed={isCollapsed} />
                    </>
                )}
            </nav>

            {/* ── Footer User Strip ──────────────────────────────────── */}
            <div className={`flex-shrink-0 border-t border-slate-100 p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
                {isCollapsed ? (
                    <div className="w-8 h-8 rounded-lg bg-[#011d52] text-white flex items-center justify-center text-[11px] font-bold uppercase">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                ) : (
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#011d52] text-white flex items-center justify-center text-[11px] font-bold uppercase flex-shrink-0 overflow-hidden">
                            {user?.image
                                ? <img src={user?.image ? (user.image.startsWith('http') ? user.image : `${BASE_URL}${user.image}`) : ''} className="w-full h-full object-cover" alt="" />
                                : <span>{user?.name?.charAt(0) || 'A'}</span>
                            }
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-800 truncate leading-tight">{user?.name || 'Admin'}</p>
                            <p className="text-[9px] font-medium text-slate-400 truncate leading-tight">{user?.email || ''}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Online" />
                    </div>
                )}
            </div>
        </aside>
    );
};

export default AdminSidebar;