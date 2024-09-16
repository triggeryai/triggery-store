// next-amazona-v2/lib/models/ShippingPriceModel.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

interface IShippingOption extends Document {
  value: string;
  label: string;
  price: number;
  width: number;    // Szerokość w cm
  height: number;   // Wysokość w cm
  depth: number;    // Głębokość w cm
  weight: number;   // Waga w kg
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
  width: {
    type: Number,   // Pole dla szerokości
    required: true,
    default: 0,
  },
  height: {
    type: Number,   // Pole dla wysokości
    required: true,
    default: 0,
  },
  depth: {
    type: Number,   // Pole dla głębokości
    required: true,
    default: 0,
  },
  weight: {
    type: Number,   // Pole dla wagi w kg
    required: true,
    default: 0,
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
