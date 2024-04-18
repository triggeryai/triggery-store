// app/api/admin/categories/route.ts
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import CategoryModel from '@/lib/models/CategoryModel'; // Assuming you have a separate category model

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
  
  await dbConnect();
  
  try {
    const categories = await CategoryModel.find({}).lean();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
});

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { categoryName } = await req.json();
  await dbConnect();

  // Generate a slug from the categoryName
  // Make sure to create a function that generates a unique slug
  const slug = generateSlug(categoryName); 

  // Check if category with the same slug already exists
  const categoryExists = await CategoryModel.findOne({ slug: slug });
  if (categoryExists) {
    return new Response(JSON.stringify({ message: 'Category with this slug already exists' }), { status: 409 }); // Conflict status code
  }

  // Add a new category with the slug
  const category = new CategoryModel({ name: categoryName, slug: slug });

  try {
    await category.save();
    return new Response(JSON.stringify({ message: 'Category added successfully' }), { status: 201 });
  } catch (err: any) {
    console.error(err); // Log the error for debugging
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
});

function generateSlug(name) {
  // Simple slug generation; consider a more robust approach for production
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

// Make sure you have a way to get the category ID from the request, it might be via req.params or similar.
export const DELETE = auth(async (req: any) => {
  const categoryId = req.params.categoryId;
  console.log(`Received DELETE request for category ID: ${categoryId}`);
  console.log("DELETE request received for URL:", req.url);
  console.log("Params:", req.params);
  console.log(`categoryId: ${categoryId}`);

  
  if (!req.auth || !req.auth.user?.isAdmin) {
    console.error('Unauthorized attempt to delete category');
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  await dbConnect();
  console.log(`Database connection established, looking for category ID: ${categoryId}`);

  try {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      console.error(`Category not found with ID: ${categoryId}`);
      return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    await CategoryModel.findByIdAndDelete(categoryId);
    console.log(`Category deleted successfully with ID: ${categoryId}`);
    return new Response(JSON.stringify({ message: 'Category deleted successfully' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(`Error deleting category with ID: ${categoryId}:`, err);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});




