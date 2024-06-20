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
        <button type="submit">Dodaj kategorie</button>
        <button type="button" onClick={onClose}>Zamknnij</button>
      </form>
    </div>
  );
};

export default Modal;
