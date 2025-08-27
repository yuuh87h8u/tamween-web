import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  CreditCard, 
  ShoppingBag, 
  Users,
  Sun,
  Moon,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useApp } from '../hooks/useAppStore';
import FinancialHealthScore from '../components/FinancialHealthScore';
import { trpc } from '../lib/trpc';

export default function Home() {
  const navigate = useNavigate();
  const { userData, toggleLanguage, toggleTheme, theme, authUser } = useApp();
  const [showAlert, setShowAlert] = useState(true);
  const isArabic = userData.language === 'ar';
  const userRole = authUser?.role || 'individual';

  // Test backend connection
  const healthQuery = trpc.example.health.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="text-center">
          <p className="text-lg" style={{ color: theme.textSecondary }}>
            {isArabic ? `مرحباً ${authUser?.name || ''}` : `Welcome back ${authUser?.name || ''}`}
          </p>
          <h1 className="text-3xl font-bold" style={{ color: theme.text }}>
            {userRole === 'business' 
              ? (isArabic ? 'لوحة الأعمال' : 'Business Dashboard')
              : userRole === 'family'
              ? (isArabic ? 'لوحة العائلة' : 'Family Dashboard')
              : 'Tamween'
            }
          </h1>
        </div>
      </div>

      {/* Backend Status - Development Only */}
      {import.meta.env.DEV && (
        <div className="mb-6">
          <div 
            className="p-3 rounded-lg text-center text-white font-medium"
            style={{ 
              backgroundColor: healthQuery.isSuccess ? '#10B981' : healthQuery.isError ? '#EF4444' : '#F59E0B'
            }}
          >
            <p>Backend: {healthQuery.isLoading ? 'Connecting...' : healthQuery.isSuccess ? 'Connected' : 'Offline'}</p>
            {healthQuery.data && (
              <p className="text-sm opacity-90">{healthQuery.data.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Financial Health Score - Only for Individual and Family */}
      {(userRole === 'individual' || userRole === 'family') && (
        <div className="flex justify-center mb-8">
          <FinancialHealthScore score={userData.financialHealthScore || 0} size={140} />
        </div>
      )}
      
      {/* Business Stats */}
      {userRole === 'business' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
            {isArabic ? 'إحصائيات الأعمال' : 'Business Overview'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: theme.card }}>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {isArabic ? 'العملاء النشطون' : 'Active Customers'}
              </p>
              <p className="text-2xl font-bold" style={{ color: theme.text }}>2,847</p>
            </div>
            <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: theme.card }}>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {isArabic ? 'العروض المنشورة' : 'Published Offers'}
              </p>
              <p className="text-2xl font-bold" style={{ color: theme.text }}>23</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {userRole === 'individual' && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: theme.card }}>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {isArabic ? 'الإنفاق' : 'Spending'}
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.text }}>BD {userData.monthlySpending || 0}</p>
          </div>
          <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: theme.card }}>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {isArabic ? 'المدخرات' : 'Savings'}
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.text }}>BD {userData.monthlySavings || 0}</p>
          </div>
        </div>
      )}
      
      {/* Family Stats */}
      {userRole === 'family' && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: theme.card }}>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {isArabic ? 'إجمالي الإنفاق' : 'Total Spending'}
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.text }}>BD {(userData.monthlySpending || 0) * 1.8}</p>
          </div>
          <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: theme.card }}>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {isArabic ? 'إجمالي المدخرات' : 'Total Savings'}
            </p>
            <p className="text-2xl font-bold" style={{ color: theme.text }}>BD {(userData.monthlySavings || 0) * 2.2}</p>
          </div>
        </div>
      )}

      {/* Lifetime Savings */}
      <div className="p-6 rounded-2xl mb-8" style={{ backgroundColor: theme.card }}>
        <div className="text-center mb-4">
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            {userRole === 'family' 
              ? (isArabic ? 'إجمالي مدخرات العائلة' : 'Family Lifetime Savings')
              : (isArabic ? 'إجمالي المدخرات مدى الحياة' : 'Lifetime Savings')
            }
          </p>
          <p className="text-4xl font-bold" style={{ color: theme.primary }}>
            BD {userRole === 'family' ? (userData.lifetimeSavings || 0) * 2.5 : userData.lifetimeSavings || 0}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs" style={{ color: theme.textSecondary }}>{isArabic ? 'الدعم' : 'Subsidies'}</p>
            <p className="font-semibold" style={{ color: theme.text }}>
              BD {userRole === 'family' ? '3,125' : '1,250'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: theme.textSecondary }}>{isArabic ? 'العروض' : 'Deals'}</p>
            <p className="font-semibold" style={{ color: theme.text }}>
              BD {userRole === 'family' ? '1,700' : '680'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: theme.textSecondary }}>{isArabic ? 'البنوك' : 'Banking'}</p>
            <p className="font-semibold" style={{ color: theme.text }}>
              BD {userRole === 'family' ? '1,300' : '520'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
          {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(userRole === 'individual' || userRole === 'family') && (
            <button 
              className="p-6 rounded-2xl text-center transition-colors hover:opacity-80"
              style={{ backgroundColor: theme.card }}
              onClick={() => navigate('/dashboard/banking')}
            >
              <BarChart3 size={24} color={theme.primary} className="mx-auto mb-2" />
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                {isArabic ? 'الدعم' : 'Subsidies'}
              </p>
            </button>
          )}
          <button 
            className="p-6 rounded-2xl text-center transition-colors hover:opacity-80"
            style={{ backgroundColor: theme.card }}
            onClick={() => navigate('/dashboard/shopping')}
          >
            <ShoppingBag size={24} color={theme.secondary} className="mx-auto mb-2" />
            <p className="text-sm font-medium" style={{ color: theme.text }}>
              {userRole === 'business' 
                ? (isArabic ? 'العروض' : 'Offers')
                : (isArabic ? 'العروض' : 'Deals')
              }
            </p>
          </button>
          <button 
            className="p-6 rounded-2xl text-center transition-colors hover:opacity-80"
            style={{ backgroundColor: theme.card }}
            onClick={() => navigate('/dashboard/banking')}
          >
            <CreditCard size={24} color={theme.accent} className="mx-auto mb-2" />
            <p className="text-sm font-medium" style={{ color: theme.text }}>
              {userRole === 'business'
                ? (isArabic ? 'الخدمات' : 'Services')
                : (isArabic ? 'البنوك' : 'Banking')
              }
            </p>
          </button>
          {userRole === 'family' && (
            <button 
              className="p-6 rounded-2xl text-center transition-colors hover:opacity-80"
              style={{ backgroundColor: theme.card }}
            >
              <Users size={24} color="#EC4899" className="mx-auto mb-2" />
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                {isArabic ? 'العائلة' : 'Family'}
              </p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}