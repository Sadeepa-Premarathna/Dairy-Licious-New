import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EMP_Dash_Header from './components/EMP_Dash_Header';
import EMP_Dash_Sidebar from './components/EMP_Dash_Sidebar';
import EMP_Dash_Board from './components/EMP_Dash_Board';
import Attendance from './components/Attendance';
import Leaves from './components/Leaves';
import { EmployeeProvider } from './context/EMP_Dash_Context';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <EmployeeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <EMP_Dash_Header 
            onToggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
          
          <div className="flex">
            <EMP_Dash_Sidebar 
              isOpen={sidebarOpen}
              isMobile={isMobile}
              onClose={() => setSidebarOpen(false)}
            />
            
            <main className={`flex-1 transition-all duration-300 ease-in-out ${
              sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
            } pt-16`}>
              <div className="p-6">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<EMP_Dash_Board />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/leaves" element={<Leaves />} />
                </Routes>
              </div>
            </main>
          </div>

          {/* Mobile overlay */}
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </Router>
    </EmployeeProvider>
  );
}

export default App;