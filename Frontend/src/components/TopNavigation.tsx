import React from 'react';
import { Bell, User } from 'lucide-react';

interface TopNavigationProps {
  managerName: string;
  notificationCount: number;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ managerName, notificationCount }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {getGreeting()} {managerName}, welcome back
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="h-6 w-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">{managerName}</p>
            <p className="text-gray-600">HR Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;