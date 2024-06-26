import { cache } from 'react';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import ProductModel, { Product } from '@/lib/models/ProductModel';
import CategoryModel from '@/lib/models/CategoryModel';
import ProductLackShowOnOff from '@/lib/models/ProductLackShowOnOff';

export const revalidate = 3600;

const getStockFilter = async () => {
  await dbConnect();
  const productLackShowOnOff = await ProductLackShowOnOff.findOne({}).lean();
  if (productLackShowOnOff && productLackShowOnOff.isOn) {
    return { countInStock: { $gte: 1 } };
  }
  return {};
};

const getLatest = cache(async () => {
  await dbConnect();
  const stockFilter = await getStockFilter();
  const products = await ProductModel.find({ ...stockFilter }).sort({ _id: -1 }).limit(6).lean();
  return products as Product[];
});

const getFeatured = cache(async () => {
  await dbConnect();
  const stockFilter = await getStockFilter();
  const products = await ProductModel.find({ isFeatured: true, ...stockFilter }).limit(3).lean();
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
}: {
  q?: string;
  category?: string;
  sort?: string;
  price?: string;
  page?: string;
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
      categoryFilter = { categories: categoryDoc._id };
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

  const stockFilter = await getStockFilter();

  let products = await ProductModel.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...stockFilter,
  })
  .sort(order)
  .skip(PAGE_SIZE * (Number(page) - 1))
  .limit(PAGE_SIZE)
  .populate('categories', 'name')
  .lean();

  products = products.map(product => ({
    ...product,
    categories: product.categories.map((category: any) => category.name),
  }));

  const countProducts = await ProductModel.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...stockFilter,
  });

  const categories = await CategoryModel.find({}, 'name').lean();

  return {
    products: products as Product[],
    countProducts,
    page,
    pages: Math.ceil(countProducts / PAGE_SIZE),
    categories: categories.map(c => c.name),
  };
};

const getCategories = cache(async () => {
  await dbConnect();
  const categories = await CategoryModel.find({}, 'name').lean();
  return categories.map(c => c.name);
});

const productService = {
  getLatest,
  getFeatured,
  getBySlug,
  getByQuery,
  getCategories,
};

export default productService;
