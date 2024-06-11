// lib/models/EmailTemplate.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IEmailTemplate extends Document {
  templateName: string;
  from: string;
  subject: string;
  html: string;
}

const EmailTemplateSchema: Schema = new Schema({
  templateName: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  subject: { type: String, required: true },
  html: { type: String, required: true },
});

const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);

export default EmailTemplate;
export type { IEmailTemplate };
