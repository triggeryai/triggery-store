// Logo.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center">
        <Image
          src="/duck.png" // Ensure the path to your image is correct
          alt="Duck"
          width={40} // Set the width as needed
          height={40} // Set the height as needed
          className="mr-2" // This gives margin to the right side
        />
        <span className="text-lg font-bold">Domestico.pl</span>
    </Link>
  );
};

export default Logo;
