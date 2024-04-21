// HeaderMobile.tsx
import React from 'react';
import MenuMobile from './MenuMobile';
import { SearchBox } from './SearchBox';
import Image from 'next/image';

const HeaderMobile: React.FC = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-base-300 md:hidden">
      {/* Left side - Search Box */}
      {/* Right side - Mobile Menu Toggle */}
      <MenuMobile />
    </div>
  );
};

export default HeaderMobile;
