"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const FourGridImages: React.FC = () => {
  const [loadingImages, setLoadingImages] = useState({
    image1: true,
    image2: true,
    image3: true,
    image4: true,
  });

  const [loadingText, setLoadingText] = useState(true);

  useEffect(() => {
    const textTimer = setTimeout(() => setLoadingText(false), 1000); // Symulowane ładowanie tekstu
    return () => clearTimeout(textTimer);
  }, []);

  const handleImageLoad = (imageKey: string) => {
    setLoadingImages((prev) => ({ ...prev, [imageKey]: false }));
  };

  return (
    <section id="products" className="flex items-center py-20">
      <div className="justify-center flex-1 max-w-6xl px-4 py-4 mx-auto lg:py-6 md:px-6">
        <div className="flex flex-wrap items-center">
          <div className="w-full px-4 mb-10 xl:w-1/2 lg:mb-8">
            <div className="flex flex-wrap">
              <div className="w-full px-4 md:w-1/2">
                {loadingImages.image1 ? (
                  <div className="w-full h-80 flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                  </div>
                ) : null}
                <Image
                  src="/shop.jpg"
                  alt="Obraz 1"
                  className="object-cover w-full mb-6 rounded-lg shadow-lg h-80"
                  width={640}
                  height={426}
                  onLoadingComplete={() => handleImageLoad('image1')}
                />
                {loadingImages.image2 ? (
                  <div className="w-full h-80 flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                  </div>
                ) : null}
                <Image
                  src="/shop1.jpg"
                  alt="Obraz 2"
                  className="object-cover w-full rounded-lg shadow-lg h-80"
                  width={640}
                  height={426}
                  onLoadingComplete={() => handleImageLoad('image2')}
                />
              </div>
              <div className="w-full px-4 md:w-1/2 xl:mt-11">
                {loadingImages.image3 ? (
                  <div className="w-full h-80 flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                  </div>
                ) : null}
                <Image
                  src="/shop3.jpg"
                  alt="Obraz 3"
                  className="object-cover w-full mb-6 rounded-lg shadow-lg h-80"
                  width={640}
                  height={426}
                  onLoadingComplete={() => handleImageLoad('image3')}
                />
                {loadingImages.image4 ? (
                  <div className="w-full h-80 flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                  </div>
                ) : null}
                <Image
                  src="/shop2.jpg"
                  alt="Obraz 4"
                  className="object-cover w-full rounded-lg shadow-lg h-80"
                  width={640}
                  height={426}
                  onLoadingComplete={() => handleImageLoad('image4')}
                />
              </div>
            </div>
          </div>
          <div className="w-full px-4 mb-10 xl:w-1/2 lg:mb-8 text-center lg:text-left">
            {loadingText ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                <span className="ml-4 text-lg text-blue-500 font-semibold">Ładowanie...</span>
              </div>
            ) : (
              <>
                <span className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase">Dlaczego my</span>
                <h2 className="mt-2 mb-4 text-3xl font-bold">
                  Oferujemy lepsze produkty
                </h2>
                <p className="mb-4 text-lg leading-7 text-gray-500 dark:text-gray-400">
                  Odkryj szeroką gamę najwyższej jakości produktów do sprzątania, papieru toaletowego i chusteczek od wiodących marek w Domestico.pl!
                </p>
                <ul className="mb-10 text-left">
                  <li className="flex items-start mb-2">
                    <span className="bg-blue-500 rounded-full p-2 mr-2">✓</span> 
                    <p>Wysokiej jakości produkty</p>
                  </li>
                  <li className="flex items-start mb-2">
                    <span className="bg-blue-500 rounded-full p-2 mr-2">✓</span> 
                    <p>Przystępne ceny</p>
                  </li>
                  <li className="flex items-start mb-2">
                    <span className="bg-blue-500 rounded-full p-2 mr-2">✓</span> 
                    <p>Szybka dostawa</p>
                  </li>
                </ul>
                <a href="/search" className="px-4 py-2 text-white bg-blue-500 rounded-md dark:bg-blue-400 dark:hover:bg-blue-500 hover:bg-blue-600">
                  Nasze produkty
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FourGridImages;
