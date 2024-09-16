// next-amazona-v2/components/header/Header.tsx
"use client";

import React, { useEffect, useState } from 'react';
import useLayoutService from '@/lib/hooks/useLayout';
import Link from 'next/link';
import Menu from './Menu';
import { SearchBox } from './SearchBox';
import LeftCategorySideBar from './LeftCategorySideBar';
import EditableLogo from './EditableLogo';

const Header = () => {
  const { theme } = useLayoutService();
  const [headerClasses, setHeaderClasses] = useState('navbar justify-between bg-base-300');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/builder-settings');
        const data = await res.json();
        if (data.success) {
          setHeaderClasses(data.data.headerClasses);
        }
      } catch (error) {
        console.error('Failed to load builder settings', error);
      }
    };

    fetchData();
  }, []);

  return (
    <header className="hidden md:flex">
      <nav className="w-full">
        <div className={headerClasses}>
          <div>
            <LeftCategorySideBar />
            <EditableLogo
              srcLight="/logo_domestico.png"
              srcDark="/logo_domestico_dark.png"
              alt="Domestico"
              width={70}
              height={70}
            />
          </div>

          <Menu />
        </div>
        <div className="bg-base-300 block md:hidden text-center pb-3">
          <SearchBox />
        </div>
      </nav>
    </header>
  );
};

export default Header;
