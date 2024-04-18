// pages/api/categories/index.js
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export default async function handler(req, res) {
  await dbConnect();
  
  if (req.method === 'GET') {
    // Fetch categories with product counts
    const categories = await ProductModel.aggregate([
      { $group: { _id: '$category', productCount: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', productCount: 1 } }
    ]);
    res.status(200).json(categories);
  }
  
  if (req.method === 'POST') {
    // Add a new category
    const { categoryName } = req.body;
    // Check if category already exists
    const categoryExists = await ProductModel.findOne({ category: categoryName });
    if (categoryExists) {
      res.status(409).json({ message: 'Category already exists' });
    } else {
      // Here you would define how a new category is added, since we're not creating a separate Category model,
      // you might consider adding a product with this new category or handling category creation differently.
    }
  }
}
