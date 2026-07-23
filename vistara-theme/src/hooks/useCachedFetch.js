/**
 * useCachedFetch.js
 * -----------------
 * Universal stale-while-revalidate hook.
 *
 * Behaviour:
 *  1. On first call: returns cached data immediately (no spinner) if available,
 *     then silently revalidates in the background if stale.
 *  2. On cache miss: sets loading=true, fetches, stores, returns data.
 *  3. Deduplicates concurrent requests via requestDeduplicator.
 *  4. Exposes `refresh()` for manual invalidation + refetch.
 *
 * @param {() => Promise<any>} fetchFn - Async function that performs the API call
 * @param {string}             cacheKey - Unique key for caching this data
 * @param {number}             ttlMs    - Time-to-live in milliseconds
 * @param {any[]}              [deps=[]] - Extra dependencies that trigger a refetch
 *
 * @returns {{ data: any, loading: boolean, error: any, refresh: () => void }}
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import cacheManager from '../utils/cacheManager';
import requestDeduplicator from '../utils/requestDeduplicator';

export default function useCachedFetch(fetchFn, cacheKey, ttlMs, deps = []) {
    const { data: cachedData, isStale } = cacheManager.getWithStaleness(cacheKey);

    const [data, setData] = useState(cachedData);
    const [loading, setLoading] = useState(!cachedData); // no spinner if we have cache
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);

    const doFetch = useCallback(
        async (silent = false) => {
            if (!silent) setLoading(true);
            setError(null);

            try {
                const result = await requestDeduplicator.execute(cacheKey, fetchFn);
                if (mountedRef.current) {
                    setData(result);
                    cacheManager.set(cacheKey, result, ttlMs);
                }
            } catch (err) {
                if (mountedRef.current) {
                    setError(err);
                    // Keep showing stale data if we have it — don't blank the UI
                }
            } finally {
                if (mountedRef.current) {
                    setLoading(false);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [cacheKey, ttlMs, ...deps]
    );

    useEffect(() => {
        mountedRef.current = true;

        if (!cachedData) {
            // No cache at all — fetch with loading spinner
            doFetch(false);
        } else if (isStale) {
            // Have stale data — show immediately, revalidate silently
            doFetch(true);
        }
        // If data is fresh — do nothing, already set from useState initializer

        return () => {
            mountedRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cacheKey, ...deps]);

    /** Manually clear cache and refetch */
    const refresh = useCallback(() => {
        cacheManager.invalidate(cacheKey);
        doFetch(false);
    }, [cacheKey, doFetch]);

    return { data, loading, error, refresh };
}
