'use client';

import { useEffect, useState } from 'react';
import { FaTrophy, FaCrown, FaMedal } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid'; // for unique IDs

interface Player {
  id: string;
  name: string;
  rank: number;
  score: number;
  status: 'online' | 'offline';
  gamesPlayed: number;
  winRate: number;
}

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'online'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        if (!res.ok) throw new Error('Failed to load leaderboard');
        const data = await res.json();

        const playersData: Player[] = data.map((p: any, index: number) => ({
          id: p.id || uuidv4(), // fallback unique ID
          name: p.name,
          rank: p.rank,
          score: p.score,
          status: Math.random() > 0.5 ? 'online' : 'offline', // simulated
          gamesPlayed: Math.floor(Math.random() * 200),
          winRate: Math.floor(Math.random() * 100),
        }));

        setPlayers(playersData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter players
  const filtered = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === 'online';
    return matchesSearch && matchesFilter;
  });

  // Rank icons
  const getIcon = (rank: number) => {
    if (rank === 1) return <FaCrown color="gold" />;
    if (rank === 2) return <FaMedal color="silver" />;
    if (rank === 3) return <FaMedal color="brown" />;
    return rank;
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>
        <FaTrophy color="orange" /> Leaderboard
      </h1>

      <div style={{ marginBottom: 10 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search players..."
          style={{ padding: 5, marginRight: 10 }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'online')}
          style={{ padding: 5 }}
        >
          <option value="all">All Players</option>
          <option value="online">Online Only</option>
        </select>
      </div>

      <table
        border={1}
        cellPadding={5}
        cellSpacing={0}
        style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>XP</th>
            <th>Games</th>
            <th>Win Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <tr key={p.id}>
                <td>{getIcon(p.rank)}</td>
                <td>{p.name}</td>
                <td>{p.score}</td>
                <td>{p.gamesPlayed}</td>
                <td>{p.winRate}%</td>
                <td>{p.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '10px' }}>
                No players found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
