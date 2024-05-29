// plik: page.tsx
import React from 'react';
import BackQuote from './BackQuote'; // Ensure the import path is correct
import BackQuoteRight from './BackQuoteRight'; // Ensure the import path is correct
import FourGridImages from './FourGridImages';
import GoogleMap from './GoogleMap';

export const metadata = {
  title: 'Domestico - Your Chemical Store',
};

const Page: React.FC = () => {
  return (
    <>
      <BackQuote />
      <BackQuoteRight />
      <FourGridImages />
      <GoogleMap />
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Domestico. All rights reserved.</p>
          <p>Wrocławska 29, Dzierzoniow, Poland | biuro.domestico@gmail.com | domestico.pl</p>
        </div>
      </footer>
    </>
  );
}

export default Page;
