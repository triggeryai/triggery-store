// next-amazona-v2/app/(front)/place-order/Form.tsx
'use client';
import CheckoutSteps from '@/components/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import useSWRMutation from 'swr/mutation';
import Image from 'next/image';
import { useSession } from 'next-auth/react'; // Import useSession

const Form = () => {
  const { data: session } = useSession(); // Get session data
  const router = useRouter();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    clear,
  } = useCartService();

  const [isGuestCheckoutEnabled, setIsGuestCheckoutEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [originalShippingPrice, setOriginalShippingPrice] = useState(0); // Zapisujemy oryginalną cenę wysyłki
  const [taxPrice, setTaxPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(itemsPrice + taxPrice + shippingPrice);
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [discountCode, setDiscountCode] = useState<string>(''); // Kod rabatowy
  const [discountApplied, setDiscountApplied] = useState<number | null>(null); // Wartość rabatu
  const [isFreeShipping, setIsFreeShipping] = useState(false); // Czy wysyłka darmowa

  // Funkcja do przeliczania całkowitej kwoty zamówienia
  const calculateTotalPrice = useCallback((shipping: number, tax: number, discount: number | null = null) => {
    const discountAmount = discount ? discount : 0;
    let total = itemsPrice + tax + shipping - discountAmount;
    if (total < 0) total = 0; // Upewnij się, że całkowita kwota nie jest ujemna
    setTotalPrice(total);
  }, [itemsPrice]);

  const getImageSrc = (src: string | undefined) => {
    if (!src) {
      return '/default-image.jpg'; 
    }
    if (src.startsWith('http')) {
      return src; 
    }
    return `/products/${src}`; 
  };

  // Funkcja pobierająca dane o kosztach wysyłki z backendu
  const fetchShippingData = async () => {
    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingMethod: localStorage.getItem('shippingMethod'),
          products: items.map((item) => ({
            ...item,
            qty: item.qty,
            width: item.width,
            height: item.height,
            depth: item.depth,
          })),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch shipping data');
      }
  
      const data = await response.json();
      setShippingPrice(data.totalShippingCost);
      setOriginalShippingPrice(data.totalShippingCost); // Zapisujemy oryginalną cenę wysyłki
      calculateTotalPrice(data.totalShippingCost, taxPrice, discountApplied);
    } catch (error) {
      console.error('Error fetching shipping data:', error);
    }
  };

  // Funkcja do aktywacji kodu rabatowego
  const applyDiscountCode = async () => {
    try {
      const response = await fetch('/api/discounts/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: discountCode,
          userId: localStorage.getItem('userId'),
        }),
      });
  
      const data = await response.json();
      if (!response.ok || !data.valid) {
        throw new Error(data.message || 'Invalid discount code');
      }
  
      // Sprawdź, czy rabat dotyczy darmowej wysyłki
      const freeShipping = data.type === 'free_shipping';
      setIsFreeShipping(freeShipping);

      // Zmień metodę wysyłki na "Odbiór osobisty" i ustaw cenę wysyłki na 0 PLN w przypadku darmowej wysyłki
      const newShippingPrice = freeShipping ? 0 : originalShippingPrice;
      if (freeShipping) {
        localStorage.setItem('shippingMethod', 'Odbior osobisty');
      }

      setDiscountApplied(data.discountAmount);
      setShippingPrice(newShippingPrice); // Ustawienie nowej ceny wysyłki od razu
      calculateTotalPrice(newShippingPrice, taxPrice, data.discountAmount);
  
      toast.success('Kod rabatowy został zastosowany!');
    } catch (error) {
      setDiscountApplied(null);
      toast.error('Nieprawidłowy kod rabatowy');
    }
  };

  useEffect(() => {
    if (router.query?.id) {
      setOrderId(router.query.id as string);
    }
  }, [router.query]);

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

  useEffect(() => {
    if (!loading) {
      if (!paymentMethod && !isGuestCheckoutEnabled) {
        router.push('/signin?callbackUrl=/place-order');
      }
    }
  }, [loading, paymentMethod, isGuestCheckoutEnabled, router]);

  useEffect(() => {
    const shippingMethod = localStorage.getItem('shippingMethod');
    if (shippingMethod === 'Odbior osobisty') {
      setShippingPrice(0);
      calculateTotalPrice(0, taxPrice, discountApplied);
    } else {
      fetchShippingData();
    }
  }, [itemsPrice, taxPrice, discountApplied, calculateTotalPrice]);

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
          calculateTotalPrice(shippingPrice, taxValue, discountApplied);
        }
      } catch (error) {
        console.error('Error fetching tax settings:', error);
      }
    };

    fetchTaxSettings();
  }, [itemsPrice, shippingPrice, calculateTotalPrice, discountApplied]);

  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    `/api/orders/mine`,
    async (url) => {
      const email = session?.user?.email || localStorage.getItem('userEmail'); // Pobieranie e-maila z sesji lub localStorage
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
            selectedOrlenPoint: localStorage.getItem('selectedOrlenPoint'),
            shippingCost: shippingPrice,
            email, // Dodanie emaila do zamówienia
          },
          items: items.map(item => ({
            ...item,
            mainImage: item.mainImage,
          })),
          discountCode, // Wysyłamy kod rabatowy
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        clear(); // Wyczyść koszyk
        toast.success('Zamówienie złożone pomyślnie');
        
        await fetch('/api/send-order-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            orderId: data.order._id,
          }),
        });
  
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
  }, [paymentMethod, router]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  const shippingMethod = localStorage.getItem('shippingMethod');
  const selectedPaczkomat = JSON.parse(localStorage.getItem('selectedPaczkomat') || '{}');
  const selectedPocztex = JSON.parse(localStorage.getItem('selectedPoint') || '{}');
  const selectedOrlen = JSON.parse(localStorage.getItem('selectedOrlenPoint') || '{}');

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
      <CheckoutSteps current={4} />

      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="overflow-x-auto md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Adres Dostawy</h2>
              <p>{shippingAddress.fullName}</p>
              <p>{session?.user?.email || localStorage.getItem('userEmail')} {/* Email użytkownika */}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              <p>
                Metoda wysyłki: {shippingMethod} - 
                <span className={isFreeShipping ? "line-through text-red-500" : ""}>{originalShippingPrice.toFixed(2)} PLN</span> 
                {isFreeShipping && <span className="text-green-500"> DARMOWA WYSYŁKA 0 PLN</span>}
              </p>
              {shippingMethod === 'Inpost Paczkomat' && selectedPaczkomat && selectedPaczkomat.name && (
                <p>Wybrany Paczkomat: {selectedPaczkomat.name}</p>
              )}
              {shippingMethod === 'Pocztex Poczta Odbior Punkt' && selectedPocztex && selectedPocztex.name && (
                <p>Wybrany Punkt Pocztex: {selectedPocztex.name}</p>
              )}
              {shippingMethod === 'Orlen Paczka' && selectedOrlen && selectedOrlen.address && (
                <p>Wybrany Punkt Orlen Paczka: {selectedOrlen.address}</p>
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
                          <Image
                            src={getImageSrc(item.mainImage)}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="object-cover"
                          />
                          <span className="px-2">
                            {item.name} ({item.color} {item.size})
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
                  <div className="flex justify-between">
                    <div>Produkty</div>
                    <div>{itemsPrice.toFixed(2)} PLN</div>
                  </div>
                </li>
                {taxPrice > 0 && (
                  <li>
                    <div className="flex justify-between">
                      <div>Podatek</div>
                      <div>{taxPrice.toFixed(2)} PLN</div>
                    </div>
                  </li>
                )}
                <li>
                  <div className="flex justify-between">
                    <div>Wysyłka</div>
                    <div>{isFreeShipping 
                      ? <><span className="line-through text-red-500">{originalShippingPrice.toFixed(2)} PLN</span> <span className="text-green-500"> DARMOWA WYSYŁKA 0 PLN</span></> 
                      : <>{shippingPrice.toFixed(2)} PLN</>}</div>
                  </div>
                </li>

                <li>
                  <div className="flex justify-between">
                    <div>Łącznie</div>
                    <div>{totalPrice.toFixed(2)} PLN</div>
                  </div>
                </li>

                {/* Wyświetl pole rabatu tylko wtedy, gdy rabat jest inny niż darmowa wysyłka */}
                {discountApplied !== null && !isFreeShipping && (
                  <li>
                    <div className="flex justify-between">
                      <div>Rabat</div>
                      <div><span className="line-through text-red-500">{(totalPrice + discountApplied).toFixed(2)} PLN</span> <span className="text-green-500">{totalPrice.toFixed(2)} PLN</span></div>
                    </div>
                  </li>
                )}

                <li>
                  <input
                    type="text"
                    placeholder="Masz kod rabatowy?"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="input input-bordered w-full"
                  />
                  <button className="btn btn-primary mt-2 w-full" onClick={applyDiscountCode}>
                    Zastosuj kod
                  </button>
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
