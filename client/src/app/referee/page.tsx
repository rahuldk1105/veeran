'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Match {
    _id: string;
    teamA: { name: string };
    teamB: { name: string };
    category: string;
    matchTime: string;
    status: string;
}

const RefereeDashboardPage = () => {
    const { user, session } = useAuth();
    const router = useRouter();
    const [myMatches, setMyMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchMyMatches = async () => {
            if (!session) return;
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/api/referee/matches`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch your assigned matches');
                }
                const data = await res.json();
                setMyMatches(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyMatches();
    }, [session]);

    if (loading) return <p>Loading your matches...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="card">
            <h3 className="text-xl font-semibold mb-4 text-christmas-blue">My Assigned Matches</h3>
            <div className="space-y-4">
                {myMatches.length > 0 ? myMatches.map(match => (
                    <div key={match._id} className="border p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-bold">{match.teamA.name} vs {match.teamB.name}</p>
                            <p className="text-sm text-gray-600">{match.category} - {new Date(match.matchTime).toLocaleString()}</p>
                        </div>
                        <Link href={`/referee/match/${match._id}`} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
                           {match.status === 'Upcoming' ? 'Start Match' : 'Control Match'}
                        </Link>
                    </div>
                )) : (
                    <p>You have no matches assigned.</p>
                )}
            </div>
        </div>
    );
}

export default RefereeDashboardPage;
