import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { storage } from '../../services/storage';
import { useProfile } from '@/hooks/useProfile';
import notificationServices from '@/services/api/methods/notificationService';
import socket from '@/services/socket/socketClient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  userName,
  avatarUrl,
  onMenuPress,
  onProfilePress,
  notificationCount = 0,
}) => {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(notificationCount);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#141723',
    icon: isDark ? '#FFFFFF' : '#141723',
    avatarBorder: isDark ? 'rgba(248, 185, 23, 0.3)' : 'rgba(20, 23, 35, 0.12)',
    badgeBg: '#FF3B30',
  };

  const styles = getStyles(theme, insets);

  const [displayName, setDisplayName] = useState(userName || 'User');
  const [displayAvatar, setDisplayAvatar] = useState(
    avatarUrl || 'https://i.pravatar.cc/300'
  );

  const { data: profileData } = useProfile();
  
  useEffect(() => {
    let mounted = true;
    
    const updateProfileUI = async () => {
      let userData = profileData?.user || profileData?.data || profileData;
      
      if (!userData) {
        userData = await storage.getUser();
      } else {
        storage.saveUser(profileData);
      }
      
      if (!mounted || !userData) return;

      if (!userName) {
        const name = userData.name || userData.full_name || 'User';
        setDisplayName(name);
      }

      if (!avatarUrl) {
        let finalImage = 'https://i.pravatar.cc/300';
        if (userData.image && typeof userData.image === 'string') {
          finalImage = userData.image.startsWith('http') ? userData.image : `https://vishtaracapitalsresearch.com${userData.image}`;
        } else if (userData.profile_image_url && typeof userData.profile_image_url === 'string') {
          finalImage = userData.profile_image_url;
        } else if (userData.profile_picture) {
          finalImage = userData.profile_picture;
        } else if (userData.avatar) {
          finalImage = userData.avatar;
        }
        setDisplayAvatar(finalImage);
      }
    };
    
    updateProfileUI();
    
    return () => { mounted = false; };
  }, [profileData, userName, avatarUrl]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;



      const fetchUnread = async () => {
        try {
          const countData: any = await notificationServices.getUnreadCount();
          const count = countData?.count ?? countData?.data?.count ?? countData ?? 0;
          if (mounted) setUnreadCount(count);
        } catch (error) {
          console.warn('Failed to fetch unread count');
        }
      };

      fetchUnread();

      const handleNotificationRefresh = () => {
        fetchUnread();
      };
      socket.on('notification_refresh', handleNotificationRefresh);

      return () => {
        mounted = false;
        socket.off('notification_refresh', handleNotificationRefresh);
      };
    }, [avatarUrl, userName])
  );

  const handleNotificationPress = () => {
    router.push('/pages/notification/allNotifications');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {/* LEFT SECTION - AVATAR & NAME */}
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={onMenuPress || (() => router.push('/(tabs)/settings'))} activeOpacity={0.8}>
            <Image
              source={{ uri: displayAvatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <View style={styles.nameContainer}>
            <Text style={styles.username} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
        </View>

        {/* RIGHT SECTION - SETTINGS & NOTIFICATIONS */}
        <View style={styles.headerRight}>
          {/* Announcements Icon */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/(tabs)/announcements')}
          >
            <Feather name="radio" size={22} color={theme.icon} />
          </TouchableOpacity>

          {/* Notification */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleNotificationPress}
          >
            <Feather name="bell" size={22} color={theme.icon} />

            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme: any, insets: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
    paddingBottom: 8, // Reduced padding for minimal profile
    paddingTop: Platform.OS === 'android' ? insets.top + 8 : 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36, // Smaller avatar for minimalist look
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.avatarBorder,
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    color: theme.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 20,
    padding: 4,
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: theme.badgeBg,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: theme.bg,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Manrope_700Bold',
  },
});

export default Header;
