import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import AnimatedBackground from '../../../components/AnimatedBackground';
import BrandLogo from '../../../components/BrandLogo';
import Logomark from '../../../components/Logomark';

const { width, height } = Dimensions.get('window');

// infographic items
const RADIUS = 135;
const CENTER_X = 180; // Center of the 360x360 container
const CENTER_Y = 180;

const INFOGRAPHIC_ITEMS = [
  { text: "SEBI\nRegistered", icon: "shield-alt", angle: -90 }, // Top
  { text: "Research\nAnalyst", icon: "award", angle: -30 }, // Top-Right
  { text: "Disciplined\nRisk", icon: "exclamation-triangle", angle: 30 }, // Bottom-Right
  { text: "Stoploss\nFocus", icon: "bullseye", angle: 90 }, // Bottom
  { text: "Multi\nSegment", icon: "chart-pie", angle: 150 }, // Bottom-Left
  { text: "Equity\n& F&O", icon: "chart-line", angle: 210 }, // Top-Left
];

export default function WelcomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePress = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      router.push('/pages/auth/loginRegister');
      setTimeout(() => setIsLoading(false), 500);
    }, 600);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Render the Animated Background */}
      <AnimatedBackground isDark={true} themeAccent="#f8b917" themeBg="#020210" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          
          {/* Circular Infographic Section */}
          <View style={styles.infographicWrapper}>
            <View style={styles.circleContainer}>
              {/* Central Logo Box */}
              <View style={styles.logoCenter}>
                <Logomark width={120} height={120} />
              </View>

              {/* Surrounding Circular Items */}
              {INFOGRAPHIC_ITEMS.map((item, index) => {
                const rad = (item.angle * Math.PI) / 180;
                const x = RADIUS * Math.cos(rad);
                const y = RADIUS * Math.sin(rad);

                // Calculate item position
                const itemLeft = CENTER_X + x - 45; // offset half item width (90/2)
                const itemTop = CENTER_Y + y - 35;  // offset half item height (70/2)

                return (
                  <View key={index} style={[styles.infoItem, { left: itemLeft, top: itemTop }]}>
                    <View style={styles.iconCircle}>
                      <FontAwesome5 name={item.icon} size={15} color="#f8b917" />
                    </View>
                    <Text style={styles.itemText} numberOfLines={2}>
                      {item.text}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Bottom Branding & Action Area */}
          <View style={styles.bottomContainer}>
            {/* Logo Text banner */}
            <View style={styles.logoBanner}>
              <BrandLogo width={220} height={70} />
              <Text style={styles.logoTagline}>
                India's Gateway to Smart Capital Research
              </Text>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.9}
              onPress={handlePress}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#011d52" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <Feather name="arrow-right" size={18} color="#011d52" />
                </>
              )}
            </TouchableOpacity>

            {/* Trust Footer */}
            <View style={styles.trustRow}>
              <Feather name="shield" size={12} color="#B5B2B1" />
              <Text style={styles.trustText}>
                Secure • Reliable • Intelligent
              </Text>
            </View>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020210',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: height * 0.04,
    paddingBottom: 24,
  },

  // Infographic Layout
  infographicWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  circleContainer: {
    width: 360,
    height: 360,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCenter: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  // Circular Info Item
  infoItem: {
    position: 'absolute',
    width: 90,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(1, 29, 82, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 11,
    letterSpacing: 0.2,
  },

  // Bottom Branding Area
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  logoBanner: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoTagline: {
    color: '#B5B2B1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  primaryButton: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#011d52',
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 15,
    fontWeight: '800',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    opacity: 0.8,
  },
  trustText: {
    color: '#B5B2B1',
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});