/**
 * cacheHeadersMiddleware.js
 * --------------------------
 * Express middleware that sets appropriate Cache-Control headers
 * based on route type and HTTP method.
 *
 * Strategy:
 *  - Public GET routes (header, footer, services, faqs, marquees, about, contact):
 *    → `public, max-age=1800, stale-while-revalidate=3600`
 *    → Browser caches for 30min, can serve stale while revalidating for 1hr
 *
 *  - Authenticated/private routes:
 *    → `private, no-store`
 *
 *  - Mutation requests (POST, PUT, PATCH, DELETE):
 *    → `no-store` — never cache write operations
 *
 * Usage:
 *   app.use('/api/v1', cacheHeadersMiddleware, routes);
 *   — OR apply per-router in routes/index.js
 */

// Public GET endpoints that are safe to cache (short TTL)
const PUBLIC_CACHEABLE_PATTERNS = [
    /^\/header\//,
    /^\/footer\//,
    /^\/services(?:\/|$)/,
    /^\/faqs(?:\/|$)/,
    /^\/marquees(?:\/|$)/,
    /^\/about\//,
    /^\/contact(?:\/|$)/,
    /^\/blogs(?:\/|$)/,
    /^\/news(?:\/|$)/,
    /^\/announcements(?:\/|$)/,
    /^\/offer-banners(?:\/|$)/,
    /^\/reviews(?:\/|$)/,
    /^\/policies(?:\/|$)/,
    /^\/certificates(?:\/|$)/,
    /^\/bank-details(?:\/|$)/,
    /^\/complaint-data(?:\/|$)/,
];

// Longer cache for very-static data (24 hours)
const LONG_CACHE_PATTERNS = [
    /^\/header\/settings/,
    /^\/footer\/full/,
    /^\/about\//,
    /^\/contact(?:\/|$)/,
    /^\/policies(?:\/|$)/,
];

const cacheHeadersMiddleware = (req, res, next) => {
    // Never cache mutation requests
    if (req.method !== 'GET') {
        res.setHeader('Cache-Control', 'no-store');
        return next();
    }

    const path = req.path;

    // Check if this is a long-cache route
    const isLongCache = LONG_CACHE_PATTERNS.some(p => p.test(path));
    if (isLongCache) {
        res.setHeader(
            'Cache-Control',
            'public, max-age=86400, stale-while-revalidate=172800'
        ); // 24h cache, 48h stale-while-revalidate
        res.setHeader('Vary', 'Accept-Encoding');
        return next();
    }

    // Check if this is a short-cache public route
    const isPublicCacheable = PUBLIC_CACHEABLE_PATTERNS.some(p => p.test(path));
    if (isPublicCacheable) {
        res.setHeader(
            'Cache-Control',
            'public, max-age=1800, stale-while-revalidate=3600'
        ); // 30min cache, 1hr stale-while-revalidate
        res.setHeader('Vary', 'Accept-Encoding');
        return next();
    }

    // Default: private (auth-required routes) or dynamic
    res.setHeader('Cache-Control', 'private, no-store');
    next();
};

module.exports = cacheHeadersMiddleware;
