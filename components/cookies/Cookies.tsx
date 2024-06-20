// plik: components/cookies/Cookies.tsx
"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import komponentu Link
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image'; // Import komponentu Image

const Cookies: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 w-64">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Image src="https://www.svgrepo.com/show/401340/cookie.svg" alt="Cookie" width={24} height={24} className="mr-2" />
            <span className="text-gray-700 font-bold text-sm">Polityka cookies</span>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
        <p className="text-gray-600 text-sm">
          Używamy plików cookie, aby poprawić Twoje doświadczenia. Kontynuując wizytę na tej stronie, zgadzasz się na naszą politykę dotyczącą plików cookie.
          {/* Dodajemy link do polityki prywatności */}
          <Link href="/privacy">
            <button className="text-blue-600 hover:underline">Dowiedz się więcej o naszej Polityce Prywatności.</button>
          </Link>
        </p>
        <div className="flex justify-between">
          <button onClick={handleAccept} className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">
            Akceptuj
          </button>
          <button onClick={handleDecline} className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Odrzuć
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
