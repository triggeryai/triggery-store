// components\header\Header.tsx
import Link from 'next/link'
import React from 'react'
import Menu from './Menu'
import { SearchBox } from './SearchBox'
import Image from 'next/image'
import LeftCategorySideBar from './LeftCategorySideBar'
import Logo from './Logo'

const Header = () => {
  return (
    // Use the md:flex class to display the header on screens that are 'md' size or larger
    <header className="hidden md:flex">
      <nav className="w-full">
        <div className="navbar justify-between bg-base-300">
          <div>
            <LeftCategorySideBar />
            <Logo />
          </div>

          <Menu />
        </div>
        <div className="bg-base-300 block md:hidden text-center pb-3">
          <SearchBox />
        </div>
      </nav>
    </header>
  )
}

export default Header
