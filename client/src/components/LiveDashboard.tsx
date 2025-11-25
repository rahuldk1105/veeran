'use client';

import { useEffect, useState } from 'react';

// Define types for our data
interface Team {
  _id: string;
  name: string;
  logoUrl?: string;
}

interface Match {
  _id: string;
  status: 'Upcoming' | 'Live' | 'Paused' | 'Completed';
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  matchTime: string;
  category: string;
  groundNumber?: string;
}

export default function LiveDashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Fetch initial match data
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/matches`);
        if (!res.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data = await res.json();
        setMatches(data);
      } catch (err: Error | unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    // Set up WebSocket connection with retry logic
    if (!wsUrl) {
      console.error('WebSocket URL is not defined');
      return;
    }

    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 2000; // 2 seconds

    const connectWebSocket = () => {
      try {
        console.log(`Attempting to connect to WebSocket at ${wsUrl}...`);
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('✓ WebSocket connected successfully');
          setWsConnected(true);
          reconnectAttempts = 0; // Reset attempts on successful connection
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log('WebSocket message received:', message);

            setMatches(prevMatches => {
              const newMatches = [...prevMatches];
              const matchIndex = newMatches.findIndex(m => m._id === message.payload.matchId);

              if (matchIndex === -1) return prevMatches; // Match not on this dashboard

              const updatedMatch = { ...newMatches[matchIndex] };

              switch (message.type) {
                case 'score-update':
                  updatedMatch.scoreA = message.payload.scoreA;
                  updatedMatch.scoreB = message.payload.scoreB;
                  break;
                case 'match-update':
                  updatedMatch.status = message.payload.status;
                  break;
                case 'event-update':
                  console.log('New Event:', message.payload.event);
                  break;
              }
              
              newMatches[matchIndex] = updatedMatch;
              return newMatches;
            });
          } catch (parseError) {
            console.error('Failed to parse WebSocket message:', parseError);
          }
        };

        ws.onclose = (event) => {
          console.log(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}. ReadyState: ${ws.readyState}`);
        };

        ws.onerror = (event) => {
            console.error(`WebSocket error event. Type: ${event.type}. ReadyState: ${ws.readyState}. Event object:`, event);
        };
      } catch (err) {
        console.error('Failed to create WebSocket:', err);
        setWsConnected(false);
      }
    };

    // Initial connection attempt
    connectWebSocket();

    // Clean up WebSocket connection on component unmount
    return () => {
      if (ws) {
        ws.close(1000, 'Component unmounted');
      }
    };
  }, [apiUrl, wsUrl]);

  const liveMatches = matches.filter(m => m.status === 'Live' || m.status === 'Paused');
  const upcomingMatches = matches.filter(m => m.status === 'Upcoming');
  const completedMatches = matches.filter(m => m.status === 'Completed').slice(0, 5); // Show a preview

  if (loading) return <p className="text-center">Loading matches...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-8">
      {/* Connection Status Indicator */}
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
        <span className="text-sm font-medium">Live Updates</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-600">{wsConnected ? 'Connected' : 'Connecting...'}</span>
        </div>
      </div>

      {/* Live Match Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4 border-b-2 border-christmas-blue pb-2 text-christmas-blue">Live Matches</h3>
        {liveMatches.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {liveMatches.map(match => (
              <div key={match._id} className="bg-white rounded-lg shadow-md p-4">
                {/* Placeholder for live match component */}
                <p>{match.teamA.name} vs {match.teamB.name}</p>
                <p className="bg-gray-800 text-festive-gold p-4 rounded-lg text-center font-mono text-5xl tracking-widest">{match.scoreA} - {match.scoreB}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-gray-500">No matches are currently live.</p>
          </div>
        )}
      </section>

      {/* Upcoming Matches Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4 border-b-2 border-christmas-blue pb-2 text-christmas-blue">Upcoming Matches</h3>
         {upcomingMatches.length > 0 ? (
          <div className="space-y-2">
            {upcomingMatches.map(match => (
              <div key={match._id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                <p>{match.teamA.name} vs {match.teamB.name}</p>
                <p className="text-sm text-gray-600">{new Date(match.matchTime).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        ) : (
           <div className="bg-white rounded-lg shadow-md p-4 text-center">
             <p className="text-gray-500">No upcoming matches scheduled.</p>
           </div>
        )}
      </section>

      {/* Completed Matches Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4 border-b-2 border-christmas-blue pb-2 text-christmas-blue">Completed Matches</h3>
        {completedMatches.length > 0 ? (
           <div className="space-y-2">
             {completedMatches.map(match => (
              <div key={match._id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                <p>{match.teamA.name} <span className="font-bold">{match.scoreA}</span></p>
                <p><span className="font-bold">{match.scoreB}</span> {match.teamB.name}</p>
              </div>
             ))}
           </div>
        ) : (
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-gray-500">No matches have been completed yet.</p>
            </div>
        )}
      </section>
    </div>
  );
}