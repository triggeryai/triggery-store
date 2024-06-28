"use client"
import Link from 'next/link';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const SuccessfulActivationPage = () => {
  useEffect(() => {
    // Wyświetl powiadomienie toast
    toast.success('Konto zostało aktywowane pomyślnie!', {
      duration: 4000,
      position: 'top-center',
    });

    // Dynamicznie importuj canvas-confetti, aby zapewnić, że działa po stronie klienta
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.7 },
      });
    });
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-100 via-orange-600 to-orange-600">
      <div className="max-w-md p-10 text-center bg-gray-800 rounded-xl shadow-2xl">
        <h1 className="mb-4 text-4xl font-extrabold text-white">Aktywacja konta zakończona!</h1>
        <p className="mb-6 text-lg text-gray-300">Twoje konto zostało pomyślnie aktywowane. Możesz teraz zalogować się i zacząć korzystać z serwisu.</p>
        <Link href="/signin">
          <button className="px-6 py-3 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full transition duration-150 ease-in-out">
            Zaloguj się
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessfulActivationPage;
