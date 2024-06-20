import Image from 'next/image';

const FourGridImages: React.FC = () => {
  return (
    <section id="products" className="flex items-center py-20 bg-white dark:bg-gray-800">
      <div className="justify-center flex-1 max-w-6xl px-4 py-4 mx-auto lg:py-6 md:px-6">
        <div className="flex flex-wrap items-center">
          <div className="w-full px-4 mb-10 xl:w-1/2 lg:mb-8">
            <div className="flex flex-wrap">
              <div className="w-full px-4 md:w-1/2">
                <Image
                  src="/shop.jpg"
                  alt="Obraz 1"
                  className="object-cover w-full mb-6 rounded-lg shadow-lg h-80"
                  width={640}
                  height={426}
                />
                <Image
                  src="/shop.jpg"
                  alt="Obraz 2"
                  className="object-cover w-full rounded-lg shadow-lg h-80"
                  width={640}
                  height={426}
                />
              </div>
              <div className="w-full px-4 md:w-1/2 xl:mt-11">
                <Image
                  src="/shop.jpg"
                  alt="Obraz 3"
                  className="object-cover w-full mb-6 rounded-lg shadow-lg h-80"
                  width={640}
                  height={426}
                />
                <Image
                  src="/shop.jpg"
                  alt="Obraz 4"
                  className="object-cover w-full rounded-lg shadow-lg h-80"
                  width={640}
                  height={426}
                />
              </div>
            </div>
          </div>
          <div className="w-full px-4 mb-10 xl:w-1/2 lg:mb-8 text-center lg:text-left">
            <span className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase">Dlaczego my</span>
            <h2 className="mt-2 mb-4 text-3xl font-bold text-gray-700 dark:text-gray-300">
              Oferujemy lepsze produkty
            </h2>
            <p className="mb-4 text-lg leading-7 text-gray-500 dark:text-gray-400">
              Odkryj szeroką gamę najwyższej jakości produktów do sprzątania, papieru toaletowego i chusteczek od wiodących marek w Domestico.
            </p>
            <ul className="mb-10 text-left">
              <li className="flex items-start mb-2">
                <span className="bg-blue-500 rounded-full p-2 text-white mr-2">✓</span> Wysokiej jakości produkty
              </li>
              <li className="flex items-start mb-2">
                <span className="bg-blue-500 rounded-full p-2 text-white mr-2">✓</span> Przystępne ceny
              </li>
              <li className="flex items-start mb-2">
                <span className="bg-blue-500 rounded-full p-2 text-white mr-2">✓</span> Szybka dostawa
              </li>
            </ul>
            <a href="/search" className="px-4 py-2 text-white bg-blue-500 rounded-md dark:bg-blue-400 dark:hover:bg-blue-500 hover:bg-blue-600">
              Nasze produkty
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FourGridImages;
