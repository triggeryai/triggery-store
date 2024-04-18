"use client";
import useSWR from 'swr';
import { useState } from 'react';
import toast from 'react-hot-toast'; // Importing toast from react-hot-toast
// Modal Component using Tailwind CSS and DaisyUI
const Modal = ({ onClose, onSubmit, initialCategory = '' }) => {
  const [categoryName, setCategoryName] = useState(initialCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(categoryName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg"
           onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            className="input input-bordered w-full"
          />
          <div className="flex justify-between">
            <button type="submit" className="btn btn-primary">{initialCategory ? 'Update Category' : 'Add Category'}</button>
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

  const handleOpenModal = (category) => {
    console.log("Selected category for editing:", category);
    
    // Set the entire category object for editing
    setCurrentCategory(category); // Teraz currentCategory zawiera cały obiekt, w tym _id
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

  const ConfirmDeleteModal = ({ onClose, onConfirm }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg"
             onClick={(e) => e.stopPropagation()}>
          <div className="text-center">
            <h3 className="mb-4">Are you sure you want to delete this category?</h3>
            <button type="button" className="btn btn-error mr-2" onClick={onConfirm}>Yes, Delete</button>
            <button type="button" className="btn btn-primary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };
  
  const handleAddOrUpdateCategory = async (categoryName) => {
    const method = currentCategory ? 'PUT' : 'POST';
    const url = currentCategory ? `/api/admin/categories/${currentCategory._id}` : '/api/admin/categories';
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryName }),
      });

      if (response.ok) {
        mutate(); // Revalidate categories data
        handleCloseModal(); // Close modal after operation
      } else {
        const result = await response.json();
        alert(result.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('An error occurred while sending the request.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Category deleted successfully');
        mutate();  // Revalidate the SWR cache to update the list
      } else {
        const result = await response.json();
        toast.error(result.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Request failed:', error);
      toast.error('An error occurred while sending the request.');
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <button className="btn btn-primary mb-4" onClick={() => handleOpenModal()}>Add Category</button>
      {isModalOpen && (
        <Modal onClose={handleCloseModal} onSubmit={handleAddOrUpdateCategory} initialCategory={currentCategory} />
      )}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onClose={handleCloseDeleteConfirm}
          onConfirm={() => handleDeleteCategory(categoryToDelete._id)}
        />
      )}
      <ul className="space-y-2">
        {Array.isArray(categories) && categories.map((category) => (
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
    </div>
  );
};

export default CategoriesPage;
