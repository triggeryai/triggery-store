// components/header/CartModalMobile.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useCartService from '@/lib/hooks/useCartStore';

const CartModalMobile = ({ onClose }) => {
  const { items, itemsPrice, decrease, increase } = useCartService();

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative p-6 w-80 bg-white text-[#222] shadow-lg">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
            &times;
          </button>
          <p>Twój koszyk jest pusty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 w-80 bg-white shadow-lg overflow-y-auto" style={{ maxHeight: '80vh' }}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
          &times;
        </button>
        <ul>
          {items.map((item, index) => (
            <li key={item.slug} className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Image src={item.image} alt={item.name} width={30} height={30} />
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
