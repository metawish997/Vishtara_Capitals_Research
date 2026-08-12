const Watchlist = require('../../models/user/Watchlist');
const WatchlistScript = require('../../models/user/WatchlistScript');

// --- Watchlist Controllers ---
exports.getWatchlists = async (req, res, next) => {
  try {
    const watchlists = await Watchlist.find({ user: req.user.id });
    res.status(200).json({ success: true, count: watchlists.length, data: watchlists });
  } catch (error) { next(error); }
};

exports.createWatchlist = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const watchlist = await Watchlist.create(req.body);
    res.status(201).json({ success: true, data: watchlist });
  } catch (error) { next(error); }
};

// --- Watchlist Script Controllers ---
exports.getWatchlistScripts = async (req, res, next) => {
  try {
    const scripts = await WatchlistScript.find({ watchlist: req.params.watchlistId });
    res.status(200).json({ success: true, count: scripts.length, data: scripts });
  } catch (error) { next(error); }
};

exports.addScriptToWatchlist = async (req, res, next) => {
  try {
    const script = await WatchlistScript.create(req.body);
    res.status(201).json({ success: true, data: script });
  } catch (error) { next(error); }
};

exports.removeScriptFromWatchlist = async (req, res, next) => {
  try {
    const script = await WatchlistScript.findById(req.params.id);
    if (!script) return res.status(404).json({ success: false, message: 'Script not found' });
    await script.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.deleteWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.findById(req.params.id);
    if (!watchlist) return res.status(404).json({ success: false, message: 'Watchlist not found' });

    // Cascading delete scripts
    await WatchlistScript.deleteMany({ watchlist: watchlist._id });
    await watchlist.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
