import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendVerificationEmail(email: string, verificationCode: string) {
  return sendEmail(
    email,
    'Verify your email address',
    `
      <h1>Email Verification</h1>
      <p>Please use the following code to verify your email address:</p>
      <h2>${verificationCode}</h2>
      <p>This code will expire in 24 hours.</p>
    `
  );
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
  
  return sendEmail(
    email,
    'Password Reset Request',
    `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `
  );
} 