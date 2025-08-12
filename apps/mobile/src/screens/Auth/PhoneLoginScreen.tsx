import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { validatePhone } from '@/utils/validation';
import { PhoneLoginScreenProps } from '@/navigation/types';

const PhoneLoginScreen: React.FC<PhoneLoginScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    // Clear previous error
    setError('');

    // Validate phone number
    const validation = validatePhone(phoneNumber);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid phone number');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual OTP sending logic
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to OTP verification screen
      navigation.navigate('OtpVerify', { phone: phoneNumber });
    } catch (err) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToEmailLogin = () => {
    navigation.navigate('EmailLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to TradyGo</Text>
            <Text style={styles.subtitle}>
              Enter your phone number to get started
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={[styles.input, error ? styles.inputError : null]}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.text.tertiary}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                  autoFocus
                  editable={!isLoading}
                />
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                (!phoneNumber || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendOTP}
              disabled={!phoneNumber || isLoading}
            >
              <Text style={styles.sendButtonText}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.orText}>Or</Text>
            <TouchableOpacity
              style={styles.emailLoginButton}
              onPress={navigateToEmailLogin}
              disabled={isLoading}
            >
              <Text style={styles.emailLoginText}>Login with Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body.large,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: spacing.sm,
    backgroundColor: colors.background.primary,
  },
  countryCode: {
    ...typography.body.medium,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border.primary,
  },
  input: {
    ...typography.body.medium,
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.error[500],
  },
  errorText: {
    ...typography.body.small,
    color: colors.error[500],
    marginTop: spacing.xs,
  },
  sendButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  sendButtonText: {
    ...typography.button,
    color: colors.white,
  },
  footer: {
    alignItems: 'center',
  },
  orText: {
    ...typography.body.medium,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  emailLoginButton: {
    paddingVertical: spacing.sm,
  },
  emailLoginText: {
    ...typography.body.medium,
    color: colors.primary[500],
    fontWeight: '500',
  },
});

export default PhoneLoginScreen;