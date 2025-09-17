import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  DollarSign, 
  FileText,
  ClipboardList,
  Milk
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const navigationItems = [
    { id: 'dashboard', name: 'HR Dashboard', icon: LayoutDashboard },
    { id: 'employees', name: 'Employees', icon: Users },
    { id: 'attendance', name: 'Attendance', icon: Clock },
    { id: 'payroll', name: 'Payroll', icon: DollarSign },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'leaves', name: 'Leaves', icon: ClipboardList },
  ];

  return (
    <div className="bg-blue-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center space-x-3">
          <Milk className="h-8 w-8 text-yellow-400" />
          <div>
            <h1 className="text-xl font-bold">DairyLicious</h1>
            <p className="text-blue-200 text-sm">HR Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 pt-6">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-800 text-yellow-400 border-r-4 border-yellow-400' 
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <IconComponent className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-blue-800">
        <p className="text-blue-200 text-xs">Version 2.1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;