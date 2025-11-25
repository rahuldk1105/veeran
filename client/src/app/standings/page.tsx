'use client';

import { useEffect, useState } from 'react';

interface TeamStanding {
  teamName: string;
  teamLogo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface CategoryStanding {
  category: string;
  teams: TeamStanding[];
}

const StandingsPage = () => {
  const [standings, setStandings] = useState<CategoryStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/standings`);
        if (!res.ok) {
          throw new Error('Failed to fetch standings');
        }
        const data = await res.json();
        setStandings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
  }, []);

  if (loading) return <p className="text-center">Loading standings...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center text-christmas-blue">Team Standings</h2>
      {standings.length === 0 ? (
         <p className="text-center text-gray-500">Standings will be calculated as matches are completed.</p>
      ) : (
        <div className="space-y-8">
          {standings.map((categoryStanding) => (
            <section key={categoryStanding.category}>
              <h3 className="text-2xl font-semibold mb-4 text-christmas-blue">{categoryStanding.category}</h3>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Team</th>
                      <th scope="col" className="px-2 py-3 text-center">P</th>
                      <th scope="col" className="px-2 py-3 text-center">W</th>
                      <th scope="col" className="px-2 py-3 text-center">D</th>
                      <th scope="col" className="px-2 py-3 text-center">L</th>
                      <th scope="col" className="px-2 py-3 text-center">GF</th>
                      <th scope="col" className="px-2 py-3 text-center">GA</th>
                      <th scope="col" className="px-2 py-3 text-center">GD</th>
                      <th scope="col" className="px-2 py-3 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryStanding.teams.map((team, index) => (
                      <tr key={index} className="bg-white border-b">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {team.teamName}
                        </th>
                        <td className="px-2 py-4 text-center">{team.played}</td>
                        <td className="px-2 py-4 text-center">{team.won}</td>
                        <td className="px-2 py-4 text-center">{team.drawn}</td>
                        <td className="px-2 py-4 text-center">{team.lost}</td>
                        <td className="px-2 py-4 text-center">{team.goalsFor}</td>
                        <td className="px-2 py-4 text-center">{team.goalsAgainst}</td>
                        <td className="px-2 py-4 text-center">{team.goalDifference}</td>
                        <td className="px-2 py-4 text-center font-bold">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default StandingsPage;
