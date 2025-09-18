import React from 'react';
import { Bell, User, Menu } from 'lucide-react';

interface HeaderProps {
  userName: string;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onToggleSidebar }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 hover:text-blue-950 transition-colors rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <div>
          <h1 className="text-lg font-semibold text-gray-800">
            {getGreeting()} {userName}, welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's your financial overview for today
          </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-blue-950 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs rounded-full h-5 w-5 flex items-center justify-center text-blue-950 font-semibold">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-950 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{userName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;