const fs = require('fs');
const path = './app/(tabs)/market-calls.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add fields to MarketCallData
content = content.replace('  tradeStatus: string;', '  tradeStatus: string;\n  profitLoss?: string;\n  durationStr?: string;');

// 2. Update the mapping logic
const mapperRegex = /const createdDateStr = tip\.createdAt \|\| tip\.created_at \|\| new Date\(\)\.toISOString\(\);\n        const dateObj = new Date\(createdDateStr\);\n        const date = dateObj\.toLocaleDateString\('en-GB', \{ day: '2-digit', month: 'short' \}\);\n        const time = dateObj\.toLocaleTimeString\('en-US', \{ hour: 'numeric', minute: '2-digit', hour12: true \}\);[\s\S]*?resultStatus: tip\.status \|\| '',\n          tradeStatus: tip\.trade_status \|\| 'Open'/;

const match = content.match(mapperRegex);
if (match) {
  const replacement = `const createdDateStr = tip.createdAt || tip.created_at || new Date().toISOString();
        const dateObj = new Date(createdDateStr);
        const date = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        const time = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        const isLocked = tip.is_locked !== undefined ? tip.is_locked : (tip.allowed_plans && tip.allowed_plans.length > 0);

        const rawSegment = tip.tip_type || tip.call_type || 'Intraday';
        const formattedSegment = rawSegment.charAt(0).toUpperCase() + rawSegment.slice(1).toLowerCase();

        let profitLoss = '';
        let durationStr = '';
        const tradeStatus = tip.trade_status || 'Open';

        if (tradeStatus === 'Closed') {
          const exitDateRaw = tip.exit_at || tip.updatedAt || createdDateStr;
          const start = new Date(createdDateStr).getTime();
          const end = new Date(exitDateRaw).getTime();
          const diffMs = Math.abs(end - start);
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          if (diffDays > 0) durationStr = \`\${diffDays} Day\${diffDays > 1 ? 's' : ''}\`;
          else if (diffHours > 0) durationStr = \`\${diffHours} Hr\${diffHours > 1 ? 's' : ''}\`;
          else durationStr = '< 1 Hr';

          const exitPrice = parseFloat(tip.exit_price || tip.current_price || '0');
          if (entry > 0 && exitPrice > 0) {
            const plPercent = isBuy ? ((exitPrice - entry) / entry) * 100 : ((entry - exitPrice) / entry) * 100;
            profitLoss = \`\${plPercent >= 0 ? '+' : ''}\${plPercent.toFixed(2)}%\`;
          }
        }

        return {
          id: tip._id || tip.id,
          title: tip.symbol || tip.stock_name || 'UNKNOWN',
          date: date,
          time: time,
          ltp: ltp.toFixed(2),
          change: (ltp - entry).toFixed(2),
          changePercent: \`(\${((ltp - entry) / entry * 100).toFixed(2)}%)\`,
          potential: 'High',
          sl: isLocked ? '****' : '₹' + sl.toFixed(2),
          entry: isLocked ? '****' : '₹' + entry.toFixed(2),
          target: isLocked ? '****' : '₹' + target.toFixed(2),
          target2: isLocked ? '****' : (target2Raw > 0 ? '₹' + target2Raw.toFixed(2) : ''),
          status: tip.status || 'Live',
          isLocked: isLocked,
          action: isBuy ? 'BUY' : 'SELL',
          tags: isLocked ? ['Premium', formattedSegment] : [formattedSegment],
          token: tip.symbol_token || tip.token || '',
          exchange: tip.exchange || tip.exch_seg || 'NSE',
          rawEntry: entry,
          category: tip.category?.name || formattedSegment,
          createdAt: createdDateStr,
          resultStatus: tip.status || '',
          tradeStatus: tradeStatus,
          profitLoss: profitLoss,
          durationStr: durationStr`;
  content = content.replace(match[0], replacement);
}

// 3. Add getStatusBg and getStatusColor in MarketCard
const handlePressRegex = /const handlePress = \(\) => \{/;
content = content.replace(handlePressRegex, `const getStatusColor = (status: string) => {
    if (status.includes('T1') || status.includes('T2')) return '#10b981';
    if (status.includes('SL') || status.includes('Early')) return '#ef4444';
    return theme.textSecondary;
  };
  const getStatusBg = (status: string) => {
    if (status.includes('T1') || status.includes('T2')) return isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7';
    if (status.includes('SL') || status.includes('Early')) return isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2';
    return isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9';
  };

  const handlePress = () => {`);

// 4. Render closed state
const renderLtpRegex = /<View style=\{\{ alignItems: 'flex-end' \}\}>\n\s*<Text style=\{\[styles\.valueLtp, \{ color: theme\.textPrimary, fontSize: 18 \}\]\}>₹\{data\.ltp\}<\/Text>\n\s*<Text style=\{\[styles\.changeText, \{ color: isBuy \? '#10b981' : '#ef4444', marginTop: 0, fontSize: 10 \}\]\}>\n\s*\{data\.change\} \{data\.changePercent\}\n\s*<\/Text>\n\s*<\/View>/;
const renderReplacement = `{data.tradeStatus === 'Closed' ? (
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <View style={[styles.statusStamp, { backgroundColor: getStatusBg(data.resultStatus), borderColor: getStatusColor(data.resultStatus) }]}>
                <Text style={[styles.statusStampText, { color: getStatusColor(data.resultStatus) }]}>{data.resultStatus || 'Closed'}</Text>
              </View>
              {!!data.profitLoss && (
                <Text style={[styles.changeText, { color: data.profitLoss.startsWith('+') ? '#10b981' : '#ef4444', marginTop: 0, fontWeight: '800' }]}>
                  {data.profitLoss.startsWith('+') ? 'Profit' : 'Loss'} {data.profitLoss}
                </Text>
              )}
              {!!data.durationStr && (
                <Text style={[styles.durationText, { color: theme.textSecondary }]}>in {data.durationStr}</Text>
              )}
            </View>
          ) : (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.valueLtp, { color: theme.textPrimary, fontSize: 18 }]}>₹{data.ltp}</Text>
              <Text style={[styles.changeText, { color: isBuy ? '#10b981' : '#ef4444', marginTop: 0, fontSize: 10 }]}>
                {data.change} {data.changePercent}
              </Text>
            </View>
          )}`;
content = content.replace(renderLtpRegex, renderReplacement);

// 5. Add styles
content = content.replace(/  dateText: \{/, `  statusStamp: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusStampText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  durationText: {
    fontSize: 9,
    fontWeight: '500',
  },
  dateText: {`);

fs.writeFileSync(path, content);
console.log('Patched closed layout');
