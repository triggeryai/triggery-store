// components/DeveloperModeWrapper.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DeveloperModeCheck from '@/components/DeveloperModeCheck';

export default function DeveloperModeWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  useEffect(() => {
    const fetchDeveloperMode = async () => {
      try {
        const response = await fetch('/api/developerMode');
        const data = await response.json();
        setIsDeveloperMode(data.isDeveloperMode);
      } catch (error) {
        console.error('Error fetching developer mode status', error);
      }
    };

    fetchDeveloperMode();
  }, [session]);

  if (isDeveloperMode && (session?.user?.isAdmin === false || session?.user?.isAdmin === undefined)) {
    return <DeveloperModeCheck />;
  }

  return <>{children}</>;
}
