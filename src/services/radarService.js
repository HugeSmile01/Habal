/**
 * Radar.com API Service
 * Provides geocoding, reverse geocoding, and location services
 * API Documentation: https://radar.com/documentation/api
 */

const RADAR_API_KEY = import.meta.env.VITE_RADAR_API_KEY;
const RADAR_BASE_URL = 'https://api.radar.io/v1';

/**
 * Forward geocoding - Convert address to coordinates
 * @param {string} query - Address string to geocode
 * @returns {Promise<Object>} - Location data with lat, lng, and formatted address
 */
export const geocodeAddress = async (query) => {
  if (!RADAR_API_KEY) {
    console.warn('Radar API key not configured. Please set VITE_RADAR_API_KEY in your environment.');
    return {
      success: false,
      error: 'Radar API key not configured'
    };
  }

  try {
    const response = await fetch(
      `${RADAR_BASE_URL}/geocode/forward?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': RADAR_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Radar API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.addresses && data.addresses.length > 0) {
      const address = data.addresses[0];
      return {
        success: true,
        location: {
          lat: address.latitude,
          lng: address.longitude,
          address: address.formattedAddress,
          city: address.city,
          state: address.state,
          country: address.country,
          postalCode: address.postalCode
        }
      };
    } else {
      return {
        success: false,
        error: 'No results found for this address'
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Reverse geocoding - Convert coordinates to address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} - Address data
 */
export const reverseGeocode = async (lat, lng) => {
  if (!RADAR_API_KEY) {
    console.warn('Radar API key not configured. Please set VITE_RADAR_API_KEY in your environment.');
    return {
      success: false,
      error: 'Radar API key not configured'
    };
  }

  try {
    const response = await fetch(
      `${RADAR_BASE_URL}/geocode/reverse?coordinates=${lat},${lng}`,
      {
        headers: {
          'Authorization': RADAR_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Radar API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.addresses && data.addresses.length > 0) {
      const address = data.addresses[0];
      return {
        success: true,
        address: {
          formatted: address.formattedAddress,
          street: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          postalCode: address.postalCode
        }
      };
    } else {
      return {
        success: false,
        error: 'No address found for these coordinates'
      };
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Autocomplete address search
 * @param {string} query - Partial address to search
 * @param {Object} near - Optional nearby coordinates {lat, lng}
 * @returns {Promise<Object>} - List of address suggestions
 */
export const autocompleteAddress = async (query, near = null) => {
  if (!RADAR_API_KEY) {
    console.warn('Radar API key not configured. Please set VITE_RADAR_API_KEY in your environment.');
    return {
      success: false,
      error: 'Radar API key not configured'
    };
  }

  try {
    let url = `${RADAR_BASE_URL}/search/autocomplete?query=${encodeURIComponent(query)}&limit=5`;
    
    if (near) {
      url += `&near=${near.lat},${near.lng}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': RADAR_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Radar API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.addresses && data.addresses.length > 0) {
      return {
        success: true,
        suggestions: data.addresses.map(addr => ({
          formattedAddress: addr.formattedAddress,
          lat: addr.latitude,
          lng: addr.longitude,
          city: addr.city,
          state: addr.state
        }))
      };
    } else {
      return {
        success: true,
        suggestions: []
      };
    }
  } catch (error) {
    console.error('Autocomplete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Calculate distance between two points using Radar's distance API
 * This can be used as an alternative to the Haversine formula
 * @param {Object} origin - {lat, lng}
 * @param {Object} destination - {lat, lng}
 * @param {string} mode - travel mode: 'car', 'foot', 'bike'
 * @returns {Promise<Object>} - Distance and duration data
 */
export const getDistance = async (origin, destination, mode = 'car') => {
  if (!RADAR_API_KEY) {
    console.warn('Radar API key not configured. Please set VITE_RADAR_API_KEY in your environment.');
    return {
      success: false,
      error: 'Radar API key not configured'
    };
  }

  try {
    const response = await fetch(
      `${RADAR_BASE_URL}/route/distance?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&modes=${mode}&units=metric`,
      {
        headers: {
          'Authorization': RADAR_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Radar API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.routes && data.routes[mode]) {
      const route = data.routes[mode];
      return {
        success: true,
        distance: route.distance.value / 1000, // Convert meters to kilometers
        duration: route.duration.value / 60, // Convert seconds to minutes
        distanceText: route.distance.text,
        durationText: route.duration.text
      };
    } else {
      return {
        success: false,
        error: 'Could not calculate distance'
      };
    }
  } catch (error) {
    console.error('Distance calculation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
