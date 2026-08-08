import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

import chatServices from '@/services/api/methods/chatServices';
import { storage } from '@/services/storage';
import { useAppearance } from '@/context/AppearanceContext';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

const COLORS = {
  primary: '#2A2A2A',
  accent: '#0a7ea4',
  headerAvatarBg: '#0a7ea4',
  background: '#F5F5F7',
  white: '#FFFFFF',
  grayLight: '#E5E5EA',
  textDark: '#000000',
  textLight: '#8E8E93',
  greenOnline: '#10B981',
};

interface ChatProps {
  onClose?: () => void;
}

export default function ChatScreen({ onClose }: ChatProps) {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#020210' : '#F5F5F7',
    headerBg: isDark ? '#040410' : '#FFFFFF',
    headerBorder: isDark ? 'rgba(248, 185, 23, 0.15)' : '#F0F0F0',
    card: isDark ? '#040410' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#B5B2B1' : '#8E8E93',
    accent: isDark ? '#f8b917' : '#0a7ea4',
    bubbleOther: isDark ? '#1C1C24' : '#FFFFFF',
    bubbleMe: isDark ? '#f8b917' : '#0a7ea4',
    textMe: isDark ? '#020210' : '#FFFFFF',
    inputBg: isDark ? '#1C1C24' : '#F2F2F7',
    iconColor: isDark ? '#f8b917' : '#0a7ea4',
    greenOnline: '#10B981',
    headerAvatarBg: isDark ? 'rgba(248, 185, 23, 0.15)' : '#0a7ea4',
  };

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [admin, setAdmin] = useState<{ _id?: string, id?: string, name: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Admin View State
  const [isAdminView, setIsAdminView] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const flatListRef = useRef<FlatList>(null);

  // --- Initial Fetch & Live Polling ---
  useEffect(() => {
    const init = async () => {
      const user = await storage.getUser();
      setCurrentUser(user);
      const isUserAdmin = user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'super_admin';
      setIsAdminView(isUserAdmin);

      if (isUserAdmin) {
        fetchConversations();
        const intervalId = setInterval(fetchConversations, 5000);
        return () => clearInterval(intervalId);
      } else {
        const adminData = await chatServices.getSupportAdmin();
        const adminTargetId = adminData?._id || adminData?.id;
        if (adminData && adminTargetId) {
          setAdmin(adminData);
          fetchHistory(true, adminTargetId);

          const intervalId = setInterval(() => {
            fetchHistory(false, adminTargetId); 
          }, 3000);

          return () => clearInterval(intervalId);
        } else {
          setIsLoading(false);
        }
      }
    };
    
    const cleanupPromise = init();
    return () => {
      cleanupPromise.then(cleanup => cleanup && cleanup());
    };
  }, []);

  // Poll for messages when an admin selects a customer
  useEffect(() => {
    if (isAdminView && selectedCustomer) {
      fetchHistory(true, selectedCustomer.userId);
      const intervalId = setInterval(() => {
        fetchHistory(false, selectedCustomer.userId);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [isAdminView, selectedCustomer]);

  const fetchConversations = async () => {
    try {
      const res = await chatServices.getConversations();
      if (Array.isArray(res)) setConversations(res);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setIsLoading(false);
    }
  };

  const fetchHistory = async (showLoader = true, targetId?: string) => {
    try {
      const target = isAdminView ? (selectedCustomer?.userId || selectedCustomer?.id) : (targetId || admin?._id || admin?.id);
      if (!target) return;

      if (showLoader) setIsLoading(true);
      const historyData = await chatServices.getChatHistory(target);
      
      const dataArray = Array.isArray(historyData) 
        ? historyData 
        : (historyData?.data && Array.isArray(historyData.data)) 
          ? historyData.data 
          : [];

      if (dataArray && dataArray.length > 0) {
        const formattedHistory: Message[] = dataArray.map((msg: any) => {
          // Exactly matching frontend logic: if sender is the current user, it's my message
          const isMyMessage = (msg.sender === currentUser?.id || msg.sender === currentUser?._id);

          return {
            id: msg.id?.toString() || msg._id?.toString() || Math.random().toString(),
            text: msg.message || '', 
            sender: isMyMessage ? 'me' : 'other', 
            timestamp: msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        });
        
        setMessages(formattedHistory);
      } else {
        // Removed the dummy messages. It will just be empty now.
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load chat history', error);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  // --- Send Message ---
  const sendMessage = async () => {
    const target = isAdminView ? (selectedCustomer?.userId || selectedCustomer?.id) : (admin?._id || admin?.id);
    if (inputText.trim().length === 0 || !target) return;

    const textToSend = inputText.trim();
    setInputText('');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // 1. Optimistically add message to UI instantly
    const newMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages((prev) => [...prev, newMessage]);

    try {
      // 2. Send to API silently
      await chatServices.sendMessage({ receiverId: target, message: textToSend });
      
      // 3. Immediately trigger a silent fetch to get the finalized list/bot replies
      if (isAdminView) fetchHistory(false, target);
      else fetchHistory(false);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optional: You could remove the message from state here if it fails to send
    }
  };

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.sender === 'me';
    const isNextSame = messages[index + 1]?.sender === item.sender;

    return (
      <View style={[
        styles.messageRow,
        isMe ? styles.rowEnd : styles.rowStart,
        { marginBottom: isNextSame ? 4 : 16 }
      ]}>
        {!isMe && (
          <View style={styles.avatarContainer}>
            {!isNextSame ? (
              <View style={[styles.avatarCircle, { backgroundColor: theme.headerAvatarBg }]}>
                <MaterialIcons name="support-agent" size={16} color={isDark ? theme.accent : "#fff"} />
              </View>
            ) : (
              <View style={styles.avatarSpacer} />
            )}
          </View>
        )}

        <View style={[
          styles.bubble,
          isMe ? [styles.bubbleMe, { backgroundColor: theme.bubbleMe }] : [styles.bubbleOther, { backgroundColor: theme.bubbleOther }],
          isMe && !isNextSame ? { borderBottomRightRadius: 4 } : {},
          !isMe && !isNextSame ? { borderBottomLeftRadius: 4 } : {},
        ]}>
          <Text style={[styles.messageText, isMe ? [styles.textMe, { color: theme.textMe }] : [styles.textOther, { color: theme.textPrimary }]]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, isMe ? [styles.timeMe, { color: isDark ? 'rgba(2,2,16,0.6)' : 'rgba(255,255,255,0.7)' }] : [styles.timeOther, { color: theme.textSecondary }]]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.headerBorder }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {(isAdminView && selectedCustomer) ? (
              <TouchableOpacity onPress={() => setSelectedCustomer(null)} style={{ marginRight: 10 }}>
                <Feather name="arrow-left" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            ) : null}
            <View style={[styles.headerAvatar, { backgroundColor: theme.headerAvatarBg }]}>
              {(isAdminView && selectedCustomer) ? (
                <Text style={{color: isDark ? theme.accent : '#fff', fontWeight: 'bold'}}>{selectedCustomer.name?.substring(0,2).toUpperCase()}</Text>
              ) : (
                <MaterialIcons name="support-agent" size={24} color={isDark ? theme.accent : "#fff"} />
              )}
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                {isAdminView 
                  ? (selectedCustomer ? selectedCustomer.name : 'Support Terminal') 
                  : (admin?.name || 'Support')}
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.greenOnline }]}>
                {isAdminView 
                  ? (selectedCustomer ? selectedCustomer.smra_id : `${conversations.length} Active Links`)
                  : 'Online'}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            {onClose && (
              <TouchableOpacity style={styles.iconButton} onPress={onClose}>
                <Feather name="x" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (isAdminView && !selectedCustomer) ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.userId?.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.convCard, { backgroundColor: theme.card, borderColor: theme.headerBorder, borderWidth: 1 }]} 
              onPress={() => setSelectedCustomer(item)}
            >
              <View style={[styles.convAvatar, { backgroundColor: isDark ? 'rgba(248, 185, 23, 0.1)' : '#E0F2FE' }]}>
                <Text style={[styles.convAvatarText, { color: theme.accent }]}>{item.name?.substring(0, 2).toUpperCase()}</Text>
              </View>
              <View style={styles.convInfo}>
                <View style={styles.convHeaderRow}>
                  <Text style={[styles.convName, { color: theme.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.convTime, { color: theme.textSecondary }]}>
                    {new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </View>
                <Text style={[styles.convLastMessage, { color: theme.textSecondary }]} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
              {item.unread && <View style={[styles.unreadDot, { backgroundColor: theme.accent }]} />}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No Active Conversations</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="interactive"
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Start the conversation...</Text>
            </View>
          }
        />
      )}

      {/* Input Area */}
      {(!isAdminView || selectedCustomer) && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <View style={[styles.inputWrapper, { backgroundColor: theme.headerBg, borderTopColor: theme.headerBorder }]}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add" size={28} color={theme.iconColor} />
            </TouchableOpacity>

            <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor={theme.textSecondary}
                multiline
                maxLength={500}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: inputText.trim() ? theme.accent : (isDark ? '#1C1C24' : COLORS.grayLight) }
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={inputText.trim() ? (isDark ? '#020210' : COLORS.white) : (isDark ? '#333' : '#A0A0A0')}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  convCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  convAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  convAvatarText: {
    color: '#0284C7',
    fontWeight: 'bold',
    fontSize: 16,
  },
  convInfo: {
    flex: 1,
  },
  convHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  convName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  convTime: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  convLastMessage: {
    fontSize: 13,
    color: '#6B7280',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
    marginLeft: 8,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  header: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.headerAvatarBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.greenOnline,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 20,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  rowStart: {
    justifyContent: 'flex-start',
  },
  rowEnd: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginRight: 8,
    width: 28,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSpacer: {
    width: 28,
    height: 28,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  bubbleOther: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  bubbleMe: {
    backgroundColor: COLORS.accent,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  textOther: {
    color: COLORS.textDark,
  },
  textMe: {
    color: COLORS.white,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeOther: {
    color: '#8E8E93',
  },
  timeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  attachButton: {
    padding: 10,
    marginBottom: 4,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
    minHeight: 40,
    justifyContent: 'center',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: COLORS.textDark,
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
});