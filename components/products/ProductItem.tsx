"use client"
import React, { useEffect, useState } from 'react';
import AddToCart from '@/components/products/AddToCart';
import QuickReviewModal from '@/components/products/QuickReviewModal';
import { Product } from '@/lib/models/ProductModel';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductItem({ product }: { product: Product }) {
  const [showQuickReview, setShowQuickReview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState({...product});

  useEffect(() => {
    // Założono, że istnieje endpoint API, który zwraca aktualny stan magazynowy produktu na podstawie jego slug
    const fetchProductStock = async () => {
      try {
        const response = await fetch(`/api/stock/${product.slug}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setItem(prev => ({ ...prev, countInStock: data.countInStock }));
      } catch (error) {
        console.error('Error fetching product stock:', error);
      }
    };
    
    fetchProductStock();
  }, [product.slug]);

  return (
    <div className="card bg-base-300 shadow-xl mb-4 relative group">
      <figure className="relative">
        <Link href={`/product/${product.slug}`}>
          <div>
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="object-cover h-64 w-full"
            />
          </div>
        </Link>
        <div 
          className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center items-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setShowModal(true)}
        >
          <span className="text-white text-lg p-2">QUICK REVIEW</span>
        </div>
      </figure>
      <div className="card-body">
        <Link href={`/product/${product.slug}`}>
          <div>
            <h2 className="card-title font-normal">{product.name}</h2>
          </div>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <div className="card-actions flex items-center justify-between">
          <span className="text-2xl">${product.price}</span>
          <AddToCart item={item} />
        </div>
      </div>
      {showModal && (
        <QuickReviewModal product={product} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
