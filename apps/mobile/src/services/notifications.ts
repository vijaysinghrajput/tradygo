import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import { authStorage } from '@/auth/storage';
import { userApi } from '@/api/endpoints';

class NotificationService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permission
      await this.requestPermission();

      // Get FCM token
      const token = await messaging().getToken();
      if (token) {
        await authStorage.setFCMToken(token);
        await this.registerDevice(token);
      }

      // Listen for token refresh
      messaging().onTokenRefresh(async (newToken) => {
        await authStorage.setFCMToken(newToken);
        await this.registerDevice(newToken);
      });

      // Handle foreground messages
      messaging().onMessage(this.handleForegroundMessage);

      // Handle background messages
      messaging().setBackgroundMessageHandler(this.handleBackgroundMessage);

      // Handle notification opened app
      messaging().onNotificationOpenedApp(this.handleNotificationOpenedApp);

      // Check if app was opened from a notification
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        this.handleNotificationOpenedApp(initialNotification);
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Notification service initialization failed:', error);
    }
  }

  private async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // For Android 13+, request notification permission
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      } else {
        // For iOS
        const authStatus = await messaging().requestPermission({
          alert: true,
          announcement: false,
          badge: true,
          carPlay: false,
          provisional: false,
          sound: true,
        });

        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  private async registerDevice(fcmToken: string) {
    try {
      const deviceId = await authStorage.getDeviceId();
      if (!deviceId) return;

      await userApi.registerDevice({
        deviceId,
        fcmToken,
        platform: Platform.OS as 'ios' | 'android',
      });
    } catch (error) {
      console.error('Device registration failed:', error);
    }
  }

  private handleForegroundMessage = async (message: FirebaseMessagingTypes.RemoteMessage) => {
    try {
      // Display notification using notifee for better control
      await notifee.displayNotification({
        title: message.notification?.title,
        body: message.notification?.body,
        data: message.data,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          smallIcon: 'ic_notification',
          largeIcon: message.notification?.android?.imageUrl,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
          badge: message.notification?.ios?.badge,
          attachments: message.notification?.ios?.imageUrl
            ? [
                {
                  url: message.notification.ios.imageUrl,
                  thumbnailHidden: false,
                },
              ]
            : undefined,
        },
      });
    } catch (error) {
      console.error('Foreground message handling failed:', error);
    }
  };

  private handleBackgroundMessage = async (message: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('Background message received:', message);
    // Handle background message logic here
    // This runs in a background context, so avoid heavy operations
  };

  private handleNotificationOpenedApp = (message: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('Notification opened app:', message);
    
    // Handle deep linking based on notification data
    if (message.data) {
      this.handleDeepLink(message.data);
    }
  };

  private handleDeepLink = (data: { [key: string]: string }) => {
    // Handle different types of deep links
    switch (data.type) {
      case 'order':
        // Navigate to order detail
        console.log('Navigate to order:', data.orderId);
        break;
      case 'product':
        // Navigate to product detail
        console.log('Navigate to product:', data.productId);
        break;
      case 'promotion':
        // Navigate to promotion/offer page
        console.log('Navigate to promotion:', data.promotionId);
        break;
      default:
        // Navigate to home
        console.log('Navigate to home');
        break;
    }
  };

  async createNotificationChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      });

      await notifee.createChannel({
        id: 'orders',
        name: 'Order Updates',
        description: 'Notifications about order status updates',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
      });

      await notifee.createChannel({
        id: 'promotions',
        name: 'Promotions & Offers',
        description: 'Promotional notifications and special offers',
        importance: AndroidImportance.DEFAULT,
        visibility: AndroidVisibility.PUBLIC,
      });
    }
  }

  async scheduleLocalNotification({
    title,
    body,
    data,
    trigger,
  }: {
    title: string;
    body: string;
    data?: { [key: string]: string };
    trigger?: {
      type: 'timestamp';
      timestamp: number;
    };
  }) {
    try {
      await notifee.displayNotification({
        title,
        body,
        data,
        trigger,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('Local notification scheduling failed:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      await notifee.cancelAllNotifications();
    } catch (error) {
      console.error('Cancel notifications failed:', error);
    }
  }

  async getBadgeCount(): Promise<number> {
    try {
      if (Platform.OS === 'ios') {
        return await notifee.getBadgeCount();
      }
      return 0;
    } catch (error) {
      console.error('Get badge count failed:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number) {
    try {
      if (Platform.OS === 'ios') {
        await notifee.setBadgeCount(count);
      }
    } catch (error) {
      console.error('Set badge count failed:', error);
    }
  }
}

export const notificationService = new NotificationService();