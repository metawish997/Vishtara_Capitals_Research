import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 1. Import useRouter
import { useAppearance } from '@/context/AppearanceContext';

interface SearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  // onNotificationPress is no longer strictly needed if hardcoded, 
  // but kept optional in case you want to override it later.
  onNotificationPress?: () => void;
}

const Search: React.FC<SearchProps> = ({ 
  value, 
  onChangeText, 
  placeholder = "Search using stock name...",
  onNotificationPress 
}) => {
  const router = useRouter(); // 2. Initialize router
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
    textPrimary: isDark ? '#FFFFFF' : '#141723',
    textSecondary: isDark ? '#B5B2B1' : '#64748b',
    border: isDark ? 'rgba(248, 185, 23, 0.15)' : 'rgba(20, 23, 35, 0.08)',
  };

  const handleNotificationPress = () => {
    // Priority to custom prop if passed, otherwise default navigation
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      router.push('/pages/notification/allNotifications');
    }
  };

  return (
    <View style={styles.searchRow}>
      <View style={[styles.searchBox, { backgroundColor: theme.bg, borderColor: theme.border, borderWidth: 1 }]}>
        <Feather name="search" size={18} color={theme.textSecondary} />
        <TextInput
          placeholder={placeholder}
          style={[styles.searchInput, { color: theme.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={theme.textSecondary}
        />
      </View>

      <TouchableOpacity 
        style={[styles.notificationBtn, { backgroundColor: theme.bg, borderColor: theme.border, borderWidth: 1 }]} 
        onPress={handleNotificationPress} // 3. Use the handler
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color={theme.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 2,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  notificationBtn: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Search;