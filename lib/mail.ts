// lib/mail.ts
import nodemailer from 'nodemailer';
import EmailTemplate from './models/EmailTemplate';
import dbConnect from './dbConnect';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function getTemplateContent(templateName: string, replacements: Record<string, string>) {
  await dbConnect();
  const template = await EmailTemplate.findOne({ templateName });
  if (!template) throw new Error(`Template ${templateName} not found`);

  let { from, subject, html } = template;
  from = from.replace('${process.env.EMAIL_USER}', process.env.EMAIL_USER);

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(`\\\${${key}}`, 'g'), value);
  }

  return { from, subject, html };
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/activate/${token}`;
  const { from, subject, html } = await getTemplateContent('sendVerificationEmail', { verificationUrl });

  await transporter.sendMail({
    from,
    to: email,
    subject,
    html,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetPasswordUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password/${encodeURIComponent(token)}`;
  const { from, subject, html } = await getTemplateContent('sendPasswordResetEmail', { resetPasswordUrl });

  await transporter.sendMail({
    from,
    to: email,
    subject,
    html,
  });
}

export async function sendNewPasswordEmail(email: string, newPassword: string) {
  const { from, subject, html } = await getTemplateContent('sendNewPasswordEmail', { newPassword });

  await transporter.sendMail({
    from,
    to: email,
    subject,
    html,
  });
}

export async function sendSupportEmail(userEmail: string, message: string) {
  const { from, subject, html } = await getTemplateContent('sendSupportEmail', { message });

  await transporter.sendMail({
    from,
    to: process.env.EMAIL_USER,
    subject: subject.replace('${userEmail}', userEmail),
    html,
  });
}
