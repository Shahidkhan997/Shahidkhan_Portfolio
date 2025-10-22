const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    trim: true,
    enum: ['home', 'about', 'portfolio', 'contact', 'resume']
  },
  ipAddress: {
    type: String,
    trim: true,
    required: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  referrer: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'tablet', 'mobile', 'bot'],
    default: 'desktop'
  },
  browser: {
    name: String,
    version: String
  },
  os: {
    name: String,
    version: String
  }
}, {
  timestamps: true
});

// Indexes for faster querying
analyticsSchema.index({ page: 1, createdAt: -1 });
analyticsSchema.index({ ipAddress: 1 });
analyticsSchema.index({ 'browser.name': 1 });
analyticsSchema.index({ 'os.name': 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
