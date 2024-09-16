// next-amazona-v2/lib/models/ProductModel.ts
import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    images: [{ type: String, required: true }], // Tablica do przechowywania maksymalnie 10 obrazów
    mainImage: { type: String }, // Pole do przechowywania głównego zdjęcia
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: String,
    width: { type: Number, default: 0 }, // Nowe pole szerokość
    height: { type: Number, default: 0 }, // Nowe pole wysokość
    depth: { type: Number, default: 0 }, // Nowe pole głębokość
    weight: { type: Number, default: 0 }, // Nowe pole waga
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
  images: string[]; // Tablica do przechowywania obrazów
  mainImage?: string; // Główne zdjęcie
  banner?: string;
  price: number;
  brand: string;
  description: string;
  categories: mongoose.Schema.Types.ObjectId[];
  countInStock: number;
  colors?: string[];
  sizes?: string[];
  width?: number; // Nowe pole szerokość
  height?: number; // Nowe pole wysokość
  depth?: number; // Nowe pole głębokość
  weight?: number; // Nowe pole waga
};
