// app\admin\products\Products.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { v4 as uuidv4 } from 'uuid';

export default function Products() {
  const { data: products, error: productsError } = useSWR(`/api/admin/products`)
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
      body: JSON.stringify({ name: 'Sample Category' })
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
      name: 'Sample Product Name',
      slug: generateSlug('Sample Product Name'),
      price: 100.00,
      categoryId,
      image: '/images/default-product.jpg',
      brand: 'Sample Brand',
      countInStock: 0,
      description: 'Sample product description'
    };
  };


  const { trigger: deleteProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading('Deleting product...')
      const res = await fetch(`${url}/${arg.productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      setShowModal(false) // Hide modal after operation
      res.ok
        ? toast.success('Product deleted successfully', {
            id: toastId,
          })
        : toast.error(data.message, {
            id: toastId,
          })
      // Refetch products after deletion
      // if (res.ok) router.replace(router.asPath)
    }
  )
  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url) => {
      const toastId = toast.loading('Creating product...');
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
  
        toast.success('Product created successfully', {
          id: toastId,
        });
  
        router.push(`/admin/products/${data.product._id}`);
      } catch (error) {
        toast.error('Failed to create the product.', {
          id: toastId,
        });
        console.error('Failed to create product:', error);
      }
    }
  );
  

  if (productsError || categoriesError) return <p>An error has occurred.</p>
  if (!products || !categories) return <p>Loading...</p>


  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setShowModal(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct({ productId: productToDelete })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="py-4 text-2xl">Products</h1>
        <button
          disabled={isCreating}
          onClick={() => createProduct()}
          className="btn btn-primary btn-sm"
        >
          {isCreating ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Create"
          )}
    </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th><div className="badge">id</div></th>
              <th><div className="badge">name</div></th>
              <th><div className="badge">price</div></th>
              <th><div className="badge">category</div></th>
              <th><div className="badge">count in stock</div></th>
             {/*} <th><div className="badge">rating</div></th> */}
              <th><div className="badge">actions</div></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.countInStock}</td>
                {/*<td>{product.rating}</td> */}
                <td>
                  <Link href={`/admin/products/${product._id}`}>
                  <button type="button" className="btn btn-info btn-sm">
                   Edit
                  </button>
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => handleDeleteClick(product._id)}
                    type="button"
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure you want to delete this product?</h3>
            <div className="modal-action">
              <button onClick={confirmDelete} className="btn btn-error">
                Yes
              </button>
              <button onClick={() => setShowModal(false)} className="btn">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
