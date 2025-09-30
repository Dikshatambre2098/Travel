// Review Controller for BusConnect App
angular.module('busConnectApp').controller('ReviewController', [
    '$scope', 'ReviewService', 'NotificationService', 'StorageService',
    function($scope, ReviewService, NotificationService, StorageService) {
        
        // Initialize variables
        $scope.routeId = null;
        $scope.reviews = [];
        $scope.routeSummary = {};
        $scope.userReview = null;
        $scope.canReview = false;
        $scope.loading = false;
        $scope.showReviewForm = false;
        
        // New review form
        $scope.newReview = {
            rating: 0,
            title: '',
            comment: '',
            aspects: {
                comfort: 0,
                punctuality: 0,
                cleanliness: 0,
                staff: 0,
                value: 0
            }
        };
        
        // Initialize controller
        $scope.init = function(routeId) {
            $scope.routeId = routeId;
            $scope.loadRouteReviews();
            $scope.loadRouteSummary();
            $scope.checkUserReviewStatus();
        };
        
        // Load route reviews
        $scope.loadRouteReviews = function() {
            $scope.loading = true;
            ReviewService.getRouteReviews($scope.routeId)
                .then(function(response) {
                    $scope.reviews = response.data;
                    $scope.loading = false;
                })
                .catch(function(error) {
                    console.error('Error loading reviews:', error);
                    $scope.loading = false;
                });
        };
        
        // Load route summary
        $scope.loadRouteSummary = function() {
            ReviewService.getRouteSummary($scope.routeId)
                .then(function(response) {
                    $scope.routeSummary = response.data;
                })
                .catch(function(error) {
                    console.error('Error loading route summary:', error);
                });
        };
        
        // Check if user can review
        $scope.checkUserReviewStatus = function() {
            var userId = StorageService.get('currentUserId') || 'guest';
            
            ReviewService.canUserReview($scope.routeId, userId)
                .then(function(response) {
                    $scope.canReview = response.data.canReview;
                })
                .catch(function(error) {
                    console.error('Error checking review status:', error);
                });
            
            // Check for existing user review
            ReviewService.getUserReview($scope.routeId, userId)
                .then(function(response) {
                    $scope.userReview = response.data;
                })
                .catch(function(error) {
                    // No existing review
                });
        };
        
        // Set rating
        $scope.setRating = function(rating, aspect) {
            if (aspect) {
                $scope.newReview.aspects[aspect] = rating;
            } else {
                $scope.newReview.rating = rating;
            }
        };
        
        // Submit review
        $scope.submitReview = function() {
            if (!$scope.newReview.rating || !$scope.newReview.comment.trim()) {
                NotificationService.show('Please provide rating and comment', 'warning');
                return;
            }
            
            var userId = StorageService.get('currentUserId') || 'guest';
            var reviewData = {
                userId: userId,
                userName: StorageService.get('currentUserName') || 'Anonymous',
                rating: $scope.newReview.rating,
                title: $scope.newReview.title,
                comment: $scope.newReview.comment.trim(),
                aspects: $scope.newReview.aspects,
                date: new Date().toISOString()
            };
            
            $scope.loading = true;
            ReviewService.submitReview($scope.routeId, reviewData)
                .then(function(response) {
                    NotificationService.show('Review submitted successfully!', 'success');
                    $scope.resetReviewForm();
                    $scope.loadRouteReviews();
                    $scope.loadRouteSummary();
                    $scope.checkUserReviewStatus();
                    $scope.loading = false;
                })
                .catch(function(error) {
                    NotificationService.show('Failed to submit review', 'error');
                    $scope.loading = false;
                });
        };
        
        // Reset review form
        $scope.resetReviewForm = function() {
            $scope.newReview = {
                rating: 0,
                title: '',
                comment: '',
                aspects: {
                    comfort: 0,
                    punctuality: 0,
                    cleanliness: 0,
                    staff: 0,
                    value: 0
                }
            };
            $scope.showReviewForm = false;
        };
        
        // Generate star array for display
        $scope.getStars = function(rating) {
            return new Array(Math.floor(rating));
        };
        
        // Get rating percentage for progress bars
        $scope.getRatingPercentage = function(rating) {
            return (rating / 5) * 100;
        };
        
        // Format date
        $scope.formatDate = function(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };
        
        // Toggle review form
        $scope.toggleReviewForm = function() {
            $scope.showReviewForm = !$scope.showReviewForm;
        };
    }
]);