'use client';
import CheckoutSteps from '@/components/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react'; // Added useCallback
import toast from 'react-hot-toast';
import useSWRMutation from 'swr/mutation';
import Image from 'next/image';

const Form = () => {
  const router = useRouter();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    clear,
  } = useCartService();

  const [isGuestCheckoutEnabled, setIsGuestCheckoutEnabled] = useState(false);
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [shippingPrice, setShippingPrice] = useState(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(itemsPrice + taxPrice + shippingPrice);

  const calculateTotalPrice = useCallback((shipping: number, tax: number) => {
    setTotalPrice(itemsPrice + tax + shipping);
  }, [itemsPrice]);

  // Sprawdzanie statusu Guest Checkout
  useEffect(() => {
    const fetchGuestCheckoutStatus = async () => {
      try {
        const res = await fetch('/api/guest-checkout');
        if (!res.ok) {
          throw new Error('Failed to fetch guest checkout status');
        }
        const data = await res.json();
        if (data.success) {
          setIsGuestCheckoutEnabled(data.data.isGuestCheckoutEnabled);
        }
      } catch (error) {
        console.error('Error fetching guest checkout status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuestCheckoutStatus();
  }, []);

  // Sprawdzenie, czy można uzyskać dostęp do strony
  useEffect(() => {
    if (!loading) {
      if (!paymentMethod && !isGuestCheckoutEnabled) {
        console.log('Redirecting to login because guest checkout is disabled and no session exists.');
        router.push('/signin?callbackUrl=/place-order');
      }
    }
  }, [loading, paymentMethod, isGuestCheckoutEnabled, router]);

  useEffect(() => {
    const fetchShippingPrice = async () => {
      try {
        const response = await fetch('/api/shipping');
        if (!response.ok) {
          throw new Error('Failed to fetch shipping options');
        }
        const data = await response.json();
        const selectedMethod = localStorage.getItem('shippingMethod');
        const selectedOption = data.find((option: any) => option.value === selectedMethod);
        if (selectedOption) {
          setShippingPrice(selectedOption.price);
          calculateTotalPrice(selectedOption.price, taxPrice);
        }
      } catch (error) {
        console.error('Error fetching shipping options:', error);
      }
    };

    fetchShippingPrice();
  }, [itemsPrice, taxPrice, calculateTotalPrice]);

  useEffect(() => {
    const fetchTaxSettings = async () => {
      try {
        const response = await fetch('/api/admin/tax');
        if (!response.ok) {
          throw new Error('Failed to fetch tax settings');
        }
        const data = await response.json();
        if (data.isActive) {
          const taxValue = data.type === 'percentage'
            ? (itemsPrice * data.value) / 100
            : data.value;
          setTaxPrice(taxValue);
          calculateTotalPrice(shippingPrice, taxValue);
        }
      } catch (error) {
        console.error('Error fetching tax settings:', error);
      }
    };

    fetchTaxSettings();
  }, [itemsPrice, shippingPrice, calculateTotalPrice]);

  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    `/api/orders/mine`,
    async (url) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress: {
            ...shippingAddress,
            shippingMethod: localStorage.getItem('shippingMethod'),
            selectedPaczkomat: localStorage.getItem('selectedPaczkomat'),
            selectedPocztex: localStorage.getItem('selectedPoint'),
            shippingCost: shippingPrice,
          },
          items: items.map(item => ({
            ...item,
            mainImage: item.mainImage, // Ensure the mainImage field is included
          })),
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        clear();
        toast.success('Zamówienie złożone pomyślnie');
        return router.push(`/order/${data.order._id}`);
      } else {
        toast.error(data.message);
      }
    }
  );

  useEffect(() => {
    if (!paymentMethod) {
      return router.push('/payment');
    }
    if (items.length === 0) {
      return router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, router]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  const shippingMethod = localStorage.getItem('shippingMethod');
  const selectedPaczkomat = JSON.parse(localStorage.getItem('selectedPaczkomat') || '{}');
  const selectedPocztex = JSON.parse(localStorage.getItem('selectedPoint') || '{}');

  if (loading) {
    return <div>Loading...</div>; // Pokazywanie ekranu ładowania
  }

  return (
    <div>
      <CheckoutSteps current={4} />

      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="overflow-x-auto md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Adres Dostawy</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              <p>
                Metoda wysyłki: {shippingMethod} - {shippingPrice} PLN
              </p>
              {shippingMethod === 'Inpost Paczkomat' && selectedPaczkomat && selectedPaczkomat.name && (
                <p>Wybrany Paczkomat: {selectedPaczkomat.name}</p>
              )}
              {shippingMethod === 'Pocztex Poczta Odbior Punkt' && selectedPocztex && selectedPocztex.name && (
                <p>Wybrany Punkt Pocztex: {selectedPocztex.name}</p>
              )}
              <div>
                <Link className="btn" href="/shipping">
                  Edytuj
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Metoda Płatności</h2>
              <p>{paymentMethod}</p>
              <div>
                <Link className="btn" href="/payment">
                  Edytuj
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Produkty</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Produkt</th>
                    <th>Ilość</th>
                    <th>Cena</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          {item.mainImage && (
                            <Image
                              src={item.mainImage}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="object-cover"
                            />
                          )}
                          <span className="px-2">
                            {item.name}({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>
                        <span>{item.qty}</span>
                      </td>
                      <td>{item.price} PLN</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link className="btn" href="/cart">
                  Edytuj
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Podsumowanie Zamówienia</h2>
              <ul className="space-y-3">
                <li>
                  <div className=" flex justify-between">
                    <div>Produkty</div>
                    <div>{itemsPrice} PLN</div>
                  </div>
                </li>
                {taxPrice > 0 && (
                  <li>
                    <div className=" flex justify-between">
                      <div>Podatek</div>
                      <div>{taxPrice} PLN</div>
                    </div>
                  </li>
                )}
                <li>
                  <div className=" flex justify-between">
                    <div>Wysyłka</div>
                    <div>{shippingPrice} PLN</div>
                  </div>
                </li>
                <li>
                  <div className=" flex justify-between">
                    <div>Łącznie</div>
                    <div>{totalPrice} PLN</div>
                  </div>
                </li>

                <li>
                  <button
                    onClick={() => placeOrder()}
                    disabled={isPlacing}
                    className="btn btn-primary w-full"
                  >
                    {isPlacing && (
                      <span className="loading loading-spinner"></span>
                    )}
                    Złóż zamówienie
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
