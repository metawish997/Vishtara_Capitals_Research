import { Tabs } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Pressable,
  Text,
  KeyboardAvoidingView
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from '@/hooks/use-color-scheme';

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import Chat from "@/components/includes/chat";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#040410' : '#ffffff',
    textPrimary: isDark ? '#FFFFFF' : '#141723',
    textSecondary: isDark ? '#B5B2B1' : '#4f5568',
    accent: isDark ? '#f8b917' : '#011d52',
    border: isDark ? 'rgba(248, 185, 23, 0.15)' : 'rgba(20, 23, 35, 0.12)',
  };

  const activeColor = theme.accent;
  const [isChatOpen, setIsChatOpen] = useState(false);

  const insets = useSafeAreaInsets();

  const TAB_HEIGHT = 65 + insets.bottom;
  const fabBottom = TAB_HEIGHT + 15;

  const renderTabIcon = (iconName: any, focused: boolean, color: string) => {
    const showBigger = focused && !isDark;
    return (
      <Feather name={iconName} size={showBigger ? 24 : 20} color={color} />
    );
  };

  const renderTabLabel = (labelText: string, focused: boolean, color: string) => {
    const showBold = focused && !isDark;
    return (
      <Text style={{
        fontSize: showBold ? 11 : 10,
        fontFamily: showBold ? 'Manrope_800ExtraBold' : 'Manrope_600SemiBold',
        color: color,
        marginBottom: Platform.OS === 'android' ? 6 : 0,
      }}>
        {labelText}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: isDark ? activeColor : '#000000',
          tabBarInactiveTintColor: theme.textSecondary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: theme.bg,
            height: TAB_HEIGHT,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            paddingTop: Platform.OS === 'ios' ? 8 : 0,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: isDark ? 0.3 : 0.05,
            shadowRadius: 10,
            elevation: 10,
          },
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          }
        }}
      >
        <Tabs.Screen
          name="latest-news"
          options={{
            title: "News",
            tabBarIcon: ({ color, focused }) => renderTabIcon("file-text", focused, color),
            tabBarLabel: ({ color, focused }) => renderTabLabel("News", focused, color),
          }}
        />
        <Tabs.Screen
          name="market-calls"
          options={{
            title: "Calls",
            tabBarIcon: ({ color, focused }) => renderTabIcon("trending-up", focused, color),
            tabBarLabel: ({ color, focused }) => renderTabLabel("Calls", focused, color),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, focused }) => renderTabIcon("grid", focused, color),
            tabBarLabel: ({ color, focused }) => renderTabLabel("Home", focused, color),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, focused }) => renderTabIcon("settings", focused, color),
            tabBarLabel: ({ color, focused }) => renderTabLabel("Settings", focused, color),
          }}
        />

        {/* Hidden Tabs */}
        <Tabs.Screen name="announcements" options={{ href: null }} />
        <Tabs.Screen name="option-chain/[symbol]" options={{ href: null }} />
        <Tabs.Screen name="chat-action" options={{ href: null }} />
        <Tabs.Screen name="watchlist" options={{ href: null }} />
      </Tabs>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: activeColor, bottom: fabBottom, shadowColor: activeColor }]}
        onPress={() => setIsChatOpen(true)}
        activeOpacity={0.8}
      >
        <Feather name="message-circle" size={24} color={isDark ? "#020210" : "#FFFFFF"} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isChatOpen}
        onRequestClose={() => setIsChatOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsChatOpen(false)}
          />

          <KeyboardAvoidingView
            style={[styles.modalContainer, { backgroundColor: theme.bg }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.chatWrapper}>
              <Chat onClose={() => setIsChatOpen(false)} />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    height: '85%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatWrapper: {
    flex: 1,
  }
});