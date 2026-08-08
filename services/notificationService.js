import * as Device from "expo-device";
import Constants from 'expo-constants';
import { Platform, PermissionsAndroid } from "react-native";

const isExpoGo = Constants.appOwnership === 'expo';
let Notifications = null;

try {
  Notifications = require('expo-notifications');

  // Configure how notifications behave when the app is in the foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const soundEnabled = await AsyncStorage.getItem('soundEnabled');
      return {
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: soundEnabled !== 'false', // Default to true unless explicitly disabled
        shouldSetBadge: true,
      };
    },
  });
} catch (e) {
  console.warn("Failed to load expo-notifications:", e);
}

class NotificationService {
  constructor() {
    this.isExpoGo = isExpoGo;
    console.log(`[NOTIFICATION] Initialization started. Running in Expo Go: ${this.isExpoGo}`);
  }

  async initialize() {
    console.log('[NOTIFICATION] Notification Service Initialized');
    await this.createAndroidChannels();
  }

  async createAndroidChannels() {
    if (!Notifications) return;
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('sound-channel-1', {
          name: 'Sound Notifications',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
          showBadge: true,
          enableVibrate: true,
        });
        console.log('[NOTIFICATION] Android channel creation success: sound-channel-1');
      } catch (error) {
        console.error('[NOTIFICATION] Android channel creation failed:', error);
      }
    }
  }

  async registerForPushNotificationsAsync() {
    console.log("[NOTIFICATION] Starting Token Generation");
    console.log("[NOTIFICATION] Device Detected");
    let token = null;

    if (!Device.isDevice) {
      console.log('[NOTIFICATION] Must use physical device for Push Notifications');
      return null;
    }

    if (!Notifications) {
      console.log('[NOTIFICATION] Notifications library not loaded.');
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      console.log("[NOTIFICATION] Permission Status:", finalStatus);

      if (finalStatus !== 'granted') {
        return null;
      }
      
      // Get Expo Push Token
      try {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
        token = tokenData.data;
        console.log("[NOTIFICATION] Expo Push Token Generated:", token);
      } catch (expoError) {
        console.error('[NOTIFICATION] Failed to generate Expo Push token:', expoError);
      }
    } catch (e) {
      console.error('[NOTIFICATION] Error during push notification registration:', e);
    }

    return token;
  }

  async checkAndPromptDailyPermission() {
    if (!Notifications) return;
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') return; // Already granted

      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const { Alert, Linking } = require('react-native');

      const today = new Date().toISOString().split('T')[0];
      const lastPromptDate = await AsyncStorage.getItem('lastNotificationPromptDate');

      if (lastPromptDate !== today) {
        await AsyncStorage.setItem('lastNotificationPromptDate', today);
        
        Alert.alert(
          "Enable Notifications",
          "You are missing out on real-time market updates and tips! Please enable push notifications in your settings to stay updated.",
          [
            { text: "Later", style: "cancel" },
            { 
              text: "Open Settings", 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
      }
    } catch (e) {
      console.error('[NOTIFICATION] Error in daily prompt:', e);
    }
  }

  // --- Development Testing Methods (Expo Go Local Simulation) ---

  async ensurePermissions() {
    if (!Notifications) return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  }

  async testForegroundNotification() {
    if (!Notifications) return;
    const hasPermission = await this.ensurePermissions();
    if (!hasPermission) {
      console.log('[NOTIFICATION] Permission not granted for local notifications');
      return;
    }

    console.log('[NOTIFICATION] Expo Go Development Mode Enabled');
    console.log('[NOTIFICATION] Local Notification Scheduled (Foreground)');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Foreground Test",
        body: "This is an instant Expo Go local notification.",
        data: { type: 'test' },
        sound: true,
        ...(Platform.OS === 'android' ? { channelId: 'sound-channel-1' } : {}),
      },
      trigger: null,
    });
  }

  async testBackgroundNotification() {
    if (!Notifications) return;
    const hasPermission = await this.ensurePermissions();
    if (!hasPermission) return;

    console.log('[NOTIFICATION] Expo Go Development Mode Enabled');
    console.log('[NOTIFICATION] Local Notification Scheduled (Background - 5s delay)');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Background Test",
        body: "This notification was delayed by 5 seconds. (Minimize app to test)",
        data: { type: 'test' },
        sound: true,
        ...(Platform.OS === 'android' ? { channelId: 'sound-channel-1' } : {}),
      },
      trigger: { type: 'timeInterval', seconds: 5, repeats: false },
    });
  }

  async testNavigationNotification() {
    if (!Notifications) return;
    const hasPermission = await this.ensurePermissions();
    if (!hasPermission) return;

    console.log('[NOTIFICATION] Expo Go Development Mode Enabled');
    console.log('[NOTIFICATION] Local Notification Scheduled (Navigation)');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "Expo Go Notification Test",
        data: { screen: "StockDetails", id: "123" },
        sound: true,
        ...(Platform.OS === 'android' ? { channelId: 'sound-channel-1' } : {}),
      },
      trigger: null,
    });
  }
}

export const notificationService = new NotificationService();