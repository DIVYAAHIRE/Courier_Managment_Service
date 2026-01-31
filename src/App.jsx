import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './screens/Dashboard';
import CashEntry from './screens/CashEntry';
import AccountEntry from './screens/AccountEntry';
import DispatchEntry from './screens/DispatchEntry';
import Login from './screens/Login';
import PickupBoys from './screens/PickupBoys';
import Parties from './screens/Parties';
import Services from './screens/Services';
import Rates from './screens/Rates';
import PlaceholderScreen from './screens/Placeholder';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Map paths to page titles
  const pageTitles = {
    '/': 'Dashboard Overview',
    '/cash-entry': 'Cash Shipment Entry',
    '/account-entry': 'Account Shipment Entry',
    '/dispatch-entry': 'Dispatch Management',
    '/pickup-boys': 'Pickup Executive Management',
    '/parties': 'Registered Parties & Clients',
    '/services': 'Available Services',
    '/rates': 'Rate Management',
    '/reports': 'Operational Reports',
  };

  const currentTitle = pageTitles[location.pathname] || 'Courier Management System';

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title={currentTitle} />
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cash-entry" element={<CashEntry />} />
            <Route path="/account-entry" element={<AccountEntry />} />
            <Route path="/dispatch-entry" element={<DispatchEntry />} />
            <Route path="/pickup-boys" element={<PickupBoys />} />
            <Route path="/parties" element={<Parties />} />
            <Route path="/services" element={<Services />} />
            <Route path="/rates" element={<Rates />} />
            <Route path="/reports" element={<PlaceholderScreen name="Reports" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
