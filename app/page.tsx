"use client";

import Features from "./landing_page/components/Features";
import Footer from "./landing_page/components/Footer";
import Header from "./landing_page/components/Header";
import Hero from "./landing_page/components/Hero";
import Testimonials from "./landing_page/components/Testimonials";
import TopPlayers from "./landing_page/components/TopPlayers";

export default function Home() {
  
  return (
    <div>
      <Header />
      <Hero />
      <TopPlayers />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}