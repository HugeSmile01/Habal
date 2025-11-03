/**
 * Device information collection utility for security and fraud prevention
 */

/**
 * Get browser information
 */
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  // Detect browser
  if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
    browserName = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    browserName = 'Safari';
    browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Edg') > -1) {
    browserName = 'Edge';
    browserVersion = userAgent.match(/Edg\/(\d+\.\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
    browserName = 'Internet Explorer';
    browserVersion = userAgent.match(/(?:MSIE |rv:)(\d+\.\d+)/)?.[1] || 'Unknown';
  }

  return {
    name: browserName,
    version: browserVersion,
    userAgent: userAgent
  };
};

/**
 * Get operating system information
 */
export const getOSInfo = () => {
  const userAgent = navigator.userAgent;
  let osName = 'Unknown';
  let osVersion = 'Unknown';

  if (userAgent.indexOf('Win') > -1) {
    osName = 'Windows';
    if (userAgent.indexOf('Windows NT 10.0') > -1) osVersion = '10';
    else if (userAgent.indexOf('Windows NT 6.3') > -1) osVersion = '8.1';
    else if (userAgent.indexOf('Windows NT 6.2') > -1) osVersion = '8';
    else if (userAgent.indexOf('Windows NT 6.1') > -1) osVersion = '7';
  } else if (userAgent.indexOf('Mac') > -1) {
    osName = 'macOS';
    osVersion = userAgent.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || 'Unknown';
  } else if (userAgent.indexOf('Linux') > -1) {
    osName = 'Linux';
  } else if (userAgent.indexOf('Android') > -1) {
    osName = 'Android';
    osVersion = userAgent.match(/Android (\d+\.\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
    osName = 'iOS';
    osVersion = userAgent.match(/OS (\d+[._]\d+)/)?.[1]?.replace('_', '.') || 'Unknown';
  }

  return {
    name: osName,
    version: osVersion
  };
};

/**
 * Get device type information
 */
export const getDeviceType = () => {
  const userAgent = navigator.userAgent;
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'Tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'Mobile';
  }
  return 'Desktop';
};

/**
 * Get screen information
 */
export const getScreenInfo = () => {
  return {
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    colorDepth: window.screen.colorDepth,
    pixelDepth: window.screen.pixelDepth,
    orientation: window.screen.orientation?.type || 'Unknown'
  };
};

/**
 * Get timezone information
 */
export const getTimezoneInfo = () => {
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offset: new Date().getTimezoneOffset()
  };
};

/**
 * Get language information
 */
export const getLanguageInfo = () => {
  return {
    language: navigator.language,
    languages: navigator.languages
  };
};

/**
 * Get connection information
 */
export const getConnectionInfo = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType || 'Unknown',
      downlink: connection.downlink || 'Unknown',
      rtt: connection.rtt || 'Unknown',
      saveData: connection.saveData || false
    };
  }
  
  return {
    effectiveType: 'Unknown',
    downlink: 'Unknown',
    rtt: 'Unknown',
    saveData: false
  };
};

/**
 * Generate a device fingerprint (simple version)
 */
export const generateDeviceFingerprint = () => {
  const browser = getBrowserInfo();
  const os = getOSInfo();
  const screen = getScreenInfo();
  const timezone = getTimezoneInfo();
  const language = getLanguageInfo();
  
  const fingerprintData = [
    browser.name,
    browser.version,
    os.name,
    os.version,
    screen.width,
    screen.height,
    screen.colorDepth,
    timezone.timezone,
    language.language
  ].join('|');
  
  // Simple hash function (not cryptographic, just for fingerprinting)
  let hash = 0;
  for (let i = 0; i < fingerprintData.length; i++) {
    const char = fingerprintData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
};

/**
 * Collect all device information
 */
export const collectDeviceInfo = () => {
  return {
    browser: getBrowserInfo(),
    os: getOSInfo(),
    deviceType: getDeviceType(),
    screen: getScreenInfo(),
    timezone: getTimezoneInfo(),
    language: getLanguageInfo(),
    connection: getConnectionInfo(),
    fingerprint: generateDeviceFingerprint(),
    timestamp: new Date().toISOString(),
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
    maxTouchPoints: navigator.maxTouchPoints || 0
  };
};

/**
 * Check if geolocation is available
 */
export const isGeolocationAvailable = () => {
  return 'geolocation' in navigator;
};

/**
 * Request geolocation permission and get current position
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!isGeolocationAvailable()) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp).toISOString()
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

/**
 * Watch position for real-time tracking
 */
export const watchLocation = (onSuccess, onError) => {
  if (!isGeolocationAvailable()) {
    onError(new Error('Geolocation is not supported by this browser'));
    return null;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(position.timestamp).toISOString()
      });
    },
    (error) => {
      onError(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );

  return watchId;
};

/**
 * Stop watching location
 */
export const stopWatchingLocation = (watchId) => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
};
