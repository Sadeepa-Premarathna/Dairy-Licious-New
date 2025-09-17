import React from 'react';
import { Users, Building, UserCheck, UserX } from 'lucide-react';

interface EmployeeInsightsProps {
  insights: {
    activeEmployees: number;
    departments: number;
    onLeave: number;
    newHiresThisWeek: number;
  };
}

const EmployeeInsights: React.FC<EmployeeInsightsProps> = ({ insights }) => {
  const insightItems = [
    {
      title: 'Active Employees',
      value: insights.activeEmployees,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Departments',
      value: insights.departments,
      icon: Building,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: 'On Leave Today',
      value: insights.onLeave,
      icon: UserX,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      title: 'New Hires (Week)',
      value: insights.newHiresThisWeek,
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Insights</h3>
      <div className="space-y-4">
        {insightItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${item.bg}`}>
                  <IconComponent className={`h-4 w-4 ${item.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.title}</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeInsights;