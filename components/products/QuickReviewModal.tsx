// components\products\QuickReviewModal.tsx
import React from 'react';
import Image from 'next/image';
import AddToCart from '@/components/products/AddToCart';
import { Product } from '@/lib/models/ProductModel';
import Link from 'next/link';

const QuickReviewModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  const item = {
    ...product, // Assuming product object has all necessary fields
    qty: 1, // Default quantity for the modal AddToCart component
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-4xl p-6 md:p-10 rounded-lg shadow-lg overflow-auto">
          <div className="flex flex-col md:flex-row gap-10">
            <figure className="md:flex-1">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                layout="responsive"
                className="rounded-md"
              />
            </figure>
            <div className="md:flex-1 space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
              <p className="text-gray-500">{product.brand}</p>
              <div className="text-lg font-semibold text-gray-800">${product.price}</div>
              <p className="text-gray-600">{product.description}</p>
              <div className="flex items-center space-x-4">
                <AddToCart item={item} />
              </div>
              <Link href="/cart">
                <div className="block w-full text-center py-3 px-4 mt-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
                  Go to cart
                </div>
              </Link>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 transition duration-300">
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
