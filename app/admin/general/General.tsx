// app/components/General.tsx
"use client"
// app/components/General.tsx
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const General = () => {
  const { data: session } = useSession();
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/general');
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        if (data.success) {
          setIsDeveloperMode(data.data.isDeveloperMode);
        } else {
          toast.error('Failed to load developer mode status');
        }
      } catch (error) {
        toast.error('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleDeveloperMode = async () => {
    const newMode = !isDeveloperMode;
    try {
      const res = await fetch('/api/admin/general', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDeveloperMode: newMode }),
      });
      const data = await res.json();

      if (data.success) {
        setIsDeveloperMode(newMode);
        toast.success(`Developer mode ${newMode ? 'enabled' : 'disabled'}`);
      } else {
        toast.error('Failed to update developer mode');
      }
    } catch (error) {
      toast.error('An error occurred while updating developer mode');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>General Settings</h1>
      <div>
        <label>
          Developer Mode
          <input
            type="checkbox"
            checked={isDeveloperMode}
            onChange={toggleDeveloperMode}
          />
        </label>
      </div>
    </div>
  );
};

export default General;
