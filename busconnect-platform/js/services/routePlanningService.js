// Route Planning Service for BusConnect App
angular.module('busConnectApp').service('RoutePlanningService', [
    '$http', '$q',
    function($http, $q) {
        
        var self = this;
        
        // Initialize map
        self.initMap = function(containerId) {
            var map = new google.maps.Map(document.getElementById(containerId), {
                zoom: 10,
                center: { lat: 19.0760, lng: 72.8777 }, // Mumbai
                mapTypeControl: true,
                streetViewControl: false
            });
            
            return map;
        };
        
        // Calculate route
        self.calculateRoute = function(origin, destination, waypoints, travelMode) {
            var deferred = $q.defer();
            var directionsService = new google.maps.DirectionsService();
            
            var request = {
                origin: origin,
                destination: destination,
                waypoints: waypoints || [],
                travelMode: travelMode || google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true,
                avoidHighways: false,
                avoidTolls: false
            };
            
            directionsService.route(request, function(result, status) {
                if (status === 'OK') {
                    deferred.resolve(result);
                } else {
                    deferred.reject('Route calculation failed: ' + status);
                }
            });
            
            return deferred.promise;
        };
        
        // Get traffic info
        self.getTrafficInfo = function(route) {
            return $http.get('/api/traffic', {
                params: {
                    route: JSON.stringify(route.overview_path)
                }
            });
        };
        
        // Search places
        self.searchPlaces = function(query, location) {
            var deferred = $q.defer();
            var service = new google.maps.places.PlacesService(document.createElement('div'));
            
            service.textSearch({
                query: query,
                location: location,
                radius: 50000
            }, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    deferred.resolve(results);
                } else {
                    deferred.reject('Places search failed');
                }
            });
            
            return deferred.promise;
        };
        
        // Get bus stops near location
        self.getBusStops = function(location, radius) {
            return $http.get('/api/bus-stops', {
                params: {
                    lat: location.lat,
                    lng: location.lng,
                    radius: radius || 1000
                }
            });
        };
        
        // Save route
        self.saveRoute = function(routeData) {
            return $http.post('/api/routes', routeData);
        };
        
        // Get saved routes
        self.getSavedRoutes = function(userId) {
            return $http.get('/api/routes/' + userId);
        };
    }
]);