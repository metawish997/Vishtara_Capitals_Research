/**
 * useFaqData.js
 * Fetches & caches FAQ list.
 * TTL: 1 hour
 */
import { useMemo } from 'react';
import useCachedFetch from './useCachedFetch';
import faqService from '../services/faqService';
import { TTL } from '../utils/cacheManager';

const CACHE_KEY = 'faq_data';

async function fetchFaqs() {
    const res = await faqService.getFaqs();
    return Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
}

export default function useFaqData() {
    const { data, loading, error, refresh } = useCachedFetch(
        fetchFaqs,
        CACHE_KEY,
        TTL.MEDIUM
    );

    const faqs = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    return { faqs, loading, error, refresh };
}
