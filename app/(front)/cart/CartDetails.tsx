// next-amazona-v2/app/(front)/cart/CartDetails.tsx
'use client';

import React, { useState, useEffect } from 'react';
import useCartService from '@/lib/hooks/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartDetails() {
  const router = useRouter();
  const { items, itemsPrice, decrease, increase, clear } = useCartService();
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading entire component
  const [loadingItems, setLoadingItems] = useState(true); // State for loading cart items

  useEffect(() => {
    setMounted(true);
    // Simulate loading time for entire component
    setTimeout(() => setLoading(false), 1000);
    setTimeout(() => setLoadingItems(false), 1500);
  }, [items]);

  if (!mounted) return <></>;

  const handleClearCartConfirmation = () => setShowModal(true);

  const handleClearCart = () => {
    clear();
    setShowModal(false);
    toast.success('Koszyk został wyczyszczony!');
  };

  const handleIncrease = (item) => {
    if (item.countInStock > 0) {
      increase(item);
      toast.success('Produkt dodany do koszyka!');
    } else {
      toast.error('Ten produkt jest niedostępny i nie można go dodać do koszyka.');
    }
  };

  const handleDecrease = (item) => {
    decrease(item);
    toast.success('Produkt usunięty z koszyka!');
  };

  const getImageSrc = (src: string | undefined) => {
    if (!src) {
      return '/default-image.jpg'; 
    }
    if (src.startsWith('http')) {
      return src; 
    }
    return `/products/${src}`; 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <span className="ml-4 text-lg text-blue-500 font-semibold">Ładowanie koszyka...</span>
      </div>
    );
  }

  return (
    <>
      <h1 className="py-4 text-2xl">
        Koszyk
        {items.length > 0 && (
          <button
            className="btn btn-error btn-sm ml-4"
            onClick={handleClearCartConfirmation}
          >
            Wyczyść koszyk
          </button>
        )}
      </h1>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Czy na pewno chcesz wyczyścić koszyk?</h3>
            <div className="modal-action">
              <button className="btn btn-outline btn-error" onClick={handleClearCart}>Tak</button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Nie</button>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 pb-20">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-16 h-16 mx-auto text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h18M3 8h18M7 12h2m4 0h6M7 16h10m4 0h2m-2 4H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H3"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-semibold">
              Twój koszyk jest pusty
            </h2>
            <p className="mt-2">
              Wydaje się, że nie dodałeś jeszcze żadnych produktów do swojego koszyka.
            </p>
          </div>
          <Link href="/search?q=">
            <div className="mt-6 inline-block px-8 py-4 text-lg font-semibold leading-7 text-center text-white transition duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg hover:bg-gradient-to-l hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transform hover:-translate-y-1">
              Kontynuuj zakupy
            </div>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>Ilość</th>
                  <th>Cena</th>
                </tr>
              </thead>
              <tbody>
                {loadingItems ? (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <tr key={i}>
                        <td>
                          <div className="flex items-center animate-pulse">
                            <div className="bg-gray-200 w-16 h-16 rounded mr-4"></div>
                            <div className="bg-gray-200 h-6 w-32"></div>
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-center items-center space-x-4">
                            <div className="bg-gray-200 h-6 w-8"></div>
                          </div>
                        </td>
                        <td className="bg-gray-200 h-6 w-16"></td>
                      </tr>
                    ))}
                  </>
                ) : (
                  items.map((item) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={getImageSrc(item.mainImage)}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="object-cover"
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </td>
                      <td>
                        <button
                          className="btn"
                          type="button"
                          onClick={() => handleDecrease(item)}
                        >
                          -
                        </button>
                        <span className="px-2">{item.qty}</span>
                        <button
                          className="btn"
                          type="button"
                          onClick={() =>
                            item.qty < item.countInStock ? handleIncrease(item) : null
                          }
                          disabled={item.qty >= item.countInStock}
                        >
                          +
                        </button>
                      </td>
                      <td>{item.price} PLN</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div>
            <div className="card bg-base-300 pb-20">
              <div className="card-body">
                <ul>
                  <li>
                    <div className="pb-3 text-xl">
                      Do zapłaty <span className="font-bold"> {itemsPrice} PLN</span>
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push('/shipping')}
                      className="btn btn-primary w-full"
                    >
                      Przejdź do płatności
                    </button>
                  </li>
                  <li>
                    <div className="mt-4 text-center">
                      <Link href="/search?category=all">
                        <button className="btn btn-accent w-full">Wróć do zakupów</button>
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
