const fs = require('fs');
const path = './components/dasboardSections/todaysMarketHighlights.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add fields to interface
content = content.replace('  rawEntry: number;\n}', '  rawEntry: number;\n  tradeStatus?: string;\n  durationStr?: string;\n  profitLoss?: string;\n}');

// 2. Add computation logic in map
const mapTargetRegex = /const isLocked = tip\.is_locked !== undefined \? tip\.is_locked : \(tip\.allowed_plans && tip\.allowed_plans\.length > 0\);/;
const mapReplacement = `const isLocked = tip.is_locked !== undefined ? tip.is_locked : (tip.allowed_plans && tip.allowed_plans.length > 0);

        const tradeStatus = tip.trade_status || 'Open';
        const createdDateStr = tip.createdAt || tip.created_at || new Date().toISOString();
        let profitLoss = '';
        let durationStr = '';

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
        }`;
content = content.replace(mapTargetRegex, mapReplacement);

// 3. Add fields to returned object
const returnTargetRegex = /target: isLocked \? '22000\.00' : '₹' \+ target\.toFixed\(2\),/;
const returnReplacement = `target: isLocked ? '22000.00' : '₹' + target.toFixed(2),
          target2: isLocked ? '****' : (target2Raw > 0 ? '₹' + target2Raw.toFixed(2) : ''),
          tradeStatus: tradeStatus,
          durationStr: durationStr,
          profitLoss: profitLoss,`;
content = content.replace(returnTargetRegex, returnReplacement);

// 4. Update the WS effect
const wsEffectRegex = /if \(c\.isLocked\) return prev;/;
const wsEffectReplacement = `if (c.isLocked || c.tradeStatus?.toLowerCase() !== 'open') return prev;`;
content = content.replace(wsEffectRegex, wsEffectReplacement);

// 5. Update HighlightCard to render Closed State and add Status Colors
const handlePressRegex = /const handlePress = \(\) => \{/;
const colorHelpers = `const getStatusColor = (status: string) => {
    if (status.includes('T1') || status.includes('T2')) return '#10b981';
    if (status.includes('SL') || status.includes('Early')) return '#ef4444';
    return theme.textSecondary;
  };
  const getStatusBg = (status: string) => {
    if (status.includes('T1') || status.includes('T2')) return isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7';
    if (status.includes('SL') || status.includes('Early')) return isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2';
    return isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9';
  };

  const handlePress = () => {`;
content = content.replace(handlePressRegex, colorHelpers);

// 6. Replace Render logic
const renderLtpRegex = /<View style=\{\{ alignItems: 'flex-end' \}\}>\n\s*<Text style=\{\[styles\.valueLtp, \{ color: theme\.textPrimary, fontSize: 18 \}\]\}>₹\{item\.ltp\}<\/Text>\n\s*<Text style=\{\[styles\.changeText, \{ color: isBuy \? '#10b981' : '#ef4444', marginTop: 0, fontSize: 10 \}\]\}>\n\s*\{item\.change\} \{item\.changePercent\}\n\s*<\/Text>\n\s*<\/View>/;

const renderReplacement = `{item.tradeStatus === 'Closed' ? (
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <View style={[styles.statusStamp, { backgroundColor: getStatusBg(item.resultStatus || ''), borderColor: getStatusColor(item.resultStatus || '') }]}>
                <Text style={[styles.statusStampText, { color: getStatusColor(item.resultStatus || '') }]}>{item.resultStatus || 'Closed'}</Text>
              </View>
              {!!item.profitLoss && (
                <Text style={[styles.changeText, { color: item.profitLoss.startsWith('+') ? '#10b981' : '#ef4444', marginTop: 0, fontWeight: '800' }]}>
                  {item.profitLoss.startsWith('+') ? 'Profit' : 'Loss'} {item.profitLoss}
                </Text>
              )}
              {!!item.durationStr && (
                <Text style={[styles.durationText, { color: theme.textSecondary }]}>in {item.durationStr}</Text>
              )}
            </View>
          ) : (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.valueLtp, { color: theme.textPrimary, fontSize: 18 }]}>₹{item.ltp}</Text>
              <Text style={[styles.changeText, { color: isBuy ? '#10b981' : '#ef4444', marginTop: 0, fontSize: 10 }]}>
                {item.change} {item.changePercent}
              </Text>
            </View>
          )}`;
content = content.replace(renderLtpRegex, renderReplacement);

// 7. Add Missing Styles for Stamp
const dateTextRegex = /  dateText: \{/;
const styleReplacement = `  statusStamp: {
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
  dateText: {`;
content = content.replace(dateTextRegex, styleReplacement);

fs.writeFileSync(path, content);
console.log('Successfully patched highlight UI changes');
