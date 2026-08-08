import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'light' | 'dark' | 'system';

interface AppearanceContextType {
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
  colorScheme: 'light' | 'dark'; // The actual resolved color scheme
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export const AppearanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const nativeColorScheme = useNativeColorScheme() || 'light';
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved preference on mount
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@app_theme_preference');
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setThemePreferenceState(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const setThemePreference = async (theme: ThemePreference) => {
    setThemePreferenceState(theme);
    try {
      await AsyncStorage.setItem('@app_theme_preference', theme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const resolvedColorScheme = themePreference === 'system' ? nativeColorScheme : themePreference;

  if (!isLoaded) {
    return null; // or a minimal splash screen if needed, but App's splash will handle it
  }

  return (
    <AppearanceContext.Provider value={{ themePreference, setThemePreference, colorScheme: resolvedColorScheme }}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
};
