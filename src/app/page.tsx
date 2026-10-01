"use client";

import { useState } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { FloatingReserveButton } from "@/components/navigation/FloatingReserveButton";
import { HeroExperience } from "@/components/hero/HeroExperience";
import { WeeklyReleaseSection } from "@/components/availability/WeeklyReleaseSection";
import { AvailableBirdsSection } from "@/components/birds/AvailableBirdsSection";
import { BirdProvenanceSection } from "@/components/storytelling/BirdProvenanceSection";
import { ResponsibleBreedingSection } from "@/components/breeding/ResponsibleBreedingSection";
import { BreedingLifecycleSection } from "@/components/storytelling/BreedingLifecycleSection";
import { AvailabilitySection } from "@/components/availability/AvailabilitySection";
import { TrustTransparencySection } from "@/components/storytelling/TrustTransparencySection";
import { HandoverScheduleSection } from "@/components/availability/HandoverScheduleSection";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { EditorialGallery } from "@/components/gallery/EditorialGallery";
import { FinalCtaSection } from "@/components/hero/FinalCtaSection";
import { Footer } from "@/components/footer/Footer";
import { ReservationModal } from "@/components/reservation/ReservationModal";
import { WaitlistModal } from "@/components/reservation/WaitlistModal";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { AvailabilitySlot } from "@/types";

export default function Home() {
  const [reservationOpen, setReservationOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [selectedSlotForModal, setSelectedSlotForModal] = useState<string | undefined>();
  const [selectedBirdId, setSelectedBirdId] = useState<string | undefined>();
  const [selectedPairId, setSelectedPairId] = useState<string | undefined>();
  const [resType, setResType] = useState<"individual" | "pair">("individual");
  const [waitlistPrefType, setWaitlistPrefType] = useState<"individual" | "pair" | "any">("pair");

  const handleOpenReservation = (
    type: "individual" | "pair" = "individual",
    birdId?: string,
    pairId?: string
  ) => {
    setResType(type);
    setSelectedBirdId(birdId);
    setSelectedPairId(pairId);
    setReservationOpen(true);
  };

  const handleReserveIndividual = (birdId: string) => {
    handleOpenReservation("individual", birdId, undefined);
  };

  const handleReservePair = (pairId: string) => {
    handleOpenReservation("pair", undefined, pairId);
  };

  const handleSelectSlot = (slot: AvailabilitySlot) => {
    setSelectedSlotForModal(slot.id);
    setReservationOpen(true);
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
      setReservationOpen(true);
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
      <Navbar onOpenReservation={() => handleOpenReservation("individual")} />

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
      <AvailableBirdsSection onReserveBird={handleReserveIndividual} />

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
      <Footer onOpenReservation={() => handleOpenReservation("individual")} />

      {/* 7-Step Multi-Step Reservation Modal */}
      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
        initialReleaseId={selectedSlotForModal}
        initialBirdId={selectedBirdId}
        initialPairId={selectedPairId}
        initialType={resType}
      />

      {/* Priority Waitlist Modal */}
      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        preferredType={waitlistPrefType}
      />
    </main>
  );
}
