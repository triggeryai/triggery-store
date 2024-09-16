// next-amazona-v2/app/admin/discounts/Discounts.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

// Typ rabatu
type Discount = {
  _id?: string;
  type: string; // "fixed" lub "free_shipping"
  value: number;
  isActive: boolean;
  users: string[] | 'all';
  expirationDate?: string;
  code?: string; // Kod rabatowy
};

// Typ użytkownika
type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
};

const Discounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(false); // Zmienna dla wyboru wszystkich użytkowników
  const { register, handleSubmit, reset, setValue } = useForm<Discount>();

  // Pobieranie rabatów z API
  const fetchDiscounts = async () => {
    try {
      const res = await fetch('/api/admin/discounts', { method: 'GET' });
      const data = await res.json();
      setDiscounts(data);
    } catch (err) {
      toast.error('Błąd podczas ładowania rabatów');
    }
  };

  // Pobieranie użytkowników z API
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { method: 'GET' });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error('Błąd podczas ładowania użytkowników');
    }
  };

  // Inicjalne ładowanie rabatów i użytkowników
  useEffect(() => {
    fetchDiscounts();
    fetchUsers();
  }, []);

  // Dodawanie nowego rabatu
  const onSubmit = async (formData: Discount) => {
    formData.users = selectedUsers.length > 0 ? selectedUsers.map((user) => user._id) : 'all';
  
    try {
      const method = isEditing ? 'PATCH' : 'POST';
      const url = isEditing ? `/api/admin/discounts/${isEditing}` : '/api/admin/discounts';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (res.ok) {
        toast.success(`Rabat ${isEditing ? 'zaktualizowany' : 'dodany'} pomyślnie`);
        fetchDiscounts();
        reset();
        setIsEditing(null);
        setSelectedUsers([]);
      } else {
        toast.error('Błąd podczas zapisywania rabatu');
      }
    } catch (err) {
      toast.error('Błąd podczas zapisywania rabatu');
    }
  };

  // Usuwanie rabatu
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success('Rabat usunięty');
        fetchDiscounts();
      } else {
        toast.error('Błąd podczas usuwania rabatu');
      }
    } catch (err) {
      toast.error('Błąd podczas usuwania rabatu');
    }
  };

  // Edytowanie rabatu
  const handleEdit = (discount: Discount) => {
    setIsEditing(discount._id!);
    setValue('type', discount.type);
    setValue('value', discount.value);
    setValue('isActive', discount.isActive);
    setValue('expirationDate', discount.expirationDate || '');
    setValue('code', discount.code || '');
    setSelectedUsers(discount.users === 'all' ? [] : users.filter((user) => discount.users.includes(user._id)));
  };

  // Otwarcie modala do wyboru użytkowników
  const openUserModal = () => {
    setShowModal(true);
  };

  // Zatwierdzenie wyboru użytkowników
  const handleSelectUsers = () => {
    setShowModal(false);
  };

  // Aktualizacja zaznaczonych użytkowników
  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  // Funkcja zaznaczania wszystkich użytkowników
  const handleSelectAllUsers = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users);
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6">Zarządzaj Rabatami</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="text-lg font-semibold">Typ rabatu</label>
          <select {...register('type', { required: true })} className="input input-bordered w-full mt-1 text-base">
            <option value="fixed">Kwotowy</option>
            <option value="free_shipping">Darmowa wysyłka</option>
          </select>
        </div>

        <div>
          <label className="text-lg font-semibold">Wartość rabatu (w zł lub 0 dla darmowej wysyłki)</label>
          <input
            type="number"
            {...register('value', { required: true })}
            className="input input-bordered w-full mt-1 text-base"
          />
        </div>

        <div>
          <label className="text-lg font-semibold">Kod rabatowy (opcjonalnie)</label>
          <input
            type="text"
            {...register('code')}
            className="input input-bordered w-full mt-1 text-base"
          />
        </div>

        <div>
          <label className="text-lg font-semibold">Czy rabat jest aktywny?</label>
          <input type="checkbox" {...register('isActive')} className="ml-3" />
        </div>

        <div>
          <label className="text-lg font-semibold">Użytkownicy</label>
          <input
            type="text"
            value={selectedUsers.length > 0 ? selectedUsers.map((u) => u.name).join(', ') : ''}
            placeholder="Wybierz użytkowników"
            readOnly
            className="input input-bordered w-full mt-1 text-base"
          />
          <button
            type="button"
            className="btn btn-secondary mt-2 w-full"
            onClick={openUserModal}
          >
            Przeglądaj
          </button>
        </div>

        <div>
          <label className="text-lg font-semibold">Data wygaśnięcia (opcjonalnie)</label>
          <input type="date" {...register('expirationDate')} className="input input-bordered w-full mt-1 text-base" />
        </div>

        <button type="submit" className="btn btn-primary w-full py-2 text-lg">
          {isEditing ? 'Zaktualizuj' : 'Dodaj'} rabat
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-12">Lista rabatów</h2>
      <ul className="mt-4 space-y-4 max-h-96 overflow-y-auto">
        {discounts.slice(0, 5).map((discount) => (
          <li
            key={discount._id}
            className="flex justify-between items-center border-b pb-4"
          >
            <div>
              <strong className="text-lg">
                {discount.type === 'fixed'
                  ? `Rabat: ${discount.value} zł`
                  : 'Darmowa wysyłka'}
              </strong>
              <span> – {discount.isActive ? 'Aktywny' : 'Nieaktywny'}</span>
              <p>Kod: {discount.code || 'Brak'}</p>
              <p>
                Użytkownicy:{' '}
                {discount.users === 'all'
                  ? 'Wszyscy'
                  : users
                      .filter((user) =>
                        discount.users.includes(user._id)
                      )
                      .map((u) => u.name)
                      .join(', ')}
              </p>
              {discount.expirationDate && (
                <p>
                  Ważny do:{' '}
                  {new Date(discount.expirationDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(discount)}
                className="btn btn-sm btn-info"
              >
                Edytuj
              </button>
              <button
                onClick={() => handleDelete(discount._id!)}
                className="btn btn-sm btn-danger"
              >
                Usuń
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal z listą użytkowników */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Wybierz użytkowników</h3>
            <button
              className="btn btn-sm btn-secondary mb-2"
              onClick={handleSelectAllUsers}
            >
              {selectAll ? 'Odznacz wszystkich' : 'Zaznacz wszystkich'}
            </button>
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center"
                >
                  <span>{user.name}</span>
                  <input
                    type="checkbox"
                    checked={selectedUsers.some((u) => u._id === user._id)}
                    onChange={() => toggleUserSelection(user)}
                  />
                </li>
              ))}
            </ul>
            <button
              className="btn btn-primary mt-4 w-full"
              onClick={handleSelectUsers}
            >
              Zatwierdź
            </button>
            <button
              className="btn btn-secondary mt-2 w-full"
              onClick={() => setShowModal(false)}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discounts;
