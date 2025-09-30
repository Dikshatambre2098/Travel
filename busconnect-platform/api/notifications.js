// Mock API endpoints for notification system
const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const router = express.Router();

// Email configuration
const emailTransporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// SMS configuration
const smsClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// Send email notification
router.post('/email', async (req, res) => {
    try {
        const { to, subject, body, type } = req.body;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: `BusConnect - ${subject}`,
            html: body
        };
        
        await emailTransporter.sendMail(mailOptions);
        
        // Log notification
        console.log(`Email notification sent: ${type} to ${to}`);
        
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email notification error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Send SMS notification
router.post('/sms', async (req, res) => {
    try {
        const { to, message, type } = req.body;
        
        await smsClient.messages.create({
            body: `BusConnect: ${message}`,
            from: process.env.TWILIO_PHONE,
            to: to
        });
        
        // Log notification
        console.log(`SMS notification sent: ${type} to ${to}`);
        
        res.json({ success: true, message: 'SMS sent successfully' });
    } catch (error) {
        console.error('SMS notification error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get notification history
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // In a real app, fetch from database
        const notifications = [
            {
                id: '1',
                type: 'bookingConfirmations',
                title: 'Booking Confirmed',
                message: 'Your booking BC123456 has been confirmed',
                timestamp: new Date().toISOString(),
                read: false
            }
        ];
        
        res.json({ success: true, notifications });
    } catch (error) {
        console.error('Notification history error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update notification preferences
router.put('/preferences/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { preferences } = req.body;
        
        // In a real app, save to database
        console.log(`Updated preferences for user ${userId}:`, preferences);
        
        res.json({ success: true, message: 'Preferences updated successfully' });
    } catch (error) {
        console.error('Preferences update error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mark notification as read
router.put('/read/:notificationId', async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        // In a real app, update database
        console.log(`Marked notification ${notificationId} as read`);
        
        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Send bulk promotional notifications
router.post('/bulk/promotional', async (req, res) => {
    try {
        const { title, message, offerCode, validTill, targetUsers } = req.body;
        
        const results = {
            email: 0,
            sms: 0,
            push: 0,
            failed: 0
        };
        
        for (const user of targetUsers) {
            try {
                // Send email
                if (user.preferences.email) {
                    await emailTransporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: `BusConnect - ${title}`,
                        html: generatePromotionalEmailTemplate(title, message, offerCode, validTill)
                    });
                    results.email++;
                }
                
                // Send SMS
                if (user.preferences.sms) {
                    await smsClient.messages.create({
                        body: `BusConnect: ${message} Use code ${offerCode}. Valid till ${validTill}`,
                        from: process.env.TWILIO_PHONE,
                        to: user.phone
                    });
                    results.sms++;
                }
                
                // Push notifications would be handled by the frontend
                if (user.preferences.push) {
                    results.push++;
                }
                
            } catch (error) {
                console.error(`Failed to send notification to user ${user.id}:`, error);
                results.failed++;
            }
        }
        
        res.json({ success: true, results });
    } catch (error) {
        console.error('Bulk notification error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Generate promotional email template
function generatePromotionalEmailTemplate(title, message, offerCode, validTill) {
    return `
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; }
                    .header { background: #007bff; color: white; padding: 20px; text-align: center; }
                    .content { padding: 30px 20px; }
                    .offer-code { background: #f8f9fa; border: 2px dashed #007bff; padding: 15px; text-align: center; margin: 20px 0; }
                    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
                    .btn { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🚌 BusConnect</h1>
                        <h2>${title}</h2>
                    </div>
                    <div class="content">
                        <p>${message}</p>
                        <div class="offer-code">
                            <h3>Your Offer Code</h3>
                            <h2 style="color: #007bff; margin: 10px 0;">${offerCode}</h2>
                            <p>Valid till ${validTill}</p>
                        </div>
                        <div style="text-align: center;">
                            <a href="#" class="btn">Book Now</a>
                        </div>
                        <p><strong>How to use:</strong></p>
                        <ol>
                            <li>Visit BusConnect website</li>
                            <li>Search for your desired route</li>
                            <li>Enter the offer code during checkout</li>
                            <li>Enjoy your discounted journey!</li>
                        </ol>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from BusConnect. Please do not reply to this email.</p>
                        <p>If you don't want to receive promotional emails, you can update your preferences in your account settings.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
}

module.exports = router;