import React, { useState, useEffect, useCallback } from 'react';
import { createRideRequest } from '../services/rideService';
import { getUserLocation } from '../utils/helpers';
import { geocodeAddress, reverseGeocode, autocompleteAddress } from '../services/radarService';
import { SILAGO_BARANGAYS, getBarangayByValue } from '../constants/locations';
import { showRideRequestSuccess, showError, showLoading, closeLoading } from '../utils/sweetAlert';
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
  const [pickupMethod, setPickupMethod] = useState('current'); // 'current', 'barangay', 'search'
  const [destinationMethod, setDestinationMethod] = useState('barangay'); // 'barangay', 'search'
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

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
          address: addressResult.success ? addressResult.address.formatted : 'Current Location'
        }
      }));
      setPickupMethod('current');
    } catch (err) {
      showError('Could not get your location. Please try another method.', 'Location Error');
      setError('Could not get your location. Please enter manually.');
    }
    
    setGettingLocation(false);
  };

  // Handle barangay selection for pickup
  const handlePickupBarangayChange = (value) => {
    const barangay = getBarangayByValue(value);
    if (barangay) {
      setFormData(prev => ({
        ...prev,
        pickupLocation: {
          lat: barangay.lat,
          lng: barangay.lng,
          address: barangay.name + ', Silago, Southern Leyte'
        }
      }));
    }
  };

  // Handle barangay selection for destination
  const handleDestinationBarangayChange = (value) => {
    const barangay = getBarangayByValue(value);
    if (barangay) {
      setFormData(prev => ({
        ...prev,
        destinationLocation: {
          lat: barangay.lat,
          lng: barangay.lng,
          address: barangay.name + ', Silago, Southern Leyte'
        }
      }));
    }
  };

  // Handle address autocomplete for pickup with debouncing
  const handlePickupAddressChange = async (value) => {
    handleLocationChange('pickupLocation', 'address', value);
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    if (value.length > 2) {
      // Set new timer for debounced API call
      const timer = setTimeout(async () => {
        const result = await autocompleteAddress(value);
        if (result.success && result.suggestions.length > 0) {
          setPickupSuggestions(result.suggestions);
          setShowPickupSuggestions(true);
        } else {
          setPickupSuggestions([]);
          setShowPickupSuggestions(false);
        }
      }, 300); // 300ms debounce delay
      
      setDebounceTimer(timer);
    } else {
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
    }
  };

  // Handle address autocomplete for destination with debouncing
  const handleDestinationAddressChange = async (value) => {
    handleLocationChange('destinationLocation', 'address', value);
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    if (value.length > 2) {
      // Set new timer for debounced API call
      const timer = setTimeout(async () => {
        const result = await autocompleteAddress(value);
        if (result.success && result.suggestions.length > 0) {
          setDestinationSuggestions(result.suggestions);
          setShowDestinationSuggestions(true);
        } else {
          setDestinationSuggestions([]);
          setShowDestinationSuggestions(false);
        }
      }, 300); // 300ms debounce delay
      
      setDebounceTimer(timer);
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

  // Memoized focus handlers to prevent re-renders
  const handlePickupFocus = useCallback(() => {
    if (pickupSuggestions.length > 0) {
      setShowPickupSuggestions(true);
    }
  }, [pickupSuggestions.length]);

  const handleDestinationFocus = useCallback(() => {
    if (destinationSuggestions.length > 0) {
      setShowDestinationSuggestions(true);
    }
  }, [destinationSuggestions.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.pickupLocation.lat || !formData.pickupLocation.lng) {
      showError('Please select a valid pickup location', 'Validation Error');
      return;
    }

    if (!formData.destinationLocation.lat || !formData.destinationLocation.lng) {
      showError('Please select a valid destination location', 'Validation Error');
      return;
    }

    if (formData.pickupLocation.lat === formData.destinationLocation.lat && 
        formData.pickupLocation.lng === formData.destinationLocation.lng) {
      showError('Pickup and destination locations cannot be the same', 'Validation Error');
      return;
    }

    setLoading(true);
    showLoading('Requesting Ride...', 'Please wait while we process your request');

    const rideData = {
      passengerId: user.uid,
      passengerName: user.fullName,
      passengerPhone: user.phoneNumber,
      pickupLocation: formData.pickupLocation,
      destinationLocation: formData.destinationLocation,
      numberOfPassengers: parseInt(formData.numberOfPassengers),
      notes: formData.notes
    };

    try {
      const result = await createRideRequest(rideData);

      closeLoading();

      if (result.success) {
        const { formatDistance, formatCurrency } = await import('../utils/helpers');
        await showRideRequestSuccess(
          formatDistance(result.distance),
          formatCurrency(result.estimatedFee)
        );
        onSuccess(result);
      } else {
        showError(result.error || 'Failed to create ride request', 'Request Failed');
        setError(result.error);
      }
    } catch (err) {
      closeLoading();
      showError('An unexpected error occurred. Please try again.', 'Error');
      setError('An unexpected error occurred');
    }

    setLoading(false);
  };

  return (
    <div className="ride-request-form">
      <h2>Request a Ride</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="location-section">
          <h3>📍 Pickup Location</h3>
          
          <div className="location-method-selector">
            <label>
              <input 
                type="radio" 
                name="pickupMethod" 
                value="current"
                checked={pickupMethod === 'current'}
                onChange={(e) => setPickupMethod(e.target.value)}
              />
              Use My Current Location
            </label>
            <label>
              <input 
                type="radio" 
                name="pickupMethod" 
                value="barangay"
                checked={pickupMethod === 'barangay'}
                onChange={(e) => setPickupMethod(e.target.value)}
              />
              Select Barangay
            </label>
            <label>
              <input 
                type="radio" 
                name="pickupMethod" 
                value="search"
                checked={pickupMethod === 'search'}
                onChange={(e) => setPickupMethod(e.target.value)}
              />
              Search Address
            </label>
          </div>

          {pickupMethod === 'current' && (
            <button 
              type="button" 
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="location-btn"
            >
              {gettingLocation ? '📍 Getting Location...' : '📍 Get My Current Location'}
            </button>
          )}

          {pickupMethod === 'barangay' && (
            <div className="form-group">
              <label>Select Pickup Barangay:</label>
              <select 
                onChange={(e) => handlePickupBarangayChange(e.target.value)}
                className="barangay-select"
                required
              >
                <option value="">-- Select a Barangay --</option>
                {SILAGO_BARANGAYS.map((barangay) => (
                  <option key={barangay.value} value={barangay.value}>
                    {barangay.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {pickupMethod === 'search' && (
            <div className="form-group">
              <label>Search Pickup Address:</label>
              <div className="autocomplete-wrapper">
                <input
                  type="text"
                  value={formData.pickupLocation.address}
                  onChange={(e) => handlePickupAddressChange(e.target.value)}
                  onFocus={handlePickupFocus}
                  placeholder="Type to search address..."
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
          )}

          {formData.pickupLocation.address && (
            <div className="selected-location">
              <strong>Selected:</strong> {formData.pickupLocation.address}
            </div>
          )}
        </div>

        <div className="location-section">
          <h3>🎯 Destination</h3>
          
          <div className="location-method-selector">
            <label>
              <input 
                type="radio" 
                name="destinationMethod" 
                value="barangay"
                checked={destinationMethod === 'barangay'}
                onChange={(e) => setDestinationMethod(e.target.value)}
              />
              Select Barangay
            </label>
            <label>
              <input 
                type="radio" 
                name="destinationMethod" 
                value="search"
                checked={destinationMethod === 'search'}
                onChange={(e) => setDestinationMethod(e.target.value)}
              />
              Search Address
            </label>
          </div>

          {destinationMethod === 'barangay' && (
            <div className="form-group">
              <label>Select Destination Barangay:</label>
              <select 
                onChange={(e) => handleDestinationBarangayChange(e.target.value)}
                className="barangay-select"
                required
              >
                <option value="">-- Select a Barangay --</option>
                {SILAGO_BARANGAYS.map((barangay) => (
                  <option key={barangay.value} value={barangay.value}>
                    {barangay.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {destinationMethod === 'search' && (
            <div className="form-group">
              <label>Search Destination Address:</label>
              <div className="autocomplete-wrapper">
                <input
                  type="text"
                  value={formData.destinationLocation.address}
                  onChange={(e) => handleDestinationAddressChange(e.target.value)}
                  onFocus={handleDestinationFocus}
                  placeholder="Type to search address..."
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
          )}

          {formData.destinationLocation.address && (
            <div className="selected-location">
              <strong>Selected:</strong> {formData.destinationLocation.address}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>👥 Number of Passengers:</label>
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
          <label>📝 Additional Notes (Optional):</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special instructions or requirements"
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? '⏳ Requesting...' : '🚀 Request Ride'}
        </button>
      </form>
    </div>
  );
};

export default RideRequestForm;
