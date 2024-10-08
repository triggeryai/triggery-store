import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AddToCart from '@/components/products/AddToCart';
import { Product } from '@/lib/models/ProductModel';
import Link from 'next/link';
import useLayoutService from '@/lib/hooks/useLayout';

const QuickReviewModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  const { theme } = useLayoutService(); // Get the current theme
  const [mainImage, setMainImage] = useState(product.mainImage || product.images[0]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState<boolean[]>(Array(product.images.length).fill(false));

  useEffect(() => {
    setContentLoaded(true);
  }, []);

  const handleThumbnailLoad = (index: number) => {
    setThumbnailLoaded(prev => {
      const newThumbnailLoaded = [...prev];
      newThumbnailLoaded[index] = true;
      return newThumbnailLoaded;
    });
  };

  // Funkcja sprawdzająca, czy obraz jest lokalny (jeśli nie, to Cloudinary lub inne)
  const getImageSrc = (src: string | undefined) => {
    if (!src) {
      return '/default-image.jpg'; // Domyślna ścieżka, jeśli `src` jest undefined lub pusty
    }
    if (src.startsWith('http')) {
      return src; // Pełny adres URL, np. Cloudinary
    }
    return `/products/${src}`; // Lokalny obraz z katalogu public/products
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 card card-side bg-base-100">
        <div className="relative w-full max-w-lg md:max-w-4xl p-4 md:p-6 lg:p-10 rounded-lg shadow-lg overflow-y-auto max-h-full">
          {!contentLoaded ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                <figure className="flex-1">
                  {!imageLoaded && !imageError && (
                    <div className="flex justify-center items-center h-full">
                      <div className="loader"></div>
                    </div>
                  )}
                  {imageError ? (
                    <div className="flex justify-center items-center h-full">
                      <span className="text-gray-500">Brak zdjęcia</span>
                    </div>
                  ) : (
                    <Image
                      src={getImageSrc(mainImage)}
                      alt={product.name}
                      width={300}
                      height={300}
                      layout="responsive"
                      className="rounded-md"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)} // Obsługa błędu ładowania obrazka
                    />
                  )}
                </figure>
                <div className="flex-1 space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold">{product.name}</h2>
                  <p>{product.brand}</p>
                  <div className="text-lg font-semibold">{product.price} PLN</div>
                  <p className="overflow-y-auto max-h-40">{product.description}</p>
                  <div className="flex items-center space-x-4">
                    <AddToCart item={{ ...product, qty: 1 }} />
                  </div>
                  <Link href="/cart">
                    <div className="block w-full text-center py-3 px-4 mt-4 rounded-lg shadow-md transition duration-300">
                      Przejdź do koszyka
                    </div>
                  </Link>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer border rounded"
                    onClick={() => {
                      setMainImage(image);
                      setImageLoaded(false);
                      setImageError(false); // Resetuj błąd obrazu po zmianie
                    }}
                  >
                    {!thumbnailLoaded[index] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="loader"></div>
                      </div>
                    )}
                    <Image
                      src={getImageSrc(image)}
                      alt={`Product Image ${index + 1}`}
                      width={50}
                      height={50}
                      className="object-cover rounded"
                      onLoad={() => handleThumbnailLoad(index)}
                      onError={() => setThumbnailLoaded(prev => {
                        const newThumbnailLoaded = [...prev];
                        newThumbnailLoaded[index] = true;
                        return newThumbnailLoaded;
                      })} // Obsługa błędu dla miniatury
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className={`w-10 h-10 flex items-center justify-center transition duration-300 ${
                theme === 'light' ? 'bg-black text-white' : 'bg-black text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickReviewModal;
