// app/admin/payments/Payments.tsx
'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from 'react-modal';

export default function Payments() {
  const [bankAccount, setBankAccount] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newBankAccount, setNewBankAccount] = useState('');

  const [taxSettings, setTaxSettings] = useState({ isActive: false, type: 'fixed', value: 0 });
  const [newTaxSettings, setNewTaxSettings] = useState({ isActive: false, type: 'fixed', value: 0 });

  useEffect(() => {
    fetchBankAccount();
    fetchTaxSettings();
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

  const fetchTaxSettings = async () => {
    try {
      const res = await fetch('/api/admin/tax');
      const data = await res.json();
      if (res.ok) {
        setTaxSettings(data);
        setNewTaxSettings(data);
      } else {
        toast.error(data.message || 'Failed to fetch tax settings');
      }
    } catch (error) {
      toast.error('Network error when fetching tax settings');
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

  const handleTaxSettingsChange = async () => {
    try {
      const res = await fetch('/api/admin/tax', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaxSettings),
      });
      const data = await res.json();
      if (res.ok) {
        setTaxSettings(data);
        toast.success('Tax settings updated successfully');
      } else {
        toast.error(data.message || 'Failed to update tax settings');
      }
    } catch (error) {
      toast.error('Network error when updating tax settings');
    }
  };

  const handleCheckboxChange = (e) => {
    setNewTaxSettings({ ...newTaxSettings, isActive: e.target.checked });
  };

  const handleSelectChange = (e) => {
    setNewTaxSettings({ ...newTaxSettings, type: e.target.value });
  };

  const handleInputChange = (e) => {
    setNewTaxSettings({ ...newTaxSettings, value: e.target.value });
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

      <div className="mt-8">
        <h2 className="text-xl">Tax Settings</h2>
        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={newTaxSettings.isActive}
            onChange={handleCheckboxChange}
            className="checkbox"
          />
          <span className="ml-2">Enable Tax</span>
        </label>
        <div className="mt-4">
          <label>Tax Type</label>
          <select value={newTaxSettings.type} onChange={handleSelectChange} className="select select-bordered w-full max-w-xs">
            <option value="fixed">Fixed</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
        <div className="mt-4">
          <label>Tax Value</label>
          <input
            type="number"
            value={newTaxSettings.value}
            onChange={handleInputChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <button onClick={handleTaxSettingsChange} className="btn btn-primary mt-4">Save</button>
      </div>
    </div>
  );
}
