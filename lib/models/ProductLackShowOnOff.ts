// lib\models\ProductLackShowOnOff.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IProductLackShowOnOff extends Document {
  isOn: boolean;
}

const ProductLackShowOnOffSchema: Schema = new Schema({
  isOn: { type: Boolean, required: true, default: false }
});

export default mongoose.models.ProductLackShowOnOff || mongoose.model<IProductLackShowOnOff>('ProductLackShowOnOff', ProductLackShowOnOffSchema);
