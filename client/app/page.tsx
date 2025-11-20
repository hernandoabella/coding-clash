import Hero from "@/landingpage/components/Hero";
import HowItWorks from "@/landingpage/components/Howitworks";
import Leaderboard from "@/landingpage/components/Leaderboard";
import Testimonials from "@/landingpage/components/Testimonials";
import Footer from "@/landingpage/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Leaderboard />
      <Testimonials />
      <Footer />
    </main>
  );
}
