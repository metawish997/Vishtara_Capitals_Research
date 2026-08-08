import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import customerProfileServices from '@/services/api/methods/profileService';
import policyService from '@/services/api/methods/policyServices';
import kycService from '@/services/api/methods/kycService';
import agreementService from '@/services/api/methods/agreementService';
import { useAppearance } from '@/context/AppearanceContext';
import { authService } from '@/services/api/methods/authService';
import { useAuth } from '@/context/AuthContext';
import Constants from 'expo-constants';
import { notificationService } from '@/services/notificationService';
import apiClient from '@/services/api/apiClient';

// --- Constants ---
const THEME_COLOR = '#8cc63f';
const BG_COLOR = '#F8F9FA';
const CARD_BG = '#FFFFFF';
const { width } = Dimensions.get('window');

// --- Types ---
interface MenuItem {
  id: number;
  icon: any;
  text: string;
  type: 'ionic' | 'material' | 'fontAwesome' | 'feather';
  color?: string;
  route?: string;
  isDestructive?: boolean;
}

const SettingsPage = () => {
  const router = useRouter();
  const { colorScheme, themePreference, setThemePreference } = useAppearance();
  const { signOut } = useAuth();
  const isDark = colorScheme === 'dark';

  const [userData, setUserData] = useState<any>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [accountServices, setAccountServices] = useState<{ subscriptions: any[], invoices: any[], agreements: any[] }>({ subscriptions: [], invoices: [], agreements: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [policyLoading, setPolicyLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await authService.removeFcmToken().catch(() => console.log("Failed to remove FCM token"));
            await authService.logout();
          } catch (error) {
            console.log("API logout failed");
          } finally {
            setLoggingOut(false);
            await signOut();
          }
        }
      }
    ]);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setIsDeleting(true);
    try {
      const res = await apiClient.delete('/users/delete-account');
      if (res.data?.success) {
        Alert.alert('Success', 'Account deleted successfully', [
          { text: 'OK', onPress: () => signOut() }
        ]);
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete account');
      setShowDeleteModal(false);
      setDeleteConfirmText('');
    } finally {
      setIsDeleting(false);
    }
  };

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    card: isDark ? '#040410' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#B5B2B1' : '#6B7280',
    border: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
    primary: isDark ? '#f8b917' : '#011d52',
    danger: '#EF4444',
    success: '#10B981',
    avatarBg: isDark ? 'rgba(248, 185, 23, 0.1)' : '#F3F4F6',
  };


  // --- Helper: Get Last 4 Digits ---
  const getLast4Chars = (str: string | null | undefined, type: 'pan' | 'aadhar') => {
    if (!str || typeof str !== 'string' || str.length < 4) {
      return type === 'pan' ? '----------' : '---- ---- ----';
    }
    const last4 = str.slice(-4);
    return type === 'pan' ? `******${last4}` : `**** **** ${last4}`;
  };

  const getKycData = (user: any) => {
    const kycActions = user?.kyc?.raw_response?.actions;
    if (Array.isArray(kycActions)) {
      const digilockerData = kycActions.find((a: any) => a.type === 'digilocker');
      return digilockerData?.details || {};
    }
    return {};
  };

  // --- Fetch Data ---
  const fetchProfile = async (isMounted: boolean) => {
    try {
      const response: any = await customerProfileServices.getAllProfiles();
      let user = response?.user ?? response?.data?.user ?? response ?? {};

      // Live KYC check
      const currentKycStatus = user?.kyc_status ?? user?.kyc?.status ?? 'pending';
      if (!['approved', 'verified', 'completed', 'success'].includes(currentKycStatus.toLowerCase())) {
        try {
          const statusRes = await kycService.getKycStatus();
          if (statusRes?.success) {
            const liveStatus = statusRes.kyc_status;
            if (['approved', 'completed', 'success'].includes(liveStatus.toLowerCase())) {
              await kycService.getKycFullDetails();
              // Refetch profile to get updated data
              const newRes: any = await customerProfileServices.getAllProfiles();
              user = newRes?.user ?? newRes?.data?.user ?? newRes ?? {};
            }
          }
        } catch (e) {
          console.warn('Live KYC sync error:', e);
        }
      }

      if (isMounted) {
        setUserData(user);
      }
    } catch (err) {
      console.warn('Settings fetch error:', err);
    }
  };

  const fetchPolicies = async (isMounted: boolean) => {
    try {
      const res = await policyService.getPolicies();
      if (isMounted) {
        const data = res?.data ?? res ?? [];
        setPolicies(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.warn('Policies fetch error:', error);
    }
  };

  const fetchAccountServices = async (isMounted: boolean) => {
    try {
      const res = await agreementService.getAccountServices();
      if (isMounted && res?.success) {
        setAccountServices(res);
      }
    } catch (error) {
      console.warn('Account services fetch error:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      const loadData = async () => {
        const storedPush = await AsyncStorage.getItem('pushEnabled');
        const storedSound = await AsyncStorage.getItem('soundEnabled');
        if (mounted) {
          if (storedPush !== null) setPushEnabled(storedPush === 'true');
          if (storedSound !== null) setSoundEnabled(storedSound === 'true');
        }

        await Promise.all([fetchProfile(mounted), fetchPolicies(mounted), fetchAccountServices(mounted)]);
        if (mounted) {
          setLoading(false);
          setPolicyLoading(false);
        }
      };
      loadData();
      return () => { mounted = false; };
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProfile(true), fetchPolicies(true), fetchAccountServices(true)]);
    setRefreshing(false);
  };

  const togglePushNotifications = async (value: boolean) => {
    setPushEnabled(value);
    await AsyncStorage.setItem('pushEnabled', String(value));
    try {
      if (value) {
        const token = await notificationService.registerForPushNotificationsAsync();
        if (token) {
          await authService.updateFcmToken(token);
        }
      } else {
        await authService.removeFcmToken();
      }
    } catch (err) {
      console.warn('Failed to update push token on backend:', err);
    }
  };

  const toggleSound = async (value: boolean) => {
    setSoundEnabled(value);
    await AsyncStorage.setItem('soundEnabled', String(value));
  };

  // --- Data Formatting Helpers ---
  const getFormattedDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };


  // --- Derived State ---
  const bsmrId = userData?.bsmr_id || '-';
  const userName = userData?.name || 'User';
  const userEmail = userData?.email || '-';
  const userPhone = userData?.phone || '-';
  const isEmailVerified = !!userData?.email_verified_at;

  const kycDetails = getKycData(userData);

  let profileImageSource = { uri: 'https://randomuser.me/api/portraits/men/32.jpg' };
  let finalUserImg = null;
  if (typeof userData?.image === 'string' && userData.image.trim() !== '') {
    finalUserImg = userData.image.startsWith('http') ? userData.image : `https://www.vishtaracapitalresearch.in${userData.image}`;
  } else if (typeof userData?.profile_image_url === 'string' && userData.profile_image_url.trim() !== '') {
    finalUserImg = userData.profile_image_url;
  }

  if (finalUserImg) {
    profileImageSource = { uri: finalUserImg };
  } else if (typeof userData?.kyc?.selfie_image === 'string' && userData.kyc.selfie_image.trim() !== '') {
    profileImageSource = { uri: userData.kyc.selfie_image.startsWith('http') ? userData.kyc.selfie_image : `https://www.vishtaracapitalresearch.in${userData.kyc.selfie_image}` };
  } else if (typeof userData?.kyc?.aadhaar_image === 'string' && userData.kyc.aadhaar_image.trim() !== '') {
    profileImageSource = { uri: userData.kyc.aadhaar_image.startsWith('http') ? userData.kyc.aadhaar_image : `https://www.vishtaracapitalresearch.in${userData.kyc.aadhaar_image}` };
  } else if (kycDetails?.aadhaar?.profile_image_url) {
    profileImageSource = { uri: kycDetails.aadhaar.profile_image_url };
  } else if (kycDetails?.aadhaar?.image) {
    profileImageSource = { uri: `data:image/jpeg;base64,${kycDetails.aadhaar.image}` };
  }

  const panMasked = getLast4Chars(userData?.pan_card || kycDetails?.pan?.id_number, 'pan');
  const aadharMasked = getLast4Chars(userData?.adhar_card || kycDetails?.aadhaar?.id_number, 'aadhar');

  const subscriptions = accountServices.subscriptions || [];
  const activeSubscription = subscriptions.find((s: any) => s.status === 'active') || userData?.subscription;
  const hasActivePlan = activeSubscription?.status === 'active';
  const planName = activeSubscription?.service_plan?.name || userData?.plan?.name || (hasActivePlan ? 'Standard Plan' : 'No Active Plan');
  const validityStart = getFormattedDate(activeSubscription?.start_date);
  const validityEnd = getFormattedDate(activeSubscription?.end_date);

  const rawKycStatus = userData?.kyc_status || userData?.kyc?.status || 'pending';
  const kycStatus = String(rawKycStatus).toLowerCase();
  const isKycVerified = ['verified', 'approved', 'completed', 'success'].includes(kycStatus);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      icon: 'credit-card',
      text: 'Payment & Invoices',
      type: 'feather',
      route: '/pages/settingsInnerPages/paymentAndInvoices',
    },
    {
      id: 2,
      icon: 'file-text',
      text: 'KYC & Agreement',
      type: 'feather',
      route: '/pages/kyc/kycAgreement',
    },
    {
      id: 3,
      icon: 'help-circle',
      text: 'Support',
      type: 'feather',
      route: '/pages/support/SupportPage',
    },

    {
      id: 10,
      icon: 'log-out',
      text: 'Log Out',
      type: 'feather',
      color: '#EF4444',
      isDestructive: true,
    },
  ];

  const renderIcon = (item: MenuItem) => {
    const iconColor = item.color || '#4B5563';
    switch (item.type) {
      case 'ionic': return <Ionicons name={item.icon} size={20} color={iconColor} />;
      case 'material': return <MaterialIcons name={item.icon} size={20} color={iconColor} />;
      case 'fontAwesome': return <FontAwesome name={item.icon} size={18} color={iconColor} />;
      case 'feather': return <Feather name={item.icon} size={20} color={iconColor} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
        }
      >
        {/* --- Header & Profile Row (Trading App Style) --- */}
        <View style={styles.headerSection}>
          <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>Account</Text>
        </View>

        <TouchableOpacity
          style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/pages/profile/profileDetails')}
          activeOpacity={0.8}
        >
          <View style={styles.profileRow}>
            <Image source={profileImageSource} style={[styles.avatar, { borderColor: theme.border }]} />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.textPrimary }]}>{userName}</Text>
              <Text style={[styles.profileId, { color: theme.textSecondary }]}>{bsmrId}</Text>
              <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{userEmail} {isEmailVerified && <MaterialIcons name="verified" size={14} color={theme.primary} />}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* --- Subscription Minimal Block --- */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Subscription</Text>
          <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.planHeaderRow}>
              <View>
                <Text style={[styles.planTitle, { color: theme.textPrimary }]}>{planName}</Text>
                <Text style={[styles.planStatusText, { color: theme.textSecondary }]}>
                  Valid till: <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>{hasActivePlan ? validityEnd : 'N/A'}</Text>
                </Text>
              </View>
              <View style={[styles.kycBadge, { backgroundColor: isKycVerified ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7') : (isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7') }]}>
                <Text style={[styles.kycBadgeText, { color: isKycVerified ? theme.success : '#D97706' }]}>
                  KYC {isKycVerified ? 'DONE' : 'PENDING'}
                </Text>
              </View>
            </View>

            {isKycVerified ? (
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: isDark ? 'rgba(248, 185, 23, 0.1)' : '#011d52' }]}
                onPress={() => router.push('/pages/settingsInnerPages/pricingPlans')}
              >
                <Text style={[styles.primaryBtnText, { color: isDark ? theme.primary : '#FFFFFF' }]}>Upgrade Plan</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: isDark ? 'rgba(248, 185, 23, 0.1)' : '#011d52' }]}
                onPress={() => router.push('/pages/kyc/kycAgreement')}
              >
                <Text style={[styles.primaryBtnText, { color: isDark ? theme.primary : '#FFFFFF' }]}>Complete KYC</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* --- Personal & Preferences (Menu List) --- */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Settings & Legal</Text>
          <View style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={`menu-${item.id}`}
                style={[styles.menuRow, index === menuItems.length - 1 && policies.length === 0 ? { borderBottomWidth: 0 } : { borderBottomColor: theme.border }]}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.text === 'Delete Account') setShowDeleteModal(true);
                  else if (item.text === 'Log Out') handleLogout();
                  else if (item.route) router.push(item.route as any);
                }}
              >
                <View style={styles.menuIconBox}>
                  {renderIcon({ ...item, color: item.isDestructive ? theme.danger : theme.textSecondary })}
                </View>
                <Text style={[styles.menuText, { color: item.isDestructive ? theme.danger : theme.textPrimary }]}>
                  {item.text}
                </Text>
                <Feather name="chevron-right" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            ))}

            {/* Link to Policy List */}
            <TouchableOpacity
              style={[styles.menuRow, { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
              onPress={() => router.push('/pages/policies/PolicyList')}
            >
              <View style={styles.menuIconBox}>
                <Feather name="file-text" size={18} color={theme.textSecondary} />
              </View>
              <Text style={[styles.menuText, { color: theme.textPrimary }]}>
                Legal & Policies
              </Text>
              <Feather name="chevron-right" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Notifications --- */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Notifications</Text>
          <View style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.menuRow, { borderBottomColor: theme.border }]}>
              <View style={styles.menuIconBox}>
                <Feather name="bell" size={20} color={theme.textSecondary} />
              </View>
              <Text style={[styles.menuText, { color: theme.textPrimary }]}>Push Notifications</Text>
              <Switch
                value={pushEnabled}
                onValueChange={togglePushNotifications}
                trackColor={{ false: '#e2e8f0', true: '#f8b917' }}
                thumbColor={pushEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>
            <View style={[styles.menuRow, { borderBottomWidth: 0 }]}>
              <View style={styles.menuIconBox}>
                <Feather name="volume-2" size={20} color={theme.textSecondary} />
              </View>
              <Text style={[styles.menuText, { color: theme.textPrimary }]}>Notification Sound</Text>
              <Switch
                value={soundEnabled}
                onValueChange={toggleSound}
                trackColor={{ false: '#e2e8f0', true: '#f8b917' }}
                thumbColor={soundEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* --- Appearance Selector --- */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Appearance</Text>
          <View style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.menuRow, { borderBottomWidth: 0 }]}>
              <View style={styles.menuIconBox}>
                <Feather name={isDark ? "moon" : "sun"} size={20} color={theme.textSecondary} />
              </View>
              <Text style={[styles.menuText, { color: theme.textPrimary }]}>Dark Mode</Text>
              <Switch
                value={isDark}
                onValueChange={(value) => setThemePreference(value ? 'dark' : 'light')}
                trackColor={{ false: '#e2e8f0', true: '#f8b917' }}
                thumbColor={isDark ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* --- Danger Zone --- */}
        <View style={[styles.sectionContainer, { marginTop: 16 }]}>
          <View style={[styles.dangerZoneCard, { backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Feather name="alert-triangle" size={18} color={theme.danger} style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 16, fontWeight: '800', color: theme.danger, textTransform: 'uppercase' }}>Danger Zone</Text>
            </View>
            <Text style={{ fontSize: 12, color: 'rgba(239, 68, 68, 0.8)', marginBottom: 16, lineHeight: 18 }}>
              Deleting your account will immediately remove your access to the platform. Your invoices, agreements, subscriptions, and compliance records will remain archived for regulatory purposes.
            </Text>
            <TouchableOpacity 
              style={[styles.primaryBtn, { backgroundColor: theme.danger }]}
              onPress={() => setShowDeleteModal(true)}
            >
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700' }}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Developer Testing (Expo Go Only) --- */}
        {/* {Constants.appOwnership === 'expo' && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Developer Testing (Expo Go Only)</Text>
            <View style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TouchableOpacity
                style={[styles.menuRow, { borderBottomColor: theme.border }]}
                activeOpacity={0.7}
                onPress={async () => {
                  console.log("[SETTINGS] Test Foreground Notification Clicked!");
                  try {
                    await notificationService.testForegroundNotification();
                    console.log("[SETTINGS] Test Foreground Notification execution completed.");
                  } catch (err) {
                    console.error("[SETTINGS] Error executing Foreground notification:", err);
                  }
                }}
              >
                <View style={styles.menuIconBox}><Feather name="bell" size={18} color={theme.textSecondary} /></View>
                <Text style={[styles.menuText, { color: theme.textPrimary }]}>Test Foreground Notification</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.menuRow, { borderBottomColor: theme.border }]}
                activeOpacity={0.7}
                onPress={async () => {
                  console.log("[SETTINGS] Test Background Notification Clicked!");
                  try {
                    await notificationService.testBackgroundNotification();
                    console.log("[SETTINGS] Test Background Notification execution completed.");
                  } catch (err) {
                    console.error("[SETTINGS] Error executing Background notification:", err);
                  }
                }}
              >
                <View style={styles.menuIconBox}><Feather name="clock" size={18} color={theme.textSecondary} /></View>
                <Text style={[styles.menuText, { color: theme.textPrimary }]}>Test Background (5s delay)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.menuRow, { borderBottomWidth: 0 }]}
                activeOpacity={0.7}
                onPress={async () => {
                  console.log("[SETTINGS] Test Navigation Payload Clicked!");
                  try {
                    await notificationService.testNavigationNotification();
                    console.log("[SETTINGS] Test Navigation Payload execution completed.");
                  } catch (err) {
                    console.error("[SETTINGS] Error executing Navigation notification:", err);
                  }
                }}
              >
                <View style={styles.menuIconBox}><Feather name="navigation" size={18} color={theme.textSecondary} /></View>
                <Text style={[styles.menuText, { color: theme.textPrimary }]}>Test Navigation Payload</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} */}

      </ScrollView>

      {/* Delete Account Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.danger }]}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: theme.danger, marginBottom: 8 }}>Confirm Deletion</Text>
            <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 16 }}>
              This action cannot be undone. Please type <Text style={{ fontWeight: 'bold', color: theme.textPrimary }}>DELETE</Text> to confirm.
            </Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.textPrimary, borderColor: theme.border }]}
              placeholder="Type DELETE"
              placeholderTextColor={theme.textSecondary}
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              autoCapitalize="characters"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: theme.bg }]}
                onPress={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                disabled={isDeleting}
              >
                <Text style={{ color: theme.textSecondary, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: deleteConfirmText === 'DELETE' ? theme.danger : 'rgba(239, 68, 68, 0.4)' }]}
                onPress={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || isDeleting}
              >
                <Text style={{ color: '#FFF', fontWeight: '700' }}>{isDeleting ? 'Deleting...' : 'Delete'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  headerSection: { marginBottom: 12 },
  pageTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },

  profileCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1 },
  profileRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, marginRight: 16 },
  profileInfo: { flex: 1, justifyContent: 'center' },
  profileName: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  profileId: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  profileEmail: { fontSize: 13, fontWeight: '500' },

  sectionContainer: { marginBottom: 24 },
  sectionHeader: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 },

  planCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  planHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  planTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  planStatusText: { fontSize: 13 },
  kycBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  kycBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  primaryBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '700' },

  menuContainer: { borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  menuIconBox: { width: 24, alignItems: 'center', marginRight: 16 },
  menuText: { flex: 1, fontSize: 15, fontWeight: '500' },

  dangerZoneCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { width: '100%', maxWidth: 400, borderRadius: 16, padding: 20, borderWidth: 1 },
  modalInput: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 20 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
});

export default SettingsPage;