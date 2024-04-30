'use client'
import CheckoutSteps from '@/components/CheckoutSteps'
import useCartService from '@/lib/hooks/useCartStore'
import { ShippingAddress } from '@/lib/models/OrderModel'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
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
    defaultValues: {
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
      setValue('fullName', shippingAddress.fullName)
      setValue('address', shippingAddress.address)
      setValue('city', shippingAddress.city)
      setValue('postalCode', shippingAddress.postalCode)
      setValue('country', shippingAddress.country)
      setValue('shippingMethod', shippingAddress.shippingMethod || 'Inpost Paczkomat')
    }
  }, [setValue, shippingAddress])

  const formSubmit: SubmitHandler<ShippingAddress> = async (data) => {
    saveShippingAddrress(data)
    router.push('/payment')
  }

  const shippingOptions = [
    { value: 'Inpost Paczkomat', label: 'Inpost Paczkomat' },
    { value: 'Pocztex Poczta Polska', label: 'Pocztex Poczta Polska' },
    { value: 'Inpost Kurier', label: 'Inpost Kurier' },
    { value: 'DPD Kurier', label: 'DPD Kurier' },
    { value: 'DHL Kurier', label: 'DHL Kurier' },
  ];

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
              onChange={(option) => setValue('shippingMethod', option?.value)}
              className="mb-4"
              placeholder="Select shipping method"
            />
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
            <div className="my-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting && (
                  <span className="loading loading-spinner"></span>
                )}
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Form;
