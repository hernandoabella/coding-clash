"use client";

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="p-6 bg-white shadow rounded text-center">
          <h3 className="text-xl font-semibold mb-2">Interactive Quizzes</h3>
          <p>Test your programming knowledge with fun and interactive quizzes.</p>
        </div>
        <div className="p-6 bg-white shadow rounded text-center">
          <h3 className="text-xl font-semibold mb-2">Code Challenges</h3>
          <p>Solve coding problems and improve your logic and algorithm skills.</p>
        </div>
        <div className="p-6 bg-white shadow rounded text-center">
          <h3 className="text-xl font-semibold mb-2">Multiplayer Battles</h3>
          <p>Compete with friends or random players in real-time coding battles.</p>
        </div>
      </div>
    </section>
  );
}
