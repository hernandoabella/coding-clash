"use client";

export default function HowItWorks() {
  return (
    <section className="py-16 max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="text-xl font-semibold mb-2">Choose a Game</h3>
          <p>Pick your favorite programming game: quiz, bug fixing, or coding challenges.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Play Solo or Online</h3>
          <p>Compete with AI or challenge friends and other players online.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
          <p>Earn points, level up, and climb the leaderboard as you improve your skills.</p>
        </div>
      </div>
    </section>
  );
}
