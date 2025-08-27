import React from 'react';
import { Heart, Shield, Calendar, MapPin, DollarSign, Bell, Activity, Pill, Stethoscope } from 'lucide-react';
import { useApp } from '../hooks/useAppStore';

export default function Health() {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';

  const healthWallet = [
    {
      id: '1',
      type: 'insurance',
      description: 'Monthly Health Insurance Premium',
      amount: 45.0,
      date: '2024-01-01',
      covered: true
    },
    {
      id: '2',
      type: 'medication',
      description: 'Diabetes Medication',
      amount: 25.5,
      date: '2024-01-15',
      covered: true
    },
    {
      id: '3',
      type: 'checkup',
      description: 'Annual Health Checkup',
      amount: 80.0,
      date: '2024-01-10',
      covered: false
    }
  ];

  const pharmacies = [
    {
      id: '1',
      name: 'Al Dawaa Pharmacy',
      distance: 1.2,
      rating: 4.5,
      hasSubsidy: true,
      subsidyPercentage: 30,
      openHours: '8:00 AM - 10:00 PM'
    },
    {
      id: '2',
      name: 'Nasser Pharmacy',
      distance: 2.1,
      rating: 4.2,
      hasSubsidy: true,
      subsidyPercentage: 25,
      openHours: '24 Hours'
    }
  ];

  const getHealthIcon = (type: string) => {
    const iconProps = { size: 20, color: '#10B981' };
    switch (type) {
      case 'insurance': return <Shield {...iconProps} />;
      case 'medication': return <Pill {...iconProps} />;
      case 'checkup': return <Stethoscope {...iconProps} />;
      default: return <Heart {...iconProps} />;
    }
  };

  const totalCovered = healthWallet
    .filter(item => item.covered)
    .reduce((sum, item) => sum + item.amount, 0);

  const totalOutOfPocket = healthWallet
    .filter(item => !item.covered)
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
          {isArabic ? 'الصحة والحماية' : 'Health & Protection'}
        </h1>
        <p style={{ color: theme.textSecondary }}>
          {isArabic ? 'تتبع صحتك ونفقاتك الطبية' : 'Track your health and medical expenses'}
        </p>
      </div>

      {/* Health Wallet Summary */}
      <div className="p-6 rounded-2xl mb-8" style={{ backgroundColor: theme.card }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            {isArabic ? 'محفظة الصحة' : 'Health Wallet'}
          </h2>
          <Heart size={24} color="#EF4444" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>BD {totalCovered.toFixed(2)}</p>
            <p className="text-sm" style={{ color: theme.textTertiary }}>
              {isArabic ? 'مغطى بالتأمين' : 'Insurance Covered'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>BD {totalOutOfPocket.toFixed(2)}</p>
            <p className="text-sm" style={{ color: theme.textTertiary }}>
              {isArabic ? 'من الجيب' : 'Out of Pocket'}
            </p>
          </div>
        </div>
      </div>

      {/* Health Wallet Transactions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
          {isArabic ? 'سجل النفقات الطبية' : 'Medical Expenses Log'}
        </h2>
        <div className="space-y-4">
          {healthWallet.map((item) => (
            <div key={item.id} className="p-4 rounded-xl" style={{ backgroundColor: theme.cardSecondary }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {getHealthIcon(item.type)}
                  <div>
                    <h3 className="font-semibold" style={{ color: theme.text }}>{item.description}</h3>
                    <p className="text-sm" style={{ color: theme.textTertiary }}>{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={{ color: theme.text }}>BD {item.amount.toFixed(2)}</p>
                  <div 
                    className="px-2 py-1 rounded-lg text-xs font-medium text-white"
                    style={{ backgroundColor: item.covered ? '#10B981' : '#EF4444' }}
                  >
                    {item.covered ? 
                      (isArabic ? 'مغطى' : 'Covered') : 
                      (isArabic ? 'غير مغطى' : 'Not Covered')
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subsidized Pharmacies */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
          {isArabic ? 'الصيدليات المدعومة' : 'Subsidized Pharmacies'}
        </h2>
        <div className="space-y-4">
          {pharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="p-4 rounded-xl" style={{ backgroundColor: theme.cardSecondary }}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold" style={{ color: theme.text }}>{pharmacy.name}</h3>
                    {pharmacy.hasSubsidy && (
                      <span className="px-2 py-1 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: '#10B981' }}>
                        {pharmacy.subsidyPercentage}% {isArabic ? 'خصم' : 'OFF'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} color="#9CA3AF" />
                      <span className="text-sm" style={{ color: theme.textTertiary }}>
                        {pharmacy.distance} km {isArabic ? 'بعيد' : 'away'}
                      </span>
                    </div>
                    <span className="text-sm" style={{ color: '#F59E0B' }}>⭐ {pharmacy.rating}</span>
                  </div>
                  <p className="text-sm" style={{ color: theme.textTertiary }}>{pharmacy.openHours}</p>
                </div>
                <button className="px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#3B82F6' }}>
                  {isArabic ? 'زيارة' : 'Visit'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}