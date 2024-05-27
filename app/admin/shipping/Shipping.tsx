// app\admin\shipping\Shipping.tsx
'use client'
import { useState, useEffect } from 'react';

const defaultShippingOptions = [
  { value: "Inpost Paczkomat", label: "Inpost Paczkomat - $5", price: 5, isActive: true },
  { value: "Pocztex Poczta Polska Kurier", label: "Pocztex Poczta Kurier - $7", price: 7, isActive: true },
  { value: "Pocztex Poczta Odbior Punkt", label: "Pocztex Poczta Odbior Punkt - $7", price: 7, isActive: true },
  { value: "Inpost Kurier", label: "Inpost Kurier - $10", price: 10, isActive: true },
  { value: "DPD Kurier", label: "DPD Kurier - $12", price: 12, isActive: true },
  { value: "DHL Kurier", label: "DHL Kurier - $15", price: 15, isActive: true },
  { value: "Odbior osobisty", label: "Odbior osobisty - $0", price: 0, isActive: true },
];

const Shipping = () => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [newOption, setNewOption] = useState({ value: '', label: '', price: '', isActive: true });
  const [editOption, setEditOption] = useState({ id: '', value: '', label: '', price: '', isActive: true });

  useEffect(() => {
    fetchShippingOptions();
  }, []);

  const fetchShippingOptions = async () => {
    try {
      const response = await fetch('/api/admin/shipping');
      if (response.ok) {
        const data = await response.json();
        setShippingOptions(data);
      } else {
        console.error('Error fetching shipping options:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching shipping options:', error);
    }
  };

  const handleAddOption = async () => {
    try {
      const response = await fetch('/api/admin/shipping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOption),
      });
      if (response.ok) {
        const data = await response.json();
        setShippingOptions([...shippingOptions, data]);
        setNewOption({ value: '', label: '', price: '', isActive: true });
      } else {
        console.error('Error adding shipping option:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding shipping option:', error);
    }
  };

  const handleDeleteOption = async (id) => {
    try {
      const response = await fetch('/api/admin/shipping', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setShippingOptions(shippingOptions.filter(option => option._id !== id));
      } else {
        console.error('Error deleting shipping option:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting shipping option:', error);
    }
  };

  const handleEditOption = async () => {
    try {
      const response = await fetch(`/api/admin/shipping/${editOption.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: editOption.value, label: editOption.label, price: editOption.price, isActive: editOption.isActive }),
      });
      if (response.ok) {
        const updatedOption = await response.json();
        setShippingOptions(shippingOptions.map(option => 
          option._id === updatedOption._id ? updatedOption : option
        ));
        setEditOption({ id: '', value: '', label: '', price: '', isActive: true });
      } else {
        console.error('Error editing shipping option:', response.statusText);
      }
    } catch (error) {
      console.error('Error editing shipping option:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewOption({ ...newOption, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditOption({ ...editOption, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div>
      <h1>Shipping Options</h1>
      <ul>
        {shippingOptions.map(option => (
          <li key={option._id}>
            {option.label} - ${option.price}
            <button onClick={() => handleDeleteOption(option._id)}>Delete</button>
            <button onClick={() => setEditOption({ id: option._id, value: option.value, label: option.label, price: option.price, isActive: option.isActive })}>Edit</button>
            <label>
              <input
                type="checkbox"
                checked={option.isActive}
                onChange={(e) => {
                  setEditOption({ id: option._id, value: option.value, label: option.label, price: option.price, isActive: e.target.checked });
                  handleEditOption();
                }}
              />
              Active
            </label>
          </li>
        ))}
      </ul>
      {editOption.id && (
        <div>
          <h2>Edit Option</h2>
          <input
            type="text"
            name="value"
            placeholder="Value"
            value={editOption.value}
            onChange={handleEditChange}
          />
          <input
            type="text"
            name="label"
            placeholder="Label"
            value={editOption.label}
            onChange={handleEditChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={editOption.price}
            onChange={handleEditChange}
          />
          <button onClick={handleEditOption}>Save</button>
          <button onClick={() => setEditOption({ id: '', value: '', label: '', price: '', isActive: true })}>Cancel</button>
        </div>
      )}
      <h2>Add New Option</h2>
      <input
        type="text"
        name="value"
        placeholder="Value"
        value={newOption.value}
        onChange={handleChange}
      />
      <input
        type="text"
        name="label"
        placeholder="Label"
        value={newOption.label}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={newOption.price}
        onChange={handleChange}
      />
      <label>
        <input
          type="checkbox"
          name="isActive"
          checked={newOption.isActive}
          onChange={handleChange}
        />
        Active
      </label>
      <button onClick={handleAddOption}>Add</button>
    </div>
  );
};

export default Shipping;
