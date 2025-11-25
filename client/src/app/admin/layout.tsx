'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.user_metadata?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.user_metadata?.role !== 'admin') {
    return <p className="text-center">Loading and verifying admin access...</p>;
  }

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4 text-festive-gold">Admin Menu</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/admin" className="hover:text-festive-gold">Dashboard</Link>
          <Link href="/admin/teams" className="hover:text-festive-gold">Teams</Link>
          <Link href="/admin/players" className="hover:text-festive-gold">Players</Link>
          <Link href="/admin/referees" className="hover:text-festive-gold">Referees</Link>
          <Link href="/admin/matches" className="hover:text-festive-gold">Matches</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
