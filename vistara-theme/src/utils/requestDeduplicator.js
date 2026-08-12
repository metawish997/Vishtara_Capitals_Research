/**
 * requestDeduplicator.js
 * ----------------------
 * Prevents duplicate in-flight API requests.
 *
 * If two components mount simultaneously and both call the same API,
 * only ONE network request fires. Both callers receive the same promise.
 *
 * Usage:
 *   const data = await requestDeduplicator.execute('my-unique-key', () => api.get('/endpoint'));
 */

class RequestDeduplicator {
    constructor() {
        /** @type {Map<string, Promise<any>>} */
        this._inflight = new Map();
    }

    /**
     * Execute a fetch function, deduplicating concurrent calls with the same key.
     *
     * @param {string} key - Unique identifier for this request (e.g., 'header_data')
     * @param {() => Promise<any>} fetchFn - The async function that performs the actual request
     * @returns {Promise<any>}
     */
    execute(key, fetchFn) {
        // If there's already an in-flight request for this key, return it
        if (this._inflight.has(key)) {
            return this._inflight.get(key);
        }

        // Start new request
        const promise = fetchFn().finally(() => {
            // Clean up when done (success or error)
            this._inflight.delete(key);
        });

        this._inflight.set(key, promise);
        return promise;
    }

    /**
     * Check if a request for the given key is currently in-flight.
     * @param {string} key
     */
    isInflight(key) {
        return this._inflight.has(key);
    }

    /**
     * Cancel tracking of a key (does NOT cancel the underlying request).
     * Useful for cleanup on unmount.
     * @param {string} key
     */
    clear(key) {
        this._inflight.delete(key);
    }

    /**
     * Clear all tracked in-flight requests.
     */
    clearAll() {
        this._inflight.clear();
    }
}

// Export a singleton so all hooks share the same deduplication map
const requestDeduplicator = new RequestDeduplicator();
export default requestDeduplicator;
