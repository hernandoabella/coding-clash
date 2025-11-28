import Hero from "@/landingpage/components/Hero";
import Leaderboard from "@/landingpage/components/Leaderboard";
import Testimonials from "@/landingpage/components/Testimonials";
import Footer from "@/landingpage/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Leaderboard />
      <Testimonials />
      <Footer />
    </main>
  );
}
