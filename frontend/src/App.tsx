import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import MilkRecordList from './components/MilkRecordList';
import RawMilkRecords from './components/RawMilkRecords';
import MilkRecordForm from './components/MilkRecordForm';
import MilkRecordDetail from './components/MilkRecordDetail';
import Dashboard from './components/Dashboard';
import DriversList from './components/DriversList';
import OrdersList from './components/OrdersList';
import TrackingList from './components/TrackingList';
import ExpensesManagement from './components/ExpensesManagement';

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

    const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/' },
    { icon: '🥛', label: 'Raw Milk', path: '/rawmilk' },
    { icon: '🚚', label: 'Drivers', path: '/drivers' },
    { icon: '📋', label: 'Orders', path: '/orders' },
    { icon: '📍', label: 'Tracking', path: '/tracking' },
    { icon: '💰', label: 'Expenses', path: '/expenses' }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="App">
      <div className="app-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">🥛</span>
              {!sidebarCollapsed && <span className="logo-text">Milk System</span>}
            </div>
            <button 
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
          
          <nav className="sidebar-nav">
            <ul className="nav-menu">
              {menuItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-footer">
            {!sidebarCollapsed && (
              <div className="user-info">
                <div className="user-avatar">👤</div>
                <div className="user-details">
                  <span className="user-name">Admin User</span>
                  <span className="user-role">System Manager</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="main-wrapper">
          <header className="top-header">
            <div className="header-content">
              <div className="header-left">
                <button 
                  className="mobile-menu-toggle"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle mobile menu"
                >
                  ☰
                </button>
                <div className="header-title">
                  <h1>Milk Collection & Distribution System</h1>
                  <p className="header-subtitle">Efficiently managing dairy operations</p>
                </div>
              </div>
              <div className="header-actions">
                <div className="search-box">
                  <input type="text" placeholder="Search..." />
                  <span className="search-icon">🔍</span>
                </div>
                <button className="notification-btn">🔔</button>
              </div>
            </div>
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<MilkRecordList />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/raw-milk" element={<RawMilkRecords />} />
              <Route path="/drivers" element={<DriversList />} />
              <Route path="/orders" element={<OrdersList />} />
              <Route path="/tracking" element={<TrackingList />} />
              <Route path="/expenses" element={<ExpensesManagement />} />
              <Route path="/create" element={<MilkRecordForm />} />
              <Route path="/edit/:id" element={<MilkRecordForm />} />
              <Route path="/record/:id" element={<MilkRecordDetail />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
