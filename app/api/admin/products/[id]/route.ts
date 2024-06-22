import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import CategoryModel from '@/lib/models/CategoryModel';

export const GET = auth(async (req, { params }) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await dbConnect();

  try {
    // Use .populate to get the full category document including _id and name
    const product = await ProductModel.findById(params.id).populate('categories').lean();
    
    if (!product) {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }
    
    // Since product is a Mongoose document, we want to convert it to a JSON object
    const productJSON = JSON.parse(JSON.stringify(product));

    return new Response(JSON.stringify(productJSON), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
});

export const PUT = auth(async (req, { params }) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { name, slug, price, categories, image, brand, countInStock, description } = await req.json();

  try {
    await dbConnect();

    const product = await ProductModel.findById(params.id);
    if (product) {
      product.name = name;
      product.slug = slug;
      product.price = price;
      product.categories = categories; // Aktualizujemy tablicę kategorii
      product.image = image;
      product.brand = brand;
      product.countInStock = countInStock;
      product.description = description;

      await product.save();
      return new Response(JSON.stringify(product), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: err.toString() }), { status: 500 });
  }
});

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args

  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'unauthorized' }), { status: 401 });
  }

  try {
    await dbConnect()
    const product = await ProductModel.findById(params.id)
    if (product) {
      await product.deleteOne()
      return new Response(JSON.stringify({ message: 'Product deleted successfully' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}) as any;
