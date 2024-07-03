// components/header/CartModalMobile.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import useCartService from '@/lib/hooks/useCartStore';
import Image from 'next/image';

const CartModalMobile = ({ onClose }) => {
  const { items, itemsPrice, decrease, increase } = useCartService();

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 dark:bg-opacity-75">
        <div className="relative p-6 w-80 bg-white text-[#222] dark:bg-gray-800 dark:text-gray-200 shadow-lg">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-500">
            &times;
          </button>
          <p>Twój koszyk jest pusty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 dark:bg-opacity-75">
      <div className="relative p-6 w-80 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto" style={{ maxHeight: '80vh' }}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-500">
          &times;
        </button>
        <ul>
          {items.map((item, index) => (
            <li key={item.slug} className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                {item.mainImage && (
                  <Image
                    src={item.mainImage}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                )}
                <span className="ml-2 text-[#222] dark:text-gray-200">{item.name}</span>
              </div>
              <div className="flex items-center">
                <button className="btn btn-xs" type="button" onClick={() => decrease(item)}>
                  -
                </button>
                <span className="mx-2 text-[#222] dark:text-gray-200">{item.qty}</span>
                <button className="btn btn-xs" type="button" onClick={() => increase(item)}>
                  +
                </button>
              </div>
              <span className="text-[#222] dark:text-gray-200">{item.price} PLN</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center mt-2">
          <div className="text-[#222] dark:text-gray-200">
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
