// lib\models\ChatMessageModel.ts
import mongoose, { Document, Model } from 'mongoose';

// Define the ChatMessage interface
export interface IChatMessage extends Document {
  sender: string;
  recipient: string;
  message: string;
  timestamp: Date;
}

// Create the ChatMessage schema
const ChatMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// Create the ChatMessage model
const ChatMessageModel: Model<IChatMessage> = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

export default ChatMessageModel;
