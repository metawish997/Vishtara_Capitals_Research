const fs = require('fs');

// Patch market-calls.tsx
const pathMC = './app/(tabs)/market-calls.tsx';
let contentMC = fs.readFileSync(pathMC, 'utf8');

if (!contentMC.includes('import socket')) {
  contentMC = contentMC.replace("import apiClient from '@/services/api/apiClient';", "import apiClient from '@/services/api/apiClient';\nimport socket from '@/services/socket/socketClient';");
}

const mcEffectRegex = /\/\/ --- Live Polling Effect ---[\s\S]*?\}, \[marketCalls\.length\]\);/;
const mcEffectReplacement = `// --- Live WebSocket Effect ---
  React.useEffect(() => {
    if (marketCalls.length === 0) return;

    const tokensByExchange: Record<string, string[]> = {};
    marketCalls.forEach(c => {
      if (!c.isLocked && c.token && c.tradeStatus.toLowerCase() === 'open') {
        const exch = c.exchange || 'NSE';
        if (!tokensByExchange[exch]) tokensByExchange[exch] = [];
        tokensByExchange[exch].push(c.token);
      }
    });

    if (Object.keys(tokensByExchange).length > 0) {
      socket.emit('subscribe', tokensByExchange);
    }

    const handlePriceUpdate = (quote: any) => {
      if (!quote || !quote.token) return;

      setMarketCalls(prev => {
        const idx = prev.findIndex(c => c.token === quote.token);
        if (idx === -1) return prev;
        
        const newCalls = [...prev];
        const c = newCalls[idx];
        if (c.isLocked || c.tradeStatus.toLowerCase() !== 'open') return prev;

        const ltp = parseFloat(quote.ltp ?? 0);
        
        newCalls[idx] = {
          ...c,
          ltp: ltp.toFixed(2),
          change: (ltp - c.rawEntry).toFixed(2),
          changePercent: \`(\${(((ltp - c.rawEntry) / (c.rawEntry || 1)) * 100).toFixed(2)}%)\`,
        };
        
        return newCalls;
      });
    };

    socket.on('price', handlePriceUpdate);

    return () => {
      socket.off('price', handlePriceUpdate);
      if (Object.keys(tokensByExchange).length > 0) {
        socket.emit('unsubscribe', tokensByExchange);
      }
    };
  }, [marketCalls.length]);`;

contentMC = contentMC.replace(mcEffectRegex, mcEffectReplacement);
fs.writeFileSync(pathMC, contentMC);
console.log('Patched market-calls.tsx');

// Patch todaysMarketHighlights.tsx
const pathHL = './components/dasboardSections/todaysMarketHighlights.tsx';
let contentHL = fs.readFileSync(pathHL, 'utf8');

if (!contentHL.includes('import socket')) {
  contentHL = contentHL.replace("import apiClient from '@/services/api/apiClient';", "import apiClient from '@/services/api/apiClient';\nimport socket from '@/services/socket/socketClient';");
}

const hlEffectRegex = /\/\/ --- Live Polling Effect ---[\s\S]*?\}, \[highlights\.length\]\);/;
const hlEffectReplacement = `// --- Live WebSocket Effect ---
  React.useEffect(() => {
    if (highlights.length === 0) return;

    const tokensByExchange: Record<string, string[]> = {};
    highlights.forEach(c => {
      if (!c.isLocked && c.token) {
        const exch = c.exchange || 'NSE';
        if (!tokensByExchange[exch]) tokensByExchange[exch] = [];
        tokensByExchange[exch].push(c.token);
      }
    });

    if (Object.keys(tokensByExchange).length > 0) {
      socket.emit('subscribe', tokensByExchange);
    }

    const handlePriceUpdate = (quote: any) => {
      if (!quote || !quote.token) return;

      setHighlights(prev => {
        const idx = prev.findIndex(c => c.token === quote.token);
        if (idx === -1) return prev;
        
        const newCalls = [...prev];
        const c = newCalls[idx];
        if (c.isLocked) return prev;

        const ltp = parseFloat(quote.ltp ?? 0);
        
        newCalls[idx] = {
          ...c,
          ltp: ltp.toFixed(2),
          change: (ltp - c.rawEntry).toFixed(2),
          changePercent: \`(\${(((ltp - c.rawEntry) / (c.rawEntry || 1)) * 100).toFixed(2)}%)\`,
        };
        
        return newCalls;
      });
    };

    socket.on('price', handlePriceUpdate);

    return () => {
      socket.off('price', handlePriceUpdate);
      if (Object.keys(tokensByExchange).length > 0) {
        socket.emit('unsubscribe', tokensByExchange);
      }
    };
  }, [highlights.length]);`;

contentHL = contentHL.replace(hlEffectRegex, hlEffectReplacement);
fs.writeFileSync(pathHL, contentHL);
console.log('Patched todaysMarketHighlights.tsx');

