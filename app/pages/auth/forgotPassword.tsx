import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Platform, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback,
  Keyboard, ScrollView, Alert, ActivityIndicator, Dimensions
} from 'react-native';
import { useAppearance } from '@/context/AppearanceContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';

import { authService } from '../../../services/api/methods/authService';
import AnimatedBackground from '../../../components/AnimatedBackground';
import BrandLogo from '../../../components/BrandLogo';

const { width } = Dimensions.get('window');

type Step = 'request' | 'verify' | 'reset';

export default function ForgotPasswordPage() {
  const router = useRouter();
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

  const [step, setStep] = useState<Step>('request');
  const [loading, setLoading] = useState(false);

  // Form Data
  const [contact, setContact] = useState(''); // Email or Phone
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleRequestOtp = async () => {
    if (!contact) return Alert.alert("Missing Field", "Please enter your email or mobile number.");
    setLoading(true);
    try {
      await authService.requestPasswordReset(contact);
      setStep('verify');
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) return Alert.alert("Invalid OTP", "Please enter the complete 6-digit OTP.");
    setLoading(true);
    try {
      const res = await authService.verifyResetOtp(otpCode);
      setResetToken(res.token || '');
      setStep('reset');
    } catch (error: any) {
      Alert.alert("Error", error.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return Alert.alert("Missing Field", "Please enter a new password.");
    if (newPassword !== confirmPassword) return Alert.alert("Password Error", "Passwords do not match.");
    setLoading(true);
    try {
      await authService.resetPassword(newPassword, resetToken);
      Alert.alert("Success", "Your password has been reset successfully.", [
        { text: "Log In", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to reset password.");
    } finally {
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
    switch (step) {
      case 'request': return 'Send Verification Code';
      case 'verify': return 'Verify Code';
      case 'reset': return 'Update Password';
    }
  };

  const handleAction = () => {
    if (loading) return;
    switch (step) {
      case 'request': handleRequestOtp(); break;
      case 'verify': handleVerifyOtp(); break;
      case 'reset': handleResetPassword(); break;
    }
  };

  const handleBack = () => {
    if (step === 'reset') setStep('verify');
    else if (step === 'verify') setStep('request');
    else router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

      <AnimatedBackground isDark={isDark} themeAccent={theme.accent} themeBg={theme.bg} />

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
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Feather name="arrow-left" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.logoArea}>
                <BrandLogo width={340} height={110} style={{ marginBottom: -8 }} />
              </View>

              <View style={styles.bottomSheet}>
                <View style={styles.titleSection}>
                  <Text style={styles.title}>
                    {step === 'request' ? 'Forgot Password'
                      : step === 'verify' ? 'Verification'
                        : 'New Password'}
                  </Text>
                  <Text style={styles.subtitle}>
                    {step === 'request' ? 'Enter your email or mobile to reset password.'
                      : step === 'verify' ? `Enter the 6-digit code sent to ${contact}`
                        : 'Create a strong new password.'}
                  </Text>
                </View>

                <View style={styles.formContainer}>
                  {step === 'request' && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Email or Mobile Number</Text>
                      <TextInput 
                        style={styles.input} 
                        placeholder="Enter your email or phone" 
                        placeholderTextColor={theme.textSecondary} 
                        value={contact} 
                        onChangeText={setContact} 
                        autoCapitalize="none" 
                      />
                    </View>
                  )}

                  {step === 'verify' && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>One Time Password (Use 123456 to test)</Text>
                      <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                          <TextInput 
                            key={index} 
                            ref={(ref) => { inputRefs.current[index] = ref }} 
                            style={[styles.otpInput, digit ? styles.otpInputFilled : null]} 
                            value={digit} 
                            onChangeText={(text) => handleOtpChange(text, index)} 
                            keyboardType="number-pad" 
                            maxLength={1} 
                            placeholder="•" 
                            placeholderTextColor={theme.textSecondary} 
                          />
                        ))}
                      </View>
                      <TouchableOpacity onPress={handleRequestOtp} style={styles.resendBtn}>
                        <Text style={styles.resendText}>Resend Code</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {step === 'reset' && (
                    <>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.passwordContainer}>
                          <TextInput 
                            style={styles.passwordInput} 
                            placeholder="Enter new password" 
                            placeholderTextColor={theme.textSecondary} 
                            value={newPassword} 
                            onChangeText={setNewPassword} 
                            secureTextEntry={!showPassword} 
                          />
                          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={theme.textSecondary} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <View style={styles.passwordContainer}>
                          <TextInput 
                            style={styles.passwordInput} 
                            placeholder="Re-enter password" 
                            placeholderTextColor={theme.textSecondary} 
                            value={confirmPassword} 
                            onChangeText={setConfirmPassword} 
                            secureTextEntry={!showConfirmPassword} 
                          />
                          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color={theme.textSecondary} />
                          </TouchableOpacity>
                        </View>
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
                </View>
              </View>

            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, flexGrow: 1 },
  header: { marginTop: 10, marginBottom: 10, alignItems: 'flex-start' },
  backButton: { padding: 8, marginLeft: -8, backgroundColor: 'transparent' },
  logoArea: { alignItems: 'center', marginBottom: 0, marginTop: 40 },
  bottomSheet: {
    backgroundColor: theme.bg,
    flex: 1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingTop: 24,
    marginTop: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: theme.textPrimary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  titleSection: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontFamily: 'Manrope_800ExtraBold', color: theme.textPrimary, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, fontFamily: 'Manrope_500Medium', color: theme.textSecondary, lineHeight: 22, textAlign: 'center' },
  formContainer: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontFamily: 'Manrope_600SemiBold', color: theme.textPrimary, marginBottom: 8 },
  input: { width: '100%', height: 56, backgroundColor: theme.inputBg, borderRadius: 12, paddingHorizontal: 16, fontSize: 15, color: theme.textPrimary, borderWidth: 1, borderColor: theme.border, fontFamily: 'Manrope_400Regular' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 56, backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16 },
  passwordInput: { flex: 1, height: '100%', fontSize: 15, color: theme.textPrimary, fontFamily: 'Manrope_400Regular' },
  eyeIcon: { padding: 8 },
  primaryBtn: { width: '100%', height: 56, backgroundColor: theme.accent, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 24, shadowColor: theme.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { color: theme.btnText, fontSize: 16, fontFamily: 'Manrope_700Bold' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  otpInput: { width: width / 7.5, height: 54, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.border, borderRadius: 10, textAlign: 'center', fontSize: 20, color: theme.textPrimary, fontFamily: 'Manrope_600SemiBold' },
  otpInputFilled: { borderColor: theme.accent, backgroundColor: 'transparent' },
  resendBtn: { alignSelf: 'center', padding: 8 },
  resendText: { color: theme.accent, fontFamily: 'Manrope_600SemiBold', fontSize: 14 },
});
