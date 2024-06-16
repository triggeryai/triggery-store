// lib/models/DeveloperMode.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IDeveloperMode extends Document {
  isDeveloperMode: boolean;
}

const DeveloperModeSchema: Schema = new Schema({
  isDeveloperMode: { type: Boolean, required: true, default: true }
});

const DeveloperMode: Model<IDeveloperMode> = mongoose.models?.DeveloperMode
  ? mongoose.models.DeveloperMode
  : mongoose.model<IDeveloperMode>('DeveloperMode', DeveloperModeSchema);

export default DeveloperMode;
