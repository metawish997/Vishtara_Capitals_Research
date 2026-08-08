const fs = require('fs');
const path = './components/dasboardSections/todaysMarketHighlights.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add resultStatus to HighlightItem
content = content.replace('  target2?: string;\n  isBuy: boolean;', '  target2?: string;\n  isBuy: boolean;\n  resultStatus?: string;');

// 2. Add resultStatus to fetchMarketHighlights map
content = content.replace('token: tip.symbol_token || tip.token || \'\',', 'token: tip.symbol_token || tip.token || \'\',\n          resultStatus: tip.status || \'\',');

// 3. Update TradeRange component
const tradeRangeMatch = content.match(/const TradeRange = [\s\S]*?const HighlightCard/);
if (tradeRangeMatch) {
  content = content.replace(tradeRangeMatch[0], `const TradeRange = ({ isBuy, isLocked, sl, entry, target, target2, textColor, subTextColor, resultStatus }: { isBuy: boolean; isLocked?: boolean; sl: string; entry: string; target: string; target2?: string; textColor: string; subTextColor: string; resultStatus?: string }) => {
  if (isLocked) return null;
  const color = isBuy ? '#10b981' : '#ef4444';

  const isT1Achieved = resultStatus === 'T1-Achieved' || resultStatus === 'T2-Achieved';
  const isT2Achieved = resultStatus === 'T2-Achieved';
  const isSlHit = resultStatus === 'SL-Hit';

  return (
    <View style={styles.rangeContainer}>
      <View style={styles.rangeLineBase} />
      <View style={[styles.rangeLineActive, { backgroundColor: color, width: '70%', left: '30%' }]} />
      
      <View style={[styles.rangeDotWrapper, { left: '0%', alignItems: 'flex-start' }]}>
        <View style={[styles.rangeDotBase, { backgroundColor: '#ef4444' }]} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {isSlHit && <Ionicons name="close-circle" size={10} color="#ef4444" style={{ marginBottom: 2 }} />}
          <Text style={[styles.rangeLabelText, { color: subTextColor }]}>SL</Text>
        </View>
        <Text style={[styles.rangeValueText, { color: textColor }]}>{sl}</Text>
      </View>
      
      <View style={[styles.rangeDotWrapperAbove, { left: '30%', transform: [{ translateX: -20 }] }]}>
        <Text style={[styles.rangeValueText, { color: textColor }]}>{entry}</Text>
        <Text style={[styles.rangeLabelText, { color: subTextColor, marginBottom: 6 }]}>Entry</Text>
        <View style={[styles.rangeDotBase, { backgroundColor: '#f59e0b', marginBottom: 0 }]} />
      </View>
      
      <View style={[styles.rangeDotWrapper, target2 ? { left: '65%', transform: [{ translateX: -20 }] } : { right: '0%', alignItems: 'flex-end' }]}>
        {target2 ? (
          <View style={[styles.rangeDotBase, { backgroundColor: color }]} />
        ) : (
          <View style={[styles.rangeDotRingBase, { borderColor: color }]}>
            <View style={[styles.rangeDotInnerBase, { backgroundColor: color }]} />
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {isT1Achieved && <Ionicons name="checkmark-circle" size={10} color={color} style={{ marginBottom: 2 }} />}
          <Text style={[styles.rangeLabelText, { color: subTextColor }]}>{target2 ? 'Target 1' : 'Target'}</Text>
        </View>
        <Text style={[styles.rangeValueText, { color: textColor }]}>{target}</Text>
      </View>
      
      {!!target2 && (
        <View style={[styles.rangeDotWrapperAbove, { right: '0%', alignItems: 'flex-end' }]}>
          <Text style={[styles.rangeValueText, { color: textColor }]}>{target2}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
            {isT2Achieved && <Ionicons name="checkmark-circle" size={10} color={color} />}
            <Text style={[styles.rangeLabelText, { color: subTextColor, marginBottom: 0 }]}>Target 2</Text>
          </View>
          <View style={[styles.rangeDotRingBase, { borderColor: color, marginBottom: 0 }]}>
            <View style={[styles.rangeDotInnerBase, { backgroundColor: color }]} />
          </View>
        </View>
      )}
    </View>
  );
};

const HighlightCard`);
}

// 4. Pass resultStatus to TradeRange inside HighlightCard
content = content.replace('target2={item.target2} textColor={theme.textPrimary} subTextColor={theme.textSecondary} />', 'target2={item.target2} textColor={theme.textPrimary} subTextColor={theme.textSecondary} resultStatus={item.resultStatus} />');

fs.writeFileSync(path, content);
console.log('Patched checkmarks');
