import React, { useState, useEffect } from 'react';
import { createRideRequest } from '../services/rideService';
import { getUserLocation } from '../utils/helpers';
import { geocodeAddress, reverseGeocode, autocompleteAddress } from '../services/radarService';
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
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

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
      
      // Get address for current location using Radar reverse geocoding
      const addressResult = await reverseGeocode(location.lat, location.lng);
      
      setFormData(prev => ({
        ...prev,
        pickupLocation: {
          lat: location.lat,
          lng: location.lng,
          address: addressResult.success ? addressResult.address.formatted : ''
        }
      }));
    } catch (err) {
      setError('Could not get your location. Please enter manually.');
    }
    
    setGettingLocation(false);
  };

  // Handle address autocomplete for pickup
  const handlePickupAddressChange = async (value) => {
    handleLocationChange('pickupLocation', 'address', value);
    
    if (value.length > 2) {
      const result = await autocompleteAddress(value);
      if (result.success && result.suggestions.length > 0) {
        setPickupSuggestions(result.suggestions);
        setShowPickupSuggestions(true);
      } else {
        setPickupSuggestions([]);
        setShowPickupSuggestions(false);
      }
    } else {
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
    }
  };

  // Handle address autocomplete for destination
  const handleDestinationAddressChange = async (value) => {
    handleLocationChange('destinationLocation', 'address', value);
    
    if (value.length > 2) {
      const result = await autocompleteAddress(value);
      if (result.success && result.suggestions.length > 0) {
        setDestinationSuggestions(result.suggestions);
        setShowDestinationSuggestions(true);
      } else {
        setDestinationSuggestions([]);
        setShowDestinationSuggestions(false);
      }
    } else {
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
    }
  };

  // Select pickup suggestion
  const selectPickupSuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      pickupLocation: {
        lat: suggestion.lat,
        lng: suggestion.lng,
        address: suggestion.formattedAddress
      }
    }));
    setShowPickupSuggestions(false);
    setPickupSuggestions([]);
  };

  // Select destination suggestion
  const selectDestinationSuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      destinationLocation: {
        lat: suggestion.lat,
        lng: suggestion.lng,
        address: suggestion.formattedAddress
      }
    }));
    setShowDestinationSuggestions(false);
    setDestinationSuggestions([]);
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
            <div className="autocomplete-wrapper">
              <input
                type="text"
                value={formData.pickupLocation.address}
                onChange={(e) => handlePickupAddressChange(e.target.value)}
                onFocus={() => pickupSuggestions.length > 0 && setShowPickupSuggestions(true)}
                placeholder="Enter pickup address or search"
                required
              />
              {showPickupSuggestions && pickupSuggestions.length > 0 && (
                <ul className="autocomplete-suggestions">
                  {pickupSuggestions.map((suggestion, index) => (
                    <li 
                      key={index}
                      onClick={() => selectPickupSuggestion(suggestion)}
                      className="suggestion-item"
                    >
                      <div className="suggestion-text">{suggestion.formattedAddress}</div>
                      <div className="suggestion-meta">{suggestion.city}, {suggestion.state}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
            <div className="autocomplete-wrapper">
              <input
                type="text"
                value={formData.destinationLocation.address}
                onChange={(e) => handleDestinationAddressChange(e.target.value)}
                onFocus={() => destinationSuggestions.length > 0 && setShowDestinationSuggestions(true)}
                placeholder="Enter destination address or search"
                required
              />
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <ul className="autocomplete-suggestions">
                  {destinationSuggestions.map((suggestion, index) => (
                    <li 
                      key={index}
                      onClick={() => selectDestinationSuggestion(suggestion)}
                      className="suggestion-item"
                    >
                      <div className="suggestion-text">{suggestion.formattedAddress}</div>
                      <div className="suggestion-meta">{suggestion.city}, {suggestion.state}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
