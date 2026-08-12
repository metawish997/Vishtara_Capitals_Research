const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  getHistory,
  getQuote,
  getGainersLosers,
  searchSymbols,
  findToken,
  getIndices,
  getMarquee,
  getWsToken,
  syncScrips,
  getSyncStatus,
  getExpiries,
  getStrikes,
  fetch52WeekData,
  searchEquitySymbols,
  getEquityLTP,
  getLivePrices,
  getTopGainers,
  getTopLosers
} = require('../controllers/angel/AngelController');

router.post('/login', login);
router.post('/logout', logout);
router.get('/history', getHistory);
router.post('/quote', getQuote);
router.get('/gainers-losers', getGainersLosers);
router.get('/search', searchSymbols);
router.get('/find-token', findToken);
router.get('/indices', getIndices);
router.get('/marquee', getMarquee);
router.get('/ws-token', getWsToken);
router.post('/sync-scrips', syncScrips);
router.get('/sync-status', getSyncStatus);
router.get('/expiries', getExpiries);
router.get('/get-strikes', getStrikes);
router.get('/52-week-data', fetch52WeekData);
router.get('/equity/search', searchEquitySymbols);
router.get('/equity/ltp', getEquityLTP);
router.post('/live-prices', getLivePrices);
router.get('/top-gainers', getTopGainers);
router.get('/top-losers', getTopLosers);

module.exports = router;
