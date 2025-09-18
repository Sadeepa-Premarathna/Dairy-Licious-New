import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import dairyLogo from '../assets/dairy-licious-logo.svg';

const navItems = [
  { 
    path: '/', 
    label: 'Dashboard', 
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
      </svg>
    ),
    badge: null,
    gradient: 'from-blue-500 to-cyan-400'
  },
  { 
    path: '/products', 
    label: 'Products', 
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    badge: null,
    gradient: 'from-purple-500 to-pink-400'
  },
  { 
    path: '/inventory', 
    label: 'Inventory', 
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2z"/>
      </svg>
    ),
    badge: 'Low Stock',
    gradient: 'from-orange-500 to-yellow-400'
  },
  { 
    path: '/orders', 
    label: 'Orders', 
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
      </svg>
    ),
    badge: 'New',
    gradient: 'from-red-500 to-pink-400'
  },
  { 
    path: '/raw-materials', 
    label: 'Raw Materials', 
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    ),
    badge: null,
    gradient: 'from-green-500 to-emerald-400'
  },
];

export default function AppLayout() {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Modern Animated Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl transition-all duration-500 ease-in-out z-50 ${
        isSidebarOpen 
          ? isMobile ? 'w-80 translate-x-0' : 'w-72 translate-x-0' 
          : isMobile ? 'w-80 -translate-x-full' : 'w-16 translate-x-0'
      }`}>
        
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-32 right-6 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-64 left-8 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-32 right-4 w-2 h-2 bg-indigo-400/20 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Header with Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className={`flex items-center transition-all duration-500 ${!isSidebarOpen && !isMobile ? 'justify-center w-full' : 'justify-start'}`}>
                <div className="relative group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 group-hover:shadow-xl animate-logo-glow">
                    <img 
                      src={dairyLogo} 
                      alt="Dairy Licious" 
                      className="w-7 h-7 object-contain filter brightness-0 invert"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-sm" />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md scale-110" />
                </div>
                
                {(isSidebarOpen || isMobile) && (
                  <div className="ml-4 animate-fade-in-right">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-text">
                      Dairy Licious
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Inventory Management</p>
                  </div>
                )}
              </div>
              
              {/* Toggle Button - Only show when not in collapsed state */}
              {(isSidebarOpen || isMobile) && (
                <button
                  onClick={toggleSidebar}
                  className="p-2.5 rounded-xl bg-white/50 hover:bg-white/70 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl border border-white/20"
                >
                  <svg 
                    className="w-5 h-5 text-gray-600 transition-transform duration-300" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                  </svg>
                </button>
              )}
              
              {/* Expand Button for Collapsed State */}
              {!isSidebarOpen && !isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`group relative flex items-center transition-all duration-300 transform hover:scale-105 sidebar-item-hover ${
                    !isSidebarOpen && !isMobile 
                      ? 'px-2 py-3 rounded-xl justify-center'
                      : 'px-4 py-4 rounded-2xl'
                  } ${
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl shadow-${item.gradient.split('-')[1]}-500/25` 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:shadow-lg'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className={`absolute top-1/2 transform -translate-y-1/2 w-1 rounded-full animate-fade-in-left ${
                      !isSidebarOpen && !isMobile 
                        ? '-left-1 h-6' 
                        : '-left-1 h-8'
                    } bg-white`} />
                  )}
                  
                  {/* Icon Container */}
                  <div className={`relative flex items-center justify-center transition-all duration-300 ${
                    !isSidebarOpen && !isMobile ? 'mx-auto' : 'mr-4'
                  }`}>
                    <div className={`p-1 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 shadow-lg' 
                        : hoveredItem === index ? 'bg-gray-100 scale-110' : ''
                    }`}>
                      {item.icon}
                    </div>
                    
                    {/* Tooltip for Collapsed State */}
                    {!isSidebarOpen && !isMobile && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50 shadow-xl">
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                      </div>
                    )}
                  </div>

                  {/* Label and Badge */}
                  {(isSidebarOpen || isMobile) && (
                    <div className="flex-1 flex items-center justify-between animate-fade-in-right">
                      <span className={`font-semibold transition-all duration-300 ${
                        isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {item.label}
                      </span>
                      
                      {item.badge && (
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-red-100 text-red-600 group-hover:bg-red-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Hover Effect */}
                  {hoveredItem === index && !isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            {(isSidebarOpen || isMobile) ? (
              <div className="flex items-center space-x-3 animate-fade-in-up">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">System Manager</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-white/50 transition-colors duration-200 group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                  
                  {/* Tooltip for Collapsed State */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50 shadow-xl">
                    Admin User
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Top Bar for Mobile/Additional Actions */}
      <header className={`fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm z-30 transition-all duration-500 ${
        isSidebarOpen && !isMobile ? 'left-72' : !isSidebarOpen && !isMobile ? 'left-16' : 'left-0'
      }`}>
        <div className="h-full flex items-center justify-between px-6">
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
          )}

          {/* Page Title */}
          <div className="flex-1 flex items-center justify-center lg:justify-start lg:ml-6">
            <h2 className="text-xl font-bold text-gray-900 capitalize">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden sm:block relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              />
              <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-200 transform hover:scale-105">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* Settings */}
            <button className="p-2.5 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-200 transform hover:scale-105">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`transition-all duration-500 pt-16 ${
        isSidebarOpen && !isMobile ? 'ml-72' : !isSidebarOpen && !isMobile ? 'ml-16' : 'ml-0'
      }`}>
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
