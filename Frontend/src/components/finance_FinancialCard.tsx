import React from 'react';

interface FinancialCardProps {
  title: string;
  amount: number;
  change?: number;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

const FinancialCard: React.FC<FinancialCardProps> = ({
  title,
  amount,
  change,
  changeType,
  icon,
  color
}) => {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-950';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'green':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'red':
        return 'bg-red-50 border-red-200 text-red-900';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-950';
    }
  };

  const getIconBgColor = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-950 text-white';
      case 'yellow':
        return 'bg-yellow-400 text-blue-950';
      case 'green':
        return 'bg-green-600 text-white';
      case 'red':
        return 'bg-red-600 text-white';
      default:
        return 'bg-blue-950 text-white';
    }
  };

  return (
    <div className={`p-6 rounded-xl border ${getColorClasses()} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${getIconBgColor()} flex items-center justify-center`}>
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'positive' ? '+' : ''}{change}%
          </span>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{formatAmount(amount)}</p>
    </div>
  );
};

export default FinancialCard;