const createAngelAxios = require('../../utils/AngelAxios');
const TokenManager = require('./TokenManager');
const CircuitBreaker = require('../../utils/CircuitBreaker');
const AngelScrip = require('../../models/AngelScrip');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

class AngelOneService {
  constructor() {
    this.apiKey = process.env.ANGEL_API_KEY;
    this.clientCode = process.env.ANGEL_CLIENT_CODE;
    this.password = process.env.ANGEL_PASSWORD;
    this.totpSecret = process.env.ANGEL_TOTP_SECRET;

    console.log('[AngelOneService] Initializing with Config:', {
      apiKey: this.apiKey ? 'PRESENT' : 'MISSING',
      clientCode: this.clientCode ? 'PRESENT' : 'MISSING',
      password: this.password ? 'PRESENT' : 'MISSING',
      totpSecret: this.totpSecret ? 'PRESENT' : 'MISSING',
    });

    this.baseUrl = process.env.ANGEL_BASE_URL || 'https://apiconnect.angelbroking.com';
    this.marketBaseUrl = process.env.ANGEL_MARKET_BASE_URL || 'https://apiconnect.angelone.in';

    this.axios = createAngelAxios(this.baseUrl, this.apiKey);
    this.marketAxios = createAngelAxios(this.marketBaseUrl, this.apiKey);

    this.circuitBreaker = new CircuitBreaker(5, 60000);
    this.jwtTtlSeconds = 3300; // 55 minutes

    // Stats for Dashboard
    this.totalRequests = 0;
    this.totalSuccess = 0;
  }

  async loadCredentials() {
    try {
      const AngelCredential = require('../../models/AngelCredential');
      const cred = await AngelCredential.findOne({ isActive: true }) || await AngelCredential.findOne();

      if (cred) {
        const apiKeyChanged = this.apiKey !== cred.apiKey;
        this.apiKey = cred.apiKey;
        this.clientCode = cred.clientCode;
        this.password = cred.password;
        this.totpSecret = cred.totpSecret;
        this.baseUrl = cred.baseUrl || 'https://apiconnect.angelbroking.com';
        this.marketBaseUrl = cred.marketBaseUrl || 'https://apiconnect.angelone.in';

        if (apiKeyChanged || !this.axios) {
          const createAngelAxios = require('../../utils/AngelAxios');
          this.axios = createAngelAxios(this.baseUrl, this.apiKey);
          this.marketAxios = createAngelAxios(this.marketBaseUrl, this.apiKey);
          console.log('[AngelOneService] Re-initialized Axios with new API Key from Database');
        }
      } else {
        this.apiKey = process.env.ANGEL_API_KEY;
        this.clientCode = process.env.ANGEL_CLIENT_CODE;
        this.password = process.env.ANGEL_PASSWORD;
        this.totpSecret = process.env.ANGEL_TOTP_SECRET;
        this.baseUrl = process.env.ANGEL_BASE_URL || 'https://apiconnect.angelbroking.com';
        this.marketBaseUrl = process.env.ANGEL_MARKET_BASE_URL || 'https://apiconnect.angelone.in';
      }
    } catch (error) {
      console.error('[AngelOneService] Failed to load credentials from database:', error.message);
      this.apiKey = process.env.ANGEL_API_KEY;
      this.clientCode = process.env.ANGEL_CLIENT_CODE;
      this.password = process.env.ANGEL_PASSWORD;
      this.totpSecret = process.env.ANGEL_TOTP_SECRET;
      this.baseUrl = process.env.ANGEL_BASE_URL || 'https://apiconnect.angelbroking.com';
      this.marketBaseUrl = process.env.ANGEL_MARKET_BASE_URL || 'https://apiconnect.angelone.in';
    }
  }

  async login() {
    if (this.loginPromise) {
      return this.loginPromise;
    }

    this.loginPromise = (async () => {
      try {
        await this.loadCredentials();

        console.log('[AngelOneService] Attempting login with ClientCode:', this.clientCode);

        if (!this.totpSecret) {
          console.error('[AngelOneService] LOGIN ABORTED: ANGEL_TOTP_SECRET is missing');
          throw new Error('Angel One TOTP Secret is missing. Please configure it in settings.');
        }

        if (this.circuitBreaker.isOpen()) {
          throw new Error('Circuit breaker is open. Angel API requests are paused.');
        }

        this.totalRequests++;
        const totp = TokenManager.generateTOTP(this.totpSecret);

        const payload = {
          clientcode: this.clientCode,
          password: this.password,
          totp: totp,
        };

        const response = await this.axios.post('/rest/auth/angelbroking/user/v1/loginByPassword', payload);

        const data = response.data;

        if (!data.status) {
          throw new Error(data.message || 'Angel login failed');
        }

        const jwt = data.data.jwtToken;
        const feed = data.data.feedToken;

        if (!jwt) {
          throw new Error('No JWT returned from Angel login');
        }

        TokenManager.set('jwt', jwt, this.jwtTtlSeconds);
        if (feed) {
          TokenManager.set('feed', feed, this.jwtTtlSeconds);
        }

        this.circuitBreaker.recordSuccess();
        this.totalSuccess++;
        console.log('[AngelOneService] Login successful.');
        return data;
      } catch (error) {
        this.circuitBreaker.recordFailure();
        console.error('[AngelOneService] Login Error:', error.response?.data || error.message);
        throw error;
      } finally {
        this.loginPromise = null;
      }
    })();

    return this.loginPromise;
  }

  async logout() {
    console.log('[AngelOneService] Logging out and clearing tokens...');
    TokenManager.delete('jwt');
    TokenManager.delete('feed');
    return { status: true, message: 'Logged out successfully' };
  }

  async ensureLoggedIn() {
    const jwt = TokenManager.get('jwt');
    if (!jwt || TokenManager.needsRenewal('jwt')) {
      await this.login();
    }
  }

  getHeaders() {
    const jwt = TokenManager.get('jwt');
    return {
      Authorization: `Bearer ${jwt}`,
    };
  }

  getMaxDaysForInterval(interval) {
    const map = {
      'ONE_MINUTE': 30,
      'THREE_MINUTE': 60,
      'FIVE_MINUTE': 100,
      'TEN_MINUTE': 100,
      'FIFTEEN_MINUTE': 200,
      'THIRTY_MINUTE': 200,
      'ONE_HOUR': 400,
      'ONE_DAY': 2000,
    };
    return map[interval.toUpperCase()] || 30;
  }

  async historical(symbolToken, interval, from, to) {
    const marketDataCache = require('./MarketDataCache');
    const cacheKey = `hist_${symbolToken}_${interval}_${from || 'none'}_${to || 'none'}`;
    const cachedData = marketDataCache.getHistorical(cacheKey, 3600); // Cache for 1 hour (3600 seconds)

    if (cachedData) {
      console.log(`[AngelOneService] Serving historical data from cache for ${symbolToken} (${interval})`);
      return cachedData;
    }

    console.log(`[AngelOneService] Fetching historical data for ${symbolToken} (${interval})`);

    try {
      await this.ensureLoggedIn();
    } catch (error) {
      return { status: false, message: 'Login failed: ' + error.message, data: null };
    }

    const intervalUpper = interval.toUpperCase();
    const maxDays = this.getMaxDaysForInterval(intervalUpper);

    let toDt = to ? dayjs(to, 'YYYY-MM-DD HH:mm') : dayjs();
    let fromDt = from ? dayjs(from, 'YYYY-MM-DD HH:mm') : toDt.subtract(maxDays, 'day').startOf('day').add(9, 'hour').add(15, 'minute');

    if (fromDt.isAfter(toDt)) {
      [fromDt, toDt] = [toDt, fromDt];
    }

    const combined = [];
    let current = fromDt;

    try {
      while (current.isBefore(toDt) || current.isSame(toDt)) {
        let chunkEnd = current.add(maxDays - 1, 'day').endOf('day');
        if (chunkEnd.isAfter(toDt)) {
          chunkEnd = toDt;
        }

        const payload = {
          exchange: 'NSE',
          symboltoken: String(symbolToken),
          interval: intervalUpper,
          fromdate: current.format('YYYY-MM-DD HH:mm'),
          todate: chunkEnd.format('YYYY-MM-DD HH:mm'),
        };

        const response = await this.axios.post('/rest/secure/angelbroking/historical/v1/getCandleData', payload, {
          headers: this.getHeaders()
        });

        const raw = response.data;

        if (!raw || !raw.status) {
          if (raw.errorcode === '401' || raw.errorcode === '403') {
            TokenManager.delete('jwt');
            await this.login();
            continue; // Retry chunk
          }
          return {
            status: false,
            message: raw.message || 'Historical API returned error',
            data: null
          };
        }

        if (raw.data && Array.isArray(raw.data)) {
          combined.push(...raw.data);
        }

        if (combined.length > 500000) break;

        current = chunkEnd.add(1, 'second');
      }

      const candles = combined.map(row => {
        const time = dayjs(row[0]).unix();
        return {
          time,
          open: parseFloat(row[1]) || 0,
          high: parseFloat(row[2]) || 0,
          low: parseFloat(row[3]) || 0,
          close: parseFloat(row[4]) || 0,
        };
      });

      // Sort and Deduplicate
      const uniqueCandles = Array.from(new Map(candles.map(c => [c.time, c])).values());
      uniqueCandles.sort((a, b) => a.time - b.time);

      const result = { status: true, message: 'OK', data: uniqueCandles };
      marketDataCache.setHistorical(cacheKey, result);
      return result;
    } catch (error) {
      console.error('[AngelOneService] Historical Data Error:', error.message);
      return { status: false, message: 'Exception: ' + error.message, data: null };
    }
  }

  async quote(symbols, mode = 'FULL', exchange = 'NSE') {
    try {
      const marketDataCache = require('./MarketDataCache');
      
      const cachedFetched = [];
      const missingSymbols = [];
      
      symbols.forEach(token => {
        const cached = marketDataCache.get(token);
        if (cached && cached.ltp !== undefined && cached.close !== undefined) {
          cachedFetched.push(cached);
        } else {
          missingSymbols.push(token);
        }
      });

      if (missingSymbols.length === 0) {
        return {
          status: true,
          message: 'SUCCESS',
          errorcode: '',
          data: {
            fetched: cachedFetched,
            unfetched: []
          }
        };
      }

      await this.ensureLoggedIn();

      const response = await this.marketAxios.post('/rest/secure/angelbroking/market/v1/quote/', {
        mode,
        exchangeTokens: { [exchange]: missingSymbols }
      }, {
        headers: this.getHeaders()
      });

      const data = response.data;

      if (data.errorcode === 'AG8001' || data.errorcode === '403') {
        TokenManager.delete('jwt');
        await this.login();
        return this.quote(symbols, mode, exchange);
      }

      if (data.status && data.data && Array.isArray(data.data.fetched)) {
        data.data.fetched.forEach(item => {
          if (item.symbolToken) marketDataCache.set(item.symbolToken, item);
        });
        data.data.fetched = [...data.data.fetched, ...cachedFetched];
      } else if (cachedFetched.length > 0) {
        return {
          status: true,
          message: 'SUCCESS (Partial cache)',
          errorcode: '',
          data: {
            fetched: cachedFetched,
            unfetched: missingSymbols
          }
        };
      }

      return data;
    } catch (error) {
      return { status: false, message: error.message, data: null };
    }
  }

  async getMultiQuotes(exchangeTokens, mode = 'FULL') {
    try {
      const marketDataCache = require('./MarketDataCache');
      const cachedFetched = [];
      const missingTokensMap = {};
      
      let totalMissing = 0;

      for (const [exchange, tokens] of Object.entries(exchangeTokens)) {
        const missing = [];
        tokens.forEach(token => {
          const cached = marketDataCache.get(token);
          if (cached && cached.ltp !== undefined && cached.close !== undefined) {
            cachedFetched.push(cached);
          } else {
            missing.push(token);
            totalMissing++;
          }
        });
        if (missing.length > 0) {
          missingTokensMap[exchange] = missing;
        }
      }

      if (totalMissing === 0) {
        return {
          status: true,
          message: 'SUCCESS',
          errorcode: '',
          data: {
            fetched: cachedFetched,
            unfetched: []
          }
        };
      }

      await this.ensureLoggedIn();

      const response = await this.marketAxios.post('/rest/secure/angelbroking/market/v1/quote/', {
        mode,
        exchangeTokens: missingTokensMap
      }, {
        headers: this.getHeaders()
      });

      const data = response.data;

      if (data.errorcode === 'AG8001' || data.errorcode === '403') {
        TokenManager.delete('jwt');
        await this.login();
        return this.getMultiQuotes(exchangeTokens, mode);
      }
      
      if (data.status && data.data && Array.isArray(data.data.fetched)) {
        data.data.fetched.forEach(item => {
          if (item.symbolToken) marketDataCache.set(item.symbolToken, item);
        });
        data.data.fetched = [...data.data.fetched, ...cachedFetched];
      } else if (cachedFetched.length > 0) {
        return {
          status: true,
          message: 'SUCCESS (Partial cache)',
          errorcode: '',
          data: {
            fetched: cachedFetched,
            unfetched: []
          }
        };
      }

      return data;
    } catch (error) {
      console.error('[AngelOneService] getMultiQuotes Error:', error.message);
      return { status: false, message: error.message, data: null };
    }
  }

  async gainersLosers(datatype, exchange, expirytype) {
    try {
      const marketDataCache = require('./MarketDataCache');
      const cacheKey = `${datatype}_${exchange}_${expirytype}`;
      const cached = marketDataCache.getMover(cacheKey);
      
      if (cached && cached.length > 0) {
        return {
          status: true,
          message: 'SUCCESS',
          data: cached
        };
      }

      await this.ensureLoggedIn();

      const response = await this.marketAxios.post('/rest/secure/angelbroking/marketData/v1/gainersLosers', {
        datatype,
        exchange,
        expirytype
      }, {
        headers: this.getHeaders()
      });

      const data = response.data;

      if (data.errorcode === '401' || data.errorcode === '403') {
        TokenManager.delete('jwt');
        await this.login();
        return this.gainersLosers(datatype, exchange, expirytype);
      }

      if (data.status && data.data) {
        marketDataCache.setMover(cacheKey, data.data);
      }

      return data;
    } catch (error) {
      return { status: false, message: error.message, data: null };
    }
  }

  // Database Logic (Scrip Lookup)


  getDbExchangeCandidates(exchange) {

    const exch = (exchange || 'NSE').toUpperCase();

    switch (exch) {

      case 'NSE':
        return ['NFO', 'NSE'];

      case 'BSE':
        return ['BFO', 'BSE'];

      case 'MCX':
        return ['MCX'];

      default:
        return ['NFO', 'NSE'];
    }
  }

  async searchSymbolNames(query, exchange = 'NSE') {

    if (!query || query.length < 2) {
      return [];
    }

    const segments = this.getDbExchangeCandidates(exchange);

    const results = await AngelScrip.find({

      exch_seg: { $in: segments },

      $or: [
        { symbol: { $regex: '^' + query, $options: 'i' } },
        { name: { $regex: '^' + query, $options: 'i' } }
      ]

    })
      .select('symbol name token')
      .limit(50)
      .lean();

    if (!results.length) {
      return [];
    }

    const uniqueMap = new Map();

    results.forEach(item => {

      const key = item.name?.toUpperCase();

      if (!uniqueMap.has(key)) {

        uniqueMap.set(key, {
          symbol: item.symbol,
          name: item.name,
          token: item.token
        });

      }

    });

    return Array.from(uniqueMap.values());
  }

  async getExpiriesForSymbol(name, exchange = 'NSE', type = null) {

    const segments = this.getDbExchangeCandidates(exchange);

    let query = {

      exch_seg: { $in: segments },

      name: name.toUpperCase(),

      expiry: {
        $nin: [null, '']
      }

    };

    if (type === 'future') {
      query.instrumenttype = /^FUT/i;
    }

    if (type === 'option') {
      query.instrumenttype = /^OPT/i;
    }

    let expiries = await AngelScrip.find(query)
      .distinct('expiry');

    expiries = expiries
      .filter(Boolean)
      .sort((a, b) => new Date(a) - new Date(b));

    return expiries;
  }

  async getStrikesForSymbol(
    name,
    expiry,
    exchange = 'NSE'
  ) {

    const segments =
      this.getDbExchangeCandidates(exchange);

    const results =
      await AngelScrip.find({

        exch_seg: { $in: segments },

        name: name.toUpperCase(),

        expiry: expiry,

        instrumenttype: /^OPT/i,

        strike: { $gt: 0 }

      })
        .select(
          'strike instrumenttype symbol'
        )
        .lean();

    if (!results.length) {

      console.log(
        `[AngelOneService] No strikes found for ${name} ${expiry}`
      );

      return [];

    }

    const indices = [

      'NIFTY',
      'BANKNIFTY',
      'FINNIFTY',
      'MIDCPNIFTY',
      'SENSEX',
      'BANKEX',
      'NIFTYNXT50'

    ];

    /*
    |--------------------------------------------------------------------------
    | MCX COMMODITIES
    |--------------------------------------------------------------------------
    */

    const mcxCommodities = [

      'CRUDEOIL',
      'NATURALGAS',
      'GOLD',
      'GOLDM',
      'SILVER',
      'SILVERM',
      'COPPER',
      'ZINC',
      'LEAD',
      'NICKEL',
      'ALUMINIUM'

    ];

    const upperName =
      name.toUpperCase();

    let strikes = results.map(row => {

      let strike =
        parseFloat(row.strike);

      /*
      |--------------------------------------------------------------------------
      | STRIKE SCALING FIX
      |--------------------------------------------------------------------------
      |
      | Angel stores many strikes as:
      |
      | 245000 => 2450
      | 250000 => 2500
      |
      */

      // Scale strikes if they are large (meaning they are stored multiplied by 100)
      if (strike > 10000) {
        strike = strike / 100;
      }

      return Number(
        strike.toFixed(2)
      );

    });

    /*
    |--------------------------------------------------------------------------
    | REMOVE DUPLICATES
    |--------------------------------------------------------------------------
    */

    strikes =
      [...new Set(strikes)];

    /*
    |--------------------------------------------------------------------------
    | SORT ASC
    |--------------------------------------------------------------------------
    */

    strikes.sort((a, b) => a - b);

    console.log(
      `[AngelOneService] ${name} strikes =>`,
      strikes.slice(0, 20)
    );

    return strikes;
  }

  async findScripToken(
    name,
    exchange,
    expiry,
    type,
    strike = null,
    right = null
  ) {

    const segments = this.getDbExchangeCandidates(exchange);

    const query = {

      exch_seg: { $in: segments },

      $or: [
        { name: name.toUpperCase() },
        { symbol: name.toUpperCase() }
      ]

    };

    let formattedExpiry = expiry;
    if (expiry) {
      if (typeof expiry === 'string' && /^\d{2}[A-Z]{3}\d{4}$/.test(expiry)) {
        formattedExpiry = expiry;
      } else {
        try {
          const d = new Date(expiry);
          if (!isNaN(d.getTime())) {
            const day = String(d.getDate()).padStart(2, '0');
            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            const monthStr = months[d.getMonth()];
            const yearStr = d.getFullYear();
            formattedExpiry = `${day}${monthStr}${yearStr}`;
          }
        } catch (e) {}
      }
    }

    if (type === 'future') {

      query.expiry = formattedExpiry;

      query.instrumenttype = /^FUT/i;

    } else if (type === 'option') {

      query.expiry = formattedExpiry;

      query.instrumenttype = /^OPT/i;

      if (strike) {

        const strikeFloat = parseFloat(strike);

        query.$orStrike = [
          {
            strike: {
              $gte: strikeFloat - 0.01,
              $lte: strikeFloat + 0.01
            }
          },
          {
            strike: {
              $gte: (strikeFloat * 100) - 0.01,
              $lte: (strikeFloat * 100) + 0.01
            }
          }
        ];
      }

      if (right) {

        query.symbol = {
          $regex: right + '$',
          $options: 'i'
        };

      }
    }

    /*
      FIXED STRIKE QUERY
    */

    if (query.$orStrike) {

      query.$and = [
        {
          $or: query.$orStrike
        }
      ];

      delete query.$orStrike;
    }

    const result = await AngelScrip.findOne(query)
      .sort({ expiry: 1, strike: 1 })
      .lean();

    return result;
  }
  async getIndices() {
    const marketDataCache = require('./MarketDataCache');

    const nseTokens = [
      '99926000', '99926004', '99926009', '99926037', '99926002', '99926005', '99926006', '99926007', '99926008', '99926010', '99926011', '99926012', '99926013', '99926016', '99926017', '99926018', '99926019', '99926020', '99926021', '99926022', '99926025'
    ];

    const bseTokens = ['99919000'];
    const allTokens = [...nseTokens, ...bseTokens];

    try {
      const cachedData = [];
      
      allTokens.forEach(token => {
        const data = marketDataCache.get(token);
        if (data && data.ltp) {
          cachedData.push(data);
        }
      });

      // If we have some cached data from WebSocket, serve it immediately (0ms latency!)
      // To ensure we aren't completely blind if WS fails, we only fallback to REST if cache is completely empty.
      if (cachedData.length > 0) {
        return {
          status: true,
          message: 'SUCCESS',
          data: {
            fetched: cachedData,
            unfetched: []
          }
        };
      }

      // FALLBACK TO REST API (if WebSocket hasn't received ticks yet or failed)
      const [nseData, bseData] = await Promise.all([
        this.quote(nseTokens, 'FULL', 'NSE'),
        this.quote(bseTokens, 'FULL', 'BSE')
      ]);

      let merged = [];

      const processData = (response) => {

        if (!response?.status || !response?.data) {
          return [];
        }

        let raw = [];

        if (Array.isArray(response.data?.fetched)) {
          raw = response.data.fetched;
        }
        else if (Array.isArray(response.data)) {
          raw = response.data;
        }
        else if (response.data) {
          raw = [response.data];
        }

        return raw;
      };

      merged.push(...processData(nseData));
      merged.push(...processData(bseData));

      /*
        REMOVE DUPLICATES
      */

      const unique = [];

      const seen = new Set();

      for (const item of merged) {

        const token = item.symbolToken;

        if (!seen.has(token)) {

          seen.add(token);

          unique.push(item);

        }

      }

      return {
        status: true,
        message: 'SUCCESS',
        data: {
          fetched: unique,
          unfetched: []
        }
      };

    } catch (error) {

      console.error('[AngelOneService] getIndices Error:', error.message);

      return {
        status: false,
        message: error.message
      };

    }
  }

  async nifty50Marquee() {

    const nifty50Stocks = [
      '2885',
      '11536',
      '1594',
      '3045',
      '1660',
      '1333',
      '10999',
      '317',
      '3456',
      '11483',
      '2475',
      '3506',
      '3351',
      '4963',
      '881',
      '2031'
    ];

    try {

      const res = await this.quote(
        nifty50Stocks,
        'FULL',
        'NSE'
      );

      if (!res?.status || !res?.data) {

        throw new Error(
          'Failed to fetch NIFTY 50 marquee data'
        );

      }

      let fetched = [];

      if (Array.isArray(res.data?.fetched)) {
        fetched = res.data.fetched;
      }
      else if (Array.isArray(res.data)) {
        fetched = res.data;
      }
      else if (res.data) {
        fetched = [res.data];
      }

      /*
        REMOVE DUPLICATES
      */

      const seen = new Set();

      fetched = fetched.filter(item => {

        const token = item.symbolToken;

        if (seen.has(token)) {
          return false;
        }

        seen.add(token);

        return true;

      });

      const formatted = fetched.map(item => {

        const ltp = parseFloat(item.ltp || 0);

        const prevClose = parseFloat(
          item.close ||
          item.previousClose ||
          ltp
        );

        const change = ltp - prevClose;

        const changePercent = prevClose > 0
          ? Number(
            ((change / prevClose) * 100).toFixed(2)
          )
          : 0;

        return {

          token: item.symbolToken || '',

          symbol:
            item.tradingSymbol ||
            item.symbol ||
            '',

          ltp,

          previousClose: prevClose,

          change: Number(change.toFixed(2)),

          changePercent,

          trend: change >= 0 ? 'UP' : 'DOWN'

        };

      });

      return {
        status: true,
        message: 'SUCCESS',
        data: formatted
      };

    } catch (error) {

      console.error(
        '[AngelOneService] nifty50Marquee Error:',
        error.message
      );

      return {
        status: false,
        message: error.message
      };

    }
  }

  async wsToken() {

    try {

      await this.ensureLoggedIn();

      const jwt = TokenManager.get('jwt');

      const feed = TokenManager.get('feed');

      if (!jwt) {

        throw new Error(
          'JWT token missing'
        );

      }

      const cbStats =
        this.circuitBreaker.getStats();

      const successRate =
        this.totalRequests > 0
          ? (
            (this.totalSuccess / this.totalRequests) * 100
          ).toFixed(2)
          : '100.00';

      return {

        status: true,

        message: 'SUCCESS',

        data: {

          jwt,

          feed: feed || null,

          client_code: this.clientCode,

          api_key: this.apiKey,

          health: {

            successRate: `${successRate}%`,

            totalRequests: this.totalRequests,

            totalSuccess: this.totalSuccess,

            totalFailures:
              this.totalRequests - this.totalSuccess,

            failureCount:
              `${cbStats.failureCount} / ${cbStats.maxFailures}`,

            circuitBreaker:
              cbStats.state === 'CLOSED'
                ? 'Inactive'
                : cbStats.state,

            lastCheck:
              new Date().toLocaleString(),

            jwtExpiry:
              TokenManager.getExpiry('jwt') || null,

            feedAvailable:
              !!feed

          }

        }

      };

    } catch (error) {

      console.error(
        '[AngelOneService] wsToken Error:',
        error.message
      );

      return {

        status: false,

        message:
          'WS Token failed: ' + error.message,

        data: null

      };

    }
  }
  async searchEquitySymbols(query, exchange = 'NSE') {
    if (!query || query.length < 2) {
      return [];
    }

    const exch = (exchange || 'NSE').toUpperCase();

    const results = await AngelScrip.find({
      exch_seg: exch,
      $or: [
        { instrumenttype: '' },
        { instrumenttype: 'EQUITY' },
        { instrumenttype: { $exists: false } },
        { instrumenttype: null }
      ],
      $or: [
        { symbol: { $regex: '^' + query, $options: 'i' } },
        { name: { $regex: '^' + query, $options: 'i' } }
      ]
    })
      .select('symbol name token exch_seg instrumenttype')
      .limit(20)
      .lean();

    if (results.length === 0) return [];

    try {
      const tokens = results.map(r => r.token);
      const quoteRes = await this.quote(tokens, 'FULL', exch);

      if (quoteRes.status && quoteRes.data) {
        const fetched = quoteRes.data.fetched || (Array.isArray(quoteRes.data) ? quoteRes.data : [quoteRes.data]);
        return results.map(r => {
          const q = fetched.find(f => f.symbolToken === r.token);
          return {
            ...r,
            ltp: q ? parseFloat(q.ltp) : 0,
            percentChange: q ? q.percentChange : 0
          };
        });
      }
    } catch (error) {
      console.error('[AngelOneService] searchEquitySymbols LTP Fetch Error:', error.message);
    }

    return results;
  }

  async getEquityLTP(token, exchange = 'NSE') {
    try {
      const result = await this.quote([token], 'FULL', exchange.toUpperCase());
      if (!result.status || !result.data) {
        return null;
      }

      const fetched = result.data.fetched || (Array.isArray(result.data) ? result.data : [result.data]);
      const data = fetched[0];

      if (!data) return null;

      return {
        token: data.symbolToken,
        symbol: data.tradingSymbol,
        ltp: parseFloat(data.ltp),
        open: parseFloat(data.open),
        high: parseFloat(data.high),
        low: parseFloat(data.low),
        close: parseFloat(data.close),
        percentChange: data.percentChange
      };
    } catch (error) {
      console.error('[AngelOneService] getEquityLTP Error:', error.message);
      throw error;
    }
  }
}

module.exports = new AngelOneService();
