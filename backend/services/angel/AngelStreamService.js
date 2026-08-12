const WebSocket = require('ws');
const TokenManager = require('./TokenManager');
const EventEmitter = require('events');
const marketDataCache = require('./MarketDataCache');

class AngelStreamService extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.isConnected = false;
    this.pingInterval = null;
    this.reconnectTimeout = null;
    
    // We maintain a master list of tokens we are subscribed to, so we can resubscribe on reconnect
    // format: { "NSE": new Set(["3045", "1594"]), "NFO": new Set(["..."]) }
    this.activeSubscriptions = new Map();
    this.closeCache = new Map();
  }

  getExchangeType(exchange) {
    switch(exchange ? exchange.toUpperCase() : '') {
      case 'NSE': return 1;
      case 'NFO': return 2;
      case 'BSE': return 3;
      case 'BFO': return 4;
      case 'MCX': return 5;
      default: return 1;
    }
  }

  getExchangeName(type) {
    switch(type) {
      case 1: return 'NSE';
      case 2: return 'NFO';
      case 3: return 'BSE';
      case 4: return 'BFO';
      case 5: return 'MCX';
      default: return 'NSE';
    }
  }

  connect() {
    if (this.isConnected) return;

    const jwt = TokenManager.get('jwt');
    const feedToken = TokenManager.get('feed');
    const AngelOneService = require('./AngelOneService');
    const apiKey = AngelOneService.apiKey || process.env.ANGEL_API_KEY;
    const clientCode = AngelOneService.clientCode || process.env.ANGEL_CLIENT_CODE;

    if (!jwt || !feedToken || !apiKey || !clientCode) {
      console.log(`[AngelStreamService] Missing credentials - jwt: ${!!jwt}, feed: ${!!feedToken}, apiKey: ${!!apiKey}, clientCode: ${!!clientCode}`);
      console.log('[AngelStreamService] Missing credentials, attempting auto-login...');
      
      try {
        const AngelOneService = require('./AngelOneService');
        AngelOneService.ensureLoggedIn()
          .then(() => {
            this.reconnectTimeout = setTimeout(() => this.connect(), 2000);
          })
          .catch(e => {
            console.error('[AngelStreamService] Auto-login failed:', e.message);
            this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
          });
      } catch (e) {
        console.error('[AngelStreamService] Auto-login invocation error:', e.message);
        this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
      }
      return;
    }

    const wsUrl = `wss://smartapisocket.angelone.in/smart-stream?clientCode=${clientCode}&feedToken=${feedToken}&apiKey=${apiKey}`;
    
    this.ws = new WebSocket(wsUrl, {
      headers: {
        'Authorization': jwt,
        'x-api-key': apiKey,
        'x-client-code': clientCode,
        'x-feed-token': feedToken
      }
    });

    this.ws.on('open', () => {
      console.log('[AngelStreamService] Connected Successfully');
      this.isConnected = true;

      // Start pinging
      this.pingInterval = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send('ping');
        }
      }, 25000);

      // Auto-subscribe to Indices for Dashboard
      const nseTokens = ['99926000','99926004','99926009','99926037','99926002','99926005','99926006','99926007','99926008','99926010','99926011','99926012','99926013','99926016','99926017','99926018','99926019','99926020','99926021','99926022','99926025'];
      const bseTokens = ['99919000'];
      
      this.subscribe({ 'NSE': nseTokens, 'BSE': bseTokens }, 2); // Mode 2 for Quote data

      // Resubscribe to other active tokens if any
      this.resubscribeAll();
    });

    this.ws.on('message', (data) => {
      this.parseBinary(data);
    });

    this.ws.on('close', () => {
      console.log('[AngelStreamService] Connection Closed');
      this.isConnected = false;
      this.cleanup();
      this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
    });

    this.ws.on('error', (err) => {
      console.error('[AngelStreamService] Error:', err.message);
      this.ws.close();
    });
  }

  cleanup() {
    if (this.pingInterval) clearInterval(this.pingInterval);
  }

  subscribe(tokensByExchange, mode = 2) {
    // mode 1 = LTP, 2 = QUOTE, 3 = SNAPQUOTE
    
    // Add to active subscriptions
    for (const [exchange, tokens] of Object.entries(tokensByExchange)) {
      if (!this.activeSubscriptions.has(exchange)) {
        this.activeSubscriptions.set(exchange, new Set());
      }
      const set = this.activeSubscriptions.get(exchange);
      tokens.forEach(t => set.add(t));
    }

    // Fetch missing close prices asynchronously
    this.fetchMissingClosePrices(tokensByExchange).catch(console.error);

    this.sendSubscribeRequest(tokensByExchange, mode); // Use requested mode (usually 2 for indices, 1 for fast tick)
  }

  unsubscribe(tokensByExchange) {
    // Optionally remove from activeSubscriptions.
    // For simplicity, we can keep the connection alive or clean up if we want to optimize.
  }

  resubscribeAll() {
    if (this.activeSubscriptions.size === 0) return;
    const tokensByExchange = {};
    for (const [exchange, set] of this.activeSubscriptions.entries()) {
      tokensByExchange[exchange] = Array.from(set);
    }
    this.sendSubscribeRequest(tokensByExchange, 1); // LTP Mode
  }

  async fetchMissingClosePrices(tokensByExchange) {
    const AngelOneService = require('./AngelOneService');
    const MarketDataCache = require('./MarketDataCache');

    for (const [exchange, tokens] of Object.entries(tokensByExchange)) {
      const missingTokens = [];
      
      tokens.forEach(t => {
        if (!this.closeCache.has(t)) {
          missingTokens.push(t);
        } else {
          // Emit initial tick from cache so frontend gets prices immediately!
          const cached = MarketDataCache.get(t);
          if (cached && cached.ltp !== undefined && cached.close !== undefined) {
            const ltp = parseFloat(cached.ltp);
            const close = parseFloat(cached.close);
            const change = ltp - close;
            const percentChange = close > 0 ? (change / close) * 100 : 0;
            
            this.emit('price_update', {
              token: t,
              ltp: ltp,
              close: close,
              change: change,
              percentChange: percentChange,
              mode: 1,
              exchange: exchange
            });
          }
        }
      });

      if (missingTokens.length === 0) continue;
      
      try {
        const quoteRes = await AngelOneService.quote(missingTokens, 'FULL', exchange);
        if (quoteRes.status && quoteRes.data) {
          const fetched = quoteRes.data.fetched || (Array.isArray(quoteRes.data) ? quoteRes.data : [quoteRes.data]);
          fetched.forEach(f => {
            if (f.close) {
              this.closeCache.set(f.symbolToken, parseFloat(f.close));
            }
            
            // Emit an initial tick so that closed markets don't show 0.00
            if (f.ltp) {
              const ltp = parseFloat(f.ltp);
              const close = parseFloat(f.close || 0);
              const change = ltp - close;
              const percentChange = close > 0 ? (change / close) * 100 : 0;
              
              this.emit('price_update', {
                token: f.symbolToken,
                ltp: ltp,
                close: close,
                change: change,
                percentChange: percentChange,
                mode: 1,
                exchange: exchange
              });
            }
          });
        }
      } catch (err) {
        console.error('[AngelStreamService] Failed to fetch close prices for caching:', err.message);
      }
    }
  }

  sendSubscribeRequest(tokensByExchange, mode) {
    if (!this.isConnected || this.ws.readyState !== WebSocket.OPEN) return;

    const tokenList = [];
    for (const [exchange, tokens] of Object.entries(tokensByExchange)) {
      tokenList.push({
        exchangeType: this.getExchangeType(exchange),
        tokens: tokens
      });
    }

    if (tokenList.length === 0) return;

    const payload = {
      correlationID: "sub_" + Date.now(),
      action: 1, // Subscribe
      params: {
        mode: mode,
        tokenList: tokenList
      }
    };

    this.ws.send(JSON.stringify(payload));
  }

  parseBinary(data) {
    if (!Buffer.isBuffer(data)) return;

    // Check opcode (first byte)
    const opcode = data.readUInt8(0);
    if (opcode !== 1 && opcode !== 2) return; // Parse LTP or Quote packets

    const exchangeType = data.readUInt8(1);
    
    // token is 25 bytes from offset 2
    let token = data.toString('utf8', 2, 27).replace(/\0/g, '').trim();

    // LTP is an 8-byte LE integer at offset 43
    if (data.length < 51) return;
    const ltpRaw = data.readBigInt64LE(43);
    const ltp = this.formatPrice(ltpRaw, exchangeType);

    const result = {
      token: token,
      symbolToken: token,
      ltp,
      mode: opcode,
      exchange: this.getExchangeName(exchangeType)
    };

    if (opcode >= 2 && data.length >= 123) {
      // Quote Mode (opcode 2) provides close price at offset 115
      const openRaw = data.readBigInt64LE(91);
      const highRaw = data.readBigInt64LE(99);
      const lowRaw = data.readBigInt64LE(107);
      const closeRaw = data.readBigInt64LE(115);
      
      const close = this.formatPrice(closeRaw, exchangeType);
      const open = this.formatPrice(openRaw, exchangeType);
      const high = this.formatPrice(highRaw, exchangeType);
      const low = this.formatPrice(lowRaw, exchangeType);
      
      const netChange = ltp - close;
      const percentChange = close > 0 ? (netChange / close) * 100 : 0;

      result.close = close;
      result.open = open;
      result.high = high;
      result.low = low;
      result.netChange = netChange;
      result.percentChange = percentChange;
      
      // Update cache
      this.closeCache.set(token, close);
    } else if (opcode === 1) {
      // LTP Mode (opcode 1)
      const close = this.closeCache.get(token);
      if (close !== undefined) {
        const netChange = ltp - close;
        const percentChange = close > 0 ? (netChange / close) * 100 : 0;
        result.close = close;
        result.netChange = netChange;
        result.percentChange = percentChange;
      }
    }

    // Save to centralized cache
    marketDataCache.set(token, result);

    // Emit event for socket.io broadcasting
    this.emit('price_update', result);
  }

  formatPrice(rawBigInt, exchangeType) {
    const raw = Number(rawBigInt);
    const divisor = (exchangeType === 7 || exchangeType === 8) ? 10000000 : 100;
    return raw / divisor;
  }
}

module.exports = new AngelStreamService();
