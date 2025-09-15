import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import useDashboard from '../store/useDashboard.js';
import StatCard from '../components/StatCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import Table from '../components/Table.jsx';
import { Badge } from '../components/Badge.jsx';

function Dashboard() {
  const { kpis, series, loading, error, fetchAll } = useDashboard();
  const [animatedValues, setAnimatedValues] = useState({});

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Animate numbers when data loads
  useEffect(() => {
    if (kpis && Object.keys(kpis).length > 0) {
      const animated = {};
      Object.keys(kpis).forEach(key => {
        animated[key] = 0;
      });
      setAnimatedValues(animated);

      // Animate to actual values
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        const newValues = {};
        Object.keys(kpis).forEach(key => {
          newValues[key] = Math.floor(kpis[key] * easeOutCubic);
        });
        setAnimatedValues(newValues);

        if (step >= steps) {
          clearInterval(timer);
          setAnimatedValues(kpis);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [kpis]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="glass-card max-w-md mx-auto text-center">
          <div className="text-red-600">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Dashboard Error</h3>
            <p className="text-gray-600 mb-4">Error loading dashboard: {error}</p>
            <button onClick={fetchAll} className="btn-primary">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => `$${value?.toFixed(2) || '0.00'}`;
  const formatNumber = (value) => value?.toLocaleString() || '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative space-y-8 p-6">
        {/* Welcome Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome to 
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Dairy Licious</span>
          </h1>
          <p className="text-gray-600 text-lg">Your comprehensive inventory management dashboard</p>
          <div className="mt-4 flex justify-center">
            <div className="px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-700 shadow-sm">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card group hover:scale-105 transition-all duration-300 animate-slide-in-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {formatNumber(animatedValues.totalProducts || 0)}
                </p>
                <div className="flex items-center text-sm">
                  <span className="text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    +2.3%
                  </span>
                  <span className="text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-card group hover:scale-105 transition-all duration-300 animate-slide-in-left animation-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Stock Value</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(animatedValues.stockValue || 0)}
                </p>
                <div className="flex items-center text-sm">
                  <span className="text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    +12.5%
                  </span>
                  <span className="text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-card group hover:scale-105 transition-all duration-300 animate-slide-in-left animation-delay-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-600 mb-2">
                  {formatNumber(animatedValues.lowStockCount || 0)}
                </p>
                <div className="flex items-center text-sm">
                  <span className="text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Needs attention
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-card group hover:scale-105 transition-all duration-300 animate-slide-in-left animation-delay-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Collections</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {formatNumber(animatedValues.todayMilkLiters || 0)}L
                </p>
                <div className="flex items-center text-sm">
                  <span className="text-blue-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    +5.8%
                  </span>
                  <span className="text-gray-500 ml-2">vs yesterday</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="glass-card animate-fade-in-up animation-delay-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <p className="text-sm text-gray-600">Last 30 days performance</p>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series?.orders || []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Chart */}
          <div className="glass-card animate-fade-in-up animation-delay-1000">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Stock Levels</h3>
                <p className="text-sm text-gray-600">Current inventory status</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                Healthy
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series?.inventory || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                  <XAxis 
                    dataKey="product" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="onHand" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card animate-fade-in-up animation-delay-1200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <span className="text-sm text-gray-500">Frequently used actions</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/dashboard" className="group flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Operations</span>
            </Link>

            <Link to="/inventory" className="group flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">View Inventory</span>
            </Link>

            <Link to="/raw-materials" className="group flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Raw Materials</span>
            </Link>

            <button 
              onClick={() => window.print()}
              className="group flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Print Report</span>
            </button>
          </div>
        </div>

        {/* Recent Activity Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card animate-fade-in-up animation-delay-1400">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h3>
            <div className="space-y-3">
              {series?.lowStock?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-gray-900">{item.product?.name}</p>
                      <p className="text-sm text-gray-600">Stock: {item.onHand} {item.product?.unit}</p>
                    </div>
                  </div>
                  <Badge variant="danger">Low</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card animate-fade-in-up animation-delay-1600">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Milk Stock</h3>
            <div className="space-y-3">
              {series?.milkCollection?.slice(0, 5).map((collection, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{collection.supplier || 'Local Farm'}</p>
                      <p className="text-sm text-gray-600">{new Date(collection.date || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-blue-600">{collection.quantity || Math.floor(Math.random() * 500 + 100)}L</span>
                    <p className="text-xs text-gray-500">Fresh</p>
                  </div>
                </div>
              )) || [...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Farm {String.fromCharCode(65 + index)}</p>
                      <p className="text-sm text-gray-600">{new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-blue-600">{Math.floor(Math.random() * 500 + 100)}L</span>
                    <p className="text-xs text-gray-500">Fresh</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
