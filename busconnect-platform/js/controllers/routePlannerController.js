// Route Planner Controller for BusConnect App
angular.module('busConnectApp').controller('RoutePlannerController', [
    '$scope', 'RoutePlanningService', 'NotificationService',
    function($scope, RoutePlanningService, NotificationService) {
        
        // Initialize variables
        $scope.map = null;
        $scope.directionsRenderer = null;
        $scope.origin = '';
        $scope.destination = '';
        $scope.waypoints = [];
        $scope.routes = [];
        $scope.selectedRoute = null;
        $scope.loading = false;
        $scope.trafficLayer = null;
        
        // Initialize controller
        $scope.init = function() {
            $scope.initMap();
            $scope.loadSavedRoutes();
        };
        
        // Initialize map
        $scope.initMap = function() {
            $scope.map = RoutePlanningService.initMap('route-map');
            $scope.directionsRenderer = new google.maps.DirectionsRenderer({
                draggable: true,
                panel: document.getElementById('directions-panel')
            });
            $scope.directionsRenderer.setMap($scope.map);
            
            // Traffic layer
            $scope.trafficLayer = new google.maps.TrafficLayer();
            
            // Add click listener for waypoints
            $scope.map.addListener('click', function(event) {
                if ($scope.addingWaypoint) {
                    $scope.addWaypoint(event.latLng);
                }
            });
        };
        
        // Plan route
        $scope.planRoute = function() {
            if (!$scope.origin || !$scope.destination) {
                NotificationService.show('Please enter origin and destination', 'warning');
                return;
            }
            
            $scope.loading = true;
            
            var waypoints = $scope.waypoints.map(function(wp) {
                return {
                    location: wp.location,
                    stopover: true
                };
            });
            
            RoutePlanningService.calculateRoute($scope.origin, $scope.destination, waypoints)
                .then(function(result) {
                    $scope.routes = result.routes;
                    $scope.selectedRoute = result.routes[0];
                    $scope.directionsRenderer.setDirections(result);
                    $scope.displayRouteInfo();
                    $scope.loading = false;
                })
                .catch(function(error) {
                    NotificationService.show(error, 'error');
                    $scope.loading = false;
                });
        };
        
        // Add waypoint
        $scope.addWaypoint = function(location) {
            var waypoint = {
                location: location,
                name: 'Waypoint ' + ($scope.waypoints.length + 1)
            };
            $scope.waypoints.push(waypoint);
            $scope.addingWaypoint = false;
            $scope.$apply();
        };
        
        // Remove waypoint
        $scope.removeWaypoint = function(index) {
            $scope.waypoints.splice(index, 1);
            if ($scope.routes.length > 0) {
                $scope.planRoute();
            }
        };
        
        // Toggle waypoint mode
        $scope.toggleWaypointMode = function() {
            $scope.addingWaypoint = !$scope.addingWaypoint;
            $scope.map.setOptions({
                cursor: $scope.addingWaypoint ? 'crosshair' : 'default'
            });
        };
        
        // Select route
        $scope.selectRoute = function(routeIndex) {
            $scope.selectedRoute = $scope.routes[routeIndex];
            var result = {
                routes: [$scope.selectedRoute]
            };
            $scope.directionsRenderer.setDirections(result);
            $scope.displayRouteInfo();
        };
        
        // Display route information
        $scope.displayRouteInfo = function() {
            if (!$scope.selectedRoute) return;
            
            var route = $scope.selectedRoute;
            var leg = route.legs[0];
            
            $scope.routeInfo = {
                distance: leg.distance.text,
                duration: leg.duration.text,
                steps: leg.steps.length,
                trafficDuration: leg.duration_in_traffic ? leg.duration_in_traffic.text : null
            };
        };
        
        // Toggle traffic layer
        $scope.toggleTraffic = function() {
            if ($scope.trafficLayer.getMap()) {
                $scope.trafficLayer.setMap(null);
                $scope.showTraffic = false;
            } else {
                $scope.trafficLayer.setMap($scope.map);
                $scope.showTraffic = true;
            }
        };
        
        // Search places
        $scope.searchPlaces = function(query, field) {
            if (query.length < 3) return;
            
            RoutePlanningService.searchPlaces(query, $scope.map.getCenter())
                .then(function(results) {
                    $scope[field + 'Suggestions'] = results.slice(0, 5);
                });
        };
        
        // Select suggestion
        $scope.selectSuggestion = function(place, field) {
            $scope[field] = place.formatted_address;
            $scope[field + 'Suggestions'] = [];
        };
        
        // Save route
        $scope.saveRoute = function() {
            if (!$scope.selectedRoute) {
                NotificationService.show('No route selected to save', 'warning');
                return;
            }
            
            var routeData = {
                name: $scope.routeName || 'Route ' + new Date().toLocaleDateString(),
                origin: $scope.origin,
                destination: $scope.destination,
                waypoints: $scope.waypoints,
                route: $scope.selectedRoute,
                createdAt: new Date()
            };
            
            RoutePlanningService.saveRoute(routeData)
                .then(function() {
                    NotificationService.show('Route saved successfully!', 'success');
                    $scope.loadSavedRoutes();
                    $scope.routeName = '';
                })
                .catch(function(error) {
                    NotificationService.show('Failed to save route', 'error');
                });
        };
        
        // Load saved routes
        $scope.loadSavedRoutes = function() {
            var userId = 'current-user'; // Replace with actual user ID
            RoutePlanningService.getSavedRoutes(userId)
                .then(function(response) {
                    $scope.savedRoutes = response.data;
                })
                .catch(function(error) {
                    console.error('Failed to load saved routes:', error);
                });
        };
        
        // Load saved route
        $scope.loadSavedRoute = function(savedRoute) {
            $scope.origin = savedRoute.origin;
            $scope.destination = savedRoute.destination;
            $scope.waypoints = savedRoute.waypoints || [];
            $scope.planRoute();
        };
        
        // Clear route
        $scope.clearRoute = function() {
            $scope.origin = '';
            $scope.destination = '';
            $scope.waypoints = [];
            $scope.routes = [];
            $scope.selectedRoute = null;
            $scope.routeInfo = null;
            $scope.directionsRenderer.setDirections({routes: []});
        };
        
        // Initialize on load
        $scope.init();
    }
]);