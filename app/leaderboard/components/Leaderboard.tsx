// components/Leaderboard.tsx
'use client';

import { useState } from 'react';
import { FaTrophy, FaCrown, FaMedal, FaSearch, FaFilter } from 'react-icons/fa';

interface Player {
  id: number;
  name: string;
  rank: number;
  score: number;
  gamesPlayed: number;
  winRate: number;
  avatar: string;
  status: 'online' | 'offline';
}

export default function Leaderboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'online'>('all');

  const players: Player[] = [
    { id: 1, name: 'Alex Johnson', rank: 1, score: 4850, gamesPlayed: 324, winRate: 78, avatar: 'https://i.pravatar.cc/150?img=1', status: 'online' },
    { id: 2, name: 'Sarah Miller', rank: 2, score: 4720, gamesPlayed: 298, winRate: 75, avatar: 'https://i.pravatar.cc/150?img=2', status: 'online' },
    { id: 3, name: 'Mike Thompson', rank: 3, score: 4580, gamesPlayed: 356, winRate: 72, avatar: 'https://i.pravatar.cc/150?img=3', status: 'offline' },
    { id: 4, name: 'Jessica Lee', rank: 4, score: 4420, gamesPlayed: 287, winRate: 70, avatar: 'https://i.pravatar.cc/150?img=4', status: 'online' },
    { id: 5, name: 'David Wilson', rank: 5, score: 4310, gamesPlayed: 312, winRate: 68, avatar: 'https://i.pravatar.cc/150?img=5', status: 'offline' },
    { id: 6, name: 'Emily Chen', rank: 6, score: 4150, gamesPlayed: 276, winRate: 67, avatar: 'https://i.pravatar.cc/150?img=6', status: 'online' },
    { id: 7, name: 'Ryan Garcia', rank: 7, score: 3980, gamesPlayed: 301, winRate: 65, avatar: 'https://i.pravatar.cc/150?img=7', status: 'online' },
    { id: 8, name: 'Olivia Martinez', rank: 8, score: 3820, gamesPlayed: 264, winRate: 63, avatar: 'https://i.pravatar.cc/150?img=8', status: 'offline' },
    { id: 9, name: 'James Brown', rank: 9, score: 3710, gamesPlayed: 289, winRate: 61, avatar: 'https://i.pravatar.cc/150?img=9', status: 'online' },
    { id: 10, name: 'Sophia Davis', rank: 10, score: 3590, gamesPlayed: 253, winRate: 59, avatar: 'https://i.pravatar.cc/150?img=10', status: 'online' },
  ];

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || player.status === 'online';
    return matchesSearch && matchesFilter;
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <FaCrown className="text-yellow-500" />;
    if (rank === 2) return <FaMedal className="text-gray-400" />;
    if (rank === 3) return <FaMedal className="text-amber-700" />;
    return <span className="text-lg font-bold text-gray-700">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <FaTrophy className="text-yellow-500" /> Leaderboard
          </h1>
          <p className="text-gray-600">Top players based on performance and score</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search players..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <FaFilter className="text-gray-500" />
              <select 
                className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'online')}
              >
                <option value="all">All Players</option>
                <option value="online">Online Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 font-semibold text-gray-700">Rank</th>
                  <th className="p-4 font-semibold text-gray-700">Player</th>
                  <th className="p-4 font-semibold text-gray-700">Score</th>
                  <th className="p-4 font-semibold text-gray-700 hidden md:table-cell">Games</th>
                  <th className="p-4 font-semibold text-gray-700 hidden md:table-cell">Win Rate</th>
                  <th className="p-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player) => (
                  <tr key={player.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {getRankIcon(player.rank)}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-800">{player.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{player.score}</td>
                    <td className="p-4 hidden md:table-cell text-gray-700">{player.gamesPlayed}</td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${player.winRate}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-700">{player.winRate}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${player.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="hidden md:inline text-gray-700">
                          {player.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No players found matching your criteria
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Total Players</h3>
            <p className="text-3xl font-bold text-blue-600">{players.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Online Now</h3>
            <p className="text-3xl font-bold text-green-600">
              {players.filter(p => p.status === 'online').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Avg. Win Rate</h3>
            <p className="text-3xl font-bold text-amber-600">
              {Math.round(players.reduce((sum, player) => sum + player.winRate, 0) / players.length)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}