// lib/models/DeveloperMode.ts
import mongoose from 'mongoose';

const DeveloperModeSchema = new mongoose.Schema({
  isDeveloperMode: {
    type: Boolean,
    required: true,
    default: true, // Default value set to true
  },
});

export default mongoose.models.DeveloperMode || mongoose.model('DeveloperMode', DeveloperModeSchema);
