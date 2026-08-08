const fs = require('fs');
const path = './components/dasboardSections/todaysMarketHighlights.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add target2 to HighlightItem
content = content.replace('  target: string;\n  isBuy: boolean;', '  target: string;\n  target2?: string;\n  isBuy: boolean;');

// 2. Unmask LOCKED_HIGHLIGHTS dummy data
content = content.replace(/STOCK NAME HIDDEN/g, 'NIFTY');
content = content.replace(/0000\.00/g, '22000.00');

// 3. Replace TradeRange and HighlightCard
const tradeRangeMatch = content.match(/const TradeRange = [\s\S]*?const HighlightCard/);
if (tradeRangeMatch) {
  content = content.replace(tradeRangeMatch[0], `const TradeRange = ({ isBuy, isLocked, sl, entry, target, target2, textColor, subTextColor }: { isBuy: boolean; isLocked?: boolean; sl: string; entry: string; target: string; target2?: string; textColor: string; subTextColor: string }) => {
  if (isLocked) return null;
  const color = isBuy ? '#10b981' : '#ef4444';

  return (
    <View style={styles.rangeContainer}>
      <View style={styles.rangeLineBase} />
      <View style={[styles.rangeLineActive, { backgroundColor: color, width: '70%', left: '30%' }]} />
      
      <View style={[styles.rangeDotWrapper, { left: '0%', alignItems: 'flex-start' }]}>
        <View style={[styles.rangeDotBase, { backgroundColor: '#ef4444' }]} />
        <Text style={[styles.rangeLabelText, { color: subTextColor }]}>SL</Text>
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
        <Text style={[styles.rangeLabelText, { color: subTextColor }]}>{target2 ? 'Target 1' : 'Target'}</Text>
        <Text style={[styles.rangeValueText, { color: textColor }]}>{target}</Text>
      </View>
      
      {!!target2 && (
        <View style={[styles.rangeDotWrapperAbove, { right: '0%', alignItems: 'flex-end' }]}>
          <Text style={[styles.rangeValueText, { color: textColor }]}>{target2}</Text>
          <Text style={[styles.rangeLabelText, { color: subTextColor, marginBottom: 6 }]}>Target 2</Text>
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

// 4. Replace HighlightCard content to match MarketCard
const cardMatch = content.match(/const HighlightCard = [\s\S]*?export default function TodaysMarketHighlights/);
if (cardMatch) {
  content = content.replace(cardMatch[0], `const HighlightCard = ({ item, onUpgrade }: { item: HighlightItem; onUpgrade: () => void }) => {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';
  const theme = {
    cardBg: isDark ? '#040410' : '#ffffff',
    textPrimary: isDark ? '#FFFFFF' : '#141723',
    textSecondary: isDark ? '#B5B2B1' : '#4f5568',
    borderColor: isDark ? 'rgba(163, 255, 0, 0.15)' : 'rgba(20, 23, 35, 0.12)',
    divider: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
    statsBg: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
    iconBgBuy: isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7',
    iconBgSell: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
    accent: isDark ? '#a3ff00' : '#94e307',
    lockIconBg: isDark ? 'rgba(163, 255, 0, 0.1)' : '#f7fee7',
    lockIconColor: isDark ? '#a3ff00' : '#639609',
    lockedOverlay: isDark ? 'rgba(4, 4, 16, 0.6)' : 'rgba(255,255,255,0.75)',
    btnStart: isDark ? 'rgba(163, 255, 0, 0.1)' : '#94e307',
    btnEnd: isDark ? 'rgba(163, 255, 0, 0.2)' : '#94e307',
    btnText: isDark ? '#a3ff00' : '#000000',
  };

  const isBuy = item.isBuy;
  const isLocked = item.isLocked;
  const actionColor = isBuy ? '#10b981' : '#ef4444';
  const actionBg = isBuy ? theme.iconBgBuy : theme.iconBgSell;

  const handlePress = () => {
    if (isLocked) onUpgrade();
    else router.push('/(tabs)/market-calls');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={handlePress}
      style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.titleGroup}>
            <View style={[styles.actionIconBlock, { backgroundColor: isLocked ? theme.lockIconBg : actionBg }]}>
              {isLocked ? (
                <Ionicons name="lock-closed" size={20} color={theme.lockIconColor} />
              ) : (
                <Text style={[styles.actionIconText, { color: actionColor }]}>{item.action}</Text>
              )}
            </View>
            <View>
              <Text style={[styles.stockTitle, { color: theme.textPrimary }]} numberOfLines={1}>{item.title}</Text>
              <Text style={[styles.dateText, { color: theme.textSecondary }]}>{item.date}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.valueLtp, { color: theme.textPrimary, fontSize: 18 }]}>₹{item.ltp}</Text>
            <Text style={[styles.changeText, { color: isBuy ? '#10b981' : '#ef4444', marginTop: 0, fontSize: 10 }]}>
              {item.change} {item.changePercent}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.divider }]} />

        <View style={{ position: 'relative', flex: 1 }}>
          {isLocked && (
            <View style={[styles.lockedOverlay, { backgroundColor: theme.lockedOverlay, borderRadius: 12 }]}>
              <Text style={[styles.lockTitle, { color: theme.textPrimary }]}>PREMIUM SIGNAL</Text>
              <Text style={[styles.lockSubtitle, { color: theme.textSecondary }]}>Unlock Entry, Target & SL</Text>
              <TouchableOpacity onPress={onUpgrade} activeOpacity={0.8}>
                <LinearGradient colors={[theme.btnStart, theme.btnEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.unlockBtn}>
                  <Text style={[styles.unlockBtnText, { color: theme.btnText }]}>Upgrade Now</Text>
                  <Ionicons name="arrow-forward" size={14} color={theme.btnText} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.midSection, isLocked ? styles.blurredContent : null]}>
            <View style={styles.rangeWrapper}>
              <TradeRange isBuy={isBuy} isLocked={false} sl={item.sl} entry={item.entry} target={item.target} target2={item.target2} textColor={theme.textPrimary} subTextColor={theme.textSecondary} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function TodaysMarketHighlights`);
}

// 5. Update fetchMarketHighlights mappings to unmask
content = content.replace(/title: isLocked \? 'STOCK NAME HIDDEN' : \(tip\.symbol \|\| tip\.stock_name \|\| 'UNKNOWN'\),/g, "title: tip.symbol || tip.stock_name || 'UNKNOWN',");
content = content.replace(/ltp: isLocked \? '0000\.00' : ltp\.toFixed\(2\),/g, "ltp: ltp.toFixed(2),");
content = content.replace(/change: isLocked \? '0\.00' : \(ltp - entry\)\.toFixed\(2\),/g, "change: (ltp - entry).toFixed(2),");
content = content.replace(/changePercent: isLocked \? '\(0\.00\%\)' : `\(\$\{\(\(ltp - entry\) \/ entry \* 100\)\.toFixed\(2\)\}\%\)`\,/g, "changePercent: `(${((ltp - entry) / entry * 100).toFixed(2)}%)`,");
content = content.replace(/const target = parseFloat\(tip\.target_price \|\| '0'\);/g, "const target = parseFloat(tip.target_price || '0');\n        const target2Raw = parseFloat(tip.target_price_2 || '0');");
content = content.replace(/target: isLocked \? '0000\.00' : '₹' \+ target\.toFixed\(2\),/g, "target: isLocked ? '****' : '₹' + target.toFixed(2),\n          target2: isLocked ? '****' : (target2Raw > 0 ? '₹' + target2Raw.toFixed(2) : ''),");

// 6. Fix styles
const stylesMatch = content.match(/  \/\/ --- LOCKED STATE ---[\s\S]*?lockTitle: \{/);
if (stylesMatch) {
  content = content.replace(stylesMatch[0], `  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 6,
  },
  unlockBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  lockTitle: {`);
}

content = content.replace(/  iconPlaceholder: \{[\s\S]*?iconText: \{[\s\S]*?\},/g, `  actionIconBlock: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },`);

content = content.replace(/  rangeWrapper: \{[\s\S]*?rangeDotInner: \{[\s\S]*?\},/g, `  rangeWrapper: {
    width: '100%',
    paddingBottom: 16,
  },
  rangeContainer: {
    height: 70,
    justifyContent: 'center',
    marginTop: 10,
  },
  rangeLineBase: {
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    width: '100%',
    position: 'absolute',
    top: 33,
  },
  rangeLineActive: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: 33,
  },
  rangeDotWrapper: {
    position: 'absolute',
    top: 32,
    alignItems: 'center',
  },
  rangeDotWrapperAbove: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rangeDotBase: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 6,
  },
  rangeDotRingBase: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 3,
  },
  rangeDotInnerBase: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  rangeLabelText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  rangeValueText: {
    fontSize: 11,
    fontWeight: '700',
  },`);

// Remove statsGrid entirely
content = content.replace(/  \/\/ --- STATS GRID ---[\s\S]*?\}\);/g, '});');

fs.writeFileSync(path, content);
console.log('Patched');
