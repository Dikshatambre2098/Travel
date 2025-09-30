// Advanced Notification Service for BusConnect App
angular.module('busConnectApp').service('AdvancedNotificationService', [
    '$http', '$q', 'StorageService',
    function($http, $q, StorageService) {
        
        var self = this;
        
        // Notification types
        self.TYPES = {
            BOOKING_CONFIRMATION: 'booking_confirmation',
            BOOKING_CANCELLATION: 'booking_cancellation',
            REMINDER: 'reminder',
            PROMOTIONAL: 'promotional'
        };
        
        // Notification channels
        self.CHANNELS = {
            EMAIL: 'email',
            SMS: 'sms',
            PUSH: 'push'
        };
        
        // Send notification through all enabled channels
        self.sendNotification = function(userId, type, data, channels) {
            var promises = [];
            channels = channels || [self.CHANNELS.EMAIL, self.CHANNELS.SMS, self.CHANNELS.PUSH];
            
            var userPrefs = StorageService.get('notification_preferences_' + userId) || {};
            
            channels.forEach(function(channel) {
                if (userPrefs[channel] !== false) {
                    switch(channel) {
                        case self.CHANNELS.EMAIL:
                            promises.push(self.sendEmail(userId, type, data));
                            break;
                        case self.CHANNELS.SMS:
                            promises.push(self.sendSMS(userId, type, data));
                            break;
                        case self.CHANNELS.PUSH:
                            promises.push(self.sendPush(userId, type, data));
                            break;
                    }
                }
            });
            
            return $q.all(promises);
        };
        
        // Email notification
        self.sendEmail = function(userId, type, data) {
            var template = self.getEmailTemplate(type, data);
            
            return $http.post('/api/notifications/email', {
                userId: userId,
                subject: template.subject,
                body: template.body,
                type: type
            });
        };
        
        // SMS notification
        self.sendSMS = function(userId, type, data) {
            var message = self.getSMSMessage(type, data);
            
            return $http.post('/api/notifications/sms', {
                userId: userId,
                message: message,
                type: type
            });
        };
        
        // Push notification
        self.sendPush = function(userId, type, data) {
            var notification = self.getPushNotification(type, data);
            
            return $http.post('/api/notifications/push', {
                userId: userId,
                title: notification.title,
                body: notification.body,
                data: notification.data,
                type: type
            });
        };
        
        // Get email template based on type
        self.getEmailTemplate = function(type, data) {
            var templates = {
                [self.TYPES.BOOKING_CONFIRMATION]: {
                    subject: 'Booking Confirmed - ' + data.bookingId,
                    body: `Dear ${data.userName},\n\nYour booking has been confirmed!\n\nBooking ID: ${data.bookingId}\nRoute: ${data.route}\nDate: ${data.date}\nTime: ${data.time}\nSeats: ${data.seats}\n\nThank you for choosing BusConnect!`
                },
                [self.TYPES.BOOKING_CANCELLATION]: {
                    subject: 'Booking Cancelled - ' + data.bookingId,
                    body: `Dear ${data.userName},\n\nYour booking has been cancelled.\n\nBooking ID: ${data.bookingId}\nRefund Amount: ${data.refundAmount}\n\nRefund will be processed within 3-5 business days.`
                },
                [self.TYPES.REMINDER]: {
                    subject: 'Travel Reminder - ' + data.bookingId,
                    body: `Dear ${data.userName},\n\nReminder: Your journey is scheduled for ${data.date} at ${data.time}.\n\nRoute: ${data.route}\nBoarding Point: ${data.boardingPoint}\n\nHave a safe journey!`
                },
                [self.TYPES.PROMOTIONAL]: {
                    subject: data.title,
                    body: `Dear ${data.userName},\n\n${data.message}\n\nOffer valid till: ${data.validTill}\n\nBook now and save!`
                }
            };
            
            return templates[type] || { subject: 'BusConnect Notification', body: data.message };
        };
        
        // Get SMS message based on type
        self.getSMSMessage = function(type, data) {
            var messages = {
                [self.TYPES.BOOKING_CONFIRMATION]: `BusConnect: Booking confirmed! ID: ${data.bookingId}, ${data.route} on ${data.date} at ${data.time}`,
                [self.TYPES.BOOKING_CANCELLATION]: `BusConnect: Booking ${data.bookingId} cancelled. Refund: ${data.refundAmount}`,
                [self.TYPES.REMINDER]: `BusConnect: Journey reminder - ${data.route} today at ${data.time}. Board at ${data.boardingPoint}`,
                [self.TYPES.PROMOTIONAL]: `BusConnect: ${data.message} Valid till ${data.validTill}`
            };
            
            return messages[type] || data.message;
        };
        
        // Get push notification based on type
        self.getPushNotification = function(type, data) {
            var notifications = {
                [self.TYPES.BOOKING_CONFIRMATION]: {
                    title: 'Booking Confirmed!',
                    body: `Your booking ${data.bookingId} for ${data.route} is confirmed`,
                    data: { bookingId: data.bookingId, type: type }
                },
                [self.TYPES.BOOKING_CANCELLATION]: {
                    title: 'Booking Cancelled',
                    body: `Booking ${data.bookingId} cancelled. Refund: ${data.refundAmount}`,
                    data: { bookingId: data.bookingId, type: type }
                },
                [self.TYPES.REMINDER]: {
                    title: 'Journey Reminder',
                    body: `${data.route} at ${data.time} today`,
                    data: { bookingId: data.bookingId, type: type }
                },
                [self.TYPES.PROMOTIONAL]: {
                    title: data.title,
                    body: data.message,
                    data: { type: type, offerId: data.offerId }
                }
            };
            
            return notifications[type] || { title: 'BusConnect', body: data.message, data: { type: type } };
        };
        
        // Schedule reminder notifications
        self.scheduleReminder = function(bookingData, reminderTime) {
            return $http.post('/api/notifications/schedule', {
                userId: bookingData.userId,
                type: self.TYPES.REMINDER,
                data: bookingData,
                scheduleTime: reminderTime
            });
        };
        
        // Send promotional notifications to user segments
        self.sendPromotionalBatch = function(userSegment, promoData) {
            return $http.post('/api/notifications/promotional-batch', {
                userSegment: userSegment,
                type: self.TYPES.PROMOTIONAL,
                data: promoData
            });
        };
        
        // Update user notification preferences
        self.updatePreferences = function(userId, preferences) {
            StorageService.set('notification_preferences_' + userId, preferences);
            return $http.put('/api/users/' + userId + '/notification-preferences', preferences);
        };
        
        // Get user notification preferences
        self.getPreferences = function(userId) {
            return StorageService.get('notification_preferences_' + userId) || {
                email: true,
                sms: true,
                push: true,
                promotional: true
            };
        };
    }
]);