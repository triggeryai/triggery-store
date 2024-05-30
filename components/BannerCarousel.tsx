/* eslint-disable @next/next/no-img-element */
"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';

const carouselSlides = [
  { id: 1, src: '/images/banner1.jpg', path: '/sample-path-1' },
  { id: 2, src: '/images/banner2.jpg', path: '/sample-path-2' },
  { id: 3, src: '/images/banner1.jpg', path: '/sample-path-3' },
];

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleSlideClick = (path) => {
    window.location.href = path;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-box mt-4 cursor-pointer" onClick={() => handleSlideClick(carouselSlides[currentSlide].path)}>
      <div className="flex transition-transform duration-1000" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {carouselSlides.map((slide) => (
          <div key={slide.id} className="min-w-full">
            <img src={slide.src} className="w-full" alt={`Banner ${slide.id}`} />
          </div>
        ))}
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentSlide(currentSlide === 0 ? carouselSlides.length - 1 : currentSlide - 1);
          }}
          className="btn btn-circle ml-4 z-20"
        >
          ❮
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentSlide((currentSlide + 1) % carouselSlides.length);
          }}
          className="btn btn-circle mr-4 z-20"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default BannerCarousel;
