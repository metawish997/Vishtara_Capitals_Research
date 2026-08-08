// app/pages/subscription/DigioEsignWebView.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform, PermissionsAndroid, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import * as ImagePicker from 'expo-image-picker';

export default function DigioEsignWebView() {
  const params = useLocalSearchParams<{
    url?: string;
    digio_document_id?: string;
    plan_id?: string;
    duration_id?: string;
  }>();

  const router = useRouter();
  const checkoutUrl = params?.url ? decodeURIComponent(params.url) : null;
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status === 'granted') {
          console.log('[E-Sign] Camera permission granted via Expo.');
        } else {
          console.log('[E-Sign] Camera permission denied via Expo.');
        }

        if (Platform.OS === 'android') {
          const micGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
          console.log('[E-Sign] Audio permission:', micGranted);
        }
      } catch (err) {
        console.warn('[E-Sign] Permission error:', err);
      } finally {
        setHasPermissions(true);
      }
    };
    requestCameraPermission();
  }, []);

  const onNavChange = (navState: any) => {
    const navUrl = navState?.url ?? '';
    // Go back if Digio redirects to our callback, the web app's profile page, or localhost (dev mode)
    if (
      navUrl.includes('vishtaracapitalsresearch.com/mobile-payment-callback') ||
      navUrl.includes('vishtaracapitalresearch.in') ||
      navUrl.includes('localhost')
    ) {
      router.back();
    }
  };

  if (!checkoutUrl) {
    return (
      <>
        <Stack.Screen options={{ title: 'E-Sign Agreement' }} />
        <SafeAreaView style={styles.center}>
          <ActivityIndicator size="large" color="#0a7ea4" />
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'E-Sign Agreement' }} />
      <SafeAreaView style={styles.flex}>
        <StatusBar barStyle="dark-content" />
        {!hasPermissions ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0a7ea4" />
          </View>
        ) : (
          <WebView
            source={{ uri: checkoutUrl }}
            originWhitelist={['*']}
            onNavigationStateChange={onNavChange}
            startInLoadingState
            onPermissionRequest={(event: any) => {
              console.log('[E-Sign] WebView Permission Request:', JSON.stringify(event));
              const req = event?.nativeEvent || event?.request || event;
              if (req?.grant) {
                req.grant(req.resources);
              }
            }}
            geolocationEnabled={true}
            userAgent={
              Platform.OS === 'android'
                ? 'Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36'
                : 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
            }
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mediaCapturePermissionGrantType="grant"
            androidLayerType="hardware"
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            mixedContentMode="always"
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#0a7ea4" />
              </View>
            )}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
              // Force close on connection refused or other terminal errors
              router.back();
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView HTTP error: ', nativeEvent);
              if (nativeEvent.statusCode >= 400) {
                router.back();
              }
            }}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    zIndex: 100,
  }
});
