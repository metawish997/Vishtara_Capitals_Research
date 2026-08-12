import React, { useState, useEffect, useMemo, memo } from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';
import FloatingSupportButton from '../components/FloatingSupportButton';
import SubscriptionAlert from '../components/SubscriptionAlert';
import { useTheme } from '../context/ThemeContext';
import { useAppData } from '../context/AppDataContext';
import angelService from '../services/angelService';

const UserLayout = memo(({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme } = useTheme();

    // ── Shared cached data from AppDataContext ───────────────────────────────
    // marqueeItems, headerData, footerData come from cache — no extra API calls
    const { headerData, footerData, marqueeItems } = useAppData();

    // ── Stock Market Marquee (real-time — not cached) ────────────────────────
    const [stockMarqueeItems, setStockMarqueeItems] = useState([
        { symbol: 'NIFTY 50', price: '+1.2%' },
        { symbol: 'SENSEX', price: '+0.9%' },
        { symbol: 'RELIANCE', price: '-0.4%' },
        { symbol: 'HDFCBANK', price: '+0.5%' },
        { symbol: 'INFY', price: '+2.1%' },
    ]);

    useEffect(() => {
        let cancelled = false;
        const fetchStockMarquee = async () => {
            try {
                const res = await angelService.getIndices();
                if (cancelled) return;
                if (res?.status && res?.data) {
                    const indices = Array.isArray(res.data)
                        ? res.data
                        : res.data.fetched || [];
                    if (indices.length > 0) {
                        const mapped = indices.map(item => ({
                            symbol: item.tradingSymbol || item.name || item.symbol,
                            price: item.percentChange
                                ? `${parseFloat(item.percentChange) >= 0 ? '+' : ''}${item.percentChange}%`
                                : item.ltp
                                    ? `₹${item.ltp}`
                                    : '+0.0%',
                        }));
                        setStockMarqueeItems(mapped);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch stock marquee data:', err);
            }
        };
        fetchStockMarquee();
        return () => { cancelled = true; };
    }, []);

    // ── Particle background (memoized — stable across re-renders) ────────────
    const particles = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: `${Math.random() * 2 + 1}px`,
            duration: `${Math.random() * 10 + 10}s`,
            delay: `${Math.random() * -10}s`,
        }));
    }, []);

    return (
        <div
            className={`user-theme min-h-screen w-full flex flex-col transition-colors duration-500 relative ${theme === 'black-green' ? 'theme-black-green' : ''
                } ${mobileMenuOpen ? 'menu-open' : ''}`}
            style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}
        >
            {/* Premium Background Layer */}
            <div className="hero-bg-container">
                <div className="bg-glow-main" />
                <div className="particles-container">
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className="particle"
                            style={{
                                left: p.left,
                                top: p.top,
                                width: p.size,
                                height: p.size,
                                '--duration': p.duration,
                                animationDuration: p.duration,
                                animationDelay: p.delay,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Subscription Expiry Alert Popup */}
            <SubscriptionAlert />

            <div className="flex-1 flex flex-col relative z-10">
                {/* Header — receives data from shared context (cached) */}
                <UserHeader
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    menus={headerData?.menus}
                    settings={headerData?.settings}
                />

                {/* Marquees for All Pages */}
                <div style={{ paddingTop: '96px' }}>
                    {/* Disclaimer Marquee — served from cache via AppDataContext */}
                    <div
                        style={{
                            width: '100%',
                            overflow: 'hidden',
                            background: 'rgba(255,255,255,0.015)',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            position: 'relative',
                            zIndex: 10,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                width: 'max-content',
                                animation: 'disclaimerMarqueeLayout 38s linear infinite',
                                padding: '10px 0',
                                gap: '60px',
                                alignItems: 'center',
                            }}
                        >
                            {[...marqueeItems, ...marqueeItems].map((text, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: '#a3ff00',
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            letterSpacing: '0.04em',
                                            color: 'rgba(255,255,255,0.65)',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <style>
                            {`
                                @keyframes disclaimerMarqueeLayout {
                                    0% { transform: translateX(0%); }
                                    100% { transform: translateX(-50%); }
                                }
                            `}
                        </style>
                    </div>

                    {/* Stock Market Marquee — real-time, not cached intentionally */}
                    <div
                        style={{
                            width: '100%',
                            overflow: 'hidden',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            background: 'rgba(255,255,255,0.02)',
                            backdropFilter: 'blur(10px)',
                            position: 'relative',
                            zIndex: 20,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                width: 'max-content',
                                animation: 'stockMarqueeLayout 28s linear infinite',
                                padding: '14px 0',
                                gap: '50px',
                            }}
                        >
                            {[...stockMarqueeItems, ...stockMarqueeItems].map((stock, i) => {
                                const isPositive = stock.price.includes('+');
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                letterSpacing: '0.08em',
                                                color: 'white',
                                            }}
                                        >
                                            {stock.symbol}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                color: isPositive ? '#a3ff00' : '#ff5c5c',
                                            }}
                                        >
                                            {stock.price}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <style>
                            {`
                                @keyframes stockMarqueeLayout {
                                    0% { transform: translateX(0%); }
                                    100% { transform: translateX(-50%); }
                                }
                            `}
                        </style>
                    </div>
                </div>

                {/* Main Page Content */}
                <main>
                    {children || <Outlet />}
                </main>

                {/* Floating Chat / Support Button */}
                <FloatingSupportButton />

                {/* Footer — receives data from shared context (cached) */}
                <UserFooter
                    settings={footerData?.settings}
                    columns={footerData?.columns}
                    socials={footerData?.socials}
                    brand={footerData?.brand}
                />
            </div>
        </div>
    );
});

UserLayout.displayName = 'UserLayout';

export default UserLayout;