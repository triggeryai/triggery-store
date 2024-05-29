"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaTiktok, FaInstagram, FaLinkedin, FaTelegram } from 'react-icons/fa';
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
    <footer className="bg-base-300 text-base-content">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columns with links */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg mb-3">Crucial links</h3>
            <Link href="/about"><span className="block link link-hover">About</span></Link>
            <Link href="/contact"><span className="block link link-hover">Contact</span></Link>
            <button onClick={handleModalOpen} className="block link link-hover text-left">Support</button>
            <Link href="/faq"><span className="block link link-hover">FAQ</span></Link>
            <Link href="/search?q=&category=all&price=all&rating=all&sort=newest&page=1"><span className="block link link-hover">Buy something</span></Link>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg mb-3">Legal</h3>
            <Link href="/privacy"><span className="block link link-hover">Privacy Policy</span></Link>
            <Link href="/terms"><span className="block link link-hover">Terms of Service</span></Link>
            <Link href="/return-policy"><span className="block link link-hover">Return Policy</span></Link>
            <Link href="/warranty"><span className="block link link-hover">Warranty</span></Link>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg mb-3">My Account</h3>
            <Link href="/profile"><span className="block link link-hover">My Account</span></Link>
            <Link href="/order-history"><span className="block link link-hover">My Orders</span></Link>
            <Link href="/cart"><span className="block link link-hover">Cart</span></Link>
            <Link href="/"><span className="block link link-hover">Home</span></Link>
          </div>
          {/* Social media icons column */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg mb-3">Follow Us</h3>
            <Link href="https://www.facebook.com"><span className="block link link-hover"><FaFacebook className="inline mr-2" /> Facebook</span></Link>
            <Link href="https://www.tiktok.com"><span className="block link link-hover"><FaTiktok className="inline mr-2" /> TikTok</span></Link>
            <Link href="https://www.instagram.com"><span className="block link link-hover"><FaInstagram className="inline mr-2" /> Instagram</span></Link>
            <Link href="https://www.linkedin.com"><span className="block link link-hover"><FaLinkedin className="inline mr-2" /> LinkedIn</span></Link>
          </div>
        </div>
        {/* Copyright at the bottom */}
        <div className="border-t border-base-300 text-center py-4 mt-8">
          <p>
            Domestico.pl © 2023 - Website made by{' '}
            <Link href="https://t.me/dodox95">
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
