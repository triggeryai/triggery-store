"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const BuilderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [isBuilderModeEnabled, setIsBuilderModeEnabled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session?.user?.isAdmin) {
      setIsAdmin(true);
    }
  }, [session]);

  useEffect(() => {
    if (isAdmin) {
      // Pobieramy status trybu buildera z serwera
      const fetchBuilderStatus = async () => {
        try {
          const res = await fetch('/api/admin/builder');
          if (!res.ok) {
            throw new Error('Nie udało się pobrać statusu trybu buildera');
          }
          const data = await res.json();
          setIsBuilderModeEnabled(data.data.isBuilderEnabled);
        } catch (error) {
          toast.error('Wystąpił błąd podczas pobierania statusu trybu buildera');
        }
      };

      fetchBuilderStatus();
    }
  }, [isAdmin]);

  const toggleBuilderMode = async () => {
    const newMode = !isBuilderModeEnabled;
    try {
      const res = await fetch('/api/admin/builder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isBuilderEnabled: newMode }),
      });

      const data = await res.json();
      if (data.success) {
        setIsBuilderModeEnabled(newMode);
        toast.success(`Tryb buildera ${newMode ? 'włączony' : 'wyłączony'}`);
      } else {
        toast.error('Nie udało się zaktualizować trybu buildera');
      }
    } catch (error) {
      toast.error('Wystąpił błąd podczas aktualizacji trybu buildera');
    }
  };

  // Renderuj pasek buildera tylko dla administratorów
  if (!isAdmin) {
    return <>{children}</>; // Zwraca tylko dzieci (dzieci nie będą dotknięte trybem buildera)
  }

  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-gray-900 text-white p-2 z-50">
        <button onClick={toggleBuilderMode} className="btn btn-primary">
          {isBuilderModeEnabled ? 'Wyłącz tryb buildera' : 'Włącz tryb buildera'}
        </button>
      </div>
      <div className="mt-12"> {/* Dodajemy margines tylko dla administratorów */}
        {children}
      </div>
    </div>
  );
};

export default BuilderWrapper;
