import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  ShoppingBag, 
  CreditCard, 
  MessageCircle,
  Receipt,
  Heart,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../hooks/useAppStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, authUser, toggleLanguage, toggleTheme, theme, logout } = useApp();
  const isArabic = userData.language === 'ar';
  const userRole = authUser?.role || 'individual';

  const getTabsForRole = () => {
    const commonTabs = [
      {
        name: "home",
        title: isArabic ? 'الرئيسية' : 'Home',
        icon: Home,
        path: '/dashboard/home'
      },
      {
        name: "ai-assistant",
        title: isArabic ? 'المساعد' : 'AI Chat',
        icon: MessageCircle,
        path: '/dashboard/ai-assistant'
      }
    ];
    
    if (userRole === 'individual') {
      return [
        ...commonTabs,
        {
          name: "banking",
          title: isArabic ? 'البنوك' : 'Banking',
          icon: CreditCard,
          path: '/dashboard/banking'
        },
        {
          name: "shopping",
          title: isArabic ? 'التسوق' : 'Deals',
          icon: ShoppingBag,
          path: '/dashboard/shopping'
        },
        {
          name: "bills",
          title: isArabic ? 'الفواتير' : 'Bills',
          icon: Receipt,
          path: '/dashboard/bills'
        },
        {
          name: "health",
          title: isArabic ? 'الصحة' : 'Health',
          icon: Heart,
          path: '/dashboard/health'
        }
      ];
    } else if (userRole === 'family') {
      return [
        ...commonTabs,
        {
          name: "banking",
          title: isArabic ? 'البنوك' : 'Banking',
          icon: CreditCard,
          path: '/dashboard/banking'
        },
        {
          name: "shopping",
          title: isArabic ? 'التسوق' : 'Deals',
          icon: ShoppingBag,
          path: '/dashboard/shopping'
        }
      ];
    } else if (userRole === 'business') {
      return [
        {
          name: "home",
          title: isArabic ? 'لوحة التحكم' : 'Dashboard',
          icon: Home,
          path: '/dashboard/home'
        },
        {
          name: "shopping",
          title: isArabic ? 'العروض' : 'Offers',
          icon: ShoppingBag,
          path: '/dashboard/shopping'
        },
        {
          name: "banking",
          title: isArabic ? 'الخدمات' : 'Services',
          icon: CreditCard,
          path: '/dashboard/banking'
        },
        {
          name: "ai-assistant",
          title: isArabic ? 'المساعد' : 'AI Chat',
          icon: MessageCircle,
          path: '/dashboard/ai-assistant'
        }
      ];
    }
    
    return commonTabs;
  };
  
  const visibleTabs = getTabsForRole();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold" style={{ color: theme.text }}>
                Tamween
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg"
                style={{ backgroundColor: theme.surface }}
              >
                {userData.theme === 'light' ? (
                  <Moon size={20} color={theme.text} />
                ) : (
                  <Sun size={20} color={theme.text} />
                )}
              </button>
              
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 rounded-lg text-sm font-medium"
                style={{ backgroundColor: theme.surface, color: theme.text }}
              >
                {isArabic ? 'EN' : 'عربي'}
              </button>
              
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: theme.danger, color: 'white' }}
              >
                {isArabic ? 'خروج' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 border-r" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <div className="p-4">
            <div className="space-y-2">
              {visibleTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = location.pathname === tab.path;
                return (
                  <button
                    key={tab.name}
                    onClick={() => navigate(tab.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive ? 'text-white' : ''
                    }`}
                    style={{ 
                      backgroundColor: isActive ? theme.primary : 'transparent',
                      color: isActive ? 'white' : theme.text
                    }}
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{tab.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}