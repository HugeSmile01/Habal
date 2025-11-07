import React from 'react';
import './HeroImage.css';

const HeroImage = ({ src, alt }) => {
  return (
    <div className="hero-section">
      <img 
        src={src || '/placeholder-vehicle.jpg'} 
        alt={alt || 'Habal ride vehicle'}
        className="hero-image"
      />
    </div>
  );
};

export default HeroImage;
