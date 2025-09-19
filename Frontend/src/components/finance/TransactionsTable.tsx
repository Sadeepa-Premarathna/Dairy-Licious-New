import React from 'react';
import { Transaction } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Last Transactions (Recent)
        </h3>
        <p className="text-sm text-gray-500">
          Recent bulk orders from the sales system
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-semibold text-gray-700 text-sm">
                Company
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700 text-sm">
                Client
              </th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700 text-sm">
                Amount
              </th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700 text-sm">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr 
                key={transaction.id} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-2">
                  <span className="font-medium text-gray-800 text-sm">
                    {transaction.company}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className="text-gray-600 text-sm">
                    {transaction.client}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="font-semibold text-green-600 text-sm">
                    {formatAmount(transaction.amount)}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-gray-500 text-sm">
                    {formatDate(transaction.date)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-blue-950 text-sm font-medium hover:text-blue-800 transition-colors">
          View All Transactions
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;