// BusConnect Notification Server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const webpush = require('web-push');
const routesAPI = require('./api/routes');
const reviewsAPI = require('./api/reviews');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));
app.use('/api', routesAPI);
app.use('/api', reviewsAPI);

// Configuration
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
};

const twilioClient = twilio(
    process.env.TWILIO_SID || 'your-twilio-sid',
    process.env.TWILIO_TOKEN || 'your-twilio-token'
);

webpush.setVapidDetails(
    'mailto:your-email@gmail.com',
    process.env.VAPID_PUBLIC_KEY || 'your-vapid-public-key',
    process.env.VAPID_PRIVATE_KEY || 'your-vapid-private-key'
);

// Email notification endpoint
app.post('/api/notifications/email', async (req, res) => {
    try {
        const { userId, subject, body, type } = req.body;
        
        const transporter = nodemailer.createTransporter(emailConfig);
        
        await transporter.sendMail({
            from: emailConfig.auth.user,
            to: `user${userId}@example.com`, // Replace with actual user email lookup
            subject: subject,
            text: body,
            html: `<div style="font-family: Arial, sans-serif;">${body.replace(/\n/g, '<br>')}</div>`
        });
        
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// SMS notification endpoint
app.post('/api/notifications/sms', async (req, res) => {
    try {
        const { userId, message, type } = req.body;
        
        await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE || '+1234567890',
            to: `+1234567${userId}` // Replace with actual user phone lookup
        });
        
        res.json({ success: true, message: 'SMS sent successfully' });
    } catch (error) {
        console.error('SMS error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Push notification endpoint
app.post('/api/notifications/push', async (req, res) => {
    try {
        const { userId, title, body, data, type } = req.body;
        
        // In real app, get user's push subscription from database
        const subscription = {
            endpoint: 'https://fcm.googleapis.com/fcm/send/example',
            keys: {
                p256dh: 'example-key',
                auth: 'example-auth'
            }
        };
        
        const payload = JSON.stringify({
            title: title,
            body: body,
            data: data
        });
        
        await webpush.sendNotification(subscription, payload);
        
        res.json({ success: true, message: 'Push notification sent successfully' });
    } catch (error) {
        console.error('Push notification error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Schedule reminder endpoint
app.post('/api/notifications/schedule', (req, res) => {
    try {
        const { userId, type, data, scheduleTime } = req.body;
        
        const delay = new Date(scheduleTime) - new Date();
        
        if (delay > 0) {
            setTimeout(() => {
                // Send notification after delay
                console.log(`Sending scheduled notification to user ${userId}`);
            }, delay);
        }
        
        res.json({ success: true, message: 'Notification scheduled successfully' });
    } catch (error) {
        console.error('Schedule error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Promotional batch endpoint
app.post('/api/notifications/promotional-batch', async (req, res) => {
    try {
        const { userSegment, type, data } = req.body;
        
        // Mock user segment - replace with actual database query
        const users = [
            { id: 1, email: 'user1@example.com', phone: '+1234567001' },
            { id: 2, email: 'user2@example.com', phone: '+1234567002' }
        ];
        
        const results = await Promise.allSettled(
            users.map(user => sendNotificationToUser(user, type, data))
        );
        
        res.json({ 
            success: true, 
            message: `Promotional notifications sent to ${users.length} users`,
            results: results
        });
    } catch (error) {
        console.error('Batch notification error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Helper function to send notification to individual user
async function sendNotificationToUser(user, type, data) {
    // Implementation would call appropriate notification methods
    console.log(`Sending ${type} notification to user ${user.id}`);
    return { userId: user.id, status: 'sent' };
}

// User preferences endpoint
app.put('/api/users/:userId/notification-preferences', (req, res) => {
    try {
        const { userId } = req.params;
        const preferences = req.body;
        
        // Save preferences to database
        console.log(`Updating preferences for user ${userId}:`, preferences);
        
        res.json({ success: true, message: 'Preferences updated successfully' });
    } catch (error) {
        console.error('Preferences error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`BusConnect Notification Server running on port ${PORT}`);
});