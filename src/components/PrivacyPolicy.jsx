import React from 'react';
import './LegalDocument.css';

const PrivacyPolicy = ({ onClose }) => {
  return (
    <div className="legal-overlay">
      <div className="legal-document">
        <div className="legal-header">
          <h2>Privacy Policy</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="legal-content">
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h3>1. Information We Collect</h3>
            <p>When you register for Habal, we collect the following information:</p>
            <ul>
              <li>Personal information (name, email, phone number)</li>
              <li>Location data (real-time GPS coordinates)</li>
              <li>Device information (browser type, operating system, device model)</li>
              <li>For drivers: vehicle information and license details</li>
              <li>Ride history and transaction records</li>
            </ul>
          </section>

          <section>
            <h3>2. How We Use Your Information</h3>
            <p>Your information is used to:</p>
            <ul>
              <li>Provide and improve our ride-hailing services</li>
              <li>Connect passengers with drivers</li>
              <li>Ensure safety and security of all users</li>
              <li>Process payments and maintain transaction records</li>
              <li>Detect and prevent fraudulent activities</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h3>3. Location Data</h3>
            <p>We collect real-time location data to:</p>
            <ul>
              <li>Match passengers with nearby drivers</li>
              <li>Calculate accurate fares and routes</li>
              <li>Track rides for safety purposes</li>
              <li>Investigate incidents or disputes</li>
            </ul>
            <p>Location tracking is active only when you use the app and can be disabled in your device settings, though this may limit service functionality.</p>
          </section>

          <section>
            <h3>4. Device Information</h3>
            <p>We collect device information including browser type, operating system, and device identifiers to:</p>
            <ul>
              <li>Prevent fraudulent accounts and fake bookings</li>
              <li>Enhance security measures</li>
              <li>Improve user experience</li>
              <li>Troubleshoot technical issues</li>
            </ul>
          </section>

          <section>
            <h3>5. Data Security</h3>
            <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h3>6. Information Sharing</h3>
            <p>We do not sell your personal information. We may share data with:</p>
            <ul>
              <li>Other users (limited information necessary for the service)</li>
              <li>Law enforcement when required by law</li>
              <li>Service providers who assist in our operations</li>
            </ul>
          </section>

          <section>
            <h3>7. Your Rights</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of certain data collection practices</li>
            </ul>
          </section>

          <section>
            <h3>8. Consequences of Misuse</h3>
            <p><strong>Warning:</strong> Any misuse of the Habal platform, including creating fake bookings, providing false information, or engaging in fraudulent activities, may result in:</p>
            <ul>
              <li>Immediate account suspension or termination</li>
              <li>Legal action and prosecution</li>
              <li>Sharing of your information with law enforcement</li>
              <li>Financial penalties</li>
            </ul>
            <p>We maintain comprehensive logs including device information and location data that can be used as evidence in investigations.</p>
          </section>

          <section>
            <h3>9. Changes to Privacy Policy</h3>
            <p>We may update this policy periodically. Continued use of the service constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h3>10. Contact Us</h3>
            <p>For privacy concerns or questions, please contact us through the app or our official channels.</p>
          </section>
        </div>
        <div className="legal-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
