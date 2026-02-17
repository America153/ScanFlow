import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
  Dimensions,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const FRAME_SIZE = width * 0.72;

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const cornerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate the scan line
    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    scanLoop.start();

    // Pulse corners
    const cornerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(cornerAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(cornerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    cornerLoop.start();

    return () => {
      scanLoop.stop();
      cornerLoop.stop();
    };
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned) return;

    // Check if this is a Snaplate-related URL
    const isValidURL =
      data.includes('episolo.app') ||
      data.includes('snaplate') ||
      data.startsWith('http://') ||
      data.startsWith('https://');

    if (!isValidURL) {
      // Show non-URL result
      setScanResult({ data, valid: false });
      setScanned(true);
      return;
    }

    setScanned(true);
    setScanResult({ data, valid: true });

    // Vibrate on success
    Vibration.vibrate(Platform.OS === 'android' ? [0, 50, 100, 50] : 100);

    // Success animation
    Animated.spring(successAnim, {
      toValue: 1,
      tension: 80,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // Navigate after short delay
    setTimeout(() => {
      navigation.navigate('Dashboard', { url: data });
    }, 800);
  };

  const scanLineTranslate = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_SIZE - 4],
  });

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permText}>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.permContainer}>
            <Text style={styles.permIcon}>📷</Text>
            <Text style={styles.permTitle}>Camera Access Needed</Text>
            <Text style={styles.permDesc}>
              To scan QR codes from the Snaplate dashboard, we need camera access.
            </Text>
            <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
              <Text style={styles.permButtonText}>Grant Access</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.permBack}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.permBackText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={flashOn}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      {/* Dark overlay with hole */}
      <View style={styles.overlay}>
        {/* Top */}
        <View style={styles.overlayTop} />

        {/* Middle row */}
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />

          {/* The scan frame */}
          <Animated.View
            style={[
              styles.frame,
              scanned && scanResult?.valid
                ? styles.frameSuccess
                : styles.frameNormal,
            ]}
          >
            {/* Corner markers */}
            <Animated.View
              style={[styles.corner, styles.cornerTL, { opacity: cornerAnim }]}
            />
            <Animated.View
              style={[styles.corner, styles.cornerTR, { opacity: cornerAnim }]}
            />
            <Animated.View
              style={[styles.corner, styles.cornerBL, { opacity: cornerAnim }]}
            />
            <Animated.View
              style={[styles.corner, styles.cornerBR, { opacity: cornerAnim }]}
            />

            {/* Scan line */}
            {!scanned && (
              <Animated.View
                style={[
                  styles.scanLine,
                  { transform: [{ translateY: scanLineTranslate }] },
                ]}
              />
            )}

            {/* Success state */}
            {scanned && scanResult?.valid && (
              <Animated.View
                style={[
                  styles.successOverlay,
                  {
                    opacity: successAnim,
                    transform: [{ scale: successAnim }],
                  },
                ]}
              >
                <Text style={styles.successCheck}>✓</Text>
                <Text style={styles.successText}>Linked!</Text>
              </Animated.View>
            )}
          </Animated.View>

          <View style={styles.overlaySide} />
        </View>

        {/* Bottom */}
        <View style={styles.overlayBottom}>
          <Text style={styles.hint}>
            {scanned && scanResult?.valid
              ? '🚀 Opening Snaplate...'
              : scanned && !scanResult?.valid
              ? '⚠️ Not a Snaplate QR code'
              : 'Point at the QR code on your dashboard'}
          </Text>

          {scanned && !scanResult?.valid && (
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>Scanned data:</Text>
              <Text style={styles.errorData} numberOfLines={2}>
                {scanResult?.data}
              </Text>
              <Text style={styles.errorNote}>
                This doesn't appear to be from app-31ra8gqa.episolo.app
              </Text>
            </View>
          )}

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setFlashOn(!flashOn)}
            >
              <Text style={styles.controlBtnText}>
                {flashOn ? '🔦 Flash Off' : '🔦 Flash On'}
              </Text>
            </TouchableOpacity>

            {scanned && (
              <TouchableOpacity
                style={[styles.controlBtn, styles.rescanBtn]}
                onPress={() => {
                  setScanned(false);
                  setScanResult(null);
                  successAnim.setValue(0);
                }}
              >
                <Text style={styles.rescanBtnText}>↺ Rescan</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Top safe bar */}
      <SafeAreaView style={styles.topBar} edges={['top']}>
        <View style={styles.topBarContent}>
          <TouchableOpacity
            style={styles.topBackBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.topBackText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>Scan QR Code</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: FRAME_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    overflow: 'hidden',
  },
  frameNormal: {
    borderWidth: 0,
  },
  frameSuccess: {
    backgroundColor: 'rgba(0, 220, 120, 0.1)',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#6C3CE1',
    borderWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  scanLine: {
    height: 2,
    backgroundColor: '#6C3CE1',
    shadowColor: '#6C3CE1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 220, 120, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCheck: {
    fontSize: 60,
    color: '#00DC78',
  },
  successText: {
    color: '#00DC78',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  hint: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
  errorCard: {
    backgroundColor: 'rgba(255, 80, 80, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 80, 80, 0.3)',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 16,
  },
  errorTitle: {
    color: '#FF8080',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  errorData: {
    color: '#FFFFFF',
    fontSize: 13,
    marginBottom: 6,
  },
  errorNote: {
    color: '#FF8080',
    fontSize: 12,
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  controlBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  controlBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  rescanBtn: {
    backgroundColor: 'rgba(108, 60, 225, 0.4)',
    borderColor: '#6C3CE1',
  },
  rescanBtnText: {
    color: '#B090FF',
    fontSize: 14,
    fontWeight: '600',
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backBtnText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  topBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBackText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Permission styles
  permContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#0D0D1A',
  },
  permIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  permTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  permDesc: {
    color: '#8080A0',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  permButton: {
    backgroundColor: '#6C3CE1',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginBottom: 14,
    width: '100%',
    alignItems: 'center',
  },
  permButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  permBack: {
    paddingVertical: 12,
  },
  permBackText: {
    color: '#6060A0',
    fontSize: 15,
  },
  permText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
