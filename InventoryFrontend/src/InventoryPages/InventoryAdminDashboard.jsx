import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dairyLogo from '../assets/dairy-licious-logo.svg';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const managementCards = [
    {
      title: 'Inventory Dashboard',
      icon: '📊',
      description: 'Manage stock levels and inventory tracking',
      path: '/app/dashboard',
      color: 'from-blue-400 to-indigo-500',
      hoverColor: 'hover:from-blue-500 hover:to-indigo-600'
    },
    {
      title: 'Finance',
      icon: '💰',
      description: 'Financial reports and budget management',
      path: '/app/finance',
      color: 'from-emerald-400 to-teal-500',
      hoverColor: 'hover:from-emerald-500 hover:to-teal-600'
    },
    {
      title: 'HR Management',
      icon: '👥',
      description: 'Employee management and scheduling',
      path: '/app/hr',
      color: 'from-purple-400 to-violet-500',
      hoverColor: 'hover:from-purple-500 hover:to-violet-600'
    },
    {
      title: 'Orders',
      icon: '📦',
      description: 'Order management and processing',
      path: '/app/orders',
      color: 'from-amber-400 to-orange-500',
      hoverColor: 'hover:from-amber-500 hover:to-orange-600'
    },
    {
      title: 'Delivery & Distribution',
      icon: '🚛',
      description: 'Delivery tracking and distribution management',
      path: '/app/delivery',
      color: 'from-cyan-500 to-cyan-600',
      hoverColor: 'hover:from-cyan-600 hover:to-cyan-700'
    },
    {
      title: 'Users',
      icon: '👤',
      description: 'User accounts and access control',
      path: '/app/users',
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
    },
    {
      title: 'Reports',
      icon: '�',
      description: 'Analytics and detailed reporting',
      path: '/app/reports',
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #ffffff 75%, #f8fafc 100%)'
    }}>
      {/* Modern Light Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/60 via-indigo-50/60 to-purple-50/60 animate-wave"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-100/50 rounded-full mix-blend-multiply filter blur-4xl opacity-40 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-45 animate-bounce-slow"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-100/40 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float"></div>
      </div>
      
      {/* Modern Geometric Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-geometric-float ${
              i % 4 === 0 ? 'w-3 h-3 bg-blue-300/20 rounded-full shadow-sm' :
              i % 4 === 1 ? 'w-4 h-1 bg-indigo-300/20 rounded-full shadow-sm' :
              i % 4 === 2 ? 'w-2 h-2 bg-purple-300/20 transform rotate-45 shadow-sm' :
              'w-5 h-5 bg-cyan-200/15 rounded-lg shadow-sm'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${10 + Math.random() * 15}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Enhanced Header with Modern Light Design */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                    <img 
                      src={dairyLogo} 
                      alt="Dairy-licious Logo" 
                      className="w-12 h-12 drop-shadow-lg"
                    />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur opacity-20 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Dairy-licious
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">Admin Management Portal</p>
                </div>
              </div>
              <div className="text-right bg-white/70 backdrop-blur-lg rounded-2xl px-6 py-4 border border-gray-200/60 shadow-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Welcome Section */}
        <div className="flex-1 container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-110 transition-all duration-500">
                  <img 
                    src={dairyLogo} 
                    alt="Dairy-licious Logo" 
                    className="w-24 h-24 drop-shadow-2xl"
                  />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Welcome to Dairy-licious
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Your comprehensive dairy management solution. Choose a module below to get started with managing your dairy operations.
            </p>
          </div>

          {/* Management Cards Grid - Modern Light Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {managementCards.map((card, index) => (
              <Link
                key={index}
                to={card.path}
                className="group relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/60 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-2xl transform hover:-translate-y-2"
              >
                <div className="text-center relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-xl`}>
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>
                
                {/* Modern Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>

          {/* Quick Stats - Modern Light */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="relative group">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/60 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">7</div>
                <div className="text-gray-600 text-sm font-medium">Active Modules</div>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl blur opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
            </div>
            <div className="relative group">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/60 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-gray-600 text-sm font-medium">System Monitoring</div>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
            </div>
            <div className="relative group">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/60 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">99.9%</div>
                <div className="text-gray-600 text-sm font-medium">Uptime</div>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl blur opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
            </div>
            <div className="relative group">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/60 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">Live</div>
                <div className="text-gray-600 text-sm font-medium">Real-time Data</div>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl blur opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200/60 py-8 shadow-lg">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-600 text-lg font-medium">
              © 2025 Dairy-licious Management System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Updated Custom Styles */}
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(-100%) translateY(0%) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(100%) translateY(-20%) rotate(180deg);
            opacity: 0.3;
          }
        }
        
        @keyframes geometric-float {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-40px) translateX(-5px) rotate(180deg);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-20px) translateX(-15px) rotate(270deg);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0px) translateX(0px) rotate(360deg);
            opacity: 0.2;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.35;
          }
          50% {
            transform: translateY(-30px);
            opacity: 0.5;
          }
        }
        
        .animate-wave {
          animation: wave 20s ease-in-out infinite;
        }
        
        .animate-geometric-float {
          animation: geometric-float 12s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) scale(1.05);
            opacity: 0.6;
          }
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
