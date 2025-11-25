'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function RefereeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const role = user?.user_metadata?.role;
    if (!loading && (!user || (role !== 'referee' && role !== 'admin'))) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const role = user?.user_metadata?.role;
  if (loading || !user || (role !== 'referee' && role !== 'admin')) {
    return <p className="text-center">Loading and verifying referee access...</p>;
  }

  return (
    <div>
        <h2 className="text-2xl font-bold mb-4 text-center text-christmas-blue">Referee Panel</h2>
        {children}
    </div>
  );
}
