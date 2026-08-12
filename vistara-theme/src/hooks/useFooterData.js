/**
 * useFooterData.js
 * Fetches & caches footer full data.
 * TTL: 24 hours (footer changes rarely)
 */
import { useMemo } from 'react';
import useCachedFetch from './useCachedFetch';
import footerService from '../services/footerService';
import { TTL } from '../utils/cacheManager';

const CACHE_KEY = 'footer_data';

async function fetchFooter() {
    const res = await footerService.getFullData();
    return res?.data?.data || {};
}

export default function useFooterData() {
    const { data, loading, error, refresh } = useCachedFetch(
        fetchFooter,
        CACHE_KEY,
        TTL.LONG
    );

    const settings = useMemo(() => data?.settings || {}, [data]);
    const columns = useMemo(() => data?.columns || [], [data]);
    const socials = useMemo(() => data?.socials || [], [data]);
    const brand = useMemo(() => data?.brand || {}, [data]);

    return { settings, columns, socials, brand, loading, error, refresh };
}
