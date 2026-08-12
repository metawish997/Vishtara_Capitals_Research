const AngelScrip = require('../models/AngelScrip');
const AngelOneService = require('../services/angel/AngelOneService');
const dayjs = require('dayjs');

exports.getChainData = async (req, res) => {
    try {
        const symbol = (req.query.symbol || 'NIFTY').toUpperCase();
        let expiry = req.query.expiry;
        
        // Detect Exchange
        const isMcx = await AngelScrip.exists({
            name: symbol,
            exch_seg: 'MCX',
            instrumenttype: /^OPT/i
        });
        const exchange = isMcx ? 'MCX' : 'NFO';

        if (!expiry) {
            // Find nearest expiry chronologically (using Date parsing, not string sorting)
            const expiries = await AngelOneService.getExpiriesForSymbol(symbol, exchange, 'option');
            if (expiries && expiries.length > 0) {
                expiry = expiries[0];
            }
        }

        if (!expiry) {
            return res.status(404).json({ status: false, message: 'No options data found for this symbol' });
        }

        // Fetch all option scrips for this symbol and expiry
        const scrips = await AngelScrip.find({
            name: symbol,
            exch_seg: exchange,
            expiry: expiry,
            instrumenttype: /^OPT/i
        }).select('symbol token strike instrumenttype').lean();

        // Get Base LTP to center the chain
        let ltp = 0;
        try {
            if (exchange === 'MCX') {
                // MCX: get LTP from nearest futures contract chronologically
                const expiries = await AngelOneService.getExpiriesForSymbol(symbol, 'MCX', 'future');
                if (expiries && expiries.length > 0) {
                    const nearestExpiry = expiries[0];
                    const futureScrip = await AngelScrip.findOne({
                        name: symbol,
                        exch_seg: 'MCX',
                        instrumenttype: /^FUT/i,
                        expiry: nearestExpiry
                    }).lean();

                    if (futureScrip) {
                        const qRes = await AngelOneService.quote([futureScrip.token], 'FULL', 'MCX');
                        if (qRes && qRes.status && qRes.data) {
                            const fetched = Array.isArray(qRes.data.fetched) ? qRes.data.fetched : (Array.isArray(qRes.data) ? qRes.data : [qRes.data]);
                            if (fetched.length > 0 && fetched[0].ltp) {
                                ltp = parseFloat(fetched[0].ltp);
                            }
                        }
                    }
                }
            } else {
                // NSE/NFO: get LTP from cash equity
                const baseScrip = await AngelScrip.findOne({
                    name: symbol,
                    exch_seg: 'NSE',
                    $or: [{ expiry: null }, { expiry: '' }]
                }).lean();

                if (baseScrip) {
                    const qRes = await AngelOneService.quote([baseScrip.token], 'FULL', 'NSE');
                    if (qRes && qRes.status && qRes.data) {
                        const fetched = Array.isArray(qRes.data.fetched) ? qRes.data.fetched : (Array.isArray(qRes.data) ? qRes.data : [qRes.data]);
                        if (fetched.length > 0 && fetched[0].ltp) {
                            ltp = parseFloat(fetched[0].ltp);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('[OptionChainController] Failed to get base LTP', error.message);
        }

        // Group by strike
        const chain = {};
        for (const s of scrips) {
            // Angel One always provides strike prices multiplied by 100 (in paisa)
            let strike = parseFloat(s.strike) / 100;

            // Filter strikes: Only keep those within +/- 10% of ATM for better performance, if LTP is available
            if (ltp > 0) {
                const diff = Math.abs(strike - ltp) / ltp;
                if (diff > 0.10) continue;
            }

            if (!chain[strike]) {
                chain[strike] = { strike, CE: null, PE: null, is_atm: false };
            }

            // Ensure tradingSymbol is mapped as frontend expects it for Watchlist
            s.tradingSymbol = s.symbol;

            if (s.symbol.endsWith('CE')) {
                chain[strike].CE = s;
            } else {
                chain[strike].PE = s;
            }
        }

        // Sort by strike ascending
        let finalChain = Object.values(chain).sort((a, b) => a.strike - b.strike);

        // Mark ATM strike
        if (ltp > 0 && finalChain.length > 0) {
            let closestIndex = 0;
            let minDiff = 999999;
            finalChain.forEach((row, idx) => {
                const diff = Math.abs(row.strike - ltp);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = idx;
                }
            });
            finalChain[closestIndex].is_atm = true;
        }

        res.status(200).json({
            status: true,
            data: finalChain,
            expiry: expiry,
            symbol: symbol,
            ltp: ltp,
            exchange: exchange
        });
    } catch (error) {
        console.error('[OptionChainController] Error in getChainData:', error);
        res.status(500).json({ status: false, message: error.message });
    }
};
