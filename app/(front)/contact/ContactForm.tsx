// plik: components/ContactForm.tsx

import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTelegramPlane, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

const ContactForm: React.FC = () => {
  return (
    <section className="py-6 dark:bg-gray-800 dark:text-gray-50">
      <div className="grid max-w-6xl grid-cols-1 px-6 mx-auto lg:px-8 md:grid-cols-2 md:divide-x">
        <div className="py-6 md:py-0 md:px-6">
          <h1 className="text-4xl font-bold">Skontaktuj się z nami</h1>
          <p className="pt-2 pb-4">Wypełnij formularz, aby rozpocząć rozmowę</p>
          <div className="space-y-4">
            <p className="flex items-center">
              <FaMapMarkerAlt className="w-5 h-5 mr-2 sm:mr-6" />
              <a href="https://www.google.com/maps/place/Wroc%C5%82awska+29,+58-200+Dzier%C5%BConi%C3%B3w" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Dzierżoniów 58-200 Wrocławska 29 (Odra)
              </a>
            </p>
            <p className="flex items-center">
              <FaPhone className="w-5 h-5 mr-2 sm:mr-6" />
              <a href="tel:+48 609 258 191" className="hover:underline">
                +48 609 258 191
              </a>
            </p>
            <p className="flex items-center">
              <FaEnvelope className="w-5 h-5 mr-2 sm:mr-6" />
              <a href="mailto:biuro.domestico@gmail.com" className="hover:underline">
                biuro.domestico@gmail.com
              </a>
            </p>
          </div>
        </div>
        <div className="flex flex-col py-6 space-y-6 md:py-0 md:px-6">
          <p className="text-xl font-bold">Znajdź nas w mediach społecznościowych</p>
          <div className="flex space-x-4 justify-center">
            <a href="https://t.me/YourTelegram" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-500">
              <FaTelegramPlane />
            </a>
            <a href="https://facebook.com/YourFacebook" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-700">
              <FaFacebook />
            </a>
            <a href="https://instagram.com/YourInstagram" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-pink-500">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com/@YourTikTok" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-black">
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
