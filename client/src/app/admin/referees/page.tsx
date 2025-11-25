'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Referee {
    _id: string;
    name: string;
    categoryExpertise: string[];
}

const RefereesManagementPage = () => {
    const { session } = useAuth();
    const [referees, setReferees] = useState<Referee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form state
    const [refereeName, setRefereeName] = useState('');
    const [email, setEmail] = useState('');
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const fetchReferees = async () => {
        setLoading(true);
        if (!session) return;
        try {
            const res = await fetch(`${apiUrl}/api/referees`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch referees');
            const data = await res.json();
            setReferees(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(session) fetchReferees();
    }, [session]);

    const handleAddReferee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;
        
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch(`${apiUrl}/api/referees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ name: refereeName, email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to add referee');
            
            setSuccessMessage(`Referee created successfully! Password: ${data.password}`);
            fetchReferees(); // Refetch
            setRefereeName('');
            setEmail('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage Referees</h2>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}

            {/* Add Referee Form */}
            <div className="card mb-8">
                 <h3 className="text-xl font-semibold mb-4">Create New Referee</h3>
                 <form onSubmit={handleAddReferee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Referee Name" value={refereeName} onChange={e => setRefereeName(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3"/>
                    <input type="email" placeholder="Referee Email" value={email} onChange={e => setEmail(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3"/>
                    <button type="submit" className="bg-christmas-blue text-white font-bold py-2 px-4 rounded col-span-1 md:col-span-2">Create Referee Account</button>
                 </form>
            </div>

            {/* Referees Table */}
            <div className="card">
                <h3 className="text-xl font-semibold mb-4">Existing Referees</h3>
                {loading ? <p>Loading...</p> : (
                    <table className="w-full text-sm text-left">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Expertise</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referees.map(referee => (
                                <tr key={referee._id} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium">{referee.name}</td>
                                    <td className="px-6 py-4">{referee.categoryExpertise.join(', ')}</td>
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

export default RefereesManagementPage;
