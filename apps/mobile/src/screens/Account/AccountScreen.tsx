import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { AccountScreenProps } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  showArrow?: boolean;
}

type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const AccountScreen: React.FC<AccountScreenProps> = () => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual logout logic
            setUser(null);
            // Navigate to auth screen
          },
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'orders',
      title: 'My Orders',
      icon: '📦',
      onPress: () => navigation.navigate('OrdersList'),
      showArrow: true,
    },
    {
      id: 'addresses',
      title: 'My Addresses',
      icon: '📍',
      onPress: () => navigation.navigate('AddressList'),
      showArrow: true,
    },
    {
      id: 'profile',
      title: 'Edit Profile',
      icon: '👤',
      onPress: () => navigation.navigate('Profile'),
      showArrow: true,
    },
    {
      id: 'wishlist',
      title: 'Wishlist',
      icon: '❤️',
      onPress: () => {
        // TODO: Navigate to wishlist
        Alert.alert('Coming Soon', 'Wishlist feature will be available soon!');
      },
      showArrow: true,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: '🔔',
      onPress: () => {
        // TODO: Navigate to notifications
        Alert.alert('Coming Soon', 'Notifications settings will be available soon!');
      },
      showArrow: true,
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: '❓',
      onPress: () => {
        Alert.alert('Support', 'Contact us at support@tradygo.com');
      },
      showArrow: true,
    },
    {
      id: 'about',
      title: 'About TradyGo',
      icon: 'ℹ️',
      onPress: () => {
        Alert.alert('About', 'TradyGo v1.0.0\nYour trusted shopping companion');
      },
      showArrow: true,
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: '🚪',
      onPress: handleLogout,
      showArrow: false,
    },
  ];

  const renderUserProfile = () => {
    if (!user) {
      return (
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Welcome to TradyGo</Text>
          <Text style={styles.loginSubtitle}>
            Please login to access your account
          </Text>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login / Sign Up</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            // TODO: Add Image component when avatar is available
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userPhone}>{user.phone}</Text>
        </View>
      </View>
    );
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.menuItem,
        item.id === 'logout' && styles.logoutMenuItem,
      ]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <Text style={styles.menuIcon}>{item.icon}</Text>
        <Text
          style={[
            styles.menuTitle,
            item.id === 'logout' && styles.logoutMenuTitle,
          ]}
        >
          {item.title}
        </Text>
      </View>
      
      {item.showArrow && (
        <Text style={styles.menuArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
        </View>

        {renderUserProfile()}

        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            TradyGo v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Made with ❤️ in India
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  headerTitle: {
    ...typography.heading.h1,
    color: colors.text.primary,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.heading.h2,
    color: colors.primary[500],
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.heading.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body.medium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  userPhone: {
    ...typography.body.medium,
    color: colors.text.secondary,
  },
  loginContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  loginTitle: {
    ...typography.heading.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  loginSubtitle: {
    ...typography.body.large,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  loginButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
  },
  loginButtonText: {
    ...typography.button,
    color: colors.white,
  },
  menuContainer: {
    paddingTop: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  logoutMenuItem: {
    borderBottomWidth: 0,
    marginTop: spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 24,
    textAlign: 'center',
  },
  menuTitle: {
    ...typography.body.large,
    color: colors.text.primary,
    flex: 1,
  },
  logoutMenuTitle: {
    color: colors.error[500],
  },
  menuArrow: {
    ...typography.heading.h2,
    color: colors.text.tertiary,
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  footerText: {
    ...typography.body.small,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  footerSubtext: {
    ...typography.body.small,
    color: colors.text.tertiary,
  },
});

export default AccountScreen;