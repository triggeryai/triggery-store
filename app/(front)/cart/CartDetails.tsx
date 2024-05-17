// app\(front)\cart\CartDetails.tsx
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
  }, []);

  if (!mounted) return <></>;

  const handleClearCartConfirmation = () => setShowModal(true);

  const handleClearCart = () => {
    clear();
    setShowModal(false);
    toast.success('Cart has been cleared!');
  };

  const handleIncrease = (item) => {
    if (item.countInStock > 0) {
      increase(item);
      toast.success('Product added to the cart!');
    } else {
      toast.error('This product is out of stock and cannot be added to the cart.');
    }
  };

  const handleDecrease = (item) => {
    decrease(item);
    toast.success('Product removed from the cart!');
  };

  return (
    <>
      <h1 className="py-4 text-2xl">
        Shopping Cart
        {items.length > 0 && (
          <button
            className="btn btn-error btn-sm ml-4"
            onClick={handleClearCartConfirmation}
          >
            Clear Cart
          </button>
        )}
      </h1>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure you want to clear the cart?</h3>
            <div className="modal-action">
              <button className="btn btn-outline btn-error" onClick={handleClearCart}>Yes</button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div>
          Cart is empty.         
          <Link href="/search?q=">
          <div className="inline-block px-6 py-3 text-sm font-medium leading-6 text-center text-white transition duration-300 ease-in-out bg-blue-500 rounded-md shadow-lg hover:bg-blue-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Go shopping
          </div>
        </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
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
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
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
                        onClick={() => item.qty < item.countInStock ? handleIncrease(item) : null}
                        disabled={item.qty >= item.countInStock}
                      >
                        +
                      </button>
                    </td>
                    <td>${item.price}</td>
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
                      Subtotal ({items.reduce((a, c) => a + c.qty, 0)}) : $
                      {itemsPrice}
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push('/shipping')}
                      className="btn btn-primary w-full"
                    >
                      Proceed to Checkout
                    </button>
                  </li>
                  <li>
                    <div className="mt-4 text-center">
                      <Link href="/search?category=all">
                        <button className="btn btn-accent w-full">Back to Shopping</button>
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
