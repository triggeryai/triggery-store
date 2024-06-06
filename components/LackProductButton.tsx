// components/LackProductButton.tsx
"use client"
// components/LackProductButton.tsx
import { useState, useEffect } from 'react';

const LackProductButton = () => {
  const [isOn, setIsOn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/admin/products/lack', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched status:', data); // Log response data
        setIsOn(data?.data?.isOn ?? false);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleToggle = async () => {
    const newStatus = !isOn;
    try {
      const response = await fetch('/api/admin/products/lack', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isOn: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Updated status:', data); // Log response data
      if (data.success) {
        setIsOn(newStatus);
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <label>
      Show Lack Products
      <input
        type="checkbox"
        checked={isOn}
        onChange={handleToggle}
      />
    </label>
  );
};

export default LackProductButton;
