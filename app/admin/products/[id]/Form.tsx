// next-amazona-v2/app/admin/products/[id]/Form.tsx
'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ValidationRule, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Product } from '@/lib/models/ProductModel'
import { formatId } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { FaSyncAlt } from 'react-icons/fa' // Import ikony odświeżania (FontAwesome lub dowolna inna biblioteka)

// Typy dla kategorii
interface Category {
  _id: string
  name: string
}

export default function ProductEditForm({ productId }: { productId: string }) {
  const { data: product, error, mutate: mutateProduct } = useSWR<Product>(`/api/admin/products/${productId}`)
  const { data: categories, error: categoriesError } = useSWR<Category[]>('/api/admin/categories');

  const [uploadTarget, setUploadTarget] = useState<'local' | 'cloudinary'>('local') // Domyślnie lokalny upload
  const [imageLoading, setImageLoading] = useState<string[]>([]) // Śledzenie ładowania obrazów
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || '1' // Pobierz aktualną stronę

  // Funkcja do odświeżenia komponentu (odświeżenie danych produktu)
  const handleRefresh = () => {
    mutateProduct(); // Ponowne pobranie danych bez odświeżania strony
    toast.success('Dane produktu zostały odświeżone'); // Opcjonalnie: powiadomienie toast
  }

  const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/products/${productId}`,
    async (url, { arg }) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);
  
      toast.success('Produkt zaktualizowany pomyślnie');
      mutateProduct(); // Odśwież dane produktu
      // Przekierowanie do listy produktów z ID edytowanego produktu
      router.push(`/admin/products?page=${page}&editedProductId=${productId}`);
    }
  );
  

  // Konfiguracja formularza
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
      images: [],
      mainImage: '',
      categories: [],
      brand: '',
      countInStock: '',
      description: '',
      width: 0,
      height: 0,
      depth: 0,
      weight: 0,
    },
  })

  // Ustaw wartości formularza po załadowaniu produktu
  useEffect(() => {
    if (!product) return
    setValue('name', product.name)
    setValue('slug', product.slug)
    setValue('price', product.price)
    setValue('images', product.images)
    setValue('mainImage', product.mainImage || product.images[0] || '')
    setValue('categories', product.categories.map(category => category._id))
    setValue('brand', product.brand)
    setValue('countInStock', product.countInStock)
    setValue('description', product.description)
    setValue('width', product.width || 0)
    setValue('height', product.height || 0)
    setValue('depth', product.depth || 0)
    setValue('weight', product.weight || 0)
  }, [product, setValue])

  // Reset formularza po załadowaniu kategorii i produktu
  useEffect(() => {
    if (product && categories) {
      reset({
        ...product,
        categories: product.categories.map(category => category._id),
      })
    }
  }, [product, categories, reset])

  // Obsługa wysyłki formularza
  const formSubmit = async (formData: Product) => {
    await updateProduct(formData)
  }

  // Obsługa usuwania obrazu
  const handleDeleteImage = async (image: string) => {
    setImageLoading(prev => [...prev, image])
    const toastId = toast.loading('Usuwanie zdjęcia...')

    try {
      const res = await fetch(`/api/admin/products/${productId}/delete-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      })

      if (res.ok) {
        mutateProduct() // Odśwież dane produktu po usunięciu obrazu
        toast.success('Zdjęcie usunięte pomyślnie', { id: toastId })
      } else {
        const data = await res.json()
        toast.error(data.message || 'Błąd podczas usuwania zdjęcia', { id: toastId })
      }
    } catch (err: any) {
      toast.error(err.message || 'Błąd podczas usuwania zdjęcia', { id: toastId })
    } finally {
      setImageLoading(prev => prev.filter(img => img !== image))
    }
  }

  // Otwórz modal potwierdzenia usunięcia
  const openDeleteModal = (image: string) => {
    setImageToDelete(image)
    setShowDeleteModal(true)
  }

  // Zamknij modal potwierdzenia
  const closeDeleteModal = () => {
    setImageToDelete(null)
    setShowDeleteModal(false)
  }

  // Obsługa ładowania obrazów
  const uploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const toastId = toast.loading('Ładowanie obrazów...')
    const tempLoaders = files.map((file, index) => `temp-${Date.now()}-${index}`)
    setImageLoading(prev => [...prev, ...tempLoaders])

    try {
      if (uploadTarget === 'cloudinary') {
        // Pobierz podpis z serwera
        const resSign = await fetch('/api/cloudinary-sign', { method: 'POST' })
        const { signature, timestamp, api_key, cloud_name } = await resSign.json()

        // Prześlij wszystkie pliki do Cloudinary
        const uploadedImages = await Promise.all(
          files.map(async (file, index) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('signature', signature)
            formData.append('timestamp', timestamp)
            formData.append('api_key', api_key)

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/upload`, {
              method: 'POST',
              body: formData,
            })

            const data = await res.json()
            if (data.secure_url) {
              return data.secure_url
            } else {
              throw new Error('Błąd podczas przesyłania do Cloudinary')
            }
          })
        )

        // Zaktualizuj obrazki w formularzu
        setValue('images', [...(product?.images || []), ...uploadedImages].slice(0, 10))
        toast.success('Obrazy przesłane do Cloudinary', { id: toastId })
      } else {
        // Prześlij obrazy na lokalny serwer
        const formData = new FormData()
        files.forEach(file => formData.append('file', file))
        formData.append('productId', productId)

        const res = await fetch('/api/local-upload', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()
        if (res.ok && data.filePaths) {
          setValue('images', [...(product?.images || []), ...data.filePaths].slice(0, 10))
          toast.success('Obrazy przesłane na lokalny serwer', { id: toastId })
        } else {
          throw new Error(data.message || 'Błąd podczas przesyłania na serwer')
        }
      }
      mutateProduct() // Odśwież dane produktu po przesłaniu
    } catch (err: any) {
      toast.error(err.message || 'Błąd podczas przesyłania obrazów', { id: toastId })
    } finally {
      setImageLoading(prev => prev.filter(img => !tempLoaders.includes(img)))
    }
  }

  // Komponent do wyboru kategorii
  const CategorySelect = ({
    register,
    error,
    currentCategories,
  }: {
    register: any
    error: any
    currentCategories: string[]
  }) => {
    if (!categories) return <p>Ładowanie kategorii...</p>
    if (categoriesError) return <p>Błąd: {categoriesError.message}</p>

    return (
      <div className="md:flex mb-6">
        <label className="label md:w-1/5" htmlFor="categories">
          Kategorie
        </label>
        <div className="md:w-4/5">
          <select
            id="categories"
            multiple
            {...register("categories", { required: "Kategorie są wymagane" })}
            className="select select-bordered w-full max-w-md"
          >
            {categories.map(cat => (
              <option
                key={cat._id}
                value={cat._id}
                selected={currentCategories.includes(cat._id)}
              >
                {cat.name}
              </option>
            ))}
          </select>
          {error && <div className="text-error">{error.message}</div>}
        </div>
      </div>
    )
  }

  // Komponent do wyboru głównego obrazu
  const MainImageSelect = ({
    register,
    images,
    mainImage,
    errors,
  }: {
    register: any
    images: string[]
    mainImage: string
    errors: any
  }) => {
    return (
      <div className="md:flex mb-6">
        <label className="label md:w-1/5" htmlFor="mainImage">
          Główne Zdjęcie
        </label>
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
    )
  }

  // Komponent do wejściowych pól formularza
  const FormInput = ({
    id,
    name,
    required,
    pattern,
    type = "text",
  }: {
    id: keyof Product
    name: string
    required?: boolean
    pattern?: ValidationRule<RegExp>
    type?: string
  }) => (
    <div className="md:flex mb-6">
      <label className="label md:w-1/5" htmlFor={id}>
        {name}
      </label>
      <div className="md:w-4/5">
        <input
          type={type}
          id={id}
          {...register(id, {
            required: required ? `${name} jest wymagane` : false,
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

  if (error) return <div className="text-error">Błąd: {error.message}</div>
  if (!product) return <div>Ładowanie...</div>

  return (
    <div>
      <h1 className="text-2xl py-4">Edytuj Produkt {formatId(productId)}</h1>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          {/* Pola formularza */}
          <FormInput name="Nazwa" id="name" required />
          <FormInput name="Slug" id="slug" required />
          <FormInput name="Cena" id="price" required />
          <CategorySelect
            register={register}
            error={errors.categories}
            currentCategories={product.categories.map(category => category._id)}
          />
          <FormInput name="Marka" id="brand" required />
          <FormInput name="Opis" id="description" required />
          <FormInput name="Ilość w magazynie" id="countInStock" required />
          <FormInput name="Szerokość (cm)" id="width" required={false} type="number" />
          <FormInput name="Wysokość (cm)" id="height" required={false} type="number" />
          <FormInput name="Głębokość (cm)" id="depth" required={false} type="number" />
          <FormInput name="Waga (kg)" id="weight" required={false} type="number" />

          {/* Wybór celu uploadu */}
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="uploadTarget">
              Miejsce przesyłania
            </label>
            <div className="md:w-4/5">
              <select
                id="uploadTarget"
                className="select select-bordered w-full max-w-md"
                onChange={(e) => setUploadTarget(e.target.value as 'cloudinary' | 'local')}
                value={uploadTarget}
              >
                <option value="local">Lokalny Serwer</option>
                <option value="cloudinary">Cloudinary</option>
              </select>
            </div>
          </div>

          {/* Przesyłanie zdjęć */}
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="imageFiles">
              Prześlij Zdjęcia
            </label>
            <div className="md:w-4/5">
              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-md"
                id="imageFiles"
                multiple
                onChange={uploadHandler}
              />
            </div>
          </div>

          {/* Wybór głównego obrazu */}
          <MainImageSelect
            register={register}
            images={product.images}
            mainImage={product.mainImage}
            errors={errors}
          />

          {/* Przycisk aktualizacji */}
          <button
            type="submit"
            disabled={isUpdating}
            className="btn btn-primary"
          >
            {isUpdating && <span className="loading loading-spinner"></span>}
            Aktualizuj
          </button>
          <Link className="btn ml-4" href={`/admin/products?page=${page}`}>
            Anuluj
          </Link>
        </form>
      </div>

      {/* Wyświetlanie obrazów produktu */}
      <div className="mt-8">
        <h2 className="text-xl mb-4 flex items-center">
          Zdjęcia Produktu
          <button 
            className="ml-2 text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out" 
            onClick={handleRefresh} 
            aria-label="Odśwież dane produktu"
          >
            <FaSyncAlt className="inline-block" />
          </button>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {product.images.map((image, index) => (
            <div key={index} className="relative group">
              {imageLoading.includes(image) ? (
                <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded shadow-md">
                  <span className="loading loading-spinner"></span>
                </div>
              ) : (
                <Image
                  src={image.startsWith('http') ? image : `/products/${image}`}
                  alt={`Zdjęcie Produktu ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded shadow-md"
                />
              )}
              <button
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => openDeleteModal(image)}
              >
                Usuń
              </button>
            </div>
          ))}
          {/* Wyświetlanie loaderów dla nowych przesyłanych obrazów */}
          {imageLoading.filter(img => img.startsWith('temp-')).map((tempImage, index) => (
            <div key={`loader-${index}`} className="relative group">
              <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded shadow-md">
                <span className="loading loading-spinner"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal potwierdzenia usunięcia */}
      {showDeleteModal && imageToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white text-dark p-6 rounded shadow-lg w-96">
            <h2 className="bg-white text-lg mb-4">Czy na pewno chcesz usunąć to zdjęcie?</h2>
            <div className="flex justify-end">
              <button
                className="btn btn-secondary mr-4"
                onClick={closeDeleteModal}
              >
                Anuluj
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  handleDeleteImage(imageToDelete)
                  closeDeleteModal()
                }}
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
