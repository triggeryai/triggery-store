// next-amazona-v2/app/admin/general/General.tsx
"use client";
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const General = () => {
  const { data: session } = useSession();
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [isGuestCheckoutEnabled, setIsGuestCheckoutEnabled] = useState(false);
  const [isBuilderEnabled, setIsBuilderEnabled] = useState(false);
  const [isCaptchaEnabled, setIsCaptchaEnabled] = useState(false);
  const [captchaKey, setCaptchaKey] = useState('');
  const [showCaptchaKey, setShowCaptchaKey] = useState(false); // Control visibility of captcha key
  const [loading, setLoading] = useState(true); // Zmienna kontrolująca ładowanie danych

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/general');
        const guestCheckoutRes = await fetch('/api/admin/guest-checkout');
        const builderRes = await fetch('/api/admin/builder');
        const captchaRes = await fetch('/api/admin/captcha');

        if (!res.ok || !guestCheckoutRes.ok || !builderRes.ok || !captchaRes.ok) {
          throw new Error('Nie udało się pobrać danych');
        }

        const data = await res.json();
        const guestCheckoutData = await guestCheckoutRes.json();
        const builderData = await builderRes.json();
        const captchaData = await captchaRes.json();

        if (data.success) {
          setIsDeveloperMode(data.data.isDeveloperMode);
        }
        if (guestCheckoutData.success) {
          setIsGuestCheckoutEnabled(guestCheckoutData.data.isGuestCheckoutEnabled);
        } else {
          toast.error('Nie udało się załadować statusu zakupów bez rejestracji');
        }
        if (builderData.success) {
          setIsBuilderEnabled(builderData.data.isBuilderEnabled);
        } else {
          toast.error('Nie udało się załadować statusu trybu Builder');
        }
        if (captchaData.success) {
          setIsCaptchaEnabled(captchaData.data.isCaptchaEnabled);
          setCaptchaKey(captchaData.data.captchaKey);
        } else {
          const envCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
          if (envCaptchaKey) {
            setCaptchaKey(envCaptchaKey);
            toast.info('Klucz reCAPTCHA pobrany z .env, ponieważ brak zapisu w bazie danych.');
          } else {
            toast.error('Nie udało się załadować statusu Captcha');
          }
        }
      } catch (error) {
        toast.error('Wystąpił błąd podczas pobierania danych');
      } finally {
        setLoading(false); // Koniec ładowania
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

  const toggleBuilder = async () => {
    const newMode = !isBuilderEnabled;
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
        setIsBuilderEnabled(newMode);
        toast.success(`Tryb Builder ${newMode ? 'włączony' : 'wyłączony'}`);
      } else {
        toast.error('Nie udało się zaktualizować trybu Builder');
      }
    } catch (error) {
      toast.error('Wystąpił błąd podczas aktualizacji trybu Builder');
    }
  };

  const toggleCaptcha = async () => {
    const newMode = !isCaptchaEnabled;
    try {
      const res = await fetch('/api/admin/captcha', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCaptchaEnabled: newMode }),
      });
      const data = await res.json();

      if (data.success) {
        setIsCaptchaEnabled(newMode);
        toast.success(`Captcha ${newMode ? 'włączona' : 'wyłączona'}`);
      } else {
        toast.error('Nie udało się zaktualizować statusu Captcha');
      }
    } catch (error) {
      toast.error('Wystąpił błąd podczas aktualizacji statusu Captcha');
    }
  };

  const updateCaptchaKey = async () => {
    try {
      const res = await fetch('/api/admin/captcha', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ captchaKey }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Klucz Captcha został zaktualizowany');
      } else {
        toast.error('Nie udało się zaktualizować klucza Captcha');
      }
    } catch (error) {
      toast.error('Wystąpił błąd podczas aktualizacji klucza Captcha');
    }
  };

  // Spinner ładowania
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ustawienia Ogólne</h1>
      <div className="p-4 rounded-lg shadow-md">
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isDeveloperMode}
            onChange={toggleDeveloperMode}
            className="toggle toggle-primary mr-2"
          />
          <span>Tryb deweloperski</span>
        </label>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isGuestCheckoutEnabled}
            onChange={toggleGuestCheckout}
            className="toggle toggle-primary mr-2"
          />
          <span>Zakupy bez rejestracji</span>
        </label>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isBuilderEnabled}
            onChange={toggleBuilder}
            className="toggle toggle-primary mr-2"
          />
          <span>Tryb Builder</span>
        </label>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isCaptchaEnabled}
            onChange={toggleCaptcha}
            className="toggle toggle-primary mr-2"
          />
          <span>Captcha</span>
        </label>
        {isCaptchaEnabled && (
          <label className="flex items-center mb-4">
            <input
              type={showCaptchaKey ? 'text' : 'password'}
              value={captchaKey}
              onChange={(e) => setCaptchaKey(e.target.value)}
              className="input input-bordered mr-2"
            />
            <button
              type="button"
              onClick={() => setShowCaptchaKey(!showCaptchaKey)}
              className="btn btn-ghost"
            >
              {showCaptchaKey ? 'Ukryj' : 'Pokaż'}
            </button>
            <button
              type="button"
              onClick={updateCaptchaKey}
              className="btn btn-primary ml-2"
            >
              Zapisz
            </button>
          </label>
        )}
      </div>
    </div>
  );
};

export default General;
