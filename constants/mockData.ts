import { SubsidyData, BankCard, Deal, FamilyMember, Challenge, AITip } from '@/types';

export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceSecondary: '#F1F5F9',
  text: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  border: '#E2E8F0',
  primary: '#10B981',
  primaryDark: '#059669',
  secondary: '#3B82F6',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  card: '#FFFFFF',
  cardSecondary: '#F8FAFC',
};

export const darkTheme = {
  background: '#111827',
  surface: '#1F2937',
  surfaceSecondary: '#374151',
  text: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  border: '#374151',
  primary: '#10B981',
  primaryDark: '#059669',
  secondary: '#3B82F6',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  card: '#1F2937',
  cardSecondary: '#374151',
};

export const subsidyData: SubsidyData[] = [
  {
    type: 'fuel',
    currentUsage: 85,
    subsidyLimit: 100,
    savings: 23,
    bahrainAverage: 78,
    icon: '⛽',
    color: '#3B82F6'
  },
  {
    type: 'electricity',
    currentUsage: 190,
    subsidyLimit: 200,
    savings: 34,
    bahrainAverage: 156,
    icon: '⚡',
    color: '#10B981'
  },
  {
    type: 'water',
    currentUsage: 130,
    subsidyLimit: 150,
    savings: 18,
    bahrainAverage: 125,
    icon: '💧',
    color: '#06B6D4'
  },
  {
    type: 'food',
    currentUsage: 75,
    subsidyLimit: 100,
    savings: 12,
    bahrainAverage: 82,
    icon: '🛒',
    color: '#F59E0B'
  }
];

export const bankCards: BankCard[] = [
  {
    id: '1',
    name: 'NBB Cashback Card',
    bank: 'National Bank of Bahrain',
    cashbackRate: 5,
    annualFee: 0,
    benefits: ['5% cashback on groceries', 'No annual fee', 'Free airport lounge'],
    color: '#10B981',
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=60&fit=crop'
  },
  {
    id: '2',
    name: 'BBK Rewards Card',
    bank: 'Bank of Bahrain and Kuwait',
    cashbackRate: 3,
    annualFee: 25,
    benefits: ['3% on fuel', '2% on dining', 'Travel insurance'],
    color: '#3B82F6',
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=60&fit=crop'
  }
];

export const deals: Deal[] = [
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

export const familyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'Ahmed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    savings: 150,
    badges: ['Water Hero', 'Budget Master']
  },
  {
    id: '2',
    name: 'Fatima',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
    savings: 200,
    badges: ['Eco Warrior', 'Deal Hunter']
  },
  {
    id: '3',
    name: 'Omar',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    savings: 95,
    badges: ['Energy Saver']
  }
];

export const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Reduce electricity usage by 10%',
    titleAr: 'تقليل استهلاك الكهرباء بنسبة 10%',
    description: 'Save energy and money this month',
    descriptionAr: 'وفر الطاقة والمال هذا الشهر',
    target: 10,
    current: 6,
    reward: 'BD 5 bonus',
    type: 'electricity'
  },
  {
    id: '2',
    title: 'Save BD 100 this month',
    titleAr: 'وفر 100 دينار هذا الشهر',
    description: 'Reach your monthly savings goal',
    descriptionAr: 'حقق هدف الادخار الشهري',
    target: 100,
    current: 65,
    reward: 'Family badge',
    type: 'savings'
  }
];

export const aiTips: AITip[] = [
  {
    id: '1',
    title: 'Switch to energy-saving bulbs',
    titleAr: 'استخدم المصابيح الموفرة للطاقة',
    description: 'Save BD 3 monthly on electricity',
    descriptionAr: 'وفر 3 دنانير شهرياً على الكهرباء',
    category: 'Energy',
    savings: 3
  },
  {
    id: '2',
    title: 'Use NBB card for groceries',
    titleAr: 'استخدم بطاقة البنك الأهلي للبقالة',
    description: 'Get 5% cashback on all grocery purchases',
    descriptionAr: 'احصل على 5% استرداد نقدي على مشتريات البقالة',
    category: 'Banking',
    savings: 15
  }
];

export const spendingData = [
  { month: 'Jan', spending: 450, savings: 150 },
  { month: 'Feb', spending: 420, savings: 180 },
  { month: 'Mar', spending: 480, savings: 120 },
  { month: 'Apr', spending: 400, savings: 200 },
  { month: 'May', spending: 460, savings: 140 },
  { month: 'Jun', spending: 380, savings: 220 }
];

// Google API Integration Service
export class GoogleAPIService {
  private static readonly GOOGLE_PLACES_API_KEY = 'AIzaSyDofcXNYF9JkQAKcLd2IGbyzv9IPSD079s';
  private static readonly GOOGLE_MAPS_API_KEY = 'AIzaSyDofcXNYF9JkQAKcLd2IGbyzv9IPSD079s';
  
  // Find nearby stores using Google Places API
  static async findNearbyStores(latitude: number, longitude: number, radius: number = 5000) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${latitude},${longitude}&` +
        `radius=${radius}&` +
        `type=grocery_or_supermarket&` +
        `key=${this.GOOGLE_PLACES_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          rating: place.rating || 4.0,
          distance: this.calculateDistance(
            latitude, longitude,
            place.geometry.location.lat,
            place.geometry.location.lng
          ),
          isOpen: place.opening_hours?.open_now || true,
          priceLevel: place.price_level || 2,
          photos: place.photos?.map((photo: any) => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.GOOGLE_PLACES_API_KEY}`
          ) || []
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching nearby stores:', error);
      return this.getMockNearbyStores();
    }
  }
  
  // Get store details using Google Places API
  static async getStoreDetails(placeId: string) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}&` +
        `fields=name,rating,formatted_phone_number,opening_hours,website,reviews&` +
        `key=${this.GOOGLE_PLACES_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        return {
          name: data.result.name,
          rating: data.result.rating,
          phone: data.result.formatted_phone_number,
          website: data.result.website,
          openingHours: data.result.opening_hours?.weekday_text || [],
          reviews: data.result.reviews?.slice(0, 3) || []
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching store details:', error);
      return null;
    }
  }
  
  // Search for products using Google Shopping API
  static async searchProducts(query: string, location?: string) {
    try {
      const locationParam = location ? `&location=${encodeURIComponent(location)}` : '';
      const response = await fetch(
        `https://serpapi.com/search.json?` +
        `engine=google_shopping&` +
        `q=${encodeURIComponent(query)}${locationParam}&` +
        `api_key=demo`
      );
      
      const data = await response.json();
      
      if (data.shopping_results) {
        return data.shopping_results.map((result: any) => ({
          title: result.title,
          price: result.price,
          source: result.source,
          link: result.link,
          thumbnail: result.thumbnail,
          rating: result.rating,
          reviews: result.reviews,
          delivery: result.delivery
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error searching products:', error);
      return this.getMockProductResults(query);
    }
  }
  
  // Get directions using Google Directions API
  static async getDirections(origin: string, destination: string, mode: string = 'driving') {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=${encodeURIComponent(origin)}&` +
        `destination=${encodeURIComponent(destination)}&` +
        `mode=${mode}&` +
        `key=${this.GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distance: route.legs[0].distance.text,
          duration: route.legs[0].duration.text,
          steps: route.legs[0].steps.map((step: any) => ({
            instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
            distance: step.distance.text,
            duration: step.duration.text
          }))
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting directions:', error);
      return null;
    }
  }
  
  // Calculate distance between two coordinates
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return Math.round(d * 10) / 10;
  }
  
  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  
  // Mock data fallbacks
  private static getMockNearbyStores() {
    return [
      {
        id: 'mock_lulu',
        name: 'LuLu Hypermarket',
        address: 'Seef District, Manama',
        rating: 4.5,
        distance: 0.8,
        isOpen: true,
        priceLevel: 2,
        photos: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400']
      },
      {
        id: 'mock_carrefour',
        name: 'Carrefour City Centre',
        address: 'City Centre Bahrain',
        rating: 4.3,
        distance: 1.2,
        isOpen: true,
        priceLevel: 2,
        photos: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400']
      },
      {
        id: 'mock_mega',
        name: 'Mega Mart',
        address: 'Budaiya Highway',
        rating: 4.1,
        distance: 2.1,
        isOpen: true,
        priceLevel: 1,
        photos: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400']
      }
    ];
  }
  
  private static getMockProductResults(query: string) {
    return [
      {
        title: `${query} - Premium Quality`,
        price: 'BD 4.50',
        source: 'LuLu Hypermarket',
        link: '#',
        thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200',
        rating: 4.5,
        reviews: 128,
        delivery: 'Free delivery'
      },
      {
        title: `${query} - Best Value`,
        price: 'BD 3.80',
        source: 'Carrefour',
        link: '#',
        thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200',
        rating: 4.2,
        reviews: 89,
        delivery: '30 min delivery'
      }
    ];
  }
}