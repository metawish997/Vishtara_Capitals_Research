/**
 * LazyImage.jsx
 * -------------
 * Production-grade lazy-loading image component.
 *
 * Features:
 *  - Native `loading="lazy"` + `decoding="async"` for modern browsers
 *  - IntersectionObserver fallback for legacy browser support
 *  - Skeleton placeholder while loading (no layout shift)
 *  - Smooth fade-in on load
 *  - Error fallback: if image fails, shows a neutral placeholder
 *  - WebP source via <picture> when original is jpg/jpeg/png
 *
 * Usage:
 *   <LazyImage
 *     src="/uploads/hero.jpg"
 *     alt="Hero image"
 *     className="w-full h-64 object-cover"
 *     width={800}
 *     height={400}
 *   />
 */

import React, { useState, useRef, useEffect, memo } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a jpg/jpeg/png URL to its expected WebP counterpart */
function toWebpSrc(src) {
    if (!src || typeof src !== 'string') return null;
    if (/\.(jpg|jpeg|png)$/i.test(src)) {
        return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return null;
}

/** Check if browser natively supports IntersectionObserver */
const supportsIO = typeof IntersectionObserver !== 'undefined';

// ─── Component ────────────────────────────────────────────────────────────────

const LazyImage = memo(({
    src,
    alt = '',
    className = '',
    style = {},
    width,
    height,
    objectFit = 'cover',
    showSkeleton = true,
    skeletonClassName = '',
    onLoad,
    onError,
    ...rest
}) => {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);
    const [inView, setInView] = useState(!supportsIO); // load immediately if no IO support
    const imgRef = useRef(null);
    const observerRef = useRef(null);

    // ── IntersectionObserver ────────────────────────────────────────────────
    useEffect(() => {
        if (!supportsIO || inView) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observerRef.current?.disconnect();
                }
            },
            { rootMargin: '200px' } // start loading 200px before entering viewport
        );

        if (imgRef.current) {
            observerRef.current.observe(imgRef.current);
        }

        return () => {
            observerRef.current?.disconnect();
        };
    }, [inView]);

    // ── Derived values ──────────────────────────────────────────────────────
    const webpSrc = toWebpSrc(src);
    const isLazyType = src && /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(src);

    const handleLoad = (e) => {
        setLoaded(true);
        onLoad?.(e);
    };

    const handleError = (e) => {
        setErrored(true);
        setLoaded(true); // hide skeleton on error too
        onError?.(e);
    };

    // ── Skeleton placeholder ─────────────────────────────────────────────────
    const skeleton = showSkeleton && !loaded ? (
        <div
            className={`lazy-image-skeleton ${skeletonClassName}`}
            style={{
                width: width || '100%',
                height: height || '100%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%)',
                backgroundSize: '200% 100%',
                animation: 'lazySkeletonShimmer 1.5s infinite',
                borderRadius: 'inherit',
                position: loaded ? 'absolute' : undefined,
            }}
        />
    ) : null;

    // ── Error fallback ───────────────────────────────────────────────────────
    if (errored) {
        return (
            <div
                ref={imgRef}
                className={className}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: '12px',
                    width: width || '100%',
                    height: height || '100%',
                    ...style,
                }}
                aria-label={alt}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                </svg>
            </div>
        );
    }

    // ── WebP <picture> for jpg/png sources ──────────────────────────────────
    if (inView && webpSrc && !errored) {
        return (
            <div
                ref={imgRef}
                className={`lazy-image-wrapper ${className}`}
                style={{ position: 'relative', display: 'inline-block', width, height, ...style }}
            >
                {skeleton}
                <picture>
                    <source srcSet={webpSrc} type="image/webp" />
                    <img
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        loading="lazy"
                        decoding="async"
                        onLoad={handleLoad}
                        onError={handleError}
                        style={{
                            objectFit,
                            opacity: loaded ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            width: '100%',
                            height: '100%',
                        }}
                        {...rest}
                    />
                </picture>
                <style>{`
                    @keyframes lazySkeletonShimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                `}</style>
            </div>
        );
    }

    // ── Standard lazy image (non jpg/png, or IO not yet triggered) ───────────
    return (
        <div
            ref={imgRef}
            className={`lazy-image-wrapper ${className}`}
            style={{ position: 'relative', display: 'inline-block', width, height, ...style }}
        >
            {skeleton}
            {inView && (
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={isLazyType ? 'lazy' : undefined}
                    decoding="async"
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{
                        objectFit,
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        width: '100%',
                        height: '100%',
                    }}
                    {...rest}
                />
            )}
            <style>{`
                @keyframes lazySkeletonShimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
