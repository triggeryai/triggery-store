'use client';
import CheckoutSteps from '@/components/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const paymentMethods = [
  { label: 'Płatność Stripe - Przelewy24 / Blik / Karta', value: 'Stripe' },
  { label: 'Płatność przy odbiorze', value: 'CashOnDelivery' },
  { label: 'Przelew bankowy bezpośrednio na konto', value: 'DirectBankTransferToAccount' },
];

const Form = () => {
  const router = useRouter();
  const { savePaymentMethod, paymentMethod, shippingAddress } = useCartService();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isGuestCheckoutEnabled, setIsGuestCheckoutEnabled] = useState(false);
  const [loading, setLoading] = useState(true); // Stan ładowania formularza
  const [isSubmitting, setIsSubmitting] = useState(false); // Stan dla przycisku

  useEffect(() => {
    const fetchGuestCheckoutStatus = async () => {
      try {
        const res = await fetch('/api/guest-checkout');
        if (!res.ok) {
          throw new Error('Failed to fetch guest checkout status');
        }
        const data = await res.json();
        setIsGuestCheckoutEnabled(data.success && data.data.isGuestCheckoutEnabled);
      } catch (error) {
        console.error('Error fetching guest checkout status:', error);
      } finally {
        setLoading(false); // Wyłączenie ładowania po zakończeniu
      }
    };

    fetchGuestCheckoutStatus();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Sprawdzenie, czy użytkownik ma zapisany adres
      if (!shippingAddress.address && !isGuestCheckoutEnabled) {
        router.push('/signin?callbackUrl=/payment');
      }
    }
  }, [loading, isGuestCheckoutEnabled, router, shippingAddress.address]);

  useEffect(() => {
    if (shippingAddress.address) {
      setSelectedPaymentMethod(paymentMethod || 'Stripe');
    } else {
      router.push('/shipping');
    }
  }, [paymentMethod, router, shippingAddress.address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    savePaymentMethod(selectedPaymentMethod);
    router.push('/place-order');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <span className="ml-4 text-lg text-blue-500 font-semibold">Ładowanie...</span>
      </div>
    );
  }

  return (
    <div>
      <CheckoutSteps current={2} />
      <div className="max-w-sm mx-auto card bg-base-300 my-4">
        <div className="card-body">
          <h1 className="card-title">Metoda Płatności</h1>
          <form onSubmit={handleSubmit}>
            {paymentMethods.map((payment) => (
              <div key={payment.value}>
                <label className="label cursor-pointer">
                  <span className="label-text">{payment.label}</span>
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="radio"
                    value={payment.value}
                    checked={selectedPaymentMethod === payment.value}
                    onChange={() => setSelectedPaymentMethod(payment.value)}
                  />
                </label>
              </div>
            ))}
            <div className="my-2">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Dalej'
                )}
              </button>
            </div>
            <div className="my-2">
              <button
                type="button"
                className="btn w-full my-2"
                onClick={() => router.back()}
              >
                Wstecz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
