// lib\models\SupportChatOffOn.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ISupportChatOffOn extends Document {
  isOff: boolean;
}

const SupportChatOffOnSchema: Schema = new Schema({
  isOff: { type: Boolean, required: true, default: false }
});

export default mongoose.models.SupportChatOffOn || mongoose.model<ISupportChatOffOn>('SupportChatOffOn', SupportChatOffOnSchema);


