import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');

const SNAPLATE_URL = 'https://app-31ra8gqa.episolo.app';

const QUICK_ACTIONS = [
  { id: 'open', icon: '🌐', label: 'Open in Browser', color: '#6C3CE1', action: 'webview' },
  { id: 'share', icon: '📤', label: 'Share Link', color: '#3C8CE1', action: 'share' },
  { id: 'copy', icon: '📋', label: 'Copy URL', color: '#2CB67D', action: 'copy' },
  { id: 'scan', icon: '🔗', label: 'Re-Scan QR', color: '#E1603C', action: 'scan' },
];

const FEATURES = [
  { icon: '📸', title: 'Snap & Translate', desc: 'Take a photo of any text, object, or animal and get instant translations.' },
  { icon: '📄', title: 'PDF Translation', desc: 'Upload PDF documents and translate them instantly into 50+ languages.' },
  { icon: '🌿', title: 'Plant Recognition', desc: 'Identify any plant, flower, or tree and learn detailed facts.' },
  { icon: '🐾', title: 'Animal ID', desc: 'Photograph any animal to learn its species and translate its name.' },
  { icon: '🔤', title: 'Text Scanner', desc: 'Scan any text without typing — menus, signs, books, anywhere.' },
  { icon: '🔊', title: 'Pronunciation', desc: 'Listen to how words are pronounced in 54 different languages.' },
];

export default function DashboardScreen({ navigation, route }) {
  const linkedUrl = route?.params?.url || SNAPLATE_URL;
  const isCustomLink = linkedUrl !== SNAPLATE_URL;

  const [copied, setCopied] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const connectedPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse the connected badge
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(connectedPulse, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(connectedPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, []);

  const handleAction = async (action) => {
    switch (action) {
      case 'webview':
        navigation.navigate('WebView', { url: linkedUrl, title: 'Snaplate' });
        break;
      case 'share':
        await Share.share({ message: `Check out Snaplate: ${linkedUrl}`, url: linkedUrl });
        break;
      case 'copy':
        await Clipboard.setStringAsync(linkedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      case 'scan':
        navigation.navigate('Scan');
        break;
    }
  };

  const displayUrl = linkedUrl.replace('https://', '').replace('http://', '');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => navigation.navigate('WebView', { url: linkedUrl, title: 'Snaplate' })}
          >
            <Text style={styles.moreBtnText}>Open →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Connection status card */}
            <View style={styles.connCard}>
              <View style={styles.connLeft}>
                <View style={styles.connIconWrap}>
                  <Text style={styles.connIcon}>📷</Text>
                </View>
                <View>
                  <View style={styles.connTitleRow}>
                    <Text style={styles.connTitle}>Snaplate</Text>
                    <View style={styles.connBadge}>
                      <Animated.View
                        style={[
                          styles.connDot,
                          { transform: [{ scale: connectedPulse }] },
                        ]}
                      />
                      <Text style={styles.connBadgeText}>LINKED</Text>
                    </View>
                  </View>
                  <Text style={styles.connUrl} numberOfLines={1}>
                    {displayUrl}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick actions */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.actionCard, { borderColor: action.color + '30' }]}
                  onPress={() => handleAction(action.action)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIconWrap, { backgroundColor: action.color + '20' }]}>
                    <Text style={styles.actionIcon}>{action.icon}</Text>
                  </View>
                  <Text style={styles.actionLabel}>
                    {action.id === 'copy' && copied ? '✓ Copied!' : action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Open dashboard button */}
            <TouchableOpacity
              style={styles.openDashboard}
              onPress={() => navigation.navigate('WebView', { url: linkedUrl, title: 'Snaplate Dashboard' })}
              activeOpacity={0.85}
            >
              <Text style={styles.openDashboardText}>🚀 Open Full Dashboard</Text>
            </TouchableOpacity>

            {/* Features section */}
            <Text style={styles.sectionTitle}>Snaplate Features</Text>
            <View style={styles.featuresContainer}>
              {FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDesc}>{feature.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Footer note */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Tap "Open Full Dashboard" to access all features in the in-app browser, or use the quick actions above to interact with your linked Snaplate account.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  moreBtn: {
    backgroundColor: 'rgba(108,60,225,0.2)',
    borderWidth: 1,
    borderColor: '#6C3CE1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  moreBtnText: {
    color: '#B090FF',
    fontSize: 13,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  connCard: {
    backgroundColor: 'rgba(108, 60, 225, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(108, 60, 225, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  connLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  connIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6C3CE1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connIcon: {
    fontSize: 26,
  },
  connTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  connTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  connBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(44, 182, 125, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(44, 182, 125, 0.4)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
    gap: 4,
  },
  connDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#2CB67D',
  },
  connBadgeText: {
    color: '#2CB67D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  connUrl: {
    color: '#8080A0',
    fontSize: 12,
    maxWidth: width - 140,
  },
  sectionTitle: {
    color: '#6060A0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    width: (width - 52) / 2,
    gap: 10,
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    color: '#C0C0E0',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  openDashboard: {
    backgroundColor: '#6C3CE1',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#6C3CE1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  openDashboardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  featuresContainer: {
    gap: 10,
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  featureIcon: {
    fontSize: 26,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
  featureDesc: {
    color: '#7070A0',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  footerText: {
    color: '#5A5A7A',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
