// components/products/ProductGallery.tsx
"use client";
import React, { useState } from 'react';
import Image from 'next/image';

const ProductGallery = ({ images, mainImage }: { images: string[], mainImage?: string }) => {
  const [selectedImage, setSelectedImage] = useState(mainImage || images[0]);

  return (
    <div>
      <Image
        src={selectedImage}
        alt="Selected Product Image"
        width={640}
        height={640}
        sizes="100vw"
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
      <div className="flex space-x-2 mt-4">
        {images.map((img, index) => (
          <div key={index} className="w-24 h-24 cursor-pointer" onClick={() => setSelectedImage(img)}>
            <Image
              src={img}
              alt={`Product Thumbnail ${index + 1}`}
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
