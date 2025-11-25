'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Define types
interface Team {
  _id: string;
  name: string;
  gender: string;
  category: string;
  coachName: string;
}

const TeamsManagementPage = () => {
  const { session } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [teamName, setTeamName] = useState('');
  const [gender, setGender] = useState('Boys');
  const [category, setCategory] = useState('U10');
  const [coachName, setCoachName] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/teams`);
      if (!res.ok) throw new Error('Failed to fetch teams');
      const data = await res.json();
      setTeams(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('You must be logged in to add a team.');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ name: teamName, gender, category, coachName }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add team');
      }

      // Reset form and refetch teams
      setTeamName('');
      setCoachName('');
      fetchTeams();
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!session || !window.confirm('Are you sure you want to delete this team?')) return;
    
    try {
       const res = await fetch(`${apiUrl}/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
       if (!res.ok) throw new Error('Failed to delete team');
       fetchTeams(); // Refetch
    } catch (err: any) {
        setError(err.message);
    }
  };


  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-christmas-blue">Manage Teams</h2>

      {/* Add Team Form */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-4 text-christmas-blue">Add New Team</h3>
        <form onSubmit={handleAddTeam} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Team Name" value={teamName} onChange={e => setTeamName(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3"/>
          <input type="text" placeholder="Coach Name" value={coachName} onChange={e => setCoachName(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3"/>
          <select value={gender} onChange={e => setGender(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3">
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3">
            <option>U6</option>
            <option>U7</option>
            <option>U8</option>
            <option>U10</option>
            <option>U12</option>
            <option>U14</option>
            <option>U17</option>
          </select>
          <button type="submit" className="bg-christmas-blue text-white font-bold py-2 px-4 rounded col-span-1 md:col-span-3">Add Team</button>
        </form>
         {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
      </div>

      {/* Teams Table */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-christmas-blue">Existing Teams</h3>
        {loading ? <p>Loading...</p> : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Coach</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(team => (
                <tr key={team._id} className="bg-white border-b">
                  <td className="px-6 py-4 font-medium">{team.name}</td>
                  <td className="px-6 py-4">{team.gender} {team.category}</td>
                  <td className="px-6 py-4">{team.coachName}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDeleteTeam(team._id)} className="text-red-600 hover:underline">Delete</button>
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

export default TeamsManagementPage;
