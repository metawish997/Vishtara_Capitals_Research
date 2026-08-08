import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../services/storage'; 
import Constants from 'expo-constants';
import { DeviceEventEmitter } from 'react-native';

import { notificationService } from '../services/notificationService';
import { authService } from '../services/api/methods/authService';

type AuthContextType = {
  userToken: string | null;
  isLoading: boolean;
  signIn: (token: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await storage.getToken();
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();

    const subscription = DeviceEventEmitter.addListener('account_deleted', async () => {
      console.log('[AUTH] Account deleted detected, signing out...');
      await storage.clearAll();
      setUserToken(null);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Background token registration with retries
  const syncTokenWithBackend = async (retries = 3) => {
    try {
      const fcmToken = await notificationService.registerForPushNotificationsAsync();
      
      if (fcmToken !== null && fcmToken !== undefined && fcmToken.length > 0) {
        let success = false;
        
        for (let i = 0; i < retries; i++) {
          try {
            await authService.updateFcmToken(fcmToken);
            success = true;
            break;
          } catch (apiError) {
            console.warn(`[NOTIFICATION] Token Update Failed (Attempt ${i + 1}/${retries}):`, apiError);
            if (i < retries - 1) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
            }
          }
        }
        
        if (!success) {
          console.error('[NOTIFICATION] Failed to send token to backend after maximum retries.');
        }
      } else {
        if (Constants.appOwnership === 'expo') {
          console.log('[NOTIFICATION] Expo Go mode. Token registration skipped.');
        } else {
          console.log('[NOTIFICATION] No token generated. Backend registration skipped.');
        }
      }
    } catch (e) {
      console.error('[NOTIFICATION] Token sync process failed:', e);
    }
  };

  useEffect(() => {
    if (userToken && !isLoading) {
      syncTokenWithBackend();
    }
  }, [userToken, isLoading]);

  const signIn = async (token: string, userData: any) => {
    await storage.saveToken(token);
    await storage.saveUser(userData);
    setUserToken(token); 
  };

  const signOut = async () => {
    try {
      if (userToken) {
        // Need to remove before token is cleared from context
        console.log('[NOTIFICATION] Removing token from backend on logout...');
        await authService.removeFcmToken();
        console.log('[NOTIFICATION] Token removed successfully from backend.');
      }
    } catch (e) {
      console.log('[NOTIFICATION] Failed to remove FCM Token on logout:', e);
    }

    await storage.clearAll();
    setUserToken(null); 
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}