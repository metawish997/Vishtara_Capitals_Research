/**
 * useAboutData.js
 * Fetches & caches all "About" section data.
 * TTL: 24 hours (about content changes rarely)
 */
import { useMemo } from 'react';
import useCachedFetch from './useCachedFetch';
import aboutService from '../services/aboutService';
import { TTL } from '../utils/cacheManager';

const CACHE_KEY = 'about_data';

async function fetchAbout() {
    const [coreValuesRes, missionRes, whyPlatformRes] = await Promise.all([
        aboutService.getCoreValues(),
        aboutService.getMission(),
        aboutService.getWhyPlatform(),
    ]);
    return {
        coreValues: coreValuesRes?.data?.data || {},
        mission: missionRes?.data?.data || {},
        whyPlatform: whyPlatformRes?.data?.data || [],
    };
}

export default function useAboutData() {
    const { data, loading, error, refresh } = useCachedFetch(
        fetchAbout,
        CACHE_KEY,
        TTL.LONG
    );

    const coreValues = useMemo(() => data?.coreValues || {}, [data]);
    const mission = useMemo(() => data?.mission || {}, [data]);
    const whyPlatform = useMemo(() => data?.whyPlatform || [], [data]);

    return { coreValues, mission, whyPlatform, loading, error, refresh };
}
