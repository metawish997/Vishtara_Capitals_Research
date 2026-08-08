// app/KycAgreementPage.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import OtherPagesInc from '@/components/includes/otherPagesInc';
import { useAppearance } from '@/context/AppearanceContext';
import customerProfileServices from '@/services/api/methods/profileService';
import kycService from '@/services/api/methods/kycService';
import agreementService from '@/services/api/methods/agreementService';

// --- Constants ---
const THEME_COLOR = '#8cc63f';
const BG_COLOR = '#FFFFFF';
const CARD_BG = '#FFFFFF';
const { width } = Dimensions.get('window');

export default function KycAgreementPage() {
  const router = useRouter();
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#FFFFFF',
    card: isDark ? '#040410' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#B5B2B1' : '#6B7280',
    border: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
    primary: isDark ? '#f8b917' : '#8cc63f',
    danger: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    btnText: isDark ? '#000000' : '#FFFFFF',
    docHeaderBg: isDark ? '#14142B' : '#F3F4F6',
  };

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [userName, setUserName] = useState('');
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved' | 'verified' | 'rejected' | string>('pending');
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [kycDetails, setKycDetails] = useState<any>(null);
  const [aadhaarDetails, setAadhaarDetails] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'kyc' | 'agreement'>('kyc');
  const [digioActive, setDigioActive] = useState<boolean>(true);

  const [processingAgreementId, setProcessingAgreementId] = useState<string | null>(null);
  const [accountAgreements, setAccountAgreements] = useState<any[]>([]);

  const mountedRef = useRef(true);

  // ---------- Helpers ----------
  const isApproved = (s: string) => {
    if (!s) return false;
    const v = s.toLowerCase();
    return v === 'approved' || v === 'verified';
  };

  const extractSignatureFromKyc = (kyc: any) => {
    if (!kyc) return null;
    const actions = kyc.raw_response?.actions;
    if (!Array.isArray(actions)) return null;

    const sigAction = actions.find((a: any) =>
      a?.type === 'signature' ||
      a?.action_ref?.includes?.('signature') ||
      (a?.type === 'image' && a?.rules_data?.strict_validation_types?.includes?.('signature'))
    );

    let rawImage: any = null;
    if (sigAction) {
      rawImage = sigAction.file ?? sigAction.details?.image ?? sigAction.output_image ?? null;
    }

    if (!rawImage) {
      const digilocker = actions.find((a: any) => a?.type === 'digilocker');
      rawImage = digilocker?.details?.aadhaar?.image ?? null;
    }

    if (!rawImage) return null;
    return typeof rawImage === 'string' && rawImage.startsWith('http') ? rawImage : `data:image/jpeg;base64,${rawImage}`;
  };

  const extractKycUrlFromProfile = (userObj: any): string | null => {
    const kyc = userObj?.kyc ?? userObj?.kyc_details ?? null;
    if (!kyc) return null;

    if (typeof kyc.kyc_url === 'string' && kyc.kyc_url) return kyc.kyc_url;
    if (typeof kyc.url === 'string' && kyc.url) return kyc.url;
    if (typeof kyc.document_id === 'string' && kyc.document_id) {
      return `https://app.digio.in/#/gateway/login/${kyc.document_id}`;
    }

    const raw = kyc.raw_response ?? null;
    if (raw) {
      if (typeof raw.kyc_url === 'string' && raw.kyc_url) return raw.kyc_url;
      if (typeof raw.redirect_url === 'string' && raw.redirect_url) return raw.redirect_url;
      const candidate = raw?.data?.document_id ?? raw?.data?.documentId ?? raw?.document_id ?? raw?.id;
      if (candidate) return `https://app.digio.in/#/gateway/login/${candidate}`;
    }

    return null;
  };


  const handleOpenEsignForAgreement = async (agr: any) => {
    console.log('[DEBUG] Clicked Complete E-Sign for Agreement:', agr.agreement_number);
    console.log('[DEBUG] Agreement details:', JSON.stringify({ is_draft: agr.is_draft, is_user_agreement: agr.is_user_agreement, status: agr.status }));

    try {
      setProcessingAgreementId(agr._id);
      if (agr.is_user_agreement) {
        console.log('[DEBUG] Executing UserAgreement flow for:', agr._id);
        const res: any = await agreementService.completeUserAgreementEsign(agr._id);
        console.log('[DEBUG] UserAgreement API Response:', JSON.stringify(res, null, 2));

        if (res.success && res.redirect_url) {
          const encodedUrl = encodeURIComponent(res.redirect_url);
          const digioDocId = res.digio_document_id || '';
          router.push(`/pages/subscription/DigioEsignWebView?url=${encodedUrl}&digio_document_id=${digioDocId}` as any);
        } else {
          Alert.alert('Error', res.message || 'Failed to initiate e-sign.');
        }
      } else if (agr.is_draft) {
        const payload = {
          plan_id: agr.plan_id,
          duration_id: agr.duration_id,
          plan_name: agr.plan_name,
          duration: agr.duration,
          features: agr.features || [],
          planAmount: String(agr.amount || 0),
          coupon_code: null,
          current_url: 'https://www.vishtaracapitalresearch.in/'
        };
        console.log('[DEBUG] Executing DraftAgreement flow with payload:', JSON.stringify(payload, null, 2));

        const res: any = await agreementService.storeDraftAgreement(payload);
        console.log('[DEBUG] DraftAgreement API Response:', JSON.stringify(res, null, 2));

        if (res.success && res.redirect_url) {
          const encodedUrl = encodeURIComponent(res.redirect_url);
          const digioDocId = res.digio_document_id || '';
          router.push(`/pages/subscription/DigioEsignWebView?url=${encodedUrl}&digio_document_id=${digioDocId}` as any);
        } else if (res.success && res.status === 'signed') {
          Alert.alert('Success', 'Agreement already signed!');
          fetchProfile(); // reload
        } else {
          Alert.alert('Error', res.message || 'Failed to generate e-sign link');
        }
      } else {
        console.log('[DEBUG] Agreement is neither is_user_agreement nor is_draft.');
        Alert.alert('Info', 'This agreement cannot be e-signed right now.');
      }
    } catch (error: any) {
      console.log('[DEBUG] Error caught in handleOpenEsignForAgreement:', JSON.stringify(error?.response?.data || error, null, 2));
      Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setProcessingAgreementId(null);
    }
  };
  // ---------- Profile fetch ----------
  const fetchProfile = useCallback(async () => {
    try {
      if (!mountedRef.current) return;
      setLoading(true);

      const [profileRes, statusRes, accountRes] = await Promise.all([
        customerProfileServices.getAllProfiles(),
        kycService.getKycStatus().catch(() => null),
        agreementService.getAccountServices().catch(() => null)
      ]);
      if (!mountedRef.current) return;

      if (statusRes && statusRes.success) {
        setDigioActive(statusRes.digio_active !== false);
      }

      if (accountRes && accountRes.success) {
        setAccountAgreements(accountRes.agreements || []);

        // Auto-verify any pending e-signs in the background (equivalent to web's redirect check)
        const pendingEsigns = (accountRes.agreements || []).filter((a: any) =>
          (a.status === 'esign_pending' || a.status === 'esign_required' || a.needs_esign) && a.digio_document_id
        );

        if (pendingEsigns.length > 0) {
          pendingEsigns.forEach(async (agr: any) => {
            try {
              const verifyRes: any = await agreementService.checkUserAgreementEsignStatus(agr.digio_document_id);
              if (verifyRes?.success && verifyRes?.status === 'signed') {
                // If verified successfully, fetch account services again to get the updated PDF path
                const updatedRes = await agreementService.getAccountServices().catch(() => null);
                if (updatedRes?.success && mountedRef.current) {
                  setAccountAgreements(updatedRes.agreements || []);
                }
              }
            } catch (err) {
              console.warn('Auto-verify esign failed for', agr.agreement_number, err);
            }
          });
        }
      }

      const user = profileRes?.user ?? profileRes?.data?.user ?? profileRes ?? {};
      setUserName(user?.name ?? user?.full_name ?? 'User');

      let currentStatus = statusRes?.kyc_status || (user?.kyc_status ?? user?.kyc?.status ?? 'pending').toString();
      setKycStatus(currentStatus);

      // If approved, fetch full details immediately
      if (['approved', 'verified', 'completed', 'success'].includes(currentStatus.toLowerCase())) {
        fetchFullDetails();
      } else if (['initiated', 'pending', 'approval_pending'].includes(currentStatus.toLowerCase())) {
        // Automatically start polling if not verified
        startPolling();
      }
    } catch (err) {
      console.warn('KYC fetch error:', err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const fetchFullDetails = async () => {
    try {
      const resp = await kycService.getKycFullDetails();
      if (resp?.success && mountedRef.current) {
        const rootKyc = resp.kyc || {};
        const details = resp.kyc_details || rootKyc.kyc_details || {};

        // Merge root image paths into kycDetails so the UI can find them
        const mergedDetails = {
          ...details,
          aadhaar_image: rootKyc.aadhaar_image || details.aadhaar_image,
          selfie_image: rootKyc.selfie_image || details.selfie_image,
          pan_image: rootKyc.pan_image || details.pan_image,
          signature_image: rootKyc.signature_image || details.signature_image,
        };

        setKycDetails(mergedDetails);
        setAadhaarDetails(resp.aadhaar_details || rootKyc.aadhaar_details);
        const sig = extractSignatureFromKyc(rootKyc);
        if (sig) setSignatureImage(sig);
      }
    } catch (err) {
      console.warn('Failed to fetch full KYC details', err);
    }
  };

  const startPolling = () => {
    if (isPolling) return;
    setIsPolling(true);
  };

  const stopPolling = () => {
    setIsPolling(false);
  };

  useEffect(() => {
    let intervalId: any;

    if (isPolling) {
      intervalId = setInterval(async () => {
        try {
          const resp = await kycService.getKycStatus();
          if (resp?.success && mountedRef.current) {
            const newStatus = resp.kyc_status;
            setKycStatus(newStatus);
            setDigioActive(resp.digio_active !== false);

            if (['approved', 'completed', 'success', 'failed', 'rejected'].includes(newStatus.toLowerCase())) {
              stopPolling();
              if (['approved', 'completed', 'success'].includes(newStatus.toLowerCase())) {
                fetchFullDetails();
              }
            }
          }
        } catch (err) {
          console.warn('Polling error:', err);
        }
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPolling]);

  useEffect(() => {
    mountedRef.current = true;
    fetchProfile();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchProfile]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  // ---------- Logic ----------
  const openKycInWebViewOrExternal = async (url: string) => {
    if (!url) return false;
    try {
      const encoded = encodeURIComponent(url);
      router.push(`/pages/kyc/KycWebView?url=${encoded}`);
      return true;
    } catch (err) {
      console.warn('router push failed, trying Linking.openURL', err);
      try {
        await Linking.openURL(url);
        return true;
      } catch (linkErr) {
        return false;
      }
    }
  };

  const findKycUrlFromFallbacks = async (): Promise<string | null> => {
    try {
      const resp: any = await customerProfileServices.getAllProfiles();
      const user = resp?.user ?? resp?.data?.user ?? resp ?? {};
      const fromProfile = extractKycUrlFromProfile(user);
      if (fromProfile) return fromProfile;
    } catch (e) { console.warn(e); }

    try {
      const statusResp: any = await kycService.getKycStatus();
      if (statusResp?.kyc_url) return statusResp.kyc_url;
      if (statusResp?.document_id) return `https://app.digio.in/#/gateway/login/${statusResp.document_id}`;
      if (statusResp?.data?.kyc_url) return statusResp.data.kyc_url;
      if (statusResp?.data?.document_id) return `https://app.digio.in/#/gateway/login/${statusResp.data.document_id}`;
      if (statusResp?.raw_response?.id) return `https://app.digio.in/#/gateway/login/${statusResp.raw_response.id}`;
    } catch (e) { console.warn(e); }

    return null;
  };

  const handleStartKyc = async () => {
    if (isApproved(kycStatus)) {
      Alert.alert('KYC Completed', 'Your KYC is already approved.');
      return;
    }

    if (starting) return;
    setStarting(true);

    try {
      const res: any = await kycService.startKyc();

      if (res?.kyc_url || res?.redirect_url) {
        const opened = await openKycInWebViewOrExternal(res.kyc_url || res.redirect_url);
        if (!opened) Alert.alert('Error', 'Unable to open KYC url.');
        startPolling();
        return;
      }

      if (res?.success) {
        const fallback = await findKycUrlFromFallbacks();
        if (fallback) {
          await openKycInWebViewOrExternal(fallback);
          return;
        }
        Alert.alert('KYC', res?.message ?? 'KYC started — check status.');
        return;
      }

      const fallback = await findKycUrlFromFallbacks();
      if (fallback) {
        await openKycInWebViewOrExternal(fallback);
        return;
      }

      Alert.alert('Error', res?.message ?? 'Unable to start KYC.');
    } catch (rawErr: any) {
      const axiosResp = rawErr?.response;
      if (axiosResp?.status === 422 || axiosResp?.status === 400) {
        const errData = axiosResp.data ?? {};
        const errUrl = errData?.kyc_url ?? errData?.data?.kyc_url ?? extractKycUrlFromProfile(errData);
        if (errUrl) {
          await openKycInWebViewOrExternal(errUrl);
          setStarting(false);
          startPolling();
          return;
        }
        const fallbackUrl = await findKycUrlFromFallbacks();
        if (fallbackUrl) {
          await openKycInWebViewOrExternal(fallbackUrl);
          setStarting(false);
          startPolling();
          return;
        }
        Alert.alert('Info', errData?.message ?? 'KYC in progress.');
        startPolling();
        return;
      }

      const fallbackUrl = await findKycUrlFromFallbacks();
      if (fallbackUrl) {
        await openKycInWebViewOrExternal(fallbackUrl);
        return;
      }
      Alert.alert('Error', rawErr?.message ?? 'Failed to start KYC.');
    } finally {
      setStarting(false);
    }
  };

  const handleRetryApproval = async () => {
    setLoading(true);
    try {
      const resp = await kycService.getKycStatus();
      if (resp?.success) {
        const newStatus = resp.kyc_status;
        setKycStatus(newStatus);
        setDigioActive(resp.digio_active !== false);
        if (['approved', 'completed', 'success'].includes(newStatus.toLowerCase())) {
          fetchFullDetails();
        } else {
          Alert.alert('Status Unchanged', 'Your KYC is still pending verification.');
        }
      }
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Failed to check status');
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI Rendering ----------
  const isComplete = isApproved(kycStatus);
  const statusColor = isComplete ? '#10B981' : '#F59E0B'; // Green or Amber
  const statusBg = isComplete ? '#ECFDF5' : '#FFFBEB';
  const statusIcon = isComplete ? 'shield-checkmark' : 'alert-circle';

  if (loading) {
    return (
      <OtherPagesInc title="KYC & Agreement">
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.loadingContainer, { backgroundColor: theme.bg }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </OtherPagesInc>
    );
  }

  return (
    <OtherPagesInc title="KYC & Agreement">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.bg }]}
        style={{ backgroundColor: theme.bg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Bar */}
        <View style={{ flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: theme.border }}>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === 'kyc' ? theme.primary : 'transparent' }}
            onPress={() => setActiveTab('kyc')}
          >
            <Text style={{ fontWeight: '600', fontSize: 15, color: activeTab === 'kyc' ? theme.primary : theme.textSecondary }}>KYC Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === 'agreement' ? theme.primary : 'transparent' }}
            onPress={() => setActiveTab('agreement')}
          >
            <Text style={{ fontWeight: '600', fontSize: 15, color: activeTab === 'agreement' ? theme.primary : theme.textSecondary }}>Agreements</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'kyc' ? (
          <>
            {/* Status Card */}
            <View style={[styles.statusCard, { backgroundColor: isDark ? (isComplete ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)') : statusBg, borderColor: statusColor }]}>
              <View style={styles.statusHeader}>
                <Ionicons name={statusIcon} size={24} color={statusColor} />
                <Text style={[styles.statusTitle, { color: isDark ? theme.textPrimary : statusColor }]}>
                  Status: {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                </Text>
              </View>
              <Text style={[styles.statusDesc, { color: theme.textSecondary }]}>
                {isComplete
                  ? "Your identity has been verified. You have full access to platform features."
                  : "Please complete your KYC verification to activate your account."}
              </Text>

              {!isComplete && kycStatus.toLowerCase() === 'approval_pending' && (
                <View style={{ marginTop: 8 }}>
                  <Text style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 12 }}>
                    KYC submitted, waiting for verification. This usually takes a few minutes.
                  </Text>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                    onPress={handleRetryApproval}
                  >
                    <Text style={[styles.actionBtnText, { color: theme.btnText }]}>Check Status Again</Text>
                    <Feather name="refresh-cw" size={16} color={theme.btnText} style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </View>
              )}

              {!isComplete && ['initiated', 'pending', 'approval_pending'].includes(kycStatus.toLowerCase()) && isPolling && (
                <View style={[styles.pollingContainer, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.05)' : '#FFFBEB', borderColor: theme.border }]}>
                  <ActivityIndicator size="small" color={theme.warning} />
                  <Text style={[styles.pollingText, { color: theme.warning }]}>Checking status automatically...</Text>
                </View>
              )}

              {!isComplete && !['approval_pending'].includes(kycStatus.toLowerCase()) && (
                digioActive ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.primary, opacity: isPolling ? 0.7 : 1 }]}
                    onPress={handleStartKyc}
                    disabled={starting || isPolling}
                  >
                    {starting ? (
                      <ActivityIndicator color={theme.btnText} size="small" />
                    ) : (
                      <>
                        <Text style={[styles.actionBtnText, { color: theme.btnText }]}>Complete KYC Now</Text>
                        <Feather name="external-link" size={16} color={theme.btnText} style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View style={{ marginTop: 12, padding: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6', borderRadius: 8 }}>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, textAlign: 'center' }}>
                      Automated KYC is currently offline. Your account will be verified manually by our support team.
                    </Text>
                  </View>
                )
              )}
            </View>

            {isComplete && kycDetails && (
              <>
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>VERIFIED PROFILE DETAILS</Text>
                <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Name (Aadhaar)</Text>
                    <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{kycDetails.name || aadhaarDetails?.name || userName}</Text>
                  </View>
                  <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Aadhaar Number</Text>
                    <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{kycDetails.aadhaar || 'XXXX-XXXX-XXXX'}</Text>
                  </View>
                  <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                  {kycDetails.pan && (
                    <>
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>PAN Number</Text>
                        <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{kycDetails.pan}</Text>
                      </View>
                      <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                    </>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Date of Birth</Text>
                    <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{kycDetails.dob || aadhaarDetails?.dob || '-'}</Text>
                  </View>
                  <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Address</Text>
                    <Text style={[styles.detailValue, { color: theme.textPrimary, flex: 2, textAlign: 'right' }]} numberOfLines={3}>
                      {kycDetails.address || aadhaarDetails?.current_address || '-'}
                    </Text>
                  </View>
                  {kycDetails.face_match !== null && kycDetails.face_match !== undefined && (
                    <>
                      <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Face Match Verified</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Feather name={kycDetails.face_match ? 'check-circle' : 'x-circle'} size={14} color={kycDetails.face_match ? theme.success : theme.danger} style={{ marginRight: 4 }} />
                          <Text style={[styles.detailValue, { color: kycDetails.face_match ? theme.success : theme.danger }]}>
                            {kycDetails.face_match ? 'Yes' : 'No'}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </View>

                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>DOCUMENTS & MEDIA</Text>
                <View style={styles.mediaGrid}>
                  {kycDetails.aadhaar_local_path || kycDetails.aadhaar_image || kycDetails.aadhaar_base64 ? (
                    <TouchableOpacity
                      style={[styles.mediaItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                      onPress={() => setModalImage(kycDetails.aadhaar_local_path || kycDetails.aadhaar_image || (kycDetails.aadhaar_base64 ? `data:image/jpeg;base64,${kycDetails.aadhaar_base64}` : null))}
                    >
                      <View style={[styles.mediaIconWrapper, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F3F4F6' }]}>
                        <Feather name="credit-card" size={24} color={theme.textSecondary} />
                      </View>
                      <Text style={[styles.mediaLabel, { color: theme.textPrimary }]}>Aadhaar</Text>
                    </TouchableOpacity>
                  ) : null}

                  {kycDetails.pan_local_path || kycDetails.pan_image ? (
                    <TouchableOpacity
                      style={[styles.mediaItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                      onPress={() => setModalImage(kycDetails.pan_local_path || kycDetails.pan_image)}
                    >
                      <View style={[styles.mediaIconWrapper, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F3F4F6' }]}>
                        <Feather name="file-text" size={24} color={theme.textSecondary} />
                      </View>
                      <Text style={[styles.mediaLabel, { color: theme.textPrimary }]}>PAN</Text>
                    </TouchableOpacity>
                  ) : null}

                  {signatureImage || kycDetails.signature_local_path || kycDetails.signature_image ? (
                    <TouchableOpacity
                      style={[styles.mediaItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                      onPress={() => setModalImage(signatureImage || kycDetails.signature_local_path || kycDetails.signature_image)}
                    >
                      <View style={[styles.mediaIconWrapper, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F3F4F6' }]}>
                        <Feather name="pen-tool" size={24} color={theme.textSecondary} />
                      </View>
                      <Text style={[styles.mediaLabel, { color: theme.textPrimary }]}>Signature</Text>
                    </TouchableOpacity>
                  ) : null}

                  {kycDetails.selfie_local_path || kycDetails.selfie_image ? (
                    <TouchableOpacity
                      style={[styles.mediaItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                      onPress={() => setModalImage(kycDetails.selfie_local_path || kycDetails.selfie_image)}
                    >
                      <View style={[styles.mediaIconWrapper, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F3F4F6' }]}>
                        <Feather name="camera" size={24} color={theme.textSecondary} />
                      </View>
                      <Text style={[styles.mediaLabel, { color: theme.textPrimary }]}>Selfie</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </>
            )}
          </>
        ) : (
          <>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>CLIENT AGREEMENTS</Text>
            {accountAgreements.length > 0 ? (
              accountAgreements.map((agr: any, idx: number) => {
                // Web app equivalent needsEsign logic:
                const needsEsign = agr.needs_esign
                  || (agr.status === 'esign_pending' && !agr.pdf_path)
                  || (agr.is_draft && (agr.status === 'kyc_pending') && !agr.pdf_path)
                  || (agr.status === 'esign_required' && !agr.pdf_path);
                const canEsign = needsEsign && isComplete;

                // Web app equivalent getAgreementStatusBadge:
                let statusLabel = agr.status || 'Pending';
                let statusColor = '#64748b';
                let statusBg = '#f1f5f9';

                if (!agr.is_draft && !agr.is_user_agreement) {
                  statusLabel = 'Finalized'; statusColor = theme.success; statusBg = 'rgba(40, 199, 111, 0.1)';
                } else if (agr.status === 'Finalized') {
                  statusLabel = 'Finalized'; statusColor = theme.success; statusBg = 'rgba(40, 199, 111, 0.1)';
                } else if (agr.pdf_path) {
                  statusLabel = 'Signed'; statusColor = theme.success; statusBg = 'rgba(40, 199, 111, 0.1)';
                } else if (agr.status === 'payment_pending') {
                  statusLabel = 'Payment Review'; statusColor = theme.warning; statusBg = 'rgba(245, 158, 11, 0.1)';
                } else if (agr.status === 'esign_required' || agr.needs_esign) {
                  statusLabel = 'E-Sign Pending'; statusColor = theme.danger; statusBg = 'rgba(239, 68, 68, 0.1)';
                } else if (agr.status === 'kyc_pending') {
                  statusLabel = 'KYC Pending'; statusColor = theme.danger; statusBg = 'rgba(239, 68, 68, 0.1)';
                } else if (agr.status === 'esign_pending') {
                  statusLabel = 'E-Sign Pending'; statusColor = theme.danger; statusBg = 'rgba(239, 68, 68, 0.1)';
                } else if (agr.status === 'signed') {
                  statusLabel = 'Signed'; statusColor = theme.success; statusBg = 'rgba(40, 199, 111, 0.1)';
                }

                return (
                  <View key={idx} style={[styles.documentContainer, { backgroundColor: theme.card, borderColor: theme.border, padding: 16, marginBottom: 12 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontWeight: '700', color: theme.textPrimary, fontSize: 15, flex: 1 }}>{agr.plan_name || 'Agreement'}</Text>
                      <View style={{ backgroundColor: statusBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 }}>
                        <Text style={{ color: statusColor, fontWeight: '800', fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>{statusLabel}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                      <Text style={{ color: theme.textSecondary, fontSize: 13 }}>No: {agr.agreement_number || '-'}</Text>
                      <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Date: {new Date(agr.createdAt).toLocaleDateString()}</Text>
                    </View>

                    {agr.pdf_path ? (
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                        onPress={() => Linking.openURL(agr.pdf_path.startsWith('http') ? agr.pdf_path : `https://www.vishtaracapitalresearch.in${agr.pdf_path}`)}
                      >
                        <Text style={[styles.actionBtnText, { color: theme.btnText }]}>View PDF</Text>
                        <Feather name="download" size={16} color={theme.btnText} style={{ marginLeft: 8 }} />
                      </TouchableOpacity>
                    ) : canEsign ? (
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: theme.danger }]}
                        onPress={() => handleOpenEsignForAgreement(agr)}
                        disabled={processingAgreementId === agr._id}
                      >
                        {processingAgreementId === agr._id ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <>
                            <Text style={[styles.actionBtnText, { color: '#fff' }]}>Complete E-Sign</Text>
                            <Feather name="edit-2" size={16} color="#fff" style={{ marginLeft: 8 }} />
                          </>
                        )}
                      </TouchableOpacity>
                    ) : needsEsign && !isComplete ? (
                      <View style={{ backgroundColor: '#FEF2F2', padding: 8, borderRadius: 8, alignItems: 'center' }}>
                        <Text style={{ color: theme.danger, fontSize: 12, fontWeight: '600' }}>KYC Required for E-Sign</Text>
                      </View>
                    ) : agr.status === 'payment_pending' ? (
                      <View style={{ backgroundColor: '#FFFBEB', padding: 8, borderRadius: 8, alignItems: 'center' }}>
                        <Text style={{ color: theme.warning, fontSize: 12, fontWeight: '600' }}>Under Review</Text>
                      </View>
                    ) : (
                      <View style={{ backgroundColor: '#F8FAFC', padding: 8, borderRadius: 8, alignItems: 'center' }}>
                        <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600' }}>Processing...</Text>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <View style={[styles.documentContainer, { backgroundColor: theme.card, borderColor: theme.border, padding: 24, alignItems: 'center' }]}>
                <Feather name="file-text" size={32} color={theme.textSecondary} style={{ marginBottom: 12 }} />
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>No agreements found.</Text>
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Image Preview Modal */}
      {modalImage && (
        <View style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }}
              onPress={() => setModalImage(null)}
            >
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
            <Image
              source={{ uri: modalImage.startsWith('http') || modalImage.startsWith('data:') ? modalImage : `${process.env.EXPO_PUBLIC_API_URL?.replace('/api/v1', '') || ''}${modalImage}` }}
              style={{ width: '90%', height: '70%', resizeMode: 'contain' }}
            />
          </View>
        </View>
      )}
    </OtherPagesInc>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    padding: 8,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Status Card
  statusCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  statusDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Section Headers
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },

  // Document View
  documentContainer: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    overflow: 'hidden',
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  docHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 8,
  },
  docScroll: {
    height: 220,
    backgroundColor: '#fff',
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
    textDecorationLine: 'underline',
  },
  docText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 22,
  },
  digitalStamp: {
    marginTop: 20,
    alignItems: 'center',
    opacity: 0.5,
  },
  stampText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },

  // Signature
  signatureCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    height: 140,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  signedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  signatureImg: {
    width: '80%',
    height: '70%',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  unsignedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
    borderRadius: 12,
    margin: 10,
    backgroundColor: '#FAFAFA',
  },
  unsignedText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: '70%',
  },

  // Footer
  footerActions: {
    alignItems: 'center',
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    width: '100%',
  },
  outlineBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_COLOR,
    marginLeft: 8,
  },

  // Details
  detailsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },

  // Media
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  mediaItem: {
    width: (width - 40 - 12) / 2, // 2 columns
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mediaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  pollingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  pollingText: {
    fontSize: 12,
    color: '#D97706',
    marginLeft: 8,
    fontWeight: '500',
  },
});