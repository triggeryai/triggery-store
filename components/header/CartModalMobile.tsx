'use client';

import React from 'react';
import Link from 'next/link';
import useCartService from '@/lib/hooks/useCartStore';
import Image from 'next/image';

const CartModalMobile = ({ onClose }) => {
  const { items, itemsPrice, decrease, increase } = useCartService();

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

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 dark:bg-opacity-75">
        <div className="relative p-6 w-80 bg-base-100 shadow-lg rounded-lg">
          <button onClick={onClose} className="absolute top-2 right-2">
            &times;
          </button>
          <p className="text-center">Twój koszyk jest pusty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 dark:bg-opacity-75">
      <div className="relative p-6 w-80 bg-base-100 shadow-lg rounded-lg overflow-y-auto" style={{ maxHeight: '80vh' }}>
        <button onClick={onClose} className="absolute top-2 right-2">
          &times;
        </button>
        <ul>
          {items.map((item, index) => (
            <li key={item.slug} className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Image
                  src={getImageSrc(item.mainImage)}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="object-cover rounded"
                />
                <span className="ml-2">{item.name}</span>
              </div>
              <div className="flex items-center">
                <button className="btn btn-xs" type="button" onClick={() => decrease(item)}>
                  -
                </button>
                <span className="mx-2">{item.qty}</span>
                <button className="btn btn-xs" type="button" onClick={() => increase(item)}>
                  +
                </button>
              </div>
              <span>{item.price} PLN</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="font-bold">Suma:</span> {itemsPrice} PLN
          </div>
          <Link href="/cart">
            <button className="btn btn-primary">Zobacz Koszyk</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartModalMobile;
