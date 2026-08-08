import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import OtherPagesInc from '@/components/includes/otherPagesInc';
import { useAppearance } from '@/context/AppearanceContext';

// IMPORTANT: Adjust this path to wherever your profileServices file is located
import customerProfileServices from '@/services/api/methods/profileService';

const VerifyEmailPage = () => {
  const router = useRouter();
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    card: isDark ? '#040410' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#B5B2B1' : '#6B7280',
    border: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
    primary: isDark ? '#f8b917' : '#005BC1',
    primaryText: isDark ? '#000000' : '#FFFFFF',
    inputBg: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F5F5F5',
  };
  
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Loading States
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-retreat on empty string (handled via keypress for better UX, but keeping this as fallback)
    if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const showTemporaryMessage = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // --- API Integrations ---

  const handleSendOtp = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    try {
      // Adjust payload keys if your API expects something different
      await customerProfileServices.sendUpdateOtp({ 
    type: 'email', 
    value: email.trim() 
  });
      
      setSuccessMessage(`OTP sent to ${email}`);
      setStep('otp');
    } catch (error: any) {
      console.error('Send OTP Error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to send OTP. Please try again.';
      Alert.alert('Error', errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    try {
      // Adjust payload keys if your API expects something different
      await customerProfileServices.verifyAndUpdate({ 
    type: 'email', 
    value: email.trim(), 
    otp: otpCode 
  });
      
      showTemporaryMessage("Email verified successfully!");
      
      // Delay briefly so the user sees the success message before navigating back
      setTimeout(() => {
        router.back();
      }, 1500);
      
    } catch (error: any) {
      console.error('Verify OTP Error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Invalid OTP. Please check and try again.';
      Alert.alert('Verification Failed', errorMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <OtherPagesInc>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.innerContainer, { backgroundColor: theme.bg }]}>
            
            <Text style={[styles.title, { color: theme.textPrimary }]}>Verify Email</Text>

            {successMessage && (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#00A884" />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            )}

            {step === 'email' && (
              <View style={styles.formContainer}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Enter Email Address</Text>
                
                <TextInput
                  style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.border }]}
                  placeholder="Enter Email Address"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSending}
                />

                <TouchableOpacity 
                  style={[styles.primaryBtn, { backgroundColor: theme.primary }, isSending && styles.disabledBtn]}
                  activeOpacity={0.8}
                  onPress={handleSendOtp}
                  disabled={isSending}
                >
                  {isSending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={[styles.primaryBtnText, { color: theme.primaryText }]}>Continue</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {step === 'otp' && (
              <View style={styles.formContainer}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Enter OTP to Verify</Text>
                
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => { inputRefs.current[index] = ref }} 
                        style={[styles.otpInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.border }]}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        placeholder="0"
                        placeholderTextColor={theme.textSecondary}
                        editable={!isVerifying}
                        />
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.primaryBtn, { backgroundColor: theme.primary }, isVerifying && styles.disabledBtn]}
                  activeOpacity={0.8}
                  onPress={handleVerifyOtp}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={[styles.primaryBtnText, { color: theme.primaryText }]}>Verify Email</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.resendBtn}
                    onPress={() => {
                        setStep('email');
                        setOtp(['', '', '', '', '', '']); // Clear OTP when going back
                    }}
                    disabled={isVerifying}
                >
                    <Text style={[styles.resendText, { color: theme.primary }]}>Change Email</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </OtherPagesInc>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', 
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  successText: {
    color: '#00A884', 
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  formContainer: {
    flex: 1,
    marginTop: 80, 
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 48,  
    height: 48,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#005BC1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendBtn: {
      marginTop: 20,
      alignItems: 'center',
  },
  resendText: {
      color: '#005BC1',
      fontSize: 14,
      fontWeight: '500',
  }
});

export default VerifyEmailPage;