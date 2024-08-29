// next-amazona-v2/app/admin/products/[id]/Form.tsx
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
import Image from 'next/image';  // Import the Image component from next/image

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

      toast.success('Produkt zaktualizowany pomyślnie')
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
      images: [], // Ustawisz to, gdy będziesz mieć dane
      mainImage: '', // Ustawisz to, gdy będziesz mieć dane
      categories: [],
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
    setValue('images', product.images); // Ustawia tablicę obrazów
    setValue('mainImage', product.mainImage || product.images[0]); // Ustawia główne zdjęcie
    setValue('categories', product.categories.map(category => category._id));
    setValue('brand', product.brand);
    setValue('countInStock', product.countInStock);
    setValue('description', product.description);
  }, [product, setValue]);
  
  useEffect(() => {
    console.log(product); // Sprawdź cały obiekt produktu
    console.log(categories); // Sprawdź tablicę kategorii
    if (product && categories) {
      reset({
        ...product,
        categories: product.categories.map(category => category._id),
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
    const toastId = toast.loading('Ładowanie obrazu...')
    try {
      const resSign = await fetch('/api/cloudinary-sign', {
        method: 'POST',
      })
      const { signature, timestamp } = await resSign.json()
      const files = Array.from(e.target.files)
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
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
          return data.secure_url
        })
      )
      setValue('images', [...product.images, ...uploadedImages].slice(0, 10)) // Limit do 10 obrazów
      toast.success('Pliki przesłane pomyślnie', {
        id: toastId,
      })
    } catch (err: any) {
      toast.error(err.message, {
        id: toastId,
      })
    }
  }

  const CategorySelect = ({ register, error, currentCategories }) => {
    if (!categories) return 'Ładowanie kategorii...';
    if (categoriesError) return `Błąd: ${categoriesError.message}`;

    return (
      <div className="md:flex mb-6">
        <label className="label md:w-1/5" htmlFor="categories">Kategorie</label>
        <div className="md:w-4/5">
          <select
            id="categories"
            multiple
            {...register("categories", { required: "Kategorie są wymagane" })}
            className="select select-bordered w-full max-w-md"
          >
            {categories.map((cat) => (
              <option 
                key={cat._id} 
                value={cat._id} 
                selected={currentCategories.includes(cat._id)}>
                {cat.name}
              </option>
            ))}
          </select>
          {error && <div className="text-error">{error.message}</div>}
        </div>
      </div>
    );
  };

  const MainImageSelect = ({ register, images, mainImage }) => {
    return (
      <div className="md:flex mb-6">
        <label className="label md:w-1/5" htmlFor="mainImage">Główne Zdjęcie</label>
        <div className="md:w-4/5">
          <select
            id="mainImage"
            {...register("mainImage")}
            className="select select-bordered w-full max-w-md"
          >
            <option value="">Brak głównego zdjęcia</option>
            {images.map((image, index) => (
              <option key={index} value={image} selected={image === mainImage}>
                {`Zdjęcie ${index + 1}`}
              </option>
            ))}
          </select>
          {errors.mainImage && <div className="text-error">{errors.mainImage.message}</div>}
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
          <FormInput name="Cena" id="price" required />
          <CategorySelect register={register} error={errors.categories} currentCategories={product.categories.map(category => category._id)} />
          <FormInput name="Marka" id="brand" required />
          <FormInput name="Opis" id="description" required />
          <FormInput name="Ilość w magazynie" id="countInStock" required />
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="imageFiles">
              Prześlij Zdjęcia
            </label>
            <div className="md:w-4/5">
              <input
                type="file"
                className="file-input w-full max-w-md"
                id="imageFiles"
                multiple
                onChange={uploadHandler}
              />
            </div>
          </div>
          <MainImageSelect register={register} images={product.images} mainImage={product.mainImage} />

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

      {/* Wyświetlanie obrazów */}
      <div className="mt-8">
        <h2 className="text-xl mb-4">Zdjęcia Produktu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {product.images.map((image, index) => (
            <div key={index} className="relative">
              {/* Using the Image component from next/image */}
              <Image
                src={image}
                alt={`Zdjęcie Produktu ${index + 1}`}
                layout="responsive" // Use responsive layout for better handling
                width={200} // Specify the width
                height={200} // Specify the height
                className="rounded shadow-md"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
