/**
 * Environment Variable Validation
 * Ensures all required environment variables are set before running the app
 * This helps catch configuration issues early in production
 */

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const optionalEnvVars = [
  'VITE_RADAR_API_KEY',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

/**
 * Validates that all required environment variables are set
 * @returns {Object} - { valid: boolean, missing: string[], warnings: string[] }
 */
export const validateEnvironment = () => {
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach(varName => {
    const value = import.meta.env[varName];
    if (!value || value.startsWith('YOUR_')) {
      missing.push(varName);
    }
  });

  // Check optional variables (just warnings)
  optionalEnvVars.forEach(varName => {
    const value = import.meta.env[varName];
    if (!value || value.startsWith('your_')) {
      warnings.push(varName);
    }
  });

  const valid = missing.length === 0;

  return {
    valid,
    missing,
    warnings
  };
};

/**
 * Get environment information
 * @returns {string} - 'development' or 'production'
 */
export const getEnvironment = () => {
  return import.meta.env.MODE || 'development';
};

/**
 * Check if running in production
 * @returns {boolean}
 */
export const isProduction = () => {
  return getEnvironment() === 'production';
};

/**
 * Check if running in development
 * @returns {boolean}
 */
export const isDevelopment = () => {
  return getEnvironment() === 'development';
};

/**
 * Log environment validation results
 */
export const logEnvironmentStatus = () => {
  const validation = validateEnvironment();
  const env = getEnvironment();

  console.log(`🌍 Environment: ${env.toUpperCase()}`);

  if (!validation.valid) {
    console.error('❌ Missing required environment variables:');
    validation.missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nℹ️  Please check your .env.local file or environment configuration.');
  } else {
    console.log('✅ All required environment variables are set');
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️  Optional environment variables not set:');
    validation.warnings.forEach(varName => {
      console.warn(`   - ${varName}`);
    });
    
    if (validation.warnings.includes('VITE_RADAR_API_KEY')) {
      console.warn('\nℹ️  Radar API is recommended for address autocomplete and geocoding.');
      console.warn('   Get your API key at: https://radar.com/dashboard');
    }
  }
};
