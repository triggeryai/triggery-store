import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaTelegram } from 'react-icons/fa';
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
            <a href="https://t.me/Bynia2137" target="_blank" rel="noopener noreferrer" className="text-blue-500"><FaTelegram className="inline mr-2" /> Telegram</a>
            <a href="https://www.instagram.com/domestico.pl/" target="_blank" rel="noopener noreferrer" className="text-pink-500"><FaInstagram className="inline mr-2" /> Instagram</a>
            <a href="https://www.tiktok.com/@domestico.pl" target="_blank" rel="noopener noreferrer" className="text-white"><FaTiktok className="inline mr-2" /> TikTok</a>
            <a href="https://www.facebook.com/domesticopl/" target="_blank" rel="noopener noreferrer" className="text-blue-700"><FaFacebook className="inline mr-2" /> Facebook</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Page;
