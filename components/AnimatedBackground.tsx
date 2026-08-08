import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop, Line, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// --- Helper to generate initial random candlestick data ---
const generateInitialData = (count: number) => {
  let data = [];
  let currentPrice = 100;
  for (let i = 0; i < count; i++) {
    const open = currentPrice;
    const change = (Math.random() - 0.4) * 20; // slight upward bias
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 15;
    const low = Math.min(open, close) - Math.random() * 15;
    data.push({ open, close, high, low });
    currentPrice = close;
  }
  return data;
};

const NUM_CANDLES = 22;
const CANDLE_WIDTH = width / NUM_CANDLES;
const BODY_WIDTH = CANDLE_WIDTH * 0.4; // slim bodies
const CHART_HEIGHT = height * 0.45;
const CHART_BOTTOM = height - 50;

interface AnimatedBackgroundProps {
  isDark: boolean;
  themeAccent: string;
  themeBg: string;
  showCandles?: boolean;
}

export default function AnimatedBackground({ isDark, themeAccent, themeBg, showCandles = true }: AnimatedBackgroundProps) {
  const [data, setData] = useState(generateInitialData(NUM_CANDLES));

  // Ticking animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev];
        const lastCandle = newData[newData.length - 1];
        
        // Random tick
        const tick = (Math.random() - 0.5) * 12;
        const newClose = lastCandle.close + tick;
        
        // Update high/low if price breaks out
        const newHigh = Math.max(lastCandle.high, newClose);
        const newLow = Math.min(lastCandle.low, newClose);

        newData[newData.length - 1] = {
          ...lastCandle,
          close: newClose,
          high: newHigh,
          low: newLow,
        };
        return newData;
      });
    }, 800); // tick every 800ms

    return () => clearInterval(interval);
  }, []);

  // Scale data to fit CHART_HEIGHT dynamically
  const minPrice = Math.min(...data.map(d => d.low)) - 10;
  const maxPrice = Math.max(...data.map(d => d.high)) + 10;
  const range = maxPrice - minPrice || 1; // avoid division by zero

  const getY = (price: number) => {
     return CHART_BOTTOM - ((price - minPrice) / range) * CHART_HEIGHT;
  };

  // Create smooth curved line connecting moving average or opens
  let pathD = "";
  data.forEach((d, i) => {
     const x = i * CANDLE_WIDTH + (CANDLE_WIDTH / 2);
     const y = getY((d.open + d.close) / 2); // Midpoint of body
     
     // Simple bezier curve logic for smooth line
     if (i === 0) {
       pathD += `M ${x} ${y}`;
     } else {
       const prevX = (i - 1) * CANDLE_WIDTH + (CANDLE_WIDTH / 2);
       const prevY = getY((data[i-1].open + data[i-1].close) / 2);
       const controlX1 = prevX + (x - prevX) / 2;
       const controlY1 = prevY;
       const controlX2 = prevX + (x - prevX) / 2;
       const controlY2 = y;
       pathD += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x} ${y}`;
     }
  });

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: themeBg, overflow: 'hidden' }]}>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="0%" rx="80%" ry="50%">
            {/* The neon glow originating from top center */}
            <Stop offset="0%" stopColor={themeAccent} stopOpacity={isDark ? "0.15" : "0"} />
            <Stop offset="100%" stopColor={themeBg} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Glow Background */}
        <Rect x="0" y="0" width={width} height={height * 0.7} fill="url(#glow)" />

        {/* Curved abstract line */}
        <Path 
          d={pathD}
          fill="none"
          stroke={themeAccent}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.3"
        />

        {/* Candlesticks */}
        {showCandles && data.map((d, i) => {
          const x = i * CANDLE_WIDTH + (CANDLE_WIDTH / 2);
          const openY = getY(d.open);
          const closeY = getY(d.close);
          const highY = getY(d.high);
          const lowY = getY(d.low);
          
          const isUp = d.close >= d.open;
          
          // Down candles get a hollow look or lower opacity for a sleek monochrome feel
          const opacity = isUp ? 1 : 0.3;
          const fillColor = isUp ? themeAccent : themeBg;
          
          const topBody = Math.min(openY, closeY);
          const bodyHeight = Math.max(Math.abs(openY - closeY), 2); // minimum height of 2px

          return (
            <React.Fragment key={`candle-${i}`}>
              {/* Wick */}
              <Line x1={x} y1={highY} x2={x} y2={lowY} stroke={themeAccent} strokeWidth="1" opacity={opacity} />
              {/* Body */}
              <Rect 
                x={x - BODY_WIDTH / 2} 
                y={topBody} 
                width={BODY_WIDTH} 
                height={bodyHeight} 
                fill={fillColor}
                stroke={themeAccent}
                strokeWidth="1.5"
                opacity={opacity}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
