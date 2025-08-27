import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Users, 
  Building2, 
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';
import { UserRole } from '@/types';

export default function Login() {
  const { theme, userData, login, register } = useApp();
  const { type } = useLocalSearchParams<{ type: string }>();
  const isArabic = userData.language === 'ar';
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userRole = (type as UserRole) || 'individual';

  const getAccountTypeInfo = () => {
    switch (userRole) {
      case 'individual':
        return {
          title: isArabic ? 'حساب فردي' : 'Individual Account',
          icon: User,
          gradient: ['#4F46E5', '#7C3AED'],
          description: isArabic ? 'للمواطنين والمقيمين' : 'For Citizens & Residents'
        };
      case 'family':
        return {
          title: isArabic ? 'حساب عائلي' : 'Family Account',
          icon: Users,
          gradient: ['#059669', '#0D9488'],
          description: isArabic ? 'للعائلات والأسر' : 'For Households & Families'
        };
      case 'business':
        return {
          title: isArabic ? 'حساب تجاري' : 'Business Account',
          icon: Building2,
          gradient: ['#DC2626', '#EA580C'],
          description: isArabic ? 'للشركات والمؤسسات' : 'For Businesses & Institutions'
        };
      default:
        return {
          title: isArabic ? 'حساب فردي' : 'Individual Account',
          icon: User,
          gradient: ['#4F46E5', '#7C3AED'],
          description: isArabic ? 'للمواطنين والمقيمين' : 'For Citizens & Residents'
        };
    }
  };

  const accountInfo = getAccountTypeInfo();
  const IconComponent = accountInfo.icon;

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields'
      );
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'
      );
      return;
    }

    if (!isLogin && !name) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'يرجى إدخال الاسم' : 'Please enter your name'
      );
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password, userRole);
      } else {
        result = await register(email, password, name, userRole);
      }

      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          isArabic ? 'خطأ' : 'Error',
          result.error || (isArabic ? 'حدث خطأ' : 'An error occurred')
        );
      }
    } catch (error) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <LinearGradient
              colors={accountInfo.gradient as [string, string]}
              style={styles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <IconComponent size={32} color="white" />
            </LinearGradient>

            <Text style={[styles.title, { color: theme.text }]}>
              {accountInfo.title}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {accountInfo.description}
            </Text>
          </View>

          <View style={styles.toggleContainer}>
            <View style={[styles.toggleWrapper, { backgroundColor: theme.surface }]}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  isLogin && { backgroundColor: theme.primary }
                ]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[
                  styles.toggleText,
                  { color: isLogin ? 'white' : theme.textSecondary }
                ]}>
                  {isArabic ? 'تسجيل الدخول' : 'Login'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  !isLogin && { backgroundColor: theme.primary }
                ]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[
                  styles.toggleText,
                  { color: !isLogin ? 'white' : theme.textSecondary }
                ]}>
                  {isArabic ? 'إنشاء حساب' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>
                  {isArabic ? 'الاسم الكامل' : 'Full Name'}
                </Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <User size={20} color={theme.textTertiary} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    placeholderTextColor={theme.textTertiary}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Mail size={20} color={theme.textTertiary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  placeholderTextColor={theme.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {isArabic ? 'كلمة المرور' : 'Password'}
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Lock size={20} color={theme.textTertiary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter your password'}
                  placeholderTextColor={theme.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={theme.textTertiary} />
                  ) : (
                    <Eye size={20} color={theme.textTertiary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>
                  {isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Lock size={20} color={theme.textTertiary} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder={isArabic ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                    placeholderTextColor={theme.textTertiary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={theme.textTertiary} />
                    ) : (
                      <Eye size={20} color={theme.textTertiary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading 
                  ? (isArabic ? 'جاري التحميل...' : 'Loading...')
                  : isLogin 
                    ? (isArabic ? 'تسجيل الدخول' : 'Login')
                    : (isArabic ? 'إنشاء حساب' : 'Create Account')
                }
              </Text>
            </TouchableOpacity>

            {userRole === 'business' && !isLogin && (
              <View style={[styles.verificationNotice, { backgroundColor: theme.surface }]}>
                <CheckCircle size={16} color={theme.warning} />
                <Text style={[styles.verificationText, { color: theme.textSecondary }]}>
                  {isArabic 
                    ? 'سيتم مراجعة حسابك التجاري قبل التفعيل'
                    : 'Your business account will be reviewed before activation'
                  }
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  toggleContainer: {
    marginBottom: 30,
  },
  toggleWrapper: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 24,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verificationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 10,
  },
  verificationText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});