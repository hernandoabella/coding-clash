import Footer from "../landingpage/components/Footer";
import Hero from "../landingpage/components/Hero";
import Testimonials from "../landingpage/components/Testimonials";
import Leaderboard from "../landingpage/components/Leaderboard";


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
