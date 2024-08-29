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
  const [loading, setLoading] = useState(true); // Stan ładowania

  useEffect(() => {
    const fetchGuestCheckoutStatus = async () => {
      try {
        const res = await fetch('/api/guest-checkout');
        if (!res.ok) {
          throw new Error('Failed to fetch guest checkout status');
        }
        const data = await res.json();
        console.log('Guest Checkout Status from API:', data);
        if (data.success) {
          setIsGuestCheckoutEnabled(data.data.isGuestCheckoutEnabled);
        }
      } catch (error) {
        console.error('Error fetching guest checkout status:', error);
      } finally {
        setLoading(false); // Ustawienie ładowania na false po zakończeniu
      }
    };

    fetchGuestCheckoutStatus();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Sprawdzenie, czy Guest Checkout jest wyłączony i użytkownik nie jest zalogowany
      if (!shippingAddress.address && !isGuestCheckoutEnabled) {
        console.log('Redirecting to login because guest checkout is disabled and no session exists.');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentMethod(selectedPaymentMethod);
    router.push('/place-order');
  };

  if (loading) {
    return <div>Loading...</div>; // Pokazywanie ekranu ładowania
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
              <button type="submit" className="btn btn-primary w-full">
                Dalej
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
