// app\admin\payments\Shipping.tsx
'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from 'react-modal';

export default function Payments() {
  const [bankAccount, setBankAccount] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newBankAccount, setNewBankAccount] = useState('');

  useEffect(() => {
    fetchBankAccount();
  }, []);

  const fetchBankAccount = async () => {
    try {
      const res = await fetch('/api/admin/payments');
      const data = await res.json();
      if (res.ok) {
        setBankAccount(data.accountNumber);
        setNewBankAccount(data.accountNumber);
      } else {
        toast.error(data.message || 'Failed to fetch bank account');
      }
    } catch (error) {
      toast.error('Network error when fetching bank account');
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleBankAccountChange = async () => {
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountNumber: newBankAccount }),
      });
      const data = await res.json();
      if (res.ok) {
        setBankAccount(data.accountNumber);
        toast.success('Bank account updated successfully');
        closeModal();
      } else {
        toast.error(data.message || 'Failed to update bank account');
      }
    } catch (error) {
      toast.error('Network error when updating bank account');
    }
  };

  return (
    <div>
      <h1 className="text-2xl py-4">Admin Payments Settings</h1>
      <div>
        <p>Current Bank Account: {bankAccount}</p>
        <button onClick={openModal} className="btn btn-primary">Change Bank Account</button>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Change Bank Account">
        <h2>Change Bank Account</h2>
        <input
          type="text"
          value={newBankAccount}
          onChange={(e) => setNewBankAccount(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button onClick={handleBankAccountChange} className="btn btn-primary mt-4">Save</button>
        <button onClick={closeModal} className="btn btn-secondary mt-4">Cancel</button>
      </Modal>
    </div>
  );
}
