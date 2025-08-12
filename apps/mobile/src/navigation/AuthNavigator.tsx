import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Import auth screens
import PhoneLoginScreen from '@/screens/Auth/PhoneLoginScreen';
import OtpVerifyScreen from '@/screens/Auth/OtpVerifyScreen';
import EmailLoginScreen from '@/screens/Auth/EmailLoginScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
      initialRouteName="PhoneLogin"
    >
      <Stack.Screen
        name="PhoneLogin"
        component={PhoneLoginScreen}
        options={{
          title: 'Login with Phone',
        }}
      />
      <Stack.Screen
        name="OtpVerify"
        component={OtpVerifyScreen}
        options={{
          title: 'Verify OTP',
          gestureEnabled: false, // Prevent going back during OTP verification
        }}
      />
      <Stack.Screen
        name="EmailLogin"
        component={EmailLoginScreen}
        options={{
          title: 'Login with Email',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;