import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PayrollDashboard from './components/PayrollDashboard';
import RevenueExpenseTracker from './components/RevenueExpenseTracker';
import AdditionalExpenses from './components/AdditionalExpenses';
import ReportGeneration from './components/ReportGeneration';

function App() {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const financeManagerName = 'Sarah Johnson'; // This would come from authentication context

  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
    // In a real app, this would handle routing to different pages
    console.log(`Navigating to: ${itemId}`);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar 
        activeItem={activeNavItem} 
        onItemClick={handleNavItemClick}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      
      <Header 
        userName={financeManagerName} 
        onToggleSidebar={toggleSidebar}
      />
      
      <main>
        {activeNavItem === 'dashboard' && <Dashboard />}
        {activeNavItem === 'calculate-salary' && <PayrollDashboard />}
        {activeNavItem === 'revenue-expenses' && <RevenueExpenseTracker />}
        {activeNavItem === 'additional-expenses' && <AdditionalExpenses />}
        {activeNavItem === 'report-generation' && <ReportGeneration />}
        {!['dashboard', 'calculate-salary', 'revenue-expenses', 'additional-expenses', 'report-generation'].includes(activeNavItem) && (
          <div className="p-6">
            <div className="bg-white rounded-xl p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {activeNavItem.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Module
              </h2>
              <p className="text-gray-600">
                This module will be implemented as part of the complete MERN stack application.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;