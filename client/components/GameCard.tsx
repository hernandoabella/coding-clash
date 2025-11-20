"use client";

import Link from "next/link";

interface GameCardProps {
  game: {
    id: string;
    name: string;
    description: string;
    icon?: string;
  };
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.id}`}>
      <div className="p-6 bg-white shadow rounded hover:shadow-lg cursor-pointer transition text-center">
        <div className="text-4xl mb-4">{game.icon || "🎮"}</div>
        <h3 className="text-xl font-bold mb-2">{game.name}</h3>
        <p className="text-gray-600">{game.description}</p>
      </div>
    </Link>
  );
}
