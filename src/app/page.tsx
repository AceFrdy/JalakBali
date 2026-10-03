"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { FloatingReserveButton } from "@/components/navigation/FloatingReserveButton";
import { HeroExperience } from "@/components/hero/HeroExperience";
import { WeeklyReleaseSection } from "@/components/availability/WeeklyReleaseSection";
import { AvailableBirdsSection } from "@/components/birds/AvailableBirdsSection";
import { BirdProvenanceSection } from "@/components/storytelling/BirdProvenanceSection";
import { ResponsibleBreedingSection } from "@/components/breeding/ResponsibleBreedingSection";
import { BreedingLifecycleSection } from "@/components/storytelling/BreedingLifecycleSection";
import { AvailabilitySection } from "@/components/availability/AvailabilitySection";
import { HandoverScheduleSection } from "@/components/availability/HandoverScheduleSection";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { EditorialGallery } from "@/components/gallery/EditorialGallery";
import { FinalCtaSection } from "@/components/hero/FinalCtaSection";
import { Footer } from "@/components/footer/Footer";
import { WaitlistModal } from "@/components/reservation/WaitlistModal";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { AvailabilitySlot } from "@/types";


export default function Home() {
  const router = useRouter();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistPrefType, setWaitlistPrefType] = useState<"individual" | "pair" | "any">("pair");

  const handleReserveIndividual = (birdId: string) => {
    router.push(`/reserve?type=individual&birdId=${encodeURIComponent(birdId)}`);
  };

  const handleReservePair = (pairId: string) => {
    router.push(`/reserve?type=pair&pairId=${encodeURIComponent(pairId)}`);
  };

  const handleSelectSlot = (slot: AvailabilitySlot) => {
    router.push(`/reserve?releaseId=${encodeURIComponent(slot.id)}`);
  };

  const handleJoinWaitlist = (type: "individual" | "pair" | "any" = "pair") => {
    setWaitlistPrefType(type);
    setWaitlistOpen(true);
  };

  const scrollToAvailability = () => {
    const el = document.getElementById("availability");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/reserve");
    }
  };

  const scrollToCollection = () => {
    const el = document.getElementById("collection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0b1610] text-[#f4efe4] selection:bg-[#c5a880]/30 selection:text-[#fbf9f5]">
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Floating CTA for Desktop & Sticky Bottom Bar for Mobile */}
      <FloatingReserveButton />

      {/* 01: Hero Experience with Multi-Layer Parallax */}
      <HeroExperience
        onCheckAvailability={scrollToAvailability}
        onExploreCollection={scrollToCollection}
      />

      {/* 02: Weekly Release Allocation (Single vs Pair Choice) */}
      <WeeklyReleaseSection
        onReserveIndividual={handleReserveIndividual}
        onReservePair={handleReservePair}
        onJoinWaitlist={(t) => handleJoinWaitlist(t)}
      />

      {/* 03: The Current Collection (Asymmetrical Editorial Layout) */}
      <AvailableBirdsSection
        onReserveBird={handleReserveIndividual}
        onReservePair={handleReservePair}
      />

      {/* 04: Traceable From Origin (Linear Vertical Provenance) */}
      <BirdProvenanceSection />

      {/* 05: Responsible Breeding (Ethical Pillars & Overlapping Photography) */}
      <ResponsibleBreedingSection />

      {/* 06: The Breeding Chronology (Horizontal Scroll Lifecycle) */}
      <BreedingLifecycleSection />

      {/* 07: Availability Ledger & Calendar (October 2026 Interactive Ledger) */}
      <AvailabilitySection
        onSelectSlot={handleSelectSlot}
        onJoinWaitlist={() => handleJoinWaitlist("any")}
      />

      {/* 08: Built on Transparency (Row-Based Architecture with Oversized Numbers) */}
      {/* <TrustTransparencySection /> */}

      {/* 09: Handover Schedule & Transit Protocol */}
      <HandoverScheduleSection />

      {/* 10: Editorial Verified Patron Reflections (Horizontal Carousel with Drag Physics) */}
      <ReviewSection />

      {/* 11: Breeding Aviary Archives (Asymmetric Folio Plates) */}
      <EditorialGallery />

      {/* 12: Final Cinematic CTA Section */}
      <FinalCtaSection
        onCheckAvailability={scrollToAvailability}
        onJoinWaitlist={() => handleJoinWaitlist("pair")}
      />

      {/* 13: Luxury Sanctuary & Legal Captive Breeding Footer */}
      <Footer />

      {/* Priority Waitlist Modal */}
      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        preferredType={waitlistPrefType}
      />
    </main>
  );
}
