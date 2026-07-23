const axios = require('axios');
const AngelScrip = require('../../models/AngelScrip');

class ScripMasterService {
  constructor() {
    this.url = process.env.ANGEL_SCRIP_MASTER_URL || 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json';
    this.isUpdating = false;
  }

  /**
   * Fetches the latest scrip master from Angel One and updates the local database.
   */
  async updateScrips() {
    if (this.isUpdating) {
      console.log('[ScripMasterService] Update already in progress...');
      return;
    }

    this.isUpdating = true;
    console.log('[ScripMasterService] Starting full scrip master update...');
    const startTime = Date.now();

    try {
      const response = await axios.get(this.url, { timeout: 300000 });
      const scrips = response.data;

      if (!Array.isArray(scrips)) {
        throw new Error('Invalid scrip master data format');
      }

      console.log(`[ScripMasterService] Downloaded ${scrips.length} scrips. Processing...`);

      // We use bulkWrite for high performance
      // For a huge dataset, we chunk it to avoid memory issues
      const chunkSize = 5000;
      for (let i = 0; i < scrips.length; i += chunkSize) {
        const chunk = scrips.slice(i, i + chunkSize);
        const operations = chunk.map(scrip => ({
          updateOne: {
            filter: { token: scrip.token, exch_seg: scrip.exch_seg },
            update: {
              $set: {
                symbol: scrip.symbol,
                name: scrip.name,
                expiry: scrip.expiry,
                strike: scrip.strike ? parseFloat(scrip.strike) : 0,
                lotsize: scrip.lotsize,
                instrumenttype: scrip.instrumenttype,
                tick_size: scrip.tick_size ? parseFloat(scrip.tick_size) : 0,
                updatedAt: new Date()
              }
            },
            upsert: true
          }
        }));

        await AngelScrip.bulkWrite(operations, { ordered: false });
        // console.log(`[ScripMasterService] Processed ${Math.min(i + chunkSize, scrips.length)} / ${scrips.length}`);
      }

      // Cleanup: Any scrip in our database that wasn't updated in this loop 
      // means Angel One no longer provides it (it expired or delisted).
      // We safely delete them to keep the database fresh and fast.
      const deleteResult = await AngelScrip.deleteMany({
        updatedAt: { $lt: new Date(startTime) }
      });
      console.log(`[ScripMasterService] Cleaned up ${deleteResult.deletedCount} expired/delisted scrips.`);

      const duration = (Date.now() - startTime) / 1000;
      console.log(`[ScripMasterService] Update completed in ${duration}s.`);
      return { success: true, count: scrips.length };
    } catch (error) {
      console.error('[ScripMasterService] Update failed:', error.message);
      return { success: false, error: error.message };
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Check if update is needed based on cache TTL or empty DB
   */
  async checkAndUpdateIfNeeded() {
    const count = await AngelScrip.countDocuments();
    if (count === 0) {
      console.log('[ScripMasterService] DB is empty. Initializing scrips...');
      return this.updateScrips();
    }

    // Optional: Check last update time
    const lastScrip = await AngelScrip.findOne().sort({ updatedAt: -1 });
    if (lastScrip) {
      const hoursSinceUpdate = (Date.now() - lastScrip.updatedAt.getTime()) / (1000 * 60 * 60);
      const ttl = parseInt(process.env.ANGEL_SCRIP_MASTER_CACHE_TTL || '24'); // Default 24 hours
      
      if (hoursSinceUpdate > ttl) {
        console.log(`[ScripMasterService] Scrips are older than ${ttl} hours. Updating...`);
        return this.updateScrips();
      }
    }
  }
}

module.exports = new ScripMasterService();
