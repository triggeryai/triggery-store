// components/DeveloperModeWrapper.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DeveloperModeCheck from '@/components/DeveloperModeCheck';

export default function DeveloperModeWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  useEffect(() => {
    console.log('Session Data:', session); // Debug line to log session data
    const fetchDeveloperMode = async () => {
      try {
        const response = await fetch('/api/developerMode');
        const data = await response.json();
        console.log('Developer Mode Status:', data); // Debug line to log developer mode status
        setIsDeveloperMode(data.isDeveloperMode);
      } catch (error) {
        console.error('Error fetching developer mode status', error);
      }
    };

    fetchDeveloperMode();
  }, [session]);

  console.log('isDeveloperMode:', isDeveloperMode); // Debug line
  console.log('session?.user?.isAdmin:', session?.user?.isAdmin); // Debug line

  if (isDeveloperMode && (session?.user?.isAdmin === false || session?.user?.isAdmin === undefined)) {
    return <DeveloperModeCheck />;
  }

  return <>{children}</>;
}
