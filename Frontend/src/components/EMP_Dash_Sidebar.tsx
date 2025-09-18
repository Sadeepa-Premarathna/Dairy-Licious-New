import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Clock, Calendar, X } from 'lucide-react';

interface EMP_Dash_SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const EMP_Dash_Sidebar: React.FC<EMP_Dash_SidebarProps> = ({ isOpen, isMobile, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      name: 'Mark Attendance',
      icon: Clock,
      path: '/attendance'
    },
    {
      name: 'Apply for Leave',
      icon: Calendar,
      path: '/leaves'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-blue-900 text-white
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'shadow-lg' : ''}
      `}>
        {/* Mobile close button */}
        {isMobile && (
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Logo/Brand */}
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-xl font-bold text-yellow-400">Dairy Factory</h2>
          <p className="text-sm text-blue-200">Employee Portal</p>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={isMobile ? onClose : undefined}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive(item.path)
                        ? 'bg-yellow-400 text-blue-900 font-medium shadow-lg'
                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="text-xs text-blue-300 text-center">
            <p>© 2025 Dairy Factory</p>
            <p>Employee Dashboard v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default EMP_Dash_Sidebar;