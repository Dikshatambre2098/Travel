// Booking Notification Service for BusConnect App
angular.module('busConnectApp').service('BookingNotificationService', [
    'AdvancedNotificationService', '$timeout',
    function(AdvancedNotificationService, $timeout) {
        
        var self = this;
        
        // Handle booking confirmation notifications
        self.onBookingConfirmed = function(bookingData) {
            // Send immediate confirmation
            AdvancedNotificationService.sendNotification(
                bookingData.userId,
                AdvancedNotificationService.TYPES.BOOKING_CONFIRMATION,
                bookingData
            );
            
            // Schedule reminder notifications
            self.scheduleReminders(bookingData);
        };
        
        // Handle booking cancellation notifications
        self.onBookingCancelled = function(bookingData) {
            AdvancedNotificationService.sendNotification(
                bookingData.userId,
                AdvancedNotificationService.TYPES.BOOKING_CANCELLATION,
                bookingData
            );
        };
        
        // Schedule reminder notifications
        self.scheduleReminders = function(bookingData) {
            var journeyDate = new Date(bookingData.date + ' ' + bookingData.time);
            var now = new Date();
            
            // 24 hours before
            var reminder24h = new Date(journeyDate.getTime() - 24 * 60 * 60 * 1000);
            if (reminder24h > now) {
                AdvancedNotificationService.scheduleReminder(bookingData, reminder24h);
            }
            
            // 2 hours before
            var reminder2h = new Date(journeyDate.getTime() - 2 * 60 * 60 * 1000);
            if (reminder2h > now) {
                AdvancedNotificationService.scheduleReminder(bookingData, reminder2h);
            }
        };
        
        // Send promotional notifications
        self.sendPromotionalOffers = function(userSegment, offerData) {
            return AdvancedNotificationService.sendPromotionalBatch(userSegment, offerData);
        };
    }
]);