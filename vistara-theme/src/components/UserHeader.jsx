import React, { useState, useEffect, memo } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import headerService from '../services/headerService';
import { useTheme } from '../context/ThemeContext';
import { Accessibility } from 'lucide-react';
import { BASE_URL } from '../services/api';

const UserHeader = memo(({ settings: propSettings, menus: propMenus }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accessibilityOpen, setAccessibilityOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentAuthText, setCurrentAuthText] = useState('Sign In');
    const [fontSize, setFontSize] = useState('medium');

    const handleFontSizeChange = (size) => {
        setFontSize(size);
        if (size === 'small') {
            document.documentElement.style.fontSize = '14px';
        } else if (size === 'large') {
            document.documentElement.style.fontSize = '18px';
        } else {
            document.documentElement.style.fontSize = '16px';
        }
    };

    // Dynamic settings and menus state
    const [settings, setSettings] = useState(propSettings || null);
    const [menus, setMenus] = useState(propMenus || null);

    // Helper to check for external links
    const isExternalLink = (url) => {
        return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'));
    };

    // Fetch dynamic header settings and menus
    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const [settRes, menuRes] = await Promise.all([
                    headerService.getSettings(),
                    headerService.getMenus()
                ]);
                if (settRes?.data?.data) {
                    setSettings(settRes.data.data);
                }
                if (menuRes?.data?.data) {
                    // Only show menus that have show_in_header set to true
                    const visibleMenus = menuRes.data.data.filter(m => m.show_in_header);
                    setMenus(visibleMenus);
                }
            } catch (err) {
                console.error('Error fetching dynamic header data:', err);
            }
        };

        if (!propSettings || !propMenus) {
            fetchHeaderData();
        }
    }, [propSettings, propMenus]);

    // Handle scroll for glassmorphism effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Removed text toggle animation for better UX
    useEffect(() => {
        // Static text
        setCurrentAuthText('Sign In');
    }, []);

    // Standard Menus if none provided
    const displayMenus = menus !== null ? menus : [
        { title: 'Home', link: '/' },
        { title: 'About', link: '/about' },
        { title: 'Services', link: '/services' },
        { title: 'News', link: '/news' },
        { title: 'Contact', link: '/contact' },
        { title: 'Blogs', link: '/blogs' },
    ];

    const btnStyle = (isActive) => ({
        background: 'none',
        border: 'none',
        color: isActive ? 'var(--primary, #2E4A72)' : 'var(--text-secondary)',
        fontWeight: isActive ? '700' : '500',
        cursor: 'pointer',
        fontSize: '15px',
        padding: '0',
        transition: 'color 0.2s'
    });

    const renderAccessibilityPopover = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '180px', textAlign: 'left' }}>
            <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Font Size</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => handleFontSizeChange('large')} style={btnStyle(fontSize === 'large')}>A+</button>
                    <span style={{ color: 'var(--border)', fontWeight: '300' }}>|</span>
                    <button onClick={() => handleFontSizeChange('medium')} style={btnStyle(fontSize === 'medium')}>Reset</button>
                    <span style={{ color: 'var(--border)', fontWeight: '300' }}>|</span>
                    <button onClick={() => handleFontSizeChange('small')} style={btnStyle(fontSize === 'small')}>A-</button>
                </div>
            </div>

            <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Contrast</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => { if (theme !== 'black-green') toggleTheme(); }} style={btnStyle(theme === 'black-green')}>High Contrast</button>
                    <span style={{ color: 'var(--border)', fontWeight: '300' }}>|</span>
                    <button onClick={() => { if (theme === 'black-green') toggleTheme(); }} style={btnStyle(theme !== 'black-green')}>Reset</button>
                </div>
            </div>
        </div>
    );

    return (
        <header className="z-[100] w-full flex justify-center">
            {/* Top Accessibility Utility */}
            <div style={{
                position: 'fixed',
                top: '0',
                right: '20px',
                zIndex: 1001,
                background: 'transparent',
                padding: '2px 8px',
                display: 'flex',
                alignItems: 'center',
                height: '24px'
            }}>
                <button
                    onClick={() => setAccessibilityOpen(!accessibilityOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: accessibilityOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0',
                        transition: 'color 0.2s',
                        borderRadius: '4px',
                    }}
                    title="Accessibility Options"
                >
                    <Accessibility size={20} />
                </button>

                <AnimatePresence>
                    {accessibilityOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                right: '0',
                                background: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '24px',
                                boxShadow: '0 10px 30px rgba(31,45,68,0.12)',
                                zIndex: 1002,
                                marginTop: '4px'
                            }}
                        >
                            {renderAccessibilityPopover()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <nav className="glass-nav">
                {/* --- LOGO AREA --- */}
                <Link to="/" className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
                    <div className="relative flex items-center justify-center h-[100%]">
                        {settings?.logo_svg ? (
                            <div
                                className="flex items-center justify-center [&>svg]:h-8 [&>svg]:w-auto [&>svg]:object-contain"
                                dangerouslySetInnerHTML={{ __html: settings.logo_svg }}
                            />
                        ) : (
                            <div className="flex items-center justify-center">
                                {/* Fallback TR SVG if no logo_svg is set */}
                                <svg width="46" height="32" viewBox="0 0 46 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
                                    <path d="M0 2H22V8H14V30H6V8H0V2Z" fill="#FEFEFE" />
                                    <path d="M24 2H36C40.4183 2 44 5.58172 44 10C44 14.4183 40.4183 18 36 18H32V30H24V2ZM32 12H36C37.1046 12 38 11.1046 38 10C38 8.89543 37.1046 8 36 8H32V12Z" fill="#5C7BA8" />
                                    <path d="M32 18H40L46 30H38L32 18Z" fill="#5C7BA8" />
                                </svg>
                            </div>
                        )}
                    </div>
                </Link>

                {/* --- DESKTOP NAVIGATION --- */}
                <div className="nav-links-desktop">
                    {displayMenus.map((menu, i) => (
                        isExternalLink(menu.link) ? (
                            <a
                                key={i}
                                href={menu.link}
                            >
                                {menu.title}
                            </a>
                        ) : (
                            <NavLink
                                key={i}
                                to={menu.link}
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                {menu.title}
                            </NavLink>
                        )
                    ))}
                </div>

                {/* --- ACTION BUTTONS --- */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-3">
                        {!user ? (
                            settings?.button_active ? (
                                isExternalLink(settings.button_link) ? (
                                    <a
                                        href={settings.button_link}
                                        className="pill-btn-primary whitespace-nowrap"
                                        style={{ padding: '8px 20px', fontSize: '13px' }}
                                    >
                                        {settings.button_text || currentAuthText}
                                    </a>
                                ) : (
                                    <Link
                                        to={(settings.button_link && settings.button_link.trim() !== '' && settings.button_link !== '#') ? settings.button_link : '/login'}
                                        className="pill-btn-primary whitespace-nowrap"
                                        style={{ padding: '8px 20px', fontSize: '13px' }}
                                    >
                                        {settings.button_text || currentAuthText}
                                    </Link>
                                )
                            ) : (
                                <Link
                                    to={currentAuthText === 'Sign Up' ? '/register' : '/login'}
                                    className="pill-btn-primary whitespace-nowrap"
                                    style={{ padding: '8px 20px', fontSize: '13px' }}
                                >
                                    {currentAuthText}
                                </Link>
                            )
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to={user.role === 'super admin' ? '/admin/dashboard' : '/portal'} className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white border border-[var(--border)] hover:bg-[#F2F5FA] transition-all group whitespace-nowrap shadow-sm">
                                    <img
                                        src={user?.image ? (user.image.startsWith('http') ? user.image : `${BASE_URL}${user.image}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                        className="w-7 h-7 rounded-full border border-[var(--border)] shadow-sm"
                                        alt="User"
                                    />
                                    <div className="flex flex-col text-left">
                                        <span className="text-[11px] font-black text-[var(--text-primary)] leading-none">{user.name}</span>
                                        <span className="text-[8px] font-bold text-[var(--accent)] uppercase tracking-widest mt-0.5">Dashboard</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        toast.success('Signed out successfully');
                                        navigate('/');
                                    }}
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 hover:text-red-600 transition-all"
                                    title="Sign Out"
                                >
                                    🚪
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white border border-[var(--border)] rounded-xl hover:bg-[#F2F5FA] transition-colors shadow-sm"
                    >
                        <span className="w-5 h-0.5 bg-[var(--text-primary)] rounded-full"></span>
                        <span className="w-4 h-0.5 bg-[var(--text-primary)] rounded-full ml-auto mr-1.5"></span>
                        <span className="w-5 h-0.5 bg-[var(--text-primary)] rounded-full"></span>
                    </button>
                </div>
            </nav>

            {/* --- MOBILE DRAWER MENU --- */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: '96px',
                            left: '16px',
                            right: '16px',
                            background: 'rgba(255, 255, 255, 0.97)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid var(--border)',
                            borderRadius: '20px',
                            padding: '24px',
                            zIndex: 999,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            boxShadow: '0 20px 40px rgba(31,45,68,0.14)'
                        }}
                    >
                        {/* Close button inside drawer */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '20px' }}
                            >
                                ✕
                            </button>
                        </div>

                        {displayMenus.map((menu, i) => (
                            isExternalLink(menu.link) ? (
                                <a
                                    key={i}
                                    href={menu.link}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '16px', fontWeight: '700' }}
                                    className="hover:text-[var(--primary)]"
                                >
                                    {menu.title}
                                </a>
                            ) : (
                                <Link
                                    key={i}
                                    to={menu.link}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '16px', fontWeight: '700' }}
                                    className="hover:text-[var(--primary)]"
                                >
                                    {menu.title}
                                </Link>
                            )
                        ))}

                        {!user ? (
                            settings?.button_active ? (
                                isExternalLink(settings.button_link) ? (
                                    <a
                                        href={settings.button_link}
                                        className="pill-btn-primary"
                                        style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {settings.button_text || currentAuthText}
                                    </a>
                                ) : (
                                    <Link
                                        to={(settings.button_link && settings.button_link.trim() !== '' && settings.button_link !== '#') ? settings.button_link : '/login'}
                                        className="pill-btn-primary"
                                        style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {settings.button_text || currentAuthText}
                                    </Link>
                                )
                            ) : (
                                <Link
                                    to={currentAuthText === 'Sign Up' ? '/register' : '/login'}
                                    className="pill-btn-primary"
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {currentAuthText}
                                </Link>
                            )
                        ) : (
                            <Link
                                to={user.role === 'super admin' ? '/admin/dashboard' : '/portal'}
                                className="pill-btn-primary"
                                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

        </header>
    );
});

UserHeader.displayName = 'UserHeader';

export default UserHeader;