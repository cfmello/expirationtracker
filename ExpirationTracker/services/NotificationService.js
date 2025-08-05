import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
  }

  // Initialize notification service
  async initialize() {
    try {
      await this.registerForPushNotificationsAsync();
      console.log('Notification service initialized');
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  // Register for push notifications
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      try {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Expo push token:', token);
      } catch (e) {
        token = `${Device.osName}-${Device.modelName}-${Date.now()}`;
        console.log('Using fallback token:', token);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    this.expoPushToken = token;
    return token;
  }

  // Schedule notification for item expiration
  async scheduleExpirationNotification(item, daysBeforeExpiration = 3) {
    try {
      const expirationDate = new Date(item.startDate);
      expirationDate.setDate(expirationDate.getDate() + item.expirationDays);
      
      const notificationDate = new Date(expirationDate);
      notificationDate.setDate(notificationDate.getDate() - daysBeforeExpiration);
      
      // Only schedule if the notification date is in the future
      if (notificationDate > new Date()) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Item Expiring Soon!',
            body: `${item.name} will expire in ${daysBeforeExpiration} days`,
            data: { itemId: item.id, type: 'expiration_warning' },
          },
          trigger: {
            date: notificationDate,
          },
        });

        console.log(`Scheduled notification for ${item.name} at ${notificationDate}`);
        return notificationId;
      }
      
      return null;
    } catch (error) {
      console.error('Error scheduling expiration notification:', error);
      return null;
    }
  }

  // Schedule notification for expiration day
  async scheduleExpirationDayNotification(item) {
    try {
      const expirationDate = new Date(item.startDate);
      expirationDate.setDate(expirationDate.getDate() + item.expirationDays);
      
      // Only schedule if the expiration date is in the future
      if (expirationDate > new Date()) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Item Expired!',
            body: `${item.name} has expired and should be replaced`,
            data: { itemId: item.id, type: 'expiration_day' },
          },
          trigger: {
            date: expirationDate,
          },
        });

        console.log(`Scheduled expiration day notification for ${item.name} at ${expirationDate}`);
        return notificationId;
      }
      
      return null;
    } catch (error) {
      console.error('Error scheduling expiration day notification:', error);
      return null;
    }
  }

  // Schedule all notifications for an item
  async scheduleItemNotifications(item) {
    const notifications = [];
    
    // Schedule 3-day warning
    const warningNotification = await this.scheduleExpirationNotification(item, 3);
    if (warningNotification) {
      notifications.push({
        id: warningNotification,
        type: 'warning',
        itemId: item.id,
      });
    }

    // Schedule expiration day notification
    const expirationNotification = await this.scheduleExpirationDayNotification(item);
    if (expirationNotification) {
      notifications.push({
        id: expirationNotification,
        type: 'expiration',
        itemId: item.id,
      });
    }

    return notifications;
  }

  // Cancel all notifications for an item
  async cancelItemNotifications(itemId) {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const itemNotifications = scheduledNotifications.filter(
        notification => notification.content.data?.itemId === itemId
      );

      for (const notification of itemNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }

      console.log(`Cancelled ${itemNotifications.length} notifications for item ${itemId}`);
    } catch (error) {
      console.error('Error cancelling item notifications:', error);
    }
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  // Get all scheduled notifications
  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Send immediate notification (for testing)
  async sendImmediateNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending immediate notification:', error);
    }
  }

  // Handle notification response (when user taps notification)
  addNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Handle notification received while app is in foreground
  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }
}

export default new NotificationService();

