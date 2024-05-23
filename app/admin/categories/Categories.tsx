// app\admin\categories\Categories.tsx
"use client";
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // Importing toast from react-hot-toast
// Modal Component using Tailwind CSS and DaisyUI
const Modal = ({ onClose, onSubmit, initialCategory, isEditing }) => {
  // Ustawianie stanu początkowego na podstawie tego, czy edytujemy istniejącą kategorię
  const [category, setCategory] = useState({
    id: isEditing && initialCategory ? initialCategory._id : '',
    name: isEditing && initialCategory ? initialCategory.name : '',
    slug: isEditing && initialCategory ? initialCategory.slug : '',
  });

  // Funkcja do aktualizacji sluga na podstawie nazwy kategorii
  useEffect(() => {
    if (isEditing) {
      function createSlug(name) {
        return name.toLowerCase().replace(/[\s\W-]+/g, '-');
      }
  
      if (category.name) {
        setCategory((prevCategory) => ({
          ...prevCategory,
          slug: createSlug(category.name),
        }));
      }
    }
  }, [category.name, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(category);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg"
           onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditing && (
            <div>
              <label htmlFor="category-id" className="block text-sm font-medium text-gray-700">ID</label>
              <input
                type="text"
                id="category-id"
                value={category.id}
                className="input input-bordered w-full"
                disabled
              />
            </div>
          )}
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="category-name"
              value={category.name}
              onChange={(e) => setCategory({...category, name: e.target.value})}
              placeholder="Category Name"
              className="input input-bordered w-full"
              required
            />
          </div>
          {isEditing && (
            <div>
              <label htmlFor="category-slug" className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                id="category-slug"
                value={category.slug}
                onChange={(e) => setCategory({...category, slug: e.target.value})}
                placeholder="Category Slug"
                className="input input-bordered w-full"
                required
              />
            </div>
          )}
          <div className="flex justify-between">
            <button type="submit" className="btn btn-primary">{isEditing ? 'Update Category' : 'Create Category'}</button>
            <button type="button" className="btn" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// CategoriesPage Component using Tailwind CSS and DaisyUI
const CategoriesPage = () => {
  const { data: categories, error, mutate } = useSWR('/api/admin/categories');
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 15; // Liczba kategorii na stronę, zmień według potrzeb

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories ? categories.slice(indexOfFirstCategory, indexOfLastCategory) : [];

  const handleOpenModal = (category) => {
    setCurrentCategory(category);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenDeleteConfirm = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  const handleAddOrUpdateCategory = async (categoryData) => {
    const method = currentCategory ? 'PUT' : 'POST';
    const url = currentCategory ? `/api/admin/categories/${currentCategory._id}` : '/api/admin/categories';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        toast.success('Category updated successfully');
        mutate();
        handleCloseModal();
      } else if (response.status === 409) {
        toast.error('Slug already exists. Please choose a different slug.');
      } else {
        const result = await response.json();
        toast.error(result.message || 'An error occurred during update');
      }
    } catch (error) {
      console.error('Request failed:', error);
      toast.error('An error occurred while sending the request.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Category deleted successfully');
        mutate(); // Revalidate the SWR cache to update the list
        setShowDeleteConfirm(false); // Zamykaj modal potwierdzenia
        handleCloseModal(); // Zamknij modal edycji/dodawania
      } else {
        const result = await response.json();
        toast.error(result.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Request failed:', error);
      toast.error('An error occurred while sending the request.');
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        toast.success('Category added successfully');
        mutate();
        handleCloseModal();
      } else if (response.status === 409) {
        toast.error('Slug already exists. Please choose a different slug.');
      } else {
        const result = await response.json();
        toast.error(result.message || 'An error occurred while adding the category');
      }
    } catch (error) {
      console.error('Request failed:', error);
      toast.error('An error occurred while sending the request.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <button className="btn btn-primary mb-4" onClick={() => handleOpenModal()}>Add Category</button>
      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          onSubmit={currentCategory ? handleAddOrUpdateCategory : handleAddCategory}
          initialCategory={currentCategory || { name: '', slug: '' }}
          isEditing={!!currentCategory}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onClose={handleCloseDeleteConfirm}
          onConfirm={() => handleDeleteCategory(categoryToDelete._id)}
        />
      )}
      <ul className="space-y-2">
        {Array.isArray(currentCategories) && currentCategories.map((category) => (
          <li key={category._id} className="flex justify-between items-center p-2 bg-base-100 rounded shadow">
            <div>
              <span className="font-bold">ID: </span>{category._id} - <span className="font-semibold">{category.name}</span>
            </div>
            <div>
              <button className="btn btn-xs btn-warning mr-2" onClick={() => handleOpenModal(category)}>Edit</button>
              <button className="btn btn-xs btn-error" onClick={() => handleOpenDeleteConfirm(category)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-center">
        {Array.isArray(categories) && categories.length > categoriesPerPage && (
          <div className="btn-group">
            {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }, (_, index) => (
              <button
                key={index + 1}
                className={`btn ${index + 1 === currentPage ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
