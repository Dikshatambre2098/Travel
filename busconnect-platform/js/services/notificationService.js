// Notification Service for BusConnect Platform
class NotificationService {
    constructor() {
        this.preferences = this.loadPreferences();
        this.initializePushNotifications();
    }

    // Load notification preferences from localStorage
    loadPreferences() {
        const defaultPreferences = {
            channels: {
                email: true,
                sms: true,
                push: true
            },
            types: {
                bookingConfirmations: true,
                cancellationAlerts: true,
                travelReminders: true,
                promotionalOffers: true,
                routeUpdates: true
            }
        };
        
        const saved = localStorage.getItem('notificationPreferences');
        return saved ? JSON.parse(saved) : defaultPreferences;
    }

    // Initialize push notifications
    initializePushNotifications() {
        if ('Notification' in window && this.preferences.channels.push) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }

    // Send notification through multiple channels
    async sendNotification(type, title, message, data = {}) {
        if (!this.preferences.types[type]) {
            return;
        }

        const notification = {
            id: this.generateId(),
            type,
            title,
            message,
            timestamp: new Date().toISOString(),
            read: false,
            data
        };

        // Send through enabled channels
        if (this.preferences.channels.email) {
            await this.sendEmailNotification(notification);
        }

        if (this.preferences.channels.sms) {
            await this.sendSMSNotification(notification);
        }

        if (this.preferences.channels.push) {
            this.sendPushNotification(notification);
        }

        // Store notification locally
        this.storeNotification(notification);
    }

    // Send email notification
    async sendEmailNotification(notification) {
        try {
            // Simulate API call to email service
            const response = await fetch('/api/notifications/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: this.getUserEmail(),
                    subject: notification.title,
                    body: this.generateEmailTemplate(notification),
                    type: notification.type
                })
            });

            if (response.ok) {
                console.log('Email notification sent successfully');
            }
        } catch (error) {
            console.error('Failed to send email notification:', error);
        }
    }

    // Send SMS notification
    async sendSMSNotification(notification) {
        try {
            // Simulate API call to SMS service
            const response = await fetch('/api/notifications/sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: this.getUserPhone(),
                    message: `${notification.title}: ${notification.message}`,
                    type: notification.type
                })
            });

            if (response.ok) {
                console.log('SMS notification sent successfully');
            }
        } catch (error) {
            console.error('Failed to send SMS notification:', error);
        }
    }

    // Send push notification
    sendPushNotification(notification) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const pushNotification = new Notification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico',
                badge: '/badge-icon.png',
                tag: notification.type,
                data: notification.data
            });

            pushNotification.onclick = () => {
                window.focus();
                this.handleNotificationClick(notification);
                pushNotification.close();
            };

            // Auto close after 5 seconds
            setTimeout(() => {
                pushNotification.close();
            }, 5000);
        }
    }

    // Store notification in local storage
    storeNotification(notification) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.unshift(notification);
        
        // Keep only last 50 notifications
        if (notifications.length > 50) {
            notifications.splice(50);
        }
        
        localStorage.setItem('notifications', JSON.stringify(notifications));
        this.updateNotificationUI();
    }

    // Update notification UI
    updateNotificationUI() {
        const notificationsList = document.querySelector('.notifications-list');
        if (!notificationsList) return;

        const notifications = this.getStoredNotifications();
        notificationsList.innerHTML = '';

        notifications.forEach(notification => {
            const notificationElement = this.createNotificationElement(notification);
            notificationsList.appendChild(notificationElement);
        });
    }

    // Create notification element
    createNotificationElement(notification) {
        const element = document.createElement('div');
        element.className = `notification-item ${!notification.read ? 'unread' : ''}`;
        
        const iconClass = this.getIconClass(notification.type);
        const timeAgo = this.getTimeAgo(notification.timestamp);

        element.innerHTML = `
            <div class="notification-icon ${notification.type}">
                <i class="${iconClass}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${timeAgo}</span>
            </div>
        `;

        element.onclick = () => {
            this.markAsRead(notification.id);
            this.handleNotificationClick(notification);
        };

        return element;
    }

    // Get icon class for notification type
    getIconClass(type) {
        const iconMap = {
            bookingConfirmations: 'fas fa-ticket-alt',
            cancellationAlerts: 'fas fa-times-circle',
            travelReminders: 'fas fa-clock',
            promotionalOffers: 'fas fa-gift',
            routeUpdates: 'fas fa-route'
        };
        return iconMap[type] || 'fas fa-bell';
    }

    // Get time ago string
    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }

    // Handle notification click
    handleNotificationClick(notification) {
        switch (notification.type) {
            case 'bookingConfirmations':
                // Navigate to booking details
                if (notification.data.bookingId) {
                    this.showBookingDetails(notification.data.bookingId);
                }
                break;
            case 'travelReminders':
                // Navigate to travel details
                showSection('booking');
                break;
            case 'promotionalOffers':
                // Navigate to offers page
                showSection('booking');
                break;
            default:
                // Default action
                break;
        }
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notifications = this.getStoredNotifications();
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
            this.updateNotificationUI();
        }
    }

    // Mark all notifications as read
    markAllAsRead() {
        const notifications = this.getStoredNotifications();
        notifications.forEach(n => n.read = true);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        this.updateNotificationUI();
    }

    // Get stored notifications
    getStoredNotifications() {
        return JSON.parse(localStorage.getItem('notifications') || '[]');
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Get user email (placeholder)
    getUserEmail() {
        return localStorage.getItem('userEmail') || 'user@example.com';
    }

    // Get user phone (placeholder)
    getUserPhone() {
        return localStorage.getItem('userPhone') || '+91 9876543210';
    }

    // Generate email template
    generateEmailTemplate(notification) {
        return `
            <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #007bff; color: white; padding: 20px; text-align: center;">
                        <h1>BusConnect</h1>
                    </div>
                    <div style="padding: 20px;">
                        <h2>${notification.title}</h2>
                        <p>${notification.message}</p>
                        ${notification.data.bookingId ? `<p><strong>Booking ID:</strong> ${notification.data.bookingId}</p>` : ''}
                        <hr>
                        <p style="color: #666; font-size: 12px;">
                            This is an automated message from BusConnect. Please do not reply to this email.
                        </p>
                    </div>
                </body>
            </html>
        `;
    }

    // Schedule reminder notification
    scheduleReminder(bookingData, reminderTime) {
        const reminderDelay = new Date(reminderTime) - new Date();
        
        if (reminderDelay > 0) {
            setTimeout(() => {
                this.sendNotification(
                    'travelReminders',
                    'Travel Reminder',
                    `Your bus ${bookingData.route} departs in 2 hours. Please reach the boarding point 30 minutes early.`,
                    { bookingId: bookingData.bookingId }
                );
            }, reminderDelay);
        }
    }

    // Send promotional offer
    sendPromotionalOffer(offerData) {
        this.sendNotification(
            'promotionalOffers',
            offerData.title,
            offerData.message,
            { offerCode: offerData.code, validTill: offerData.validTill }
        );
    }

    // Send route update
    sendRouteUpdate(routeData) {
        this.sendNotification(
            'routeUpdates',
            'Route Update',
            `Route ${routeData.route} has been updated. ${routeData.message}`,
            { route: routeData.route }
        );
    }
}

// Initialize notification service
const notificationService = new NotificationService();

// Export for global use
window.notificationService = notificationService;