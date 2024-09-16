// next-amazona-v2/app/(front)/product/[slug]/page.tsx
import AddToCart from '@/components/products/AddToCart';
import ProductGallery from '@/components/products/ProductGallery';
import { convertDocToObj } from '@/lib/utils';
import productService from '@/lib/services/productService';
import Link from 'next/link';

// Funkcja do obsługi ścieżek obrazów
const getImageSrc = (src: string | undefined) => {
  if (!src) {
    return '/default-image.jpg'; // Domyślny obraz, jeśli brak obrazu
  }
  if (src.startsWith('http')) {
    return src; // Zdalny obraz (np. Cloudinary)
  }

  // Usuwamy powtarzające się '/products' i upewniamy się, że ścieżka ma tylko jeden prefiks
  const cleanedSrc = src.replace(/^\/+|products\//g, '');
  return `/products/${cleanedSrc}`;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await productService.getBySlug(params.slug);
  if (!product) {
    return { title: 'Produkt nie znaleziony' };
  }
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetails({
  params,
}: {
  params: { slug: string };
}) {
  const product = await productService.getBySlug(params.slug);
  if (!product) {
    return <div>Produkt nie znaleziony</div>;
  }
  return (
    <>
      <div className="my-2">
        <Link href="/search?category=all&q=">
          <button className="flex items-center px-4 py-2 bg-black hover:bg-blue-800 text-white font-bold rounded">
            <svg className="h-4 w-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M10 15l-5.5-5.5L10 4m-5 5.5h16" />
            </svg>
            Powrót do produktów
          </button>
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <ProductGallery images={product.images.map(getImageSrc)} mainImage={getImageSrc(product.mainImage)} />
        </div>
        <div>
          <ul className="space-y-4">
            <li>
              <h1 className="text-xl">{product.name}</h1>
            </li>
            <li>{product.brand}</li>
            <li>
              <div className="divider"></div>
            </li>
            <li>
              Opis: <p>{product.description}</p>
            </li>
          </ul>
        </div>
        <div>
          <div className="card bg-base-300 shadow-xl mt-3 md:mt-0">
            <div className="card-body">
              <div className="mb-2 flex justify-between">
                <div>Cena</div>
                <div>{product.price} PLN</div>
              </div>
              <div className="mb-2 flex justify-between">
                <div>Status</div>
                <div className={product.countInStock > 0 ? 'text-green-500' : 'text-red-500'}>
                  {product.countInStock > 0 ? 'Dostępny' : 'Niedostępny'}
                </div>
              </div>
              {product.countInStock !== 0 && (
                <>
                  <div className="card-actions justify-center">
                    <AddToCart
                      item={{
                        ...convertDocToObj(product),
                        qty: 0,
                        color: '',
                        size: '',
                      }}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/cart">
                      <div className="btn btn-accent w-full">Przejdź do koszyka</div>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
