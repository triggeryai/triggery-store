// app\admin\users\Users.tsx
'use client';
import UserModel from '@/lib/models/UserModel';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

// Confirmation Modal component
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md shadow-xl">
        <h4 className="text-lg mb-4">Czy na pewno chcesz usunąć tego użytkownika?</h4>
        <div className="flex justify-end">
          <button onClick={onClose} className="btn btn-secondary mr-2">
            Nie
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            Tak
          </button>
        </div>
      </div>
    </div>
  );
};

// Add User Modal component
const AddUserModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false,
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md shadow-xl">
        <h4 className="text-lg mb-4">Dodaj nowego użytkownika</h4>
        <form onSubmit={handleSubmit}>
          <div className="my-3">
            <label className="block">Nazwa</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full max-w-md"
              required
            />
          </div>
          <div className="my-3">
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full max-w-md"
              required
            />
          </div>
          <div className="my-3">
            <label className="block">Hasło</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full max-w-md"
              required
            />
          </div>
          <div className="my-3">
            <label className="block">Administrator</label>
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="toggle"
            />
          </div>
          <div className="my-3">
            <label className="block">Aktywny</label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="toggle"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary mr-2">
              Dodaj
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Users component
export default function Users() {
  const { data: users, error, mutate } = useSWR(`/api/admin/users`);
  const { trigger: deleteUser } = useSWRMutation(
    `/api/admin/users`,
    async (url, { arg }: { arg: { userId: string } }) => {
      const toastId = toast.loading('Usuwanie użytkownika...');
      const res = await fetch(`${url}/${arg.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Użytkownik pomyślnie usunięty', {
          id: toastId,
        });
        mutate(); // Revalidate the SWR cache to update the list
      } else {
        toast.error(data.message, {
          id: toastId,
        });
      }
    }
  );

  const { trigger: addUser } = useSWRMutation(
    `/api/admin/users`,
    async (url, { arg }) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Użytkownik pomyślnie dodany');
        mutate(); // Revalidate the SWR cache to update the list
      } else {
        toast.error(data.message);
      }
    }
  );

  // State for the confirmation modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // State for the add user modal
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users ? users.slice(indexOfFirstUser, indexOfLastUser) : [];

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      deleteUser({ userId: selectedUserId });
    }
    setModalOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddUserClick = () => {
    setAddUserModalOpen(true);
  };

  const handleAddUser = async (formData) => {
    await addUser({ ...formData });
    setAddUserModalOpen(false);
  };

  if (error) return <div>Wystąpił błąd.</div>;
  if (!users) return <div>Ładowanie...</div>;

  return (
    <div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onAdd={handleAddUser}
      />
      <div className="flex justify-between items-center py-4">
        <h1 className="text-2xl">Użytkownicy</h1>
        <button
          className="btn btn-warning"
          onClick={handleAddUserClick}
        >
          Dodaj użytkownika
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th><div className="badge">id</div></th>
              <th><div className="badge">nazwa</div></th>
              <th><div className="badge">email</div></th>
              <th><div className="badge">administrator</div></th>
              <th><div className="badge">aktywny</div></th>
              <th><div className="badge">akcje</div></th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'TAK' : 'NIE'}</td>
                <td>{user.isActive ? 'TAK' : 'NIE'}</td>
                <td>
                  <Link href={`/admin/users/${user._id}`}>
                    <button type="button" className="btn btn-info btn-sm">
                      Edytuj
                    </button>
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => handleDeleteClick(user._id)}
                    type="button"
                    className="btn btn-error btn-sm"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-center">
          {Array.isArray(users) && users.length > usersPerPage && (
            <div className="btn-group">
              {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
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
    </div>
  );
}
