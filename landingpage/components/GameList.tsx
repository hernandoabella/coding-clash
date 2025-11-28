"use client";

import GameCard from "../../components/GameCard"

interface Game {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface GameListProps {
  games: Game[];
}

export default function GameList({ games }: GameListProps) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
