# Expiration Tracker - Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Expiration Tracker mobile application to both iOS App Store and Google Play Store. The app is built using React Native with Expo, making it compatible with both platforms from a single codebase.

## Prerequisites

Before deploying the application, ensure you have the following:

### Development Environment
- Node.js (version 18 or higher)
- npm or yarn package manager
- Expo CLI installed globally
- Git for version control

### Platform-Specific Requirements

#### For iOS Deployment
- macOS computer (required for iOS builds)
- Xcode (latest version)
- Apple Developer Account ($99/year)
- iOS device for testing (optional but recommended)

#### For Android Deployment
- Android Studio
- Google Play Console Account ($25 one-time fee)
- Android device for testing (optional but recommended)

## Project Structure

The Expiration Tracker app follows a well-organized structure:

```
ExpirationTracker/
├── App.js                 # Main application entry point
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── components/           # React Native components
│   ├── ItemList.js
│   ├── AddItemForm.js
│   ├── ItemDetail.js
│   ├── SearchAndFilter.js
│   └── Settings.js
├── context/              # React Context providers
│   ├── ItemContext.js
│   └── ThemeContext.js
├── database/             # Database configuration
│   └── RealmDatabase.js
├── models/               # Data models
│   └── Item.js
├── services/             # External services
│   └── NotificationService.js
└── assets/               # Images and icons
```

## Key Features Implemented

### Core Functionality
- ✅ Add, edit, and remove personal items
- ✅ Track expiration/replacement dates
- ✅ Calculate remaining days until expiration
- ✅ Local data storage using Realm database
- ✅ Cross-platform compatibility (iOS & Android)

### User Interface
- ✅ Clean, minimalist design
- ✅ Dark mode support
- ✅ Responsive layout for different screen sizes
- ✅ Intuitive navigation with tab-based structure
- ✅ Visual indicators for expired and expiring items

### Advanced Features
- ✅ Push notifications for expiration reminders
- ✅ Search functionality
- ✅ Category-based filtering
- ✅ Custom categories support
- ✅ Settings panel with theme toggle

### Data Management
- ✅ Local SQLite database via Realm
- ✅ No user authentication required
- ✅ Offline functionality
- ✅ Data persistence across app restarts

## Installation and Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ExpirationTracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

This will start the Expo development server and display a QR code for testing on physical devices.

## Testing the Application

### Local Testing
1. **Expo Go App**: Install Expo Go on your mobile device and scan the QR code
2. **iOS Simulator**: Press 'i' in the terminal to open iOS simulator (macOS only)
3. **Android Emulator**: Press 'a' in the terminal to open Android emulator
4. **Web Browser**: Press 'w' in the terminal to open web version

### Feature Testing Checklist
- [ ] Add new items with all fields
- [ ] View item details and remaining days
- [ ] Mark items as replaced
- [ ] Remove items
- [ ] Search functionality
- [ ] Category filtering
- [ ] Dark mode toggle
- [ ] Notification permissions and scheduling

## Building for Production

### iOS Build Process

#### 1. Configure iOS Settings
Update `app.json` with iOS-specific configuration:
```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.expirationtracker"
    }
  }
}
```

#### 2. Build iOS App
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo account
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios
```

#### 3. Submit to App Store
```bash
eas submit --platform ios
```

### Android Build Process

#### 1. Configure Android Settings
Update `app.json` with Android-specific configuration:
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.expirationtracker",
      "permissions": [
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.WAKE_LOCK",
        "android.permission.VIBRATE"
      ]
    }
  }
}
```

#### 2. Build Android App
```bash
# Build for Android
eas build --platform android
```

#### 3. Submit to Google Play
```bash
eas submit --platform android
```

## Environment Configuration

### Notification Setup
The app uses Expo Notifications for push notifications. Ensure proper configuration:

1. **iOS**: Notifications work automatically with Expo Go
2. **Android**: Requires proper channel configuration (already implemented)
3. **Production**: May require Firebase setup for advanced notification features

### Database Configuration
- **Realm Database**: Automatically configured for local storage
- **No external database required**
- **Data persists locally on device**

## Deployment Checklist

### Pre-Deployment
- [ ] All features tested and working
- [ ] App icons and splash screens configured
- [ ] Bundle identifiers set correctly
- [ ] Permissions configured appropriately
- [ ] Version number updated in app.json

### iOS Deployment
- [ ] Apple Developer Account active
- [ ] App Store Connect app created
- [ ] iOS build completed successfully
- [ ] App submitted for review
- [ ] App Store listing completed

### Android Deployment
- [ ] Google Play Console account active
- [ ] Play Console app created
- [ ] Android build completed successfully
- [ ] App uploaded to Play Console
- [ ] Store listing completed

## Troubleshooting

### Common Issues

#### Build Failures
- Ensure all dependencies are compatible
- Check Expo SDK version compatibility
- Verify platform-specific configurations

#### Notification Issues
- Check device notification permissions
- Verify notification service configuration
- Test on physical devices (notifications may not work in simulators)

#### Database Issues
- Ensure Realm is properly initialized
- Check for schema version conflicts
- Verify data model definitions

### Performance Optimization
- Images are optimized for mobile devices
- Database queries are efficient
- UI components are properly optimized
- Memory usage is minimized

## Support and Maintenance

### Regular Updates
- Monitor for security updates
- Update dependencies regularly
- Test on new OS versions
- Gather user feedback for improvements

### Analytics and Monitoring
Consider implementing:
- Crash reporting (e.g., Sentry)
- Usage analytics (e.g., Expo Analytics)
- Performance monitoring

## Conclusion

The Expiration Tracker app is now ready for deployment to both iOS and Android platforms. The application provides a complete solution for tracking personal item expiration dates with a clean, user-friendly interface and robust functionality.

For any deployment issues or questions, refer to the Expo documentation or contact the development team.

