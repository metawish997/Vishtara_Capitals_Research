# Vishtara Capitals Research App - Troubleshooting & Fixes Log

This document serves as a record of the issues we encountered and the solutions we applied to stabilize the production release of the app.

## 1. Infinite Splash Screen Freeze on Production (AAB)
- **The Issue:** The `.aab` builds downloaded from the Google Play Store were permanently freezing on the native splash screen. Local `.apk` builds were working perfectly fine.
- **Investigation:** We injected a custom `ErrorBoundary` and an on-screen debug logger into `app/_layout.tsx`. By testing this on the `.apk`, we verified that the routing logic was executing perfectly, proving the issue was a hidden fatal native crash specific to the AAB build environment.
- **The Root Cause:** We discovered that the `babel.config.js` file had been accidentally deleted from the project directory. This file is strictly required by `react-native-reanimated`. Without the Reanimated Babel plugin, the animation engine threw a fatal JavaScript exception the millisecond the app launched, crashing the app underneath the native splash screen. (The local APK worked because it was built *before* the file was deleted).
- **The Fix:** We completely restored `babel.config.js` and added the `react-native-reanimated/plugin` back to the configuration. 

## 2. Bundler Crashing during EAS Build
- **The Issue:** The `eas build` command failed during the "Bundle JavaScript" phase with a SyntaxError pointing to `process.env.EXPO_ROUTER_APP_ROOT`.
- **The Root Cause:** When restoring the `babel.config.js` file, the `babel-plugin-inline-dotenv` plugin was included because it was listed in `package.json`. This plugin is highly incompatible with Expo Router, as it aggressively overwrites internal environment variables that the router needs to bundle the app.
- **The Fix:** We completely removed `inline-dotenv` from the `babel.config.js` plugin array.

## 3. Unmatched Route Errors
- **The Issue:** Occasional startup instability related to `expo-router` not properly resolving the root path when a user was logged out or logged in.
- **The Fix:** We updated the `isAtRoot` logic inside `app/_layout.tsx` to handle array empty states (`segments.length === 0`) more robustly, ensuring `router.replace` always fires correctly to either `/(tabs)` or `/pages/auth/welcome`. 

## 4. Google Play Console Permissions
- **The Issue:** Unable to find the App Signing SHA-1 key in the Play Console because the "Setup" menu was completely missing.
- **The Root Cause:** The current logged-in email address lacked "Account Owner" or "Admin" permissions for the app.
- **The Fix/Workaround:** Verified via the Google Cloud Console that the Firebase Android API Key had "Application restrictions" set to **None**. Because it was unrestricted, Firebase was not actually enforcing a SHA-1 check, meaning the Play Console SHA-1 key was not strictly necessary to get the app connected to the backend.

## Final Environment Status
- **Current Version:** `1.0.4`
- **Version Code:** `5`
- **Build Command Used:** `eas build --platform android --profile production`
