const Tip = require('../../models/tips/Tip');
const WatchlistScript = require('../../models/watchlist/WatchlistScript');
const AngelStreamService = require('./AngelStreamService');

class CentralMarketCollector {
  constructor() {
    this.intervalId = null;
  }

  start() {
    // Initial collection after 5 seconds to let DB and WebSocket connect
    setTimeout(() => this.collectAndSubscribe(), 5000);
    
    // Poll the database every 60 seconds to find any newly added Market Calls or Watchlists
    this.intervalId = setInterval(() => this.collectAndSubscribe(), 60 * 1000);
  }

  async collectAndSubscribe() {
    try {
      console.log('[CentralMarketCollector] Gathering symbols from DB...');
      const tokensByExchange = {
        'NSE': new Set(),
        'NFO': new Set(),
        'BSE': new Set(),
        'BFO': new Set(),
        'MCX': new Set()
      };

      // 1. Get all Open Tips
      const openTips = await Tip.find({ trade_status: 'Open', symbol_token: { $ne: null } });
      openTips.forEach(tip => {
        const exch = tip.exchange ? tip.exchange.toUpperCase() : 'NSE';
        if (tokensByExchange[exch] && tip.symbol_token) {
          tokensByExchange[exch].add(tip.symbol_token);
        }
      });

      // 2. Get all Watchlist items
      const watchlistItems = await WatchlistScript.find({ token: { $ne: null } });
      watchlistItems.forEach(item => {
        const exch = item.exchange ? item.exchange.toUpperCase() : 'NSE';
        if (tokensByExchange[exch] && item.token) {
          tokensByExchange[exch].add(item.token);
        }
      });

      // 3. Convert Sets to Arrays for AngelStreamService
      const subscriptionPayload = {};
      let totalTokens = 0;
      for (const [exch, set] of Object.entries(tokensByExchange)) {
        if (set.size > 0) {
          subscriptionPayload[exch] = Array.from(set);
          totalTokens += set.size;
        }
      }

      // 4. Send directly to the WebSocket
      if (totalTokens > 0) {
        console.log(`[CentralMarketCollector] Auto-subscribing to ${totalTokens} total tokens across exchanges.`);
        // Mode 1 is for LTP (Live Trading Price). Note AngelStreamService.subscribe handles deduplication
        AngelStreamService.subscribe(subscriptionPayload, 1);
      } else {
        console.log('[CentralMarketCollector] No active tokens found in DB.');
      }

    } catch (error) {
      console.error('[CentralMarketCollector] Error gathering tokens:', error.message);
    }
  }
}

module.exports = new CentralMarketCollector();
