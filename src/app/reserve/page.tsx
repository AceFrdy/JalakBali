"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ReservationModal } from "@/components/reservation/ReservationModal";

function ReserveContent() {
  const searchParams = useSearchParams();
  const birdId = searchParams.get("birdId") || undefined;
  const pairId = searchParams.get("pairId") || undefined;
  const releaseId = searchParams.get("releaseId") || undefined;
  const typeParam = searchParams.get("type");
  const initialType = typeParam === "pair" ? "pair" : "individual";

  return (
    <div className="pt-28 pb-20 max-w-[1760px] mx-auto site-gutter">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-mono text-[#d6be8c] hover:text-[#f5efeb] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
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
          Lengkapi formulir permohonan reservasi di bawah ini untuk memulai proses verifikasi legalitas dan alokasi spesimen Jalak Bali.
        </p>
      </div>

      <ReservationModal
        isModal={false}
        initialBirdId={birdId}
        initialPairId={pairId}
        initialReleaseId={releaseId}
        initialType={initialType}
      />
    </div>
  );
}

export default function ReserveIndexPage() {
  return (
    <main className="min-h-screen bg-[#060e08] text-[#f5efeb] selection:bg-[#c5a880]/30 selection:text-[#fbf9f5]">
      <Navbar />
      <Suspense fallback={<div className="pt-32 pb-20 text-center font-mono text-xs text-[#d6be8c]">Memuat Manifes Reservasi...</div>}>
        <ReserveContent />
      </Suspense>
      <Footer />
    </main>
  );
}
