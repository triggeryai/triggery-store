// app/(front)/cart/CartDetails.tsx
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

  useEffect(() => {
    setMounted(true);
    console.log('Cart items in CartDetails:', items); // Logowanie
  }, [items]);
  
  items.forEach(item => {
    console.log('Item mainImage:', item.mainImage);
  });
  

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
        <div>
          Koszyk jest pusty.        
          <Link href="/search?q=">
            <div className="inline-block px-6 py-3 text-sm font-medium leading-6 text-center text-white transition duration-300 ease-in-out bg-blue-500 rounded-md shadow-lg hover:bg-blue-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
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
                {items.map((item) => (
                  <tr key={item.slug}>
                    <td>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        {item.mainImage ? (
                          <Image
                            src={item.mainImage}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="object-cover"
                          />
                        ) : (
                          <span>{item.name}</span>
                        )}
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
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="card bg-base-300">
              <div className="card-body">
                <ul>
                  <li>
                    <div className="pb-3 text-xl">
                      Do zapłaty {/* ({items.reduce((a, c) => a + c.qty, 0)})  */}
                      {' '} <span className="font-bold"> {itemsPrice} PLN</span>
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
