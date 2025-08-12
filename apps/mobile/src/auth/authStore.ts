import { create } from 'zustand';
import { authStorage } from './storage';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'customer' | 'seller' | 'admin';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,

  // Actions
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  login: async (user, accessToken, refreshToken) => {
    try {
      // Store tokens and user data
      await authStorage.setTokens(accessToken, refreshToken);
      await authStorage.setUserData(user);
      
      // Update state
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Clear storage
      await authStorage.clearAll();
      
      // Reset state
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  updateUser: (userData) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...userData };
      set({ user: updatedUser });
      authStorage.setUserData(updatedUser);
    }
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      
      const [accessToken, refreshToken, userData] = await Promise.all([
        authStorage.getAccessToken(),
        authStorage.getRefreshToken(),
        authStorage.getUserData(),
      ]);

      if (accessToken && refreshToken && userData) {
        set({
          user: userData,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear potentially corrupted data
      await authStorage.clearAll();
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Export store instance for use in API client
export const authStore = useAuthStore;