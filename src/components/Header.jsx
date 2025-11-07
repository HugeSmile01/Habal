import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ onMenuClick }) => {
  return (
    <header className="header-fixed">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo-section">
          <div className="logo-circle">
            {/* Motorcycle icon */}
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L8 8H5L3 10L5 12H8L12 7V3Z" fill="currentColor"/>
              <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M9 18H15M12 7L14 11H18L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="brand-text">HABAL</h1>
        </div>
        
        {/* Menu Button */}
        <button className="menu-button" onClick={onMenuClick} aria-label="Open menu">
          <svg className="menu-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" fill="currentColor"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
            <circle cx="12" cy="19" r="2" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func
};

Header.defaultProps = {
  onMenuClick: () => {}
};

export default Header;
