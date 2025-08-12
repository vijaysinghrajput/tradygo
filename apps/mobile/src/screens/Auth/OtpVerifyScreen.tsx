import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { validateOTP } from '@/utils/validation';
import { OtpVerifyScreenProps } from '@/navigation/types';

const OtpVerifyScreen: React.FC<OtpVerifyScreenProps> = ({ navigation, route }) => {
  const { phone } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    // Validate OTP
    const validation = validateOTP(otpString);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid OTP');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual OTP verification logic
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to main app or handle successful verification
      // This would typically involve updating auth state
      Alert.alert('Success', 'OTP verified successfully!');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setCanResend(false);
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    setError('');

    try {
      // TODO: Implement actual resend OTP logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'OTP sent successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {phone}
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : null,
                error ? styles.otpInputError : null,
              ]}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              editable={!isLoading}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[
            styles.verifyButton,
            (!isOtpComplete || isLoading) && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerifyOtp}
          disabled={!isOtpComplete || isLoading}
        >
          <Text style={styles.verifyButtonText}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOtp}
              disabled={isLoading}
            >
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend OTP in {timer}s
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>Change Phone Number</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: spacing.sm,
    backgroundColor: colors.background.primary,
    ...typography.heading.h3,
    color: colors.text.primary,
  },
  otpInputFilled: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  otpInputError: {
    borderColor: colors.error[500],
  },
  errorText: {
    ...typography.body.small,
    color: colors.error[500],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  verifyButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  verifyButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  verifyButtonText: {
    ...typography.button,
    color: colors.white,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resendButton: {
    paddingVertical: spacing.sm,
  },
  resendText: {
    ...typography.body.medium,
    color: colors.primary[500],
    fontWeight: '500',
  },
  timerText: {
    ...typography.body.medium,
    color: colors.text.secondary,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  backButtonText: {
    ...typography.body.medium,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});

export default OtpVerifyScreen;