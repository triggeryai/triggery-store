// lib/models/GuestCheckout.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IGuestCheckout extends Document {
  isGuestCheckoutEnabled: boolean;
}

const GuestCheckoutSchema: Schema = new Schema({
  isGuestCheckoutEnabled: { type: Boolean, required: true, default: false }
});

const GuestCheckout: Model<IGuestCheckout> = mongoose.models?.GuestCheckout
  ? mongoose.models.GuestCheckout
  : mongoose.model<IGuestCheckout>('GuestCheckout', GuestCheckoutSchema);

export default GuestCheckout;
