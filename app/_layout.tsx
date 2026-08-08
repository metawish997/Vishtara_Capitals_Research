// app/_layout.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated'; 
import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useRef } from 'react';
import { LogBox } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Suppress the Expo Go push notification warning since we handle it gracefully
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go'
]);

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppearanceProvider } from '../context/AppearanceContext';
import { useFonts } from 'expo-font';
import CustomSplashScreen from '../components/SplashScreen';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { userToken, isLoading } = useAuth();
  const rootNavigationState = useRootNavigationState();
  const isNavigationReady = rootNavigationState?.key != null;

  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (isLoading || !isNavigationReady) return;

    const inAuthGroup = segments?.[0] === 'pages' && segments?.[1] === 'auth';
    const isAtRoot = !segments || (segments as string[]).length === 0;

    // Wrap in a setTimeout to allow the initial navigation state to settle
    // This prevents the ReactViewGroup.drawChild IndexOutOfBoundsException on Android
    // when screens with complex views (like RefreshControl) are unmounted too quickly.
    const timeout = setTimeout(() => {
      if (userToken && (inAuthGroup || isAtRoot)) {
        router.replace('/(tabs)');
      } else if (!userToken && (!inAuthGroup || isAtRoot)) {
        router.replace('/pages/auth/welcome');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isLoading, userToken, segments, isNavigationReady]);

  useEffect(() => {
    let isMounted = true;
    const { notificationService } = require('../services/notificationService');

    // 1. Initialize Notification Service
    notificationService.initialize();

    const handleNotificationRouting = (response: any) => {
      try {
        console.log('[NOTIFICATION] Notification Clicked');
        const data = response?.notification?.request?.content?.data;
        if (!data) {
          console.log('[NOTIFICATION] No payload data found in notification');
          return;
        }

        console.log('[NOTIFICATION] Payload Received:', data);
        console.log('[NOTIFICATION] Navigation Triggered');

        // Example route navigation based on payload (simulated for test)
        if (data.screen === 'StockDetails' && data.id) {
          // router.push(`/pages/detailPages/marketCallDetails?id=${data.id}`);
        }
        
        if (data.screen) {
          console.log(`[NOTIFICATION] Navigating To: ${data.screen}`);
          router.push(data.screen as any);
          console.log('[NOTIFICATION] Navigation Success');
        } else if (data.url) {
          console.log(`[NOTIFICATION] Navigating To URL: ${data.url}`);
          router.push(data.url as any);
          console.log('[NOTIFICATION] Navigation Success');
        } else {
          console.log('[NOTIFICATION] Opening Default Screen: /pages/notification/allNotifications');
          router.push('/pages/notification/allNotifications' as any);
        }
      } catch (error) {
        console.error('[NOTIFICATION] Error handling notification routing:', error);
      }
    };

    // 2. Handle Cold-Start (Terminated App State)
    const handleColdStartNotification = async () => {
      try {
        const response = await Notifications.getLastNotificationResponseAsync();
        if (response && isMounted) {
          console.log('[NOTIFICATION] Cold Start Notification Received');
          handleNotificationRouting(response);
        }
      } catch (error) {
        console.error('[NOTIFICATION] Error getting last notification response:', error);
      }
    };
    
    // We only want to handle cold start once navigation is ready
    if (isNavigationReady) {
      handleColdStartNotification();
    }

    // 2. Register foreground listener
    notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
      console.log('[NOTIFICATION] Notification Received');
      // Custom logic for when notification is received while app is open
    });

    // 3. Register background/interaction listener
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
      handleNotificationRouting(response);
    });

    console.log('[NOTIFICATION] Listeners registration success');

    // === SIMULATOR REMOVED ===
    // We now rely on real remote Push Notifications sent from the backend via Expo Push API.
    console.log('[NOTIFICATION] Using Real Remote Push Notifications (Simulator Disabled)');

    return () => {
      isMounted = false;
      if (notificationListener.current) {
        notificationListener.current.remove();
        console.log('[NOTIFICATION] Foreground Listener Cleanup Success');
      }
      if (responseListener.current) {
        responseListener.current.remove();
        console.log('[NOTIFICATION] Response Listener Cleanup Success');
      }
    };
  }, [isNavigationReady, userToken]);

  useEffect(() => {
    if (!isLoading && isNavigationReady && (fontsLoaded || fontError)) {
      // Ensure the custom splash shows for at least 2s so it's visible in dev
      const minDelay = setTimeout(() => {
        SplashScreen.hideAsync().catch(() => {});
      }, 2000);
      return () => clearTimeout(minDelay);
    }
  }, [isLoading, isNavigationReady, fontsLoaded, fontError]);

  if (isLoading || (!fontsLoaded && !fontError)) return <CustomSplashScreen />;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="pages/auth/welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="pages/auth/loginRegister" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
      </Stack>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppearanceProvider>
          <SafeAreaProvider>
            <AuthProvider>
              <RootLayoutNav />
            </AuthProvider>
          </SafeAreaProvider>
        </AppearanceProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}