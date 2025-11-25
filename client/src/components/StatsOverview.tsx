'use client';

import { useMemo } from 'react';

type Team = { _id: string; name: string };
type Match = { _id: string; status: 'Upcoming' | 'Live' | 'Paused' | 'Completed'; teamA: Team; teamB: Team; scoreA: number; scoreB: number; matchTime: string; category: string };

export default function StatsOverview({ matches }: { matches: Match[] }) {
  const stats = useMemo(() => {
    const total = matches.length;
    const live = matches.filter(m => m.status === 'Live' || m.status === 'Paused').length;
    const upcoming = matches.filter(m => m.status === 'Upcoming').length;
    const completed = matches.filter(m => m.status === 'Completed').length;
    const goals = matches.filter(m => m.status === 'Completed').reduce((acc, m) => acc + m.scoreA + m.scoreB, 0);
    return { total, live, upcoming, completed, goals };
  }, [matches]);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-xl p-4 bg-gradient-to-br from-christmas-blue to-blue-600 text-white shadow-md">
        <p className="text-sm opacity-80">Total Matches</p>
        <p className="text-3xl font-bold">{stats.total}</p>
      </div>
      <div className="rounded-xl p-4 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md">
        <p className="text-sm opacity-80">Live</p>
        <p className="text-3xl font-bold">{stats.live}</p>
      </div>
      <div className="rounded-xl p-4 bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-md">
        <p className="text-sm opacity-80">Upcoming</p>
        <p className="text-3xl font-bold">{stats.upcoming}</p>
      </div>
      <div className="rounded-xl p-4 bg-gradient-to-br from-festive-gold to-orange-500 text-christmas-blue shadow-md">
        <p className="text-sm opacity-80">Completed</p>
        <p className="text-3xl font-bold">{stats.completed}</p>
      </div>
    </div>
  );
}
