// MenuToggleButton.tsx
import React from 'react';

type MenuToggleButtonProps = {
  setMenuOpen: (open: boolean) => void;
  menuOpen: boolean;
};

const MenuToggleButton: React.FC<MenuToggleButtonProps> = ({ setMenuOpen, menuOpen }) => {
  return (
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
  );
};

export default MenuToggleButton;
