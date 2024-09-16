// next-amazona-v2/components/BuilderPanel.tsx
"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const BuilderPanel = () => {
  const [headerClasses, setHeaderClasses] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/builder-settings');
        if (!res.ok) {
          throw new Error('Nie udało się pobrać ustawień buildera');
        }
        const data = await res.json();
        if (data.success) {
          setHeaderClasses(data.data.headerClasses);
        }
      } catch (error) {
        toast.error('Wystąpił błąd podczas pobierania ustawień');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const saveSettings = async () => {
    try {
      const res = await fetch('/api/admin/builder-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headerClasses }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Ustawienia zapisane pomyślnie');
      } else {
        toast.error('Nie udało się zapisać ustawień');
      }
    } catch (error) {
      toast.error('Wystąpił błąd podczas zapisywania ustawień');
    }
  };

  if (loading) {
    return <div>Ładowanie ustawień...</div>;
  }

  return (
    <div className="builder-panel">
      <h2>Builder</h2>
      <div>
        <label>Klasy nagłówka:</label>
        <input
          type="text"
          value={headerClasses}
          onChange={(e) => setHeaderClasses(e.target.value)}
          className="input input-bordered"
        />
      </div>
      <button onClick={saveSettings} className="btn btn-primary mt-4">
        Zapisz ustawienia
      </button>
    </div>
  );
};

export default BuilderPanel;
