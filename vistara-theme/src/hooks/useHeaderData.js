/**
 * useHeaderData.js
 * Fetches & caches header menus + settings.
 * TTL: 24 hours (header changes rarely)
 */
import { useMemo } from 'react';
import useCachedFetch from './useCachedFetch';
import headerService from '../services/headerService';
import { TTL } from '../utils/cacheManager';

const CACHE_KEY = 'header_data';

async function fetchHeader() {
    const [menusRes, settingsRes] = await Promise.all([
        headerService.getMenus(),
        headerService.getSettings(),
    ]);
    return {
        menus: menusRes?.data?.data || [],
        settings: settingsRes?.data?.data || {},
    };
}

export default function useHeaderData() {
    const { data, loading, error, refresh } = useCachedFetch(
        fetchHeader,
        CACHE_KEY,
        TTL.LONG
    );

    const menus = useMemo(() => data?.menus || [], [data]);
    const settings = useMemo(() => data?.settings || {}, [data]);

    return { menus, settings, loading, error, refresh };
}
