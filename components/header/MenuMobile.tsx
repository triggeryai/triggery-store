// MobileMenu.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import useCartService from '@/lib/hooks/useCartStore';
import useLayoutService from '@/lib/hooks/useLayout';
import { SearchBox } from './SearchBox';
import CartModal from './CartModal';
import DropDownMenuToggle from './DropDownMenuToggle';
import LeftCategorySideBar from './LeftCategorySideBar'
import Logo from './Logo';
import MenuModal from './MenuModal';

const MobileMenu: React.FC = () => {
  const { items, init } = useCartService();
  const [showCartModal, setShowCartModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { theme, toggleTheme } = useLayoutService();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const signoutHandler = () => {
    signOut({ callbackUrl: '/signin' });
    init();
  };

  return (
    <div className="flex flex-col items-center w-full bg-white shadow-md">
      <div className="flex justify-between items-center w-full px-4 py-2">
        <LeftCategorySideBar />
        <Logo />
        <button className="btn btn-ghost" onClick={() => setMenuOpen(!menuOpen)} />
      </div>

      {/* Search and toggle */}
      <div className="flex items-center justify-between w-full p-4">
        <SearchBox />

        <button className="btn btn-ghost" onClick={() => setMenuOpen(!menuOpen)}>
          {/* Menu Toggle Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-6 6h6" />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      <MenuModal isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <DropDownMenuToggle />
        
        {/* Theme toggle */}
        <label className="swap swap-rotate mt-4">
          <input type="checkbox" checked={theme === 'light'} onChange={toggleTheme} />
          <div className="swap-on w-10 h-10 bg-black rounded-full"></div>
          <div className="swap-off w-10 h-10 bg-white shadow-inner rounded-full"></div>
        </label>
        
        <div className="relative mt-4">
          {/* Cart Modal Toggle */}
          <button onClick={() => setShowCartModal(!showCartModal)}>
            {/* Icon or text for cart modal toggle */}
          </button>
          {showCartModal && <CartModal />}
        </div>

        {/* User session area */}
        {session && session.user ? (
          <div className="dropdown dropdown-end mt-4">
            <button tabIndex={0} className="btn btn-ghost rounded-btn">
              {session.user.name}
              {/* Dropdown arrow icon */}
            </button>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              {session.user.isAdmin && (
                <li><Link href="/admin/dashboard">Admin Dashboard</Link></li>
              )}
              <li><Link href="/order-history">Order History</Link></li>
              <li><Link href="/profile">Profile</Link></li>
              <li>
                <button type="button" onClick={signoutHandler}>
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <button className="btn btn-ghost rounded-btn mt-4" onClick={() => signIn()}>
            Sign in
          </button>
        )}
      </MenuModal>
    </div>
  );
};

export default MobileMenu;
