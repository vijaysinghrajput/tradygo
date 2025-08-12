import { MMKV } from 'react-native-mmkv';

const mmkvStorage = new MMKV({
  id: 'tradygo-auth',
  encryptionKey: 'tradygo-encryption-key',
});

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  DEVICE_ID: 'device_id',
  FCM_TOKEN: 'fcm_token',
} as const;

export const authStorage = {
  // Token management
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    mmkvStorage.set(KEYS.ACCESS_TOKEN, accessToken);
    mmkvStorage.set(KEYS.REFRESH_TOKEN, refreshToken);
  },

  async getAccessToken(): Promise<string | null> {
    return mmkvStorage.getString(KEYS.ACCESS_TOKEN) || null;
  },

  async getRefreshToken(): Promise<string | null> {
    return mmkvStorage.getString(KEYS.REFRESH_TOKEN) || null;
  },

  async clearTokens(): Promise<void> {
    mmkvStorage.delete(KEYS.ACCESS_TOKEN);
    mmkvStorage.delete(KEYS.REFRESH_TOKEN);
  },

  // User data
  async setUserData(userData: any): Promise<void> {
    mmkvStorage.set(KEYS.USER_DATA, JSON.stringify(userData));
  },

  async getUserData(): Promise<any | null> {
    const data = mmkvStorage.getString(KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  async clearUserData(): Promise<void> {
    mmkvStorage.delete(KEYS.USER_DATA);
  },

  // Device management
  async setDeviceId(deviceId: string): Promise<void> {
    mmkvStorage.set(KEYS.DEVICE_ID, deviceId);
  },

  async getDeviceId(): Promise<string | null> {
    return mmkvStorage.getString(KEYS.DEVICE_ID) || null;
  },

  // FCM token
  async setFCMToken(token: string): Promise<void> {
    mmkvStorage.set(KEYS.FCM_TOKEN, token);
  },

  async getFCMToken(): Promise<string | null> {
    return mmkvStorage.getString(KEYS.FCM_TOKEN) || null;
  },

  // Clear all data
  async clearAll(): Promise<void> {
    mmkvStorage.clearAll();
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return !!accessToken;
  },
};

// Export for backward compatibility
export const storage = authStorage;