import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WebViewScreen({ navigation, route }) {
  const { url = 'https://app-31ra8gqa.episolo.app', title = 'Snaplate' } = route?.params || {};

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [error, setError] = useState(null);

  const webViewRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleProgress = ({ nativeEvent }) => {
    const { progress: p } = nativeEvent;
    setProgress(p);
    Animated.timing(progressAnim, {
      toValue: p,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handleNavigationStateChange = (state) => {
    setCurrentUrl(state.url);
    setCanGoBack(state.canGoBack);
    setCanGoForward(state.canGoForward);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const displayUrl = currentUrl
    .replace('https://', '')
    .replace('http://', '')
    .split('/')[0];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.topBtnText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.urlBar}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.urlText} numberOfLines={1}>
              {displayUrl}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.topBtn}
            onPress={() => webViewRef.current?.reload()}
          >
            <Text style={styles.topBtnText}>↺</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        {loading && (
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                { width: progressWidth },
              ]}
            />
          </View>
        )}
      </SafeAreaView>

      {/* WebView */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Failed to load</Text>
          <Text style={styles.errorMsg}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setError(null);
              webViewRef.current?.reload();
            }}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webView}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onLoadProgress={handleProgress}
          onNavigationStateChange={handleNavigationStateChange}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            setError(nativeEvent.description || 'An error occurred');
            setLoading(false);
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          userAgent="SnaplateCompanion/1.0 Mobile"
          allowsBackForwardNavigationGestures={true}
          pullToRefreshEnabled={true}
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#6C3CE1" />
              <Text style={styles.loadingText}>Loading Snaplate...</Text>
            </View>
          )}
          startInLoadingState={true}
        />
      )}

      {/* Bottom navigation bar */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.navBtn, !canGoBack && styles.navBtnDisabled]}
          onPress={() => canGoBack && webViewRef.current?.goBack()}
          disabled={!canGoBack}
        >
          <Text style={[styles.navBtnText, !canGoBack && styles.navBtnTextDisabled]}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, !canGoForward && styles.navBtnDisabled]}
          onPress={() => canGoForward && webViewRef.current?.goForward()}
          disabled={!canGoForward}
        >
          <Text style={[styles.navBtnText, !canGoForward && styles.navBtnTextDisabled]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => webViewRef.current?.reload()}
        >
          <Text style={styles.navBtnText}>↺</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() =>
            webViewRef.current?.injectJavaScript(
              `window.scrollTo({top: 0, behavior: 'smooth'}); true;`
            )
          }
        >
          <Text style={styles.navBtnText}>↑</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, styles.homeBtn]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.navBtnText}>⌂</Text>
        </TouchableOpacity>
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
    backgroundColor: '#1A1A2E',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: '#1A1A2E',
  },
  topBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  urlBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  lockIcon: {
    fontSize: 13,
  },
  urlText: {
    color: '#C0C0E0',
    fontSize: 13,
    flex: 1,
  },
  progressContainer: {
    height: 2,
    backgroundColor: 'rgba(108, 60, 225, 0.15)',
  },
  progressBar: {
    height: 2,
    backgroundColor: '#6C3CE1',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D0D1A',
  },
  loadingText: {
    color: '#8080A0',
    fontSize: 14,
    marginTop: 14,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#0D0D1A',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  errorMsg: {
    color: '#8080A0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryBtn: {
    backgroundColor: '#6C3CE1',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomBar: {
    backgroundColor: '#1A1A2E',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: 'space-around',
  },
  navBtn: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '300',
  },
  navBtnTextDisabled: {
    color: '#5A5A7A',
  },
  homeBtn: {
    backgroundColor: 'rgba(108, 60, 225, 0.2)',
  },
});
