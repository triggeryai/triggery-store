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

  return (
    <div className="flex flex-col items-center w-full bg-white shadow-md">
      <div className="flex justify-between items-center w-full px-4 py-2">
        <LeftCategorySideBar />
        <Logo />
      </div>

      {/* Search and toggle */}
      <div className="flex items-center justify-between w-full p-4">
        <SearchBox />
        <MenuToggleButton setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      </div>

      {/* Dropdown Menu */}
      <MenuModal isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="p-4">
          {/* User session area */}
          {session && session.user ? (
            <div className="flex flex-col items-center">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <div className="badge badge-primary mb-4">{session.user.name}</div>
              {session.user.isAdmin && (
                <Link href="/admin/dashboard"><div className="btn btn-ghost w-full mb-2">Admin Dashboard</div></Link>
              )}
              <Link href="/order-history"><div className="btn btn-ghost w-full mb-2">Order History</div></Link>
              <Link href="/profile"><div className="btn btn-ghost w-full mb-2">Profile</div></Link>
              <button type="button" onClick={signoutHandler} className="btn btn-ghost w-full mb-2">
                Sign out
              </button>
            </div>
          ) : (
            <button className="btn btn-ghost w-full" onClick={() => signIn()}>
              Sign in
            </button>
          )}
        </div>
      </MenuModal>
    </div>
  );
};

export default MobileMenu;