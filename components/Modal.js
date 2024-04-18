// components/Modal.js
"use client"
import React, { useState } from 'react';

const Modal = ({ onClose, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCategory(categoryName);
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
        <button type="submit">Add Category</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default Modal;
