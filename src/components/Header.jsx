import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import SupabaseTestButton from './SupabaseTestButton';
import './Header.css';

const Header = ({ title }) => {
    return (
        <header className="header">
            <div className="header-left">
                <h1 className="page-title">{title}</h1>
            </div>
            <div className="header-right">
                <SupabaseTestButton />
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search for shipments, dockets..." />
                </div>
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="notification-badge"></span>
                </button>
                <button className="icon-btn">
                    <Settings size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;
