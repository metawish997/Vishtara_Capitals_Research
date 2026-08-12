const express = require('express');
const router = express.Router();
const {
  getWatchlists,
  createWatchlist,
  getWatchlistScripts,
  addScriptToWatchlist,
  removeScriptFromWatchlist,
  deleteWatchlist
} = require('../../controllers/user/watchlistController');

// Watchlist Routes
router.route('/')
  .get(getWatchlists)
  .post(createWatchlist);

router.route('/:id')
  .delete(deleteWatchlist);

// Watchlist Script Routes
router.get('/:watchlistId/scripts', getWatchlistScripts);
router.post('/scripts', addScriptToWatchlist);
router.delete('/scripts/:id', removeScriptFromWatchlist);

module.exports = router;
