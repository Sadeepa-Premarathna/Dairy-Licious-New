import React from 'react';

interface ExpenseCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  description: string;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  title,
  amount,
  icon,
  description
}) => {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-blue-950">{icon}</span>
        </div>
        <span className="text-xs text-gray-500">This Month</span>
      </div>
      
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-lg font-bold text-blue-950 mb-2">{formatAmount(amount)}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
};

export default ExpenseCard;