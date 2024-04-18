// app\api\admin\categories\[id]\route.ts
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import CategoryModel from '@/lib/models/CategoryModel';

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

    await category.deleteOne();
    return new Response(JSON.stringify({ message: 'Category deleted successfully' }), { status: 200 });
  } catch (err) {
    console.error('Error deleting category:', err);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: err.toString() }), { status: 500 });
  }
});

export const PUT = auth(async (req, { params }) => {
    // Tylko autoryzowani administratorzy mogą aktualizować kategorie
    if (!req.auth || !req.auth.user?.isAdmin) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
  
    await dbConnect();
  
    try {
      // params.id powinien zawierać ID kategorii do zaktualizowania
      const category = await CategoryModel.findById(params.id);
      if (!category) {
        return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404 });
      }
  
      // Aktualizuj nazwę kategorii. Upewnij się, że klucz w ciele żądania zgadza się z kluczem oczekiwanym przez model.
      category.name = req.body.name;
      await category.save();
  
      return new Response(JSON.stringify({ message: 'Category updated successfully' }), { status: 200 });
    } catch (err) {
      console.error('Error updating category:', err);
      return new Response(JSON.stringify({ message: 'Internal Server Error', error: err.toString() }), { status: 500 });
    }
  });
  