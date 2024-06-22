// lib/models/ProductModel.ts
import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: String,
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);

export default ProductModel;

export type Product = {
  _id?: string;
  name: string;
  slug: string;
  image: string;
  banner?: string;
  price: number;
  brand: string;
  description: string;
  categories: mongoose.Schema.Types.ObjectId[];
  countInStock: number;
  colors?: string[];
  sizes?: string[];
};
