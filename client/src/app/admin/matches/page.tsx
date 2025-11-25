'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Define types
interface Match {
    _id: string;
    teamA: { name: string };
    teamB: { name: string };
    category: string;
    day: number;
    matchTime: string;
    status: string;
}
interface Team {
    _id: string;
    name: string;
    category: string;
    gender: string;
}
interface Referee {
    _id: string;
    name: string;
}

const MatchesManagementPage = () => {
    const { session } = useAuth();
    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [referees, setReferees] = useState<Referee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [day, setDay] = useState(1);
    const [gender, setGender] = useState('Boys');
    const [category, setCategory] = useState('U10');
    const [teamA, setTeamA] = useState('');
    const [teamB, setTeamB] = useState('');
    const [matchTime, setMatchTime] = useState('');
    const [referee, setReferee] = useState('');
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const fetchData = async () => {
        setLoading(true);
        if(!session) return;
        try {
            const [matchesRes, teamsRes, refereesRes] = await Promise.all([
                fetch(`${apiUrl}/api/matches`),
                fetch(`${apiUrl}/api/teams`),
                fetch(`${apiUrl}/api/referees`, { headers: { 'Authorization': `Bearer ${session.access_token}` }})
            ]);
            if (!matchesRes.ok || !teamsRes.ok || !refereesRes.ok) throw new Error('Failed to fetch data');
            const matchesData = await matchesRes.json();
            const teamsData = await teamsRes.json();
            const refereesData = await refereesRes.json();
            setMatches(matchesData);
            setTeams(teamsData);
            setReferees(refereesData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [session]);

    const handleAddMatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;
        
        try {
            const res = await fetch(`${apiUrl}/api/matches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ day, gender, category, teamA, teamB, matchTime, referee }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to create match');
            }
            fetchData(); // Refetch
        } catch (err: any) {
            setError(err.message);
        }
    };

    const filteredTeams = teams.filter(t => t.gender === gender && t.category === category);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage Matches</h2>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

            {/* Create Match Form */}
            <div className="card mb-8">
                <h3 className="text-xl font-semibold mb-4">Create New Match</h3>
                <form onSubmit={handleAddMatch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={day} onChange={e => setDay(Number(e.target.value))} className="shadow p-2 border rounded">
                        <option value={1}>Day 1 - Dec 27</option>
                        <option value={2}>Day 2 - Dec 28</option>
                    </select>
                    <select value={gender} onChange={e => setGender(e.target.value)} className="shadow p-2 border rounded">
                        <option>Boys</option>
                        <option>Girls</option>
                    </select>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="shadow p-2 border rounded">
                         <option>U6</option><option>U7</option><option>U8</option><option>U10</option><option>U12</option><option>U14</option><option>U17</option>
                    </select>
                     <select value={teamA} onChange={e => setTeamA(e.target.value)} required className="shadow p-2 border rounded">
                        <option value="">Select Team A</option>
                        {filteredTeams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                     <select value={teamB} onChange={e => setTeamB(e.target.value)} required className="shadow p-2 border rounded">
                        <option value="">Select Team B</option>
                        {filteredTeams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                     <select value={referee} onChange={e => setReferee(e.target.value)} required className="shadow p-2 border rounded">
                        <option value="">Assign Referee</option>
                        {referees.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                    </select>
                    <input type="datetime-local" value={matchTime} onChange={e => setMatchTime(e.target.value)} required className="shadow p-2 border rounded col-span-2"/>
                    <button type="submit" className="bg-christmas-blue text-white font-bold py-2 px-4 rounded col-span-3">Create Match</button>
                </form>
            </div>

             {/* Matches Table */}
            <div className="card">
                <h3 className="text-xl font-semibold mb-4">Scheduled Matches</h3>
                {loading ? <p>Loading...</p> : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Match</th>
                                <th className="px-6 py-3">Time</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.map(match => (
                                <tr key={match._id} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium">{match.teamA?.name} vs {match.teamB?.name}</td>
                                    <td className="px-6 py-4">{new Date(match.matchTime).toLocaleString()}</td>
                                    <td className="px-6 py-4">{match.status}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button className="text-blue-600 hover:underline">Edit</button>
                                        <button className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MatchesManagementPage;
