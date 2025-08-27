import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Users, Building2, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { useApp } from '../hooks/useAppStore';
import type { UserRole } from '../hooks/useAppStore';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme, userData, login, register } = useApp();
  const type = searchParams.get('type') as UserRole || 'individual';
  const isArabic = userData.language === 'ar';
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getAccountTypeInfo = () => {
    switch (type) {
      case 'individual':
        return {
          title: isArabic ? 'حساب فردي' : 'Individual Account',
          icon: User,
          gradient: 'from-indigo-500 to-purple-600',
          description: isArabic ? 'للمواطنين والمقيمين' : 'For Citizens & Residents'
        };
      case 'family':
        return {
          title: isArabic ? 'حساب عائلي' : 'Family Account',
          icon: Users,
          gradient: 'from-emerald-500 to-teal-600',
          description: isArabic ? 'للعائلات والأسر' : 'For Households & Families'
        };
      case 'business':
        return {
          title: isArabic ? 'حساب تجاري' : 'Business Account',
          icon: Building2,
          gradient: 'from-red-500 to-orange-600',
          description: isArabic ? 'للشركات والمؤسسات' : 'For Businesses & Institutions'
        };
      default:
        return {
          title: isArabic ? 'حساب فردي' : 'Individual Account',
          icon: User,
          gradient: 'from-indigo-500 to-purple-600',
          description: isArabic ? 'للمواطنين والمقيمين' : 'For Citizens & Residents'
        };
    }
  };

  const accountInfo = getAccountTypeInfo();
  const IconComponent = accountInfo.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert(isArabic ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert(isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    if (!isLogin && !name) {
      alert(isArabic ? 'يرجى إدخال الاسم' : 'Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password, type);
      } else {
        result = await register(email, password, name, type);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        alert(result.error || (isArabic ? 'حدث خطأ' : 'An error occurred'));
      }
    } catch (error) {
      alert(isArabic ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      <div className="max-w-md mx-auto px-6 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 p-2 rounded-lg hover:bg-opacity-80"
          style={{ backgroundColor: theme.surface }}
        >
          <ArrowLeft size={20} color={theme.text} />
        </button>

        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${accountInfo.gradient} flex items-center justify-center mx-auto mb-4`}>
            <IconComponent size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
            {accountInfo.title}
          </h1>
          <p style={{ color: theme.textSecondary }}>
            {accountInfo.description}
          </p>
        </div>

        <div className="flex rounded-xl p-1 mb-8" style={{ backgroundColor: theme.surface }}>
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              isLogin ? 'text-white' : ''
            }`}
            style={{ 
              backgroundColor: isLogin ? theme.primary : 'transparent',
              color: isLogin ? 'white' : theme.textSecondary
            }}
            onClick={() => setIsLogin(true)}
          >
            {isArabic ? 'تسجيل الدخول' : 'Login'}
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              !isLogin ? 'text-white' : ''
            }`}
            style={{ 
              backgroundColor: !isLogin ? theme.primary : 'transparent',
              color: !isLogin ? 'white' : theme.textSecondary
            }}
            onClick={() => setIsLogin(false)}
          >
            {isArabic ? 'إنشاء حساب' : 'Sign Up'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                {isArabic ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User size={20} color={theme.textTertiary} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Mail size={20} color={theme.textTertiary} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text
                }}
                placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              {isArabic ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock size={20} color={theme.textTertiary} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text
                }}
                placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter your password'}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={theme.textTertiary} />
                ) : (
                  <Eye size={20} color={theme.textTertiary} />
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                {isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock size={20} color={theme.textTertiary} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  placeholder={isArabic ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={theme.textTertiary} />
                  ) : (
                    <Eye size={20} color={theme.textTertiary} />
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-bold text-white transition-colors"
            style={{ backgroundColor: theme.primary }}
          >
            {isLoading 
              ? (isArabic ? 'جاري التحميل...' : 'Loading...')
              : isLogin 
                ? (isArabic ? 'تسجيل الدخول' : 'Login')
                : (isArabic ? 'إنشاء حساب' : 'Create Account')
            }
          </button>

          {type === 'business' && !isLogin && (
            <div 
              className="flex items-center gap-2 p-3 rounded-lg"
              style={{ backgroundColor: theme.surface }}
            >
              <CheckCircle size={16} color={theme.warning} />
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {isArabic 
                  ? 'سيتم مراجعة حسابك التجاري قبل التفعيل'
                  : 'Your business account will be reviewed before activation'
                }
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}