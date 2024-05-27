// lib/models/ShippingPriceModel.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

interface IShippingOption extends Document {
  value: string;
  label: string;
  price: number;
  isActive: boolean;
}

const shippingOptionSchema = new Schema<IShippingOption>({
  value: {
    type: String,
    required: true,
    unique: true,
  },
  label: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const ShippingOption = models.ShippingOption || model<IShippingOption>('ShippingOption', shippingOptionSchema);

export default ShippingOption;
