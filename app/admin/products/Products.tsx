'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { v4 as uuidv4 } from 'uuid';
import LackProductButton from '@/components/LackProductButton';
import { SearchBox } from '@/components/header/SearchBoxProduct';
import { FaSyncAlt } from 'react-icons/fa';

export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const editedProductId = searchParams.get('editedProductId');
  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaginationModalOpen, setPaginationModalOpen] = useState(false);
  const [goToPage, setGoToPage] = useState<number | string>(''); // Stan do wpisania numeru strony

  const { data: productsData, error: productsError, mutate: mutateProducts } = useSWR(`/api/admin/products?page=${page}&limit=15&search=${searchQuery}`);
  const { data: categories, error: categoriesError, mutate: mutateCategories } = useSWR(`/api/admin/categories`);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const generateSlug = (name) => `${name.toLowerCase().replace(/ /g, '-')}-${uuidv4()}`;

  const getRandomCategory = () => {
    if (!categories || categories.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex]._id;
  };

  const createDefaultCategory = async () => {
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Sample Category' }),
    });
    const newCategory = await response.json();
    mutateCategories([...categories, newCategory], false);
    return newCategory._id;
  };

  const newProductData = async () => {
    let categoryId = getRandomCategory();
    if (!categoryId) {
      categoryId = await createDefaultCategory();
    }
    return {
      name: 'Sample Product Name',
      slug: generateSlug('Sample Product'),
      price: 100.00,
      categoryIds: [categoryId],
      image: '/images/default-product.jpg',
      brand: 'Sample Brand',
      countInStock: 0,
      description: 'Sample product description',
      width: 0,
      height: 0,
      depth: 0,
      weight: 0,
    };
  };

  const { trigger: deleteProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading('Deleting product...');
      const res = await fetch(`${url}/${arg.productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setShowModal(false);
      if (res.ok) {
        setTimeout(() => {
          toast.success('Product successfully deleted', {
            id: toastId,
          });
          router.push(`/admin/products?page=${page}`);
        }, 1000);
      } else {
        toast.error(data.message, {
          id: toastId,
        });
      }
    }
  );

  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url) => {
      const toastId = toast.loading('Creating product...');
      try {
        const productData = await newProductData();
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
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

        router.push(`/admin/products?page=${page}`);
      } catch (error) {
        toast.error('Failed to create product.', {
          id: toastId,
        });
        console.error('Failed to create product:', error);
      }
    }
  );

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct({ productId: productToDelete });
    }
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setShowModal(true);
  };

  const handleProductEdit = (productId) => {
    router.push(`/admin/products/${productId}?page=${page}&editedProductId=${productId}`);
  };

  // Zamieniamy tekst "Ładowanie..." na ładny spinner
  if (productsError || categoriesError) return <p>Error occurred.</p>;
  if (!productsData || !categories)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );

  const { products, totalPages } = productsData;

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
    router.push(`/admin/products?page=${page - 1}`);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
    router.push(`/admin/products?page=${page + 1}`);
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
    router.push(`/admin/products?page=${pageNumber}`);
  };

  const handleGoToPage = () => {
    const targetPage = Number(goToPage);
    if (targetPage > 0 && targetPage <= totalPages) {
      setPage(targetPage);
      router.push(`/admin/products?page=${targetPage}`);
    } else {
      toast.error('Invalid page number');
    }
  };

  const handleOpenPaginationModal = () => {
    setPaginationModalOpen(true);
  };

  const handleClosePaginationModal = () => {
    setPaginationModalOpen(false);
  };

  const getPaginationRange = () => {
    const range = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (left > 1) {
      range.unshift(1);
      if (left > 2) {
        range.splice(1, 0, '...');
      }
    }

    if (right < totalPages) {
      range.push(totalPages);
      if (right < totalPages - 1) {
        range.splice(range.length - 1, 0, '...');
      }
    }

    return range;
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    router.push(`/admin/products?page=1&search=${query}`);
  };

  // Nowy przycisk odświeżania
  const handleRefresh = () => {
    mutateProducts(); // Odświeżanie komponentu
    toast.success('Lista produktów została odświeżona');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="py-4 text-2xl">Products</h1>
        <LackProductButton />
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

      <div className="flex items-center space-x-2">
        <SearchBox onSearch={handleSearch} />
        <button onClick={handleRefresh} className="btn btn-outline btn-sm">
          <FaSyncAlt className="mr-2" /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse hidden md:table">
          <thead>
            <tr>
              <th className="border px-4 py-2">Thumbnail</th>
              <th className="border px-4 py-2"><div className="badge">id</div></th>
              <th className="border px-4 py-2"><div className="badge">name</div></th>
              <th className="border px-4 py-2"><div className="badge">slug</div></th>
              <th className="border px-4 py-2"><div className="badge">price</div></th>
              <th className="border px-4 py-2"><div className="badge">categories</div></th>
              <th className="border px-4 py-2"><div className="badge">count in stock</div></th>
              <th className="border px-4 py-2"><div className="badge">width</div></th>
              <th className="border px-4 py-2"><div className="badge">height</div></th>
              <th className="border px-4 py-2"><div className="badge">depth</div></th>
              <th className="border px-4 py-2"><div className="badge">weight</div></th>
              <th className="border px-4 py-2"><div className="badge">actions</div></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product._id} className={product._id === editedProductId ? 'bg-yellow-100' : ''}>
<td className="border px-4 py-2">
  {product.mainImage ? (
    product.mainImage.startsWith("http") ? (
      <img src={product.mainImage} alt={product.name} className="h-16 w-16 object-cover" />
    ) : (
      <img
        src={`/products/${product.mainImage}`}
        alt={product.name}
        className="h-16 w-16 object-cover"
      />
    )
  ) : (
    <span>Brak zdjęcia</span>
  )}
</td>

                <td className="border px-4 py-2">{product._id}</td>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.slug}</td>
                <td className="border px-4 py-2">{product.price} PLN</td>
                <td className="border px-4 py-2">{product.categories}</td>
                <td className="border px-4 py-2">{product.countInStock}</td>
                <td className="border px-4 py-2">{product.width} cm</td>
                <td className="border px-4 py-2">{product.height} cm</td>
                <td className="border px-4 py-2">{product.depth} cm</td>
                <td className="border px-4 py-2">{product.weight} kg</td>
                <td className="border px-4 py-2">
                  <button 
                    type="button" 
                    className="btn btn-info btn-sm"
                    onClick={() => handleProductEdit(product._id)}
                  >
                    Edit
                  </button>
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

      {/* Pagination with input and modal */}
      <div className="flex justify-center items-center mt-4 space-x-2 flex-wrap">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-blue-500 text-white py-1 px-3 sm:py-2 sm:px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {getPaginationRange().map((pageNumber, index) =>
          typeof pageNumber === 'number' ? (
            <button
              key={index}
              onClick={() => handlePageClick(pageNumber)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded ${page === pageNumber ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}`}
            >
              {pageNumber}
            </button>
          ) : (
            <span key={index} className="px-3 py-1 sm:px-4 sm:py-2">
              {pageNumber}
            </span>
          )
        )}
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-blue-500 text-white py-1 px-3 sm:py-2 sm:px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
        
        {/* Input for go to page */}
        <input
          type="number"
          value={goToPage}
          onChange={(e) => setGoToPage(e.target.value)}
          placeholder="Go to page"
          className="input input-bordered w-24 text-center"
        />
        <button onClick={handleGoToPage} className="btn btn-primary">
          Go
        </button>
        <button onClick={handleOpenPaginationModal} className="btn btn-secondary">
          Show All Pages
        </button>
      </div>

      {/* Modal with full pagination */}
      {isPaginationModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Select a Page</h3>
            <div className="grid grid-cols-5 gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => {
                    handlePageClick(pageNumber);
                    handleClosePaginationModal();
                  }}
                  className={`btn btn-sm ${pageNumber === page ? 'btn-primary' : 'btn-outline'}`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <div className="modal-action">
              <button onClick={handleClosePaginationModal} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
  );
}
