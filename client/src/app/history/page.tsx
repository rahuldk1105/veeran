'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Define types for our data
interface Team {
  _id: string;
  name: string;
  logoUrl?: string;
}

interface Match {
  _id: string;
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  matchTime: string;
  category: string;
  day: number;
  groundNumber?: string;
}

interface MatchEvent {
  _id: string;
  type: string;
  minute: number;
  player: {
    name: string;
    jerseyNumber: number;
  };
  team: {
    name: string;
  };
}

const MatchHistoryPage = () => {
  const [completedMatches, setCompletedMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCompletedMatches = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/matches?status=Completed`);
        if (!res.ok) {
          throw new Error('Failed to fetch completed matches');
        }
        const data = await res.json();
        setCompletedMatches(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedMatches();
  }, []);

  const toggleMatchEvents = async (matchId: string) => {
    if (expandedMatchId === matchId) {
      setExpandedMatchId(null);
    } else {
      setExpandedMatchId(matchId);
      setEventsLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/matches/${matchId}/events`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch match events");
      } finally {
        setEventsLoading(false);
      }
    }
  };

  if (loading) return <p className="text-center">Loading match history...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center text-christmas-blue">Match History</h2>
      {completedMatches.length === 0 ? (
        <p className="text-center text-gray-500">No matches have been completed yet.</p>
      ) : (
        <div className="space-y-4">
          {completedMatches.map((match) => (
            <div key={match._id} className="card">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleMatchEvents(match._id)}>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-lg">{match.teamA.name}</span>
                  <span className="score-display text-2xl">{match.scoreA} - {match.scoreB}</span>
                  <span className="font-bold text-lg">{match.teamB.name}</span>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{match.category} - Day {match.day}</p>
                  <p>{new Date(match.matchTime).toLocaleString()}</p>
                </div>
              </div>
              {expandedMatchId === match._id && (
                <div className="mt-4 border-t pt-4">
                  {eventsLoading ? <p>Loading events...</p> : (
                    <ul className="space-y-1">
                      {events.map(event => (
                        <li key={event._id} className="text-sm">
                          <span className="font-bold">{event.minute}'</span> - {event.type} by {event.player.name} ({event.team.name})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchHistoryPage;
