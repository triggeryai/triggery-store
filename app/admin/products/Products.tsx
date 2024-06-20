// app\admin\products\Products.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { v4 as uuidv4 } from 'uuid';
import LackProductButton from '@/components/LackProductButton';

export default function Products() {
  const [page, setPage] = useState(1)
  const { data: productsData, error: productsError } = useSWR(`/api/admin/products?page=${page}&limit=15`)
  const { data: categories, error: categoriesError, mutate: mutateCategories } = useSWR(`/api/admin/categories`)
  const [showModal, setShowModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const router = useRouter()

  const generateSlug = (name) => `${name.toLowerCase().replace(/ /g, '-')}-${uuidv4()}`;

  const getRandomCategory = () => {
    if (!categories || categories.length === 0) {
      return null; // Return null if no categories exist
    }
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex]._id;
  };

  const createDefaultCategory = async () => {
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: 'Przykładowa Kategoria' })
    });
    const newCategory = await response.json();
    mutateCategories([...categories, newCategory], false); // Update SWR cache without re-fetching
    return newCategory._id;
  };

  const newProductData = async () => {
    let categoryId = getRandomCategory();
    if (!categoryId) {
      categoryId = await createDefaultCategory(); // Create a default category if none exist
    }
    return {
      name: 'Przykładowa Nazwa Produktu',
      slug: generateSlug('Przykładowa Nazwa Produktu'),
      price: 100.00,
      categoryId,
      image: '/images/default-product.jpg',
      brand: 'Przykładowa Marka',
      countInStock: 0,
      description: 'Przykładowy opis produktu'
    };
  };

  const { trigger: deleteProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading('Usuwanie produktu...')
      const res = await fetch(`${url}/${arg.productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      setShowModal(false) // Hide modal after operation
      if (res.ok) {
        setTimeout(() => {
          toast.success('Produkt pomyślnie usunięty', {
            id: toastId,
          })
          router.refresh()
        }, 1000) // Odświeżenie strony po 1 sekundzie
      } else {
        toast.error(data.message, {
          id: toastId,
        })
      }
    }
  )

  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url) => {
      const toastId = toast.loading('Tworzenie produktu...');
      try {
        const productData = await newProductData();  // Dodaj await tutaj
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          toast.error(data.message, {
            id: toastId,
          });
          return;
        }
  
        toast.success('Produkt pomyślnie utworzony', {
          id: toastId,
        });
  
        router.push(`/admin/products/${data.product._id}`);
      } catch (error) {
        toast.error('Nie udało się utworzyć produktu.', {
          id: toastId,
        });
        console.error('Nie udało się utworzyć produktu:', error);
      }
    }
  );

  if (productsError || categoriesError) return <p>Wystąpił błąd.</p>
  if (!productsData || !categories) return <p>Ładowanie...</p>

  const { products, totalPages } = productsData

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setShowModal(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct({ productId: productToDelete })
    }
  }

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="py-4 text-2xl">Produkty</h1>
        <LackProductButton /> {/* Dodanie komponentu */}
        <button
          disabled={isCreating}
          onClick={() => createProduct()}
          className="btn btn-primary btn-sm"
        >
          {isCreating ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Utwórz"
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th><div className="badge">id</div></th>
              <th><div className="badge">nazwa</div></th>
              <th><div className="badge">cena</div></th>
              <th><div className="badge">kategoria</div></th>
              <th><div className="badge">ilość w magazynie</div></th>
              <th><div className="badge">akcje</div></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.countInStock}</td>
                <td>
                  <Link href={`/admin/products/${product._id}`}>
                    <button type="button" className="btn btn-info btn-sm">
                      Edytuj
                    </button>
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => handleDeleteClick(product._id)}
                    type="button"
                    className="btn btn-error btn-sm"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Poprzednia
        </button>
        <span className="text-gray-700">Strona {page} z {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Następna
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Czy na pewno chcesz usunąć ten produkt?</h3>
            <div className="modal-action">
              <button onClick={confirmDelete} className="btn btn-error">
                Tak
              </button>
              <button onClick={() => setShowModal(false)} className="btn">
                Nie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
