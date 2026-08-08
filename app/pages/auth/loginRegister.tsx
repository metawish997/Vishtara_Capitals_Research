/* eslint-disable react/no-unescaped-entities */
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Platform, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback,
  Keyboard, ScrollView, Alert, ActivityIndicator, Dimensions
} from 'react-native';
import { useAppearance } from '@/context/AppearanceContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';

import { authService } from '../../../services/api/methods/authService';
import { useAuth } from '../../../context/AuthContext';
import { notificationService } from '../../../services/notificationService';
import AnimatedBackground from '../../../components/AnimatedBackground';
import BrandLogo from '../../../components/BrandLogo';

// --- Constants ---
const { width } = Dimensions.get('window');

const LoginRegisterPage = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#020210',
    textSecondary: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    accent: isDark ? '#f8b917' : '#011d52',
    inputBg: isDark ? 'rgba(255,255,255,0.05)' : '#F8F9FA',
    border: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    btnText: isDark ? '#020210' : '#FFFFFF',
  };
  const styles = getStyles(theme);

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'mobile' | 'otp'>('login');
  const [loading, setLoading] = useState(false);

  // Form Data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [tempKey, setTempKey] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  // --- Handlers ---
  const proceedWithLoginFlow = async (token: string, user: any) => {
    try {
      const policyRes = await authService.getAcceptancePolicy(token);

      // Match the API exactly: success === true && show_policy === true
      if (policyRes?.success === true && policyRes?.show_policy === true) {
        router.replace({
          pathname: '/pages/auth/acceptance',
          params: {
            token: token,
            userStr: JSON.stringify(user)
          }
        });
      } else {
        // No policy needed, log user directly in
        await signIn(token, user);
      }
    } catch (error) {
      // If endpoint fails, fallback to standard login
      await signIn(token, user);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const fcmToken = await notificationService.registerForPushNotificationsAsync();
      
      const payload: any = { email, password };
      console.log("===============================");
      console.log("FCM Token on Login:", fcmToken ? fcmToken : "NULL (No token generated or Expo Go)");
      console.log("===============================");

      if (fcmToken !== null && fcmToken !== undefined && fcmToken.length > 0) {
        payload.fcm_token = fcmToken;
      }
      
      const response = await authService.login(payload);
      if (response.token) {
        await proceedWithLoginFlow(response.token, response.user);
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      const msg = error.response?.data?.message || error.message || "Login failed.";
      Alert.alert("Error", msg);
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password) return Alert.alert("Missing Fields", "Please fill in all details.");
    if (password !== confirmPassword) return Alert.alert("Password Error", "Passwords do not match!");

    // Move directly to mobile step; we call API after getting phone number
    setAuthMode('mobile');
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) return Alert.alert("Invalid Mobile", "Please enter a valid mobile number.");
    setLoading(true);
    try {
      await authService.sendOtp(email, phone);
      setAuthMode('otp');
      Alert.alert("OTP Sent", "Please check your mobile messages.");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 4) return Alert.alert("Invalid OTP", "Please enter the complete OTP.");

    setLoading(true);
    try {
      const fcmToken = await notificationService.registerForPushNotificationsAsync();
      
      const payload: any = {
        name: fullName,
        email: email,
        phone: phone,
        password: password,
        otp: otpCode,
        annual_income: 'Below 1L',
        is_age_verified: true,
      };

      if (fcmToken !== null && fcmToken !== undefined && fcmToken.length > 0) {
        payload.fcm_token = fcmToken;
      }

      const response = await authService.register(payload);
      
      if (response.token) {
        await proceedWithLoginFlow(response.token, response.user);
      } else {
        setAuthMode('login');
        Alert.alert("Verified", "Please login with your new account.");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Register Error:", error);
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        Alert.alert("Validation Error", Array.isArray(firstError) ? String(firstError[0]) : "Invalid input");
      } else {
        Alert.alert("Error", error.response?.data?.message || error.message || "Registration failed.");
      }
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text.length === 1 && index < 5) inputRefs.current[index + 1]?.focus();
    if (text.length === 0 && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const getButtonText = () => {
    if (loading) return "Please wait...";
    switch (authMode) {
      case 'login': return 'Log In';
      case 'register': return 'Continue';
      case 'mobile': return 'Send Verification Code';
      case 'otp': return 'Verify & Complete';
    }
  };

  const handleAction = () => {
    if (loading) return;
    switch (authMode) {
      case 'login': handleLogin(); break;
      case 'register': handleRegister(); break;
      case 'mobile': handleSendOtp(); break;
      case 'otp': handleVerifyOtp(); break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

      <AnimatedBackground isDark={isDark} themeAccent={theme.accent} themeBg={theme.bg} showCandles={false} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.header}>
                <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  if (authMode === 'otp') setAuthMode('mobile');
                  else if (authMode === 'mobile') setAuthMode('register');
                  else if (authMode === 'register') setAuthMode('login');
                  else router.back();
                }}
              >
                <Feather name="arrow-left" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.logoArea}>
              <BrandLogo width={340} height={110} style={{ marginBottom: -8 }} />
            </View>

            <View style={styles.bottomSheet}>
              <View style={styles.titleSection}>
              <Text style={styles.title}>
                {authMode === 'login' ? 'Welcome back'
                  : authMode === 'register' ? 'Create Account'
                    : authMode === 'mobile' ? 'Mobile Number'
                      : 'Verification'}
              </Text>
              <Text style={styles.subtitle}>
                {authMode === 'login' ? 'Enter your details to access your account.'
                  : authMode === 'register' ? 'Sign up to start your investment journey.'
                    : authMode === 'mobile' ? 'We need your mobile number for verification.'
                      : `Enter the 6-digit code sent to +91 ${phone}`}
              </Text>
            </View>

            <View style={styles.formContainer}>

              {authMode === 'register' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput style={styles.input} placeholder="e.g. John Doe" placeholderTextColor={theme.textSecondary} value={fullName} onChangeText={setFullName} autoCapitalize="words" />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput style={styles.input} placeholder="e.g. john@example.com" placeholderTextColor={theme.textSecondary} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput style={styles.passwordInput} placeholder="Create a password" placeholderTextColor={theme.textSecondary} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                      <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                        <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={theme.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput style={styles.passwordInput} placeholder="Re-enter password" placeholderTextColor={theme.textSecondary} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} />
                      <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color={theme.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              {authMode === 'mobile' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <View style={styles.phoneContainer}>
                    <View style={styles.countryCodeBox}>
                      <Text style={styles.countryCode}>+91</Text>
                    </View>
                    <TextInput style={styles.phoneInput} placeholder="Enter 10-digit number" placeholderTextColor={theme.textSecondary} value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={10} />
                  </View>
                </View>
              )}

              {authMode === 'otp' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>One Time Password</Text>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput key={index} ref={(ref) => { inputRefs.current[index] = ref }} style={[styles.otpInput, digit ? styles.otpInputFilled : null]} value={digit} onChangeText={(text) => handleOtpChange(text, index)} keyboardType="number-pad" maxLength={1} placeholder="•" placeholderTextColor={theme.textSecondary} />
                    ))}
                  </View>
                  <TouchableOpacity onPress={handleSendOtp} style={styles.resendBtn}>
                    <Text style={styles.resendText}>Resend Code</Text>
                  </TouchableOpacity>
                </View>
              )}

              {authMode === 'login' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email or Mobile</Text>
                    <TextInput style={styles.input} placeholder="Enter your email or phone" placeholderTextColor={theme.textSecondary} value={email} onChangeText={setEmail} autoCapitalize="none" />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput style={styles.passwordInput} placeholder="Enter your password" placeholderTextColor={theme.textSecondary} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                      <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                        <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={theme.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.optionsRow}>
                    <TouchableOpacity style={styles.checkboxContainer} activeOpacity={0.8} onPress={() => setKeepSignedIn(!keepSignedIn)}>
                      <MaterialCommunityIcons name={keepSignedIn ? "checkbox-marked" : "checkbox-blank-outline"} size={22} color={keepSignedIn ? theme.accent : theme.textSecondary} />
                      <Text style={styles.checkboxLabel}>Remember me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/pages/auth/forgotPassword')}>
                      <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={handleAction} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={theme.btnText} />
                ) : (
                  <Text style={styles.primaryBtnText}>{getButtonText()}</Text>
                )}
              </TouchableOpacity>

              {(authMode === 'login' || authMode === 'register') && (
                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>
                    {authMode === 'login' ? "New here? " : "Already have an account? "}
                  </Text>
                  <TouchableOpacity onPress={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                    <Text style={styles.linkText}>
                      {authMode === 'login' ? 'Create Account' : 'Log In'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </View>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, flexGrow: 1 },
  header: { marginTop: 10, marginBottom: 10, alignItems: 'flex-start' },
  backButton: { padding: 8, marginLeft: -8, backgroundColor: 'transparent' },
  logoArea: { alignItems: 'center', marginBottom: 0, marginTop: 40 },
  bottomSheet: {
    backgroundColor: 'transparent',
    flex: 1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingTop: 24,
    marginTop: 0,
  },
  titleSection: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontFamily: 'Manrope_800ExtraBold', color: theme.textPrimary, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, fontFamily: 'Manrope_500Medium', color: theme.textSecondary, lineHeight: 22, textAlign: 'center' },
  formContainer: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontFamily: 'Manrope_600SemiBold', color: theme.textPrimary, marginBottom: 8 },
  input: { width: '100%', height: 56, backgroundColor: theme.inputBg, borderRadius: 12, paddingHorizontal: 16, fontSize: 15, color: theme.textPrimary, borderWidth: 1, borderColor: theme.border, fontFamily: 'Manrope_400Regular' },
  phoneContainer: { flexDirection: 'row', height: 56, backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  countryCodeBox: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, borderRightWidth: 1, borderRightColor: theme.border, backgroundColor: 'transparent' },
  countryCode: { fontSize: 15, color: theme.textPrimary, fontFamily: 'Manrope_600SemiBold' },
  phoneInput: { flex: 1, height: '100%', paddingHorizontal: 16, fontSize: 15, color: theme.textPrimary, fontFamily: 'Manrope_400Regular' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 56, backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16 },
  passwordInput: { flex: 1, height: '100%', fontSize: 15, color: theme.textPrimary, fontFamily: 'Manrope_400Regular' },
  eyeIcon: { padding: 8 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 4 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkboxLabel: { fontSize: 14, color: theme.textSecondary, marginLeft: 6, fontFamily: 'Manrope_500Medium' },
  forgotPasswordText: { fontSize: 14, color: theme.accent, fontFamily: 'Manrope_600SemiBold' },
  primaryBtn: { width: '100%', height: 56, backgroundColor: theme.accent, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: theme.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { color: theme.btnText, fontSize: 16, fontFamily: 'Manrope_700Bold' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14, color: theme.textSecondary, fontFamily: 'Manrope_500Medium' },
  linkText: { fontSize: 14, color: theme.accent, fontFamily: 'Manrope_700Bold' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  otpInput: { width: width / 7.5, height: 54, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.border, borderRadius: 10, textAlign: 'center', fontSize: 20, color: theme.textPrimary, fontFamily: 'Manrope_600SemiBold' },
  otpInputFilled: { borderColor: theme.accent, backgroundColor: 'transparent' },
  resendBtn: { alignSelf: 'center', padding: 8 },
  resendText: { color: theme.accent, fontFamily: 'Manrope_600SemiBold', fontSize: 14 },
});

export default LoginRegisterPage;