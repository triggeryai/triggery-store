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
        <h4 className="text-lg mb-4">Are you sure you want to delete this user?</h4>
        <div className="flex justify-end">
          <button onClick={onClose} className="btn btn-secondary mr-2">
            No
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            Yes
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
        <h4 className="text-lg mb-4">Add New User</h4>
        <form onSubmit={handleSubmit}>
          <div className="my-3">
            <label className="block">Name</label>
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
            <label className="block">Password</label>
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
            <label className="block">Admin</label>
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="toggle"
            />
          </div>
          <div className="my-3">
            <label className="block">Active</label>
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
              Add
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
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
      const toastId = toast.loading('Deleting user...');
      const res = await fetch(`${url}/${arg.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('User deleted successfully', {
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
        toast.success('User added successfully');
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
  const usersPerPage = 15; // Number of users per page, change as needed

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

  if (error) return <div>An error has occurred.</div>;
  if (!users) return <div>Loading...</div>;

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
        <h1 className="text-2xl">Users</h1>
        <button
          className="btn btn-warning"
          onClick={handleAddUserClick}
        >
          Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th><div className="badge">id</div></th>
              <th><div className="badge">name</div></th>
              <th><div className="badge">email</div></th>
              <th><div className="badge">admin</div></th>
              <th><div className="badge">active</div></th> {/* New isActive header */}
              <th><div className="badge">actions</div></th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                <td>{user.isActive ? 'YES' : 'NO'}</td> {/* Display isActive status */}
                <td>
                  <Link href={`/admin/users/${user._id}`}>
                    <button type="button" className="btn btn-info btn-sm">
                      Edit
                    </button>
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => handleDeleteClick(user._id)}
                    type="button"
                    className="btn btn-error btn-sm"
                  >
                    Delete
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
