import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const appStorage = new MMKV({ id: 'app-storage' });

const mmkvStorage = {
  getItem: (name: string) => {
    const value = appStorage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    appStorage.set(name, value);
  },
  removeItem: (name: string) => {
    appStorage.delete(name);
  },
};

interface AppState {
  // App settings
  isFirstLaunch: boolean;
  hasSeenOnboarding: boolean;
  selectedLanguage: string;
  selectedCurrency: string;
  
  // Network state
  isOnline: boolean;
  
  // UI state
  isLoading: boolean;
  loadingMessage?: string;
  
  // Location
  selectedPincode?: string;
  selectedCity?: string;
  selectedState?: string;
  
  // Search
  recentSearches: string[];
  
  // Notifications
  notificationsEnabled: boolean;
  fcmToken?: string;
}

interface AppActions {
  // App settings
  setFirstLaunch: (isFirst: boolean) => void;
  setOnboardingComplete: () => void;
  setLanguage: (language: string) => void;
  setCurrency: (currency: string) => void;
  
  // Network state
  setOnlineStatus: (isOnline: boolean) => void;
  
  // UI state
  setLoading: (isLoading: boolean, message?: string) => void;
  
  // Location
  setLocation: (pincode: string, city?: string, state?: string) => void;
  clearLocation: () => void;
  
  // Search
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  
  // Notifications
  setNotificationsEnabled: (enabled: boolean) => void;
  setFcmToken: (token: string) => void;
  
  // Reset
  resetApp: () => void;
}

type AppStore = AppState & AppActions;

const initialState: AppState = {
  isFirstLaunch: true,
  hasSeenOnboarding: false,
  selectedLanguage: 'en',
  selectedCurrency: 'INR',
  isOnline: true,
  isLoading: false,
  recentSearches: [],
  notificationsEnabled: true,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // App settings
      setFirstLaunch: (isFirst: boolean) => {
        set({ isFirstLaunch: isFirst });
      },

      setOnboardingComplete: () => {
        set({ hasSeenOnboarding: true });
      },

      setLanguage: (language: string) => {
        set({ selectedLanguage: language });
      },

      setCurrency: (currency: string) => {
        set({ selectedCurrency: currency });
      },

      // Network state
      setOnlineStatus: (isOnline: boolean) => {
        set({ isOnline });
      },

      // UI state
      setLoading: (isLoading: boolean, loadingMessage?: string) => {
        set({ isLoading, loadingMessage });
      },

      // Location
      setLocation: (pincode: string, city?: string, state?: string) => {
        set({ 
          selectedPincode: pincode,
          selectedCity: city,
          selectedState: state,
        });
      },

      clearLocation: () => {
        set({ 
          selectedPincode: undefined,
          selectedCity: undefined,
          selectedState: undefined,
        });
      },

      // Search
      addRecentSearch: (query: string) => {
        const { recentSearches } = get();
        const trimmedQuery = query.trim();
        
        if (!trimmedQuery || recentSearches.includes(trimmedQuery)) {
          return;
        }
        
        const updatedSearches = [trimmedQuery, ...recentSearches.slice(0, 9)];
        set({ recentSearches: updatedSearches });
      },

      removeRecentSearch: (query: string) => {
        const { recentSearches } = get();
        const updatedSearches = recentSearches.filter(search => search !== query);
        set({ recentSearches: updatedSearches });
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      // Notifications
      setNotificationsEnabled: (enabled: boolean) => {
        set({ notificationsEnabled: enabled });
      },

      setFcmToken: (token: string) => {
        set({ fcmToken: token });
      },

      // Reset
      resetApp: () => {
        set(initialState);
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        isFirstLaunch: state.isFirstLaunch,
        hasSeenOnboarding: state.hasSeenOnboarding,
        selectedLanguage: state.selectedLanguage,
        selectedCurrency: state.selectedCurrency,
        selectedPincode: state.selectedPincode,
        selectedCity: state.selectedCity,
        selectedState: state.selectedState,
        recentSearches: state.recentSearches,
        notificationsEnabled: state.notificationsEnabled,
        fcmToken: state.fcmToken,
      }),
    }
  )
);