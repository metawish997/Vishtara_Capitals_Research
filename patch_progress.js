const fs = require('fs');
const path = './app/(tabs)/market-calls.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add ltp prop to TradeRange
content = content.replace('resultStatus?: string }) => {', 'resultStatus?: string; ltp?: string }) => {');

// 2. Add calculation logic
const calculateLogic = `
  const parseVal = (str?: string) => {
    if (!str) return NaN;
    return parseFloat(str.replace(/[^0-9.-]+/g, ''));
  };

  const ltpVal = parseVal(ltp);
  const slVal = parseVal(sl);
  const entryVal = parseVal(entry);
  const t1Val = parseVal(target);
  const t2Val = target2 ? parseVal(target2) : NaN;

  const calculateProgress = () => {
    if (isNaN(ltpVal) || isNaN(slVal) || isNaN(entryVal) || isNaN(t1Val)) return 30;
    const t1Pos = target2 ? 65 : 100;
    
    if (isBuy) {
      if (ltpVal <= slVal) return 0;
      if (ltpVal < entryVal) return 30 - ((entryVal - ltpVal) / (entryVal - slVal || 1)) * 30;
      if (ltpVal < t1Val) return 30 + ((ltpVal - entryVal) / (t1Val - entryVal || 1)) * (t1Pos - 30);
      if (target2 && ltpVal < t2Val) return t1Pos + ((ltpVal - t1Val) / (t2Val - t1Val || 1)) * (100 - t1Pos);
      return 100;
    } else {
      if (ltpVal >= slVal) return 0;
      if (ltpVal > entryVal) return 30 - ((ltpVal - entryVal) / (slVal - entryVal || 1)) * 30;
      if (ltpVal > t1Val) return 30 + ((entryVal - ltpVal) / (entryVal - t1Val || 1)) * (t1Pos - 30);
      if (target2 && ltpVal > t2Val) return t1Pos + ((t1Val - ltpVal) / (t1Val - t2Val || 1)) * (100 - t1Pos);
      return 100;
    }
  };

  const progress = calculateProgress();
  const activeColor = progress >= 30 ? '#10b981' : '#ef4444';
  const activeLeft = progress >= 30 ? 30 : Math.max(0, progress);
  const activeWidth = progress >= 30 ? Math.min(100 - 30, progress - 30) : 30 - activeLeft;
`;

content = content.replace("  const isSlHit = resultStatus === 'SL-Hit';\n\n  return (", "  const isSlHit = resultStatus === 'SL-Hit';\n" + calculateLogic + "\n  return (");

// 3. Update the active line render
content = content.replace(/<View style=\{\[styles\.rangeLineActive, \{ backgroundColor: color, width: '70%', left: '30%' \}\]\} \/>/, `<View style={[styles.rangeLineActive, { backgroundColor: activeColor, width: \`\${activeWidth}%\`, left: \`\${activeLeft}%\` }]} />`);

// 4. Update the call to TradeRange to pass ltp={data.ltp}
content = content.replace('resultStatus={data.resultStatus} />', 'resultStatus={data.resultStatus} ltp={data.ltp} />');

fs.writeFileSync(path, content);
console.log('Patched progress bar logic in market-calls');

// Also do it for todaysMarketHighlights.tsx
const highlightPath = './components/dasboardSections/todaysMarketHighlights.tsx';
let hContent = fs.readFileSync(highlightPath, 'utf8');
hContent = hContent.replace('resultStatus?: string }) => {', 'resultStatus?: string; ltp?: string }) => {');
hContent = hContent.replace("  const isSlHit = resultStatus === 'SL-Hit';\n\n  return (", "  const isSlHit = resultStatus === 'SL-Hit';\n" + calculateLogic + "\n  return (");
hContent = hContent.replace(/<View style=\{\[styles\.rangeLineActive, \{ backgroundColor: color, width: '70%', left: '30%' \}\]\} \/>/, `<View style={[styles.rangeLineActive, { backgroundColor: activeColor, width: \`\${activeWidth}%\`, left: \`\${activeLeft}%\` }]} />`);
hContent = hContent.replace('resultStatus={item.resultStatus} />', 'resultStatus={item.resultStatus} ltp={item.ltp} />');
fs.writeFileSync(highlightPath, hContent);
console.log('Patched progress bar logic in highlights');

