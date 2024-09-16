// next-amazona-v2/components/ToggleBuilderButton.tsx
"use client";

import React from 'react';

const ToggleBuilderButton = ({ toggleBuilder, isActive }: { toggleBuilder: () => void; isActive: boolean }) => {
  return (
    <button onClick={toggleBuilder} className="fixed top-5 right-5 z-50 p-2 bg-blue-500 text-white rounded">
      {isActive ? 'Wyłącz Builder' : 'Włącz Builder'}
    </button>
  );
};

export default ToggleBuilderButton;