import React from 'react';
import Image from 'next/image';

const BackQuoteRight: React.FC = () => {
  return (
    <section id="about" className="py-10 lg:py-20 bg-stone-100 font-poppins dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0 order-2 lg:order-1">
            <div className="border-l-4 border-blue-500 pl-4 mb-6">
              <span className="text-sm text-gray-600 uppercase dark:text-gray-400">Domestico.pl</span>
              <h1 className="mt-2 text-3xl font-black text-gray-700 dark:text-gray-300">
                Sklep internetowy i stacjonarny.
              </h1>
            </div>
            <p className="mb-10 text-gray-500 dark:text-gray-400">
              Domestico to sklep stacjonarny i internetowy, który oferuje chemię gospodarczą oraz produkty związane z domem. Nasza misja to dostarczanie wysokiej jakości produktów, które ułatwią codzienne życie naszych klientów. Doradzamy i dbamy o zadowolenie każdego klienta.
            </p>
            <blockquote className="p-4 italic border-l-4 bg-neutral-100 text-neutral-600 border-neutral-500 quote rounded-md shadow-md">
              <p className="mb-2">Kazdy klient moze zapytac o co tylko chce!</p>
              <cite className="flex items-center">
                <span className="mr-3 font-bold text-neutral-800">Napisz, a pomozemy doradzic!</span>
              </cite>
            </blockquote>
          </div>
          <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0 order-1 lg:order-2">
            <Image
              src="/shop5.jpg" // Ścieżka do pliku obrazu w katalogu public
              alt="Sklep"
              width={1341} // Szerokość obrazu - dostosuj w razie potrzeby
              height={768} // Wysokość obrazu - dostosuj w razie potrzeby
              layout="responsive" // Powoduje skalowanie obrazu w zależności od elementu nadrzędnego
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default BackQuoteRight;
