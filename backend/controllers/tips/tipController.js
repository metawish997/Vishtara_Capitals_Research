const Tip = require('../../models/tips/Tip');
const TipCategory = require('../../models/tips/TipCategory');
const TipPlanAccess = require('../../models/tips/TipPlanAccess');
const UserSubscription = require('../../models/user/UserSubscription');
const Role = require('../../models/Role');
const AngelOneService = require('../../services/angel/AngelOneService');
const MasterNotification = require('../../models/notification/MasterNotification');

// --- Tip Category Controllers ---
exports.getTipCategories = async (req, res, next) => {
  try {
    const categories = await TipCategory.find();
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) { next(error); }
};

exports.createTipCategory = async (req, res, next) => {
  try {
    console.log('[TipController] Creating Category:', req.body);
    const category = await TipCategory.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
};

exports.updateTipCategory = async (req, res, next) => {
  try {
    console.log('[TipController] Updating Category:', req.params.id, req.body);
    const category = await TipCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, data: category });
  } catch (error) { next(error); }
};

exports.deleteTipCategory = async (req, res, next) => {
  try {
    const category = await TipCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    await category.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

// --- Tip Controllers ---
exports.getTips = async (req, res, next) => {
  try {
    const { search, status, date, month, year, trade_status, tip_type } = req.query;
    let query = {};

    if (search) {
      query.stock_name = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }
    if (trade_status) {
      query.trade_status = trade_status;
    }
    if (tip_type && tip_type !== 'all') {
      query.tip_type = tip_type;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.createdAt = { $gte: start, $lt: end };
    } else if (month || year) {
      const now = new Date();
      const y = year ? parseInt(year) : now.getFullYear();
      const m = month ? parseInt(month) - 1 : 0;
      const start = new Date(y, m, 1);
      const end = month ? new Date(y, m + 1, 1) : new Date(y + 1, 0, 1);
      query.createdAt = { $gte: start, $lt: end };
    }

    const pageNum = parseInt(req.query.page, 10);
    const limitNum = parseInt(req.query.limit, 10);

    let dbQuery = Tip.find(query)
      .sort('-createdAt')
      .populate('category', 'name')
      .populate('created_by', 'name');

    if (pageNum && limitNum) {
      const skip = (pageNum - 1) * limitNum;
      dbQuery = dbQuery.skip(skip).limit(limitNum);
    }

    let tips = await dbQuery;
    const totalCount = await Tip.countDocuments(query);

    // Fetch plan access for all tips
    const tipIds = tips.map(t => t._id);
    const planAccess = await TipPlanAccess.find({ tip: { $in: tipIds } });

    // Check user subscriptions (Demo and Paid)
    let isDemoUser = false;
    let userActivePlanIds = [];
    if (req.user && req.user.id) {
      const UserSubscription = require('../../models/user/UserSubscription');
      const userSubs = await UserSubscription.find({
        user: req.user.id,
        end_date: { $gte: new Date() }
      });

      isDemoUser = userSubs.some(s => s.payment_gateway === 'demo' || s.status === 'demo');
      userActivePlanIds = userSubs
        .filter(s => s.status === 'active' && s.service_plan)
        .map(s => s.service_plan.toString());
    }

    // Map plan access to tips
    const processedTips = tips.map(tip => {
      let allowedPlans = planAccess
        .filter(pa => pa.tip.toString() === tip._id.toString())
        .map(pa => pa.service_plan);

      let isUnlockedForUser = false;

      if (allowedPlans.length === 0) {
        isUnlockedForUser = true; // Public tip
      } else if (isDemoUser) {
        isUnlockedForUser = true; // Demo unlocks all
      } else {
        // Unlocked if user has a purchased plan matching the tip's allowed plans
        isUnlockedForUser = allowedPlans.some(planId => userActivePlanIds.includes(planId.toString()));
      }

      const tipObj = tip.toObject();
      tipObj.allowed_plans = allowedPlans; // This is used by frontend checkAccess
      tipObj.is_locked = !isUnlockedForUser;
      return tipObj;
    });

    const responsePayload = { success: true, count: processedTips.length, data: processedTips };
    if (pageNum && limitNum) {
      responsePayload.pagination = {
        total: totalCount,
        page: pageNum,
        pages: Math.ceil(totalCount / limitNum),
        hasMore: (pageNum * limitNum) < totalCount
      };
    }
    res.status(200).json(responsePayload);
  } catch (error) { next(error); }
};

// --- Notification Helpers ---
const getEligibleUsersForTip = async (tipId, servicePlans) => {
  const User = require('../../models/User');
  const UserSubscription = require('../../models/user/UserSubscription');
  const Role = require('../../models/Role');
  const TipPlanAccess = require('../../models/tips/TipPlanAccess');

  let planIds = servicePlans;
  if (!planIds || planIds.length === 0) {
     const accessList = await TipPlanAccess.find({ tip: tipId });
     planIds = accessList.map(a => a.service_plan);
  }

  // If still no plans, it's public. Return null to indicate global.
  if (!planIds || planIds.length === 0) return null;

  const currentDate = new Date();
  
  // 1. Users with active subscription for these plans
  const activeSubs = await UserSubscription.find({
    status: 'active',
    end_date: { $gte: currentDate },
    service_plan: { $in: planIds }
  }).select('user');
  
  // 2. Demo users
  const demoSubs = await UserSubscription.find({
    end_date: { $gte: currentDate },
    $or: [
      { status: 'demo' },
      { payment_gateway: 'demo' }
    ]
  }).select('user');
  
  // 3. Super-admins
  const superAdminRole = await Role.findOne({ slug: 'super-admin' });
  let adminUsers = [];
  if (superAdminRole) {
    adminUsers = await User.find({ role: superAdminRole._id }).select('_id');
  }

  // Merge and unique user IDs
  const userIds = new Set([
    ...activeSubs.map(sub => sub.user.toString()),
    ...demoSubs.map(sub => sub.user.toString()),
    ...adminUsers.map(u => u._id.toString())
  ]);

  return Array.from(userIds);
};

const createTargetedNotification = async (notificationData, tipId, servicePlans) => {
  try {
    const eligibleUsers = await getEligibleUsersForTip(tipId, servicePlans);
    
    if (eligibleUsers === null) {
      // Public tip
      await MasterNotification.create({
        ...notificationData,
        is_global: true
      });
    } else if (eligibleUsers.length > 0) {
      const notificationsToInsert = eligibleUsers.map(userId => ({
        ...notificationData,
        is_global: false,
        user: userId
      }));
      await MasterNotification.insertMany(notificationsToInsert);
    }
  } catch (error) {
    console.error('[TipController] Error creating targeted notification:', error);
  }
};

exports.createTip = async (req, res, next) => {
  try {
    req.body.created_by = req.user.id;

    // Clean empty strings for numeric/date fields to avoid validation errors
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === '') {
        delete req.body[key];
      }
    });

    // --- Entry Status Logic ---
    if (req.body.cmp_price != null && req.body.entry_price != null && req.body.call_type) {
      const cmp = Number(req.body.cmp_price);
      const entry = Number(req.body.entry_price);
      const callType = req.body.call_type.toLowerCase();

      if (['buy', 'long'].includes(callType)) {
        req.body.status = cmp >= entry ? 'Active' : 'Wait for Entry';
      } else if (['sell', 'short'].includes(callType)) {
        req.body.status = cmp <= entry ? 'Active' : 'Wait for Entry';
      }
    }
    // --------------------------

    // Automate finding proper stock info if not provided
    if (req.body.stock_name && (!req.body.symbol_token || !req.body.exchange)) {
      console.log(`[TipController] Finding token for: ${req.body.stock_name}`);
      const scrip = await AngelOneService.findScripToken(
        req.body.stock_name,
        req.body.exchange || 'NSE',
        req.body.expiry_date,
        req.body.tip_type,
        req.body.strike_price,
        req.body.option_type
      );
      if (scrip) {
        req.body.symbol_token = scrip.token;
        req.body.exchange = scrip.exch_seg;
        req.body.stock_name = scrip.symbol; // Use formal symbol name
        console.log(`[TipController] Found: ${scrip.symbol} (${scrip.token}) on ${scrip.exch_seg}`);
      }
    }

    const tip = await Tip.create(req.body);

    // Handle plan access if provided
    if (req.body.service_plans && Array.isArray(req.body.service_plans)) {
      const accessData = req.body.service_plans.map(planId => ({
        tip: tip._id,
        service_plan: planId
      }));
      await TipPlanAccess.insertMany(accessData);
    }

    // Create targeted notification for new tip creation
    await createTargetedNotification({
      type: 'tip',
      severity: 'info',
      title: `New ${tip.tip_type === 'equity' ? 'Equity' : 'F&O'} Tip: ${tip.stock_name}`,
      message: `${(tip.call_type || 'NEW').toUpperCase()} ${tip.stock_name} at ₹${tip.entry_price}. Targets: ₹${tip.target_price}${tip.target_price_2 ? `, ₹${tip.target_price_2}` : ''}`,
      data: { tipId: String(tip._id) }
    }, tip._id, req.body.service_plans);

    if (req.app.get('io')) {
      req.app.get('io').emit('tip_refresh');
      req.app.get('io').emit('notification_refresh');
    }
    res.status(201).json({ success: true, data: tip });
  } catch (error) { next(error); }
};

exports.updateTip = async (req, res, next) => {
  try {
    const tip = await Tip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!tip) return res.status(404).json({ success: false, message: 'Tip not found' });

    if (req.body.trade_status === 'Closed' && !tip.exit_at) {
      tip.exit_at = Date.now();
      await tip.save();
    }

    // Update plan access if provided
    if (req.body.service_plans && Array.isArray(req.body.service_plans)) {
      // Clear existing access
      await TipPlanAccess.deleteMany({ tip: tip._id });

      // Add new access
      const accessData = req.body.service_plans.map(planId => ({
        tip: tip._id,
        service_plan: planId
      }));
      await TipPlanAccess.insertMany(accessData);
    }

    if (req.app.get('io')) {
      req.app.get('io').emit('tip_refresh');
      req.app.get('io').emit('notification_refresh');
    }
    res.status(200).json({ success: true, data: tip });
  } catch (error) { next(error); }
};

exports.deleteTip = async (req, res, next) => {
  try {
    const tip = await Tip.findById(req.params.id);
    if (!tip) return res.status(404).json({ success: false, message: 'Tip not found' });

    // Delete associated plan access
    await TipPlanAccess.deleteMany({ tip: tip._id });
    await tip.deleteOne();

    if (req.app.get('io')) {
      req.app.get('io').emit('tip_refresh');
      req.app.get('io').emit('notification_refresh');
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.updateLiveStatus = async (req, res, next) => {
  try {
    const { status, cmp_price } = req.body;
    const tip = await Tip.findById(req.params.id);

    if (!tip) return res.status(404).json({ success: false, message: 'Tip not found' });

    if (tip.trade_status === 'Closed') {
      return res.status(200).json({
        success: true,
        message: 'Trade is closed. No updates allowed.',
        new_status: tip.status,
        trade_status: 'Closed'
      });
    }

    const oldStatus = tip.status;
    let newStatus = status || oldStatus;
    
    // Normalize casing to match ENUM
    if (newStatus && newStatus.toLowerCase() === 'active') newStatus = 'Active';
    if (newStatus && newStatus.toLowerCase() === 'wait for entry') newStatus = 'Wait for Entry';

    let tradeStatus = 'Open';

    // --- Auto-Activate Logic ---
    if (oldStatus === 'Wait for Entry' && cmp_price != null) {
      const cmp = Number(cmp_price);
      const entry = Number(tip.entry_price);
      const callType = (tip.call_type || '').toLowerCase();

      if (['buy', 'long'].includes(callType) && cmp >= entry) {
        newStatus = 'Active';
      } else if (['sell', 'short'].includes(callType) && cmp <= entry) {
        newStatus = 'Active';
      }
    }

    // Do not overwrite achieved statuses with "Active" or "Wait for Entry"
    const achievedStatuses = ['T1-Achieved', 'T2-Achieved', 'SL-Hit', 'Early-Exit', 'Closed', 'Cancelled'];
    if (achievedStatuses.includes(oldStatus)) {
      if (['Active', 'Wait for Entry'].includes(newStatus)) {
        newStatus = oldStatus;
      }
    }

    // Prevent SL from triggering prematurely
    if (oldStatus === 'Wait for Entry' && newStatus === 'SL-Hit') {
      newStatus = 'Wait for Entry';
    }

    // Business Logic: If SL-Hit but T1 was already achieved, just close the trade as successful at T1 level
    if (newStatus === 'SL-Hit') {
      if (oldStatus === 'T1-Achieved') {
        newStatus = 'T1-Achieved';
        tradeStatus = 'Closed';
      } else {
        tradeStatus = 'Closed';
      }
    } else if (newStatus === 'T2-Achieved') {
      tradeStatus = 'Closed';
    } else if (newStatus === 'T1-Achieved') {
      tradeStatus = (!tip.target_price_2 || tip.target_price_2 === 0) ? 'Closed' : 'Open';
    } else if (newStatus === 'Early-Exit') {
      tradeStatus = 'Closed';
    }

    const updateData = {
      status: newStatus,
      trade_status: tradeStatus,
      cmp_price: cmp_price,
    };

    if (newStatus === 'T1-Achieved' && oldStatus !== 'T1-Achieved') {
      updateData.t1_achieved_at = Date.now();
    }

    if (oldStatus !== newStatus) {
      updateData.admin_note = (tip.admin_note || '') + `\n[System]: Status changed from ${oldStatus} to ${newStatus} at price ₹${cmp_price}`;
    }

    if (tradeStatus === 'Closed') {
      updateData.exit_price = cmp_price;
      // If closing at SL-Hit but keeping T1 status, backtrack the exit time to when T1 was hit
      if (newStatus === 'T1-Achieved' && status === 'SL-Hit') {
        updateData.exit_at = tip.t1_achieved_at || Date.now();
      } else {
        updateData.exit_at = Date.now();
      }
    }

    await tip.updateOne(updateData);

    // Determine notification content based on status/price changes
    let notificationTitle = '';
    let notificationMessage = '';
    let severity = 'info';

    if (oldStatus === 'Wait for Entry' && newStatus === 'Active') {
      notificationTitle = `Tip Active: ${tip.stock_name}`;
      notificationMessage = `Entry price reached. ${tip.stock_name} is now active at ₹${cmp_price || tip.cmp_price}.`;
      severity = 'success';
    } else if (newStatus === 'T1-Achieved' && oldStatus !== 'T1-Achieved') {
      notificationTitle = `Target 1 Achieved: ${tip.stock_name}`;
      notificationMessage = `${tip.stock_name} has hit Target 1 at ₹${cmp_price}!`;
      severity = 'success';
    } else if (newStatus === 'T2-Achieved' && oldStatus !== 'T2-Achieved') {
      notificationTitle = `Target 2 Achieved: ${tip.stock_name}`;
      notificationMessage = `${tip.stock_name} has hit Target 2 at ₹${cmp_price}!`;
      severity = 'success';
    } else if (newStatus === 'SL-Hit' && oldStatus !== 'SL-Hit') {
      notificationTitle = `Stop Loss Hit: ${tip.stock_name}`;
      notificationMessage = `${tip.stock_name} has hit Stop Loss at ₹${cmp_price}.`;
      severity = 'warning';
    } else if (cmp_price && cmp_price !== tip.cmp_price) {
      notificationTitle = `Price Update: ${tip.stock_name}`;
      notificationMessage = `${tip.stock_name} is currently trading at ₹${cmp_price}.`;
      severity = 'info';
    }

    if (notificationTitle) {
      await createTargetedNotification({
        type: 'tip',
        severity: severity,
        title: notificationTitle,
        message: notificationMessage,
        data: { tipId: String(tip._id) }
      }, tip._id);
    }

    if (req.app.get('io')) {
      req.app.get('io').emit('tip_refresh');
      req.app.get('io').emit('notification_refresh');
    }
    res.status(200).json({
      success: true,
      message: 'Live status updated successfully',
      new_status: newStatus,
      trade_status: tradeStatus
    });
  } catch (error) { next(error); }
};

exports.manualClose = async (req, res, next) => {
  try {
    const { exit_price, admin_note } = req.body;
    const tip = await Tip.findById(req.params.id);

    if (!tip) return res.status(404).json({ success: false, message: 'Tip not found' });

    if (tip.trade_status === 'Closed') {
      return res.status(422).json({ success: false, message: 'Trade is already closed.' });
    }

    await tip.updateOne({
      status: 'Early-Exit',
      trade_status: 'Closed',
      exit_price: exit_price,
      exit_at: Date.now(),
      admin_note: (tip.admin_note || '') + `\n[Manual Exit]: Closed at ₹${exit_price}. ` + (admin_note || '')
    });

    await createTargetedNotification({
      type: 'tip',
      severity: 'warning',
      title: `Early Exit: ${tip.stock_name}`,
      message: `Trade for ${tip.stock_name} has been closed early at ₹${exit_price}.`,
      data: { tipId: String(tip._id) }
    }, tip._id);

    if (req.app.get('io')) {
      req.app.get('io').emit('tip_refresh');
      req.app.get('io').emit('notification_refresh');
    }
    res.status(200).json({
      success: true,
      message: 'Trade closed manually at ₹' + exit_price
    });
  } catch (error) { next(error); }
};

exports.storeFollowUp = async (req, res, next) => {
  try {
    const { target_price, target_price_2, stop_loss, message } = req.body;
    const tip = await Tip.findById(req.params.id);

    if (!tip) return res.status(404).json({ success: false, message: 'Tip not found' });

    const newEntry = {
      date: new Date().toISOString(),
      message: message,
      old_values: {
        target_price: tip.target_price,
        target_price_2: tip.target_price_2,
        stop_loss: tip.stop_loss,
      },
      new_values: {
        target_price: target_price,
        target_price_2: target_price_2,
        stop_loss: stop_loss,
      }
    };

    const currentFollowups = tip.followups || [];
    currentFollowups.unshift(newEntry);

    await tip.updateOne({
      target_price: target_price,
      target_price_2: target_price_2,
      stop_loss: stop_loss,
      followups: currentFollowups
    });

    res.status(200).json({
      success: true,
      message: 'Follow-up added successfully'
    });
  } catch (error) { next(error); }
};

exports.getAccuracyDashboard = async (req, res, next) => {
  try {
    const { tip_type, category_id, from_date, to_date, page = 1 } = req.query;
    let query = { status: { $ne: 'archived' } };

    if (tip_type && tip_type !== 'all') query.tip_type = tip_type;
    if (category_id) query.category = category_id;

    if (from_date || to_date) {
      query.createdAt = {};
      if (from_date) query.createdAt.$gte = new Date(from_date);
      if (to_date) {
        const end = new Date(to_date);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const limit = 15;
    const skip = (parseInt(page) - 1) * limit;

    // Stats
    const totalTrades = await Tip.countDocuments(query);
    const closedTrades = await Tip.countDocuments({ ...query, trade_status: 'Closed' });
    const t1Hits = await Tip.countDocuments({ ...query, status: 'T1-Achieved' });
    const t2Hits = await Tip.countDocuments({ ...query, status: 'T2-Achieved' });
    const slHits = await Tip.countDocuments({ ...query, status: 'SL-Hit' });

    const wins = t1Hits + t2Hits;
    const accuracy = (wins + slHits) > 0 ? parseFloat(((wins / (wins + slHits)) * 100).toFixed(2)) : 0;

    // Growth Rate (Last Month Comparison)
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    lastMonthStart.setHours(0, 0, 0, 0);

    const lastMonthEnd = new Date(lastMonthStart);
    lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1);

    const lastMonthWins = await Tip.countDocuments({
      trade_status: 'Closed',
      status: { $in: ['T1-Achieved', 'T2-Achieved'] },
      createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd }
    });
    const lastMonthLosses = await Tip.countDocuments({
      status: 'SL-Hit',
      createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd }
    });

    const lastMonthAccuracy = (lastMonthWins + lastMonthLosses) > 0
      ? parseFloat(((lastMonthWins / (lastMonthWins + lastMonthLosses)) * 100).toFixed(2)) : 0;

    const growthRate = parseFloat((accuracy - lastMonthAccuracy).toFixed(2));

    // List
    const tipsList = await Tip.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('category', 'name');

    const totalPages = Math.ceil(totalTrades / limit);

    res.status(200).json({
      success: true,
      data: {
        accuracy,
        totalTrades,
        closedTrades,
        t1Hits,
        t2Hits,
        slHits,
        growthRate,
        lastMonthAccuracy,
        tipsList,
        pagination: {
          total: totalTrades,
          page: parseInt(page),
          pages: totalPages
        }
      }
    });
  } catch (error) { next(error); }
};

exports.getTipById = async (req, res, next) => {
  try {
    const tip = await Tip.findById(req.params.id)
      .populate('category', 'name')
      .populate('created_by', 'name');
    if (!tip) {
      return res.status(404).json({ success: false, message: 'Tip not found' });
    }
    
    // Include allowed_plans for admin view context
    const TipPlanAccess = require('../../models/tips/TipPlanAccess');
    const planAccess = await TipPlanAccess.find({ tip: tip._id }).populate('service_plan', 'name');
    
    const tipObj = tip.toObject();
    tipObj.allowed_plans = planAccess.map(pa => pa.service_plan);
    
    res.status(200).json({ success: true, data: tipObj });
  } catch (error) { next(error); }
};

exports.addAdminNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    if (!note) {
      return res.status(400).json({ success: false, message: 'Note is required' });
    }
    
    const tip = await Tip.findById(req.params.id);
    if (!tip) {
      return res.status(404).json({ success: false, message: 'Tip not found' });
    }
    
    tip.admin_notes.push({ note, date: Date.now() });
    await tip.save();
    
    res.status(200).json({ success: true, data: tip });
  } catch (error) { next(error); }
};
