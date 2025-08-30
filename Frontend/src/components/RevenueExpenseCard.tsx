import React from 'react';

interface RevenueExpenseCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  onClick: () => void;
}

const RevenueExpenseCard: React.FC<RevenueExpenseCardProps> = ({
  title,
  amount,
  icon,
  color,
  bgColor,
  description,
  onClick
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div
      onClick={onClick}
      className={`${bgColor} p-8 rounded-xl border border-gray-200 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            Current Month
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-700 mb-3 group-hover:text-gray-900 transition-colors">
        {title}
      </h3>
      
      <p className="text-4xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
        {formatCurrency(amount)}
      </p>
      
      <p className="text-sm text-gray-500 leading-relaxed">
        {description}
      </p>
      
      <div className="mt-6 flex items-center text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
        <span>Click to view details</span>
        <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default RevenueExpenseCard;