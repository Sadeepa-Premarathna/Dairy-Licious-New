import React from 'react';
import { BarChart3, Plus, Calculator, TrendingUp, FileText, X } from 'lucide-react';
import { NavigationItem } from '../types';

interface SidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick, isOpen, onClose }) => {
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Finance Dashboard',
      path: '/finance/dashboard'
    },
    {
      id: 'additional-expenses',
      label: 'Additional Expenses',
      path: '/finance/additional-expenses'
    },
    {
      id: 'calculate-salary',
      label: 'Calculate Salary',
      path: '/finance/calculate-salary'
    },
    {
      id: 'revenue-expenses',
      label: 'Revenue & Expenses',
      path: '/finance/revenue-expenses'
    },
    {
      id: 'report-generation',
      label: 'Report Generation',
      path: '/finance/reports'
    }
  ];

  const getIcon = (itemId: string) => {
    switch (itemId) {
      case 'dashboard':
        return <BarChart3 size={20} />;
      case 'additional-expenses':
        return <Plus size={20} />;
      case 'calculate-salary':
        return <Calculator size={20} />;
      case 'revenue-expenses':
        return <TrendingUp size={20} />;
      case 'report-generation':
        return <FileText size={20} />;
      default:
        return <BarChart3 size={20} />;
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`bg-blue-950 text-white h-screen w-64 fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Close button for mobile */}
        <div className="flex justify-end p-4 lg:hidden">
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
      <div className="p-6 border-b border-blue-800">
        <h2 className="text-xl font-bold text-yellow-400">Finance Portal</h2>
        <p className="text-blue-200 text-sm mt-1">Dairy Manufacturing</p>
      </div>
      
      <nav className="mt-6">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-all duration-200 hover:bg-blue-800 ${
              activeItem === item.id 
                ? 'bg-yellow-400 text-blue-950 font-medium' 
                : 'text-blue-100 hover:text-white'
            }`}
          >
            <span className={activeItem === item.id ? 'text-blue-950' : ''}>
              {getIcon(item.id)}
            </span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
    </>
  );
};

export default Sidebar;