import React from 'react';
import './BottomNavigation.css';

const BottomNavigation = ({ activeItem = 'home', onNavigate }) => {
  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {/* Home/Menu Button */}
        <button 
          className={`nav-item ${activeItem === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate?.('home')}
          aria-label="Home"
        >
          <svg className="nav-icon" viewBox="0 0 24 24">
            <rect x="4" y="6" width="16" height="2.5" fill="currentColor" rx="1.25"/>
            <rect x="4" y="11" width="16" height="2.5" fill="currentColor" rx="1.25"/>
            <rect x="4" y="16" width="16" height="2.5" fill="currentColor" rx="1.25"/>
          </svg>
        </button>
        
        {/* Map Button */}
        <button 
          className={`nav-item ${activeItem === 'map' ? 'active' : ''}`}
          onClick={() => onNavigate?.('map')}
          aria-label="Map"
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3L3 6V19L9 16M9 3L15 6M9 3V16M15 6L21 3V16L15 19M15 6V19M9 16L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Request Ride Button (CENTER - ELEVATED) */}
        <button 
          className="nav-item-center"
          onClick={() => onNavigate?.('request-ride')}
          aria-label="Request Ride"
        >
          <div className="center-button">
            <svg className="center-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L8 8H5L3 10L5 12H8L12 7V3Z" fill="currentColor"/>
              <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M9 18H15M12 7L14 11H18L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
        
        {/* Notifications Button */}
        <button 
          className={`nav-item ${activeItem === 'notifications' ? 'active' : ''}`}
          onClick={() => onNavigate?.('notifications')}
          aria-label="Notifications"
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Profile Button */}
        <button 
          className={`nav-item ${activeItem === 'profile' ? 'active' : ''}`}
          onClick={() => onNavigate?.('profile')}
          aria-label="Profile"
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;
