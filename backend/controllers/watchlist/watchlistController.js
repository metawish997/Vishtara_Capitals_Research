const Watchlist = require('../../models/watchlist/Watchlist');
const WatchlistScript = require('../../models/watchlist/WatchlistScript');
const AngelScrip = require('../../models/AngelScrip');

// @desc    Get all watchlists for logged in user
// @route   GET /api/v1/user/watchlists
// @access  Private
exports.getWatchlists = async (req, res, next) => {
  try {
    const watchlists = await Watchlist.find({ user: req.user.id });
    res.status(200).json({ success: true, count: watchlists.length, data: watchlists });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new watchlist
// @route   POST /api/v1/user/watchlists
// @access  Private
exports.createWatchlist = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const watchlist = await Watchlist.create(req.body);
    res.status(201).json({ success: true, data: watchlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Update/Rename watchlist
// @route   PUT /api/v1/user/watchlists/:id
// @access  Private
exports.updateWatchlist = async (req, res, next) => {
  try {
    let watchlist = await Watchlist.findById(req.params.id);
    if (!watchlist) return res.status(404).json({ success: false, message: 'Watchlist not found' });
    if (watchlist.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

    watchlist = await Watchlist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: watchlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete watchlist
// @route   DELETE /api/v1/user/watchlists/:id
// @access  Private
exports.deleteWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.findById(req.params.id);
    if (!watchlist) return res.status(404).json({ success: false, message: 'Watchlist not found' });
    if (watchlist.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

    // Cascade delete scripts
    await WatchlistScript.deleteMany({ watchlist: watchlist._id });
    await watchlist.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scripts for a specific watchlist
// @route   GET /api/v1/user/watchlists/:id/scripts
// @access  Private
exports.getWatchlistScripts = async (req, res, next) => {
  try {
    const scripts = await WatchlistScript.find({ watchlist: req.params.id });
    res.status(200).json({ success: true, count: scripts.length, data: scripts });
  } catch (error) {
    next(error);
  }
};

// @desc    Add script to watchlist
// @route   POST /api/v1/user/watchlists/scripts
// @access  Private
exports.addScriptToWatchlist = async (req, res, next) => {
  try {
    const { watchlist, symbol, trading_symbol, token, exchange, expiry, instrumenttype } = req.body;

    // Check if script already exists in this watchlist
    const existing = await WatchlistScript.findOne({ watchlist, token });
    if (existing) return res.status(400).json({ success: false, message: 'Symbol already in watchlist' });

    const script = await WatchlistScript.create({
      watchlist,
      symbol,
      trading_symbol,
      token,
      exchange,
      expiry,
      instrumenttype
    });

    res.status(201).json({ success: true, data: script });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove script from watchlist
// @route   DELETE /api/v1/user/watchlists/scripts/:id
// @access  Private
exports.removeScriptFromWatchlist = async (req, res, next) => {
  try {
    const script = await WatchlistScript.findById(req.params.id);
    if (!script) return res.status(404).json({ success: false, message: 'Script not found' });

    await script.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Search for scrips to add to watchlist
// @route   GET /api/v1/user/watchlists/search
// @access  Private
exports.searchScrips = async (req, res, next) => {
  try {
    const { query, filter = 'All' } = req.query;

    if (!query) return res.status(200).json({ success: true, data: [] });

    const baseFilter = {
      $or: [
        { symbol: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    };

    if (filter === 'MCX') {
      baseFilter.exch_seg = 'MCX';
    } else if (filter === 'NSE') {
      baseFilter.exch_seg = { $in: ['NSE', 'NFO'] };
    }

    const equities = await AngelScrip.find({
      ...baseFilter,
      instrumenttype: { $not: /(OPT|FUT)/i },
      exch_seg: { $ne: 'MCX' } // Hide MCX Equities
    })
      .sort({ instrumenttype: 1 })
      .limit(10);

    const futures = await AngelScrip.find({
      ...baseFilter,
      $and: [
        { instrumenttype: /FUT/i },
        { instrumenttype: { $not: /OPT/i } }
      ]
    })
      .sort({ expiry: 1 })
      .limit(40);

    const optScrips = await AngelScrip.aggregate([
      {
        $match: {
          ...baseFilter,
          instrumenttype: /OPT/i
        }
      },
      {
        $group: {
          _id: "$name",
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" }
      },
      {
        $limit: 20
      }
    ]);

    const scrips = [...equities, ...futures, ...optScrips];

    res.status(200).json({ success: true, data: scrips });
  } catch (error) {
    next(error);
  }
};
