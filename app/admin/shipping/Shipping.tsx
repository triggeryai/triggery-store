// app/admin/shipping/Shipping.tsx
'use client';
import { useState, useEffect } from 'react';

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
        console.error('Błąd podczas pobierania opcji wysyłki:', response.statusText);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania opcji wysyłki:', error);
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
        console.error('Błąd podczas dodawania opcji wysyłki:', response.statusText);
      }
    } catch (error) {
      console.error('Błąd podczas dodawania opcji wysyłki:', error);
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
        console.error('Błąd podczas usuwania opcji wysyłki:', response.statusText);
      }
    } catch (error) {
      console.error('Błąd podczas usuwania opcji wysyłki:', error);
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
        console.error('Błąd podczas edytowania opcji wysyłki:', response.statusText);
      }
    } catch (error) {
      console.error('Błąd podczas edytowania opcji wysyłki:', error);
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Opcje Wysyłki</h1>
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Dodaj Nową Opcję</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="value"
            placeholder="Wartość"
            value={newOption.value}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="label"
            placeholder="Etykieta"
            value={newOption.label}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            type="number"
            name="price"
            placeholder="Cena"
            value={newOption.price}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isActive"
              checked={newOption.isActive}
              onChange={handleChange}
              className="checkbox"
            />
            <span>Aktywne</span>
          </label>
        </div>
        <button onClick={handleAddOption} className="btn btn-primary mt-4">Dodaj</button>
      </div>

      {editOption.id && (
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Edytuj Opcję</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="value"
              placeholder="Wartość"
              value={editOption.value}
              onChange={handleEditChange}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="label"
              placeholder="Etykieta"
              value={editOption.label}
              onChange={handleEditChange}
              className="input input-bordered w-full"
            />
            <input
              type="number"
              name="price"
              placeholder="Cena"
              value={editOption.price}
              onChange={handleEditChange}
              className="input input-bordered w-full"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={editOption.isActive}
                onChange={(e) => {
                  setEditOption({ ...editOption, isActive: e.target.checked });
                  handleEditOption();
                }}
                className="checkbox"
              />
              <span>Aktywne</span>
            </label>
          </div>
          <div className="flex space-x-2 mt-4">
            <button onClick={handleEditOption} className="btn btn-primary">Zapisz</button>
            <button onClick={() => setEditOption({ id: '', value: '', label: '', price: '', isActive: true })} className="btn btn-secondary">Anuluj</button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Aktualne Opcje Wysyłki</h2>
        <ul className="space-y-4">
          {shippingOptions.map(option => (
            <li key={option._id} className="flex justify-between items-center bg-gray-100 p-4 rounded">
              <div>
                <span className="font-semibold">{option.label}</span> - ${option.price}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setEditOption({ id: option._id, value: option.value, label: option.label, price: option.price, isActive: option.isActive })} className="btn btn-info btn-sm">Edytuj</button>
                <button onClick={() => handleDeleteOption(option._id)} className="btn btn-error btn-sm">Usuń</button>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={option.isActive}
                    onChange={(e) => {
                      setEditOption({ ...option, isActive: e.target.checked });
                      handleEditOption();
                    }}
                    className="checkbox"
                  />
                  <span>Aktywne</span>
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Shipping;
