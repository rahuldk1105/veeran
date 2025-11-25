'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';

// Types
interface Player { _id: string, name: string, jerseyNumber: number };
interface Team { _id:string, name: string, players: Player[] };
interface Match {
  _id: string;
  status: 'Upcoming' | 'Live' | 'Paused' | 'Completed';
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  timer: { startTime?: string, pauseTime?: string, totalPausedDuration: number };
};

const MatchControlPage = () => {
    const { session } = useAuth();
    const params = useParams();
    const matchId = params.id;

    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // --- Event Modal State ---
    const [showEventModal, setShowEventModal] = useState(false);
    const [eventType, setEventType] = useState('Goal');
    const [eventPlayer, setEventPlayer] = useState('');
    const [eventTeam, setEventTeam] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchMatch = useCallback(async () => {
        try {
            const res = await fetch(`${apiUrl}/api/matches/${matchId}`);
            if (!res.ok) throw new Error('Failed to fetch match data');
            const data = await res.json();
            setMatch(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [matchId]);

    useEffect(() => {
        fetchMatch();
    }, [fetchMatch]);

    const updateMatchStatus = async (status: string, timerData?: any) => {
        if(!session) return;
        try {
            const body = { status, ...timerData };
            const res = await fetch(`${apiUrl}/api/matches/${matchId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(body)
            });
            if(!res.ok) throw new Error('Failed to update match status');
            const updatedMatch = await res.json();
            setMatch(updatedMatch); // Update local state
        } catch(err: any) {
            setError(`Error: ${err.message}`);
        }
    };

    const handleStartMatch = () => updateMatchStatus('Live', { timer: { startTime: new Date().toISOString() } });
    const handlePauseMatch = () => updateMatchStatus('Paused', { timer: { ...match?.timer, pauseTime: new Date().toISOString() } });
    const handleResumeMatch = () => {
        if(!match?.timer?.pauseTime || !match?.timer?.startTime) return;
        const pauseDuration = new Date().getTime() - new Date(match.timer.pauseTime).getTime();
        const totalPausedDuration = (match.timer.totalPausedDuration || 0) + pauseDuration;
        updateMatchStatus('Live', { timer: { ...match.timer, totalPausedDuration, pauseTime: null } });
    };

    const handleRecordEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session || !match) return;

        // For simplicity, calculate minute from match start time
        const minute = match.timer.startTime ? Math.floor((new Date().getTime() - new Date(match.timer.startTime).getTime()) / 60000) : 0;

        try {
            const res = await fetch(`${apiUrl}/api/matches/${matchId}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ type: eventType, player: eventPlayer, team: eventTeam, minute }),
            });
            if(!res.ok) throw new Error('Failed to record event');
            
            // Refetch match data to get updated score
            fetchMatch();
            setShowEventModal(false);

        } catch (err: any) {
            setError(`Event Error: ${err.message}`);
        }
    };

    if (loading) return <p className="text-center">Loading Match Control...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!match) return <p className="text-center">Match not found.</p>;

    // Pre-Match View
    if (match.status === 'Upcoming') {
        return (
            <div className="card text-center">
                <h3 className="text-xl font-bold mb-4">{match.teamA.name} vs {match.teamB.name}</h3>
                <p className="mb-6">The match is scheduled to start. Review player lists and start the match when ready.</p>
                <button onClick={handleStartMatch} className="bg-green-500 text-white font-bold py-4 px-8 rounded-full text-2xl">
                    START MATCH
                </button>
            </div>
        );
    }
    
    const allPlayers = [...match.teamA.players, ...match.teamB.players];

    // Live/Paused/Completed View
    return (
        <div>
            <div className="card text-center mb-6">
                <p className="text-lg">{match.teamA.name} vs {match.teamB.name}</p>
                <p className="score-display my-2">{match.scoreA} - {match.scoreB}</p>
                <p className={`font-bold text-xl ${match.status === 'Live' ? 'text-green-500' : 'text-red-500'}`}>{match.status}</p>
            </div>
            
            <div className="card text-center">
                <h3 className="text-xl font-bold mb-4">Match Controls</h3>
                 <div className="flex justify-center space-x-4">
                    {match.status === 'Live' && <button onClick={handlePauseMatch} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded">Pause Timer</button>}
                    {match.status === 'Paused' && <button onClick={handleResumeMatch} className="bg-green-500 text-white font-bold py-2 px-4 rounded">Resume Timer</button>}
                    <button onClick={() => setShowEventModal(true)} disabled={match.status !== 'Paused'} className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">Record Event</button>
                </div>
            </div>

            {/* Event Modal */}
            {showEventModal && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="card w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Record New Event</h3>
                        <form onSubmit={handleRecordEvent}>
                           <select value={eventType} onChange={e => setEventType(e.target.value)} className="shadow p-2 border rounded w-full mb-4">
                               <option>Goal</option><option>Yellow Card</option><option>Red Card</option><option>Foul</option><option>Self Goal</option>
                           </select>
                           <select value={eventTeam} onChange={e => setEventTeam(e.target.value)} required className="shadow p-2 border rounded w-full mb-4">
                                <option value="">Select Team</option>
                                <option value={match.teamA._id}>{match.teamA.name}</option>
                                <option value={match.teamB._id}>{match.teamB.name}</option>
                           </select>
                           <select value={eventPlayer} onChange={e => setEventPlayer(e.target.value)} required className="shadow p-2 border rounded w-full mb-4">
                                <option value="">Select Player</option>
                                {allPlayers.map(p => <option key={p._id} value={p._id}>{p.name} (#{p.jerseyNumber})</option>)}
                           </select>
                           <div className="flex justify-end space-x-2">
                               <button type="button" onClick={() => setShowEventModal(false)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                               <button type="submit" className="bg-christmas-blue text-white font-bold py-2 px-4 rounded">Save Event</button>
                           </div>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default MatchControlPage;
