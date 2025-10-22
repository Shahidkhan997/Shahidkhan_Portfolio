const express = require('express');
const router = express.Router();
const Analytics = require('../models/analytics.model');
const createError = require('http-errors');
const useragent = require('express-useragent');

// Track page view
router.post('/pageview', async (req, res, next) => {
  try {
    const { page } = req.body;
    
    if (!page) {
      throw createError(400, 'Page name is required');
    }

    // Parse user agent
    const ua = useragent.parse(req.headers['user-agent']);
    
    // Determine device type
    let deviceType = 'desktop';
    if (ua.isMobile) {
      deviceType = 'mobile';
    } else if (ua.isTablet) {
      deviceType = 'tablet';
    } else if (ua.isBot) {
      deviceType = 'bot';
    }

    const newAnalytics = new Analytics({
      page: page.toLowerCase(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      referrer: req.get('referer') || 'direct',
      deviceType,
      browser: {
        name: ua.browser,
        version: ua.version
      },
      os: {
        name: ua.os,
        version: ua.version
      }
      // Note: For country and city, you'll need to use a geoip service
      // like 'geoip-lite' or a third-party API
    });

    await newAnalytics.save();

    res.status(201).json({
      success: true,
      message: 'Page view recorded',
      data: {
        id: newAnalytics._id,
        page: newAnalytics.page,
        timestamp: newAnalytics.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get analytics summary (protected route - add authentication in production)
router.get('/summary', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const [
      totalViews,
      viewsByPage,
      viewsByDevice,
      viewsByBrowser,
      viewsByOS,
      recentActivity
    ] = await Promise.all([
      // Total views
      Analytics.countDocuments(match),
      
      // Views by page
      Analytics.aggregate([
        { $match: match },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Views by device type
      Analytics.aggregate([
        { $match: match },
        { $group: { _id: '$deviceType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Views by browser
      Analytics.aggregate([
        { $match: match },
        { $group: { _id: '$browser.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Views by OS
      Analytics.aggregate([
        { $match: match },
        { $group: { _id: '$os.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Recent activity
      Analytics.find(match)
        .sort({ createdAt: -1 })
        .limit(10)
        .select('page ipAddress deviceType browser os createdAt')
    ]);

    res.json({
      success: true,
      data: {
        totalViews,
        viewsByPage,
        viewsByDevice,
        viewsByBrowser,
        viewsByOS,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get page view trends (e.g., daily views for the last 30 days)
router.get('/trends', async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days, 10));
    
    const trends = await Analytics.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
