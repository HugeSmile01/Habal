import React, { useState, useEffect } from 'react';
import { 
  getAvailableRides, 
  acceptRideRequest, 
  subscribeToAvailableRides,
  calculateFee 
} from '../services/rideService';
import { formatDistance, formatCurrency } from '../utils/helpers';
import './DriverDashboard.css';

const DriverDashboard = ({ user }) => {
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingRide, setAcceptingRide] = useState(null);
  const [proposedFees, setProposedFees] = useState({});

  useEffect(() => {
    // Subscribe to real-time updates for available rides
    const unsubscribe = subscribeToAvailableRides((rides) => {
      setAvailableRides(rides);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFeeChange = (rideId, fee) => {
    setProposedFees(prev => ({
      ...prev,
      [rideId]: fee
    }));
  };

  const handleAcceptRide = async (ride) => {
    const proposedFee = proposedFees[ride.id] || ride.estimatedFee;
    
    if (!proposedFee || proposedFee <= 0) {
      alert('Please enter a valid fee');
      return;
    }

    setAcceptingRide(ride.id);

    const driverData = {
      driverId: user.uid,
      driverName: user.fullName,
      driverPhone: user.phoneNumber,
      vehicleInfo: `${user.vehicleType} - ${user.vehicleModel} (${user.licensePlate})`,
      proposedFee: parseFloat(proposedFee)
    };

    const result = await acceptRideRequest(ride.id, driverData);

    if (result.success) {
      alert('Ride accepted! Passenger will be notified.');
    } else {
      alert(`Error accepting ride: ${result.error}`);
    }

    setAcceptingRide(null);
  };

  if (loading) {
    return <div className="loading">Loading available rides...</div>;
  }

  return (
    <div className="driver-dashboard">
      <h2>Available Ride Requests</h2>
      
      {availableRides.length === 0 ? (
        <div className="no-rides">
          <p>No ride requests available at the moment.</p>
          <p>New requests will appear here automatically.</p>
        </div>
      ) : (
        <div className="rides-list">
          {availableRides.map((ride) => (
            <div key={ride.id} className="ride-card">
              <div className="ride-header">
                <h3>{ride.citizenName}</h3>
                <span className="badge">{ride.numberOfPassengers} passenger{ride.numberOfPassengers > 1 ? 's' : ''}</span>
              </div>
              
              <div className="ride-details">
                <div className="detail-row">
                  <span className="label">From:</span>
                  <span className="value">{ride.pickupLocation.address || 'Pickup location'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">To:</span>
                  <span className="value">{ride.destinationLocation.address || 'Destination'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Distance:</span>
                  <span className="value">{formatDistance(ride.distance)}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Estimated Fee:</span>
                  <span className="value highlight">{formatCurrency(ride.estimatedFee)}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Coordinates:</span>
                  <div className="coordinates">
                    <small>
                      Pickup: {ride.pickupLocation.lat.toFixed(6)}, {ride.pickupLocation.lng.toFixed(6)}
                      <br />
                      Destination: {ride.destinationLocation.lat.toFixed(6)}, {ride.destinationLocation.lng.toFixed(6)}
                    </small>
                  </div>
                </div>

                {ride.notes && (
                  <div className="detail-row">
                    <span className="label">Notes:</span>
                    <span className="value">{ride.notes}</span>
                  </div>
                )}
              </div>

              <div className="fee-input-section">
                <label>Set Your Fee:</label>
                <div className="fee-input-group">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter your fee"
                    value={proposedFees[ride.id] || ride.estimatedFee}
                    onChange={(e) => handleFeeChange(ride.id, e.target.value)}
                    className="fee-input"
                  />
                  <button
                    onClick={() => handleAcceptRide(ride)}
                    disabled={acceptingRide === ride.id}
                    className="accept-btn"
                  >
                    {acceptingRide === ride.id ? 'Accepting...' : 'Accept Ride'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
