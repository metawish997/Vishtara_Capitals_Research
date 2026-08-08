import React, { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { notificationService } from '@/services/notificationService';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/includes/header';
import Indices from '@/components/dasboardSections/indices';
import SectoralIndices from '@/components/dasboardSections/sectoralIndices';
import MarketMovers from '@/components/dasboardSections/marketMovers';
import TodaysMarketHighlights from '@/components/dasboardSections/todaysMarketHighlights'; 
import Search from '@/components/includes/search';
import { useAppearance } from '@/context/AppearanceContext';

export default function App() {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);



  useFocusEffect(
    useCallback(() => {
      notificationService.checkAndPromptDailyPermission();
    }, [])
  );

  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';
  const bgColor = isDark ? '#020210' : '#FFFFFF';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
      <View style={styles.container}>
        <Header />
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 100 }} 
          showsVerticalScrollIndicator={false}
          // 5. Attach RefreshControl here
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* <Search value={search} onChangeText={setSearch} /> */}
          
          <Indices />
          
          <TodaysMarketHighlights />
          
          <SectoralIndices />
          
          <MarketMovers />
          
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
});