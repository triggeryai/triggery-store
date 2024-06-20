// app\admin\products\[id]\Form.tsx
'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ValidationRule, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Product } from '@/lib/models/ProductModel'
import { formatId } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function ProductEditForm({ productId }: { productId: string }) {
  const { data: product, error } = useSWR(`/api/admin/products/${productId}`)
  const { data: categories, error: categoriesError } = useSWR('/api/admin/categories');

  const router = useRouter()
  const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/products/${productId}`,
    async (url, { arg }) => {
      const res = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)

      toast.success('Produkt pomyślnie zaktualizowany')
      router.push('/admin/products')
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Product>({
    defaultValues: {
      name: '',
      slug: '',
      price: '',
      image: '',
      category: '', // You'll set this once you have the data
      brand: '',
      countInStock: '',
      description: '',
    }
  });

  useEffect(() => {
    if (!product) return;
    setValue('name', product.name);
    setValue('slug', product.slug);
    setValue('price', product.price);
    setValue('image', product.image);
    setValue('category', product.category._id); // Ustawia _id, a nie cały obiekt kategorii
    setValue('brand', product.brand);
    setValue('countInStock', product.countInStock);
    setValue('description', product.description);
  }, [product, setValue]);
  
  useEffect(() => {
    console.log(product); // Check the entire product object
    console.log(categories); // Check the categories array
    if (product && categories) {
      reset({
        ...product,
        category: product.category._id, // Ensure this is the correct category ID
      });
    }
  }, [product, categories, reset]);
  
  const formSubmit = async (formData: any) => {
    await updateProduct(formData)
  }

  if (error) return error.message
  if (!product) return 'Ładowanie...'

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof Product
    name: string
    required?: boolean
    pattern?: ValidationRule<RegExp>
  }) => (
    <div className="md:flex mb-6">
      <label className="label md:w-1/5" htmlFor={id}>
        {name}
      </label>
      <div className="md:w-4/5">
        <input
          type="text"
          id={id}
          {...register(id, {
            required: required && `${name} jest wymagane`,
            pattern,
          })}
          className="input input-bordered w-full max-w-md"
        />
        {errors[id]?.message && (
          <div className="text-error">{errors[id]?.message}</div>
        )}
      </div>
    </div>
  )

  const uploadHandler = async (e: any) => {
    const toastId = toast.loading('Wysyłanie obrazu...')
    try {
      const resSign = await fetch('/api/cloudinary-sign', {
        method: 'POST',
      })
      const { signature, timestamp } = await resSign.json()
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp)
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await res.json()
      setValue('image', data.secure_url)
      toast.success('Plik pomyślnie przesłany', {
        id: toastId,
      })
    } catch (err: any) {
      toast.error(err.message, {
        id: toastId,
      })
    }
  }

  const CategorySelect = ({ register, error, currentCategory }) => {
    if (!categories) return 'Ładowanie kategorii...';
    if (categoriesError) return `Błąd: ${categoriesError.message}`;
    
    console.log("Current Category ID: ", currentCategory);
  
    return (
      <div className="md:flex mb-6">
        <label className="label md:w-1/5" htmlFor="category">Kategoria</label>
        <div className="md:w-4/5">
          <select
            id="category"
            {...register("category", { required: "Kategoria jest wymagana" })}
            className="select select-bordered w-full max-w-md"
          >
            {categories.map((cat) => (
              <option value={cat._id} key={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {errors.category && (
            <div className="text-error">{errors.category.message}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl py-4">Edytuj Produkt {formatId(productId)}</h1>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormInput name="Nazwa" id="name" required />
          <FormInput name="Slug" id="slug" required />
          <FormInput name="Obraz" id="image" required />
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="imageFile">
              Prześlij obraz
            </label>
            <div className="md:w-4/5">
              <input
                type="file"
                className="file-input w-full max-w-md"
                id="imageFile"
                onChange={uploadHandler}
              />
            </div>
          </div>
          <FormInput name="Cena" id="price" required />
          <CategorySelect register={register} error={errors.category} currentCategory={product.category._id} />
          <FormInput name="Marka" id="brand" required />
          <FormInput name="Opis" id="description" required />
          <FormInput name="Ilość w magazynie" id="countInStock" required />

          <button
            type="submit"
            disabled={isUpdating}
            className="btn btn-primary"
          >
            {isUpdating && <span className="loading loading-spinner"></span>}
            Aktualizuj
          </button>
          <Link className="btn ml-4 " href="/admin/products">
            Anuluj
          </Link>
        </form>
      </div>
    </div>
  )
}
