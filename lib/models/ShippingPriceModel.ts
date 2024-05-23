// lib/models/ShippingPriceModel.ts
import mongoose, { Schema, model, models } from 'mongoose';

const shippingOptionSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const ShippingOption = models.ShippingOption || model('ShippingOption', shippingOptionSchema);

export default ShippingOption;
