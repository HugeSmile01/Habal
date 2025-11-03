import React, { useState, useEffect } from 'react';
import DriverDashboard from '../components/DriverDashboard';
import { getUserRides, updateDriverLocation, RIDE_STATUS } from '../services/rideService';
import { watchUserLocation, clearLocationWatch, formatDistance, formatCurrency, formatDateTime } from '../utils/helpers';
import './DriverPage.css';

const DriverPage = ({ user, onLogout }) => {
  const [activeRides, setActiveRides] = useState([]);
  const [completedRides, setCompletedRides] = useState([]);
  const [locationWatchId, setLocationWatchId] = useState(null);
  const [showDashboard, setShowDashboard] = useState(true);

  useEffect(() => {
    loadRides();
  }, []);

  useEffect(() => {
    // Start tracking location for active rides
    if (activeRides.length > 0 && !locationWatchId) {
      const watchId = watchUserLocation(
        (location) => {
          // Update location for all active rides
          activeRides.forEach(ride => {
            updateDriverLocation(ride.id, location);
          });
        },
        (error) => {
          console.error('Location tracking error:', error);
        }
      );
      setLocationWatchId(watchId);
    } else if (activeRides.length === 0 && locationWatchId) {
      clearLocationWatch(locationWatchId);
      setLocationWatchId(null);
    }

    return () => {
      if (locationWatchId) {
        clearLocationWatch(locationWatchId);
      }
    };
  }, [activeRides]);

  const loadRides = async () => {
    const result = await getUserRides(user.uid, 'driver');
    if (result.success) {
      const active = result.rides.filter(r => 
        [RIDE_STATUS.ACCEPTED, RIDE_STATUS.DRIVER_ARRIVING, RIDE_STATUS.IN_PROGRESS].includes(r.status)
      );
      const completed = result.rides.filter(r => 
        [RIDE_STATUS.COMPLETED, RIDE_STATUS.CANCELLED].includes(r.status)
      );
      setActiveRides(active);
      setCompletedRides(completed);
    }
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

  return (
    <div className="driver-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Driver Dashboard - {user.fullName}</h1>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="page-content">
        <div className="tabs">
          <button 
            className={`tab ${showDashboard ? 'active' : ''}`}
            onClick={() => setShowDashboard(true)}
          >
            Available Rides
          </button>
          <button 
            className={`tab ${!showDashboard ? 'active' : ''}`}
            onClick={() => setShowDashboard(false)}
          >
            My Rides ({activeRides.length} active)
          </button>
        </div>

        {showDashboard ? (
          <DriverDashboard user={user} />
        ) : (
          <div className="my-rides">
            {activeRides.length > 0 && (
              <div className="rides-section">
                <h2>Active Rides</h2>
                <div className="rides-list">
                  {activeRides.map((ride) => (
                    <div key={ride.id} className="ride-card active-ride">
                      <div className="ride-card-header">
                        <span className={`status-badge ${getStatusBadgeClass(ride.status)}`}>
                          {getStatusLabel(ride.status)}
                        </span>
                        <span className="passenger-count">
                          {ride.numberOfPassengers} passenger{ride.numberOfPassengers > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="ride-info">
                        <div className="info-row">
                          <span className="label">Passenger:</span>
                          <span>{ride.citizenName}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Phone:</span>
                          <span>{ride.citizenPhone}</span>
                        </div>
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
                          <span className="label">Your Fee:</span>
                          <span className="fee-amount">{formatCurrency(ride.actualFee)}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Pickup Coords:</span>
                          <span className="coords">
                            {ride.pickupLocation.lat.toFixed(6)}, {ride.pickupLocation.lng.toFixed(6)}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Destination Coords:</span>
                          <span className="coords">
                            {ride.destinationLocation.lat.toFixed(6)}, {ride.destinationLocation.lng.toFixed(6)}
                          </span>
                        </div>
                      </div>

                      {locationWatchId && (
                        <div className="tracking-info">
                          <span className="tracking-indicator">📍 Location Tracking Active</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedRides.length > 0 && (
              <div className="rides-section">
                <h2>Completed Rides</h2>
                <div className="rides-list">
                  {completedRides.map((ride) => (
                    <div key={ride.id} className="ride-card">
                      <div className="ride-card-header">
                        <span className={`status-badge ${getStatusBadgeClass(ride.status)}`}>
                          {getStatusLabel(ride.status)}
                        </span>
                        <span className="ride-date">{formatDateTime(ride.createdAt)}</span>
                      </div>

                      <div className="ride-info">
                        <div className="info-row">
                          <span className="label">Passenger:</span>
                          <span>{ride.citizenName}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Distance:</span>
                          <span>{formatDistance(ride.distance)}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Fee Earned:</span>
                          <span className="fee-amount">{formatCurrency(ride.actualFee)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeRides.length === 0 && completedRides.length === 0 && (
              <div className="no-rides">
                <p>You haven't accepted any rides yet.</p>
                <p>Check the "Available Rides" tab to find ride requests.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverPage;
