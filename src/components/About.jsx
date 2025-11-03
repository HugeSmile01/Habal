import React from 'react';
import './About.css';

const About = ({ onClose }) => {
  return (
    <div className="about-overlay">
      <div className="about-container">
        <div className="about-header">
          <h2>About Habal</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="about-content">
          <div className="about-logo">
            <img src="/Habal.svg" alt="Habal Logo" className="logo-image" />
          </div>

          <section className="about-section">
            <h3>🚗 What is Habal?</h3>
            <p>
              Habal is a local ride-hailing platform designed to connect passengers with reliable drivers 
              in your community. We provide a safe, convenient, and affordable transportation solution that 
              puts safety and user experience first.
            </p>
          </section>

          <section className="about-section">
            <h3>✨ Our Mission</h3>
            <p>
              To revolutionize local transportation by creating a secure, user-friendly platform that 
              prioritizes safety, transparency, and community trust. We strive to make every ride 
              safe, reliable, and accessible to everyone.
            </p>
          </section>

          <section className="about-section">
            <h3>🔒 Safety First</h3>
            <p>
              Your safety is our top priority. Habal implements advanced security measures including:
            </p>
            <ul>
              <li>Real-time GPS tracking for all rides</li>
              <li>Comprehensive driver verification and background checks</li>
              <li>Device fingerprinting to prevent fake accounts</li>
              <li>24/7 monitoring and support system</li>
              <li>Secure data encryption and privacy protection</li>
              <li>Emergency response features</li>
            </ul>
          </section>

          <section className="about-section">
            <h3>🎯 Key Features</h3>
            <ul>
              <li><strong>Real-time Tracking:</strong> Know exactly where your ride is at all times</li>
              <li><strong>Transparent Pricing:</strong> Fair, distance-based fare calculation</li>
              <li><strong>User Ratings:</strong> Build trust through community feedback</li>
              <li><strong>Multiple Vehicle Options:</strong> Choose from motorcycles, tricycles, cars, and vans</li>
              <li><strong>Secure Payments:</strong> Safe and convenient payment processing</li>
              <li><strong>Driver Dashboard:</strong> Comprehensive tools for drivers to manage their rides</li>
            </ul>
          </section>

          <section className="about-section">
            <h3>🛡️ Fraud Prevention</h3>
            <p>
              We take fraud and misuse seriously. Our platform uses advanced technology to:
            </p>
            <ul>
              <li>Detect and prevent fake bookings</li>
              <li>Monitor suspicious activities</li>
              <li>Collect device and location information for security</li>
              <li>Maintain comprehensive audit logs</li>
              <li>Cooperate with law enforcement when necessary</li>
            </ul>
            <p className="warning-text">
              <strong>Warning:</strong> Misuse of the platform may result in legal consequences. 
              All activities are logged and can be used as evidence in investigations.
            </p>
          </section>

          <section className="about-section">
            <h3>🌐 Technology</h3>
            <p>
              Habal is built with modern web technologies to ensure a fast, reliable, and secure experience:
            </p>
            <ul>
              <li>React for responsive user interface</li>
              <li>Firebase for secure authentication and data storage</li>
              <li>Real-time geolocation services</li>
              <li>Cloud-based infrastructure for scalability</li>
              <li>Mobile-first design approach</li>
            </ul>
          </section>

          <section className="about-section">
            <h3>📞 Support</h3>
            <p>
              Need help? Our support team is here for you. For assistance, safety concerns, 
              or to report issues, please use the in-app reporting features or contact us through 
              our official support channels.
            </p>
          </section>

          <section className="about-section">
            <h3>🤝 Community Guidelines</h3>
            <p>
              Habal is built on trust and respect. We expect all users to:
            </p>
            <ul>
              <li>Treat each other with courtesy and respect</li>
              <li>Provide accurate information</li>
              <li>Follow all platform rules and local laws</li>
              <li>Report any issues or concerns promptly</li>
              <li>Help us maintain a safe community for everyone</li>
            </ul>
          </section>

          <div className="copyright-section">
            <p className="copyright">
              © {new Date().getFullYear()} Habal. All rights reserved.
            </p>
            <p className="developer">
              Developed by <strong>John Rish Ladica</strong>
            </p>
          </div>
        </div>

        <div className="about-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default About;
