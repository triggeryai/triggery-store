// app/admin/products/Products.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { v4 as uuidv4 } from 'uuid';
import LackProductButton from '@/components/LackProductButton';
import { SearchBox } from '@/components/header/SearchBoxProduct';

export default function Products() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('') // Add state for search query
  const { data: productsData, error: productsError } = useSWR(`/api/admin/products?page=${page}&limit=15`) // No search in initial API call
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
      slug: generateSlug('Sample Product'),
      price: 100.00,
      categoryIds: [categoryId],
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
      if (res.ok) {
        setTimeout(() => {
          toast.success('Product successfully deleted', {
            id: toastId,
          })
          router.refresh()
        }, 1000) // Refresh page after 1 second
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
      const toastId = toast.loading('Creating product...');
      try {
        const productData = await newProductData();  // Add await here
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
  
        toast.success('Product successfully created', {
          id: toastId,
        });
  
        router.push(`/admin/products/${data.product._id}`);
      } catch (error) {
        toast.error('Failed to create product.', {
          id: toastId,
        });
        console.error('Failed to create product:', error);
      }
    }
  );
  

  if (productsError || categoriesError) return <p>Error occurred.</p>
  if (!productsData || !categories) return <p>Loading...</p>

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

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber)
  }

  const getPaginationRange = () => {
    const range = []
    const delta = 2
    const left = Math.max(1, page - delta)
    const right = Math.min(totalPages, page + delta)

    for (let i = left; i <= right; i++) {
      range.push(i)
    }

    if (left > 1) {
      range.unshift(1)
      if (left > 2) {
        range.splice(1, 0, '...')
      }
    }

    if (right < totalPages) {
      range.push(totalPages)
      if (right < totalPages - 1) {
        range.splice(range.length - 1, 0, '...')
      }
    }

    return range
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on new search
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="py-4 text-2xl">Products</h1>
        <LackProductButton /> {/* Add component */}
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

      <SearchBox onSearch={handleSearch} /> {/* Add SearchBox */}
      
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th><div className="badge">id</div></th>
              <th><div className="badge">name</div></th>
              <th><div className="badge">price</div></th>
              <th><div className="badge">categories</div></th>
              <th><div className="badge">count in stock</div></th>
              <th><div className="badge">actions</div></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product: any) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price} PLN</td>
                <td>{product.categories}</td>
                <td>{product.countInStock}</td>
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

      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {getPaginationRange().map((pageNumber, index) =>
            typeof pageNumber === 'number' ? (
              <button
                key={index}
                onClick={() => handlePageClick(pageNumber)}
                className={`px-4 py-2 rounded ${page === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              >
                {pageNumber}
              </button>
            ) : (
              <span key={index} className="px-4 py-2">
                {pageNumber}
              </span>
            )
          )}
        </div>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
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
