// Route Planning API endpoints
const express = require('express');
const router = express.Router();

// Mock data
let savedRoutes = [];
let busStops = [
    { id: 1, name: 'Central Station', lat: 19.0760, lng: 72.8777 },
    { id: 2, name: 'Airport Terminal', lat: 19.0896, lng: 72.8656 },
    { id: 3, name: 'Mall Junction', lat: 19.0728, lng: 72.8826 }
];

// Get bus stops near location
router.get('/bus-stops', (req, res) => {
    const { lat, lng, radius } = req.query;
    const nearbyStops = busStops.filter(stop => {
        const distance = Math.sqrt(
            Math.pow(stop.lat - parseFloat(lat), 2) + 
            Math.pow(stop.lng - parseFloat(lng), 2)
        ) * 111000;
        return distance <= parseInt(radius);
    });
    res.json(nearbyStops);
});

// Save route
router.post('/routes', (req, res) => {
    const routeData = req.body;
    routeData.id = Date.now();
    savedRoutes.push(routeData);
    res.json({ success: true, id: routeData.id });
});

// Get saved routes
router.get('/routes/:userId', (req, res) => {
    res.json(savedRoutes);
});

// Get traffic info
router.get('/traffic', (req, res) => {
    const trafficInfo = {
        status: 'moderate',
        delays: [
            { location: 'Highway Junction', delay: '5 mins' },
            { location: 'City Center', delay: '3 mins' }
        ]
    };
    res.json(trafficInfo);
});

module.exports = router;