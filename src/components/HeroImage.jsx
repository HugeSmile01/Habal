import React from 'react';
import PropTypes from 'prop-types';
import './HeroImage.css';

const HeroImage = ({ src, alt }) => {
  return (
    <div className="hero-section">
      <img 
        src={src || '/motorcycle.png'} 
        alt={alt || 'Habal ride vehicle'}
        className="hero-image"
      />
    </div>
  );
};

HeroImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string
};

HeroImage.defaultProps = {
  src: '/motorcycle.png',
  alt: 'Habal ride vehicle'
};

export default HeroImage;
