const otplib = require('otplib');
const dayjs = require('dayjs');

class TokenManager {
  constructor() {
    this.cache = new Map();
    this.cachePrefix = 'angel_';
  }

  set(key, value, ttlSeconds) {
    const expiry = dayjs().add(ttlSeconds, 'second');
    this.cache.set(this.cachePrefix + key, {
      value,
      expiry,
    });
  }

  get(key) {
    const data = this.cache.get(this.cachePrefix + key);
    if (!data) return null;

    if (dayjs().isAfter(data.expiry)) {
      this.cache.delete(this.cachePrefix + key);
      return null;
    }

    return data.value;
  }

  getExpiry(key) {
    const data = this.cache.get(this.cachePrefix + key);
    return data ? data.expiry : null;
  }

  delete(key) {
    this.cache.delete(this.cachePrefix + key);
  }

  generateTOTP(secret) {
    try {
      const authenticator = otplib.authenticator || otplib.default?.authenticator || otplib;
      
      // Modern otplib (v12+) expects an options object and has both async/sync methods
      if (typeof authenticator.generateSync === 'function') {
        return authenticator.generateSync({ secret });
      }
      
      // Fallback for older versions
      if (typeof authenticator.generate === 'function') {
        return authenticator.generate(secret);
      }

      throw new Error('Authenticator does not have a valid generate method');
    } catch (error) {
      console.error('[TokenManager] TOTP Error:', error.message);
      throw error;
    }
  }

  /**
   * Check if token needs renewal (e.g. 5 minutes before expiry)
   */
  needsRenewal(key, bufferMinutes = 5) {
    const expiry = this.getExpiry(key);
    if (!expiry) return true;
    return dayjs().add(bufferMinutes, 'minute').isAfter(expiry);
  }
}

module.exports = new TokenManager();
