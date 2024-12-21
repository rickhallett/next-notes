import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export const useAdmin = () => {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/profiles');
        setIsAdmin(response.ok);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin };
}; 