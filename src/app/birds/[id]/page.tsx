"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ArrowRight, CheckCircle2, Info, Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getBirdById, getAllBirds } from "@/lib/birds";
import { Bird } from "@/types";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ReservationModal } from "@/components/reservation/ReservationModal";
import { CustomCursor } from "@/components/motion/CustomCursor";

interface BirdDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BirdDetailPage({ params }: BirdDetailPageProps) {
  const resolvedParams = use(params);
  const [bird, setBird] = useState<Bird | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [reservationOpen, setReservationOpen] = useState(false);

  useEffect(() => {
    getBirdById(resolvedParams.id).then((found) => {
      setBird(found);
    });
  }, [resolvedParams.id]);

  if (!bird) {
    return (
      <main className="min-h-screen bg-[#08110b] text-[#f5efeb] flex flex-col justify-between font-mono">
        <Navbar onOpenReservation={() => setReservationOpen(true)} />
        <div className="max-w-xl mx-auto text-center py-40 px-6">
          <h2 className="font-serif text-3xl mb-4">Memeriksa Daftar Spesimen...</h2>
          <p className="text-xs text-[#f5efeb]/60 mb-6">
            Jika catatan tidak ditemukan, spesimen ini mungkin sedang dalam tinjauan institusional privat.
          </p>
          <Link
            href="/#collection"
            className="px-6 py-2.5 rounded-full border border-[#b39257] text-[#d6be8c] text-xs uppercase"
          >
            ← Kembali ke Koleksi
          </Link>
        </div>
        <Footer onOpenReservation={() => setReservationOpen(true)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060e08] text-[#f5efeb] selection:bg-[#c5a880]/30 selection:text-[#fbf9f5]">
      <CustomCursor />
      <Navbar onOpenReservation={() => setReservationOpen(true)} />

      {/* Hero Product Profile */}
      <div className="pt-32 pb-24 max-w-[1760px] mx-auto site-gutter">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/#collection"
            className="inline-flex items-center space-x-2 text-xs font-mono text-[#d6be8c] hover:text-[#f5efeb] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Registri Koleksi</span>
          </Link>
        </div>

        {/* ── Main Profile Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Multi-Image Photography Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl bg-[#0d1811]">
              <Image
                src={bird.images[activeImageIdx] || bird.images[0]}
                alt={`Jalak Bali ${bird.publicId}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-70" />

              <div className="absolute top-6 left-6 font-mono text-[9px] uppercase tracking-[0.25em] text-[#d6be8c] bg-[#060e08]/90 px-3.5 py-1.5 rounded-full border border-[#d6be8c]/20 backdrop-blur-md">
                ID Individu: {bird.publicId}
              </div>

              <div className="absolute top-6 right-6">
                <span className="text-[10px] uppercase tracking-widest text-[#08110b] bg-[#38bdf8] px-3.5 py-1 rounded-full font-mono font-bold shadow-md">
                  {bird.status === "available" ? "TERSEDIA" : bird.status === "reserved" ? "DIPESAN" : "DALAM VERIFIKASI"}
                </span>
              </div>
            </div>

            {/* Thumbnail switcher */}
            {bird.images.length > 1 && (
              <div className="flex space-x-3">
                {bird.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      activeImageIdx === idx
                        ? "border-[#b39257] scale-102"
                        : "border-[#d6be8c]/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt="Thumbnail"
                      fill
                      className="object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Luxury Dossier & Specifications (5 Cols) */}
          <div className="lg:col-span-5 space-y-8 font-mono">
            <div>
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-[#b39257] mb-2">
                <span>Leucopsar Rothschildi</span>
                <span>·</span>
                <span>Hasil Penangkaran F2</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl text-[#f5efeb] font-light">
                {bird.name}
              </h1>
              <p className="text-sm text-[#d6be8c] mt-1">
                ID Individu: {bird.publicId} · Cincin Tertutup: {bird.ringTag}
              </p>
            </div>

            {/* Biometric Snapshot Card */}
            <div className="p-6 rounded-2xl bg-[#0d1811] border border-[#d6be8c]/20 space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-[#d6be8c]/15">
                <span className="text-[#f5efeb]/60">Menetas</span>
                <span className="text-[#f5efeb]">{bird.hatchDate} ({bird.age})</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#d6be8c]/15">
                <span className="text-[#f5efeb]/60">Jenis Kelamin</span>
                <span className="text-[#f5efeb]">{bird.sex === "male" ? "Jantan" : "Betina"} (Terkonfirmasi DNA)</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#d6be8c]/15">
                <span className="text-[#f5efeb]/60">Tipe Penangkaran</span>
                <span className="text-[#38bdf8]">100% Hasil Penangkaran</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#d6be8c]/15">
                <span className="text-[#f5efeb]/60">Buku Induk Silsilah</span>
                <span className="text-[#d6be8c]">Tersedia setelah verifikasi</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#f5efeb]/60">Transponder Microchip</span>
                <span className="text-[#f5efeb]">{bird.microchipId}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#b39257] block">
                Profil Etologis & Morfometri
              </span>
              <p className="font-sans text-sm text-[#f5efeb]/80 font-light leading-relaxed">
                {bird.description}
              </p>
            </div>

            {/* Health & Care Information */}
            <div className="p-4 rounded-xl bg-[#101e14] border border-[#b39257]/30 space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-[#38bdf8]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  Verifikasi Kesehatan & Perawatan
                </span>
              </div>
              <p className="text-[11px] text-[#f5efeb]/75 font-sans pt-1">
                {bird.healthCareInfo}
              </p>
            </div>

            {/* Editorial Pricing & Deposit Breakdown */}
            <div className="p-6 rounded-2xl bg-[#0d1811] border border-[#d6be8c]/25 space-y-3 text-xs">
              <div className="flex justify-between text-[#f5efeb]/60">
                <span>Total Harga Alokasi</span>
                <span className="text-base text-[#f5efeb]">Rp {bird.price?.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-[#b39257] text-sm items-baseline">
                <span>Deposit Reservasi</span>
                <span className="font-serif text-2xl text-[#d6be8c] font-bold">
                  Rp {bird.deposit?.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[#f5efeb]/50 pt-1 border-t border-[#d6be8c]/15">
                <span>Sisa Pembayaran saat Serah Terima</span>
                <span>Rp {bird.remaining?.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="flex items-start space-x-2.5 text-[11px] text-[#f5efeb]/60">
              <Info className="w-3.5 h-3.5 text-[#b39257] flex-shrink-0 mt-0.5" />
              <span>{bird.legalNote}</span>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <Link href={`/reserve?type=individual&birdId=${bird.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-cursor="RESERVE"
                  className="w-full py-4 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-[0_10px_30px_rgba(179,146,87,0.3)] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Reservasi Individu ({bird.publicId})</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
