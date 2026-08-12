const axios = require('axios');

// @desc    Get all stocks (mock data for now)
// @route   GET /api/v1/stocks
// @access  Public
const getStocks = async (req, res, next) => {
  try {
    const stocks = [
      { id: 1, name: 'Apple Inc.', symbol: 'AAPL', sector: 'Technology' },
      { id: 2, name: 'Microsoft Corp.', symbol: 'MSFT', sector: 'Technology' },
      { id: 3, name: 'Amazon.com Inc.', symbol: 'AMZN', sector: 'Consumer Cyclical' },
      { id: 4, name: 'Google LLC', symbol: 'GOOGL', sector: 'Communication Services' },
      { id: 5, name: 'Tesla Inc.', symbol: 'TSLA', sector: 'Consumer Cyclical' },
    ];

    res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single stock by symbol
// @route   GET /api/v1/stocks/:symbol
// @access  Public
const getStockById = async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    // This would typically come from a DB
    const stock = {
      symbol,
      name: symbol === 'AAPL' ? 'Apple Inc.' : 'Unknown Stock',
      sector: 'General',
    };

    res.status(200).json({
      success: true,
      data: stock,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get real-time quote for a stock
// @route   GET /api/v1/stocks/quote/:symbol
// @access  Public
const getRealTimeQuote = async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      // Return dummy data if no API key
      return res.status(200).json({
        success: true,
        data: {
          symbol,
          price: (Math.random() * 200 + 100).toFixed(2),
          change: (Math.random() * 5 - 2.5).toFixed(2),
          percentChange: (Math.random() * 2 - 1).toFixed(2),
          high: 155.0,
          low: 149.5,
          open: 151.2,
          previousClose: 150.8,
        },
        note: "Dummy data. Please set FINNHUB_API_KEY in .env for real data."
      });
    }

    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );

    res.status(200).json({
      success: true,
      data: {
        symbol,
        price: response.data.c,
        change: response.data.d,
        percentChange: response.data.dp,
        high: response.data.h,
        low: response.data.l,
        open: response.data.o,
        previousClose: response.data.pc,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStocks,
  getStockById,
  getRealTimeQuote,
};
