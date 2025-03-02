const Bull = require('bull');
const User = require('../models/User.model');
const OrderModel = require('../models/Order.model');
const sendEmail = require("../utils/sendMail");

const EmailQueue = new Bull('Email_Sending', {
    redis: { host: '127.0.0.1', port: 6379 },

    defaultJobOptions: {
        attempts: 3,
        delay: 3000 // 3 Seconds
    }
});

const emailTemplates = {
    // Template for user registration
    register: (user, otp) => `
        <html>
        <body>
            <h2>Welcome to DryFru!</h2>
            <p>Hi ${user.Name || 'User'},</p>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>Thank you for joining us!</p>
        </body>
        </html>
    `,

    // Template for resending registration OTP
    resendRegisterOtp: (user, otp) => `
        <html>
        <body>
            <h2>Verification Code Resent</h2>
            <p>Hi ${user.Name || 'User'},</p>
            <p>Your new verification code is: <strong>${otp}</strong></p>
            <p>Please use this code to verify your account.</p>
        </body>
        </html>
    `,

    // Template for password reset OTP
    passwordOtp: (user, otp) => `
        <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>Hi ${user.Name || 'User'},</p>
            <p>Your password reset code is: <strong>${otp}</strong></p>
            <p>Please use this code to reset your password.</p>
        </body>
        </html>
    `,

    // Template for resending password reset OTP
    passwordResendOtp: (user, otp) => `
        <html>
        <body>
            <h2>Password Reset Code Resent</h2>
            <p>Hi ${user.Name || 'User'},</p>
            <p>Your new password reset code is: <strong>${otp}</strong></p>
            <p>Please use this code to reset your password.</p>
        </body>
        </html>
    `,

    // Template for order confirmation OTP
    orderConfirmOtp: (order) => `
        <html>
        <body>
            <h2>Order Confirmation</h2>
            <p>Hi,</p>
            <p>Your order #${order._id} has been successfully placed.</p>
            <p>Thank you for shopping with us!</p>
        </body>
        </html>
    `,
    

    // Default fallback template
    default: () => `
        <html>
        <body>
            <h2>Email Notification</h2>
            <p>Hi,</p>
            <p>This is a notification from DryFru.</p>
        </body>
        </html>
    `
};


EmailQueue.process(async (job) => {
    try {
        const { user_id, mail_type, otp } = job.data;
        // console.log(job.data)

        if (!user_id || !mail_type) {
            throw new Error('Invalid email job data.');
        }

        const user = await User.findById(user_id);
        if (!user) throw new Error(`User not found for ID: ${user_id}`);
        // console.log("user",user)
        let message;
        if (mail_type === 'orderConfirmOtp') {
            const order = await OrderModel.findOne({ userId: user_id });
            if (!order) throw new Error(`Order not found for user ID: ${user_id}`);
            message = emailTemplates[mail_type](order);
        } else {
            if (!otp) throw new Error('OTP is required for this email type.');
            message = emailTemplates[mail_type](user, otp);
        }

        const options = {
            from: 'DryFru <noreply@dryfru.com>',
            email: user.Email,
            subject: mail_type,
            message: message
        }
        // console.log("Job Added: " + options)
        const messageSending = await sendEmail(options)
        if (!messageSending) {
            throw new Error('Failed to send email.')
        } else {
            console.log(`Email sent to ${user.Email}:\n${message}`);
            job.progress(100);
            return;
        }


    } catch (error) {
        console.error(`Error in EmailQueue job: ${error.message}`);
    }
});

EmailQueue.on('completed', (job, result) => {
    console.log(`Email job with ID ${job.id} completed. `);
})


EmailQueue.on('failed', (job, err) => {
    console.error(`Email Job failed for userId: ${job.data.userId}`, err.message);
});

EmailQueue.on('error', (err) => {
    console.error('Email Job Queue error:', err);
});

module.exports = EmailQueue;
