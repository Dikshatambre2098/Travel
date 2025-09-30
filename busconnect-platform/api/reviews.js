// Reviews API endpoints
const express = require('express');
const router = express.Router();

// Mock data
let reviews = [
    {
        id: 1,
        routeId: 'route-1',
        userId: 'user-1',
        userName: 'John Doe',
        rating: 4,
        comment: 'Great route with scenic views. Bus was comfortable and on time.',
        date: '2024-01-15T10:30:00Z'
    },
    {
        id: 2,
        routeId: 'route-1',
        userId: 'user-2',
        userName: 'Jane Smith',
        rating: 5,
        comment: 'Excellent service! Clean bus and friendly staff.',
        date: '2024-01-10T14:20:00Z'
    }
];

// Get route reviews
router.get('/routes/:routeId/reviews', (req, res) => {
    const { routeId } = req.params;
    const routeReviews = reviews.filter(r => r.routeId === routeId);
    res.json(routeReviews);
});

// Get route summary
router.get('/routes/:routeId/summary', (req, res) => {
    const { routeId } = req.params;
    const routeReviews = reviews.filter(r => r.routeId === routeId);
    
    if (routeReviews.length === 0) {
        return res.json({ averageRating: 0, totalReviews: 0 });
    }
    
    const totalRating = routeReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / routeReviews.length;
    
    res.json({
        averageRating: averageRating,
        totalReviews: routeReviews.length
    });
});

// Submit review
router.post('/routes/:routeId/reviews', (req, res) => {
    const { routeId } = req.params;
    const reviewData = req.body;
    
    const newReview = {
        id: Date.now(),
        routeId: routeId,
        ...reviewData
    };
    
    reviews.push(newReview);
    res.json({ success: true, review: newReview });
});

// Check if user can review
router.get('/routes/:routeId/can-review/:userId', (req, res) => {
    const { routeId, userId } = req.params;
    const existingReview = reviews.find(r => r.routeId === routeId && r.userId === userId);
    
    res.json({ canReview: !existingReview });
});

module.exports = router;