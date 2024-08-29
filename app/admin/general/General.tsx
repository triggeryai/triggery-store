// next-amazona-v2/app/admin/general/General.tsx
"use client"
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const General = () => {
  const { data: session } = useSession();
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [isGuestCheckoutEnabled, setIsGuestCheckoutEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/general');
        const guestCheckoutRes = await fetch('/api/admin/guest-checkout');
        if (!res.ok || !guestCheckoutRes.ok) {
          throw new Error('Nie udało się pobrać danych');
        }
        const data = await res.json();
        const guestCheckoutData = await guestCheckoutRes.json();

        if (data.success) {
          setIsDeveloperMode(data.data.isDeveloperMode);
        }
        if (guestCheckoutData.success) {
          setIsGuestCheckoutEnabled(guestCheckoutData.data.isGuestCheckoutEnabled);
        } else {
          toast.error('Nie udało się załadować statusu zakupów bez rejestracji');
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

  const toggleGuestCheckout = async () => {
    const newMode = !isGuestCheckoutEnabled;
    try {
      const res = await fetch('/api/admin/guest-checkout', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isGuestCheckoutEnabled: newMode }),
      });
      const data = await res.json();

      if (data.success) {
        setIsGuestCheckoutEnabled(newMode);
        toast.success(`Zakupy bez rejestracji ${newMode ? 'włączone' : 'wyłączone'}`);
      } else {
        toast.error('Nie udało się zaktualizować statusu zakupów bez rejestracji');
      }
    } catch (error) {
      toast.error('Wystąpił błąd podczas aktualizacji statusu zakupów bez rejestracji');
    }
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ustawienia Ogólne</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isDeveloperMode}
            onChange={toggleDeveloperMode}
            className="toggle toggle-primary mr-2"
          />
          <span className="text-gray-700">Tryb deweloperski</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isGuestCheckoutEnabled}
            onChange={toggleGuestCheckout}
            className="toggle toggle-primary mr-2"
          />
          <span className="text-gray-700">Zakupy bez rejestracji</span>
        </label>
      </div>
    </div>
  );
};

export default General;
