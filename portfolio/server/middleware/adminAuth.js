const createError = require('http-errors');

// Simple admin authentication middleware
// For production, use proper JWT or session-based authentication
const adminAuth = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // Change this in production

  const { password } = req.headers;

  if (!password || password !== adminPassword) {
    return next(createError(401, 'Unauthorized: Invalid admin password'));
  }

  next();
};

module.exports = adminAuth;
