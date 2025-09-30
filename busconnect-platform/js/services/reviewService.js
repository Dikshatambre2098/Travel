// Review Service for BusConnect App
angular.module('busConnectApp').service('ReviewService', [
    '$http', '$q', 'StorageService',
    function($http, $q, StorageService) {
        
        var self = this;
        
        // Submit route review
        self.submitReview = function(routeId, reviewData) {
            return $http.post('/api/routes/' + routeId + '/reviews', reviewData);
        };
        
        // Get route reviews
        self.getRouteReviews = function(routeId) {
            return $http.get('/api/routes/' + routeId + '/reviews');
        };
        
        // Get route rating summary
        self.getRouteSummary = function(routeId) {
            return $http.get('/api/routes/' + routeId + '/summary');
        };
        
        // Check if user can review route
        self.canUserReview = function(routeId, userId) {
            return $http.get('/api/routes/' + routeId + '/can-review/' + userId);
        };
        
        // Get user's review for route
        self.getUserReview = function(routeId, userId) {
            return $http.get('/api/routes/' + routeId + '/user-review/' + userId);
        };
        
        // Update existing review
        self.updateReview = function(reviewId, reviewData) {
            return $http.put('/api/reviews/' + reviewId, reviewData);
        };
        
        // Delete review
        self.deleteReview = function(reviewId) {
            return $http.delete('/api/reviews/' + reviewId);
        };
        
        // Get popular routes by rating
        self.getTopRatedRoutes = function(limit) {
            return $http.get('/api/routes/top-rated', {
                params: { limit: limit || 10 }
            });
        };
    }
]);