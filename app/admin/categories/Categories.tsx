// next-amazona-v2/app/admin/categories/Categories.tsx
"use client";
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Modal = ({ onClose, onSubmit, initialCategory, isEditing }) => {
  const [category, setCategory] = useState({
    id: isEditing && initialCategory ? initialCategory._id : '',
    name: isEditing && initialCategory ? initialCategory.name : '',
    slug: isEditing && initialCategory ? initialCategory.slug : '',
  });

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
    <div className="fixed inset-0 bg-base-100 bg-opacity-50 z-50" onClick={onClose}>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-100 p-5 rounded-lg shadow-lg"
           onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditing && (
            <div>
              <label htmlFor="category-id" className="block text-sm font-medium">ID</label>
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
            <label htmlFor="category-name" className="block text-sm font-medium">Nazwa</label>
            <input
              type="text"
              id="category-name"
              value={category.name}
              onChange={(e) => setCategory({...category, name: e.target.value})}
              placeholder="Nazwa kategorii"
              className="input input-bordered w-full"
              required
            />
          </div>
          {isEditing && (
            <div>
              <label htmlFor="category-slug" className="block text-sm font-medium">Slug</label>
              <input
                type="text"
                id="category-slug"
                value={category.slug}
                onChange={(e) => setCategory({...category, slug: e.target.value})}
                placeholder="Slug kategorii"
                className="input input-bordered w-full"
                required
              />
            </div>
          )}
          <div className="flex justify-between">
            <button type="submit" className="btn btn-primary">{isEditing ? 'Zaktualizuj kategorię' : 'Utwórz kategorię'}</button>
            <button type="button" className="btn" onClick={onClose}>Zamknij</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-base-200 z-50 bg-opacity-150" onClick={onClose}>
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-opacity-150 bg-base-200 rounded-lg shadow-lg"
         onClick={(e) => e.stopPropagation()}>
      <h3 className="font-bold text-lg">Czy na pewno chcesz usunąć tę kategorię?</h3>
      <div className="modal-action">
        <button onClick={onConfirm} className="btn btn-error">Tak</button>
        <button onClick={onClose} className="btn">Nie</button>
      </div>
    </div>
  </div>
);

const CategoriesPage = () => {
  const { data: categories, error, mutate } = useSWR('/api/admin/categories');
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 15;

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
        toast.success('Kategoria pomyślnie zaktualizowana');
        mutate();
        handleCloseModal();
      } else if (response.status === 409) {
        toast.error('Slug już istnieje. Proszę wybrać inny slug.');
      } else {
        const result = await response.json();
        toast.error(result.message || 'Wystąpił błąd podczas aktualizacji');
      }
    } catch (error) {
      console.error('Request failed:', error);
      toast.error('Wystąpił błąd podczas wysyłania żądania.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Kategoria pomyślnie usunięta');
        mutate();
        setShowDeleteConfirm(false);
        handleCloseModal();
      } else {
        const result = await response.json();
        toast.error(result.message || 'Nie udało się usunąć kategorii');
      }
    } catch (error) {
      console.error('Request failed:', error);
      toast.error('Wystąpił błąd podczas wysyłania żądania.');
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
        toast.success('Kategoria pomyślnie dodana');
        mutate();
        handleCloseModal();
      } else if (response.status === 409) {
        toast.error('Slug już istnieje. Proszę wybrać inny slug.');
      } else {
        const result = await response.json();
        toast.error(result.message || 'Wystąpił błąd podczas dodawania kategorii');
      }
    } catch (error) {
      console.error('Request failed:', error);
      toast.error('Wystąpił błąd podczas wysyłania żądania.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Dodajemy spinner zamiast "Ładowanie..." 
  if (error) return <p>Wystąpił błąd.</p>;
  if (!categories)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <button className="btn btn-primary mb-4" onClick={() => handleOpenModal()}>Dodaj kategorię</button>
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
              <button className="btn btn-xs btn-warning mr-2" onClick={() => handleOpenModal(category)}>Edytuj</button>
              <button className="btn btn-xs btn-error" onClick={() => handleOpenDeleteConfirm(category)}>Usuń</button>
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
