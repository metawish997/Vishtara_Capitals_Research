import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
  KeyboardAvoidingView,
  FlatList,
  Dimensions,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

// IMPORTANT: Adjust this path to wherever your ticketServices file is located
import ticketServices from '@/services/api/methods/ticketServices';
import { IMAGE_BASE_URL } from '@/services/api/apiClient';
import OtherPagesInc from '@/components/includes/otherPagesInc';
import { useAppearance } from '@/context/AppearanceContext';

// --- Constants ---
const THEME_COLOR = '#011d52';
const BG_COLOR = '#FFFFFF';
const CARD_BG = '#FFFFFF';
const { width } = Dimensions.get('window');

const CATEGORIES = ['Account Issue', 'Payment/Billing', 'KYC Verification', 'Technical Bug', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High']; // ADDED: Missing Priorities constant

// --- Types ---
interface TicketItem {
  id: string;
  subject: string;
  priority: string;
  status: string;
  date: string;
  category: string;
  description: string;
  admin_note: string;
  attachment?: string;
  createdAt: string;
  updatedAt: string;
}

const FAQS = [
  { q: "How long does KYC verification take?", a: "KYC verification is typically processed within 5-10 minutes. If it takes longer, please verify your uploaded document quality." },
  { q: "How can I upgrade or renew my plan?", a: "Go to Account > Subscription and tap 'Upgrade Plan' or 'Renew'. You can pay securely via UPI, Card, or Netbanking." },
  { q: "Why am I not receiving market call alerts?", a: "Please ensure push notifications are enabled for Vishtara Capitals Research App in your device settings." },
  { q: "How do I request account deletion?", a: "You can submit an account deletion request under Settings > Settings & Legal > Delete Account." }
];

const FaqItem = ({ q, a, theme }: { q: string; a: string; theme: any }) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <TouchableOpacity 
      style={[styles.faqItem, { backgroundColor: theme.card, borderColor: theme.border }]} 
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: theme.textPrimary }]}>{q}</Text>
        <Feather name={expanded ? "chevron-up" : "chevron-down"} size={16} color={theme.textSecondary} />
      </View>
      {expanded && (
        <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>{a}</Text>
      )}
    </TouchableOpacity>
  );
};

export default function SupportPage() {
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
    danger: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    btnText: isDark ? '#000000' : '#FFFFFF',
    inputBg: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F9FAFB',
    tabActiveBg: isDark ? 'rgba(248, 185, 23, 0.15)' : '#FFFFFF',
    tabActiveText: isDark ? '#f8b917' : '#111827',
  };

  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');

  // Create Ticket State
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [otherCategory, setOtherCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState(PRIORITIES[1]); // Set default to Medium

  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false); // ADDED: Missing dropdown state

  // History State
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  // --- API Integration ---
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketServices.getTicketList();
      
      // 1. Log the EXACT payload from the backend
      console.log('--- RAW TICKET HISTORY PAYLOAD ---');
      console.log(JSON.stringify(response, null, 2));
      console.log('----------------------------------');

      // 2. Safely find the array in the response
      let dataList = [];
      if (Array.isArray(response)) {
        dataList = response;
      } else if (response?.data && Array.isArray(response.data)) {
        dataList = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        dataList = response.data.data;
      } else if (response?.tickets && Array.isArray(response.tickets)) {
        dataList = response.tickets;
      }

      if (!Array.isArray(dataList)) {
         console.warn("Could not find an array in the response payload.");
         setIsLoadingHistory(false);
         setRefreshing(false);
         return;
      }

      const mappedTickets: TicketItem[] = dataList.map((item: any) => ({
        id: item._id?.toString() || item.id?.toString() || Math.random().toString(),
        subject: item.subject || item.title || item.issue || 'No Subject',
        priority: item.priority || 'Medium',
        status: item.status?.toLowerCase() || 'pending',
        date: item.createdAt || item.created_at 
            ? new Date(item.createdAt || item.created_at).toLocaleDateString() 
            : 'Recently',
        category: item.issue || item.category || 'Other',
        description: item.description || '',
        admin_note: item.admin_note || '',
        attachment: item.attachment || item.image || undefined,
        createdAt: item.createdAt || item.created_at || new Date().toISOString(),
        updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
      }));

      setTickets(mappedTickets);
    } catch (error) {
      console.error('Failed to load tickets', error);
    } finally {
      setIsLoadingHistory(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const handleAttachment = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photos to attach screenshots.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setAttachment(result.assets[0].uri);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const handleSubmitTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Missing Information', 'Please provide a subject and description.');
      return;
    }

    if (category === 'Other' && !otherCategory.trim()) {
      Alert.alert('Missing Information', 'Please specify your actual category.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      
      const finalCategory = category === 'Other' ? otherCategory.trim() : category;
      formData.append('issue', finalCategory); 
      formData.append('subject', subject); 
      formData.append('priority', priority);
      formData.append('description', description);

      if (attachment) {
        const filename = attachment.split('/').pop() || 'screenshot.jpg';
        const match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image/jpeg`;
        if (type === 'image/jpg') type = 'image/jpeg';

        formData.append('attachment', {
          uri: Platform.OS === 'ios' ? attachment.replace('file://', '') : attachment,
          name: filename,
          type,
        } as any);
      }

      await ticketServices.storeTicket(formData);

      Alert.alert('Ticket Raised', 'Your ticket has been created successfully.', [
        {
          text: 'View Status',
          onPress: () => {
            setSubject('');
            setPriority(PRIORITIES[1]);
            setDescription('');
            setCategory(CATEGORIES[0]);
            setOtherCategory('');
            setAttachment(null);
            
            setActiveTab('history');
            setIsLoadingHistory(true);
            fetchTickets();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Validation Errors:', JSON.stringify(error.response?.data, null, 2));
      
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to submit the ticket.';
      Alert.alert('Submission Failed', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const openLink = (type: 'whatsapp' | 'email' | 'call') => {
    switch (type) {
      case 'whatsapp':
        Linking.openURL('whatsapp://send?phone=918602027324&text=Hi, I need help with my account.');
        break;
      case 'email':
        Linking.openURL('mailto:support@vishtaracapitalresearch.in');
        break;
      case 'call':
        Linking.openURL('tel:+918602027324');
        break;
    }
  };

  // --- Renderers ---

  const renderCreateTicket = () => (
    <ScrollView 
      contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.bg }]} 
      style={{ backgroundColor: theme.bg }}
      showsVerticalScrollIndicator={false}
    >
      
      <View style={styles.quickContactContainer}>
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Instant Support</Text>
        <View style={styles.contactGrid}>
             <TouchableOpacity style={[styles.contactCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => openLink('call')}>
                <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#011d52' }]}>
                    <Feather name="phone-call" size={20} color={isDark ? theme.primary : '#FFFFFF'} />
                </View>
                <Text style={[styles.contactText, { color: theme.textPrimary }]}>Call Us</Text>
             </TouchableOpacity>

             <TouchableOpacity style={[styles.contactCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => openLink('whatsapp')}>
                <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }]}>
                    <MaterialCommunityIcons name="whatsapp" size={22} color="#10B981" />
                </View>
                <Text style={[styles.contactText, { color: theme.textPrimary }]}>WhatsApp</Text>
             </TouchableOpacity>

             <TouchableOpacity style={[styles.contactCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => openLink('email')}>
                <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(249, 115, 22, 0.15)' : '#FFF7ED' }]}>
                    <Feather name="mail" size={20} color="#F97316" />
                </View>
                <Text style={[styles.contactText, { color: theme.textPrimary }]}>Email</Text>
             </TouchableOpacity>
        </View>
      </View>

      <View style={styles.faqSection}>
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Frequently Asked Questions</Text>
        {FAQS.map((faq, index) => (
          <FaqItem key={index} q={faq.q} a={faq.a} theme={theme} />
        ))}
      </View>

      <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Raise a Ticket</Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>Submit your query and we will resolve it ASAP.</Text>
 
        <Text style={[styles.label, { color: theme.textSecondary }]}>Category</Text>
        <View style={{ zIndex: 10 }}>
            <TouchableOpacity 
            style={[styles.dropdownBtn, { backgroundColor: theme.inputBg, borderColor: theme.border }]} 
            activeOpacity={0.8}
            onPress={() => setShowCatDropdown(!showCatDropdown)}
            >
            <Text style={[styles.dropdownText, { color: theme.textPrimary }]}>{category}</Text>
            <Feather name={showCatDropdown ? "chevron-up" : "chevron-down"} size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            
            {showCatDropdown && (
            <View style={[styles.dropdownList, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {CATEGORIES.map((cat, idx) => (
                <TouchableOpacity 
                    key={idx} 
                    style={[styles.dropdownItem, { borderBottomColor: theme.border }, idx === CATEGORIES.length - 1 && { borderBottomWidth: 0 }]}
                    onPress={() => {
                    setCategory(cat);
                    setShowCatDropdown(false);
                    }}
                >
                    <Text style={[styles.dropdownItemText, { color: theme.textSecondary }, category === cat && { color: theme.primary, fontWeight: '600' }]}>{cat}</Text>
                    {category === cat && <Feather name="check" size={16} color={theme.primary} />}
                </TouchableOpacity>
                ))}
            </View>
            )}
        </View>

        {category === 'Other' && (
          <>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Specify Category</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
              placeholder="E.g., Dividend not received"
              placeholderTextColor={theme.textSecondary}
              value={otherCategory}
              onChangeText={setOtherCategory}
            />
          </>
        )}

        <Text style={[styles.label, { color: theme.textSecondary }]}>Subject</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
          placeholder="Brief summary of the issue"
          placeholderTextColor={theme.textSecondary}
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Priority</Text>
        <View style={{ zIndex: 9 }}>
            <TouchableOpacity 
            style={[styles.dropdownBtn, { backgroundColor: theme.inputBg, borderColor: theme.border }]} 
            activeOpacity={0.8}
            onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
            >
            <Text style={[styles.dropdownText, { color: theme.textPrimary }]}>{priority}</Text>
            <Feather name={showPriorityDropdown ? "chevron-up" : "chevron-down"} size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            
            {showPriorityDropdown && (
            <View style={[styles.dropdownList, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {PRIORITIES.map((p, idx) => (
                <TouchableOpacity 
                    key={idx} 
                    style={[styles.dropdownItem, { borderBottomColor: theme.border }, idx === PRIORITIES.length - 1 && { borderBottomWidth: 0 }]}
                    onPress={() => {
                    setPriority(p);
                    setShowPriorityDropdown(false);
                    }}
                >
                    <Text style={[styles.dropdownItemText, { color: theme.textSecondary }, priority === p && { color: theme.primary, fontWeight: '600' }]}>{p}</Text>
                    {priority === p && <Feather name="check" size={16} color={theme.primary} />}
                </TouchableOpacity>
                ))}
            </View>
            )}
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
          placeholder="Describe your issue in detail..."
          placeholderTextColor={theme.textSecondary}
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={[styles.label, { color: theme.textSecondary, marginTop: 15 }]}>Attachments (Optional)</Text>
        {!attachment ? (
            <TouchableOpacity style={[styles.attachBtn, { backgroundColor: theme.inputBg, borderColor: theme.border }]} onPress={handleAttachment}>
                <View style={[styles.attachIconBg, { backgroundColor: isDark ? 'rgba(248, 185, 23, 0.1)' : '#f7fee7' }]}>
                    <Feather name="image" size={20} color={theme.primary} />
                </View>
                <View>
                    <Text style={[styles.attachTitle, { color: theme.textPrimary }]}>Upload Screenshot</Text>
                    <Text style={[styles.attachSub, { color: theme.textSecondary }]}>Tap to browse gallery</Text>
                </View>
            </TouchableOpacity>
        ) : (
             <View style={[styles.attachmentPreview, { borderColor: theme.border }]}>
                 <Image source={{ uri: attachment }} style={styles.previewImage} contentFit="cover" transition={200} />
                 <TouchableOpacity style={styles.removeAttachBtn} onPress={removeAttachment}>
                    <Feather name="x" size={16} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.attachedLabel}>Screenshot attached</Text>
            </View>
        )}



        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: theme.primary }]} 
          onPress={handleSubmitTicket} 
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={theme.btnText} />
          ) : (
            <>
                <Text style={[styles.submitBtnText, { color: theme.btnText }]}>Submit Ticket</Text>
                <Feather name="send" size={18} color={theme.btnText} style={{marginLeft: 8}} />
            </>
          )}
        </TouchableOpacity>
      </View>
      <View style={{height: 40}} />
    </ScrollView>
  );

  const renderHistory = () => {
    if (isLoadingHistory) {
      return (
        <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      );
    }

    return (
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, flexGrow: 1, backgroundColor: theme.bg }}
        style={{ backgroundColor: theme.bg }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}>
              <Feather name="inbox" size={32} color={theme.textSecondary} />
            </View>
            <Text style={[styles.emptyText, { color: theme.textPrimary }]}>No tickets found</Text>
            <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>You have not raised any support tickets yet.</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          let statusColor = '#F59E0B'; // Pending (Amber)
          let statusBg = isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB';
          
          if (item.status === 'resolved' || item.status === 'closed') {
              statusColor = '#10B981'; // Green
              statusBg = isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5';
          } else if (item.status === 'rejected') {
              statusColor = '#EF4444'; // Red
              statusBg = isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2';
          } else if (item.status === 'in progress' || item.status === 'open') {
              statusColor = theme.primary;
              statusBg = isDark ? 'rgba(248, 185, 23, 0.15)' : '#f7fee7';
          }

          return (
            <View style={[styles.ticketCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.ticketRow}>
                <View style={[styles.ticketIdBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}>
                  <Text style={[styles.ticketIdText, { color: theme.textSecondary }]}>Ticket {index + 1}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                  <Text style={[styles.statusText, { color: statusColor }]}>{item.status.toUpperCase()}</Text>
                </View>
              </View>
              
              <Text style={[styles.ticketSubject, { color: theme.textPrimary }]}>{item.subject}</Text>
              
              <View style={styles.ticketMetaRow}>
                  <View style={styles.metaItem}>
                      <Feather name="tag" size={12} color={theme.textSecondary} />
                      <Text style={[styles.ticketMeta, { color: theme.textSecondary }]}>{item.category}</Text>
                  </View>
                  <View style={styles.metaItem}>
                      <Feather name="clock" size={12} color={theme.textSecondary} />
                      <Text style={[styles.ticketMeta, { color: theme.textSecondary }]}>{item.date}</Text>
                  </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              
              <TouchableOpacity 
                style={styles.viewBtn}
                onPress={() => setSelectedTicket(item)}
              >
                  <Text style={[styles.viewBtnText, { color: theme.primary }]}>View Timeline</Text>
                  <Feather name="chevron-right" size={16} color={theme.primary} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    );
  };

  const renderTimelineModal = () => {
    if (!selectedTicket) return null;

    const status = selectedTicket.status.toLowerCase();
    
    // Timeline calculations
    const createdDate = new Date(selectedTicket.createdAt);
    const updatedDate = new Date(selectedTicket.updatedAt);
    
    // Check if it's been more than 3-4 days since update
    const expectedResolutionDate = new Date(updatedDate);
    expectedResolutionDate.setDate(expectedResolutionDate.getDate() + 4); // 4 days max
    const isOverdue = new Date() > expectedResolutionDate;

    let expectedTimelineText = '';
    if (status === 'open') {
        if (isOverdue) {
            expectedTimelineText = 'Expected admin responding soon...';
        } else {
            expectedTimelineText = `Issue will be resolved by ${expectedResolutionDate.toLocaleDateString()}`;
        }
    }

    return (
      <Modal visible={!!selectedTicket} animationType="slide" transparent={true} onRequestClose={() => setSelectedTicket(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.bg }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{selectedTicket.category}</Text>
              <TouchableOpacity onPress={() => setSelectedTicket(null)} style={styles.closeBtn}>
                <Feather name="x" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={[styles.detailCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.detailSubject, { color: theme.textPrimary }]}>{selectedTicket.subject}</Text>
                <Text style={[styles.detailDesc, { color: theme.textSecondary }]}>{selectedTicket.description}</Text>
                {selectedTicket.attachment ? (
                  <View style={{ marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: theme.border }}>
                     <Text style={{ fontSize: 11, fontWeight: '800', color: theme.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Attachment</Text>
                     <TouchableOpacity 
                        activeOpacity={0.9} 
                        onPress={() => Linking.openURL(selectedTicket.attachment!.startsWith('http') ? selectedTicket.attachment! : `${IMAGE_BASE_URL}${selectedTicket.attachment}`)}
                     >
                          <Image 
                             source={{ uri: selectedTicket.attachment!.startsWith('http') ? selectedTicket.attachment! : `${IMAGE_BASE_URL}${selectedTicket.attachment}` }} 
                             style={{ width: '100%', height: 160, borderRadius: 12, borderWidth: 1, borderColor: theme.border }} 
                             contentFit="cover"
                             transition={200}
                          />
                     </TouchableOpacity>
                  </View>
                ) : null}
              </View>

              <Text style={[styles.sectionHeader, { color: theme.textSecondary, marginTop: 20 }]}>Ticket Timeline</Text>
              
              <View style={[styles.timelineContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                
                {/* Step 1: Created */}
                <View style={styles.timelineRow}>
                  <View style={styles.timelineIconCol}>
                    <View style={[styles.timelineDot, { backgroundColor: theme.success }]} />
                    <View style={[styles.timelineLine, { backgroundColor: theme.success }]} />
                  </View>
                  <View style={styles.timelineContentCol}>
                    <Text style={[styles.timelineTitle, { color: theme.textPrimary }]}>Ticket Raised</Text>
                    <Text style={[styles.timelineDate, { color: theme.textSecondary }]}>{createdDate.toLocaleString()}</Text>
                  </View>
                </View>

                {/* Step 2: Open / In Progress */}
                <View style={styles.timelineRow}>
                  <View style={styles.timelineIconCol}>
                    <View style={[styles.timelineDot, { backgroundColor: (status === 'open' || status === 'in progress' || status === 'resolved') ? theme.primary : theme.border }]} />
                    {status === 'resolved' && <View style={[styles.timelineLine, { backgroundColor: theme.success }]} />}
                  </View>
                  <View style={styles.timelineContentCol}>
                    <Text style={[styles.timelineTitle, { color: theme.textPrimary }]}>
                      {status === 'open' ? 'Admin Reviewing' : (status === 'resolved' ? 'Reviewed by Admin' : 'Awaiting Review')}
                    </Text>
                    {(status === 'open' || status === 'resolved') && (
                      <Text style={[styles.timelineDate, { color: theme.textSecondary }]}>{updatedDate.toLocaleString()}</Text>
                    )}
                    {status === 'open' && (
                        <Text style={[styles.timelineExpected, { color: theme.warning }]}>{expectedTimelineText}</Text>
                    )}
                  </View>
                </View>

                {/* Step 3: Resolved */}
                {(status === 'resolved' || status === 'closed') && (
                    <View style={[styles.timelineRow, { marginTop: 20 }]}>
                      <View style={styles.timelineIconCol}>
                        <View style={[styles.timelineDot, { backgroundColor: theme.success }]} />
                      </View>
                      <View style={styles.timelineContentCol}>
                        <Text style={[styles.timelineTitle, { color: theme.textPrimary }]}>Ticket Resolved</Text>
                        <Text style={[styles.timelineDate, { color: theme.textSecondary }]}>{updatedDate.toLocaleString()}</Text>
                        {selectedTicket.admin_note ? (
                            <View style={[styles.adminNoteBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5', borderColor: theme.success }]}>
                                <Text style={[styles.adminNoteLabel, { color: theme.success }]}>Resolution Note:</Text>
                                <Text style={[styles.adminNoteText, { color: isDark ? '#fff' : '#065F46' }]}>{selectedTicket.admin_note}</Text>
                            </View>
                        ) : null}
                      </View>
                    </View>
                )}

              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <OtherPagesInc title="Help & Support">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />

      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: theme.bg, paddingTop: 10 }]}>
        <View style={[styles.tabWrapper, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }]}>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'create' && { backgroundColor: theme.card }]} 
                onPress={() => setActiveTab('create')}
                activeOpacity={0.9}
            >
                <Text style={[styles.tabText, { color: theme.textSecondary }, activeTab === 'create' && { color: theme.tabActiveText, fontWeight: '700' }]}>Raise Ticket</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'history' && { backgroundColor: theme.card }]} 
                onPress={() => setActiveTab('history')}
                activeOpacity={0.9}
            >
                <Text style={[styles.tabText, { color: theme.textSecondary }, activeTab === 'history' && { color: theme.tabActiveText, fontWeight: '700' }]}>My History</Text>
            </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1, backgroundColor: theme.bg }}
      >
        {activeTab === 'create' ? renderCreateTicket() : renderHistory()}
      </KeyboardAvoidingView>

      {renderTimelineModal()}
    </OtherPagesInc>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 35,
    paddingBottom: 15,
    backgroundColor: BG_COLOR,
  },
  backBtn: {
    padding: 8,
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

  // Tabs (Segmented Control Style)
  tabContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#111827',
  },

  // Create Ticket Scroll
  scrollContent: {
    padding: 10,
    paddingTop: 10,
  },

  // Contact Grid
  quickContactContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  contactGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  // Form Card
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  
  // Dropdown
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
  },
  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },
  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'absolute',
    top: 55,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },

  // Inputs
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 120,
  },

  // Attachments
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  attachIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE', // Light blue
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attachTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  attachSub: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  attachmentPreview: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewImage: {
    width: '100%',
    height: 180,
  },
  removeAttachBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 20,
  },
  attachedLabel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: 12,
    padding: 6,
    textAlign: 'center',
  },

  // Submit
  submitBtn: {
    backgroundColor: THEME_COLOR,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: THEME_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // History
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketIdBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ticketIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  ticketMetaRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 12,
  },
  metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
  },
  ticketMeta: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewBtnText: {
    color: THEME_COLOR,
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  emptySubText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  faqSection: {
    marginBottom: 24,
  },
  faqItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },

  // Modal & Timeline Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    padding: 20,
  },
  detailCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  detailSubject: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  timelineContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineIconCol: {
    width: 30,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    height: 50,
    marginTop: 4,
  },
  timelineContentCol: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 20,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  timelineDate: {
    fontSize: 12,
    marginTop: 2,
  },
  timelineExpected: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  adminNoteBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  adminNoteLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  adminNoteText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});