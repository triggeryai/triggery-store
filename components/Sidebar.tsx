// components/Sidebar.tsx
'use client';

import useLayoutService from '@/lib/hooks/useLayout';
import Link from 'next/link';
import useSWR from 'swr';
import { FaFacebook, FaTiktok, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Sidebar = () => {
  const { toggleDrawer } = useLayoutService();
  const { data: categories, error } = useSWR('/api/products/categories');

  if (error) return error.message;
  if (!categories) return 'Loading...';

  return (
    <div className="absolute menu p-4 w-80 min-h-full bg-base-200 text-base-content relative z-10"> {/* Increased z-index */}
      <div className="overflow-y-auto max-h-screen"> {/* Ensure max height for scrolling */}
        <li>
          <button onClick={toggleDrawer} className="text-xl flex items-center gap-2 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors self-start">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
          </button>
        </li>
        {/* Crucial Links */}
        <li className="mt-4">
          <h2 className="text-xl font-bold">Categories</h2>
        </li>
        {categories.map((categoryName: string) => (
          <li key={categoryName}>
            <Link href={`/search?category=${categoryName}`} onClick={toggleDrawer}>
              <div className="flex items-center gap-2 p-2 rounded hover:bg-base-100 transition-colors">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L13.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                </svg>
                {categoryName}
              </div>
            </Link>
          </li>
        ))}
        <li className="mt-4">
          <h2 className="text-xl font-bold">Crucial Links</h2>
        </li>
        <li>
          <Link href="/about"><span className="block link link-hover">About</span></Link>
        </li>
        <li>
          <Link href="/contact"><span className="block link link-hover">Contact</span></Link>
        </li>
        <li>
          <Link href="/support"><span className="block link link-hover">Support</span></Link>
        </li>
        <li>
          <Link href="/faq"><span className="block link link-hover">FAQ</span></Link>
        </li>
        <li>
          <Link href="/search?q=&category=all&price=all&rating=all&sort=newest&page=1"><span className="block link link-hover">Buy something</span></Link>
        </li>
        {/* Legal */}
        <li className="mt-4">
          <h2 className="text-xl font-bold">Legal</h2>
        </li>
        <li>
          <Link href="/privacy"><span className="block link link-hover">Privacy Policy</span></Link>
        </li>
        <li>
          <Link href="/terms"><span className="block link link-hover">Terms of Service</span></Link>
        </li>
        <li>
          <Link href="/return-policy"><span className="block link link-hover">Return Policy</span></Link>
        </li>
        <li>
          <Link href="/warranty"><span className="block link link-hover">Warranty</span></Link>
        </li>
        {/* My Account */}
        <li className="mt-4">
          <h2 className="text-xl font-bold">My Account</h2>
        </li>
        <li>
          <Link href="/profile"><span className="block link link-hover">My Account</span></Link>
        </li>
        <li>
          <Link href="/order-history"><span className="block link link-hover">My Orders</span></Link>
        </li>
        <li>
          <Link href="/cart"><span className="block link link-hover">Cart</span></Link>
        </li>
        <li>
          <Link href="/"><span className="block link link-hover">Home</span></Link>
        </li>
        {/* Follow Us */}
        <li className="mt-4">
          <h2 className="text-xl font-bold">Follow Us</h2>
        </li>
        <li>
          <Link href="https://www.facebook.com"><span className="block link link-hover"><FaFacebook className="inline mr-2" /> Facebook</span></Link>
        </li>
        <li>
          <Link href="https://www.tiktok.com"><span className="block link link-hover"><FaTiktok className="inline mr-2" /> TikTok</span></Link>
        </li>
        <li>
          <Link href="https://www.instagram.com"><span className="block link link-hover"><FaInstagram className="inline mr-2" /> Instagram</span></Link>
        </li>
        <li>
          <Link href="https://www.linkedin.com"><span className="block link link-hover"><FaLinkedin className="inline mr-2" /> LinkedIn</span></Link>
        </li>
      </div>
    </div>
  );
};

export default Sidebar;
