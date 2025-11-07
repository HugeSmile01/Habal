import React, { useState, useEffect } from 'react';
import RideRequestForm from '../components/RideRequestForm';
import About from '../components/About';
import Header from '../components/Header';
import ActiveRideCard from '../components/ActiveRideCard';
import HeroImage from '../components/HeroImage';
import BottomNavigation from '../components/BottomNavigation';
import { getUserRides } from '../services/rideService';
import { formatDistance, formatCurrency, formatDateTime } from '../utils/helpers';
import './PassengerPage.css';

const PassengerPage = ({ user, onLogout }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    const result = await getUserRides(user.uid, 'passenger');
    if (result.success) {
      setRides(result.rides);
    }
    setLoading(false);
  };

  const handleRideSuccess = (result) => {
    alert(`Ride requested successfully!\nDistance: ${formatDistance(result.distance)}\nEstimated Fee: ${formatCurrency(result.estimatedFee)}`);
    setShowRequestForm(false);
    loadRides();
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'requested': 'status-requested',
      'accepted': 'status-accepted',
      'driver_arriving': 'status-arriving',
      'in_progress': 'status-progress',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-default';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'requested': 'Requested',
      'accepted': 'Accepted',
      'driver_arriving': 'Driver Arriving',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return labelMap[status] || status;
  };

  const handleNavigation = (item) => {
    setActiveNav(item);
    if (item === 'request-ride') {
      setShowRequestForm(true);
    } else if (item === 'profile') {
      // Could open profile modal or navigate
      setShowAbout(true);
    } else if (item === 'home') {
      setShowRequestForm(false);
      setShowAbout(false);
    }
  };

  const handleMenuClick = () => {
    // Toggle menu or show options
    setShowAbout(true);
  };

  return (
    <div className="passenger-page">
      {/* New Header Component */}
      <Header onMenuClick={handleMenuClick} />
      <div className="header-spacer"></div>

      {/* Scrollable Content Area */}
      <div className="page-content">
        {!showRequestForm ? (
          <>
            {/* Active Ride Cards Section */}
            <div className="ride-card-container">
              <ActiveRideCard 
                route="Hingatungan To Silago"
                status="Ongoing"
                expectedTime="10minutes"
                location="Silago, Southern Leyte"
              />
              <ActiveRideCard 
                route="Laguma To Silago"
                status="Ongoing"
                expectedTime="5minutes"
                location="Silago, Southern Leyte"
              />
            </div>

            {/* Hero Image Section */}
            <HeroImage src="/placeholder-vehicle.svg" alt="Habal ride vehicle" />

            {/* User's Rides History */}
            <div className="rides-history">
              <h2>Your Rides</h2>
              
              {loading ? (
                <div className="loading">Loading your rides...</div>
              ) : rides.length === 0 ? (
                <div className="no-rides">
                  <p>You haven't requested any rides yet.</p>
                  <p>Click the button below to request your first ride!</p>
                </div>
              ) : (
                <div className="rides-list">
                  {rides.map((ride) => (
                    <div key={ride.id} className="ride-card">
                      <div className="ride-card-header">
                        <span className={`status-badge ${getStatusBadgeClass(ride.status)}`}>
                          {getStatusLabel(ride.status)}
                        </span>
                        <span className="ride-date">
                          {formatDateTime(ride.createdAt)}
                        </span>
                      </div>

                      <div className="ride-info">
                        <div className="info-row">
                          <span className="label">From:</span>
                          <span>{ride.pickupLocation.address || 'Pickup location'}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">To:</span>
                          <span>{ride.destinationLocation.address || 'Destination'}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Distance:</span>
                          <span>{formatDistance(ride.distance)}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Passengers:</span>
                          <span>{ride.numberOfPassengers}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Fee:</span>
                          <span className="fee-amount">
                            {formatCurrency(ride.actualFee || ride.estimatedFee)}
                          </span>
                        </div>

                        {ride.driverName && (
                          <>
                            <div className="info-row">
                              <span className="label">Driver:</span>
                              <span>{ride.driverName}</span>
                            </div>
                            <div className="info-row">
                              <span className="label">Vehicle:</span>
                              <span>{ride.vehicleInfo}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button 
              onClick={() => setShowRequestForm(false)}
              className="back-btn"
            >
              ← Back to Dashboard
            </button>
            <RideRequestForm user={user} onSuccess={handleRideSuccess} />
          </>
        )}
      </div>

      {/* Bottom Navigation Spacer */}
      <div className="bottom-nav-spacer"></div>

      {/* Bottom Navigation Bar */}
      <BottomNavigation 
        activeItem={activeNav}
        onNavigate={handleNavigation}
      />

      {/* About Modal */}
      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </div>
  );
};

export default PassengerPage;
