'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const role = user?.user_metadata?.role;

  return (
    <header className="bg-christmas-blue text-white shadow-md">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-festive-gold">
          <Link href="/">Veeran Winter Cup Live</Link>
        </h1>
        <div className="space-x-4 flex items-center">
          <Link href="/standings" className="hover:text-festive-gold">Team Standings</Link>
          <Link href="/history" className="hover:text-festive-gold">Match History</Link>
          
          {user ? (
            <>
              {role === 'admin' && <Link href="/admin" className="hover:text-festive-gold">Admin Panel</Link>}
              {role === 'referee' && <Link href="/referee" className="hover:text-festive-gold">Referee Panel</Link>}
              <button onClick={handleLogout} className="bg-festive-gold text-christmas-blue font-bold py-1 px-3 rounded">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-festive-gold">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
