const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
// Test endpoint to check IP and location (Admin only)
router.get('/check-ip', protect, authorize('admin', 'owner'), (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
    const cleanIP = ip.split(',')[0].replace(/^::ffff:/, '').trim();

    // 1. Check Vercel headers
    const vercelGeo = {
        country: req.headers['x-vercel-ip-country'],
        region: req.headers['x-vercel-ip-country-region'],
        city: req.headers['x-vercel-ip-city']
    };

    // 2. Lazy load geoip-lite for comparison
    const geoip = require('geoip-lite');
    const geo = geoip.lookup(cleanIP);

    res.json({
        cleaned_ip: cleanIP,
        vercel_geo: vercelGeo,
        geoip_result: geo,
    });
});

module.exports = router;
