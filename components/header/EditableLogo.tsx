"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Modal from '@/components/editable/logoModal';
import useLayoutService from '@/lib/hooks/useLayout';

const EditableLogo: React.FC<{ srcLight: string, srcDark: string, alt: string, width: number, height: number }> = ({ srcLight, srcDark, alt, width, height }) => {
  const { data: session } = useSession();
  const { theme } = useLayoutService(); // Get the current theme directly
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark'); // Track whether editing dark or light mode logo
  const [imageSrc, setImageSrc] = useState(isDarkMode ? srcDark : srcLight);
  const [imageWidth, setImageWidth] = useState(width);
  const [imageHeight, setImageHeight] = useState(height);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update the logo source whenever the theme changes
  useEffect(() => {
    setImageSrc(theme === 'dark' ? srcDark : srcLight);
  }, [theme, srcLight, srcDark]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageSrc(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageWidth(parseInt(event.target.value, 10));
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageHeight(parseInt(event.target.value, 10));
  };

  const saveChanges = async () => {
    try {
      const res = await fetch('/api/admin/builder-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logoSrc: imageSrc,
          logoWidth: imageWidth,
          logoHeight: imageHeight,
          isDarkMode,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to save logo settings', error);
    }
  };

  return (
    <div className="editable-logo">
      <Link href="/" className="flex items-center">
        <Image
          src={imageSrc}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          className="mr-2"
        />
      </Link>
      {session?.user?.isAdmin && (
        <>
          <button onClick={() => setIsModalOpen(true)} className="ml-2 text-sm underline">
            Edit
          </button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2 className="text-lg font-bold mb-4">Edit Logo</h2>
            <div className="flex items-center gap-2 mb-4">
              <label>
                <input
                  type="radio"
                  name="logoMode"
                  value="light"
                  checked={!isDarkMode}
                  onChange={() => {
                    setIsDarkMode(false);
                    setImageSrc(srcLight); // Update the logo preview to light mode
                  }}
                />
                Light Mode Logo
              </label>
              <label>
                <input
                  type="radio"
                  name="logoMode"
                  value="dark"
                  checked={isDarkMode}
                  onChange={() => {
                    setIsDarkMode(true);
                    setImageSrc(srcDark); // Update the logo preview to dark mode
                  }}
                />
                Dark Mode Logo
              </label>
            </div>
            <input type="file" onChange={handleImageChange} className="mb-4" />
            <div className="flex gap-2">
              <label>
                Width:
                <input type="number" value={imageWidth} onChange={handleWidthChange} className="ml-1 border p-1" />
              </label>
              <label>
                Height:
                <input type="number" value={imageHeight} onChange={handleHeightChange} className="ml-1 border p-1" />
              </label>
            </div>
            <button onClick={saveChanges} className="mt-4 btn btn-primary">
              Save Changes
            </button>
          </Modal>
        </>
      )}
    </div>
  );
};

export default EditableLogo;
