import React from 'react';
import PropTypes from 'prop-types';
import './ActiveRideCard.css';

const ActiveRideCard = ({ route, status, expectedTime, location }) => {
  return (
    <div className="active-ride-card">
      {/* Route Title */}
      <h2 className="route-title">{route}</h2>
      
      {/* Status Row */}
      <div className="status-row">
        <span className="status-badge status-ongoing">
          {status}
        </span>
        <span className="status-separator">•</span>
        <span className="expected-time-text">
          Expected time <span className="time-value">{expectedTime}</span>
        </span>
      </div>
      
      {/* Location Row */}
      <div className="location-row">
        <svg className="location-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
        </svg>
        <span className="location-text">{location}</span>
      </div>
    </div>
  );
};

ActiveRideCard.propTypes = {
  route: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  expectedTime: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired
};

export default ActiveRideCard;
