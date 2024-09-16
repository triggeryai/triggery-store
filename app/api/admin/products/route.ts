import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';
import CategoryModel from '@/lib/models/CategoryModel';

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'unauthorized' }), { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '15');
  const searchQuery = searchParams.get('search') || '';
  const skip = (page - 1) * limit;

  const searchFilter = searchQuery 
    ? { name: { $regex: searchQuery, $options: 'i' } }
    : {};

  const totalProducts = await ProductModel.countDocuments(searchFilter);
  const products = await ProductModel.find(searchFilter)
    .populate('categories', 'name')
    .skip(skip)
    .limit(limit)
    .lean();

  const transformedProducts = products.map((product) => ({
    ...product,
    categories: product.categories.map(cat => cat.name).join(', '),
  }));

  const totalPages = Math.ceil(totalProducts / limit);

  return new Response(JSON.stringify({ products: transformedProducts, totalPages }), { status: 200 });
});

export const POST = auth(async (req: any) => {
  const body = await req.json();
  console.log('Request body:', body);

  if (!req.auth || !req.auth.user?.isAdmin) {
    console.log('Unauthorized access attempt');
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    await dbConnect();
    const { name, slug, price, image, brand, countInStock, description, categoryIds, width, height, depth, weight } = body;
    console.log('Creating product with data:', { name, slug, price, image, brand, countInStock, description, categoryIds });

    const categories = await CategoryModel.find({ _id: { $in: categoryIds } });
    if (!categories.length) {
      console.log(`Categories not found: ${categoryIds}`);
      return new Response(JSON.stringify({
        message: 'Categories not found. Please create categories.',
        redirect: '/admin/categories',
      }), { status: 400 });
    }

    const product = new ProductModel({
      name,
      slug,
      image,
      price,
      categories: categoryIds,
      brand,
      countInStock,
      description,
      width: width || 0,
      height: height || 0,
      depth: depth || 0,
      weight: weight || 0,
    });

    await product.save();
    const productObject = product.toObject();
    productObject.categories = categories.map(cat => cat.name).join(', ');
    console.log('Product created successfully:', productObject);

    return new Response(JSON.stringify({ message: 'Product created successfully', product: productObject }), { status: 201 });
  } catch (error) {
    console.error('Error while creating product:', error);
    return new Response(JSON.stringify({ message: error.message || 'Internal Server Error' }), { status: 500 });
  }
});
