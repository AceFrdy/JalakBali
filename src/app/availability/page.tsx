"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { AvailabilitySection } from "@/components/availability/AvailabilitySection";
import { WeeklyReleaseSection } from "@/components/availability/WeeklyReleaseSection";
import { HandoverScheduleSection } from "@/components/availability/HandoverScheduleSection";
import { ReservationModal } from "@/components/reservation/ReservationModal";
import { WaitlistModal } from "@/components/reservation/WaitlistModal";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { AvailabilitySlot } from "@/types";

export default function AvailabilityPage() {
  const [reservationOpen, setReservationOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [selectedSlotForModal, setSelectedSlotForModal] = useState<string | undefined>();
  const [selectedBirdId, setSelectedBirdId] = useState<string | undefined>();
  const [selectedPairId, setSelectedPairId] = useState<string | undefined>();
  const [resType, setResType] = useState<"individual" | "pair">("individual");

  const handleReserveIndividual = (birdId: string) => {
    setSelectedBirdId(birdId);
    setResType("individual");
    setReservationOpen(true);
  };

  const handleReservePair = (pairId: string) => {
    setSelectedPairId(pairId);
    setResType("pair");
    setReservationOpen(true);
  };

  const handleSelectSlot = (slot: AvailabilitySlot) => {
    setSelectedSlotForModal(slot.id);
    setReservationOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#060e08] text-[#f5efeb] selection:bg-[#c5a880]/30 selection:text-[#fbf9f5]">
      <CustomCursor />
      <Navbar onOpenReservation={() => setReservationOpen(true)} />

      <div className="pt-32 max-w-[1760px] mx-auto site-gutter">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-mono text-[#d6be8c] hover:text-[#f5efeb] transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <WeeklyReleaseSection
        onReserveIndividual={handleReserveIndividual}
        onReservePair={handleReservePair}
        onJoinWaitlist={() => setWaitlistOpen(true)}
      />

      <AvailabilitySection
        onSelectSlot={handleSelectSlot}
        onJoinWaitlist={() => setWaitlistOpen(true)}
      />

      <HandoverScheduleSection />

      <Footer onOpenReservation={() => setReservationOpen(true)} />

      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
        initialReleaseId={selectedSlotForModal}
        initialBirdId={selectedBirdId}
        initialPairId={selectedPairId}
        initialType={resType}
      />

      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </main>
  );
}
