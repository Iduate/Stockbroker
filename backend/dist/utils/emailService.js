"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendPasswordResetEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const errorHandler_1 = require("../middleware/errorHandler");
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Email sending error:', error);
        throw new errorHandler_1.AppError('Failed to send email', 500);
    }
};
exports.sendEmail = sendEmail;
const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
  `;
    await (0, exports.sendEmail)({
        to: email,
        subject: 'Password Reset Request',
        text: `Click here to reset your password: ${resetUrl}`,
        html
    });
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const sendWelcomeEmail = async (email, firstName) => {
    const html = `
    <h1>Welcome to Stock Trading App!</h1>
    <p>Hi ${firstName},</p>
    <p>Thank you for joining our platform. We're excited to have you on board!</p>
    <p>You can now start trading stocks and managing your portfolio.</p>
    <p>If you have any questions, feel free to contact our support team.</p>
  `;
    await (0, exports.sendEmail)({
        to: email,
        subject: 'Welcome to Stock Trading App',
        text: `Welcome ${firstName}! Thank you for joining our platform.`,
        html
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
//# sourceMappingURL=emailService.js.map