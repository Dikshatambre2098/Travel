// Notification Controller for BusConnect App
angular.module('busConnectApp').controller('NotificationController', [
    '$scope', 'AdvancedNotificationService', 'StorageService',
    function($scope, AdvancedNotificationService, StorageService) {
        
        // Initialize scope variables
        $scope.preferences = {};
        $scope.notifications = [];
        $scope.loading = false;
        
        // Initialize controller
        $scope.init = function() {
            $scope.loadPreferences();
            $scope.loadNotificationHistory();
            $scope.registerPushNotifications();
        };
        
        // Load user notification preferences
        $scope.loadPreferences = function() {
            var userId = StorageService.get('currentUserId') || 'guest';
            $scope.preferences = AdvancedNotificationService.getPreferences(userId);
        };
        
        // Save notification preferences
        $scope.savePreferences = function() {
            var userId = StorageService.get('currentUserId') || 'guest';
            AdvancedNotificationService.updatePreferences(userId, $scope.preferences)
                .then(function() {
                    $scope.showMessage('Preferences saved successfully!', 'success');
                })
                .catch(function(error) {
                    $scope.showMessage('Error saving preferences', 'error');
                });
        };
        
        // Load notification history
        $scope.loadNotificationHistory = function() {
            $scope.notifications = StorageService.get('notification_history') || [];
        };
        
        // Register for push notifications
        $scope.registerPushNotifications = function() {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        return registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: $scope.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
                        });
                    })
                    .then(function(subscription) {
                        StorageService.set('push_subscription', subscription);
                    })
                    .catch(function(error) {
                        console.error('Push notification registration failed:', error);
                    });
            }
        };
        
        // Test notification functionality
        $scope.testNotification = function(type, channel) {
            var userId = StorageService.get('currentUserId') || 'guest';
            var testData = $scope.getTestData(type);
            var channels = channel ? [channel] : null;
            
            $scope.loading = true;
            AdvancedNotificationService.sendNotification(userId, type, testData, channels)
                .then(function() {
                    $scope.showMessage('Test notification sent!', 'success');
                })
                .catch(function(error) {
                    $scope.showMessage('Error sending notification', 'error');
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };
        
        // Get test data for different notification types
        $scope.getTestData = function(type) {
            var testData = {
                [AdvancedNotificationService.TYPES.BOOKING_CONFIRMATION]: {
                    userName: 'John Doe',
                    bookingId: 'BC123456',
                    route: 'Mumbai to Pune',
                    date: '2024-01-15',
                    time: '10:30 AM',
                    seats: '2A, 2B'
                },
                [AdvancedNotificationService.TYPES.BOOKING_CANCELLATION]: {
                    userName: 'John Doe',
                    bookingId: 'BC123456',
                    refundAmount: '₹500'
                },
                [AdvancedNotificationService.TYPES.REMINDER]: {
                    userName: 'John Doe',
                    bookingId: 'BC123456',
                    route: 'Mumbai to Pune',
                    date: 'Today',
                    time: '10:30 AM',
                    boardingPoint: 'Central Bus Station'
                },
                [AdvancedNotificationService.TYPES.PROMOTIONAL]: {
                    userName: 'John Doe',
                    title: 'Special Offer!',
                    message: 'Get 20% off on your next booking',
                    validTill: '2024-01-31',
                    offerId: 'SAVE20'
                }
            };
            
            return testData[type] || { userName: 'Test User', message: 'Test notification' };
        };
        
        // Utility function for push notifications
        $scope.urlBase64ToUint8Array = function(base64String) {
            var padding = '='.repeat((4 - base64String.length % 4) % 4);
            var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
            var rawData = window.atob(base64);
            var outputArray = new Uint8Array(rawData.length);
            
            for (var i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        };
        
        // Show message to user
        $scope.showMessage = function(message, type) {
            // Implementation depends on your notification display system
            console.log(type + ': ' + message);
        };
        
        // Initialize on load
        $scope.init();
    }
]);