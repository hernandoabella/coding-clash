"use client";

const mockLeaderboard = [
  { username: "CodeMaster", points: 1200 },
  { username: "BugHunter", points: 1100 },
  { username: "AlgoWizard", points: 1000 },
  { username: "DevNinja", points: 900 },
];

export default function Leaderboard() {
  return (
    <ul className="space-y-2">
      {mockLeaderboard.map((user, index) => (
        <li key={index} className="p-2 bg-white shadow rounded flex justify-between">
          <span>{index + 1}. {user.username}</span>
          <span className="font-bold">{user.points}</span>
        </li>
      ))}
    </ul>
  );
}
