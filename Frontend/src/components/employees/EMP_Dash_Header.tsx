import React from 'react';
import { Bell, Menu, User } from 'lucide-react';
import { useEmployee } from '../context/EMP_Dash_Context';

interface EMP_Dash_HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const EMP_Dash_Header: React.FC<EMP_Dash_HeaderProps> = ({ onToggleSidebar }) => {
  const { employee } = useEmployee();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Menu toggle and greeting */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-800">
              Welcome, {employee?.name || 'Employee'}
            </h1>
          </div>
        </div>

        {/* Right side - Notifications and profile */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">3</span>
            </span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{employee?.name}</p>
              <p className="text-xs text-gray-500">{employee?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EMP_Dash_Header;