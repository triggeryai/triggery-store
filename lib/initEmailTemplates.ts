// lib\initEmailTemplates.ts
import EmailTemplate from './models/EmailTemplate';

const defaultTemplates = [
  {
    templateName: 'sendVerificationEmail',
    from: 'Verification <no-reply@example.com>',
    subject: 'Verify Your Email',
    html: 'Please click on the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>',
  },
  {
    templateName: 'sendPasswordResetEmail',
    from: 'Support <no-reply@example.com>',
    subject: 'Password Reset Request',
    html: 'We received a request to reset your password. Click on the following link to reset it: <a href="${resetPasswordUrl}">Reset Password</a>',
  },
  {
    templateName: 'sendNewPasswordEmail',
    from: 'Support <no-reply@example.com>',
    subject: 'Your New Password',
    html: 'Your password has been reset. Here is your new password: <strong>${newPassword}</strong>. Please change it after logging in.',
  },
  {
    templateName: 'sendSupportEmail',
    from: 'User Support <no-reply@example.com>',
    subject: 'New Support Message',
    html: '<p>${message}</p>',
  },
];

export async function initEmailTemplates() {
  for (const template of defaultTemplates) {
    const existingTemplate = await EmailTemplate.findOne({ templateName: template.templateName });
    if (!existingTemplate) {
      await EmailTemplate.create(template);
    }
  }
}
