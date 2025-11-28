"use client";

import { useParams } from "next/navigation";
import QuizBoard from "../quiz/quizBoard";
// import BugFixBoard from "../bugFix/BugFixBoard";
// import ChallengeBoard from "../challengeSolver/ChallengeBoard";
// import TicTacToe from "../tictactoe/TicTacToe";

const gamesMap: Record<string, React.FC> = {
  quiz: QuizBoard,
//   bugFix: BugFixBoard,
//   challengeSolver: ChallengeBoard,
//   tictactoe: TicTacToe,
};

export default function GamePage() {
  const params = useParams();
  const gameId = params?.gameId || "";

  const GameComponent = gamesMap[gameId];

  if (!GameComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-bold mb-4">Game Not Found</h1>
        <p className="text-gray-600">
          The game you are looking for does not exist. Go back to the <a href="/games" className="text-blue-600 underline">Games Lobby</a>.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <GameComponent />
      </div>
    </main>
  );
}
