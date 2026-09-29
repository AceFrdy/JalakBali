import { BirdIntroduction } from "@/components/BirdIntroduction";
import { Characteristics } from "@/components/Characteristics";
import { Conservation } from "@/components/Conservation";
import { FinalSection } from "@/components/FinalSection";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Habitat } from "@/components/Habitat";
import { Hero } from "@/components/Hero";
import { Statistics } from "@/components/Statistics";
import { Timeline } from "@/components/Timeline";
import { Navbar } from "@/components/Navbar";
import { RevealInit } from "@/components/RevealInit";

export default function Home() {
  return (
    <main className="experience">
      <RevealInit />
      <Navbar />
      <Hero />
      <BirdIntroduction />
      <Characteristics />
      <Habitat />
      <Conservation />
      <Timeline />
      <Statistics />
      <Gallery />
      <FinalSection />
      <Footer />
    </main>
  );
}

