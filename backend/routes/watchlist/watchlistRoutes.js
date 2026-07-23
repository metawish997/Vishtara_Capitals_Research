const express = require('express');
const router = express.Router();
const {
  getWatchlists,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  getWatchlistScripts,
  addScriptToWatchlist,
  removeScriptFromWatchlist,
  searchScrips
} = require('../../controllers/watchlist/watchlistController');
const { protect } = require('../../middlewares/authMiddleware');

// Apply protection to all routes
router.use(protect);

// Search endpoint (Place BEFORE /:id to avoid collision)
router.get('/search', searchScrips);

// Watchlist CRUD
router.route('/')
  .get(getWatchlists)
  .post(createWatchlist);

router.route('/:id')
  .put(updateWatchlist)
  .delete(deleteWatchlist);

// Script Management
router.get('/:id/scripts', getWatchlistScripts);
router.post('/scripts', addScriptToWatchlist);
router.delete('/scripts/:id', removeScriptFromWatchlist);

module.exports = router;
