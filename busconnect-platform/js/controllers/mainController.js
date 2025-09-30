// Main Controller for BusConnect App
angular.module('busConnectApp').controller('MainController', [
    '$scope',
    function($scope) {
        
        // Initialize scope variables
        $scope.activeSection = 'home';
        $scope.mobileMenuOpen = false;
        $scope.featuredStories = [];
        
        // Set active section
        $scope.setActiveSection = function(section) {
            console.log('Switching to section:', section);
            $scope.activeSection = section;
            $scope.mobileMenuOpen = false;
        };
        
        // Debug - log when controller loads
        console.log('MainController loaded, activeSection:', $scope.activeSection);
        
        // Toggle mobile menu
        $scope.toggleMobileMenu = function() {
            $scope.mobileMenuOpen = !$scope.mobileMenuOpen;
        };
        
        // Initialize featured stories
        $scope.featuredStories = [
            {
                id: 1,
                title: 'Amazing Journey to Goa',
                route: 'Mumbai → Goa',
                author: 'Priya Sharma',
                likes: 24
            },
            {
                id: 2,
                title: 'Mountain Adventure to Manali',
                route: 'Delhi → Manali',
                author: 'Arjun Patel',
                likes: 18
            },
            {
                id: 3,
                title: 'Budget Trip to Rajasthan',
                route: 'Jaipur → Udaipur',
                author: 'Vikram Singh',
                likes: 32
            }
        ];
    }
]);