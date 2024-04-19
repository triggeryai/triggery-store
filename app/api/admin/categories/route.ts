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

export const POST = auth(async (req) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const slug = generateSlug(body.name); // Funkcja do generowania sluga

    // Sprawdzenie, czy istnieje już kategoria o takim samym slugu
    const existingCategory = await CategoryModel.findOne({ slug });
    if (existingCategory) {
      return new Response(JSON.stringify({ message: 'Slug already exists' }), { status: 409 });
    }

    // Utworzenie nowej kategorii
    const category = new CategoryModel({ name: body.name, slug });
    await category.save();

    return new Response(JSON.stringify({ message: 'Category added successfully', category }), { status: 201 });
  } catch (err) {
    console.error('Error creating new category:', err);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: err.toString() }), { status: 500 });
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

export const PUT = auth(async (req, { params }) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await dbConnect();
  
  try {
    const { name, slug } = req.body;
    const category = await CategoryModel.findById(params.id);
    
    if (!category) {
      return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404 });
    }
    
    // Sprawdzanie unikalności sluga
    let newSlug = slug;
    let existingCategory;
    let count = 1;
    
    // Pętla sprawdza unikalność sluga; jeśli jest zajęty, dodaje numer do sluga
    do {
      existingCategory = await CategoryModel.findOne({ slug: newSlug, _id: { $ne: category._id } });
      if (existingCategory) {
        newSlug = `${slug}-${count}`;
        count++;
      }
    } while (existingCategory);
    
    // Aktualizacja kategorii
    category.name = name;
    category.slug = newSlug;
    
    await category.save();
    
    return new Response(JSON.stringify({ message: 'Category updated successfully' }), { status: 200 });
  } catch (err) {
    console.error('Error updating category:', err);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: err.toString() }), { status: 500 });
  }
});
