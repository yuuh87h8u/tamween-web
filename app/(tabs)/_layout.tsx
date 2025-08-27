import { Tabs } from 'expo-router';
import React from 'react';
import { 
  Home, 
  BarChart3, 
  ShoppingBag, 
  CreditCard, 
  MessageCircle,
  Grid3X3,
  Users,
  Building2,
  TrendingUp
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';
import { View, ActivityIndicator } from 'react-native';

export default function TabLayout() {
  const { userData, theme, isAuthenticated, authUser, isLoading } = useApp();
  const isArabic = userData.language === 'ar';
  
  // Authentication is handled at the root level
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }
  
  // Don't render tabs if not authenticated
  if (!isAuthenticated || !authUser) {
    return null;
  }
  
  const userRole = authUser.role;

  const getTabsForRole = () => {
    const commonTabs = [
      {
        name: "home",
        title: isArabic ? 'الرئيسية' : 'Home',
        icon: Home,
        show: true
      },
      {
        name: "ai-assistant",
        title: isArabic ? 'المساعد' : 'AI Chat',
        icon: MessageCircle,
        show: true
      }
    ];
    
    if (userRole === 'individual') {
      return [
        ...commonTabs,
        {
          name: "subsidies",
          title: isArabic ? 'الدعم' : 'Subsidies',
          icon: BarChart3,
          show: true
        },
        {
          name: "shopping",
          title: isArabic ? 'التسوق' : 'Deals',
          icon: ShoppingBag,
          show: true
        },
        {
          name: "banking",
          title: isArabic ? 'البنوك' : 'Banking',
          icon: CreditCard,
          show: true
        },
        {
          name: "more",
          title: isArabic ? 'المزيد' : 'More',
          icon: Grid3X3,
          show: true
        }
      ];
    } else if (userRole === 'family') {
      return [
        ...commonTabs,
        {
          name: "family-management",
          title: isArabic ? 'العائلة' : 'Family',
          icon: Users,
          show: true
        },
        {
          name: "subsidies",
          title: isArabic ? 'الدعم' : 'Subsidies',
          icon: BarChart3,
          show: true
        },
        {
          name: "shopping",
          title: isArabic ? 'التسوق' : 'Deals',
          icon: ShoppingBag,
          show: true
        },
        {
          name: "more",
          title: isArabic ? 'المزيد' : 'More',
          icon: Grid3X3,
          show: true
        }
      ];
    } else if (userRole === 'business') {
      return [
        {
          name: "home",
          title: isArabic ? 'لوحة التحكم' : 'Dashboard',
          icon: Building2,
          show: true
        },
        {
          name: "shopping",
          title: isArabic ? 'العروض' : 'Offers',
          icon: ShoppingBag,
          show: true
        },
        {
          name: "banking",
          title: isArabic ? 'الخدمات' : 'Services',
          icon: CreditCard,
          show: true
        },
        {
          name: "ai-assistant",
          title: isArabic ? 'المساعد' : 'AI Chat',
          icon: MessageCircle,
          show: true
        },
        {
          name: "more",
          title: isArabic ? 'التحليلات' : 'Analytics',
          icon: TrendingUp,
          show: true
        }
      ];
    }
    
    return commonTabs;
  };
  
  const visibleTabs = getTabsForRole();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      {visibleTabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color }) => <IconComponent size={22} color={color} />,
              href: tab.show ? undefined : null,
            }}
          />
        );
      })}
      {/* Hidden screens - accessible via navigation but not as tabs */}
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="carbon-wallet" options={{ href: null }} />
      <Tabs.Screen name="jobs-income" options={{ href: null }} />
      <Tabs.Screen name="utilities" options={{ href: null }} />
      <Tabs.Screen name="community" options={{ href: null }} />
      <Tabs.Screen name="bills" options={{ href: null }} />
      <Tabs.Screen name="transport" options={{ href: null }} />
      <Tabs.Screen name="education" options={{ href: null }} />
      <Tabs.Screen name="health" options={{ href: null }} />
      <Tabs.Screen name="housing" options={{ href: null }} />
      <Tabs.Screen name="lifestyle" options={{ href: null }} />
      <Tabs.Screen name="travel" options={{ href: null }} />
      <Tabs.Screen name="advanced-finance" options={{ href: null }} />
      <Tabs.Screen name="work-productivity" options={{ href: null }} />
      <Tabs.Screen name="gamification" options={{ href: null }} />
      <Tabs.Screen name="ai-power" options={{ href: null }} />
    </Tabs>
  );
}