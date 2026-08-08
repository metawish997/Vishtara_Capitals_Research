import React, { useState, useCallback } from 'react';
import { Image } from 'expo-image';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import customerProfileServices from '@/services/api/methods/profileService';
import OtherPagesInc from '@/components/includes/otherPagesInc';
import { useAppearance } from '@/context/AppearanceContext';

// --- Theme Constants ---
const COLORS = {
  primary: '#005BC1',
  background: '#F9FAFB',
  card: '#FFFFFF',
  textMain: '#1F2937',
  textSub: '#6B7280',
  inputBg: '#F3F4F6',
  border: '#E5E7EB',
  success: '#10B981',
  error: '#EF4444',
};

export default function ProfileDetails() {
  const router = useRouter();
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    card: isDark ? '#040410' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#B5B2B1' : '#6B7280',
    border: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
    primary: isDark ? '#f8b917' : '#011d52',
    textLink: isDark ? '#f8b917' : '#011d52',
    inputBg: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F3F4F6',
    idBadgeBg: isDark ? 'rgba(248, 185, 23, 0.1)' : '#E0E7FF',
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Form State ---
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneChangeCount, setPhoneChangeCount] = useState(0);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [userId, setUserId] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');

  // Date State
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Identity State
  const [panNumber, setPanNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // --- Helper: Extract KYC Data ---
  const getKycData = (user: any) => {
    const kycActions = user?.kyc?.raw_response?.actions;
    if (Array.isArray(kycActions)) {
      const digilockerData = kycActions.find((a: any) => a.type === 'digilocker');
      return digilockerData?.details || {};
    }
    return {};
  };

  // --- Fetch Data ---
  useFocusEffect(
    useCallback(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const response: any = await customerProfileServices.getAllProfiles();
        if (!mounted) return;

        const rawUserData = response?.data?.user || response?.user || response?.data || response || {};
        const userData = Object.keys(rawUserData).length > 0 && !rawUserData.name && rawUserData.data ? rawUserData.data : rawUserData;
        
        const kycDetails = getKycData(userData);

        setUsername(userData?.name || '');
        setFatherName(userData?.father_name || '');
        setEmail(userData?.email || '');
        setPhone(userData?.phone || '');
        setPhoneChangeCount(userData?.phone_change_count || 0);
        setUserId(userData?.smra_id || userData?.bsmr_id || userData?.id?.toString() || '');
        setIsEmailVerified(!!userData?.email_verified_at);
        setCity(userData?.city || '');
        setState(userData?.state || '');
        setPincode(userData?.pincode || '');
        setAddress(userData?.address || '');

        const apiGender = typeof userData?.gender === 'string' ? userData.gender.toLowerCase() : 'male';
        setGender(apiGender === 'female' ? 'Female' : 'Male');

        let finalProfileImage = null;
        console.log("=== IMAGE DEBUGGING ===");
        console.log("userData.image:", userData?.image);
        console.log("userData.profile_image_url:", userData?.profile_image_url);
        console.log("userData.kyc.selfie_image:", userData?.kyc?.selfie_image);
        console.log("userData.kyc.aadhaar_image:", userData?.kyc?.aadhaar_image);
        console.log("kycDetails.aadhaar.profile_image_url:", kycDetails?.aadhaar?.profile_image_url);

        if (typeof userData?.image === 'string' && userData.image.trim() !== '') {
             finalProfileImage = userData.image.startsWith('http') ? userData.image : `https://www.vishtaracapitalresearch.in${userData.image}`;
        } else if (typeof userData?.profile_image_url === 'string' && userData.profile_image_url.trim() !== '') {
             finalProfileImage = userData.profile_image_url;
        }

        console.log("Calculated finalProfileImage:", finalProfileImage);

        if (finalProfileImage) {
            console.log("Setting finalProfileImage...");
            setProfileImage(finalProfileImage);
        } else if (typeof userData?.kyc?.selfie_image === 'string' && userData.kyc.selfie_image.trim() !== '') {
            console.log("Setting kyc.selfie_image...");
            setProfileImage(userData.kyc.selfie_image.startsWith('http') ? userData.kyc.selfie_image : `https://www.vishtaracapitalresearch.in${userData.kyc.selfie_image}`);
        } else if (typeof userData?.kyc?.aadhaar_image === 'string' && userData.kyc.aadhaar_image.trim() !== '') {
            console.log("Setting kyc.aadhaar_image...");
            setProfileImage(userData.kyc.aadhaar_image.startsWith('http') ? userData.kyc.aadhaar_image : `https://www.vishtaracapitalresearch.in${userData.kyc.aadhaar_image}`);
        } else if (kycDetails?.aadhaar?.profile_image_url) {
            console.log("Setting kycDetails.aadhaar.profile_image_url...");
            setProfileImage(kycDetails.aadhaar.profile_image_url);
        } else if (kycDetails?.aadhaar?.image) {
            console.log("Setting base64 kycDetails.aadhaar.image...");
            setProfileImage(`data:image/jpeg;base64,${kycDetails.aadhaar.image}`);
        } else {
            console.log("NO IMAGE FOUND, falling back to default placeholder.");
        }

        const rawPan = userData?.pan_card || kycDetails?.pan?.id_number || '';
        const rawAadhar = userData?.adhar_card || kycDetails?.aadhaar?.id_number || '';
        setPanNumber(rawPan);
        setAadharNumber(rawAadhar);

        if (userData?.dob && typeof userData.dob === 'string') {
          const datePart = userData.dob.split('T')[0];
          const [y, m, d] = datePart.split('-');
          setYear(y || '');
          setMonth(m || '');
          setDay(d || '');
        }

      } catch (err) {
        console.warn('Profile fetch error:', err);
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
    }, [])
  );

  // --- Image Picker ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // --- Save Handler ---
  const handleUpdate = async () => {
    // Basic validation
    if (!username.trim()) {
      Alert.alert('Validation Error', 'Full Name is required.');
      return;
    }

    setSaving(true);
    try {
      let dob = null;
      if (year && month && day) {
        dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      const formData = new FormData();
      formData.append('name', username);
      formData.append('father_name', fatherName);
      formData.append('gender', gender.toLowerCase());
      if (dob) formData.append('dob', dob);
      formData.append('pan_card', panNumber);
      formData.append('adhar_card', aadharNumber);
      formData.append('city', city);
      formData.append('state', state);
      formData.append('pincode', pincode);
      formData.append('address', address);

      // Handle local image upload properly for React Native
      if (profileImage && !profileImage.startsWith('http') && !profileImage.startsWith('data:')) {
        const filename = profileImage.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image/jpeg`;
        if (type === 'image/jpg') type = 'image/jpeg';

        formData.append('profile_image', {
          uri: Platform.OS === 'ios' ? profileImage.replace('file://', '') : profileImage,
          name: filename,
          type
        } as any);
      }

      // --- ACTUAL API INTEGRATION ---
      await customerProfileServices.updateGeneralProfile(formData);

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      // Log the full error to catch backend validation issues
      console.error('Profile Update Error:', JSON.stringify(error.response?.data || error.message, null, 2));

      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to update profile. Please try again.';
      Alert.alert('Update Failed', errorMsg);
    } finally {
      setSaving(false);
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
    <OtherPagesInc title="Profile Details">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.bg }]}
          keyboardShouldPersistTaps="handled"
        >

          {/* --- Header / Avatar --- */}
          <View style={styles.headerContainer}>

            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.avatarWrapper}>
                 <Image
                   source={profileImage ? { uri: profileImage } : { uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                   style={[styles.avatar, { borderColor: theme.card }]}
                   contentFit="cover"
                   transition={200}
                 />
                <View style={[styles.cameraButton, { backgroundColor: theme.primary, borderColor: theme.card }]}>
                  <Ionicons name="camera" size={18} color="#000000" />
                </View>
              </TouchableOpacity>

              <View style={styles.idBadgeContainer}>
                <View style={[styles.idBadge, { backgroundColor: theme.idBadgeBg }]}>
                  <Text style={[styles.idLabel, { color: isDark ? theme.primary : '#005BC1' }]}>ID: </Text>
                  <Text style={[styles.idValue, { color: isDark ? theme.primary : '#005BC1' }]}>{userId || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* --- Form Section --- */}
          <View style={styles.formContainer}>

            {/* Personal Details Card */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="person-outline" size={20} color={isDark ? theme.primary : '#005BC1'} />
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Personal Details</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Full Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      borderColor: theme.border,
                      borderWidth: 1
                    }
                  ]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Your full name"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Gender</Text>
                <View style={styles.genderRow}>
                  {['Male', 'Female'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderPill,
                        { backgroundColor: theme.inputBg },
                        gender === g && [styles.genderPillActive, { backgroundColor: theme.primary }]
                      ]}
                      onPress={() => setGender(g as 'Male' | 'Female')}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={g === 'Male' ? 'male' : 'female'}
                        size={16}
                        color={gender === g ? '#000000' : theme.textSecondary}
                      />
                      <Text style={[
                        styles.genderText,
                        { color: theme.textSecondary },
                        gender === g && [styles.genderTextActive, { color: '#000000', fontWeight: '700' }]
                      ]}>
                        {g}
                      </Text>
                      {gender === g && (
                        <View style={styles.genderCheck}>
                          <Ionicons name="checkmark" size={10} color={isDark ? theme.primary : '#005BC1'} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Date of Birth</Text>
                <View style={styles.dobRow}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.dobInput,
                      {
                        backgroundColor: theme.inputBg,
                        color: theme.textPrimary,
                        borderColor: theme.border,
                        borderWidth: 1
                      }
                    ]}
                    value={day} onChangeText={setDay} placeholder="DD"
                    keyboardType="numeric" maxLength={2}
                    placeholderTextColor={theme.textSecondary}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.dobInput,
                      {
                        backgroundColor: theme.inputBg,
                        color: theme.textPrimary,
                        borderColor: theme.border,
                        borderWidth: 1
                      }
                    ]}
                    value={month} onChangeText={setMonth} placeholder="MM"
                    keyboardType="numeric" maxLength={2}
                    placeholderTextColor={theme.textSecondary}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.dobInput,
                      {
                        flex: 1.5,
                        backgroundColor: theme.inputBg,
                        color: theme.textPrimary,
                        borderColor: theme.border,
                        borderWidth: 1
                      }
                    ]}
                    value={year} onChangeText={setYear} placeholder="YYYY"
                    keyboardType="numeric" maxLength={4}
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              </View>
            </View>

            {/* Contact Card */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="call-outline" size={20} color={isDark ? theme.primary : '#005BC1'} />
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Contact Info</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Email Address</Text>
                <View style={[
                  styles.input,
                  styles.inputWithAction,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.border,
                    borderWidth: 1
                  }
                ]}>
                  <TextInput
                    style={{ flex: 1, color: theme.textSecondary }}
                    value={email}
                    editable={false}
                  />
                  {isEmailVerified ? (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => router.push('/pages/profile/verifyEmail')}>
                      <Text style={[styles.actionLink, { color: theme.textLink }]}>Verify</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={[styles.label, { color: theme.textPrimary, marginBottom: 0 }]}>Phone Number</Text>
                  <Text style={{ fontSize: 12, color: theme.textSecondary, fontWeight: '500' }}>Changed: {phoneChangeCount} times</Text>
                </View>
                <View style={[
                  styles.input,
                  styles.inputWithAction,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.border,
                    borderWidth: 1
                  }
                ]}>
                  <TextInput
                    style={{ flex: 1, color: theme.textSecondary }}
                    value={phone}
                    editable={false}
                  />
                  {phoneChangeCount >= 2 ? (
                    <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '500' }}>Limit Reached</Text>
                  ) : (
                    <TouchableOpacity onPress={() => router.push('/pages/profile/verifyNumber')}>
                      <Text style={[styles.actionLink, { color: theme.textLink }]}>Change</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {/* Identity Card */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="shield-checkmark-outline" size={20} color={isDark ? theme.primary : '#005BC1'} />
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Identity</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>PAN Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      borderColor: theme.border,
                      borderWidth: 1
                    }
                  ]}
                  value={panNumber}
                  onChangeText={setPanNumber}
                  placeholder="ABCDE1234F"
                  autoCapitalize="characters"
                  maxLength={10}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Aadhar Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      borderColor: theme.border,
                      borderWidth: 1
                    }
                  ]}
                  value={aadharNumber}
                  onChangeText={setAadharNumber}
                  placeholder="0000 0000 0000"
                  keyboardType="numeric"
                  maxLength={14}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </View>

            {/* Additional Info Card */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="people-outline" size={20} color={isDark ? theme.primary : '#005BC1'} />
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Additional Info</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Father's Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      borderColor: theme.border,
                      borderWidth: 1
                    }
                  ]}
                  value={fatherName}
                  onChangeText={setFatherName}
                  placeholder="Father's full name"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </View>

            {/* Address Details Card */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="location-outline" size={20} color={isDark ? theme.primary : '#005BC1'} />
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Address Details</Text>
              </View>

              <View style={styles.dobRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.label, { color: theme.textPrimary }]}>City</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.inputBg,
                        color: theme.textPrimary,
                        borderColor: theme.border,
                        borderWidth: 1
                      }
                    ]}
                    value={city}
                    onChangeText={setCity}
                    placeholder="City"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.label, { color: theme.textPrimary }]}>State</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.inputBg,
                        color: theme.textPrimary,
                        borderColor: theme.border,
                        borderWidth: 1
                      }
                    ]}
                    value={state}
                    onChangeText={setState}
                    placeholder="State"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Pincode</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      borderColor: theme.border,
                      borderWidth: 1
                    }
                  ]}
                  value={pincode}
                  onChangeText={setPincode}
                  placeholder="Pincode"
                  keyboardType="numeric"
                  maxLength={6}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Full Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      borderColor: theme.border,
                      borderWidth: 1,
                      height: 80,
                      textAlignVertical: 'top',
                    }
                  ]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your full address"
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </View>

            {/* Save Button */}
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: theme.primary },
                  saving && styles.saveButtonDisabled
                ]}
                onPress={handleUpdate}
                disabled={saving}
                activeOpacity={0.9}
              >
                {saving ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <Text style={[styles.saveButtonText, { color: '#000000' }]}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </OtherPagesInc>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  scrollContent: {
    paddingBottom: 60,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },

  // --- Header ---
  headerContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },

  avatarSection: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  idBadgeContainer: {
    marginTop: 5,
  },
  idBadge: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  idLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  idValue: {
    fontSize: 12,
    fontWeight: '800',
  },

  // --- Form Layout ---
  formContainer: {
    paddingHorizontal: 0,
  },
  card: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // --- Inputs ---
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSub,
    marginBottom: 4,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  inputWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionLink: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '700',
  },

  // --- Gender Select ---
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  genderPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  genderPillActive: {
    backgroundColor: COLORS.primary,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSub,
  },
  genderTextActive: {
    color: '#fff',
  },
  genderCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 1,
  },

  // --- Date Inputs ---
  dobRow: {
    flexDirection: 'row',
    gap: 16,
  },
  dobInput: {
    flex: 1,
    textAlign: 'center',
  },

  // --- Footer ---
  footerContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});