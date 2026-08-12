/**
 * AppDataContext.jsx
 * ------------------
 * Centralized context that pre-fetches shared public data (header, footer,
 * marquees) ONCE per session and shares it across all layouts/components.
 *
 * Benefits:
 *  - Zero duplicate header/footer API calls when navigating between pages
 *  - Cached data is available immediately on return visits
 *  - `refreshAll()` allows admin save actions to bust caches instantly
 *  - `invalidateKey()` allows targeted per-key invalidation
 */

import React, {
    createContext,
    useContext,
    useMemo,
    useCallback,
} from 'react';
import useHeaderData from '../hooks/useHeaderData';
import useFooterData from '../hooks/useFooterData';
import useMarqueeData from '../hooks/useMarqueeData';
import cacheManager from '../utils/cacheManager';

// ─── Context Definition ────────────────────────────────────────────────────────

const AppDataContext = createContext(null);

export const useAppData = () => {
    const ctx = useContext(AppDataContext);
    if (!ctx) {
        throw new Error('useAppData must be used within an AppDataProvider');
    }
    return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AppDataProvider = ({ children }) => {
    // ── Header ──────────────────────────────────────────────────────────────
    const {
        menus,
        settings: headerSettings,
        loading: headerLoading,
        refresh: refreshHeader,
    } = useHeaderData();

    // ── Footer ──────────────────────────────────────────────────────────────
    const {
        settings: footerSettings,
        columns: footerColumns,
        socials: footerSocials,
        brand: footerBrand,
        loading: footerLoading,
        refresh: refreshFooter,
    } = useFooterData();

    // ── Marquee ─────────────────────────────────────────────────────────────
    const {
        items: marqueeItems,
        loading: marqueeLoading,
        refresh: refreshMarquee,
    } = useMarqueeData();

    // ── Aggregated State ────────────────────────────────────────────────────
    const isLoading = headerLoading || footerLoading || marqueeLoading;

    // ── Cache Invalidation Helpers ──────────────────────────────────────────

    /** Invalidate all shared caches and refetch everything */
    const refreshAll = useCallback(() => {
        refreshHeader();
        refreshFooter();
        refreshMarquee();
    }, [refreshHeader, refreshFooter, refreshMarquee]);

    /**
     * Invalidate a specific cache key and optionally trigger a refresh.
     * Keys: 'header_data', 'footer_data', 'marquee_data', 'services_data',
     *       'faq_data', 'about_data', or 'all'
     */
    const invalidateKey = useCallback((key) => {
        cacheManager.invalidate(key);
        // Trigger relevant refetch
        if (key === 'header_data') refreshHeader();
        else if (key === 'footer_data') refreshFooter();
        else if (key === 'marquee_data') refreshMarquee();
        else if (key === 'all') refreshAll();
    }, [refreshHeader, refreshFooter, refreshMarquee, refreshAll]);

    // ── Memoized Context Value ───────────────────────────────────────────────
    const value = useMemo(() => ({
        // Header
        headerData: {
            menus,
            settings: headerSettings,
        },
        // Footer
        footerData: {
            settings: footerSettings,
            columns: footerColumns,
            socials: footerSocials,
            brand: footerBrand,
        },
        // Marquee
        marqueeItems,

        // State
        isLoading,

        // Cache control
        refreshAll,
        refreshHeader,
        refreshFooter,
        refreshMarquee,
        invalidateKey,
    }), [
        menus,
        headerSettings,
        footerSettings,
        footerColumns,
        footerSocials,
        footerBrand,
        marqueeItems,
        isLoading,
        refreshAll,
        refreshHeader,
        refreshFooter,
        refreshMarquee,
        invalidateKey,
    ]);

    return (
        <AppDataContext.Provider value={value}>
            {children}
        </AppDataContext.Provider>
    );
};

export default AppDataContext;
