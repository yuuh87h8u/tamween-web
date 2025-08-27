import React from 'react';
import { Receipt, Zap, Droplets, Wifi, Phone, Building, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../hooks/useAppStore';

export default function Bills() {
  const { userData, theme } = useApp();
  const isArabic = userData.language === 'ar';

  const bills = [
    {
      id: '1',
      type: 'electricity',
      provider: 'EWA',
      amount: 45.5,
      dueDate: '2024-01-15',
      status: 'pending',
      accountNumber: '123456789'
    },
    {
      id: '2',
      type: 'water',
      provider: 'EWA',
      amount: 12.3,
      dueDate: '2024-01-15',
      status: 'paid',
      accountNumber: '123456789'
    },
    {
      id: '3',
      type: 'internet',
      provider: 'Batelco',
      amount: 25.0,
      dueDate: '2024-01-20',
      status: 'pending',
      accountNumber: '987654321'
    }
  ];

  const getBillIcon = (type: string) => {
    const iconProps = { size: 24, color: '#10B981' };
    switch (type) {
      case 'electricity': return <Zap {...iconProps} />;
      case 'water': return <Droplets {...iconProps} />;
      case 'internet': return <Wifi {...iconProps} />;
      case 'phone': return <Phone {...iconProps} />;
      case 'municipality': return <Building {...iconProps} />;
      default: return <Receipt {...iconProps} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'overdue': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const totalPending = bills
    .filter(bill => bill.status === 'pending')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
          {isArabic ? 'مركز الفواتير الموحد' : 'Unified Bills Hub'}
        </h1>
        <p style={{ color: theme.textSecondary }}>
          {isArabic ? 'إدارة جميع فواتيرك في مكان واحد' : 'Manage all your bills in one place'}
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-6 rounded-2xl mb-8" style={{ backgroundColor: theme.card }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            {isArabic ? 'ملخص الفواتير' : 'Bills Summary'}
          </h2>
          <Receipt size={24} color="#10B981" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>BD {totalPending.toFixed(2)}</p>
            <p className="text-sm" style={{ color: theme.textTertiary }}>
              {isArabic ? 'إجمالي المعلق' : 'Total Pending'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
              {bills.filter(b => b.status === 'pending').length}
            </p>
            <p className="text-sm" style={{ color: theme.textTertiary }}>
              {isArabic ? 'فواتير معلقة' : 'Pending Bills'}
            </p>
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
          {isArabic ? 'فواتيرك' : 'Your Bills'}
        </h2>
        <div className="space-y-4">
          {bills.map((bill) => (
            <div key={bill.id} className="p-4 rounded-xl" style={{ backgroundColor: theme.cardSecondary }}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {getBillIcon(bill.type)}
                  <div>
                    <h3 className="font-semibold" style={{ color: theme.text }}>{bill.provider}</h3>
                    <p className="text-sm" style={{ color: theme.textTertiary }}>
                      {isArabic ? 'رقم الحساب:' : 'Account:'} {bill.accountNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: theme.text }}>BD {bill.amount}</p>
                  <div 
                    className="px-2 py-1 rounded-lg text-xs font-medium"
                    style={{ 
                      backgroundColor: getStatusColor(bill.status) + '20',
                      color: getStatusColor(bill.status)
                    }}
                  >
                    {bill.status === 'paid' ? (isArabic ? 'مدفوع' : 'Paid') : 
                     bill.status === 'pending' ? (isArabic ? 'معلق' : 'Pending') : 
                     (isArabic ? 'متأخر' : 'Overdue')}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar size={16} color="#9CA3AF" />
                  <span className="text-sm" style={{ color: theme.textTertiary }}>
                    {isArabic ? 'الاستحقاق:' : 'Due:'} {bill.dueDate}
                  </span>
                </div>
                {bill.status === 'pending' && (
                  <button className="px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#10B981' }}>
                    {isArabic ? 'دفع' : 'Pay'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}