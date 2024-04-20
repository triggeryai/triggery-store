// app\api\admin\categories\[id]\route.ts
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import CategoryModel from '@/lib/models/CategoryModel';
import ProductModel from '@/lib/models/ProductModel';

export const DELETE = auth(async (req, { params }) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await dbConnect();

  try {
    const category = await CategoryModel.findById(params.id);
    if (!category) {
      return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404 });
    }

    // Find products with the category to be deleted
    const products = await ProductModel.find({ category: params.id });

    // Check if there are any existing categories other than the one being deleted
    const availableCategories = await CategoryModel.find({ _id: { $ne: params.id } });

    let defaultCategory;
    if (availableCategories.length > 0) {
      defaultCategory = availableCategories[0]._id; // Use the first available category
    } else {
      // No available categories, create a new default category
      const newCategory = new CategoryModel({ name: 'Sample Category', slug: 'sample-category' });
      await newCategory.save();
      defaultCategory = newCategory._id;
    }

    // Reassign products to the new default category
    await ProductModel.updateMany({ category: params.id }, { $set: { category: defaultCategory } });

    // Finally, delete the category
    await category.deleteOne();
    return new Response(JSON.stringify({ message: 'Category deleted successfully' }), { status: 200 });
  } catch (err) {
    console.error('Error deleting category:', err);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: err.toString() }), { status: 500 });
  }
});


export const PUT = auth(async (req, { params }): Promise<Response> => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const category = await CategoryModel.findById(params.id);

    if (!category) {
      return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404 });
    }

    const newSlug = body.slug || category.slug;
    const existingCategory = await CategoryModel.findOne({
      slug: newSlug,
      _id: { $ne: category._id }
    });

    if (existingCategory) {
      return new Response(JSON.stringify({ message: 'Slug already exists' }), { status: 409 });
    }

    category.name = body.name;
    category.slug = newSlug;
    await category.save();

    return new Response(JSON.stringify({ message: 'Category updated successfully' }), { status: 200 });
  } catch (err) {
    console.error('Error updating category:', err);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: err.toString() }), { status: 500 });
  }
});


  