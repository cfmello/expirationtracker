import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import NotificationService from '../services/NotificationService';

const Settings = ({ navigation }) => {
  const { isDarkMode, theme, toggleTheme } = useTheme();

  const handleTestNotification = async () => {
    try {
      await NotificationService.sendImmediateNotification(
        'Test Notification',
        'This is a test notification from Expiration Tracker!'
      );
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const handleViewScheduledNotifications = async () => {
    try {
      const notifications = await NotificationService.getScheduledNotifications();
      Alert.alert(
        'Scheduled Notifications',
        `You have ${notifications.length} scheduled notifications.`,
        [
          { text: 'OK' },
          {
            text: 'View Details',
            onPress: () => console.log('Scheduled notifications:', notifications)
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to get scheduled notifications');
    }
  };

  const settingsItems = [
    {
      title: 'Appearance',
      items: [
        {
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          type: 'switch',
          value: isDarkMode,
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          title: 'Test Notification',
          subtitle: 'Send a test notification',
          type: 'button',
          onPress: handleTestNotification,
        },
        {
          title: 'Scheduled Notifications',
          subtitle: 'View all scheduled notifications',
          type: 'button',
          onPress: handleViewScheduledNotifications,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          title: 'Version',
          subtitle: '1.0.0',
          type: 'info',
        },
        {
          title: 'Developer',
          subtitle: 'Built with React Native',
          type: 'info',
        },
      ],
    },
  ];

  const renderSettingItem = (item, index) => {
    const isLast = index === settingsItems.length - 1;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.settingItem,
          { 
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
          isLast && styles.lastItem
        ]}
        onPress={item.type === 'button' ? item.onPress : undefined}
        disabled={item.type === 'info' || item.type === 'switch'}
      >
        <View style={styles.settingContent}>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                {item.subtitle}
              </Text>
            )}
          </View>
          
          {item.type === 'switch' && (
            <Switch
              value={item.value}
              onValueChange={item.onPress}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={item.value ? theme.surface : theme.textTertiary}
            />
          )}
          
          {item.type === 'button' && (
            <Text style={[styles.chevron, { color: theme.textTertiary }]}>
              →
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (section, sectionIndex) => (
    <View key={sectionIndex} style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {section.title}
      </Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.surface }]}>
        {section.items.map((item, index) => renderSettingItem(item, index))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {settingsItems.map((section, index) => renderSection(section, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 16,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '300',
  },
});

export default Settings;

