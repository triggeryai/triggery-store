// lib/models/ChatMessageModel.ts
import mongoose, { Document, Model } from 'mongoose';

export interface IChatMessage extends Document {
  sender: string;
  recipient: string;
  message: string;
  reply?: string;
  timestamp: Date;
}

const ChatMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const ChatMessageModel: Model<IChatMessage> = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

export default ChatMessageModel;
