"use client";

interface RecentGame {
  id: string;
  name: string;
  score: number;
}

interface RecentGamesProps {
  games: RecentGame[];
}

export default function RecentGames({ games }: RecentGamesProps) {
  if (games.length === 0) return <p className="text-gray-500">No recent games played.</p>;

  return (
    <ul className="space-y-2">
      {games.map((game) => (
        <li key={game.id} className="p-2 bg-white shadow rounded flex justify-between">
          <span>{game.name}</span>
          <span className="font-bold">{game.score}</span>
        </li>
      ))}
    </ul>
  );
}
