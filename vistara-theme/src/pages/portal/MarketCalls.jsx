import React, { useState, useEffect } from "react";
import tipService from "../../services/tipService";
import agreementService from "../../services/agreementService";
import angelService from "../../services/angelService";
import socket from "../../services/socketService";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import PortalStockCard from "./PortalStockCard";

export default function MarketCalls() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [marketCalls, setMarketCalls] = useState([]);
  const [activePlanIds, setActivePlanIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const todayStr = new Date().toISOString().split('T')[0];
      const [subRes, openTipsRes, highlightsRes] = await Promise.all([
        agreementService.getAccountServices().catch(e => ({ success: false })),
        tipService.getTips({ trade_status: 'Open' }).catch(e => ({ success: false })),
        tipService.getTips({ date: todayStr }).catch(e => ({ success: false }))
      ]);

      if (subRes.success && subRes.subscriptions) {
        const now = new Date();
        const validPlans = subRes.subscriptions
          .filter(s => {
            const status = (s.status || '').toLowerCase();
            const startDate = s.start_date ? new Date(s.start_date) : null;
            const endDate = s.end_date ? new Date(s.end_date) : null;
            if (status !== 'active') return false;
            if (startDate && now < startDate) return false;
            if (endDate && now > endDate) return false;
            return true;
          })
          .map(s => {
            const plan = s.service_plan?._id || s.service_plan;
            return plan ? plan.toString() : null;
          })
          .filter(id => id !== null);
        setActivePlanIds(validPlans);
      }

      let allTips = [];
      if (openTipsRes && openTipsRes.success) {
        allTips = [...(Array.isArray(openTipsRes.data) ? openTipsRes.data : [])];
      }
      if (highlightsRes && highlightsRes.success) {
        const hData = Array.isArray(highlightsRes.data) ? highlightsRes.data : [];
        hData.forEach(h => {
          if (!allTips.find(t => String(t._id || t.id) === String(h._id || h.id))) {
            allTips.push(h);
          }
        });
      }
      
      if (filter === 'closed' || filter === 'all') {
        const closedRes = await tipService.getTips({ trade_status: 'Closed', page: 1, limit: 12 }).catch(e => ({ success: false }));
        if (closedRes && closedRes.success) {
           const fetchedTips = Array.isArray(closedRes.data) ? closedRes.data : [];
           fetchedTips.forEach(tip => {
               if (!allTips.find(t => String(t._id || t.id) === String(tip._id || tip.id))) {
                   allTips.push(tip);
               }
           });
        }
      }

      setMarketCalls(allTips);
    } catch (error) {
      console.error("Failed to load Market Calls:", error);
      if (!silent) toast.error("Network error.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line
  }, [filter]);

  useEffect(() => {
    const handleTipRefresh = () => fetchInitialData(true);
    socket.on('tip_refresh', handleTipRefresh);
    return () => socket.off('tip_refresh', handleTipRefresh);
    // eslint-disable-next-line
  }, [filter]);

  useEffect(() => {
    if (marketCalls.length === 0) return;
    const openTips = marketCalls.filter(t => (t.trade_status || 'Open').toLowerCase() === 'open' && t.symbol_token);
    if (openTips.length === 0) return;

    const grouped = openTips.reduce((acc, tip) => {
        const exch = tip.exchange || 'NSE';
        if (!acc[exch]) acc[exch] = [];
        acc[exch].push(tip.symbol_token);
        return acc;
    }, {});

    const fetchInitialPrices = async () => {
        try {
            let allFetched = [];
            for (const [exch, tokens] of Object.entries(grouped)) {
                const res = await angelService.getQuote(tokens, 'FULL', exch);
                if (res.status && res.data) {
                    const fetched = res.data.fetched || (Array.isArray(res.data) ? res.data : [res.data]);
                    allFetched = allFetched.concat(fetched);
                }
            }
            if (allFetched.length > 0) {
                const priceMap = {};
                allFetched.forEach(q => priceMap[q.symbolToken] = parseFloat(q.ltp));
                setMarketCalls(prev => prev.map(tip => {
                    const newPrice = priceMap[tip.symbol_token];
                    return newPrice !== undefined ? { ...tip, cmp_price: newPrice } : tip;
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    fetchInitialPrices();
    socket.emit('subscribe', grouped);

    const handlePriceUpdate = (quoteData) => {
        if (!quoteData || !quoteData.token) return;
        setMarketCalls(prev => {
            const isPresent = prev.some(t => t.symbol_token === quoteData.token);
            if (!isPresent) return prev;
            return prev.map(tip => tip.symbol_token === quoteData.token ? { ...tip, cmp_price: quoteData.ltp } : tip);
        });
    };

    socket.on('price', handlePriceUpdate);
    return () => {
        socket.off('price', handlePriceUpdate);
        socket.emit('unsubscribe', grouped);
    };
  }, [marketCalls.length]);

  const checkAccess = (call) => {
      if (user && user.role === 'super admin') return true;
      if (!call.allowed_plans || call.allowed_plans.length === 0) return true;
      if (activePlanIds.length === 0) return false;
      return call.allowed_plans.some(planId => {
          const pId = typeof planId === 'object' ? (planId._id || planId.id) : planId;
          return activePlanIds.includes(pId?.toString());
      });
  };

  const formatStockName = (call) => {
      let name = call.stock_name || 'N/A';
      if (call.tip_type === 'option' || call.tip_type === 'future') {
          // Remove Angel One format like 28JUL24300CE
          name = name.replace(/[0-9]{2}[A-Za-z]{3}.*$/i, '');
      }
      return name;
  };

  const formatDate = (dateStr) => {
      if (!dateStr) return 'N/A';
      return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filteredCalls = marketCalls.filter(c => {
      const ts = (c.trade_status || 'Open').toLowerCase();
      if (filter === 'active') return ts === 'open';
      if (filter === 'closed') return ts === 'closed';
      return true;
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: "var(--primary)", fontWeight: "800", marginBottom: "5px", letterSpacing: "-0.5px" }}>Market Calls &amp; Alerts</h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>Real-time recommendations for Equities, Futures, &amp; Options segment.</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["all", "active", "closed"].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                backgroundColor: filter === opt ? "#011D52" : "#ffffff",
                color: filter === opt ? "#ffffff" : "#475569",
                fontWeight: "700",
                fontSize: "12px",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.2s"
              }}
            >
              {opt} Calls
            </button>
          ))}
        </div>
      </div>

      {loading && marketCalls.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
              <p style={{ fontWeight: "700", fontSize: "14px" }}>Loading Market Calls...</p>
          </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "24px", width: "100%" }}>
          {filteredCalls.length > 0 ? filteredCalls.map((item, idx) => {
            const hasAccess = checkAccess(item);
            return (
              <PortalStockCard 
                  key={item._id || item.id || idx}
                  item={item}
                  formatStockName={formatStockName}
                  formatDate={formatDate}
                  hasAccess={hasAccess}
              />
            );
          }) : (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1", gridColumn: "1 / -1" }}>
              <p style={{ fontWeight: "700", fontSize: "14px", margin: 0 }}>No market calls found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
