import React, { useState } from 'react';
import Header from '../components/Header';
import ActiveRideCard from '../components/ActiveRideCard';
import HeroImage from '../components/HeroImage';
import BottomNavigation from '../components/BottomNavigation';
import './DemoPage.css';

const DemoPage = () => {
  const [activeNav, setActiveNav] = useState('home');

  const handleNavigation = (item) => {
    setActiveNav(item);
    console.log('Navigated to:', item);
  };

  const handleMenuClick = () => {
    console.log('Menu clicked');
  };

  return (
    <div className="demo-page">
      {/* New Header Component */}
      <Header onMenuClick={handleMenuClick} />
      <div className="header-spacer"></div>

      {/* Scrollable Content Area */}
      <div className="page-content">
        {/* Active Ride Cards Section */}
        <div className="ride-card-container">
          <ActiveRideCard 
            route="Hingatungan To Silago"
            status="Ongoing"
            expectedTime="10 minutes"
            location="Silago, Southern Leyte"
          />
          <ActiveRideCard 
            route="Laguma To Silago"
            status="Ongoing"
            expectedTime="5 minutes"
            location="Silago, Southern Leyte"
          />
        </div>

        {/* Hero Image Section */}
        <HeroImage src="/placeholder-vehicle.svg" alt="Habal ride vehicle" />

        {/* Demo Content */}
        <div className="demo-content">
          <h2>UI Components Demo</h2>
          <p>This page demonstrates the new Habal UI design components:</p>
          <ul>
            <li>✅ Fixed Header with gradient logo and HABAL branding</li>
            <li>✅ Active Ride Cards with gradient backgrounds</li>
            <li>✅ Hero Image section</li>
            <li>✅ Bottom Navigation with elevated center button</li>
          </ul>
        </div>
      </div>

      {/* Bottom Navigation Spacer */}
      <div className="bottom-nav-spacer"></div>

      {/* Bottom Navigation Bar */}
      <BottomNavigation 
        activeItem={activeNav}
        onNavigate={handleNavigation}
      />
    </div>
  );
};

export default DemoPage;
