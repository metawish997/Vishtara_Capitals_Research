import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
  Modal,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import OtherPagesInc from '@/components/includes/otherPagesInc';
import { useAppearance } from '@/context/AppearanceContext';
import { WebView } from 'react-native-webview';

import agreementService from '@/services/api/methods/agreementService';
import customerProfileServices from '@/services/api/methods/profileService';
import subscriptionService from '@/services/api/methods/subscriptionService';

const numberToWords = (num: number) => {
    if (num === 0) return 'Zero Rupees Only';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const inWords = (n: number) => {
        let str = '';
        if (n > 99) { str += a[Math.floor(n / 100)] + 'Hundred '; n = n % 100; }
        if (n > 19) { str += b[Math.floor(n / 10)] + ' '; n = n % 10; }
        if (n > 0) { str += a[n]; }
        return str;
    };
    let amount = Math.floor(num);
    let decimal = Math.round((num - amount) * 100);
    let words = '';
    if (amount > 9999999) { words += inWords(Math.floor(amount / 10000000)) + 'Crore '; amount = amount % 10000000; }
    if (amount > 99999) { words += inWords(Math.floor(amount / 100000)) + 'Lakh '; amount = amount % 100000; }
    if (amount > 999) { words += inWords(Math.floor(amount / 1000)) + 'Thousand '; amount = amount % 1000; }
    if (amount > 0) { words += inWords(amount); }
    words = words.trim() + ' Rupees';
    if (decimal > 0) { words += ' and ' + inWords(decimal).trim() + ' Paise'; }
    return words + ' Only';
};

const formatDate = (dateStr: any) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function PaymentHistory() {
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
    link: isDark ? '#f8b917' : '#8cc63f',
  };

  const [invoices, setInvoices] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  
  const [showPreview, setShowPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, accountRes] = await Promise.all([
          customerProfileServices.getAllProfiles().catch(() => null),
          agreementService.getAccountServices().catch(() => null)
      ]);

      if (profileRes) {
          const userData = (profileRes as any)?.user ?? (profileRes as any)?.data?.user ?? profileRes ?? {};
          setUser(userData);
      }

      if (accountRes && accountRes.success) {
          setInvoices(accountRes.invoices || []);
          setSubscriptions(accountRes.subscriptions || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Alert.alert('Error', 'Could not load payment history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getPlanName = (inv: any) => {
      const sub = subscriptions.find(s => s._id === inv.user_subscription) || {};
      if (sub.is_legacy && sub.service_plan) return sub.service_plan.name;
      return sub.service_plan?.name || 'N/A';
  };

  const getInvoiceHtml = (inv: any) => {
      if (!inv) return '';

      const s = subscriptions.find(sub => sub._id === inv.user_subscription) || {};
      const finalPaid = parseFloat(inv.amount || 0);
      const originalPrice = parseFloat(s.service_plan_duration?.price || finalPaid);
      const hasDiscount = inv.coupon_code && originalPrice > finalPaid;
      const discountAmount = hasDiscount ? (originalPrice - finalPaid) : 0;
      const discountPercentage = hasDiscount ? Math.round((discountAmount / originalPrice) * 100) : 0;
      const dueAmount = parseFloat(inv.due_amount || 0);

      const baseAmount = finalPaid / 1.18;
      const gstAmount = finalPaid - baseAmount;
      
      const isOnline = inv.payment_gateway && inv.payment_gateway.toLowerCase().includes('razorpay');
      const paymentMethod = isOnline ? 'Online Payment' : (inv.payment_gateway || 'Direct QR / Manual');

      return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; }
              .invoice-document { width: 100%; max-width: 800px; margin: 0 auto; position: relative; box-sizing: border-box; }
              .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; color: rgba(0, 150, 150, 0.08); z-index: 0; pointer-events: none; text-align: center; line-height: 1; }
              .main-container { position: relative; z-index: 10; border: 1px solid #000; width: 100%; box-sizing: border-box; }
              .header-row { display: flex; border-bottom: 1px solid #000; }
              .logo-area { width: 25%; border-right: 1px solid #000; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
              .company-info { width: 50%; padding: 10px; font-size: 10px; line-height: 1.4; }
              .tax-invoice-box { width: 25%; padding: 10px; display: flex; align-items: flex-end; justify-content: flex-end; }
              .invoice-details-row { display: flex; border-bottom: 1px solid #000; }
              .details-left { width: 50%; border-right: 1px solid #000; padding: 5px 10px; font-size: 10px; line-height: 1.5; }
              .details-right { width: 50%; padding: 5px 10px; font-size: 10px; line-height: 1.5; }
              table { width: 100%; color: #000; border-collapse: collapse; }
              th, td { text-align: left; vertical-align: top; }
          </style>
      </head>
      <body>
          <div class="invoice-document">
              <div class="watermark">
                  <div style="font-size: 180px; letter-spacing: -10px;">TR</div>
                  <div style="font-size: 30px; margin-top: 10px;">Vishtara Capitals Research</div>
              </div>

              <div class="main-container">
                  <div class="header-row">
                      <div class="logo-area">
                          <div style="font-size: 60px; font-weight: 900; color: #135c5c; line-height: 0.8; letter-spacing: -3px;">VCR</div>
                          <div style="font-size: 10px; font-weight: bold; color: #135c5c; margin-top: 5px;">Vishtara Capitals Research</div>
                          <div style="font-size: 6px; color: #fff; background-color: #135c5c; padding: 2px 4px; margin-top: 2px; text-align: center;">Step Towards Smart Capital Research</div>
                      </div>
                      <div class="company-info">
                          <div style="font-weight: bold; color: #002060; font-size: 11px;">Anujay Chouhan Proprietor of the Vishtara Capital Research</div>
                          <div style="font-weight: bold; color: #002060; font-size: 11px;">SEBI Registered Research Analyst INH000027779</div>
                          <div>C-20/1, Mahananda Nagar,</div>
                          <div>Ujjain (M.P.), India</div>
                          <div>Mob no. - 8602027324</div>
                          <div><span style="color: #92d050;">Email ID -</span> <a href="mailto:support@vishtaracapitalresearch.in" style="color: #0070c0; text-decoration: underline;">support@vishtaracapitalresearch.in</a></div>
                          <div><span style="color: #92d050;">Website -</span> <a href="http://www.vishtaracapitalresearch.in" style="color: #0070c0; text-decoration: underline;">www.vishtaracapitalresearch.in</a></div>
                          <div style="font-weight: bold; color: #c00000;">GSTIN : 23EIBPS6730L2ZY</div>
                      </div>
                      <div class="tax-invoice-box">
                          <div style="border: 1px solid #b5b5b5; padding: 4px; font-weight: bold; font-size: 14px; width: 100%; text-align: center;">
                              TAX INVOICE
                          </div>
                      </div>
                  </div>

                  <div class="invoice-details-row">
                      <div class="details-left">
                          <table>
                              <tr><td style="font-weight: bold; width: 40%;">Invoice no.</td><td style="font-weight: bold;">: ${inv.invoice_number || inv.number || 'TRI/000762'}</td></tr>
                              <tr><td style="font-weight: bold;">Invoice Date</td><td style="font-weight: bold;">: ${formatDate(inv.invoice_date || inv.createdAt)}</td></tr>
                              <tr><td style="font-weight: bold;">Terms</td><td style="font-weight: bold;">: Due on Receipt</td></tr>
                              <tr><td style="font-weight: bold;">Due Date</td><td style="font-weight: bold;">: ${formatDate(inv.due_date || inv.createdAt)}</td></tr>
                              <tr><td style="font-weight: bold;">Service Start Date</td><td style="font-weight: bold;">: ${formatDate(s.start_date || inv.service_start_date)}</td></tr>
                              <tr><td style="font-weight: bold;">Service End Date</td><td style="font-weight: bold;">: ${formatDate(s.end_date || inv.service_end_date)}</td></tr>
                          </table>
                      </div>
                      <div class="details-right">
                          <table>
                              <tr><td style="font-weight: bold; width: 40%;">Amount Received</td><td style="font-weight: bold; text-align: center;">${paymentMethod}</td></tr>
                              <tr><td style="font-weight: bold;">Reference No.</td><td style="font-weight: bold; text-align: center;">${inv.payment_reference || inv.payment || 'N/A'}</td></tr>
                              <tr><td style="font-weight: bold;">Client Mobile No.</td><td style="font-weight: bold; text-align: center;">${user?.phone || user?.mobile || '9560898003'}</td></tr>
                              <tr><td style="font-weight: bold;">Client Mail id</td><td style="text-align: center;"><a href="mailto:${user?.email || 'jhatarun@gmail.com'}" style="color: #0070c0; text-decoration: underline;">${user?.email || 'jhatarun@gmail.com'}</a></td></tr>
                              <tr><td style="font-weight: bold;">Client PAN Number</td><td style="font-weight: bold; text-align: center;">${user?.pan || 'AKDPJ8435B'}</td></tr>
                              <tr><td style="font-weight: bold;">Service Frequency</td><td style="font-weight: bold; text-align: center;">Monthly</td></tr>
                          </table>
                      </div>
                  </div>

                  <div style="border-bottom: 1px solid #000; padding: 5px 10px; font-size: 11px;">
                      <div style="font-weight: bold; font-size: 13px;">MR.${user?.name || 'Tarun Jha'}</div>
                      <div style="font-weight: bold;">Address - 18/D-1 HINDUSTAN TIMES APARTMENTS MAYUR VIHAR PHASE 1 East Delhi Delhi 110091</div>
                  </div>

                  <table style="width: 100%; border-bottom: 1px solid #000; font-size: 10px;">
                      <thead>
                          <tr style="border-bottom: 1px solid #000;">
                              <th style="border-right: 1px solid #000; padding: 5px; width: 5%;">#</th>
                              <th style="border-right: 1px solid #000; padding: 5px; width: 45%;">Description Of Service</th>
                              <th style="border-right: 1px solid #000; padding: 5px; width: 15%;">HSN/SAC</th>
                              <th style="border-right: 1px solid #000; padding: 5px; width: 15%;">Rate</th>
                              <th style="padding: 5px; width: 20%;">Amount received</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td style="border-right: 1px solid #000; padding: 5px;">1</td>
                              <td style="border-right: 1px solid #000; padding: 5px;">
                                  <div style="font-weight: bold; color: #c00000;">${getPlanName(inv)}</div>
                                  <div style="font-weight: bold; margin-top: 5px;">IGST 18%</div>
                                  <div style="margin-top: 70px; font-weight: bold; color: #c00000;">Service Start From ${formatDate(s.start_date || inv.service_start_date)} To ${formatDate(s.end_date || inv.service_end_date)}</div>
                              </td>
                              <td style="border-right: 1px solid #000; padding: 5px; font-weight: bold;">997156</td>
                              <td style="border-right: 1px solid #000; padding: 5px; font-weight: bold;">
                                  ${originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td style="padding: 5px; font-weight: bold;">
                                  <div>${baseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                  <div style="margin-top: 5px;">${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                              </td>
                          </tr>
                      </tbody>
                  </table>

                  <div style="display: flex; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold;">
                      <div style="width: 55%; border-right: 1px solid #000; padding: 5px 10px;">
                          <div>Thank you for Your Business</div>
                          ${hasDiscount ? `<div style="color: #00b050; margin-top: 5px;">* Coupon Applied: ${inv.coupon_code} (${discountPercentage}% Off)</div>` : ''}
                          ${dueAmount > 0 ? `<div style="color: #c00000; margin-top: 5px;">* Pending Due Amount: ₹${dueAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>` : ''}
                      </div>
                      <div style="width: 45%; padding: 5px 10px; display: flex; flex-direction: column; justify-content: center;">
                          ${hasDiscount ? `
                              <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                                  <span>Original Amount -</span>
                                  <span>₹${originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div style="display: flex; justify-content: space-between; margin-bottom: 3px; color: #00b050;">
                                  <span>Discount -</span>
                                  <span>- ₹${discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              </div>
                          ` : ''}
                          <div style="display: flex; justify-content: space-between;">
                              <span>Total Amount Received -</span>
                              <span>₹${finalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                      </div>
                  </div>

                  <div style="border-bottom: 1px solid #000; padding: 5px 10px; font-size: 10px; color: #00b050; font-weight: bold;">
                      <span style="background-color: #ccffcc; padding: 2px 5px;">
                          Total in words – ${numberToWords(finalPaid)}
                      </span>
                  </div>

                  <div style="display: flex; border-bottom: 1px solid #000;">
                      <div style="width: 55%; border-right: 1px solid #000; padding: 15px 10px; font-size: 11px; font-weight: bold; display: flex; flex-direction: column; justify-content: center;">
                          <div style="margin-bottom: 5px;">ACCOUNT NAME - VISHTARA CAPITAL RESEARCH</div>
                          <div style="margin-bottom: 25px;">ACCOUNT NUMBER - 924020033713655</div>
                          <div>IFSC - UTIB0001724</div>
                      </div>
                      <div style="width: 45%; padding: 5px 10px; font-size: 10px; font-weight: bold; display: flex; flex-direction: column; align-items: center; justify-content: space-between;">
                          <div style="width: 100%; text-align: left;">Anujay Chouhan Proprietor of the Vishtara Capital Research</div>
                          <div style="margin: 15px 0;">
                              <div style="font-family: 'Brush Script MT', cursive; font-size: 24px; transform: rotate(-5deg);">Anujay</div>
                          </div>
                          <div style="width: 100%; text-align: right; color: #4b0082;">Proprietor</div>
                      </div>
                  </div>

                  <div style="padding: 5px 10px; font-size: 8px; line-height: 1.2;">
                      <div style="color: #c00000; font-weight: bold; margin-bottom: 5px;">PLEASE READ TERMS AND CONDITIONS TO AVOID ANY FUTURE CONFLICT OF INTEREST:</div>
                      <div>(1) "Registration granted by SEBI and certification from NISM in no way guarantees the performance of the intermediary or provides any assurance of returns to investors."</div>
                      <div>(2) Market Risks refer to either partial or permanent loss on your investments or portfolio in certain or adverse market conditions or company events.</div>
                      <div>(3) Past performance is not indicative of future results.</div>
                      <div>(4) We are SEBI Registered <span style="color: #00b050; font-weight: bold;">"Research Analyst"</span> not "Investment Advisers"</div>
                      <div>(5) We do not offer any return assurance or guarantee on investment or trading. If someone is doing this on our behalf, please contact our Compliance Officer by visiting our website and contact details. We are not responsible if you get lured into such activities. Since investing in securities market involves very high risk.</div>
                      <div><span style="color: #c00000; font-weight: bold;">(6) ANUJAY CHOUHAN PROPRIETOR OF VISHTARA CAPITAL RESEARCH</span> has a compliance officer to handle all trader/investor complaints. Please address all complaints to chouhananujay@gmail.com. We aim to resolve all complaints within 7 days.</div>
                      <div><span style="color: #c00000; font-weight: bold;">(7) ANUJAY CHOUHAN PROPRIETOR OF VISHTARA CAPITAL RESEARCH</span> is a <span style="color: #c00000; font-weight: bold;">SEBI registered Research Analyst with registration number INH000027779</span>. We do not provide Profit sharing/PMS-based services/Demat Account handling services. Our services are solely research-based recommendations on a pre-paid subscription basis.</div>
                      <div>(8) We will provide Buy/Sell/Hold or other ratings research based calls based on Technical & Fundamental research analysis during validity period. (9) Investors are advised to act according to their risk appetite, we are not providing Investment Advisory Services.</div>
                      <div>(10) Ensure you follow our stop-loss measures to prevent any open losses on your investments or portfolio.</div>
                      <div>(11) If you are interested in activating our multiple package services, please contact us to proceed.</div>
                      <div>(12) Services is valid for date specified from payment date.</div>
                      <div>(13) The fees paid towards our services are non-refundable in any circumstances.</div>
                      <div>(14) DISCLAIMER:- MAKE SURE YOU HAVE GONE THROUGH THE DISCLAIMER, PRIVACY POLICY, TERMS AND CONDITIONS AND REFUND POLICY ON http://www.vishtaracapitalresearch.in BEFORE PROCEEDING FOR SUBSCRIPTION OR MAKING PAYMENT FOR ANY OF OUR SERVICES. SUBSCRIPTION CHARGES, ONCE PAID ARE NONREFUNDABLE.</div>
                  </div>
              </div>
          </div>
      </body>
      </html>
      `;
  };

  const handleDownloadInvoice = async (inv: any) => {
    // If the frontend triggers a different download or just downloads the PDF from API
    // We assume backend returns blob via subscriptionService since frontend uses html2pdf
    // But mobile we can just try downloading by ID from backend.
    setDownloadingId(inv._id || inv.id);
    try {
      const blob = await subscriptionService.downloadInvoice(inv._id || inv.id);
      Alert.alert('Success', 'Invoice downloaded. Check your files.');
      console.log('Blob received:', blob);
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Error', 'Failed to download the invoice.');
    } finally {
      setDownloadingId(null);
    }
  };

  const openPreview = (inv: any) => {
      setSelectedInvoice(inv);
      setShowPreview(true);
  };

  // --- Renderers ---
  const renderItem = ({ item: inv }: { item: any }) => {
      const planName = getPlanName(inv);
      const invoiceDate = formatDate(inv.invoice_date || inv.createdAt);
      const invoiceAmount = parseFloat(inv.amount || 0);
      const status = inv.status || 'PAID';
      const isRefunded = status === 'REFUNDED';
      const isSuccess = !isRefunded && status !== 'Failed';

      return (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.row}>
            <View style={styles.infoCol}>
              <Text style={[styles.planText, { color: theme.textPrimary }]}>{planName}</Text>
              <Text style={[styles.dateText, { color: theme.textSecondary }]}>{invoiceDate}</Text>
              <Text style={[styles.idText, { color: theme.textSecondary }]}>ID: {inv.invoice_number || inv.number || inv._id}</Text>
            </View>

            <View style={styles.statusCol}>
              <Text style={[styles.amountText, { color: theme.textPrimary }]}>
                  ₹{invoiceAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
              {inv.refund_amount && (
                  <Text style={{fontSize: 10, color: theme.danger, fontWeight: 'bold', marginTop: 2, marginBottom: 4}}>
                      Refunded: ₹{inv.refund_amount}
                  </Text>
              )}
              <View style={[
                styles.badge, 
                isRefunded ? { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2' } : 
                { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }
              ]}>
                <Text style={[
                  styles.badgeText,
                  isRefunded ? { color: theme.danger } : { color: theme.success }
                ]}>{status}</Text>
              </View>
            </View>
          </View>

          {status !== 'REFUNDED' && (
            <>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.actionsRow}>
                  <TouchableOpacity 
                    style={styles.actionBtn} 
                    activeOpacity={0.6}
                    onPress={() => openPreview(inv)}
                  >
                    <Feather name="eye" size={16} color={theme.link} />
                    <Text style={[styles.actionText, { color: theme.link }]}>Preview</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionBtn, downloadingId === (inv._id || inv.id) && styles.downloadRowDisabled]} 
                    activeOpacity={0.6}
                    onPress={() => handleDownloadInvoice(inv)}
                    disabled={downloadingId === (inv._id || inv.id)}
                  >
                    {downloadingId === (inv._id || inv.id) ? (
                      <ActivityIndicator size="small" color={theme.link} style={{ marginRight: 8 }} />
                    ) : (
                      <Feather name="download" size={16} color={theme.textPrimary} />
                    )}
                    <Text style={[styles.actionText, { color: theme.textPrimary }]}>
                      {downloadingId === (inv._id || inv.id) ? "Downloading..." : "Download"}
                    </Text>
                  </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      );
  };

  return (
    <OtherPagesInc title="Payment History">
      <Stack.Screen options={{ headerShown: false }} />

      {loading ? (
        <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
            <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item, index) => item._id || item.id || String(index)}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, { backgroundColor: theme.bg }]}
          style={{ backgroundColor: theme.bg }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Feather name="file-text" size={48} color={theme.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Invoices Found</Text>
                <Text style={[styles.emptySub, { color: theme.textSecondary }]}>You don&#39;t have any payment history yet.</Text>
            </View>
          }
        />
      )}

      {/* INVOICE PREVIEW MODAL */}
      <Modal
        visible={showPreview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPreview(false)}
      >
          <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  {/* Actions Bar */}
                  <View style={[styles.modalActionBar, { borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(10, 10, 15, 0.95)' : '#F9FAFB' }]}>
                      <TouchableOpacity onPress={() => setShowPreview(false)} style={styles.modalCloseBtn}>
                          <Text style={[styles.modalCloseText, { color: theme.textSecondary }]}>Close</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                          onPress={() => {
                              if (selectedInvoice) {
                                  handleDownloadInvoice(selectedInvoice);
                              }
                          }} 
                          style={[styles.modalDownloadBtn, { backgroundColor: theme.primary }]}
                      >
                          <Text style={styles.modalDownloadText}>Download PDF</Text>
                      </TouchableOpacity>
                  </View>

                  {/* Document Body */}
                  <View style={{ flex: 1, backgroundColor: '#fff' }}>
                      {selectedInvoice && (
                          <WebView
                              originWhitelist={['*']}
                              source={{ html: getInvoiceHtml(selectedInvoice) }}
                              style={{ flex: 1, backgroundColor: 'transparent' }}
                              scalesPageToFit={true}
                              showsVerticalScrollIndicator={false}
                          />
                      )}
                  </View>
              </View>
          </View>
      </Modal>

    </OtherPagesInc>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoCol: {
    flex: 1,
  },
  planText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    marginBottom: 2,
  },
  idText: {
    fontSize: 12,
  },
  statusCol: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  downloadRowDisabled: {
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'flex-end',
  },
  modalContent: {
      height: Dimensions.get('window').height * 0.9,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderWidth: 1,
      overflow: 'hidden',
  },
  modalActionBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
  },
  modalCloseBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
  },
  modalCloseText: {
      fontSize: 14,
      fontWeight: '600',
  },
  modalDownloadBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
  },
  modalDownloadText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
  },
});