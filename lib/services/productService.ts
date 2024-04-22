// lib\services\productService.ts
import { cache } from 'react';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import ProductModel, { Product } from '@/lib/models/ProductModel';
import CategoryModel from '@/lib/models/CategoryModel'; // Make sure to import the CategoryModel

export const revalidate = 3600;

const getLatest = cache(async () => {
  await dbConnect();
  const products = await ProductModel.find({}).sort({ _id: -1 }).limit(6).lean();
  return products as Product[];
});

const getFeatured = cache(async () => {
  await dbConnect();
  const products = await ProductModel.find({ isFeatured: true }).limit(3).lean();
  return products as Product[];
});

const getBySlug = cache(async (slug: string) => {
  await dbConnect();
  const product = await ProductModel.findOne({ slug }).lean();
  return product as Product;
});

const PAGE_SIZE = 12;

const getByQuery = async ({
  q,
  category,
  sort,
  price,
  page = '1',
}) => {
  await dbConnect();

  const queryFilter = q && q !== 'all' ? {
    name: {
      $regex: q,
      $options: 'i',
    },
  } : {};

  let categoryFilter = {};
  if (category && category !== 'all') {
    const categoryDoc = await CategoryModel.findOne({ name: category });
    if (categoryDoc) {
      categoryFilter = { category: categoryDoc._id };
    } else {
      return { products: [], countProducts: 0, page, pages: 0, categories: [] };
    }
  }

  const priceFilter = price && price !== 'all' ? {
    price: {
      $gte: Number(price.split('-')[0]),
      $lte: Number(price.split('-')[1]),
    },
  } : {};

  const order = sort === 'lowest' ? { price: 1 } :
    sort === 'highest' ? { price: -1 } :
    { _id: -1 };

  let products = await ProductModel.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
  })
  .sort(order)
  .skip(PAGE_SIZE * (Number(page) - 1))
  .limit(PAGE_SIZE)
  .populate('category', 'name') // Populate the 'category' field
  .lean();

  // Transform the populated category into a category name.
  products = products.map(product => ({
    ...product,
    category: product.category?.name || 'Uncategorized', // Fallback in case category is not populated
  }));

  const countProducts = await ProductModel.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
  });

  const categories = await CategoryModel.find({}, 'name').lean();

  return {
    products: products as Product[],
    countProducts,
    page,
    pages: Math.ceil(countProducts / PAGE_SIZE),
    categories: categories.map(c => c.name), // Return just the names
  };
};

const getCategories = cache(async () => {
  await dbConnect();
  const categories = await CategoryModel.find({}, 'name').lean();
  return categories.map(c => c.name); // Return just the names
});

const productService = {
  getLatest,
  getFeatured,
  getBySlug,
  getByQuery,
  getCategories,
};

export default productService;
