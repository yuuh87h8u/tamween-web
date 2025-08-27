import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Building2, ArrowRight, Shield } from 'lucide-react';
import { useApp } from '../hooks/useAppStore';

export default function LoginSelection() {
  const navigate = useNavigate();
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';

  const loginTypes = [
    {
      id: 'individual',
      title: isArabic ? 'حساب فردي' : 'Individual Account',
      subtitle: isArabic ? 'للمواطنين والمقيمين' : 'For Citizens & Residents',
      description: isArabic 
        ? 'إدارة الأموال الشخصية، الدعم الحكومي، والمدخرات'
        : 'Manage personal finances, subsidies, and savings',
      icon: User,
      gradient: 'from-indigo-500 to-purple-600',
      features: isArabic 
        ? ['الدعم الحكومي', 'البنوك الشخصية', 'التسوق الذكي', 'المساعد الذكي']
        : ['Government Subsidies', 'Personal Banking', 'Smart Shopping', 'AI Assistant']
    },
    {
      id: 'family',
      title: isArabic ? 'حساب عائلي' : 'Family Account',
      subtitle: isArabic ? 'للعائلات والأسر' : 'For Households & Families',
      description: isArabic 
        ? 'إدارة مالية عائلية مع حسابات فرعية للأطفال'
        : 'Family financial management with sub-accounts',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-600',
      features: isArabic 
        ? ['إدارة العائلة', 'مصروف الأطفال', 'التحديات العائلية', 'المدخرات المشتركة']
        : ['Family Management', 'Kids Allowance', 'Family Challenges', 'Shared Savings']
    },
    {
      id: 'business',
      title: isArabic ? 'حساب تجاري' : 'Business Account',
      subtitle: isArabic ? 'للشركات والمؤسسات' : 'For Businesses & Institutions',
      description: isArabic 
        ? 'للبنوك، المتاجر، الشركات، والمؤسسات الحكومية'
        : 'For banks, stores, companies, and government institutions',
      icon: Building2,
      gradient: 'from-red-500 to-orange-600',
      features: isArabic 
        ? ['لوحة الأعمال', 'العروض والخصومات', 'التكامل المصرفي', 'التحليلات']
        : ['Business Dashboard', 'Offers & Deals', 'Banking Integration', 'Analytics']
    }
  ];

  const handleLoginTypeSelect = (type: string) => {
    navigate(`/login?type=${type}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: theme.text }}>
            {isArabic ? 'مرحباً بك في تموين' : 'Welcome to Tamween'}
          </h1>
          <p className="text-lg" style={{ color: theme.textSecondary }}>
            {isArabic 
              ? 'اختر نوع الحساب المناسب لك'
              : 'Choose your account type to get started'
            }
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {loginTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.id}
                className="rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: theme.surface }}
                onClick={() => handleLoginTypeSelect(type.id)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-6`}>
                  <IconComponent size={32} color="white" />
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold" style={{ color: theme.text }}>
                      {type.title}
                    </h3>
                    <ArrowRight size={20} color={theme.textTertiary} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                    {type.subtitle}
                  </p>
                </div>

                <p className="text-sm mb-6" style={{ color: theme.textSecondary }}>
                  {type.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {type.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: theme.surfaceSecondary,
                        color: theme.textSecondary 
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div 
            className="inline-flex items-center px-4 py-3 rounded-xl gap-2"
            style={{ backgroundColor: theme.surface }}
          >
            <Shield size={16} color={theme.primary} />
            <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
              {isArabic ? 'محمي بأعلى معايير الأمان' : 'Protected with highest security standards'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}