import React from 'react';
import { CreditCard, TrendingUp, Shield, Gift } from 'lucide-react';
import { useApp } from '../hooks/useAppStore';

export default function Banking() {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';

  const bankCards = [
    {
      id: '1',
      name: 'NBB Cashback Card',
      bank: 'National Bank of Bahrain',
      cashbackRate: 5,
      annualFee: 0,
      benefits: ['5% cashback on groceries', 'No annual fee', 'Free airport lounge'],
      color: '#10B981'
    },
    {
      id: '2',
      name: 'BBK Rewards Card',
      bank: 'Bank of Bahrain and Kuwait',
      cashbackRate: 3,
      annualFee: 25,
      benefits: ['3% on fuel', '2% on dining', 'Travel insurance'],
      color: '#3B82F6'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
          {isArabic ? 'البنوك والتمويل' : 'Banking & Finance'}
        </h1>
        <p style={{ color: theme.textSecondary }}>
          {isArabic ? 'إدارة بطاقاتك وحساباتك المصرفية' : 'Manage your cards and banking accounts'}
        </p>
      </div>

      {/* Smart Card Advisor */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
          {isArabic ? 'مستشار البطاقات الذكي' : 'Smart Card Advisor'}
        </h2>
        <div className="p-6 rounded-2xl" style={{ backgroundColor: theme.card }}>
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: theme.surface }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10B981' }}>
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: theme.text }}>NBB Cashback Card</h3>
              <p className="text-sm" style={{ color: theme.textSecondary }}>National Bank of Bahrain</p>
            </div>
            <div className="px-3 py-1 rounded-lg" style={{ backgroundColor: theme.primary }}>
              <span className="text-white text-xs font-bold">
                {isArabic ? 'موصى' : 'Recommended'}
              </span>
            </div>
          </div>
          <p className="mt-4" style={{ color: theme.text }}>
            {isArabic ? 
              '5% استرداد نقدي على البقالة - يوفر لك BD 15 شهرياً' :
              '5% cashback on groceries - saves you BD 15 monthly'
            }
          </p>
        </div>
      </div>

      {/* All Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
          {isArabic ? 'جميع البطاقات' : 'All Cards'}
        </h2>
        <div className="grid gap-4">
          {bankCards.map((card) => (
            <div key={card.id} className="p-6 rounded-2xl" style={{ backgroundColor: theme.card }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: card.color }}>
                  <span className="text-white font-bold">{card.bank.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: theme.text }}>{card.name}</h3>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>{card.bank}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  {isArabic ? 'استرداد نقدي:' : 'Cashback:'} {card.cashbackRate}%
                </p>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  {isArabic ? 'رسوم سنوية:' : 'Annual Fee:'} BD {card.annualFee}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}