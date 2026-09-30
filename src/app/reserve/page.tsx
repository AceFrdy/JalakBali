"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ReservationModal } from "@/components/reservation/ReservationModal";
import { WeeklyReleaseSection } from "@/components/availability/WeeklyReleaseSection";

export default function ReserveIndexPage() {
  const [modalOpen, setModalOpen] = useState(true);
  const [selectedBirdId, setSelectedBirdId] = useState<string | undefined>();
  const [selectedPairId, setSelectedPairId] = useState<string | undefined>();
  const [type, setType] = useState<"individual" | "pair">("individual");

  return (
    <main className="min-h-screen bg-[#060e08] text-[#f5efeb]">
      <Navbar onOpenReservation={() => setModalOpen(true)} />

      <div className="pt-32 pb-20 max-w-[1760px] mx-auto site-gutter font-mono">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs text-[#d6be8c] hover:text-[#f5efeb] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>

        <WeeklyReleaseSection
          onReserveIndividual={(id) => {
            setSelectedBirdId(id);
            setType("individual");
            setModalOpen(true);
          }}
          onReservePair={(id) => {
            setSelectedPairId(id);
            setType("pair");
            setModalOpen(true);
          }}
          onJoinWaitlist={() => setModalOpen(true)}
        />
      </div>

      <Footer onOpenReservation={() => setModalOpen(true)} />

      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialBirdId={selectedBirdId}
        initialPairId={selectedPairId}
        initialType={type}
      />
    </main>
  );
}
