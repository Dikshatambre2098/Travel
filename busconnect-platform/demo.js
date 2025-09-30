// Demo script to show notification system output
console.log('=== BusConnect Advanced Notification System Demo ===\n');

// Simulate notification service
const NotificationService = {
    TYPES: {
        BOOKING_CONFIRMATION: 'booking_confirmation',
        BOOKING_CANCELLATION: 'booking_cancellation',
        REMINDER: 'reminder',
        PROMOTIONAL: 'promotional'
    },
    
    sendNotification: function(userId, type, data) {
        console.log(`📧 EMAIL NOTIFICATION:`);
        console.log(`To: user${userId}@example.com`);
        console.log(`Subject: ${this.getEmailTemplate(type, data).subject}`);
        console.log(`Body: ${this.getEmailTemplate(type, data).body}\n`);
        
        console.log(`📱 SMS NOTIFICATION:`);
        console.log(`To: +1234567${userId}`);
        console.log(`Message: ${this.getSMSMessage(type, data)}\n`);
        
        console.log(`🔔 PUSH NOTIFICATION:`);
        const push = this.getPushNotification(type, data);
        console.log(`Title: ${push.title}`);
        console.log(`Body: ${push.body}`);
        console.log(`Data: ${JSON.stringify(push.data)}\n`);
        console.log('─'.repeat(60) + '\n');
    },
    
    getEmailTemplate: function(type, data) {
        const templates = {
            [this.TYPES.BOOKING_CONFIRMATION]: {
                subject: 'Booking Confirmed - ' + data.bookingId,
                body: `Dear ${data.userName},\n\nYour booking has been confirmed!\n\nBooking ID: ${data.bookingId}\nRoute: ${data.route}\nDate: ${data.date}\nTime: ${data.time}\nSeats: ${data.seats}\n\nThank you for choosing BusConnect!`
            },
            [this.TYPES.BOOKING_CANCELLATION]: {
                subject: 'Booking Cancelled - ' + data.bookingId,
                body: `Dear ${data.userName},\n\nYour booking has been cancelled.\n\nBooking ID: ${data.bookingId}\nRefund Amount: ${data.refundAmount}\n\nRefund will be processed within 3-5 business days.`
            },
            [this.TYPES.REMINDER]: {
                subject: 'Travel Reminder - ' + data.bookingId,
                body: `Dear ${data.userName},\n\nReminder: Your journey is scheduled for ${data.date} at ${data.time}.\n\nRoute: ${data.route}\nBoarding Point: ${data.boardingPoint}\n\nHave a safe journey!`
            },
            [this.TYPES.PROMOTIONAL]: {
                subject: data.title,
                body: `Dear ${data.userName},\n\n${data.message}\n\nOffer valid till: ${data.validTill}\n\nBook now and save!`
            }
        };
        return templates[type];
    },
    
    getSMSMessage: function(type, data) {
        const messages = {
            [this.TYPES.BOOKING_CONFIRMATION]: `BusConnect: Booking confirmed! ID: ${data.bookingId}, ${data.route} on ${data.date} at ${data.time}`,
            [this.TYPES.BOOKING_CANCELLATION]: `BusConnect: Booking ${data.bookingId} cancelled. Refund: ${data.refundAmount}`,
            [this.TYPES.REMINDER]: `BusConnect: Journey reminder - ${data.route} today at ${data.time}. Board at ${data.boardingPoint}`,
            [this.TYPES.PROMOTIONAL]: `BusConnect: ${data.message} Valid till ${data.validTill}`
        };
        return messages[type];
    },
    
    getPushNotification: function(type, data) {
        const notifications = {
            [this.TYPES.BOOKING_CONFIRMATION]: {
                title: 'Booking Confirmed!',
                body: `Your booking ${data.bookingId} for ${data.route} is confirmed`,
                data: { bookingId: data.bookingId, type: type }
            },
            [this.TYPES.BOOKING_CANCELLATION]: {
                title: 'Booking Cancelled',
                body: `Booking ${data.bookingId} cancelled. Refund: ${data.refundAmount}`,
                data: { bookingId: data.bookingId, type: type }
            },
            [this.TYPES.REMINDER]: {
                title: 'Journey Reminder',
                body: `${data.route} at ${data.time} today`,
                data: { bookingId: data.bookingId, type: type }
            },
            [this.TYPES.PROMOTIONAL]: {
                title: data.title,
                body: data.message,
                data: { type: type, offerId: data.offerId }
            }
        };
        return notifications[type];
    }
};

// Demo scenarios
console.log('1. BOOKING CONFIRMATION NOTIFICATION:');
NotificationService.sendNotification('001', NotificationService.TYPES.BOOKING_CONFIRMATION, {
    userName: 'John Doe',
    bookingId: 'BC123456',
    route: 'Mumbai to Pune',
    date: '2024-01-15',
    time: '10:30 AM',
    seats: '2A, 2B'
});

console.log('2. BOOKING CANCELLATION NOTIFICATION:');
NotificationService.sendNotification('001', NotificationService.TYPES.BOOKING_CANCELLATION, {
    userName: 'John Doe',
    bookingId: 'BC123456',
    refundAmount: '₹500'
});

console.log('3. TRAVEL REMINDER NOTIFICATION:');
NotificationService.sendNotification('001', NotificationService.TYPES.REMINDER, {
    userName: 'John Doe',
    bookingId: 'BC123456',
    route: 'Mumbai to Pune',
    date: 'Today',
    time: '10:30 AM',
    boardingPoint: 'Central Bus Station'
});

console.log('4. PROMOTIONAL OFFER NOTIFICATION:');
NotificationService.sendNotification('001', NotificationService.TYPES.PROMOTIONAL, {
    userName: 'John Doe',
    title: 'Special Offer!',
    message: 'Get 20% off on your next booking',
    validTill: '2024-01-31',
    offerId: 'SAVE20'
});

console.log('✅ Advanced Notification System Demo Complete!');
console.log('📊 System Features:');
console.log('   • Multi-channel notifications (Email, SMS, Push)');
console.log('   • Real-time booking confirmations');
console.log('   • Automated travel reminders');
console.log('   • Promotional campaign management');
console.log('   • User preference controls');
console.log('   • Batch notification processing');