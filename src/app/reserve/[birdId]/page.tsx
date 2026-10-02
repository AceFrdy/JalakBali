"use client";

import { use } from "react";
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

  return (
    <main className="min-h-screen bg-[#060e08] text-[#f5efeb] selection:bg-[#c5a880]/30 selection:text-[#fbf9f5]">
      <Navbar />

      <div className="pt-28 pb-20 max-w-[1760px] mx-auto site-gutter">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/birds/${resolvedParams.birdId}`}
            className="inline-flex items-center space-x-2 text-xs font-mono text-[#d6be8c] hover:text-[#f5efeb] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Profil Spesimen ({resolvedParams.birdId})</span>
          </Link>
        </div>

        <div className="mb-8 text-center max-w-2xl mx-auto font-mono">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#b39257] block mb-2">
            Alokasi Penangkaran Legal & Terverifikasi
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#f5efeb] font-light">
            Manifes Reservasi Spesimen
          </h1>
          <p className="text-xs text-[#f5efeb]/70 mt-2 font-sans">
            Target Spesimen: <span className="text-[#38bdf8] font-bold font-mono">{resolvedParams.birdId}</span>
          </p>
        </div>

        <ReservationModal
          isModal={false}
          initialBirdId={resolvedParams.birdId}
          initialType="individual"
        />
      </div>

      <Footer />
    </main>
  );
}
