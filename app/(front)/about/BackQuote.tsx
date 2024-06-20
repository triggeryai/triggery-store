import React from 'react';
import Image from 'next/image';

const BackQuote: React.FC = () => {
  return (
    <section className="py-10 lg:py-20 bg-stone-100 font-poppins dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0">
            <Image
              src="/shop.jpg" // Ścieżka do pliku obrazu w katalogu public
              alt="Sklep"
              width={1341} // Szerokość obrazu - dostosuj w razie potrzeby
              height={768} // Wysokość obrazu - dostosuj w razie potrzeby
              layout="responsive" // Powoduje skalowanie obrazu w zależności od elementu nadrzędnego
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <div className="border-l-4 border-blue-500 pl-4 mb-6">
              <span className="text-sm text-gray-600 uppercase dark:text-gray-400">Kim jesteśmy?</span>
              <h1 className="mt-2 text-3xl font-black text-gray-700 dark:text-gray-300">
                O Nas
              </h1>
            </div>
            <p className="mb-10 text-gray-500 dark:text-gray-400">
              W Domestico dostarczamy najwyższej jakości produkty do sprzątania, aby zapewnić czystość i higienę Twoich przestrzeni. Nasza szeroka gama produktów jest dostosowana do wszelkich potrzeb związanych ze sprzątaniem.
            </p>
            <blockquote className="p-4 italic border-l-4 bg-neutral-100 text-neutral-600 border-neutral-500 quote rounded-md shadow-md">
              <p className="mb-2">&quot;Dla mnie najwazniejszy jest klient&quot;</p>
              <cite className="flex items-center">
                <span className="mr-3 font-bold text-neutral-800">- Marta Byczek</span>
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BackQuote;
