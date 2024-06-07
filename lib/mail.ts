// lib/mail.ts
import nodemailer from 'nodemailer';

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable for user
    pass: process.env.EMAIL_PASS, // Use environment variable for password
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/activate/${token}`; // Use environment variable for domain
  await transporter.sendMail({
    from: `"Trigerry - Rapid Websites For Everyone" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `Please click on the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetPasswordUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password/${encodeURIComponent(token)}`;
  await transporter.sendMail({
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `We received a request to reset your password for our app. Please click on the following link to reset your password: <a href="${resetPasswordUrl}">Reset Password</a>. If you did not request a password reset, please ignore this email.`,
  });
}

export async function sendNewPasswordEmail(email: string, newPassword: string) {
  await transporter.sendMail({
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your New Password",
    html: `Your password has been reset.  It is recommended to change this password after logging in. Here is your new password: <strong>${newPassword}</strong>.`,
  });
}



export async function sendSupportEmail(userEmail: string, message: string) {
  await transporter.sendMail({
    from: `"User Support" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Send to support email
    subject: `New support message from ${userEmail}`,
    html: `<p>${message}</p>`,
  });
}