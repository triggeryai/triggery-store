"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const BackQuoteRight: React.FC = () => {
  const [loadingText, setLoadingText] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const textTimer = setTimeout(() => setLoadingText(false), 1000); // Symulowane ładowanie tekstu
    return () => clearTimeout(textTimer); // Czyszczenie timeoutu dla tekstu
  }, []);

  const handleImageLoad = () => {
    setLoadingImage(false); // Ustawienie loading na false po załadowaniu obrazu
  };

  return (
    <section id="about" className="py-10 lg:py-20 font-poppins">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0 order-2 lg:order-1">
            {loadingText ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                <span className="ml-4 text-lg text-blue-500 font-semibold">Ładowanie...</span>
              </div>
            ) : (
              <>
                <div className="border-l-4 border-blue-500 pl-4 mb-6">
                  <span className="text-sm uppercase">Domestico.pl</span>
                  <h1 className="mt-2 text-3xl font-black">
                    Sklep internetowy i stacjonarny.
                  </h1>
                </div>
                <p className="mb-10 text-gray-500">
                  Domestico to sklep stacjonarny i internetowy, który oferuje chemię gospodarczą oraz produkty związane z domem. Nasza misja to dostarczanie wysokiej jakości produktów, które ułatwią codzienne życie naszych klientów. Doradzamy i dbamy o zadowolenie każdego klienta.
                </p>
                <blockquote className="p-4 italic border-l-4 border-neutral-500 quote rounded-md shadow-md">
                  <p className="mb-2">Kazdy klient moze zapytac o co tylko chce!</p>
                  <cite className="flex items-center">
                    <span className="mr-3 font-bold">Napisz, a pomozemy doradzic!</span>
                  </cite>
                </blockquote>
              </>
            )}
          </div>
          <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0 order-1 lg:order-2">
            {loadingImage && (
              <div className="flex justify-center items-center h-full">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                <span className="ml-4 text-lg text-blue-500 font-semibold">Ładowanie obrazu...</span>
              </div>
            )}
            <Image
              src="/shop5.jpg" // Ścieżka do pliku obrazu w katalogu public
              alt="Sklep"
              width={1341} // Szerokość obrazu - dostosuj w razie potrzeby
              height={768} // Wysokość obrazu - dostosuj w razie potrzeby
              layout="responsive" // Powoduje skalowanie obrazu w zależności od elementu nadrzędnego
              className="rounded-lg shadow-lg"
              onLoadingComplete={handleImageLoad} // Callback po załadowaniu obrazu
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BackQuoteRight;
