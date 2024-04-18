// lib/models/CategoryModel.ts
import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
}, {
  timestamps: true,
});

const CategoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default CategoryModel;
