import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import agreementService from '@/services/api/methods/agreementService';
import { useAppearance } from '@/context/AppearanceContext';

const THEME_COLOR = '#0a7ea4';
const BG_COLOR = '#F8F9FA';
const CARD_BG = '#FFFFFF';

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  planName: string;
  durationLabel: string;
  basePrice: number;
  onPayRazorpay: () => void;
  onPayManual: () => void;
}

export default function PaymentMethodModal({
  visible,
  onClose,
  planName,
  durationLabel,
  basePrice,
  onPayRazorpay,
  onPayManual
}: PaymentMethodModalProps) {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';
  const finalPrice = basePrice; // Base price already includes discount from parent component

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#040410' : '#FFFFFF' }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Complete Payment</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color={isDark ? '#FFFFFF' : '#4B5563'} />
            </TouchableOpacity>
          </View>

          {/* Plan Details */}
          <View style={[styles.planDetailsContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8F9FA' }]}>
            <Text style={[styles.planName, { color: isDark ? '#FFFFFF' : '#374151' }]}>{planName} - {durationLabel}</Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={[styles.finalPriceLabel, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Final Amount</Text>
              <Text style={[styles.finalPriceValue, { color: isDark ? '#f8b917' : '#011d52' }]}>₹{finalPrice.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB' }]} />

          {/* Payment Methods */}
          <TouchableOpacity 
            style={[
              styles.paymentOptionBtn,
              {
                backgroundColor: isDark ? '#040410' : '#FFFFFF',
                borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB'
              }
            ]} 
            onPress={() => onPayRazorpay()}
          >
            <Ionicons name="card-outline" size={24} color={isDark ? '#f8b917' : '#011d52'} />
            <View style={styles.paymentOptionTextContainer}>
              <Text style={[styles.paymentOptionText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Pay Online (Razorpay)</Text>
              <Text style={[styles.paymentOptionSubtext, { color: isDark ? '#B5B2B1' : '#6B7280' }]}>Credit/Debit Card, UPI, NetBanking</Text>
            </View>
            <Feather name="chevron-right" size={20} color={isDark ? '#B5B2B1' : '#9CA3AF'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.paymentOptionBtn,
              {
                backgroundColor: isDark ? '#040410' : '#FFFFFF',
                borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#E5E7EB'
              }
            ]} 
            onPress={() => onPayManual()}
          >
            <Ionicons name="receipt-outline" size={24} color={isDark ? '#f8b917' : '#011d52'} />
            <View style={styles.paymentOptionTextContainer}>
              <Text style={[styles.paymentOptionText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Manual Payment</Text>
              <Text style={[styles.paymentOptionSubtext, { color: isDark ? '#B5B2B1' : '#6B7280' }]}>Bank Transfer / UPI / Cheque</Text>
            </View>
            <Feather name="chevron-right" size={20} color={isDark ? '#B5B2B1' : '#9CA3AF'} />
          </TouchableOpacity>

          <Text style={[styles.footerText, { color: isDark ? '#B5B2B1' : '#9CA3AF' }]}>By proceeding, you agree to our Terms & Conditions</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeBtn: {
    padding: 4,
  },
  planDetailsContainer: {
    backgroundColor: BG_COLOR,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  couponSection: {
    marginBottom: 20,
  },
  couponInputContainer: {
    flexDirection: 'row',
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#fff',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0,
  },
  applyBtn: {
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    height: 44,
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  appliedCouponContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
    padding: 12,
    borderRadius: 8,
  },
  appliedCouponText: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 14,
  },
  removeCouponText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  priceSection: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  originalPriceText: {
    color: '#9CA3AF',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  discountText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  finalPriceLabel: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  finalPriceValue: {
    color: THEME_COLOR,
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },
  paymentOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentOptionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  paymentOptionSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  promoPill: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 13,
  },
  couponSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  couponSelectText: {
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 15,
  },
  applyText: {
    color: THEME_COLOR,
    fontWeight: '600',
    fontSize: 14,
  }
});
