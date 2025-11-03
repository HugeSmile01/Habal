import React, { useState, useEffect } from 'react';
import { createRideRequest } from '../services/rideService';
import { getUserLocation } from '../utils/helpers';
import './RideRequestForm.css';

const RideRequestForm = ({ user, onSuccess }) => {
  const [formData, setFormData] = useState({
    pickupLocation: { lat: 0, lng: 0, address: '' },
    destinationLocation: { lat: 0, lng: 0, address: '' },
    numberOfPassengers: 1,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (locationType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [locationType]: {
        ...prev[locationType],
        [field]: value
      }
    }));
  };

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    setError('');
    
    try {
      const location = await getUserLocation();
      setFormData(prev => ({
        ...prev,
        pickupLocation: {
          ...prev.pickupLocation,
          lat: location.lat,
          lng: location.lng
        }
      }));
    } catch (err) {
      setError('Could not get your location. Please enter manually.');
    }
    
    setGettingLocation(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.pickupLocation.lat || !formData.pickupLocation.lng) {
      setError('Please provide pickup location coordinates');
      return;
    }

    if (!formData.destinationLocation.lat || !formData.destinationLocation.lng) {
      setError('Please provide destination location coordinates');
      return;
    }

    setLoading(true);

    const rideData = {
      passengerId: user.uid,
      passengerName: user.fullName,
      passengerPhone: user.phoneNumber,
      pickupLocation: formData.pickupLocation,
      destinationLocation: formData.destinationLocation,
      numberOfPassengers: parseInt(formData.numberOfPassengers),
      notes: formData.notes
    };

    const result = await createRideRequest(rideData);

    if (result.success) {
      onSuccess(result);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="ride-request-form">
      <h2>Request a Ride</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="location-section">
          <h3>Pickup Location</h3>
          <button 
            type="button" 
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            className="location-btn"
          >
            {gettingLocation ? 'Getting Location...' : 'Use My Current Location'}
          </button>
          
          <div className="form-group">
            <label>Pickup Address:</label>
            <input
              type="text"
              value={formData.pickupLocation.address}
              onChange={(e) => handleLocationChange('pickupLocation', 'address', e.target.value)}
              placeholder="Enter pickup address"
              required
            />
          </div>

          <div className="coordinates-group">
            <div className="form-group">
              <label>Latitude:</label>
              <input
                type="number"
                step="any"
                value={formData.pickupLocation.lat}
                onChange={(e) => handleLocationChange('pickupLocation', 'lat', parseFloat(e.target.value))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Longitude:</label>
              <input
                type="number"
                step="any"
                value={formData.pickupLocation.lng}
                onChange={(e) => handleLocationChange('pickupLocation', 'lng', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
        </div>

        <div className="location-section">
          <h3>Destination</h3>
          
          <div className="form-group">
            <label>Destination Address:</label>
            <input
              type="text"
              value={formData.destinationLocation.address}
              onChange={(e) => handleLocationChange('destinationLocation', 'address', e.target.value)}
              placeholder="Enter destination address"
              required
            />
          </div>

          <div className="coordinates-group">
            <div className="form-group">
              <label>Latitude:</label>
              <input
                type="number"
                step="any"
                value={formData.destinationLocation.lat}
                onChange={(e) => handleLocationChange('destinationLocation', 'lat', parseFloat(e.target.value))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Longitude:</label>
              <input
                type="number"
                step="any"
                value={formData.destinationLocation.lng}
                onChange={(e) => handleLocationChange('destinationLocation', 'lng', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Number of Passengers:</label>
          <select 
            name="numberOfPassengers" 
            value={formData.numberOfPassengers}
            onChange={handleChange}
            required
          >
            <option value="1">1 Passenger</option>
            <option value="2">2 Passengers</option>
            <option value="3">3 Passengers</option>
            <option value="4">4 Passengers</option>
            <option value="5">5+ Passengers</option>
          </select>
        </div>

        <div className="form-group">
          <label>Additional Notes (Optional):</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special instructions or requirements"
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Requesting...' : 'Request Ride'}
        </button>
      </form>
    </div>
  );
};

export default RideRequestForm;
