// lib/models/ProductLackShowOnOff.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProductLackShowOnOff extends Document {
  isOn: boolean;
}

const ProductLackShowOnOffSchema = new Schema({
  isOn: { type: Boolean, required: true, default: false }
}, { timestamps: true });

const ProductLackShowOnOffModel: Model<IProductLackShowOnOff> = 
  (mongoose.models && mongoose.models.ProductLackShowOnOff) 
    ? mongoose.models.ProductLackShowOnOff 
    : mongoose.model<IProductLackShowOnOff>('ProductLackShowOnOff', ProductLackShowOnOffSchema);

export default ProductLackShowOnOffModel;
