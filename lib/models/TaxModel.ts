// lib/models/TaxModel.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

interface ITax extends Document {
  isActive: boolean;
  type: 'fixed' | 'percentage';
  value: number;
}

const taxSchema = new Schema<ITax>({
  isActive: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['fixed', 'percentage'],
    default: 'fixed',
  },
  value: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Tax = models.Tax || model<ITax>('Tax', taxSchema);

export default Tax;
