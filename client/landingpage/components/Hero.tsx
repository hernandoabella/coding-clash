"use client";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
      <h1 className="text-5xl font-bold mb-4">
        Code. Solve. Battle.
      </h1>
      <p className="text-lg max-w-xl mb-6">
        Play programming games, solve challenges, fix bugs, and compete with friends or AI.
      </p>
      <a
        href="/games"
        className="px-6 py-3 bg-white text-blue-600 font-bold rounded hover:bg-gray-100 transition"
      >
        Start Playing
      </a>
    </section>
  );
}
