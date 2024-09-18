// plik: components\footer\Footer.tsx
"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaTiktok, FaInstagram, FaTelegram } from 'react-icons/fa';
import SupportBotModal from '../support_bot/SupportBotModal';

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <footer className="bg-base-300 text-base-content mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columns with links */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg mb-3">Ważne linki</h3>
            <Link href="/about"><span className="block link link-hover">O nas</span></Link>
            <Link href="/contact"><span className="block link link-hover">Kontakt</span></Link>
            <button onClick={handleModalOpen} className="block link link-hover text-left">Wsparcie</button>
            <Link href="/faq"><span className="block link link-hover">FAQ</span></Link>
            <Link href="/search?q=&category=all&price=all&rating=all&sort=newest&page=1"><span className="block link link-hover">Kup coś</span></Link>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg mb-3">Prawne</h3>
            <Link href="/privacy"><span className="block link link-hover">Polityka Prywatności</span></Link>
            <Link href="/terms"><span className="block link link-hover">Regulamin</span></Link>
            <Link href="/return-policy"><span className="block link link-hover">Polityka Zwrotów</span></Link>
            <Link href="/warranty"><span className="block link link-hover">Gwarancja</span></Link>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg mb-3">Moje Konto</h3>
            <Link href="/profile"><span className="block link link-hover">Moje Konto</span></Link>
            <Link href="/order-history"><span className="block link link-hover">Moje Zamówienia</span></Link>
            <Link href="/cart"><span className="block link link-hover">Koszyk</span></Link>
            <Link href="/"><span className="block link link-hover">Strona Główna</span></Link>
          </div>
          {/* Social media icons column */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg mb-3">Śledź Nas</h3>
            <Link href="https://www.facebook.com/domesticopl/" target="_blank" rel="noopener noreferrer"><span className="block link link-hover"><FaFacebook className="inline mr-2" /> Facebook</span></Link>
            <Link href="https://www.tiktok.com/@domestico.pl" target="_blank" rel="noopener noreferrer"><span className="block link link-hover"><FaTiktok className="inline mr-2" /> TikTok</span></Link>
            <Link href="https://www.instagram.com/domestico.pl/" target="_blank" rel="noopener noreferrer"><span className="block link link-hover"><FaInstagram className="inline mr-2" /> Instagram</span></Link>
            <Link href="https://t.me/Bynia2137" target="_blank" rel="noopener noreferrer"><span className="block link link-hover"><FaTelegram className="inline mr-2" /> Telegram</span></Link>
          </div>
        </div>
        {/* Copyright at the bottom */}
        <div className="border-t border-base-300 text-center py-4 mt-4">
          <p>
            Domestico.pl © 2024 - Strona stworzona przez{' '}
            <Link href="https://t.me/dszafranski" target="_blank" rel="noopener noreferrer">
              <span className="text-blue-500 hover:underline cursor-pointer">
                dszafranski <FaTelegram className="inline" />
              </span>
            </Link>
          </p>
        </div>
      </div>
      <SupportBotModal isOpen={isModalOpen} onClose={handleModalClose} />
    </footer>
  );
};

export default Footer;
