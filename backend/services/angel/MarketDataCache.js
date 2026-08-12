class MarketDataCache {
  constructor() {
    this.cache = new Map();
    this.movers = new Map();
    this.historical = new Map();
  }

  setMover(key, data) {
    this.movers.set(key, { data, timestamp: Date.now() });
  }

  getMover(key) {
    return this.movers.get(key)?.data;
  }

  setHistorical(key, data) {
    this.historical.set(key, { data, timestamp: Date.now() });
  }

  getHistorical(key, ttlSeconds = 60) {
    const cached = this.historical.get(key);
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() - cached.timestamp > ttlSeconds * 1000) {
      this.historical.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(token, data) {
    // Merge existing data if present so we don't overwrite static fields
    const existing = this.cache.get(token) || {};
    this.cache.set(token, { ...existing, ...data, timestamp: Date.now() });
  }

  get(token) {
    return this.cache.get(token);
  }

  getAll() {
    return Array.from(this.cache.values());
  }

  clear() {
    this.cache.clear();
  }
}

// Export a singleton instance
module.exports = new MarketDataCache();
