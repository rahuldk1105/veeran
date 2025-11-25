'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Define types
interface Player {
    _id: string;
    name: string;
    jerseyNumber: number;
    position: string;
    team: {
        name: string;
    }
}
interface Team {
    _id: string;
    name: string;
}

const PlayersManagementPage = () => {
    const { session } = useAuth();
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [playerName, setPlayerName] = useState('');
    const [dob, setDob] = useState('');
    const [jerseyNumber, setJerseyNumber] = useState('');
    const [position, setPosition] = useState('Forward');
    const [selectedTeam, setSelectedTeam] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchPlayersAndTeams = async () => {
        setLoading(true);
        try {
            const [playersRes, teamsRes] = await Promise.all([
                fetch(`${apiUrl}/api/players`),
                fetch(`${apiUrl}/api/teams`),
            ]);
            if (!playersRes.ok || !teamsRes.ok) throw new Error('Failed to fetch data');
            const playersData = await playersRes.json();
            const teamsData = await teamsRes.json();
            setPlayers(playersData);
            setTeams(teamsData);
            if (teamsData.length > 0) {
                setSelectedTeam(teamsData[0]._id);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlayersAndTeams();
    }, []);

    const handleAddPlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session || !selectedTeam) {
            setError('You must select a team.');
            return;
        }
        setError(null);

        try {
            const res = await fetch(`${apiUrl}/api/players`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    name: playerName,
                    dob,
                    jerseyNumber: Number(jerseyNumber),
                    position,
                    teamId: selectedTeam,
                }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to add player');
            }
            fetchPlayersAndTeams(); // Refetch
            // Reset form
            setPlayerName('');
            setDob('');
            setJerseyNumber('');

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage Players</h2>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            
            {/* Add Player Form */}
            <div className="card mb-8">
                 <h3 className="text-xl font-semibold mb-4">Add New Player</h3>
                 <form onSubmit={handleAddPlayer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Player Name" value={playerName} onChange={e => setPlayerName(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3"/>
                    <input type="date" placeholder="Date of Birth" value={dob} onChange={e => setDob(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3"/>
                    <input type="number" placeholder="Jersey Number" value={jerseyNumber} onChange={e => setJerseyNumber(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3"/>
                    <select value={position} onChange={e => setPosition(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3">
                        <option>Goalkeeper</option>
                        <option>Defender</option>
                        <option>Midfielder</option>
                        <option>Forward</option>
                    </select>
                    <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 col-span-1 md:col-span-2">
                        {teams.map(team => <option key={team._id} value={team._id}>{team.name}</option>)}
                    </select>
                    <button type="submit" className="bg-christmas-blue text-white font-bold py-2 px-4 rounded col-span-1 md:col-span-2">Add Player</button>
                 </form>
            </div>

            {/* Players Table */}
            <div className="card">
                <h3 className="text-xl font-semibold mb-4">Existing Players</h3>
                {loading ? <p>Loading...</p> : (
                    <table className="w-full text-sm text-left">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Team</th>
                                <th className="px-6 py-3">Jersey #</th>
                                <th className="px-6 py-3">Position</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player => (
                                <tr key={player._id} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium">{player.name}</td>
                                    <td className="px-6 py-4">{player.team?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{player.jerseyNumber}</td>
                                    <td className="px-6 py-4">{player.position}</td>
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
}

export default PlayersManagementPage;
