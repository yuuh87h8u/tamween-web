export interface SubsidyData {
  type: 'fuel' | 'electricity' | 'water' | 'food';
  currentUsage: number;
  subsidyLimit: number;
  savings: number;
  bahrainAverage: number;
  icon: string;
  color: string;
}

export interface BankCard {
  id: string;
  name: string;
  bank: string;
  cashbackRate: number;
  annualFee: number;
  benefits: string[];
  color: string;
  logo: string;
}

export interface Deal {
  id: string;
  store: string;
  title: string;
  discount: number;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  image: string;
  validUntil: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  savings: number;
  badges: string[];
}

export interface Challenge {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  target: number;
  current: number;
  reward: string;
  type: 'electricity' | 'water' | 'savings' | 'spending';
}

export interface AITip {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  savings: number;
}

export interface Subscription {
  id: string;
  name: string;
  nameAr: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string;
  category: string;
  logo: string;
  isActive: boolean;
}

export interface MealPlan {
  id: string;
  name: string;
  nameAr: string;
  ingredients: string[];
  ingredientsAr: string[];
  servings: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  image: string;
  nutritionScore: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameAr: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  category: string;
  barcode?: string;
  image: string;
}

export interface TravelBudget {
  id: string;
  destination: string;
  destinationAr: string;
  estimatedCost: number;
  savedAmount: number;
  targetDate: string;
  categories: {
    flights: number;
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
  };
}

export interface CreditScore {
  score: number;
  maxScore: number;
  factors: {
    paymentHistory: number;
    creditUtilization: number;
    creditLength: number;
    creditMix: number;
    newCredit: number;
  };
  recommendations: string[];
  recommendationsAr: string[];
}

export interface FreelanceProject {
  id: string;
  title: string;
  titleAr: string;
  client: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'paid';
  dueDate: string;
  description: string;
  descriptionAr: string;
}

export interface CommunityItem {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  seller: string;
  image: string;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  location: string;
}

export interface GameMission {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  target: number;
  current: number;
  reward: string;
  rewardAr: string;
  type: 'savings' | 'spending' | 'energy' | 'water' | 'community';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: string;
}

export interface AIScenario {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  parameters: {
    subsidyChange: number;
    incomeChange: number;
    expenseChange: number;
  };
  results: {
    monthlyImpact: number;
    yearlyImpact: number;
    recommendations: string[];
    recommendationsAr: string[];
  };
}

export type UserRole = 'individual' | 'family' | 'business';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface IndividualProfile {
  cprId?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  linkedFamilyId?: string;
}

export interface FamilyProfile {
  familyId: string;
  headOfHousehold: string;
  members: FamilyMemberProfile[];
  totalMembers: number;
  householdIncome: number;
  address?: string;
}

export interface FamilyMemberProfile {
  id: string;
  name: string;
  relationship: 'spouse' | 'child' | 'parent' | 'other';
  age: number;
  hasSubAccount: boolean;
  permissions: string[];
  allowance?: number;
}

export interface BusinessProfile {
  businessId: string;
  businessName: string;
  businessType: 'bank' | 'grocery' | 'utility' | 'government' | 'ngo' | 'education' | 'transport' | 'health' | 'other';
  licenseNumber: string;
  isVerified: boolean;
  services: string[];
  contactInfo: {
    phone: string;
    address: string;
    website?: string;
  };
}

export interface UserData {
  financialHealthScore: number;
  monthlyIncome: number;
  monthlySpending: number;
  monthlySavings: number;
  subsidySavings: number;
  emergencyFund: number;
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  lifetimeSavings: number;
  carbonSaved: number;
  stepsToday: number;
  biometricEnabled: boolean;
  cprId?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  profile?: IndividualProfile | FamilyProfile | BusinessProfile;
}

export interface LifetimeSavings {
  totalSaved: number;
  byCategory: {
    subsidies: number;
    deals: number;
    banking: number;
    utilities: number;
  };
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  titleAr: string;
  amount: number;
  achieved: boolean;
  date?: string;
}

export interface WhatIfScenario {
  id: string;
  name: string;
  nameAr: string;
  category: 'electricity' | 'water' | 'fuel' | 'food';
  currentValue: number;
  newValue: number;
  estimatedSavings: number;
}

export interface HealthySwap {
  id: string;
  originalProduct: string;
  healthierAlternative: string;
  nutritionBenefit: string;
  priceDifference: number;
  calories: { original: number; alternative: number };
}

export interface CarbonActivity {
  id: string;
  type: 'transport' | 'energy' | 'recycling' | 'shopping';
  description: string;
  descriptionAr: string;
  carbonSaved: number;
  date: string;
}

export interface EcoBadge {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  requirement: number;
  earned: boolean;
}

export interface GigJob {
  id: string;
  title: string;
  titleAr: string;
  company: string;
  hourlyRate: number;
  location: string;
  type: 'delivery' | 'tutoring' | 'cleaning' | 'tech' | 'other';
  requirements: string[];
  flexible: boolean;
}

export interface MicroBusiness {
  id: string;
  name: string;
  category: string;
  description: string;
  owner: string;
  rating: number;
  products: BusinessProduct[];
}

export interface BusinessProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface SkillCourse {
  id: string;
  title: string;
  titleAr: string;
  provider: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  free: boolean;
  rating: number;
}

export interface InsuranceOption {
  id: string;
  provider: string;
  type: 'health' | 'car' | 'home' | 'life';
  monthlyPremium: number;
  coverage: number;
  benefits: string[];
  rating: number;
}

export interface BillSplit {
  id: string;
  name: string;
  totalAmount: number;
  participants: BillParticipant[];
  category: string;
  dueDate: string;
  paid: boolean;
}

export interface BillParticipant {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
}

export interface SmartDevice {
  id: string;
  name: string;
  type: 'plug' | 'meter' | 'thermostat' | 'sensor';
  location: string;
  currentUsage: number;
  status: 'online' | 'offline';
  lastReading: string;
}

export interface FriendCircle {
  id: string;
  name: string;
  members: FamilyMember[];
  currentChallenge?: Challenge;
  totalSavings: number;
}

export interface CharityPool {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  targetAmount: number;
  currentAmount: number;
  participants: number;
  endDate: string;
}

export interface GovernmentStats {
  totalSubsidySpend: number;
  wasteReduced: number;
  citizensHelped: number;
  lastUpdated: string;
}

export interface SubsidyIdea {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  votes: number;
  userVoted: boolean;
  category: string;
}