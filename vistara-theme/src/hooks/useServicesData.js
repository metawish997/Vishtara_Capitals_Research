/**
 * useServicesData.js
 * Fetches & caches all service plans.
 * TTL: 30 minutes (services/plans can update from admin)
 */
import { useMemo } from 'react';
import useCachedFetch from './useCachedFetch';
import serviceService from '../services/serviceService';
import { TTL } from '../utils/cacheManager';

const CACHE_KEY = 'services_data';

async function fetchServices() {
    const res = await serviceService.getServicePlans();
    return Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
}

export default function useServicesData() {
    const { data, loading, error, refresh } = useCachedFetch(
        fetchServices,
        CACHE_KEY,
        TTL.SHORT
    );

    const services = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    return { services, loading, error, refresh };
}
