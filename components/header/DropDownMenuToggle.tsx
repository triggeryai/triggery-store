import React, { useState } from 'react';

const DropDownMenuToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="dropdown ">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={toggleDropdown}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </div>
      {isOpen && (
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-100 rounded-box w-52">
          <li className='relative'><a href="#homepage">Homepage</a></li>
          <li className='relative'><a href="#portfolio">Portfolio</a></li>
          <li className='relative'><a href="#about">About</a></li>
        </ul>
      )}
    </div>
  );
};

export default DropDownMenuToggle;
