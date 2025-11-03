import React, { useState } from 'react';
import { registerUser, USER_TYPES } from '../services/authService';
import './AuthForm.css';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    userType: USER_TYPES.CITIZEN,
    // Driver-specific fields
    vehicleType: '',
    vehicleModel: '',
    licensePlate: '',
    licenseNumber: '',
    // Citizen-specific fields
    homeAddress: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    setLoading(true);

    const result = await registerUser(formData.email, formData.password, formData);

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
            <option value={USER_TYPES.CITIZEN}>Citizen (Need a ride)</option>
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

        {formData.userType === USER_TYPES.CITIZEN && (
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

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="auth-switch">
        Already have an account? 
        <button onClick={onSwitchToLogin} className="link-btn">Login here</button>
      </div>
    </div>
  );
};

export default RegisterForm;
