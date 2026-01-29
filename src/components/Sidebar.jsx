import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Banknote,
  Users,
  Truck,
  UserSquare2,
  Building2,
  MapPin,
  BarChart3,
  BadgePercent,
  History
} from 'lucide-react';
import logo from '../assets/logo.png';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Cash Entry', icon: <Banknote size={20} />, path: '/cash-entry' },
    { name: 'Account Entry', icon: <Users size={20} />, path: '/account-entry' },
    { name: 'Dispatch Entry', icon: <Truck size={20} />, path: '/dispatch-entry' },
    { name: 'Pickup Boys', icon: <UserSquare2 size={20} />, path: '/pickup-boys' },
    { name: 'Parties', icon: <Building2 size={20} />, path: '/parties' },
    { name: 'Services', icon: <MapPin size={20} />, path: '/services' },
    { name: 'Rates', icon: <BadgePercent size={20} />, path: '/rates' },
    { name: 'Reports', icon: <BarChart3 size={20} />, path: '/reports' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Shree Kalpdeep Logo" className="sidebar-logo-img" />
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
