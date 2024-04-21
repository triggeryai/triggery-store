// MenuModal.tsx
import React from 'react';

const MenuModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Stop the click event from propagating to the overlay when clicking on the modal content
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      {/* Overlay with fade-in effect */}
      <div className="opacity-75 transition-opacity duration-300 ease-in-out fixed inset-0 bg-black"></div>
      
      {/* Modal container with slide-in effect */}
      <div 
        className="relative bg-white w-full max-w-md m-auto rounded-lg shadow-lg transition-transform transform-gpu duration-300 ease-in-out translate-y-full sm:translate-y-0"
        onClick={stopPropagation}
        style={{
          transition: 'opacity 0.4s ease, transform 0.5s ease-out',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Close button with hover and focus styles for better accessibility */}
        <span className="absolute top-0 right-0 p-2 m-2 cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200" onClick={onClose}>
          {/* Close icon with SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>

        {/* Modal content */}
        {children}
      </div>
    </div>
  );
};

export default MenuModal;
