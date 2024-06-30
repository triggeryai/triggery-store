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
          <p>Wrocławska 29, Dzierzoniow, Poland | <a href="mailto:biuro.domestico@gmail.com" className="text-red-500">biuro.domestico@gmail.com</a> | domestico.pl</p>
          <p>Numer telefonu: <a href="tel:+48609258191" className="text-green-500">+48 609 258 191</a></p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-blue-500">Telegram</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500">Instagram</a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="text-white">TikTok</a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-700">Facebook</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Page;
