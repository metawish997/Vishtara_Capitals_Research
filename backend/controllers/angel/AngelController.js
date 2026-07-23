const AngelOneService = require('../../services/angel/AngelOneService');

/**
 * @desc    Login to Angel One
 * @route   POST /api/v1/angel/login
 * @access  Private/Admin
 */
exports.login = async (req, res) => {
  try {
    const data = await AngelOneService.login();
    res.status(200).json({
      status: true,
      message: 'Logged in successfully',
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Logout from Angel One
 * @route   POST /api/v1/angel/logout
 * @access  Private/Admin
 */
exports.logout = async (req, res) => {
  try {
    const result = await AngelOneService.logout();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get historical candle data
 * @route   GET /api/v1/angel/history
 */
exports.getHistory = async (req, res) => {
  try {
    const { symbol, interval, from, to } = req.query;

    if (!symbol || !interval) {
      return res.status(400).json({
        status: false,
        message: 'Symbol and interval are required',
      });
    }

    const result = await AngelOneService.historical(symbol, interval, from, to);

    if (!result.status) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get market quotes
 * @route   POST /api/v1/angel/quote
 */
exports.getQuote = async (req, res) => {
  const { symbols, mode, exchange } = req.body;
  console.log(`[AngelController] GET_QUOTE Request: Symbols=${symbols}, Exchange=${exchange}`);
  try {

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({
        status: false,
        message: 'Symbols array is required',
      });
    }

    const result = await AngelOneService.quote(symbols, mode, exchange);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get top gainers/losers
 * @route   GET /api/v1/angel/gainers-losers
 */
exports.getGainersLosers = async (req, res) => {
  try {
    const { datatype, exchange, expirytype } = req.query;

    const result = await AngelOneService.gainersLosers(
      datatype || 'PercPriceGainers',
      exchange || 'NSE',
      expirytype || 'NEAR'
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get top gainers
 * @route   GET /api/v1/angel/top-gainers
 */
exports.getTopGainers = async (req, res) => {
  try {
    const { exchange, expirytype } = req.query;

    const result = await AngelOneService.gainersLosers(
      'PercPriceGainers',
      exchange || 'NSE',
      expirytype || 'NEAR'
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get top losers
 * @route   GET /api/v1/angel/top-losers
 */
exports.getTopLosers = async (req, res) => {
  try {
    const { exchange, expirytype } = req.query;

    const result = await AngelOneService.gainersLosers(
      'PercPriceLosers',
      exchange || 'NSE',
      expirytype || 'NEAR'
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Search for symbols (Autocomplete)
 */
exports.searchSymbols = async (req, res) => {
  const { query, exchange } = req.query;
  console.log(`[AngelController] SEARCH_SYMBOLS Request: Query=${query}, Exchange=${exchange}`);
  try {
    const names = await AngelOneService.searchSymbolNames(query, exchange);
    res.status(200).json({ status: true, data: names });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @desc    Find specific scrip token
 */
exports.findToken = async (req, res) => {
  const { name, exchange, expiry, type, strike, right } = req.query;
  console.log(`[AngelController] FIND_TOKEN Request: Name=${name}, Expiry=${expiry}, Type=${type}`);
  try {
    const scrip = await AngelOneService.findScripToken(name, exchange, expiry, type, strike, right);

    if (!scrip) {
      return res.status(404).json({ status: false, message: 'Contract not found' });
    }

    res.status(200).json({
      status: true,
      data: {
        token: scrip.token,
        symbol: scrip.symbol,
        name: scrip.name,
        expiry: scrip.expiry,
        strike: scrip.strike,
        instrumenttype: scrip.instrumenttype,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @desc    Get expiries for a symbol
 */
exports.getExpiries = async (req, res) => {
  try {
    const { name, exchange, type } = req.query;
    const expiries = await AngelOneService.getExpiriesForSymbol(name, exchange, type);
    res.status(200).json({ status: true, data: expiries });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @desc    Get strike prices for a symbol and expiry
 */
exports.getStrikes = async (req, res) => {
  try {
    const { name, expiry, exchange } = req.query;
    const strikes = await AngelOneService.getStrikesForSymbol(name, expiry, exchange);
    res.status(200).json({ status: true, data: strikes });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @desc    Fetch 52 week high/low data
 */
exports.fetch52WeekData = async (req, res) => {
  try {
    const { symbols, exchange } = req.query;
    const symbolArray = symbols ? symbols.split(',') : [];
    
    if (symbolArray.length === 0) {
      return res.status(400).json({ status: false, message: 'Symbols are required' });
    }

    const result = await AngelOneService.quote(symbolArray, 'FULL', exchange || 'NSE');
    
    if (!result.status || !result.data) {
      return res.status(400).json(result);
    }

    const fetched = result.data.fetched || (Array.isArray(result.data) ? result.data : [result.data]);
    
    const formatted = fetched.map(item => ({
      symbolToken: item.symbolToken,
      tradingSymbol: item.tradingSymbol,
      ltp: item.ltp,
      high52: item.high52 || item['52WeekHigh'],
      low52: item.low52 || item['52WeekLow'],
    }));

    res.status(200).json({ status: true, data: formatted });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


/**
 * @desc    Get index quotes (Nifty, BankNifty, etc)
 */
exports.getIndices = async (req, res) => {
  try {
    const result = await AngelOneService.getIndices();
    res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @desc    Get Nifty 50 Marquee data
 */
exports.getMarquee = async (req, res) => {
  try {
    const result = await AngelOneService.nifty50Marquee();
    res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @desc    Get WebSocket Feed Token
 */
exports.getWsToken = async (req, res) => {
  try {
    const result = await AngelOneService.wsToken();
    res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
/**
 * @desc    Trigger Scrip Master Sync manually
 */
exports.syncScrips = async (req, res) => {
  try {
    const ScripMasterService = require('../../services/angel/ScripMasterService');
    const result = await ScripMasterService.updateScrips();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @desc    Get Scrip Sync Status
 */
exports.getSyncStatus = async (req, res) => {
  try {
    const AngelScrip = require('../../models/AngelScrip');
    const count = await AngelScrip.countDocuments();
    const lastScrip = await AngelScrip.findOne().sort({ updatedAt: -1 });
    
    res.status(200).json({
      status: true,
      data: {
        count,
        lastUpdate: lastScrip ? lastScrip.updatedAt : null,
        isUpdating: require('../../services/angel/ScripMasterService').isUpdating
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @desc    Search for Equity symbols specifically
 */
exports.searchEquitySymbols = async (req, res) => {
  const { query, exchange } = req.query;
  console.log(`[AngelController] SEARCH_EQUITY_SYMBOLS Request: Query=${query}, Exchange=${exchange}`);
  try {
    const results = await AngelOneService.searchEquitySymbols(query, exchange);
    res.status(200).json({ status: true, data: results });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @desc    Get LTP for an Equity token
 */
exports.getEquityLTP = async (req, res) => {
  const { token, exchange } = req.query;
  try {
    if (!token) {
      return res.status(400).json({ status: false, message: 'Token is required' });
    }
    const result = await AngelOneService.getEquityLTP(token, exchange || 'NSE');
    res.status(200).json({ status: true, data: result });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @desc    Get live prices for multiple tokens across exchanges
 */
exports.getLivePrices = async (req, res) => {
  const { exchangeTokens } = req.body;
  try {
    if (!exchangeTokens) {
      return res.status(400).json({ status: false, message: 'exchangeTokens is required' });
    }
    const result = await AngelOneService.getMultiQuotes(exchangeTokens, 'FULL');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
