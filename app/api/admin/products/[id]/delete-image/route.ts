import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export const DELETE = auth(async (req, { params }) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { image } = await req.json(); // Pobranie obrazu do usunięcia

  try {
    await dbConnect();

    const product = await ProductModel.findById(params.id);
    if (product) {
      // Filtrujemy obrazy, usuwając wybrany obraz
      product.images = product.images.filter((img: string) => img !== image);

      // Zapisujemy produkt po aktualizacji tablicy images
      await product.save();
      return new Response(JSON.stringify(product), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
});
