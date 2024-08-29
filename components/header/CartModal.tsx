'use client';

import React from 'react';
import Link from 'next/link';
import useCartService from '@/lib/hooks/useCartStore';
import Image from 'next/image';

const CartModal = () => {
  const { items, itemsPrice, decrease, increase } = useCartService();

  if (items.length === 0) {
    return (
      <div className="absolute right-0 p-3 w-72 card card-compact bg-base-100 shadow-xl z-50">
        <p>Twój koszyk jest pusty.</p>
      </div>
    );
  }

  // Ustawienie wysokości dla 7 elementów listy.
  // Jeśli jeden element listy ma więcej niż 50px, zmień wartość poniżej odpowiednio.
  const maxHeightForSevenItems = 70 * 7;

  return (
    <div className="absolute right-0 p-3 w-72 bg-white dark:bg-gray-800 shadow-lg z-50" 
         style={{ maxHeight: `${maxHeightForSevenItems}px`, overflowY: items.length > 7 ? 'scroll' : 'hidden' }}>
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
        <div>
          <span className="font-bold text-[#222] dark:text-gray-200">Suma:</span> {itemsPrice} PLN
        </div>
        <Link href="/cart">
          <button className="btn btn-primary">Zobacz Koszyk</button>
        </Link>
      </div>
    </div>
  );
};

export default CartModal;
