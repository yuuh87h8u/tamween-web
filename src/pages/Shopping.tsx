import React from 'react';
import { Search, Filter, MapPin, Heart, Mic, Scan } from 'lucide-react';
import { useApp } from '../hooks/useAppStore';

export default function Shopping() {
  const { userData, theme, authUser } = useApp();
  const isArabic = userData.language === 'ar';
  const userRole = authUser?.role || 'individual';

  const deals = [
    {
      id: '1',
      store: 'LuLu Hypermarket',
      title: '25% Off Groceries',
      discount: 25,
      originalPrice: 100,
      discountedPrice: 75,
      category: 'Groceries',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop',
      validUntil: '2025-01-31'
    },
    {
      id: '2',
      store: 'Carrefour',
      title: 'Electronics Sale',
      discount: 30,
      originalPrice: 200,
      discountedPrice: 140,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
      validUntil: '2025-02-15'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
          {userRole === 'business' 
            ? (isArabic ? 'إدارة العروض' : 'Manage Offers')
            : (isArabic ? 'التسوق والعروض' : 'Shopping & Deals')
          }
        </h1>
      </div>

      {/* Search Bar */}
      {userRole !== 'business' && (
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: theme.surface }}>
            <Search size={20} color={theme.textTertiary} />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none"
              style={{ color: theme.text }}
              placeholder={isArabic ? 'ابحث عن المنتجات أو المتاجر' : 'Search products or stores'}
            />
          </div>
          <button className="p-3 rounded-xl text-white" style={{ backgroundColor: theme.secondary }}>
            <Mic size={20} />
          </button>
          <button className="p-3 rounded-xl text-white" style={{ backgroundColor: theme.primary }}>
            <Scan size={20} />
          </button>
          <button className="p-3 rounded-xl" style={{ backgroundColor: theme.surface }}>
            <Filter size={20} color={theme.text} />
          </button>
        </div>
      )}

      {/* Voice Assistant Demo */}
      {userRole !== 'business' && (
        <div className="p-6 rounded-2xl mb-8" style={{ backgroundColor: theme.card }}>
          <div className="flex items-center gap-3 mb-3">
            <Mic size={24} color={theme.primary} />
            <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
              {isArabic ? 'المساعد الصوتي' : 'Voice Assistant'}
            </h3>
          </div>
          <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
            {isArabic 
              ? 'قل "أقرب متجر" أو "أريد أشتري حليب" أو "خذني إلى الصحة"'
              : 'Say "nearest store" or "I want to buy milk" or "take me to health"'
            }
          </p>
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
            style={{ backgroundColor: theme.primary }}
          >
            <Mic size={20} />
            <span>{isArabic ? 'اضغط للتحدث' : 'Tap to Speak'}</span>
          </button>
        </div>
      )}

      {/* Featured Deals */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
            {userRole === 'business'
              ? (isArabic ? 'عروضك النشطة' : 'Your Active Offers')
              : (isArabic ? 'أفضل العروض' : 'Best Deals')
            }
          </h2>
          <button className="text-sm font-medium" style={{ color: theme.primary }}>
            {isArabic ? 'عرض الكل' : 'See All'}
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {deals.map((deal) => (
            <div key={deal.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.card }}>
              <img src={deal.image} alt={deal.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                    {deal.store}
                  </span>
                  <span className="px-2 py-1 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: theme.success }}>
                    {deal.discount}% {isArabic ? 'خصم' : 'OFF'}
                  </span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: theme.text }}>{deal.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through" style={{ color: theme.textTertiary }}>
                    BD {deal.originalPrice}
                  </span>
                  <span className="font-bold" style={{ color: theme.success }}>
                    BD {deal.discountedPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}