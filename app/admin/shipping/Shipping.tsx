// next-amazona-v2/app/admin/shipping/Shipping.tsx
'use client';
import { useState, useEffect } from 'react';

const Shipping = () => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [newOption, setNewOption] = useState({ value: '', label: '', price: '', width: '', height: '', depth: '', weight: '', isActive: true });
  const [editOption, setEditOption] = useState({ id: '', value: '', label: '', price: '', width: '', height: '', depth: '', weight: '', isActive: true });
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
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
        setNewOption({ value: '', label: '', price: '', width: '', height: '', depth: '', weight: '', isActive: true });
      } else {
        console.error('Błąd podczas dodawania opcji wysyłki:', response.statusText);
      }
    } catch (error) {
      console.error('Błąd podczas dodawania opcji wysyłki:', error);
    }
  };

  const handleEditOption = async () => {
    try {
      const response = await fetch(`/api/admin/shipping/${editOption.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: editOption.value,
          label: editOption.label,
          price: editOption.price,
          width: editOption.width,
          height: editOption.height,
          depth: editOption.depth,
          weight: editOption.weight, // Dodanie pola dla wagi
          isActive: editOption.isActive,
        }),
      });
      if (response.ok) {
        const updatedOption = await response.json();
        setShippingOptions(shippingOptions.map(option =>
          option._id === updatedOption._id ? updatedOption : option
        ));
        setEditOption({ id: '', value: '', label: '', price: '', width: '', height: '', depth: '', weight: '', isActive: true });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Opcje Wysyłki</h1>
      <div className="shadow-md rounded p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Dodaj Nową Opcję</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Wartość</label>
            <input
              type="text"
              name="value"
              value={newOption.value}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Etykieta</label>
            <input
              type="text"
              name="label"
              value={newOption.label}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cena</label>
            <input
              type="number"
              name="price"
              value={newOption.price}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Szerokość (cm)</label>
            <input
              type="number"
              name="width"
              value={newOption.width}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Wysokość (cm)</label>
            <input
              type="number"
              name="height"
              value={newOption.height}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Głębokość (cm)</label>
            <input
              type="number"
              name="depth"
              value={newOption.depth}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Waga (kg)</label>
            <input
              type="number"
              name="weight"
              value={newOption.weight}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isActive"
              checked={newOption.isActive}
              onChange={handleChange}
              className="checkbox"
            />
            <span>Aktywne</span>
          </div>
        </div>
        <button onClick={handleAddOption} className="btn btn-primary mt-4">Dodaj</button>
      </div>

      {editOption.id && (
        <div className="shadow-md rounded p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Edytuj Opcję</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Wartość</label>
              <input
                type="text"
                name="value"
                value={editOption.value}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Etykieta</label>
              <input
                type="text"
                name="label"
                value={editOption.label}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cena</label>
              <input
                type="number"
                name="price"
                value={editOption.price}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Szerokość (cm)</label>
              <input
                type="number"
                name="width"
                value={editOption.width}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Wysokość (cm)</label>
              <input
                type="number"
                name="height"
                value={editOption.height}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Głębokość (cm)</label>
              <input
                type="number"
                name="depth"
                value={editOption.depth}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Waga (kg)</label>
              <input
                type="number"
                name="weight"
                value={editOption.weight}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={editOption.isActive}
                onChange={handleEditChange}
                className="checkbox"
              />
              <span>Aktywne</span>
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button onClick={handleEditOption} className="btn btn-primary">Zapisz</button>
            <button onClick={() => setEditOption({ id: '', value: '', label: '', price: '', width: '', height: '', depth: '', weight: '', isActive: true })} className="btn btn-secondary">Anuluj</button>
          </div>
        </div>
      )}

      <div className="shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Aktualne Opcje Wysyłki</h2>
        <ul className="space-y-4">
          {shippingOptions.map(option => (
            <li key={option._id} className="flex justify-between items-center p-4 rounded">
              <div>
                <span className="font-semibold">{option.label}</span> - ${option.price}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setEditOption({ id: option._id, value: option.value, label: option.label, price: option.price, width: option.width, height: option.height, depth: option.depth, weight: option.weight, isActive: option.isActive })} className="btn btn-info btn-sm">Edytuj</button>
                <button onClick={() => handleDeleteOption(option._id)} className="btn btn-error btn-sm">Usuń</button>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={option.isActive}
                    onChange={(e) => {
                      const updatedOption = { ...option, isActive: e.target.checked };
                      setEditOption(updatedOption);
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
