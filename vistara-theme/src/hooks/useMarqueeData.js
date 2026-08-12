/**
 * useMarqueeData.js
 * Fetches & caches disclaimer marquee items.
 * TTL: 30 minutes
 */
import { useMemo } from 'react';
import useCachedFetch from './useCachedFetch';
import marqueeService from '../services/marqueeService';
import { TTL } from '../utils/cacheManager';

const CACHE_KEY = 'marquee_data';

const DEFAULT_ITEMS = [
    'Market investments are subject to risk.',
    'This platform is for educational & research purposes only.',
    'We do not guarantee profits or returns.',
    'Always conduct your own research before investing.',
    'Past performance does not guarantee future results.',
    'Trading involves financial risk.',
    'Information shared should not be considered financial advice.',
];

async function fetchMarquees() {
    const res = await marqueeService.getMarquees();
    const items = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
    const activeItems = items
        .filter(m => m.is_active)
        .map(m => m.content);
    return activeItems.length > 0 ? activeItems : DEFAULT_ITEMS;
}

export default function useMarqueeData() {
    const { data, loading, error, refresh } = useCachedFetch(
        fetchMarquees,
        CACHE_KEY,
        TTL.SHORT
    );

    const items = useMemo(
        () => (Array.isArray(data) && data.length > 0 ? data : DEFAULT_ITEMS),
        [data]
    );

    return { items, loading, error, refresh };
}
