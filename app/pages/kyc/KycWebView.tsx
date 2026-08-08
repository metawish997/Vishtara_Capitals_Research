import React, { useMemo, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Platform, StatusBar, PermissionsAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import * as ImagePicker from 'expo-image-picker';

export default function KycWebView() {
  const params = useLocalSearchParams<{ url?: string }>();
  const router = useRouter();
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status === 'granted') {
          console.log('[KYC] Camera permission granted via Expo.');
        } else {
          console.log('[KYC] Camera permission denied via Expo.');
        }

        // We also try to request microphone if possible, but camera is primary for KYC
        if (Platform.OS === 'android') {
          const micGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
          console.log('[KYC] Audio permission:', micGranted);
        }

      } catch (err) {
        console.warn('[KYC] Permission error:', err);
      } finally {
        setHasPermissions(true);
      }
    };
    requestCameraPermission();
  }, []);

  const url = useMemo(() => {
    let maybe = params?.url;
    if (Array.isArray(maybe)) maybe = maybe[0];
    if (!maybe) return undefined;

    try {
      return decodeURIComponent(maybe);
    } catch {
      return maybe;
    }
  }, [params?.url]);

  if (!url) {
    return (
      <>
        <Stack.Screen options={{ title: 'Complete KYC', headerBackTitle: 'Back' }} />
        <SafeAreaView style={styles.center}>
          <Text style={{ textAlign: 'center', padding: 16 }}>
            Missing KYC URL. Please go back and try again.
          </Text>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Complete KYC', headerBackTitle: 'Back' }} />
      <SafeAreaView style={styles.flex}>
        <StatusBar barStyle="dark-content" />
        {!hasPermissions ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#005BC1" />
            <Text style={{ marginTop: 16 }}>Requesting Camera Access...</Text>
          </View>
        ) : (
          <WebView
            source={{ uri: url }}
          onPermissionRequest={(event: any) => {
            console.log('[KYC] WebView Permission Request:', JSON.stringify(event));
            const req = event?.nativeEvent || event?.request || event;
            if (req?.grant) {
              req.grant(req.resources);
            }
          }}
          startInLoadingState
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
          originWhitelist={['*']}
          androidLayerType="hardware"
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#005BC1" />
            </View>
          )}
          onNavigationStateChange={(navState) => {
            const navUrl = navState?.url ?? '';

            // Check if we navigated away from Digio (meaning Digio redirected us to our callback URL)
            const isDigioHost = navUrl.includes('digio.in');

            // If we are no longer on digio.in OR we explicitly see a success flag that isn't part of a redirect_url parameter
            if (!isDigioHost && (
              navUrl.includes('/success') ||
              navUrl.includes('completed') ||
              navUrl.includes('status=success') ||
              navUrl.includes('callback')
            )) {
              // Delay slightly to allow any final scripts to run
              setTimeout(() => {
                if (router.canGoBack()) router.back();
              }, 1000);
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