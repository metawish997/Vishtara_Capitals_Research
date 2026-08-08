import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import Chat from '@/components/includes/chat';
import { useAppearance } from '@/context/AppearanceContext';

interface OtherPagesIncProps {
  children: React.ReactNode;
  title?: string;
}

export default function OtherPagesInc({ children, title }: OtherPagesIncProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    card: isDark ? '#040410' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#B5B2B1' : '#6B7280',
    border: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
    primary: isDark ? '#f8b917' : '#011d52',
    btnText: isDark ? '#000000' : '#FFFFFF',
    headerBg: isDark ? '#020210' : '#FFFFFF',
  };

  const activeColor = theme.primary;
  const baseTabHeight = Platform.OS === 'android' ? 60 : 65;
  const tabHeight = baseTabHeight + insets.bottom;
  const fabBottom = tabHeight + 15;

  const navItems = [
    { name: 'News', icon: 'file-text', route: '/latest-news' },
    { name: 'Alerts', icon: 'bell', route: '/announcements' },
    { name: 'Home', icon: 'grid', route: '/' },
    { name: 'Calls', icon: 'trending-up', route: '/market-calls' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>

        {title ? (
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/pages/notification/allNotifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.contentContainer, { backgroundColor: theme.bg }]}>{children}</View>

      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: activeColor,
            bottom: fabBottom,
            shadowColor: activeColor,
          },
        ]}
        onPress={() => setIsChatOpen(true)}
        activeOpacity={0.8}
      >
        <Feather name="message-circle" size={24} color={theme.btnText} />
      </TouchableOpacity>

      <View
        style={[
          styles.bottomNav,
          {
            height: tabHeight,
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom + 10 : insets.bottom + 5,
          },
        ]}
      >
        {navItems.map((item, index) => {
          const isItemActive = pathname === item.route || 
            (item.route === '/' && pathname === '/index') ||
            (pathname.includes(item.route) && item.route !== '/');

          return (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <Feather 
                name={item.icon as any} 
                size={22} 
                color={isItemActive ? activeColor : theme.textSecondary} 
              />
              <Text 
                style={[
                  styles.navLabel, 
                  { color: isItemActive ? activeColor : theme.textSecondary },
                  isItemActive && { fontWeight: '700' }
                ]} 
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={isChatOpen}
        onRequestClose={() => setIsChatOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setIsChatOpen(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
            <View style={styles.chatWrapper}>
              <Chat onClose={() => setIsChatOpen(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    position: 'absolute',
    left: 70,
    right: 70,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    height: '85%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 20,
    overflow: 'hidden',
  },
  chatWrapper: {
    flex: 1,
  },
});