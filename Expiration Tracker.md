# Expiration Tracker

A mobile application for iOS and Android that helps users track the expiration or replacement dates of personal-use items. Built with React Native and Expo for cross-platform compatibility.

## Features

### Core Functionality
- **Item Management**: Add, edit, and remove personal items with custom expiration periods
- **Expiration Tracking**: Automatic calculation of remaining days until expiration
- **Visual Indicators**: Color-coded items showing expired and soon-to-expire status
- **Local Storage**: All data stored locally using Realm database (no login required)

### User Interface
- **Clean Design**: Minimalist and intuitive interface
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Layout**: Optimized for both phones and tablets
- **Tab Navigation**: Easy access to items and settings

### Advanced Features
- **Push Notifications**: Automatic reminders 3 days before and on expiration day
- **Search & Filter**: Find items by name or filter by category
- **Custom Categories**: Create and use custom categories (Hygiene, Cleaning, Food, etc.)
- **Replacement Tracking**: Mark items as replaced to reset their expiration cycle

## Screenshots

### Main Interface
- Item list with remaining days display
- Add item form with date picker
- Item detail view with action buttons

### Features
- Search and filter interface
- Settings panel with dark mode toggle
- Category management

## Use Cases

Perfect for tracking:
- **Personal Care**: Toothbrushes (90 days), razors, cosmetics
- **Household Items**: Kitchen sponges (30 days), cleaning supplies
- **Health**: Medications, supplements, first aid supplies
- **Food Items**: Pantry staples, refrigerated items
- **Any Item**: Custom expiration periods for any personal item

## Technical Details

### Architecture
- **Framework**: React Native with Expo
- **Database**: Realm for local data storage
- **State Management**: React Context API with MVVM pattern
- **Notifications**: Expo Notifications with local scheduling
- **Navigation**: React Navigation with stack and tab navigators

### Key Technologies
- React Native 0.76+
- Expo SDK 52+
- Realm Database
- Expo Notifications
- React Navigation
- AsyncStorage for theme persistence

### Platform Support
- **iOS**: iPhone and iPad (iOS 13+)
- **Android**: Phones and tablets (Android 6.0+)
- **Web**: Progressive Web App support

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd ExpirationTracker

# Install dependencies
npm install

# Start development server
npm start
```

### Testing
- **Mobile**: Use Expo Go app to scan QR code
- **iOS Simulator**: Press 'i' in terminal (macOS only)
- **Android Emulator**: Press 'a' in terminal
- **Web Browser**: Press 'w' in terminal

## Project Structure

```
ExpirationTracker/
├── App.js                 # Main application entry point
├── app.json              # Expo configuration
├── components/           # React Native components
│   ├── ItemList.js       # Main item list view
│   ├── AddItemForm.js    # Add/edit item form
│   ├── ItemDetail.js     # Item detail view
│   ├── SearchAndFilter.js # Search and filtering
│   └── Settings.js       # Settings panel
├── context/              # React Context providers
│   ├── ItemContext.js    # Item state management
│   └── ThemeContext.js   # Theme state management
├── database/             # Database layer
│   └── RealmDatabase.js  # Realm database service
├── models/               # Data models
│   └── Item.js           # Item data model
├── services/             # External services
│   └── NotificationService.js # Push notifications
└── assets/               # App icons and images
```

## Development

### Key Components

#### ItemContext
Manages all item-related state and operations:
- CRUD operations for items
- Search and filtering logic
- Integration with database and notifications

#### ThemeContext
Handles theme management:
- Light/dark mode toggle
- Theme persistence
- Dynamic styling

#### NotificationService
Manages push notifications:
- Scheduling expiration reminders
- Handling notification permissions
- Background notification support

### Database Schema
```javascript
Item {
  id: string (primary key)
  name: string
  description: string (optional)
  startDate: date
  expirationDays: int
  category: string (optional)
  isActive: boolean
  createdAt: date
  updatedAt: date
}
```

### Notification Logic
- **3-Day Warning**: Scheduled 3 days before expiration
- **Expiration Day**: Scheduled on the actual expiration date
- **Automatic Cleanup**: Old notifications removed when items are updated/removed
- **Persistence**: Notifications work even when app is closed

## Building for Production

### iOS
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android
```bash
# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

## Configuration

### App Configuration (app.json)
- Bundle identifiers for iOS and Android
- Notification permissions and settings
- App icons and splash screens
- Platform-specific configurations

### Environment Variables
No external API keys required - the app works entirely offline with local storage.

## Contributing

### Development Guidelines
1. Follow React Native best practices
2. Use TypeScript for type safety (if migrating)
3. Maintain consistent code formatting
4. Test on both iOS and Android
5. Ensure accessibility compliance

### Testing
- Unit tests for business logic
- Integration tests for database operations
- UI tests for critical user flows
- Manual testing on physical devices

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or feature requests:
1. Check the deployment guide for common issues
2. Review the troubleshooting section
3. Create an issue in the repository
4. Contact the development team

## Roadmap

### Potential Future Features
- Cloud backup and sync
- Shared family lists
- Barcode scanning for easy item addition
- Advanced notification customization
- Usage analytics and insights
- Integration with shopping lists

### Performance Improvements
- Image optimization
- Database query optimization
- Memory usage optimization
- Startup time improvements

---

**Built with ❤️ using React Native and Expo**

