const fs = require('fs');
const path = require('path');

const WEB_DIR = path.join(__dirname, 'vistara-theme', 'src', 'pages', 'policies');
const APP_DIR = path.join(__dirname, 'vistara_app', 'app', 'pages', 'policies');

const templateStart = `import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const {{COMPONENT_NAME}} = () => {
  const router = useRouter();
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';

  const THEME_COLOR = isDark ? '#a3ff00' : '#8cc63f';
  const BG_COLOR = isDark ? '#020210' : '#F8F9FA';
  const CARD_BG = isDark ? '#040410' : '#FFFFFF';
  const TEXT_PRIMARY = isDark ? '#FFFFFF' : '#111827';
  const TEXT_SECONDARY = isDark ? '#B5B2B1' : '#6B7280';
  const BORDER_COLOR = isDark ? 'rgba(163, 255, 0, 0.15)' : '#E5E7EB';
  const ICON_BG = isDark ? '#0a0a1a' : '#F9FAFB';
  const BACK_ICON_COLOR = isDark ? '#FFFFFF' : '#1F2937';

  const styles = getStyles({ THEME_COLOR, BG_COLOR, CARD_BG, TEXT_PRIMARY, TEXT_SECONDARY, BORDER_COLOR, ICON_BG, isDark });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Feather name="arrow-left" size={24} color={BACK_ICON_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{{TITLE}}</Text>
        <View style={styles.balanceView} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
`;

const templateEnd = `
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = ({ THEME_COLOR, BG_COLOR, CARD_BG, TEXT_PRIMARY, TEXT_SECONDARY, BORDER_COLOR, ICON_BG, isDark }: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_COLOR },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: CARD_BG, borderBottomWidth: 1, borderBottomColor: BORDER_COLOR },
  backIcon: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT_PRIMARY },
  balanceView: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 12, paddingBottom: 24 },
  card: { backgroundColor: CARD_BG, borderRadius: 12, elevation: 2, padding: 16 },
  
  view: { marginBottom: 12 },
  h1: { fontSize: 22, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 12 },
  h2: { fontSize: 18, fontWeight: '700', color: TEXT_PRIMARY, marginTop: 16, marginBottom: 8 },
  h3: { fontSize: 16, fontWeight: '600', color: TEXT_PRIMARY, marginTop: 12, marginBottom: 6 },
  p: { fontSize: 14, lineHeight: 20, color: TEXT_SECONDARY, marginBottom: 10 },
  ul: { paddingLeft: 8, marginBottom: 10 },
  li: { fontSize: 14, lineHeight: 20, color: TEXT_SECONDARY, marginBottom: 6 },
  bold: { fontWeight: '700', color: TEXT_PRIMARY },
  a: { color: THEME_COLOR, textDecorationLine: 'underline' },
  table: { borderWidth: 1, borderColor: BORDER_COLOR, borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: BORDER_COLOR },
  th: { flex: 1, padding: 8, backgroundColor: ICON_BG },
  thText: { fontWeight: 'bold', color: TEXT_PRIMARY, fontSize: 13 },
  td: { flex: 1, padding: 8 },
  tdText: { color: TEXT_SECONDARY, fontSize: 13 },
});

export default PolicyTemplate;
`;

function processFile(filePath) {
    const filename = path.basename(filePath, '.jsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract content inside <PolicyLayout>
    let match = content.match(/<PolicyLayout[^>]*>([\s\S]*?)<\/PolicyLayout>/);
    if (!match) return;

    let body = match[1];

    // Remove complex JS blocks {(() => { ... })()}
    body = body.replace(/\{\(\(\)\s*=>\s*\{[\s\S]*?\}\)\(\)\}/g, '');

    // Transform HTML to React Native components
    body = body
        .replace(/<div\b[^>]*>/gi, '<View style={styles.view}>')
        .replace(/<\/div>/gi, '</View>')
        .replace(/<p\b[^>]*>/gi, '<Text style={styles.p}>')
        .replace(/<\/p>/gi, '</Text>')
        .replace(/<h1\b[^>]*>/gi, '<Text style={styles.h1}>')
        .replace(/<\/h1>/gi, '</Text>')
        .replace(/<h2\b[^>]*>/gi, '<Text style={styles.h2}>')
        .replace(/<\/h2>/gi, '</Text>')
        .replace(/<h3\b[^>]*>/gi, '<Text style={styles.h3}>')
        .replace(/<\/h3>/gi, '</Text>')
        .replace(/<h4\b[^>]*>/gi, '<Text style={styles.h3}>')
        .replace(/<\/h4>/gi, '</Text>')
        .replace(/<ul\b[^>]*>/gi, '<View style={styles.ul}>')
        .replace(/<\/ul>/gi, '</View>')
        .replace(/<ol\b[^>]*>/gi, '<View style={styles.ul}>')
        .replace(/<\/ol>/gi, '</View>')
        .replace(/<li\b[^>]*>/gi, '<Text style={styles.li}>• ')
        .replace(/<\/li>/gi, '</Text>')
        .replace(/<span\b[^>]*>/gi, '<Text>')
        .replace(/<\/span>/gi, '</Text>')
        .replace(/<strong\b[^>]*>/gi, '<Text style={styles.bold}>')
        .replace(/<\/strong>/gi, '</Text>')
        .replace(/<b\b[^>]*>/gi, '<Text style={styles.bold}>')
        .replace(/<\/b>/gi, '</Text>')
        .replace(/<section\b[^>]*>/gi, '<View style={styles.view}>')
        .replace(/<\/section>/gi, '</View>')
        .replace(/<address\b[^>]*>/gi, '<View style={styles.view}><Text style={styles.p}>')
        .replace(/<\/address>/gi, '</Text></View>')
        .replace(/<a\b[^>]*href=["'](mailto:)?([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '<Text style={styles.a}>$3</Text>')
        .replace(/<a\b[^>]*>/gi, '<Text style={styles.a}>')
        .replace(/<\/a>/gi, '</Text>')
        .replace(/<br\b[^>]*\/?>/gi, '\n')
        .replace(/<i\b[^>]*>.*?<\/i>/gi, '') // Remove icons
        .replace(/<table\b[^>]*>/gi, '<View style={styles.table}>')
        .replace(/<\/table>/gi, '</View>')
        .replace(/<thead\b[^>]*>/gi, '<View>')
        .replace(/<\/thead>/gi, '</View>')
        .replace(/<tbody\b[^>]*>/gi, '<View>')
        .replace(/<\/tbody>/gi, '</View>')
        .replace(/<tr\b[^>]*>/gi, '<View style={styles.tr}>')
        .replace(/<\/tr>/gi, '</View>')
        .replace(/<th\b[^>]*>/gi, '<View style={styles.th}><Text style={styles.thText}>')
        .replace(/<\/th>/gi, '</Text></View>')
        .replace(/<td\b[^>]*>/gi, '<View style={styles.td}><Text style={styles.tdText}>')
        .replace(/<\/td>/gi, '</Text></View>')
        .replace(/<em\b[^>]*>/gi, '<Text style={[styles.p, {fontStyle: "italic"}]}>')
        .replace(/<\/em>/gi, '</Text>');

    // Wrap bare text inside View with Text tag
    body = body.replace(/<View style=\{styles\.view\}>\s*([^<]+?)\s*<\/View>/g, '<View style={styles.view}><Text style={styles.p}>$1</Text></View>');

    // Clean up empty classes or leftover style artifacts
    body = body.replace(/className=["'][^"']*["']/g, '');
    
    // Fix some unescaped characters or weird HTML entities
    body = body.replace(/&amp;/g, '&');
    body = body.replace(/&nbsp;/g, ' ');
    body = body.replace(/&gt;/g, '>');
    body = body.replace(/&lt;/g, '<');

    // Title formatting (add spaces before capital letters)
    let title = filename.replace(/([A-Z])/g, ' $1').trim();

    let fullFile = templateStart.replace('{{TITLE}}', title).replace('{{COMPONENT_NAME}}', filename) + body + templateEnd.replace(/PolicyTemplate/g, filename);

    const outPath = path.join(APP_DIR, filename + '.tsx');
    fs.writeFileSync(outPath, fullFile);
    console.log(`Generated ${outPath}`);
}

const files = fs.readdirSync(WEB_DIR);
files.forEach(file => {
    if (file.endsWith('.jsx')) {
        processFile(path.join(WEB_DIR, file));
    }
});
