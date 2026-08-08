// app/PricingPlans.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  Keyboard,
  StatusBar,
  Dimensions,
  Modal,
  Image,
  Platform,
  RefreshControl,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import pricingServices from '@/services/api/methods/pricingServices';
import { usePricingPageData } from '@/hooks/usePricingPageData';
import agreementService from '@/services/api/methods/agreementService';
import { useFocusEffect } from 'expo-router';
import couponService, { Coupon } from '@/services/api/methods/couponService';
import customerProfileServices from '@/services/api/methods/profileService';
import OtherPagesInc from '@/components/includes/otherPagesInc';
import PaymentMethodModal from '@/app/components/PaymentMethodModal';
import AgreementModal from '@/app/components/AgreementModal';
import kycService from '@/services/api/methods/kycService';
import { useAppearance } from '@/context/AppearanceContext';

// --- Constants ---
const THEME_COLOR = '#0a7ea4';
const BG_COLOR = '#F8F9FA';
const CARD_BG = '#FFFFFF';
const { width } = Dimensions.get('window');

/* ---------------- Types ---------------- */
interface ApiFeature {
  id?: number | string;
  svg_icon?: string | null;
  text?: string | null;
}
interface ApiDuration {
  id?: number | string;
  _id?: number | string;
  duration: string;
  price: number | string;
  features?: ApiFeature[];
}
interface ApiServicePlan {
  id: number | string;
  _id?: number | string;
  name: string;
  tagline?: string | null;
  featured?: number | boolean;
  status?: number | boolean;
  sort_order?: number;
  button_text?: string | null;
  durations?: ApiDuration[];
}

interface UIPricingDuration {
  id: string;
  label: string;
  price: number;
  priceText: string;
  features: ApiFeature[];
}

interface UIPricingPlan {
  id: string;
  title: string;
  subtitle?: string;
  isRecommended?: boolean;
  buttonText?: string;
  durations: UIPricingDuration[];
}

/* ---------------- PlanCard Component ---------------- */
const PlanCard = ({
  plan,
  onPurchase,
  loadingPlanId,
  activeCoupon,
}: {
  plan: UIPricingPlan;
  onPurchase: (plan: UIPricingPlan, duration: UIPricingDuration, finalPrice: number) => void;
  loadingPlanId: string | null;
  activeCoupon: Coupon | null;
}) => {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';
  const [selectedIndex, setSelectedIndex] = useState(0);
  const durations = plan.durations ?? [];
  const activeDuration = durations[selectedIndex] ?? durations[0] ?? null;

  // Calculate Price
  let basePrice = activeDuration ? activeDuration.price : 0;
  let finalPrice = basePrice;
  let savings = 0;

  if (activeCoupon) {
    if (activeCoupon.min_amount && basePrice < activeCoupon.min_amount) {
      // Not applicable
    } else {
      let discount = 0;
      if (activeCoupon.type === 'percent') {
        discount = (basePrice * activeCoupon.value) / 100;
      } else {
        discount = activeCoupon.value;
      }
      finalPrice = Math.max(0, basePrice - discount);
      savings = discount;
    }
  }

  return (
    <View style={[
      styles.cardContainer,
      {
        backgroundColor: isDark ? '#040410' : '#FFFFFF',
        borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
      },
      plan.isRecommended && [styles.cardContainerRecommended, { borderColor: isDark ? '#f8b917' : '#011d52' }]
    ]}>
      {plan.isRecommended && (
        <View style={[styles.recommendedBanner, { backgroundColor: isDark ? '#f8b917' : '#011d52' }]}>
          <MaterialIcons name="star" size={14} color="#000000" style={{ marginRight: 4 }} />
          <Text style={[styles.recommendedText, { color: '#000000' }]}>Most Popular</Text>
        </View>
      )}

      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.planHeader}>
          <Text style={[styles.planTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>{plan.title}</Text>
          <Text style={[styles.planSubtitle, { color: isDark ? '#B5B2B1' : '#6B7280' }]}>{plan.subtitle}</Text>
        </View>

        {/* Duration Tabs */}
        {durations.length > 0 && (
          <View style={[styles.durationTabsContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F3F4F6' }]}>
            {durations.map((d, idx) => {
              const isActive = selectedIndex === idx;
              return (
                <TouchableOpacity
                  key={`${plan.id}-dur-${idx}`}
                  activeOpacity={0.7}
                  onPress={() => setSelectedIndex(idx)}
                  style={[
                    styles.durationTab,
                    isActive && [styles.durationTabActive, { backgroundColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#FFFFFF' }]
                  ]}
                >
                  <Text style={[
                    styles.durationTabText,
                    { color: isDark ? '#B5B2B1' : '#6B7280' },
                    isActive && { color: isDark ? '#f8b917' : '#000000', fontWeight: '700' }
                  ]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Price Display */}
        <View style={styles.priceContainer}>
          <Text style={[styles.currencySymbol, { color: isDark ? '#FFFFFF' : '#374151' }]}>₹</Text>
          <Text style={[styles.priceValue, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            {finalPrice.toLocaleString('en-IN')}
          </Text>
          <Text style={[styles.pricePeriod, { color: isDark ? '#B5B2B1' : '#6B7280' }]}>/{activeDuration?.label?.toLowerCase().replace('ly', '') || 'period'}</Text>
        </View>

        {savings > 0 && (
          <View style={{ alignItems: 'center', marginBottom: 15, marginTop: -10 }}>
            <Text style={{ color: '#10B981', fontWeight: '700', fontSize: 13 }}>
              Save ₹{savings.toLocaleString('en-IN')} with Promo!
            </Text>
            <Text style={{ textDecorationLine: 'line-through', color: '#9CA3AF', fontSize: 12 }}>
              Original: ₹{basePrice.toLocaleString('en-IN')}
            </Text>
          </View>
        )}

        {/* Features List */}
        <View style={styles.featuresList}>
          {(activeDuration?.features ?? []).map((feat, idx) => (
            <View key={`${plan.id}-feat-${idx}`} style={styles.featureRow}>
              <Feather name="check" size={16} color={isDark ? '#f8b917' : '#011d52'} style={{ marginRight: 8 }} />
              <Text style={[styles.featureText, { color: isDark ? '#FFFFFF' : '#374151' }]}>{feat.text ?? '—'}</Text>
              {feat.svg_icon ? (
                <View style={[styles.featureBadge, { backgroundColor: isDark ? 'rgba(248, 185, 23, 0.1)' : '#EFF6FF' }]}>
                  <Text style={[styles.featureBadgeText, { color: isDark ? '#f8b917' : '#011d52' }]}>{feat.svg_icon}</Text>
                </View>
              ) : null}
            </View>
          ))}

          {(activeDuration?.features ?? []).length === 0 && (
            <Text style={[styles.noFeaturesText, { color: isDark ? '#B5B2B1' : '#9CA3AF' }]}>Standard features included</Text>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.purchaseBtn,
            plan.isRecommended
              ? [styles.purchaseBtnRecommended, { backgroundColor: isDark ? '#f8b917' : '#011d52', shadowColor: isDark ? '#f8b917' : '#011d52' }]
              : [styles.purchaseBtnStandard, {
                backgroundColor: isDark ? 'rgba(248, 185, 23, 0.08)' : 'rgba(148, 227, 7, 0.1)',
                borderColor: isDark ? 'rgba(248, 185, 23, 0.3)' : '#011d52',
                borderWidth: 1
              }]
          ]}
          activeOpacity={0.8}
          onPress={() => onPurchase(plan, activeDuration, finalPrice)}
          disabled={loadingPlanId === plan.id}
        >
          {loadingPlanId === plan.id ? (
            <ActivityIndicator color={plan.isRecommended ? "#000000" : (isDark ? "#f8b917" : "#011d52")} />
          ) : (
            <>
              <Text style={[styles.purchaseBtnText, { color: plan.isRecommended ? '#000000' : (isDark ? '#f8b917' : '#011d52') }]}>
                {plan.buttonText || 'Choose Plan'}
              </Text>
              <Feather
                name="arrow-right"
                size={18}
                color={plan.isRecommended ? '#000000' : (isDark ? '#f8b917' : '#011d52')}
                style={{ marginLeft: 8 }}
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ---------------- Main Screen ---------------- */
export default function PricingPlans() {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';
  const [plans, setPlans] = useState<UIPricingPlan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  // Modals state
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null);
  const [isPaymentMethodModalOpen, setPaymentMethodModalOpen] = useState(false);
  const [isManualModalOpen, setManualModalOpen] = useState(false);
  const [isAgreementModalOpen, setAgreementModalOpen] = useState(false);
  const [kycData, setKycData] = useState<any>(null);
  const [isProcessingAgreement, setIsProcessingAgreement] = useState(false);

  // Manual Payment Form
  const [transactionId, setTransactionId] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<any>(null);
  const [submittingManual, setSubmittingManual] = useState(false);

  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  const { data: pageData, isLoading, error: queryError, refetch } = usePricingPageData();

  useEffect(() => {
    if (!pageData) return;
    
    try {
      const { plansResp, couponsResp, profileResp, kycResp } = pageData;

      const rawPlans: ApiServicePlan[] = Array.isArray(plansResp) ? plansResp : ((plansResp as any)?.data ?? []);

      const uiPlans: UIPricingPlan[] = rawPlans.map((p) => {
        const durations: UIPricingDuration[] = (p.durations ?? []).map((d) => {
          const safePrice = Number(String(d.price ?? '0').replace(/,/g, ''));
          return {
            id: String(d._id ?? d.id ?? ''),
            label: d.duration ?? '—',
            price: isNaN(safePrice) ? 0 : safePrice,
            priceText: `₹${safePrice}`,
            features: d.features ?? [],
          };
        });

        return {
          id: String(p._id ?? p.id),
          title: p.name ?? 'Untitled Plan',
          subtitle: p.tagline ?? '',
          isRecommended: Boolean(p.featured),
          buttonText: p.button_text ?? 'Subscribe',
          durations: durations.length ? durations : [{ id: '', label: 'Default', price: 0, priceText: '₹0', features: [] }],
        };
      });

      setPlans(uiPlans);
      if (couponsResp.success) {
        setCoupons(couponsResp.data);
      }
      if (profileResp) {
        const userObj = profileResp.user || profileResp;
        setUserName(userObj?.name || 'User');
        setUserPhone(userObj?.phone || userObj?.mobile || '');
        setUserEmail(userObj?.email || '');
      }
      if (kycResp && kycResp.success) {
        setKycData(kycResp.kyc);
      }
    } catch (err: any) {
      console.warn('Error formatting plans:', err);
    }
  }, [pageData]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (queryError) {
      setError((queryError as any)?.message ?? 'Failed to load plans');
    } else {
      setError(null);
    }
  }, [queryError]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      const checkStatusOnReturn = async () => {
        if (selectedPlanForPayment?.plan && selectedPlanForPayment?.duration) {
          try {
            const existingDraftRes: any = await agreementService.findDraft(
              selectedPlanForPayment.plan.id,
              selectedPlanForPayment.duration.id
            );
            if (mounted && existingDraftRes?.success && existingDraftRes?.draft) {
              if (existingDraftRes.draft.status === 'esign_pending') {
                const statusRes: any = await agreementService.checkAgreementStatus(existingDraftRes.draft._id);
                if (mounted && statusRes.success && statusRes.status === 'signed') {
                  setSelectedPlanForPayment((prev: any) => ({
                    ...prev,
                    finalPrice: existingDraftRes.draft.planAmount ? Number(existingDraftRes.draft.planAmount) : prev.finalPrice,
                    isFromDraft: true,
                    draftAppliedCoupon: existingDraftRes.draft.coupon_code || null
                  }));
                  setPaymentMethodModalOpen(true);
                }
              }
            }
          } catch (e) {
            console.warn('Silent refresh failed:', e);
          }
        }
      };
      checkStatusOnReturn();
      return () => { mounted = false; };
    }, [selectedPlanForPayment])
  );

  const handleAgreementAccept = async (passedPlan?: any, passedDuration?: any, passedPrice?: number, passedCoupon?: string | null) => {
    const plan = passedPlan || selectedPlanForPayment?.plan;
    const duration = passedDuration || selectedPlanForPayment?.duration;
    const finalPrice = passedPrice !== undefined ? passedPrice : selectedPlanForPayment?.finalPrice;
    const couponCode = passedCoupon !== undefined ? passedCoupon : activeCoupon?.code || null;

    if (!plan || !duration) return;

    setIsProcessingAgreement(true);
    try {
      const payload = {
        plan_id: plan.id,
        duration_id: duration.id,
        coupon_code: couponCode,
        plan_name: plan.title,
        duration: duration.label,
        features: duration.features,
        planAmount: String(finalPrice),
        current_url: "https://vishtaracapitalsresearch.com/mobile-payment-callback"
      };

      const draftRes: any = await agreementService.storeDraftAgreement(payload);

      if (draftRes?.success) {
        setAgreementModalOpen(false);

        if (draftRes.status === 'no_digio') {
          // Digio is INACTIVE — no agreement needed, go straight to payment
          setPaymentMethodModalOpen(true);

        } else if (draftRes.status === 'signed') {
          // Already signed (edge case) — go to payment
          setPaymentMethodModalOpen(true);

        } else if (draftRes.redirect_url) {
          // E-sign pending → open DigioEsignWebView with digio_document_id
          const digioDocId = draftRes.digio_document_id || '';
          const encodedUrl = encodeURIComponent(draftRes.redirect_url);
          router.push(
            `/pages/subscription/DigioEsignWebView?url=${encodedUrl}&digio_document_id=${digioDocId}&plan_id=${plan.id}&duration_id=${duration.id}` as any
          );

        } else if (draftRes.status === 'esign_pending' || draftRes.status === 'kyc_pending') {
          // Skipped KYC case or no redirect URL provided - go to payment
          setPaymentMethodModalOpen(true);
        } else {
          Alert.alert('Agreement Setup Needed', 'Please contact support to complete agreement setup.');
        }

      } else {
        Alert.alert('Error', draftRes?.message || 'Failed to initiate agreement.');
      }
    } catch (e: any) {
      console.log('Draft Creation Error:', e?.response?.data || e?.message);
      const errorMessage = e?.response?.data?.message || e?.message || 'Failed to generate agreement.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsProcessingAgreement(false);
    }
  };


  const handlePurchase = async (plan: UIPricingPlan, duration: UIPricingDuration, finalPrice: number) => {
    setSelectedPlanForPayment({ plan, duration, finalPrice });
    const planId = plan.id;
    const durationId = duration.id;

    setLoadingPlanId(planId);
    try {
      const existingDraftRes: any = await agreementService.findDraft(planId, durationId).catch(() => ({ success: false }));

      if (existingDraftRes?.success && existingDraftRes?.draft) {
        const draft = existingDraftRes.draft;
        const draftFinalPrice = draft.planAmount ? Number(draft.planAmount) : finalPrice;
        const draftCoupon = draft.coupon_code || null;

        if (draft.status === 'payment_pending') {
          Alert.alert('Payment Under Review', 'Your payment is already under verification.');
          setLoadingPlanId(null);
          return;
        }

        if (draft.status === 'signed' || draft.status === 'kyc_pending') {
          setSelectedPlanForPayment({
            plan,
            duration,
            finalPrice: draftFinalPrice,
            isFromDraft: true,
            draftAppliedCoupon: draftCoupon
          });
          setPaymentMethodModalOpen(true);
          setLoadingPlanId(null);
          return;
        }
        if (draft.status === 'esign_pending') {
          try {
            const statusRes: any = await agreementService.checkAgreementStatus(draft._id);
            if (statusRes.success && statusRes.status === 'signed') {
              setSelectedPlanForPayment({
                plan,
                duration,
                finalPrice: draftFinalPrice,
                isFromDraft: true,
                draftAppliedCoupon: draftCoupon
              });
              setPaymentMethodModalOpen(true);
              setLoadingPlanId(null);
              return;
            }
            if (draft.try_count >= 3 || (statusRes.try_count && statusRes.try_count >= 3)) {
              Alert.alert('Max Attempts', 'Maximum e-sign attempts exceeded. Please contact admin.');
              setLoadingPlanId(null);
              return;
            }

            await agreementService.incrementTryCount(draft._id);
            const digioDocId = draft.digio_document_id || '';
            router.push(`/pages/subscription/DigioEsignWebView?url=${encodeURIComponent(draft.esign_url)}&digio_document_id=${digioDocId}&plan_id=${planId}&duration_id=${durationId}` as any);
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to verify agreement status');
          }
          setLoadingPlanId(null);
          return;
        }
      }

      const isKycComplete = kycData?.status && ['approved', 'completed', 'success'].includes(kycData.status.toLowerCase());

      // No draft or draft not signed, check manual verified
      if (kycData?.kyc_details?.aadhaar === 'Manual Verified') {
        handleAgreementAccept(plan, duration, finalPrice, activeCoupon?.code);
      } else if (!isKycComplete) {
        Alert.alert(
          'KYC Required',
          'Your KYC is incomplete. You can do KYC first, or skip it for now and proceed directly to payment (Agreement will be pending).',
          [
            {
              text: 'Do KYC First',
              onPress: () => router.push('/pages/kyc/kycAgreement'),
              style: 'cancel'
            },
            {
              text: 'Skip KYC & Do Payment',
              onPress: () => handleAgreementAccept(plan, duration, finalPrice, activeCoupon?.code)
            }
          ]
        );
      } else {
        setAgreementModalOpen(true);
      }
      setLoadingPlanId(null);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to check agreement draft.');
      setLoadingPlanId(null);
    }
  };

  const handleRazorpayPayment = async () => {
    setPaymentMethodModalOpen(false);
    const couponCode = selectedPlanForPayment?.isFromDraft
      ? selectedPlanForPayment.draftAppliedCoupon
      : (activeCoupon?.code || null);

    const planId = selectedPlanForPayment?.plan?.id;
    const durationId = selectedPlanForPayment?.duration?.id;

    if (!planId || !durationId) return;

    setLoadingPlanId(planId);
    try {
      const userPhone = await customerProfileServices.getUserPhoneNumber().catch(() => '');
      const rzpRes: any = await agreementService.createRazorpayOrder(planId, durationId, couponCode);
      if (rzpRes?.success && rzpRes?.order) {
        const urlParams =
          `order_id=${rzpRes.order.id}` +
          `&key=${rzpRes.key}` +
          `&amount=${rzpRes.order.amount}` +
          `&currency=${rzpRes.order.currency}` +
          `&plan_id=${planId}` +
          `&duration_id=${durationId}` +
          (couponCode ? `&coupon=${couponCode}` : '') +
          (userPhone ? `&contact=${userPhone}` : '');

        router.push(`/pages/subscription/RazorpayWebView?${urlParams}`);
      } else {
        Alert.alert('Error', rzpRes?.message || 'Failed to create payment order.');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to create Razorpay order');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleManualPaymentOption = () => {
    setPaymentMethodModalOpen(false);
    setPaidAmount(selectedPlanForPayment?.finalPrice?.toString().replace(/[^0-9.]/g, '') || '');
    setManualModalOpen(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPaymentScreenshot(result.assets[0]);
    }
  };

  const submitManualPayment = async () => {
    if (!paidAmount.trim()) {
      Alert.alert('Validation Error', 'Please enter Paid Amount');
      return;
    }
    if (!transactionId.trim()) {
      Alert.alert('Validation Error', 'Please enter Transaction ID');
      return;
    }
    if (!paymentScreenshot) {
      Alert.alert('Validation Error', 'Please upload a payment screenshot');
      return;
    }

    setSubmittingManual(true);
    try {
      const formData = new FormData();
      formData.append('plan_id', selectedPlanForPayment.plan.id);
      formData.append('duration_id', selectedPlanForPayment.duration.id);
      formData.append('transaction_id', transactionId);
      formData.append('amount', paidAmount);

      formData.append('screenshot', {
        uri: Platform.OS === 'android' ? paymentScreenshot.uri : paymentScreenshot.uri.replace('file://', ''),
        type: 'image/jpeg',
        name: 'screenshot.jpg'
      } as any);

      const res: any = await agreementService.submitManualPayment(formData);
      if (res?.success) {
        Alert.alert('Success', 'Manual payment submitted! Admin will verify soon.');
        setManualModalOpen(false);
        setPaymentScreenshot(null);
        setTransactionId('');
        router.back();
      } else {
        Alert.alert('Error', res?.message || 'Failed to submit payment.');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to submit manual payment.');
    } finally {
      setSubmittingManual(false);
    }
  };

  return (
    <OtherPagesInc title="Choose Your Plan">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#020210" : "#FFFFFF"} />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { backgroundColor: isDark ? '#020210' : '#FFFFFF' }]} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={isDark ? '#f8b917' : '#011d52'} 
            colors={[isDark ? '#f8b917' : '#011d52']} 
          />
        }
      >
        <View style={{ height: 10 }} />

        {/* Promo Codes */}
        {coupons.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.promoTitle, { color: isDark ? '#FFFFFF' : '#374151' }]}>Active Promos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 5 }}>
              {coupons.map(c => {
                const isActive = activeCoupon?.code === c.code;
                return (
                  <TouchableOpacity
                    key={c.id || c.code}
                    onPress={() => setActiveCoupon(isActive ? null : c)}
                    style={[
                      styles.promoPill,
                      {
                        backgroundColor: isDark ? '#040410' : '#FFFFFF',
                        borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
                      },
                      isActive ? [styles.promoPillActive, { backgroundColor: isDark ? '#f8b917' : '#011d52', borderColor: isDark ? '#f8b917' : '#011d52' }] : {}
                    ]}
                  >
                    {isActive && <Feather name="check" size={14} color="#000000" style={{ marginRight: 4 }} />}
                    <Text style={[
                      styles.promoText,
                      { color: isDark ? '#B5B2B1' : '#374151' },
                      isActive ? [styles.promoTextActive, { color: '#000000' }] : {}
                    ]}>
                      {c.code}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>
        )}

        {/* Plans List */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={isDark ? '#f8b917' : '#011d52'} />
            <Text style={{ marginTop: 10, color: isDark ? '#B5B2B1' : '#6B7280' }}>Loading plans...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.errorText, { color: '#DC2626' }]}>{error}</Text>
          </View>
        ) : plans.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.infoText, { color: isDark ? '#B5B2B1' : '#6B7280' }]}>No subscription plans available at the moment.</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            snapToInterval={width * 0.82 + 16}
            decelerationRate="fast"
            snapToAlignment="start"
          >
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onPurchase={handlePurchase}
                loadingPlanId={loadingPlanId}
                activeCoupon={activeCoupon}
              />
            ))}
          </ScrollView>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      <AgreementModal
        visible={isAgreementModalOpen}
        onClose={() => setAgreementModalOpen(false)}
        onAccept={() => handleAgreementAccept()}
        isProcessing={isProcessingAgreement}
        user={{ name: userName, email: userEmail, phone: userPhone }}
        selectedPlan={selectedPlanForPayment?.plan}
        selectedDuration={selectedPlanForPayment?.duration}
        finalPrice={selectedPlanForPayment?.finalPrice}
        kycData={kycData}
      />

      <PaymentMethodModal
        visible={isPaymentMethodModalOpen}
        onClose={() => setPaymentMethodModalOpen(false)}
        planName={selectedPlanForPayment?.plan?.title || ''}
        durationLabel={selectedPlanForPayment?.duration?.label || ''}
        basePrice={selectedPlanForPayment?.finalPrice || 0}
        onPayRazorpay={handleRazorpayPayment}
        onPayManual={handleManualPaymentOption}
      />

      {/* Manual Payment Modal */}
      <Modal visible={isManualModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#040410' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>Manual Payment</Text>

            <View style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F3F4F6', padding: 12, borderRadius: 10, marginBottom: 16 }}>
              <Text style={{ fontSize: 14, color: isDark ? '#FFFFFF' : '#374151', marginBottom: (userPhone || userEmail) ? 2 : 4 }}>
                <Text style={{ fontWeight: 'bold' }}>User: </Text>{userName}
              </Text>
              {(userPhone || userEmail) ? (
                <Text style={{ fontSize: 11, color: isDark ? '#B5B2B1' : '#6B7280', marginBottom: 6 }}>
                  {userPhone}{userPhone && userEmail ? ' | ' : ''}{userEmail}
                </Text>
              ) : null}
              <Text style={{ fontSize: 14, color: isDark ? '#FFFFFF' : '#374151', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold' }}>Plan: </Text>
                {selectedPlanForPayment?.plan?.title} ({selectedPlanForPayment?.duration?.label})
              </Text>
              <Text style={{ fontSize: 14, color: isDark ? '#FFFFFF' : '#374151', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold' }}>Original Amount: </Text>
                ₹{(selectedPlanForPayment?.duration?.price || 0).toLocaleString('en-IN')}
              </Text>

              {selectedPlanForPayment?.isFromDraft ? (
                selectedPlanForPayment.draftAppliedCoupon ? (
                  <Text style={{ fontSize: 14, color: '#10B981', marginBottom: 4 }}>
                    <Text style={{ fontWeight: 'bold' }}>Coupon Applied: </Text>
                    '{selectedPlanForPayment.draftAppliedCoupon}' (from agreement)
                  </Text>
                ) : null
              ) : activeCoupon ? (
                <Text style={{ fontSize: 14, color: '#10B981', marginBottom: 4 }}>
                  <Text style={{ fontWeight: 'bold' }}>Coupon Applied: </Text>
                  '{activeCoupon.code}' ({activeCoupon.type === 'percent' ? `${activeCoupon.value}%` : `₹${activeCoupon.value}`} off)
                </Text>
              ) : null}

              <View style={{ height: 1, backgroundColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB', marginVertical: 8 }} />
              <Text style={{ fontSize: 16, color: isDark ? '#f8b917' : '#011d52', fontWeight: 'bold' }}>
                Final Amount to Pay: ₹{selectedPlanForPayment?.finalPrice?.toLocaleString('en-IN')}
              </Text>
            </View>

            <Text style={[styles.modalSub, { color: isDark ? '#B5B2B1' : '#6B7280' }]}>Upload proof of payment for ₹{selectedPlanForPayment?.finalPrice}</Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F9FAFB',
                  borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
                  color: isDark ? '#FFFFFF' : '#111827',
                  marginBottom: 10
                }
              ]}
              placeholder="Paid Amount"
              value={paidAmount}
              onChangeText={setPaidAmount}
              keyboardType="numeric"
              placeholderTextColor={isDark ? '#B5B2B1' : '#9CA3AF'}
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F9FAFB',
                  borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB',
                  color: isDark ? '#FFFFFF' : '#111827'
                }
              ]}
              placeholder="Transaction ID / UTR Number"
              value={transactionId}
              onChangeText={setTransactionId}
              placeholderTextColor={isDark ? '#B5B2B1' : '#9CA3AF'}
            />

            <TouchableOpacity
              style={[
                styles.uploadBtn,
                {
                  backgroundColor: isDark ? 'rgba(248, 185, 23, 0.05)' : 'rgba(148, 227, 7, 0.08)',
                  borderColor: isDark ? 'rgba(248, 185, 23, 0.2)' : '#011d52',
                }
              ]}
              onPress={pickImage}
            >
              <Feather name="upload-cloud" size={24} color={isDark ? '#f8b917' : '#011d52'} />
              <Text style={[styles.uploadBtnText, { color: isDark ? '#f8b917' : '#011d52' }]}>
                {paymentScreenshot ? 'Change Screenshot' : 'Upload Screenshot'}
              </Text>
            </TouchableOpacity>

            {paymentScreenshot && (
              <Image source={{ uri: paymentScreenshot.uri }} style={styles.previewImage} />
            )}

            <TouchableOpacity
              style={[
                styles.submitManualBtn,
                {
                  backgroundColor: isDark ? '#f8b917' : '#011d52',
                },
                (submittingManual || !transactionId || !paymentScreenshot) && { opacity: 0.7 }
              ]}
              onPress={submitManualPayment}
              disabled={submittingManual}
            >
              {submittingManual ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={[styles.submitManualBtnText, { color: '#000000' }]}>Submit Payment</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setManualModalOpen(false)}>
              <Text style={[styles.cancelBtnText, { color: isDark ? '#B5B2B1' : '#6B7280' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </OtherPagesInc>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingTop: 10, backgroundColor: BG_COLOR, minHeight: '100%' },
  centerContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50 },
  headerContainer: { marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 6 },
  headerSubtitle: { fontSize: 12, color: '#6B7280', lineHeight: 16 },

  promoTitle: { fontSize: 12, fontWeight: '700', color: '#374151', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  promoPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 10 },
  promoPillActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  promoText: { fontSize: 12, fontWeight: '700', color: '#374151' },
  promoTextActive: { color: '#fff' },

  errorText: { color: '#DC2626', fontSize: 14 },
  infoText: { color: '#6B7280', fontSize: 14 },

  horizontalScrollContent: { paddingRight: 24, paddingBottom: 16, gap: 16 },
  cardContainer: { width: width * 0.82, backgroundColor: CARD_BG, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  cardContainerRecommended: { borderColor: THEME_COLOR, borderWidth: 1.5, transform: [{ scale: 1.01 }] },
  recommendedBanner: { backgroundColor: THEME_COLOR, paddingVertical: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  recommendedText: { color: '#fff', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardContent: { padding: 20 },

  planHeader: { alignItems: 'center', marginBottom: 12 },
  planTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 2 },
  planSubtitle: { fontSize: 12, color: '#6B7280', textAlign: 'center' },

  durationTabsContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 10, padding: 3, marginBottom: 16 },
  durationTab: { flex: 1, paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
  durationTabActive: { backgroundColor: '#fff' },
  durationTabText: { fontSize: 12, fontWeight: '500', color: '#6B7280' },
  durationTabTextActive: { color: THEME_COLOR, fontWeight: '700' },

  priceContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline', marginBottom: 16 },
  currencySymbol: { fontSize: 16, fontWeight: '600', color: '#374151', marginRight: 2 },
  priceValue: { fontSize: 32, fontWeight: '800', color: '#111827' },
  pricePeriod: { fontSize: 12, color: '#6B7280', marginLeft: 4, fontWeight: '500' },

  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 },

  featuresList: { marginBottom: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkIconBg: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  featureText: { flex: 1, fontSize: 13, color: '#374151', fontWeight: '500' },
  featureBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  featureBadgeText: { fontSize: 10, color: THEME_COLOR, fontWeight: '600' },
  noFeaturesText: { color: '#9CA3AF', fontSize: 12, textAlign: 'center', fontStyle: 'italic' },

  purchaseBtn: { paddingVertical: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  purchaseBtnRecommended: { backgroundColor: THEME_COLOR },
  purchaseBtnStandard: { backgroundColor: '#F0F9FF', borderWidth: 1, borderColor: '#BAE6FD' },
  purchaseBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8, textAlign: 'center' },
  modalSub: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },

  paymentOptionBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 12 },
  paymentOptionText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#374151', marginLeft: 12 },

  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#111827', marginBottom: 16 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF', borderWidth: 1, borderColor: '#BAE6FD', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 20, marginBottom: 16 },
  uploadBtnText: { marginLeft: 10, color: THEME_COLOR, fontWeight: '600', fontSize: 15 },
  previewImage: { width: '100%', height: 150, borderRadius: 12, marginBottom: 16, resizeMode: 'cover' },

  submitManualBtn: { backgroundColor: THEME_COLOR, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  submitManualBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn: { paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { color: '#6B7280', fontSize: 15, fontWeight: '600' }
});