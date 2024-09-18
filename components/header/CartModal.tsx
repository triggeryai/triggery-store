'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import useCartService from '@/lib/hooks/useCartStore';
import Image from 'next/image';
import useLayoutService from '@/lib/hooks/useLayout';

const CartModal = () => {
  const { items, itemsPrice, decrease, increase } = useCartService();
  const { theme } = useLayoutService();
  const isDarkMode = theme === 'dark';

  // Dodajemy lokalny stan do kontrolowania widoczności modala
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // Funkcja obsługująca najechanie myszką (hover)
  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setIsHovered(true);
  };

  // Funkcja obsługująca wyjechanie myszką (hover leave)
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 300); // Opóźnienie 300ms przed zamknięciem
  };

  // Funkcja sprawdzająca, czy obraz jest lokalny (jeśli nie, to Cloudinary lub inne)
  const getImageSrc = (src: string | undefined) => {
    if (!src) {
      return '/default-image.jpg';
    }
    if (src.startsWith('http')) {
      return src;
    }
    return `/products/${src}`;
  };

  // Jeśli koszyk jest pusty, zawsze wyświetlamy komunikat
  if (items.length === 0) {
    return (
      <div
        className={`absolute right-0 top-12 p-4 w-80 shadow-xl rounded-lg z-50 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <p className="text-center">Twój koszyk jest pusty.</p>
      </div>
    );
  }

  return (
    <div
      className={`absolute right-0 top-12 p-4 w-80 shadow-xl rounded-lg z-50 max-h-[480px] overflow-y-auto ${isDarkMode ? 'bg-black' : 'bg-white'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.slug} className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-3">
              <Image
                src={getImageSrc(item.mainImage)}
                alt={item.name}
                width={50}
                height={50}
                className="object-cover rounded"
              />
              <span>{item.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="btn btn-xs rounded" type="button" onClick={() => decrease(item)}>
                -
              </button>
              <span>{item.qty}</span>
              <button className="btn btn-xs rounded" type="button" onClick={() => increase(item)}>
                +
              </button>
            </div>
            <span>{item.price} PLN</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-4">
        <div className="text-lg font-bold">Suma: {itemsPrice} PLN</div>
        <Link href="/cart">
          <button className="btn btn-primary">Zobacz Koszyk</button>
        </Link>
      </div>
    </div>
  );
};

export default CartModal;
