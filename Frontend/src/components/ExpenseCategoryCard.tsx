import React from 'react';
import { Users, Milk, Plus } from 'lucide-react';

interface ExpenseCategoryCardProps {
  id: string;
  name: string;
  amount: number;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  onClick: () => void;
}

const ExpenseCategoryCard: React.FC<ExpenseCategoryCardProps> = ({
  id,
  name,
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

  const getIcon = () => {
    switch (icon) {
      case 'Users':
        return <Users size={24} className="text-white" />;
      case 'Milk':
        return <Milk size={24} className="text-white" />;
      case 'Plus':
        return <Plus size={24} className="text-white" />;
      default:
        return <Plus size={24} className="text-white" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`${bgColor} p-6 rounded-xl border border-gray-200 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          {getIcon()}
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            This Month
          </span>
        </div>
      </div>
      
      <h3 className="text-base font-semibold text-gray-700 mb-2 group-hover:text-gray-900 transition-colors">
        {name}
      </h3>
      
      <p className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
        {formatCurrency(amount)}
      </p>
      
      <p className="text-xs text-gray-500 leading-relaxed mb-3">
        {description}
      </p>
      
      <div className="flex items-center text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
        <span>View details</span>
        <svg className="ml-1 w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default ExpenseCategoryCard;