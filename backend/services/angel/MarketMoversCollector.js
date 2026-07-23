const AngelOneService = require('./AngelOneService');

class MarketMoversCollector {
  constructor() {
    this.intervalId = null;
  }

  start() {
    // Initial fetch after 10 seconds to allow login to complete
    setTimeout(() => this.fetchMovers(), 10000);

    // Poll every 30 minutes
    this.intervalId = setInterval(() => this.fetchMovers(), 30 * 60 * 1000);
  }

  async fetchMovers() {
    try {
      console.log('[MarketMoversCollector] Polling Top Gainers & Losers...');

      // The gainersLosers method will automatically cache the result upon success!
      // We force a fetch by directly hitting the API, or we can just call it 
      // wait, our new gainersLosers method returns cached data if available.
      // So calling it will just return the cache! 
      // We need a way to bypass the cache to FORCE an update.

      await AngelOneService.ensureLoggedIn();

      const fetchAndUpdate = async (datatype) => {
        const cacheKey = `${datatype}_NSE_NEAR`;
        const response = await AngelOneService.marketAxios.post('/rest/secure/angelbroking/marketData/v1/gainersLosers', {
          datatype,
          exchange: 'NSE',
          expirytype: 'NEAR'
        }, {
          headers: AngelOneService.getHeaders()
        });

        const data = response.data;
        if (data.status && data.data) {
          const marketDataCache = require('./MarketDataCache');
          marketDataCache.setMover(cacheKey, data.data);
          console.log(`[MarketMoversCollector] Updated ${datatype} cache.`);
        }
      };

      await Promise.all([
        fetchAndUpdate('PercPriceGainers'),
        fetchAndUpdate('PercPriceLosers')
      ]);

    } catch (e) {
      console.error('[MarketMoversCollector] Error polling movers:', e.message);
    }
  }
}

module.exports = new MarketMoversCollector();
