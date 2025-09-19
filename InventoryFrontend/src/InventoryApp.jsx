import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout_Fixed.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Inventory from './pages/Inventory.jsx';
import RawMaterials from './pages/RawMaterials.jsx';
import Finance from './pages/Finance.jsx';
import HR from './pages/HR.jsx';
import Users from './pages/Users.jsx';
import Reports from './pages/Reports.jsx';

export default function App() {
  return (
    <Routes>
      {/* Standalone Admin Dashboard - No Sidebar */}
      <Route path="/" element={<AdminDashboard />} />
      
      {/* Main Application with Sidebar */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="raw-materials" element={<RawMaterials />} />
        <Route path="products" element={<Products />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="finance" element={<Finance />} />
        <Route path="hr" element={<HR />} />
        <Route path="users" element={<Users />} />
        <Route path="reports" element={<Reports />} />
        <Route path="orders" element={<Reports />} />
        <Route path="delivery" element={<Reports />} />
      </Route>
    </Routes>
  );
}
