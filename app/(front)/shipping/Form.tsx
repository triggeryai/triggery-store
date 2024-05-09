// app\(front)\shipping\Form.tsx
"use client";
import React, { useState, useEffect } from "react";
import CheckoutSteps from "@/components/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";
import { ShippingAddress } from "@/lib/models/OrderModel";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Select from "react-select";
import InpostBox from "@/components/InpostBox";

const Form = () => {
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
      address: "",
      city: "",
      postalCode: "",
      country: "",
      shippingMethod: "",
    },
  });
  const [shippingMethod, setShippingMethod] = useState(() => localStorage.getItem('shippingMethod') || '');  const [shippingPrice, setShippingPrice] = useState(0);
  const [selectedPaczkomat, setSelectedPaczkomat] = useState(null);
  const [showInpostModal, setShowInpostModal] = useState(false);
  const [selectedPocztex, setSelectedPocztex] = useState(null);

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
  }, [setValue, shippingAddress]); // Include modal state if needed


  useEffect(() => {
    const method = localStorage.getItem('shippingMethod');
    const redirected = localStorage.getItem('redirected');
  
    if (method && !redirected) {
      if (method === "Pocztex Poczta Odbior Punkt") {
        localStorage.setItem('redirected', 'true'); // Zapisz, że przekierowanie nastąpiło
        router.push("/pocztex/pocztex.html");
      }
    }
  }, [shippingMethod, router]);
  

  useEffect(() => {
    const savedPoint = localStorage.getItem("selectedPoint");
    if (savedPoint) {
      setSelectedPocztex(JSON.parse(savedPoint));
    }
  }, []);
  
  // Dodatkowo, pamiętaj o aktualizacji tego stanu przy każdej zmianie metody wysyłki
  useEffect(() => {
    if (shippingMethod === "Pocztex Poczta Odbior Punkt") {
      const savedPoint = localStorage.getItem("selectedPoint");
      if (savedPoint) {
        setSelectedPocztex(JSON.parse(savedPoint));
      } else {
        setSelectedPocztex(null); // Resetuj, jeśli nie ma zapisanego punktu
      }
    }
  }, [shippingMethod]);
  

  useEffect(() => {
    const method = localStorage.getItem('shippingMethod');
    if (method) {
      setShippingMethod(method);
      setValue('shippingMethod', method);
    }
  }, [setValue]);
  

  const shippingOptions = [
    { value: "Inpost Paczkomat", label: "Inpost Paczkomat - $5", price: 5 },
    { value: "Pocztex Poczta Polska Kurier", label: "Pocztex Poczta Kurier - $7", price: 7 },
    { value: "Pocztex Poczta Odbior Punkt", label: "Pocztex Poczta Odbior Punkt - $7", price: 7 },
    { value: "Inpost Kurier", label: "Inpost Kurier - $10", price: 10 },
    { value: "DPD Kurier", label: "DPD Kurier - $12", price: 12 },
    { value: "DHL Kurier", label: "DHL Kurier - $15", price: 15 },
    { value: "Orlen Paczkomat", label: "Orlen Paczkomat - $15", price: 15 },
    { value: "Odbior osobisty", label: "Odbior osobisty - $0", price: 0 },
  ];

  const handleShippingChange = (option) => {
    console.log(option.value); // Debug: sprawdź wybraną wartość opcji
    setShippingMethod(option.value);
    localStorage.setItem('shippingMethod', option.value); // Zapisz do localStorage
    localStorage.removeItem('redirected'); // Resetuj stan przekierowania
    setShippingPrice(option.price);
    setShowInpostModal(option.value === "Inpost Paczkomat");
  };
  
  

  const handleOpenModal = () => {
    setShowInpostModal(true);
  };

  
  const formSubmit = async (data) => {
    saveShippingAddrress(data);
    router.push("/payment");
  };

  return (
    <div>
      <CheckoutSteps current={1} />
      <div className="max-w-sm mx-auto card bg-base-300 my-4">
        <div className="card-body">
          <h1 className="card-title">Shipping Address</h1>
          <form onSubmit={handleSubmit(formSubmit)}>

          <Select
              options={shippingOptions}
              value={shippingOptions.find(option => option.value === shippingMethod)}
              onChange={handleShippingChange}
              className="mb-4"
              placeholder="Select shipping method"
            />
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 min-w-0">
                <strong>Shipping Cost:</strong> ${shippingPrice}
              </div>
              {watch("shippingMethod") === "Inpost Paczkomat" && selectedPaczkomat && (
                <div className="flex-1 min-w-0">
                  <strong>Selected Paczkomat:</strong> {selectedPaczkomat.name}
                  <button type="button" onClick={handleOpenModal} className="btn btn-link">Change Paczkomat</button>
                </div>
              )}
                  {watch("shippingMethod") === "Pocztex Poczta Odbior Punkt" && (
                    <div className="flex-1 min-w-0">
  <strong>Selected Pocztex Point:</strong> {selectedPocztex ? `${selectedPocztex.name}, ${selectedPocztex.street}, ${selectedPocztex.city}` : "None"}
  <button type="button" onClick={() => router.push("/pocztex/pocztex.html")} className="btn btn-link">Change Pocztex Point</button>
</div>

    )}
            </div>
            {/* Form fields for the shipping address */}
            <div className="mb-2">
              <label className="label" htmlFor="fullName">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                {...register("fullName", { required: "Full Name is required" })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.fullName && (
                <div className="text-error">{errors.fullName.message}</div>
              )}
            </div>
            <div className="mb-2">
              <label className="label" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                id="address"
                {...register("address", { required: "Address is required" })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.address && (
                <div className="text-error">{errors.address.message}</div>
              )}
            </div>
            <div className="mb-2">
              <label class="label" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="city"
                {...register("city", { required: "City is required" })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.city && (
                <div className="text-error">{errors.city.message}</div>
              )}
            </div>
            <div className="mb-2">
              <label className="label" htmlFor="postalCode">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                {...register("postalCode", {
                  required: "Postal Code is required",
                })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.postalCode && (
                <div className="text-error">{errors.postalCode.message}</div>
              )}
            </div>
            <div className="mb-2">
              <label className="label" htmlFor="country">
                Country
              </label>
              <input
                type="text"
                id="country"
                {...register("country", { required: "Country is required" })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.country && (
                <div className="text-error">{errors.country.message}</div>
              )}
            </div>
            <div className="my-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showInpostModal && <InpostBox closeModal={() => setShowInpostModal(false)} />}
    </div>
  );
};

export default Form;
