import React, { useState, useEffect } from 'react';
import RideRequestForm from '../components/RideRequestForm';
import { getUserRides } from '../services/rideService';
import { formatDistance, formatCurrency, formatDateTime } from '../utils/helpers';
import './CitizenPage.css';

const CitizenPage = ({ user, onLogout }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    const result = await getUserRides(user.uid, 'citizen');
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

  return (
    <div className="citizen-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Welcome, {user.fullName}</h1>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="page-content">
        {!showRequestForm ? (
          <>
            <div className="action-section">
              <button 
                onClick={() => setShowRequestForm(true)}
                className="request-ride-btn"
              >
                + Request a New Ride
              </button>
            </div>

            <div className="rides-history">
              <h2>Your Rides</h2>
              
              {loading ? (
                <div className="loading">Loading your rides...</div>
              ) : rides.length === 0 ? (
                <div className="no-rides">
                  <p>You haven't requested any rides yet.</p>
                  <p>Click the button above to request your first ride!</p>
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
    </div>
  );
};

export default CitizenPage;
