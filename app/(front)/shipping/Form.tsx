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

  const [shippingPrice, setShippingPrice] = useState(0);
  const [selectedPaczkomat, setSelectedPaczkomat] = useState(null);
  const [showInpostModal, setShowInpostModal] = useState(false);

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
  }, [setValue, shippingAddress]);

  const shippingOptions = [
    { value: "Inpost Paczkomat", label: "Inpost Paczkomat - $5", price: 5 },
    { value: "Pocztex Poczta Polska", label: "Pocztex Poczta Polska - $7", price: 7 },
    { value: "Inpost Kurier", label: "Inpost Kurier - $10", price: 10 },
    { value: "DPD Kurier", label: "DPD Kurier - $12", price: 12 },
    { value: "DHL Kurier", label: "DHL Kurier - $15", price: 15 },
    { value: "Orlen Paczkomat", label: "Orlen Paczkomat - $15", price: 15 },
    { value: "Odbior osobisty", label: "Odbior osobisty - $0", price: 0 },
  ];

  const handleShippingChange = (option) => {
    setValue("shippingMethod", option.value);
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
              defaultValue={shippingOptions.find(
                (option) => option.value === watch("shippingMethod")
              )}
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
