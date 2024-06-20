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
        toast.error(data.message || 'Nie udało się pobrać numeru konta bankowego');
      }
    } catch (error) {
      toast.error('Błąd sieci podczas pobierania numeru konta bankowego');
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
        toast.error(data.message || 'Nie udało się pobrać ustawień podatkowych');
      }
    } catch (error) {
      toast.error('Błąd sieci podczas pobierania ustawień podatkowych');
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
        toast.success('Numer konta bankowego został pomyślnie zaktualizowany');
        closeModal();
      } else {
        toast.error(data.message || 'Nie udało się zaktualizować numeru konta bankowego');
      }
    } catch (error) {
      toast.error('Błąd sieci podczas aktualizacji numeru konta bankowego');
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
        toast.success('Ustawienia podatkowe zostały pomyślnie zaktualizowane');
      } else {
        toast.error(data.message || 'Nie udało się zaktualizować ustawień podatkowych');
      }
    } catch (error) {
      toast.error('Błąd sieci podczas aktualizacji ustawień podatkowych');
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
      <h1 className="text-2xl py-4">Ustawienia Płatności Admina</h1>
      <div>
        <p>Aktualne konto bankowe: {bankAccount}</p>
        <button onClick={openModal} className="btn btn-primary">Zmień konto bankowe</button>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Zmień konto bankowe">
        <h2>Zmień konto bankowe</h2>
        <input
          type="text"
          value={newBankAccount}
          onChange={(e) => setNewBankAccount(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button onClick={handleBankAccountChange} className="btn btn-primary mt-4">Zapisz</button>
        <button onClick={closeModal} className="btn btn-secondary mt-4">Anuluj</button>
      </Modal>

      <div className="mt-8">
        <h2 className="text-xl">Ustawienia podatkowe</h2>
        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={newTaxSettings.isActive}
            onChange={handleCheckboxChange}
            className="checkbox"
          />
          <span className="ml-2">Włącz podatek</span>
        </label>
        <div className="mt-4">
          <label>Rodzaj podatku</label>
          <select value={newTaxSettings.type} onChange={handleSelectChange} className="select select-bordered w-full max-w-xs">
            <option value="fixed">Stały</option>
            <option value="percentage">Procentowy</option>
          </select>
        </div>
        <div className="mt-4">
          <label>Wartość podatku</label>
          <input
            type="number"
            value={newTaxSettings.value}
            onChange={handleInputChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <button onClick={handleTaxSettingsChange} className="btn btn-primary mt-4">Zapisz</button>
      </div>
    </div>
  );
}
