// ChangePaymentMethodButton.tsx
import React, { useState } from 'react';
import Modal from './Modal'; // Path to your Modal component
import toast from 'react-hot-toast';

const ChangePaymentMethodButton = ({ orderId }) => {
  const [showModal, setShowModal] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handlePaymentMethodChange = (e) => {
    setNewPaymentMethod(e.target.value);
  };

  const saveNewPaymentMethod = async () => {
    try {
      // Send request to update payment method
      const response = await fetch(`/api/orders/${orderId}/update-payment-method`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPaymentMethod }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Payment method updated successfully');
      } else {
        toast.error(data.message || 'Failed to update payment method');
      }
    } catch (error) {
      toast.error('An error occurred while updating the payment method');
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <button onClick={openModal} className="btn btn-primary">Change Payment Method</button>
      {showModal && (
        <Modal onClose={closeModal} title="Change Payment Method">
          <div>
            <label>
              New Payment Method:
              <select value={newPaymentMethod} onChange={handlePaymentMethodChange}>
                <option value="PayPal">PayPal</option>
                <option value="Stripe">Stripe</option>
                {/* Add more payment methods as needed */}
              </select>
            </label>
            <button onClick={saveNewPaymentMethod} className="btn btn-success">
              Save Payment Method
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ChangePaymentMethodButton;
