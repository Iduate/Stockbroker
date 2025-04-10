import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';
import nodemailer from 'nodemailer';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function testEmail() {
  try {
    // First verify the configuration
    console.log('Verifying email configuration...');
    await transporter.verify();
    console.log('Email configuration is valid');

    // Then try to send a test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER, // Send to self for testing
      subject: 'Test Email',
      text: 'This is a test email to verify the email configuration is working.',
      html: '<p>This is a test email to verify the email configuration is working.</p>'
    });

    console.log('Test email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmail(); 