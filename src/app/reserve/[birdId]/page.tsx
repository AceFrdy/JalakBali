"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ReservationModal } from "@/components/reservation/ReservationModal";

interface ReserveBirdPageProps {
  params: Promise<{ birdId: string }>;
}

export default function ReserveBirdPage({ params }: ReserveBirdPageProps) {
  const resolvedParams = use(params);
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <main className="min-h-screen bg-[#060e08] text-[#f5efeb]">
      <Navbar onOpenReservation={() => setModalOpen(true)} />

      <div className="pt-32 pb-20 max-w-xl mx-auto px-6 text-center font-mono space-y-6">
        <Link
          href={`/birds/${resolvedParams.birdId}`}
          className="inline-flex items-center space-x-2 text-xs text-[#d6be8c] hover:text-[#f5efeb] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Profil Spesimen</span>
        </Link>

        <h1 className="font-serif text-3xl">Memulai Penangguhan Reservasi</h1>
        <p className="text-xs text-[#f5efeb]/70">
          ID Spesimen Target: <span className="text-[#38bdf8] font-bold">{resolvedParams.birdId}</span>
        </p>

        <button
          onClick={() => setModalOpen(true)}
          className="px-8 py-3 rounded-full bg-[#b39257] text-[#08110b] text-xs uppercase tracking-wider font-bold"
        >
          Buka Manifes Reservasi
        </button>
      </div>

      <Footer onOpenReservation={() => setModalOpen(true)} />

      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialBirdId={resolvedParams.birdId}
        initialType="individual"
      />
    </main>
  );
}
