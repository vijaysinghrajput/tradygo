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
  ScrollView,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { validateEmail, validatePasswordStrength } from '@/utils/validation';
import { EmailLoginScreenProps } from '@/navigation/types';

const EmailLoginScreen: React.FC<EmailLoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});

    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePasswordStrength(password);

    const newErrors: { email?: string; password?: string } = {};

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual login logic
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to main app or handle successful login
      Alert.alert('Success', 'Login successful!');
    } catch (err) {
      Alert.alert('Error', 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToPhoneLogin = () => {
    navigation.navigate('PhoneLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to your account
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email ? styles.inputError : null]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.text.tertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                  editable={!isLoading}
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      errors.password ? styles.inputError : null,
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.text.tertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    <Text style={styles.passwordToggleText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.forgotPasswordButton}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (!email || !password || isLoading) && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={!email || !password || isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.orText}>Or</Text>
              <TouchableOpacity
                style={styles.phoneLoginButton}
                onPress={navigateToPhoneLogin}
                disabled={isLoading}
              >
                <Text style={styles.phoneLoginText}>Login with Phone</Text>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity disabled={isLoading}>
                  <Text style={styles.signupLinkText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    minHeight: '100%',
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
  input: {
    ...typography.body.medium,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.error[500],
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: spacing.sm,
    backgroundColor: colors.background.primary,
  },
  passwordInput: {
    ...typography.body.medium,
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text.primary,
  },
  passwordToggle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  passwordToggleText: {
    ...typography.body.small,
    color: colors.primary[500],
    fontWeight: '500',
  },
  errorText: {
    ...typography.body.small,
    color: colors.error[500],
    marginTop: spacing.xs,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...typography.body.medium,
    color: colors.primary[500],
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  loginButtonText: {
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
  phoneLoginButton: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  phoneLoginText: {
    ...typography.body.medium,
    color: colors.primary[500],
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    ...typography.body.medium,
    color: colors.text.secondary,
  },
  signupLinkText: {
    ...typography.body.medium,
    color: colors.primary[500],
    fontWeight: '500',
  },
});

export default EmailLoginScreen;