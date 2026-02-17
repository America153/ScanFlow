# 📱 Snaplate Companion App

A mobile companion for [app-31ra8gqa.episolo.app](https://app-31ra8gqa.episolo.app) — built for **Expo Go**.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Prerequisites

Make sure you have these installed on your computer:

**Node.js** (v18 or newer):
- Download from: https://nodejs.org

**Expo CLI:**
```bash
npm install -g expo-cli
```

---

### Step 2: Create the Project

Open your terminal and run:

```bash
# Create a new Expo project
npx create-expo-app snaplate-companion --template blank

# Go into the project folder
cd snaplate-companion
```

---

### Step 3: Install Dependencies

```bash
npx expo install expo-camera expo-barcode-scanner expo-linking expo-haptics expo-clipboard react-native-webview @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens
```

---

### Step 4: Copy the Files

Replace the contents of your project with the files in this folder:

| File | Destination |
|------|------------|
| `App.js` | Root of project |
| `app.json` | Root of project (replace existing) |
| `screens/HomeScreen.js` | Create `screens/` folder, put inside |
| `screens/ScanScreen.js` | Inside `screens/` folder |
| `screens/DashboardScreen.js` | Inside `screens/` folder |
| `screens/WebViewScreen.js` | Inside `screens/` folder |

---

### Step 5: Start the App

```bash
npx expo start
```

This will show a **QR code in your terminal**.

---

### Step 6: Open in Expo Go

1. **Install Expo Go** on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the terminal QR code:**
   - **iOS**: Open the Camera app and point at the QR code
   - **Android**: Open Expo Go and tap "Scan QR Code"

---

## 📖 How to Use the App

### Linking with your Snaplate Dashboard

1. Open **[app-31ra8gqa.episolo.app](https://app-31ra8gqa.episolo.app)** on your computer
2. Log in and go to your **Dashboard**
3. Find the **QR Code** on the dashboard page
4. In the Snaplate Companion app, tap **"Scan QR Code"**
5. Point your phone at the dashboard QR code
6. The app will link and open your dashboard! 🎉

### What the App Does

| Screen | Purpose |
|--------|---------|
| 🏠 Home | Landing screen with scan button and instructions |
| 📷 Scan | QR code scanner with animated UI |
| 📊 Dashboard | Shows linked account with quick actions |
| 🌐 WebView | Full in-app browser for Snaplate |

### Features
- 📷 **QR Scanner** – Animated scanner with corner markers and scan line
- 🔗 **Deep Link** – Automatically opens the scanned URL in the in-app browser
- 🌐 **In-App Browser** – Full browsing with back/forward/refresh controls
- 📤 **Share** – Share your Snaplate link
- 📋 **Copy URL** – Copy the linked URL
- 🔦 **Flashlight** – Toggle flash while scanning in dark rooms

---

## 🛠️ Troubleshooting

**"Cannot find module" errors:**
```bash
npx expo install
```

**Camera not working on iOS simulator:**
- Use a real device — simulators don't have cameras

**QR scan not detecting:**
- Make sure the QR code fills the scanning frame
- Toggle the flash on if it's dark

**WebView blank:**
- Check your internet connection
- The site may require login — use the in-app browser to sign in

---

## 📦 Dependencies

```json
{
  "expo": "~51.0.0",
  "expo-camera": "~15.0.16",
  "expo-barcode-scanner": "~13.0.1",
  "expo-clipboard": "~6.0.3",
  "react-native-webview": "13.8.6",
  "@react-navigation/native": "^6.1.17",
  "@react-navigation/native-stack": "^6.9.26",
  "react-native-safe-area-context": "4.10.5",
  "react-native-screens": "3.31.1"
}
```

---

## 🔗 Links

- Snaplate App: https://app-31ra8gqa.episolo.app
- Expo Go Docs: https://docs.expo.dev/get-started/expo-go/
- Expo Camera Docs: https://docs.expo.dev/versions/latest/sdk/camera/
