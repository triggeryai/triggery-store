'use client';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

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
        mutate(); 
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
        mutate();
      } else {
        toast.error(data.message);
      }
    }
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

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

  // Dodanie spinnera ładowania
  if (error) return <div>Wystąpił błąd.</div>;
  if (!users)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );

  return (
    <div className="p-4">
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
        <table className="table-auto w-full border-collapse hidden md:table">
          <thead>
            <tr>
              <th className="border px-4 py-2"><div className="badge">id</div></th>
              <th className="border px-4 py-2"><div className="badge">nazwa</div></th>
              <th className="border px-4 py-2"><div className="badge">email</div></th>
              <th className="border px-4 py-2"><div className="badge">administrator</div></th>
              <th className="border px-4 py-2"><div className="badge">aktywny</div></th>
              <th className="border px-4 py-2"><div className="badge">akcje</div></th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user._id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.isAdmin ? 'TAK' : 'NIE'}</td>
                <td className="border px-4 py-2">{user.isActive ? 'TAK' : 'NIE'}</td>
                <td className="border px-4 py-2">
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
        {/* Mobile view */}
        <div className="md:hidden">
          {currentUsers.map((user) => (
            <div key={user._id} className="mb-4 p-4 rounded-lg border">
              <p><strong>ID:</strong> {user._id}</p>
              <p><strong>Nazwa:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Administrator:</strong> {user.isAdmin ? 'TAK' : 'NIE'}</p>
              <p><strong>Aktywny:</strong> {user.isActive ? 'TAK' : 'NIE'}</p>
              <div className="flex flex-col items-center mt-4 space-y-2">
                <Link href={`/admin/users/${user._id}`} passHref>
                  <button className="btn btn-info w-full max-w-xs">Edytuj</button>
                </Link>
                <button
                  onClick={() => handleDeleteClick(user._id)}
                  type="button"
                  className="btn btn-error w-full max-w-xs"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
  );
}
