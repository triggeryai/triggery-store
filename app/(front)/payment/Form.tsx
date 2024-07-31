// next-amazona-v2/app/(front)/payment/Form.tsx
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

  {/*{ label: 'Płatność PayPal', value: 'PayPal' }, */}


const Form = () => {
  const router = useRouter();
  const { savePaymentMethod, paymentMethod, shippingAddress } = useCartService();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentMethod(selectedPaymentMethod);
    router.push('/place-order');
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || 'PayPal');
  }, [paymentMethod, router, shippingAddress.address]);

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
