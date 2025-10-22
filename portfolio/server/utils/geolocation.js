const axios = require('axios');

// Free IP geolocation service (you might want to use a paid service for production)
const GEOLOCATION_API = 'http://ip-api.com/json/';

/**
 * Get geolocation data for an IP address
 * @param {string} ip - IP address to look up
 * @returns {Promise<Object>} - Geolocation data
 */
async function getGeolocation(ip) {
  try {
    // Skip localhost or private IPs
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return {
        country: 'Local',
        city: 'Development',
        isp: 'Local Network',
        timezone: 'UTC'
      };
    }

    const response = await axios.get(`${GEOLOCATION_API}${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
    
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to get geolocation data');
    }

    return {
      country: response.data.country || 'Unknown',
      countryCode: response.data.countryCode || '',
      region: response.data.regionName || '',
      city: response.data.city || 'Unknown',
      zip: response.data.zip || '',
      lat: response.data.lat,
      lon: response.data.lon,
      timezone: response.data.timezone || 'UTC',
      isp: response.data.isp || 'Unknown ISP',
      org: response.data.org || '',
      as: response.data.as || ''
    };
  } catch (error) {
    console.error('Geolocation error:', error.message);
    return {
      country: 'Unknown',
      city: 'Unknown',
      isp: 'Unknown',
      timezone: 'UTC'
    };
  }
}

module.exports = {
  getGeolocation
};
