import React, { useState } from 'react';
import { registerUser, USER_TYPES } from '../services/authService';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';
import { collectDeviceInfo } from '../utils/deviceInfo';
import './AuthForm.css';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    userType: USER_TYPES.PASSENGER,
    // Driver-specific fields
    vehicleType: '',
    vehicleModel: '',
    licensePlate: '',
    licenseNumber: '',
    // Passenger-specific fields
    homeAddress: ''
  });

  const [consents, setConsents] = useState({
    privacyPolicy: false,
    termsAndConditions: false,
    deviceInfoCollection: false,
    locationTracking: false,
    understandConsequences: false
  });

  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConsentChange = (e) => {
    const { name, checked } = e.target;
    setConsents(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Check all consents
    if (!consents.privacyPolicy) {
      setError('You must accept the Privacy Policy to register');
      return;
    }

    if (!consents.termsAndConditions) {
      setError('You must accept the Terms and Conditions to register');
      return;
    }

    if (!consents.deviceInfoCollection) {
      setError('You must consent to device information collection for security purposes');
      return;
    }

    if (!consents.locationTracking) {
      setError('You must consent to location tracking to use the ride-hailing service');
      return;
    }

    if (!consents.understandConsequences) {
      setError('You must acknowledge the consequences of misuse');
      return;
    }

    setLoading(true);

    // Collect device information
    const deviceInfo = collectDeviceInfo();

    // Register user with device info
    const result = await registerUser(formData.email, formData.password, {
      ...formData,
      deviceInfo,
      consents,
      registrationTimestamp: new Date().toISOString()
    });

    if (result.success) {
      onSuccess(result.user);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-form">
      <h2>Register for Habal</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>I am a:</label>
          <select 
            name="userType" 
            value={formData.userType} 
            onChange={handleChange}
            required
          >
            <option value={USER_TYPES.PASSENGER}>Passenger (Need a ride)</option>
            <option value={USER_TYPES.DRIVER}>Driver (Provide rides)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {formData.userType === USER_TYPES.DRIVER && (
          <>
            <div className="form-group">
              <label>Vehicle Type:</label>
              <select 
                name="vehicleType" 
                value={formData.vehicleType} 
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle Type</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="tricycle">Tricycle</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
              </select>
            </div>

            <div className="form-group">
              <label>Vehicle Model:</label>
              <input
                type="text"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>License Plate:</label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Driver's License Number:</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {formData.userType === USER_TYPES.PASSENGER && (
          <div className="form-group">
            <label>Home Address (Optional):</label>
            <input
              type="text"
              name="homeAddress"
              value={formData.homeAddress}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Consent Section */}
        <div className="consent-section">
          <h3 className="consent-title">Required Consents</h3>
          
          <div className="consent-item">
            <label className="consent-label">
              <input
                type="checkbox"
                name="privacyPolicy"
                checked={consents.privacyPolicy}
                onChange={handleConsentChange}
                required
              />
              <span>
                I have read and agree to the{' '}
                <button 
                  type="button" 
                  className="link-btn-inline"
                  onClick={() => setShowPrivacyPolicy(true)}
                >
                  Privacy Policy
                </button>
              </span>
            </label>
          </div>

          <div className="consent-item">
            <label className="consent-label">
              <input
                type="checkbox"
                name="termsAndConditions"
                checked={consents.termsAndConditions}
                onChange={handleConsentChange}
                required
              />
              <span>
                I have read and agree to the{' '}
                <button 
                  type="button" 
                  className="link-btn-inline"
                  onClick={() => setShowTerms(true)}
                >
                  Terms and Conditions
                </button>
              </span>
            </label>
          </div>

          <div className="consent-item">
            <label className="consent-label">
              <input
                type="checkbox"
                name="deviceInfoCollection"
                checked={consents.deviceInfoCollection}
                onChange={handleConsentChange}
                required
              />
              <span>
                I consent to the collection of my device information (browser, operating system, device type) 
                for security and fraud prevention purposes
              </span>
            </label>
          </div>

          <div className="consent-item">
            <label className="consent-label">
              <input
                type="checkbox"
                name="locationTracking"
                checked={consents.locationTracking}
                onChange={handleConsentChange}
                required
              />
              <span>
                I consent to real-time location tracking during rides for safety and service delivery
              </span>
            </label>
          </div>

          <div className="consent-item warning-consent">
            <label className="consent-label">
              <input
                type="checkbox"
                name="understandConsequences"
                checked={consents.understandConsequences}
                onChange={handleConsentChange}
                required
              />
              <span>
                <strong>I understand that misuse of the Habal platform</strong> (including fake bookings, 
                false information, or fraudulent activities) may result in account termination, legal action, 
                and cooperation with law enforcement. I understand that my device information and location 
                data can be used as evidence in investigations.
              </span>
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="auth-switch">
        Already have an account? 
        <button onClick={onSwitchToLogin} className="link-btn">Login here</button>
      </div>

      {/* Legal Documents Modals */}
      {showPrivacyPolicy && <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />}
      {showTerms && <TermsAndConditions onClose={() => setShowTerms(false)} />}
    </div>
  );
};

export default RegisterForm;
