"use client"
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const General = () => {
  const { data: session } = useSession();
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/general');
        if (!res.ok) {
          throw new Error('Nie udało się pobrać danych');
        }
        const data = await res.json();
        if (data.success) {
          setIsDeveloperMode(data.data.isDeveloperMode);
        } else {
          toast.error('Nie udało się załadować statusu trybu deweloperskiego');
        }
      } catch (error) {
        toast.error('Wystąpił błąd podczas pobierania danych');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleDeveloperMode = async () => {
    const newMode = !isDeveloperMode;
    try {
      const res = await fetch('/api/admin/general', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDeveloperMode: newMode }),
      });
      const data = await res.json();

      if (data.success) {
        setIsDeveloperMode(newMode);
        toast.success(`Tryb deweloperski ${newMode ? 'włączony' : 'wyłączony'}`);
      } else {
        toast.error('Nie udało się zaktualizować trybu deweloperskiego');
      }
    } catch (error) {
      toast.error('Wystąpił błąd podczas aktualizacji trybu deweloperskiego');
    }
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ustawienia Ogólne</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isDeveloperMode}
            onChange={toggleDeveloperMode}
            className="toggle toggle-primary mr-2"
          />
          <span className="text-gray-700">Tryb deweloperski</span>
        </label>
      </div>
    </div>
  );
};

export default General;
