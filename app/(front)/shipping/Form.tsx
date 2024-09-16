// next-amazona-v2/app/(front)/shipping/Form.tsx
"use client";
import React, { useState, useEffect } from "react";
import CheckoutSteps from "@/components/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";
import { ShippingAddress } from "@/lib/models/OrderModel";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { useSession } from 'next-auth/react';

const InpostModal = ({ closeModal }) => {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'CLOSE_MODAL') {
        closeModal();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [closeModal]);

  return (
    <div className="modal modal-open">
      <div className="modal-box relative" style={{ width: '75%', height: '75%' }}>
        <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>OK</button>
        <iframe src="/inpost/inpost.html" className="w-full h-full"></iframe>
      </div>
    </div>
  );
};

const OrlenModal = ({ closeModal }) => {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'CLOSE_MODAL') {
        closeModal();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [closeModal]);

  return (
    <div className="modal modal-open">
      <div className="modal-box relative" style={{ width: '80%', height: '80%' }}>
        <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>OK</button>
        <iframe src="/orlen/index.html" className="w-full h-full"></iframe>
      </div>
    </div>
  );
};

const Form = () => {
  const { data: session } = useSession();
  const [isGuestCheckoutEnabled, setIsGuestCheckoutEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shippingOptionsLoading, setShippingOptionsLoading] = useState(true);
  const router = useRouter();
  const { saveShippingAddrress, shippingAddress } = useCartService();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: shippingAddress || {
      fullName: "",
      email: session?.user?.email || "",  // Automatically fill email if the user is logged in
      address: "",
      city: "",
      postalCode: "",
      country: "",
      shippingMethod: "",
    },
  });

  const [shippingMethod, setShippingMethod] = useState('');
  const [shippingPrice, setShippingPrice] = useState(0);
  const [selectedPaczkomat, setSelectedPaczkomat] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null); // Orlen Paczka
  const [showInpostModal, setShowInpostModal] = useState(false);
  const [showOrlenModal, setShowOrlenModal] = useState(false); // Modal dla Orlen Paczki
  const [selectedPocztex, setSelectedPocztex] = useState(null);
  const [shippingOptions, setShippingOptions] = useState([]);

  // Fetching guest checkout status
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
        setLoading(false);
      }
    };
    fetchGuestCheckoutStatus();
  }, []);

  useEffect(() => {
    if (!loading && !session && !isGuestCheckoutEnabled) {
      router.push('/signin?callbackUrl=http%3A%2F%2Fdomestico.pl');
    }
  }, [loading, session, isGuestCheckoutEnabled, router]);

  useEffect(() => {
    if (shippingAddress) {
      Object.keys(shippingAddress).forEach((key) => {
        setValue(key, shippingAddress[key]);
      });
    }

    const paczkomatInfo = localStorage.getItem("selectedPaczkomat");
    if (paczkomatInfo) {
      setSelectedPaczkomat(JSON.parse(paczkomatInfo));
    }

    const selectedOrlen = localStorage.getItem("selectedOrlenPoint");
    if (selectedOrlen) {
      setSelectedPoint(JSON.parse(selectedOrlen)); // Wybrany punkt Orlen Paczki
    }

    const savedPoint = localStorage.getItem("selectedPoint");
    if (savedPoint) {
      setSelectedPocztex(JSON.parse(savedPoint));
    }

    const method = localStorage.getItem('shippingMethod');
    const price = parseFloat(localStorage.getItem('shippingPrice')) || 0;
    if (method) {
      setShippingMethod(method);
      setShippingPrice(price);
      setValue('shippingMethod', method);
    }
  }, [setValue, shippingAddress]);

  useEffect(() => {
    if (shippingMethod === "Pocztex Poczta Odbior Punkt") {
      const savedPoint = localStorage.getItem("selectedPoint");
      if (savedPoint) {
        setSelectedPocztex(JSON.parse(savedPoint));
      } else {
        setSelectedPocztex(null);
        router.push("/pocztex/pocztex.html");
      }
    } else {
      setSelectedPocztex(null);
    }

    if (shippingMethod !== "Inpost Paczkomat") {
      setSelectedPaczkomat(null);
    }
    if (shippingMethod !== "Orlen Paczka") {
      setSelectedPoint(null);
    }
  }, [shippingMethod, router]);

  useEffect(() => {
    const fetchShippingOptions = async () => {
      try {
        const response = await fetch('/api/shipping');
        if (!response.ok) {
          throw new Error('Failed to fetch shipping options');
        }
        const data = await response.json();

        // Filtrujemy opcje wysyłki, które mają ustawione wymiary i wagę lub są "Odbiorem osobistym"
        const activeOptions = data.filter(option => option.isActive && (option.value === 'Odbior osobisty' || (option.width && option.height && option.depth && option.weight)));
        setShippingOptions(activeOptions);
      } catch (error) {
        console.error('Error fetching shipping options:', error);
        setShippingOptions([]);
      } finally {
        setShippingOptionsLoading(false);
      }
    };
    fetchShippingOptions();
  }, []);


  const handleShippingChange = (option) => {
    setShippingMethod(option.value);
    localStorage.setItem('shippingMethod', option.value);
    localStorage.setItem('shippingPrice', option.price);
    setShippingPrice(option.price);

    if (option.value === "Inpost Paczkomat") {
      setShowInpostModal(true);
    } else {
      setShowInpostModal(false);
    }

    if (option.value === "Orlen Paczka") {
      setShowOrlenModal(true); // Otwórz modal dla Orlen Paczka
    } else {
      setShowOrlenModal(false);
    }

    if (option.value !== "Inpost Paczkomat" && option.value !== "Pocztex Poczta Odbior Punkt") {
      setSelectedPaczkomat(null);
    }

    if (option.value === "Pocztex Poczta Odbior Punkt") {
      const savedPoint = localStorage.getItem("selectedPoint");
      if (!savedPoint) {
        setTimeout(() => {
          router.push("/pocztex/pocztex.html");
        }, 0);
      }
    }
  };

  const formSubmit = async (data) => {
    saveShippingAddrress(data);
    router.push("/payment");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <span className="ml-4 text-lg text-blue-500 font-semibold">Ładowanie danych...</span>
      </div>
    );
  }

  return (
    <div>
      <CheckoutSteps current={1} />
      <div className="max-w-lg mx-auto card bg-base-300 my-4 p-6">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">Adres Dostawy</h1>
          <form onSubmit={handleSubmit(formSubmit)} className="space-y-4">
            {shippingOptionsLoading ? (
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                <span className="ml-4">Ładowanie opcji wysyłki...</span>
              </div>
            ) : (
              <Select
                options={shippingOptions.map(option => ({
                  value: option.value,
                  label: option.label,
                  price: option.price
                }))}
                value={shippingOptions.find(option => option.value === shippingMethod)}
                onChange={handleShippingChange}
                className="mb-4 text-black"
                placeholder="Wybierz metodę wysyłki"
              />
            )}
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 min-w-0">
                <strong>Koszt wysyłki:</strong> {shippingPrice} PLN ({shippingMethod})
              </div>
              {watch("shippingMethod") === "Inpost Paczkomat" && selectedPaczkomat && (
                <div className="flex-1 min-w-0">
                  <strong>Wybrany Paczkomat:</strong> {selectedPaczkomat.name}
                  <button type="button" onClick={() => setShowInpostModal(true)} className="btn btn-link">Zmień Paczkomat</button>
                </div>
              )}
              {watch("shippingMethod") === "Pocztex Poczta Odbior Punkt" && selectedPocztex && (
                <div className="flex-1 min-w-0">
                  <strong>Wybrany Punkt Pocztex:</strong> {selectedPocztex ? `${selectedPocztex.name}, ${selectedPocztex.street}, ${selectedPocztex.city}` : "Brak"}
                  <button type="button" onClick={() => router.push("/pocztex/pocztex.html")} className="btn btn-link">Zmień Punkt Pocztex</button>
                </div>
              )}
              {watch("shippingMethod") === "Orlen Paczka" && selectedPoint && (
                <div className="flex-1 min-w-0">
                  <strong>Wybrany Punkt Orlen Paczka:</strong> {selectedPoint ? `${selectedPoint.address}` : "Brak"}
                  <button type="button" onClick={() => setShowOrlenModal(true)} className="btn btn-link">Zmień Punkt Orlen</button>
                </div>
              )}
            </div>
            
            {/* Email field */}
            <div className="mb-2">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", { required: "Email jest wymagany" })}
                className="input input-bordered w-full"
                defaultValue={session?.user?.email || ""} // Automatically fill email if logged in
              />
              {errors.email && (
                <div className="text-error">{errors.email.message}</div>
              )}
            </div>

            {/* Full Name */}
            <div className="mb-2">
              <label className="label" htmlFor="fullName">
                Imię i nazwisko
              </label>
              <input
                type="text"
                id="fullName"
                {...register("fullName", { required: "Pełna nazwa jest wymagana" })}
                className="input input-bordered w-full"
              />
              {errors.fullName && (
                <div className="text-error">{errors.fullName.message}</div>
              )}
            </div>

            {/* Address, City, Postal Code, Country fields (as before) */}
            {/* Address */}
            <div className="mb-2">
              <label className="label" htmlFor="address">
                Adres
              </label>
              <input
                type="text"
                id="address"
                {...register("address", { required: "Adres jest wymagany" })}
                className="input input-bordered w/full"
              />
              {errors.address && (
                <div className="text-error">{errors.address.message}</div>
              )}
            </div>

            {/* City */}
            <div className="mb-2">
              <label className="label" htmlFor="city">
                Miasto
              </label>
              <input
                type="text"
                id="city"
                {...register("city", { required: "Miasto jest wymagane" })}
                className="input input-bordered w/full"
              />
              {errors.city && (
                <div className="text-error">{errors.city.message}</div>
              )}
            </div>

            {/* Postal Code */}
            <div className="mb-2">
              <label className="label" htmlFor="postalCode">
                Kod pocztowy
              </label>
              <input
                type="text"
                id="postalCode"
                {...register("postalCode", { required: "Kod pocztowy jest wymagany" })}
                className="input input-bordered w/full"
              />
              {errors.postalCode && (
                <div className="text-error">{errors.postalCode.message}</div>
              )}
            </div>

            {/* Country */}
            <div className="mb-2">
              <label className="label" htmlFor="country">
                Kraj
              </label>
              <input
                type="text"
                id="country"
                {...register("country", { required: "Kraj jest wymagany" })}
                className="input input-bordered w/full"
              />
              {errors.country && (
                <div className="text-error">{errors.country.message}</div>
              )}
            </div>

            <div className="my-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Dalej"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showInpostModal && <InpostModal closeModal={() => setShowInpostModal(false)} />}
      {showOrlenModal && <OrlenModal closeModal={() => setShowOrlenModal(false)} />}
    </div>
  );
};


export default Form;
