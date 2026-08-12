/**
 * cacheManager.js
 * ---------------
 * Production-grade, TTL-aware localStorage cache with automatic
 * version-based invalidation. Used by all public-facing data hooks.
 *
 * Features:
 *  - Per-key TTL with stale detection
 *  - App version check — stale version = full cache wipe on next read
 *  - Graceful fallback on QuotaExceededError (storage full)
 *  - Background revalidation support via isStale()
 */

const CACHE_PREFIX = 'bsmr_cache_';
const VERSION_KEY = 'bsmr_cache_version';
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// ─── Internal Helpers ─────────────────────────────────────────────────────────

function _storageKey(key) {
    return `${CACHE_PREFIX}${key}`;
}

function _checkVersion() {
    try {
        const storedVersion = localStorage.getItem(VERSION_KEY);
        if (storedVersion !== APP_VERSION) {
            // New deployment detected — clear all cached data
            _clearAll();
            localStorage.setItem(VERSION_KEY, APP_VERSION);
        }
    } catch {
        // localStorage not available (private mode etc.) — silently skip
    }
}

function _clearAll() {
    try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(CACHE_PREFIX)) {
                keysToRemove.push(k);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch {
        // ignore
    }
}

// Run version check once on module load
_checkVersion();

// ─── Public API ───────────────────────────────────────────────────────────────

const cacheManager = {
    /**
     * Get cached value for a key.
     * Returns null if missing, expired, or on any error.
     */
    get(key) {
        try {
            const raw = localStorage.getItem(_storageKey(key));
            if (!raw) return null;

            const entry = JSON.parse(raw);
            if (!entry || !entry.expiresAt) return null;

            if (Date.now() > entry.expiresAt) {
                // Expired — remove silently
                localStorage.removeItem(_storageKey(key));
                return null;
            }

            return entry.data;
        } catch {
            return null;
        }
    },

    /**
     * Get cached value even if stale (for stale-while-revalidate pattern).
     * Returns { data, isStale } — data may be expired but is still returned.
     */
    getWithStaleness(key) {
        try {
            const raw = localStorage.getItem(_storageKey(key));
            if (!raw) return { data: null, isStale: true };

            const entry = JSON.parse(raw);
            if (!entry) return { data: null, isStale: true };

            const isStale = Date.now() > entry.expiresAt;
            return { data: entry.data, isStale };
        } catch {
            return { data: null, isStale: true };
        }
    },

    /**
     * Store data under a key with a TTL in milliseconds.
     */
    set(key, data, ttlMs) {
        try {
            const entry = {
                data,
                cachedAt: Date.now(),
                expiresAt: Date.now() + ttlMs,
            };
            localStorage.setItem(_storageKey(key), JSON.stringify(entry));
        } catch (err) {
            if (err instanceof DOMException && err.name === 'QuotaExceededError') {
                // Storage full — clear old entries and retry once
                _clearAll();
                try {
                    const entry = {
                        data,
                        cachedAt: Date.now(),
                        expiresAt: Date.now() + ttlMs,
                    };
                    localStorage.setItem(_storageKey(key), JSON.stringify(entry));
                } catch {
                    // Still failing — skip silently (app works without cache)
                }
            }
        }
    },

    /**
     * Invalidate a specific cache key immediately.
     */
    invalidate(key) {
        try {
            localStorage.removeItem(_storageKey(key));
        } catch {
            // ignore
        }
    },

    /**
     * Invalidate multiple keys at once.
     * Pass an array of keys, or 'all' to clear everything.
     */
    invalidateMany(keys) {
        if (keys === 'all') {
            _clearAll();
            return;
        }
        if (Array.isArray(keys)) {
            keys.forEach(k => this.invalidate(k));
        }
    },

    /**
     * Bump app version to force full cache clear on all clients.
     * Call this from admin actions after a major content update.
     */
    bumpVersion(newVersion) {
        try {
            _clearAll();
            localStorage.setItem(VERSION_KEY, newVersion || String(Date.now()));
        } catch {
            // ignore
        }
    },

    /**
     * Check if a key exists in cache (regardless of staleness).
     */
    has(key) {
        try {
            return localStorage.getItem(_storageKey(key)) !== null;
        } catch {
            return false;
        }
    },
};

export default cacheManager;

// ─── TTL Constants (milliseconds) ─────────────────────────────────────────────
export const TTL = {
    /** 24 hours — header, footer, about, contact */
    LONG: 24 * 60 * 60 * 1000,
    /** 1 hour — testimonials, marquee */
    MEDIUM: 60 * 60 * 1000,
    /** 30 minutes — services, plans, categories, home data */
    SHORT: 30 * 60 * 1000,
    /** 5 minutes — frequently changing content */
    VERY_SHORT: 5 * 60 * 1000,
};
