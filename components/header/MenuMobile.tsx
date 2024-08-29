'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import useCartService from '@/lib/hooks/useCartStore';
import useLayoutService from '@/lib/hooks/useLayout';
import { SearchBox } from './SearchBox';
import CartModalMobile from './CartModalMobile';
import DropDownMenuToggle from './DropDownMenuToggle';
import LeftCategorySideBar from './LeftCategorySideBar';
import Logo from './Logo';
import MenuModal from './MenuModal';
import MenuToggleButton from './MenuToggleButton';
import ThemeToggle from './ThemeToggle';

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

  const handleLinkClick = () => {
    setMenuOpen(false); // Close the modal
  };

  return (
    <div className={`flex flex-col items-center w-full shadow-md`}>
      <div className="flex justify-between items-center w-full px-4 py-2">
        <LeftCategorySideBar />
        <Logo />
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      {/* Search and toggle */}
      <div className="flex items-center justify-between w-full p-4">
        <SearchBox />
        <button className="relative" onClick={() => setShowCartModal(!showCartModal)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="darkslategray" aria-hidden="true" className="h-6 w-6 transition-all ease-in-out hover:scale-110 ml-2 swap-on fill-current">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
          </svg>
          {items.length > 0 && (
            <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 text-white text-xs font-bold rounded-full text-center">
              {items.length}
            </span>
          )}
        </button>
        <MenuToggleButton setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      </div>

      {showCartModal && <CartModalMobile onClose={() => setShowCartModal(false)} />}

      {/* Dropdown Menu */}
      <MenuModal isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className={`p-4 ${theme === 'dark' ? 'bg-[#1A103D] text-white' : 'bg-white text-black'}`}>
          {/* User session area */}
          {session && session.user ? (
            <div className="flex flex-col items-center">
              <div className="badge badge-primary mb-4">{session.user.name}</div>
              {session.user.isAdmin && (
                <Link href="/admin/dashboard" onClick={handleLinkClick}><div className="btn btn-ghost w-full mb-2">Panel Administratora</div></Link>
              )}
              <Link href="/order-history" onClick={handleLinkClick}><div className="btn btn-ghost w-full mb-2">Historia Zamówień</div></Link>
              <Link href="/profile" onClick={handleLinkClick}><div className="btn btn-ghost w-full mb-2">Profil</div></Link>
              <button type="button" onClick={signoutHandler} className="btn btn-ghost w-full mb-2">
                Wyloguj
              </button>
            </div>
          ) : (
            <button className="btn btn-ghost w-full" onClick={() => { signIn(); handleLinkClick(); }}>
              Zaloguj
            </button>
          )}
        </div>
      </MenuModal>
    </div>
  );
};

export default MobileMenu;
