// components\products\QuickReviewModal.tsx
import React from 'react';
import Image from 'next/image';
import AddToCart from '@/components/products/AddToCart';
import { Product } from '@/lib/models/ProductModel';
import Link from 'next/link'; // Add this line to import Link

const QuickReviewModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  // Create the item object with all required properties
  const item = {
    ...product, // Assuming product object has all necessary fields
    qty: 1, // Default quantity for the modal AddToCart component
    // Add other properties that AddToCart expects, if needed
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="modal-box relative bg-white w-full max-w-4xl p-10 overflow-auto">
          <div className="flex flex-col md:flex-row gap-10">
            <figure className="md:flex-1">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                layout="responsive"
              />
            </figure>
            <div className="md:flex-1 space-y-4">
              <h2 className="text-3xl font-bold">{product.name}</h2>
              <p className="text-gray-700">{product.brand}</p>
              <div className="text-lg">${product.price}</div>
              <p>{product.description}</p>
              <AddToCart item={item} />
              <Link href="/cart">
                <div className="btn btn-primary w-full text-center">
                  Go to cart
                </div>
              </Link>
            </div>
          </div>
          <div className="modal-action">
            <button onClick={onClose} className="btn btn-outline btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickReviewModal;

