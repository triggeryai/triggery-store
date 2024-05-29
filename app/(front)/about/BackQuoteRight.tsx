import React from 'react';
import Image from 'next/image';

const BackQuoteRight: React.FC = () => {
  return (
    <section id="about" className="py-10 lg:py-20 bg-stone-100 font-poppins dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0 order-2 lg:order-1">
            <div className="border-l-4 border-blue-500 pl-4 mb-6">
              <span className="text-sm text-gray-600 uppercase dark:text-gray-400">Who we are?</span>
              <h1 className="mt-2 text-3xl font-black text-gray-700 dark:text-gray-300">
                About Us
              </h1>
            </div>
            <p className="mb-10 text-gray-500 dark:text-gray-400">
              At Domestico, we pride ourselves on providing the highest quality cleaning products and supplies. Our mission is to ensure our customers have access to the best products at competitive prices.
            </p>
            <blockquote className="p-4 italic border-l-4 bg-neutral-100 text-neutral-600 border-neutral-500 quote rounded-md shadow-md">
              <p className="mb-2">&quot;Successfully providing business solutions for 25 years&quot;</p>
              <cite className="flex items-center">
                <span className="mr-3 font-bold text-neutral-800">- John Doe, CEO</span>
              </cite>
            </blockquote>
          </div>
          <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0 order-1 lg:order-2">
            <Image
              src="/shop.jpg" // The path to your image file in the public directory
              alt="Shop"
              width={1341} // The width of the image - adjust as necessary
              height={768} // The height of the image - adjust as necessary
              layout="responsive" // Makes the image scale based on the parent element
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default BackQuoteRight;
