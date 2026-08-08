const fs = require('fs');

// Patch market-calls.tsx
const pathMC = './app/(tabs)/market-calls.tsx';
let contentMC = fs.readFileSync(pathMC, 'utf8');

const targetMC = "if (Object.keys(tokensByExchange).length > 0) {\\n      socket.emit('subscribe', tokensByExchange);\\n    }";
const replaceMC = `fetchLiveQuotes(marketCalls).then(quotesMap => {
      if (Object.keys(quotesMap).length > 0) {
        setMarketCalls(prev => applyQuotes(prev, quotesMap));
      }
    });

    if (Object.keys(tokensByExchange).length > 0) {
      socket.emit('subscribe', tokensByExchange);
    }`;

contentMC = contentMC.replace(targetMC, replaceMC);
fs.writeFileSync(pathMC, contentMC);
console.log('Patched market-calls.tsx');


// Patch todaysMarketHighlights.tsx
const pathHL = './components/dasboardSections/todaysMarketHighlights.tsx';
let contentHL = fs.readFileSync(pathHL, 'utf8');

const targetHL = "if (Object.keys(tokensByExchange).length > 0) {\\n      socket.emit('subscribe', tokensByExchange);\\n    }";
const replaceHL = `// Fetch initial quotes to avoid delay
    const initialFetch = async () => {
      const grouped = {};
      highlights.forEach(c => {
        if (!c.isLocked && c.token) {
          const exch = c.exchange || 'NSE';
          if (!grouped[exch]) grouped[exch] = [];
          grouped[exch].push(c.token);
        }
      });
      const quotesMap = {};
      try {
        for (const [exch, tokens] of Object.entries(grouped)) {
          if (tokens.length === 0) continue;
          const res = await apiClient.post('/angel/quote', { symbols: tokens, mode: 'FULL', exchange: exch });
          const fetched = res.data?.data?.fetched ?? (Array.isArray(res.data?.data) ? res.data.data : []);
          fetched.forEach(q => { quotesMap[q.symbolToken] = q; });
        }
      } catch (e) {}

      if (Object.keys(quotesMap).length > 0) {
        setHighlights(prev => prev.map(c => {
          if (c.isLocked || !c.token || !quotesMap[c.token]) return c;
          const q = quotesMap[c.token];
          const ltp = parseFloat(q.ltp ?? 0);
          return {
            ...c,
            ltp: ltp.toFixed(2),
            change: (ltp - c.rawEntry).toFixed(2),
            changePercent: \`(\${(((ltp - c.rawEntry) / (c.rawEntry || 1)) * 100).toFixed(2)}%)\`
          };
        }));
      }
    };
    initialFetch();

    if (Object.keys(tokensByExchange).length > 0) {
      socket.emit('subscribe', tokensByExchange);
    }`;

contentHL = contentHL.replace(targetHL, replaceHL);
fs.writeFileSync(pathHL, contentHL);
console.log('Patched todaysMarketHighlights.tsx');

