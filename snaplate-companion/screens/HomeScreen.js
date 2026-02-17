import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SNAPLATE_URL = 'https://app-31ra8gqa.episolo.app';

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const orb1Anim = useRef(new Animated.Value(0)).current;
  const orb2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse the scan button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Float orbs
    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Anim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(orb1Anim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb2Anim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(orb2Anim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const orb1Translate = orb1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const orb2Translate = orb2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  return (
    <View style={styles.container}>
      {/* Background gradient orbs */}
      <Animated.View
        style={[
          styles.orb,
          styles.orb1,
          { transform: [{ translateY: orb1Translate }] },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.orb2,
          { transform: [{ translateY: orb2Translate }] },
        ]}
      />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo / Icon area */}
          <View style={styles.logoContainer}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <Text style={styles.logoEmoji}>📷</Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>COMPANION</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Snaplate</Text>
          <Text style={styles.subtitle}>Mobile Companion</Text>

          <Text style={styles.description}>
            Scan the QR code from your Snaplate dashboard to link this app and
            access all your content on the go.
          </Text>

          {/* Main CTA */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => navigation.navigate('Scan')}
              activeOpacity={0.85}
            >
              <Text style={styles.scanIcon}>⬡</Text>
              <Text style={styles.scanButtonText}>Scan QR Code</Text>
              <Text style={styles.scanArrow}>→</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Open web directly */}
          <TouchableOpacity
            style={styles.webButton}
            onPress={() => navigation.navigate('Dashboard', { url: SNAPLATE_URL })}
            activeOpacity={0.75}
          >
            <Text style={styles.webButtonIcon}>🌐</Text>
            <Text style={styles.webButtonText}>Open Snaplate Dashboard</Text>
          </TouchableOpacity>

          {/* How it works */}
          <View style={styles.stepsContainer}>
            <Text style={styles.stepsTitle}>How to connect</Text>
            <View style={styles.step}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
              <Text style={styles.stepText}>Open <Text style={styles.stepBold}>app-31ra8gqa.episolo.app</Text> on your computer</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
              <Text style={styles.stepText}>Go to your <Text style={styles.stepBold}>Dashboard</Text> and find the QR code</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
              <Text style={styles.stepText}>Tap <Text style={styles.stepBold}>Scan QR Code</Text> above and point at it</Text>
            </View>
          </View>
        </Animated.View>
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
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.35,
  },
  orb1: {
    width: 280,
    height: 280,
    backgroundColor: '#6C3CE1',
    top: -80,
    right: -80,
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: '#3C8CE1',
    bottom: 100,
    left: -60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  logoOuter: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: 'rgba(108, 60, 225, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(108, 60, 225, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#6C3CE1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 34,
  },
  badge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#3C8CE1',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 22,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B8BA7',
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: '#A0A0C0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C3CE1',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 18,
    gap: 12,
    shadowColor: '#6C3CE1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    minWidth: width - 56,
    justifyContent: 'center',
  },
  scanIcon: {
    fontSize: 22,
    color: '#fff',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  scanArrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    color: '#5A5A7A',
    marginHorizontal: 12,
    fontSize: 13,
  },
  webButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    width: '100%',
    justifyContent: 'center',
  },
  webButtonIcon: {
    fontSize: 18,
  },
  webButtonText: {
    color: '#C0C0E0',
    fontSize: 15,
    fontWeight: '500',
  },
  stepsContainer: {
    marginTop: 28,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  stepsTitle: {
    color: '#8080A0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(108, 60, 225, 0.3)',
    borderWidth: 1,
    borderColor: '#6C3CE1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    color: '#B090FF',
    fontSize: 11,
    fontWeight: '700',
  },
  stepText: {
    color: '#9090B0',
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  stepBold: {
    color: '#C0C0E0',
    fontWeight: '600',
  },
});
