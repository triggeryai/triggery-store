'use client'
import CheckoutSteps from '@/components/CheckoutSteps'
import useCartService from '@/lib/hooks/useCartStore'
import { ShippingAddress } from '@/lib/models/OrderModel'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Select from 'react-select';

const Form = () => {
  const router = useRouter()
  const { saveShippingAddrress, shippingAddress } = useCartService()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ShippingAddress>({
    defaultValues: shippingAddress || {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      shippingMethod: '',
    },
  })

  useEffect(() => {
    if (shippingAddress) {
      Object.keys(shippingAddress).forEach(key => {
        setValue(key, shippingAddress[key])
      });
    }
  }, [setValue, shippingAddress])

  const formSubmit: SubmitHandler<ShippingAddress> = async (data) => {
    saveShippingAddrress(data)
    router.push('/payment')
  }

  const [shippingPrice, setShippingPrice] = useState(0);

  const shippingOptions = [
    { value: 'Inpost Paczkomat', label: 'Inpost Paczkomat - $5', price: 5 },
    { value: 'Pocztex Poczta Polska', label: 'Pocztex Poczta Polska - $7', price: 7 },
    { value: 'Inpost Kurier', label: 'Inpost Kurier - $10', price: 10 },
    { value: 'DPD Kurier', label: 'DPD Kurier - $12', price: 12 },
    { value: 'DHL Kurier', label: 'DHL Kurier - $15', price: 15 },
    { value: 'Orlen Paczkomat', label: 'Orlen Paczkomat - $15', price: 15 },
    { value: 'Odbior osobisty', label: 'Odbior osobisty - $0', price: 0 },


  ];

  const handleShippingChange = option => {
    setValue('shippingMethod', option.value);
    setShippingPrice(option.price);
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
              defaultValue={shippingOptions.find(option => option.value === watch('shippingMethod'))}
              onChange={handleShippingChange}
              className="mb-4"
              placeholder="Select shipping method"
            />
            <div className="text-right mb-4">
              <strong>Shipping Cost:</strong> ${shippingPrice}
            </div>
            {/* Full Name */}
            <div className="mb-2">
              <label className="label" htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                {...register('fullName', { required: "Full Name is required" })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.fullName && (
                <div className="text-error">{errors.fullName.message}</div>
              )}
            </div>
            {/* Address */}
            <div className="mb-2">
              <label className="label" htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                {...register('address', { required: "Address is required" })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.address && (
                <div className="text-error">{errors.address.message}</div>
              )}
            </div>
            {/* City */}
            <div className="mb-2">
              <label className="label" htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                {...register('city', { required: "City is required" })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.city && (
                <div className="text-error">{errors.city.message}</div>
              )}
            </div>
            {/* Postal Code */}
            <div className="mb-2">
              <label className="label" htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                {...register('postalCode', { required: "Postal Code is required" })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.postalCode && (
                <div className="text-error">{errors.postalCode.message}</div>
              )}
            </div>
            {/* Country */}
            <div className="mb-2">
              <label className="label" htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                {...register('country', { required: "Country is required" })}
                className="input input-bordered w-full max-w-xs"
              />
              {errors.country && (
                <div className="text-error">{errors.country.message}</div>
              )}
            </div>
            {/* Submit Button */}
            <div className="my-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? <span className="loading loading-spinner"></span> : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Form;
