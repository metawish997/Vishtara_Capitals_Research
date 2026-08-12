const express = require('express');
const router = express.Router();
const OptionChainController = require('../controllers/OptionChainController');

// Define route for fetching the pre-structured option chain data
router.get('/data', OptionChainController.getChainData);

module.exports = router;
