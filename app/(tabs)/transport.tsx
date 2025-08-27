import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';
import {
  Car,
  Bus,
  MapPin,
  Clock,
  DollarSign,
  Fuel,
  Wrench,
  Zap,
  Navigation,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

interface TransportOption {
  id: string;
  type: 'car' | 'bus' | 'taxi';
  name: string;
  cost: number;
  duration: number;
  co2: number;
  description: string;
}

interface MaintenanceItem {
  id: string;
  type: 'oil' | 'tire' | 'brake' | 'battery';
  name: string;
  dueDate: string;
  mileage: number;
  status: 'due' | 'upcoming' | 'completed';
  estimatedCost: number;
}

interface Garage {
  id: string;
  name: string;
  rating: number;
  distance: number;
  services: string[];
  priceRange: string;
}

const mockTransportOptions: TransportOption[] = [
  {
    id: '1',
    type: 'car',
    name: 'Personal Car',
    cost: 2.5,
    duration: 25,
    co2: 4.2,
    description: 'Including fuel and parking'
  },
  {
    id: '2',
    type: 'bus',
    name: 'Public Bus',
    cost: 0.3,
    duration: 45,
    co2: 0.8,
    description: 'Route 12 - Next bus in 8 mins'
  },
  {
    id: '3',
    type: 'taxi',
    name: 'Taxi/Uber',
    cost: 4.0,
    duration: 20,
    co2: 3.1,
    description: 'Estimated fare'
  }
];

const mockMaintenance: MaintenanceItem[] = [
  {
    id: '1',
    type: 'oil',
    name: 'Oil Change',
    dueDate: '2024-02-15',
    mileage: 85000,
    status: 'due',
    estimatedCost: 25
  },
  {
    id: '2',
    type: 'tire',
    name: 'Tire Rotation',
    dueDate: '2024-03-01',
    mileage: 90000,
    status: 'upcoming',
    estimatedCost: 15
  },
  {
    id: '3',
    type: 'brake',
    name: 'Brake Inspection',
    dueDate: '2024-01-20',
    mileage: 88000,
    status: 'completed',
    estimatedCost: 0
  }
];

const mockGarages: Garage[] = [
  {
    id: '1',
    name: 'Al Fateh Auto Service',
    rating: 4.5,
    distance: 2.3,
    services: ['Oil Change', 'Tire Service', 'Brake Repair'],
    priceRange: 'BD 15-50'
  },
  {
    id: '2',
    name: 'Manama Car Care',
    rating: 4.2,
    distance: 3.1,
    services: ['Full Service', 'AC Repair', 'Engine Diagnostics'],
    priceRange: 'BD 20-80'
  }
];

export default function TransportScreen() {
  const { userData, theme } = useApp();
  const styles = createStyles(theme);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [evMode, setEvMode] = useState(false);
  const isArabic = userData.language === 'ar';

  const getTransportIcon = (type: TransportOption['type']) => {
    const iconProps = { size: 24, color: '#10B981' };
    switch (type) {
      case 'car': return <Car {...iconProps} />;
      case 'bus': return <Bus {...iconProps} />;
      case 'taxi': return <Navigation {...iconProps} />;
      default: return <Car {...iconProps} />;
    }
  };

  const getMaintenanceIcon = (type: MaintenanceItem['type']) => {
    const iconProps = { size: 20, color: '#F59E0B' };
    switch (type) {
      case 'oil': return <Fuel {...iconProps} />;
      case 'tire': return <Car {...iconProps} />;
      case 'brake': return <Wrench {...iconProps} />;
      case 'battery': return <Zap {...iconProps} />;
      default: return <Wrench {...iconProps} />;
    }
  };

  const getStatusColor = (status: MaintenanceItem['status']) => {
    switch (status) {
      case 'due': return '#EF4444';
      case 'upcoming': return '#F59E0B';
      case 'completed': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  const handleBookMaintenance = (garage: Garage) => {
    Alert.alert(
      isArabic ? 'حجز موعد' : 'Book Appointment',
      isArabic ? 
        `هل تريد حجز موعد في ${garage.name}؟` :
        `Would you like to book an appointment at ${garage.name}?`,
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { text: isArabic ? 'حجز' : 'Book', onPress: () => console.log('Booking appointment') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isArabic ? 'النقل والتنقل' : 'Transport & Mobility'}
          </Text>
          <Text style={styles.subtitle}>
            {isArabic ? 'خطط رحلاتك واوفر في التكاليف' : 'Plan your trips and save on costs'}
          </Text>
        </View>

        {/* Trip Planner */}
        <View style={styles.plannerCard}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'مخطط الرحلات' : 'Trip Planner'}
          </Text>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder={isArabic ? 'من' : 'From'}
              placeholderTextColor="#9CA3AF"
              value={fromLocation}
              onChangeText={setFromLocation}
            />
          </View>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder={isArabic ? 'إلى' : 'To'}
              placeholderTextColor="#9CA3AF"
              value={toLocation}
              onChangeText={setToLocation}
            />
          </View>
        </View>

        {/* Transport Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'خيارات النقل' : 'Transport Options'}
          </Text>
          {mockTransportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.transportCard,
                selectedTransport === option.id && styles.selectedTransportCard
              ]}
              onPress={() => setSelectedTransport(option.id)}
            >
              <View style={styles.transportHeader}>
                <View style={styles.transportInfo}>
                  {getTransportIcon(option.type)}
                  <Text style={styles.transportName}>{option.name}</Text>
                </View>
                <Text style={styles.transportCost}>BD {option.cost}</Text>
              </View>
              <Text style={styles.transportDescription}>{option.description}</Text>
              <View style={styles.transportStats}>
                <View style={styles.statItem}>
                  <Clock size={16} color="#9CA3AF" />
                  <Text style={styles.statText}>{option.duration} min</Text>
                </View>
                <View style={styles.statItem}>
                  <Fuel size={16} color="#9CA3AF" />
                  <Text style={styles.statText}>{option.co2} kg CO₂</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* EV Mode Toggle */}
        <View style={styles.evModeCard}>
          <View style={styles.evModeHeader}>
            <View style={styles.evModeInfo}>
              <Zap size={24} color="#10B981" />
              <Text style={styles.evModeTitle}>
                {isArabic ? 'وضع السيارة الكهربائية' : 'EV Mode'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.toggleButton, evMode && styles.toggleButtonActive]}
              onPress={() => setEvMode(!evMode)}
            >
              <Text style={[styles.toggleText, evMode && styles.toggleTextActive]}>
                {evMode ? (isArabic ? 'مفعل' : 'ON') : (isArabic ? 'معطل' : 'OFF')}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.evModeDescription}>
            {isArabic ? 
              'تتبع تكاليف الشحن مقابل دعم البنزين' :
              'Track charging costs vs petrol subsidy'
            }
          </Text>
          {evMode && (
            <View style={styles.evStats}>
              <View style={styles.evStatItem}>
                <Text style={styles.evStatLabel}>
                  {isArabic ? 'تكلفة الشحن الشهرية' : 'Monthly Charging Cost'}
                </Text>
                <Text style={styles.evStatValue}>BD 18.50</Text>
              </View>
              <View style={styles.evStatItem}>
                <Text style={styles.evStatLabel}>
                  {isArabic ? 'توفير مقابل البنزين' : 'Savings vs Petrol'}
                </Text>
                <Text style={styles.evStatValue}>BD 45.20</Text>
              </View>
            </View>
          )}
        </View>

        {/* Car Maintenance Tracker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'متتبع صيانة السيارة' : 'Car Maintenance Tracker'}
          </Text>
          {mockMaintenance.map((item) => (
            <View key={item.id} style={styles.maintenanceCard}>
              <View style={styles.maintenanceHeader}>
                <View style={styles.maintenanceInfo}>
                  {getMaintenanceIcon(item.type)}
                  <View style={styles.maintenanceDetails}>
                    <Text style={styles.maintenanceName}>{item.name}</Text>
                    <Text style={styles.maintenanceMileage}>
                      {isArabic ? 'الكيلومترات:' : 'Mileage:'} {item.mileage.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <View style={styles.maintenanceStatus}>
                  {item.status === 'completed' ? (
                    <CheckCircle size={20} color={getStatusColor(item.status)} />
                  ) : (
                    <AlertTriangle size={20} color={getStatusColor(item.status)} />
                  )}
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {isArabic ? 
                      (item.status === 'due' ? 'مستحق' : item.status === 'upcoming' ? 'قريباً' : 'مكتمل') :
                      (item.status === 'due' ? 'Due' : item.status === 'upcoming' ? 'Upcoming' : 'Completed')
                    }
                  </Text>
                </View>
              </View>
              <View style={styles.maintenanceFooter}>
                <View style={styles.maintenanceDate}>
                  <Calendar size={16} color="#9CA3AF" />
                  <Text style={styles.dateText}>
                    {isArabic ? 'التاريخ:' : 'Date:'} {item.dueDate}
                  </Text>
                </View>
                {item.estimatedCost > 0 && (
                  <Text style={styles.costText}>
                    {isArabic ? 'التكلفة المقدرة:' : 'Est. Cost:'} BD {item.estimatedCost}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Nearby Garages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isArabic ? 'ورش قريبة' : 'Nearby Garages'}
          </Text>
          {mockGarages.map((garage) => (
            <View key={garage.id} style={styles.garageCard}>
              <View style={styles.garageHeader}>
                <View style={styles.garageInfo}>
                  <Text style={styles.garageName}>{garage.name}</Text>
                  <View style={styles.garageRating}>
                    <Text style={styles.ratingText}>⭐ {garage.rating}</Text>
                    <Text style={styles.distanceText}>
                      {garage.distance} km {isArabic ? 'بعيد' : 'away'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBookMaintenance(garage)}
                >
                  <Text style={styles.bookButtonText}>
                    {isArabic ? 'حجز' : 'Book'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.garageServices}>
                {isArabic ? 'الخدمات:' : 'Services:'} {garage.services.join(', ')}
              </Text>
              <Text style={styles.garagePriceRange}>
                {isArabic ? 'نطاق الأسعار:' : 'Price Range:'} {garage.priceRange}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  plannerCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    marginLeft: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  transportCard: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTransportCard: {
    borderColor: '#10B981',
  },
  transportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginLeft: 12,
  },
  transportCost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  transportDescription: {
    fontSize: 14,
    color: theme.textTertiary,
    marginBottom: 12,
  },
  transportStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: theme.textTertiary,
    marginLeft: 4,
  },
  evModeCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  evModeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  evModeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  evModeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginLeft: 12,
  },
  toggleButton: {
    backgroundColor: theme.cardSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleButtonActive: {
    backgroundColor: '#10B981',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textTertiary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  evModeDescription: {
    fontSize: 14,
    color: theme.textTertiary,
    marginBottom: 16,
  },
  evStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  evStatItem: {
    alignItems: 'center',
  },
  evStatLabel: {
    fontSize: 12,
    color: theme.textTertiary,
    marginBottom: 4,
  },
  evStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  maintenanceCard: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  maintenanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  maintenanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  maintenanceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  maintenanceName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  maintenanceMileage: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  maintenanceStatus: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  maintenanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  maintenanceDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: theme.textTertiary,
    marginLeft: 8,
  },
  costText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  garageCard: {
    backgroundColor: theme.cardSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  garageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  garageInfo: {
    flex: 1,
  },
  garageName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  garageRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#F59E0B',
  },
  distanceText: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  bookButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  garageServices: {
    fontSize: 14,
    color: theme.textTertiary,
    marginBottom: 4,
  },
  garagePriceRange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});