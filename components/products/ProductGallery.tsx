"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ProductGallery = ({ images, mainImage }: { images: string[], mainImage?: string }) => {
  const [selectedImage, setSelectedImage] = useState(mainImage || images[0]);

  return (
    <div>
      <Zoom>
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
      </Zoom>
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
