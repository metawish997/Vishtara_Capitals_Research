import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useAppearance } from '@/context/AppearanceContext';
import Logomark from './Logomark';
import BrandLogo from './BrandLogo';

const { height } = Dimensions.get('window');

export default function SplashScreen() {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    accent: isDark ? '#f8b917' : '#011d52',
    textSecondary: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
    glowColor: isDark ? '#f8b917' : 'transparent',
  };

  // ── Animation values ───────────────────────────────────────────────────
  const logoScale   = useRef(new Animated.Value(0.55)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const brandOpacity   = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const glowScale   = useRef(new Animated.Value(0.4)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  // Loading dots
  const dot1 = useRef(new Animated.Value(0.2)).current;
  const dot2 = useRef(new Animated.Value(0.2)).current;
  const dot3 = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    // ── Main entrance sequence ────────────────────────────────────────────
    Animated.sequence([
      // 1. Glow expands + logomark springs in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.spring(glowScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: isDark ? 0.18 : 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      // 2. Brand logo slides up & fades in
      Animated.timing(brandOpacity, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      // 3. Tagline letter-spacing fade
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // ── Dot pulse (starts after entrance) ────────────────────────────────
    const pulseDots = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1, { toValue: 1,   duration: 220, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 1,   duration: 220, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 1,   duration: 220, useNativeDriver: true }),
          Animated.delay(100),
          Animated.parallel([
            Animated.timing(dot1, { toValue: 0.2, duration: 300, useNativeDriver: true }),
            Animated.timing(dot2, { toValue: 0.2, duration: 300, useNativeDriver: true }),
            Animated.timing(dot3, { toValue: 0.2, duration: 300, useNativeDriver: true }),
          ]),
          Animated.delay(200),
        ])
      ).start();
    };

    const t = setTimeout(pulseDots, 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>

      {/* ── Ambient glow (dark mode only) ─────────────────────────────── */}
      {isDark && (
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: theme.glowColor,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />
      )}

      {/* ── Logo group ─────────────────────────────────────────────────── */}
      <View style={styles.logoGroup}>
        {/* BrandLogo */}
        <Animated.View
          style={{
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          }}
        >
          <BrandLogo width={320} height={150} />
        </Animated.View>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            { color: theme.textSecondary, opacity: taglineOpacity },
          ]}
        >
          SMART CAPITAL RESEARCH
        </Animated.Text>
      </View>

      {/* ── Accent divider line ────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.divider,
          { backgroundColor: theme.accent, opacity: taglineOpacity },
        ]}
      />

      {/* ── Loading dots ───────────────────────────────────────────────── */}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { backgroundColor: theme.accent, opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { backgroundColor: theme.accent, opacity: dot2, marginHorizontal: 6 }]} />
        <Animated.View style={[styles.dot, { backgroundColor: theme.accent, opacity: dot3 }]} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },

  /* Glow circle sits behind the logo */
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    // Simulate soft glow with layered shadows
    shadowColor: '#f8b917',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 80,
    elevation: 0,
  },

  logoGroup: {
    alignItems: 'center',
  },

  tagline: {
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 3.5,
    marginTop: 3,
  },

  divider: {
    width: 32,
    height: 2,
    borderRadius: 1,
    marginTop: 28,
  },

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    position: 'absolute',
    bottom: height * 0.1,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
