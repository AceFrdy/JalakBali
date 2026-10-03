"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight, Maximize2, X, Info, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getBirdById } from "@/lib/birds";
import { getCatalogBirds } from "@/lib/api";
import { Bird } from "@/types";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CustomCursor } from "@/components/motion/CustomCursor";

interface BirdDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BirdDetailPage({ params }: BirdDetailPageProps) {
  const resolvedParams = use(params);
  const [bird, setBird] = useState<Bird | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certActiveIdx, setCertActiveIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getCatalogBirds()
      .then((apiBirds) => {
        if (!isMounted) return;
        const found = apiBirds.find(
          (b) =>
            b.id.toLowerCase() === resolvedParams.id.toLowerCase() ||
            b.tagging?.toLowerCase() === resolvedParams.id.toLowerCase() ||
            b.publicId?.toLowerCase() === resolvedParams.id.toLowerCase()
        );
        setBird(found || null);
      })
      .catch(() => {
        if (isMounted) setBird(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#08110b] text-[#f5efeb] flex flex-col justify-between font-mono">
        <Navbar />
        <div className="max-w-xl mx-auto text-center py-40 px-6">
          <h2 className="font-serif text-3xl mb-4 text-[#d6be8c] animate-pulse">Memuat Profil Spesimen...</h2>
          <p className="text-xs text-[#f5efeb]/60">
            Mengambil data biometrik dan galeri foto spesimen dari registri.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!bird) {
    return (
      <main className="min-h-screen bg-[#08110b] text-[#f5efeb] flex flex-col justify-between font-mono">
        <Navbar />
        <div className="max-w-xl mx-auto text-center py-40 px-6">
          <h2 className="font-serif text-3xl mb-4">Spesimen Tidak Ditemukan</h2>
          <p className="text-xs text-[#f5efeb]/60 mb-6">
            Spesimen ini mungkin telah berpindah alokasi atau dalam tinjauan privat.
          </p>
          <Link
            href="/birds"
            className="px-6 py-2.5 rounded-full border border-[#b39257] text-[#d6be8c] text-xs uppercase"
          >
            ← Lihat Katalog Spesimen
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const images = bird.images && bird.images.length > 0 ? bird.images : ["/assets/jalak-portrait.png"];
  const currentImage = images[activeImageIdx] || images[0];

  const certificates =
    bird.certificateImages && bird.certificateImages.length > 0
      ? bird.certificateImages
      : ["/assets/jalak-portrait.png", "/assets/jalak-hero.png"];
  const currentCert = certificates[certActiveIdx] || certificates[0];

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const birdTagging = bird.tagging || bird.publicId || bird.id;

  return (
    <main className="min-h-screen bg-[#060e08] text-[#f5efeb] selection:bg-[#c5a880]/30 selection:text-[#fbf9f5]">
      <CustomCursor />
      <Navbar />

      {/* Hero Product Profile */}
      <div className="pt-32 pb-24 max-w-[1760px] mx-auto site-gutter">
        {/* Back Link & Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/birds"
            className="inline-flex items-center space-x-2 text-xs font-mono text-[#d6be8c] hover:text-[#f5efeb] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog Koleksi</span>
          </Link>
        </div>

        {/* ── Main Profile Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Multi-Image Photography Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl bg-[#0d1811] group">
              <Image
                src={currentImage}
                alt={`Jalak Bali ${birdTagging}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center filter brightness-95 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-70 pointer-events-none" />

              {/* Tagging Badge */}
              <div className="absolute top-6 left-6 font-mono text-[9px] uppercase tracking-[0.25em] text-[#d6be8c] bg-[#060e08]/90 px-3.5 py-1.5 rounded-full border border-[#d6be8c]/20 backdrop-blur-md z-10">
                ID Registri: {birdTagging}
              </div>

              {/* Status Badge */}
              <div className="absolute top-6 right-6 z-10">
                <span className="text-[10px] uppercase tracking-widest text-[#08110b] bg-[#38bdf8] px-3.5 py-1 rounded-full font-mono font-bold shadow-md">
                  {bird.status === "available" ? "TERSEDIA" : bird.status === "reserved" ? "DIPESAN" : "DALAM VERIFIKASI"}
                </span>
              </div>

              {/* Expand Lightbox Button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-6 right-6 p-2.5 rounded-full bg-[#08110b]/80 border border-[#d6be8c]/30 text-[#f5efeb] hover:text-[#d6be8c] backdrop-blur-md opacity-80 hover:opacity-100 transition-all cursor-pointer z-10"
                title="Buka Gambar Penuh"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Image Carousel Prev / Next Controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#08110b]/70 border border-[#d6be8c]/20 text-[#f5efeb] hover:bg-[#b39257] hover:text-[#08110b] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 cursor-pointer"
                    aria-label="Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#08110b]/70 border border-[#d6be8c]/20 text-[#f5efeb] hover:bg-[#b39257] hover:text-[#08110b] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 cursor-pointer"
                    aria-label="Foto Selanjutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Switcher & Indicator Bar */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx
                        ? "border-[#b39257] scale-102 ring-2 ring-[#b39257]/30 shadow-lg"
                        : "border-[#d6be8c]/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
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
                Jalak Bali ({birdTagging})
              </h1>
              <p className="text-sm text-[#d6be8c] mt-2">
                Tagging / ID: <span className="text-[#38bdf8] font-bold">{birdTagging}</span>
                {bird.ringTag && <span> · Cincin Tertutup: {bird.ringTag}</span>}
              </p>
            </div>

            {/* Biometric Snapshot Card */}
            <div className="p-6 rounded-2xl bg-[#0d1811] border border-[#d6be8c]/20 space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-[#d6be8c]/15">
                <span className="text-[#f5efeb]/60">Tanggal Menetas / Usia</span>
                <span className="text-[#f5efeb]">
                  {bird.hatchDate ? `${bird.hatchDate} (${bird.age})` : bird.age || "Usia Remaja"}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#d6be8c]/15">
                <span className="text-[#f5efeb]/60">Jenis Kelamin</span>
                <span className="text-[#f5efeb]">
                  {bird.sex === "male" ? "Jantan" : bird.sex === "female" ? "Betina" : "Dalam Konfirmasi"} (Terkonfirmasi DNA)
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#d6be8c]/15">
                <span className="text-[#f5efeb]/60">Garis Keturunan</span>
                <span className="text-[#d6be8c]">{bird.breedingLine || "Penangkaran Terdaftar F2"}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#f5efeb]/60">Tipe Penangkaran</span>
                <span className="text-[#38bdf8]">100% Hasil Penangkaran Berlisensi</span>
              </div>
            </div>

            {/* Description */}
            {bird.description && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#b39257] block">
                  Profil Etologis & Morfometri Spesimen
                </span>
                <p className="font-sans text-sm text-[#f5efeb]/80 font-light leading-relaxed">
                  {bird.description}
                </p>
              </div>
            )}

            {/* Interactive Verification Guarantee Card (Clickable to open Certificate Popup Modal) */}
            <div
              onClick={() => setCertModalOpen(true)}
              className="p-5 rounded-2xl bg-[#101e14] border border-[#b39257]/40 hover:border-[#b39257] transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between text-[#38bdf8] mb-1.5">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    Sertifikasi & Garansi Penangkaran
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#d6be8c] underline group-hover:text-[#f5efeb] flex items-center gap-1 font-mono">
                  <span>Lihat Dokumen</span>
                  <FileText className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="text-[11px] text-[#f5efeb]/80 font-sans leading-relaxed">
                Spesimen ini dilengkapi dengan cincin tertutup terdaftar, sertifikat asal-usul avikultural, dan garansi kesehatan penuh saat serah terima.
              </p>
            </div>

            {/* Editorial Pricing & Deposit Breakdown */}
            <div className="p-6 rounded-2xl bg-[#0d1811] border border-[#d6be8c]/25 space-y-3 text-xs">
              <div className="flex justify-between text-[#f5efeb]/60">
                <span>Total Harga Alokasi</span>
                <span className="text-base text-[#f5efeb]">
                  Rp {bird.price ? bird.price.toLocaleString("id-ID") : "32.500.000"}
                </span>
              </div>
              <div className="flex justify-between text-[#b39257] text-sm items-baseline">
                <span>Deposit Reservasi</span>
                <span className="font-serif text-2xl text-[#d6be8c] font-bold">
                  Rp {bird.deposit ? bird.deposit.toLocaleString("id-ID") : "5.000.000"}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[#f5efeb]/50 pt-1 border-t border-[#d6be8c]/15">
                <span>Sisa Pembayaran saat Serah Terima</span>
                <span>
                  Rp {bird.remaining ? bird.remaining.toLocaleString("id-ID") : "27.500.000"}
                </span>
              </div>
            </div>

            {/* Legal Notice & Requested SATS_DN Description */}
            <div className="p-4 rounded-xl bg-[#0d1811]/90 border border-[#d6be8c]/20 space-y-2 text-xs font-mono">
              <div className=" font-bold text-[#38bdf8] flex items-center space-x-2">
                {/* <span className="" /> */}
                <Info className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span>SATS_DN akan diurus setelah pelunasan</span>
              </div>
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
                  <span>Reservasi Individu ({birdTagging})</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Fullscreen Modal for Bird Photos */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#060e08]/96 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-[#08110b] border border-[#d6be8c]/30 text-[#f5efeb] hover:text-[#b39257] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-5xl aspect-[4/3] rounded-3xl overflow-hidden border border-[#d6be8c]/20 shadow-2xl">
              <Image
                src={currentImage}
                alt={`Lightbox ${birdTagging}`}
                fill
                className="object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-[#08110b]/80 border border-[#d6be8c]/30 text-[#f5efeb] hover:bg-[#b39257] hover:text-[#08110b] cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-[#08110b]/80 border border-[#d6be8c]/30 text-[#f5efeb] hover:bg-[#b39257] hover:text-[#08110b] cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificate & Verification Modal Popup */}
      <AnimatePresence>
        {certModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#060e08]/96 backdrop-blur-2xl flex items-center justify-center p-4 font-mono"
          >
            <div className="relative w-full max-w-4xl bg-[#0d1811] border border-[#d6be8c]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[#d6be8c]/20 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#b39257] block">
                    Dokumen & Sertifikat Avikultural
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#f5efeb] font-light mt-1">
                    Pratinjau Sertifikat Spesimen ({birdTagging})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="p-2 rounded-full bg-[#08110b] border border-[#d6be8c]/30 text-[#f5efeb] hover:text-[#b39257] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Certificate Image Viewport */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#060e08] border border-[#d6be8c]/20 shadow-inner">
                <Image
                  src={currentCert}
                  alt={`Sertifikat ${birdTagging}`}
                  fill
                  className="object-contain"
                />

                {certificates.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCertActiveIdx((prev) => (prev - 1 + certificates.length) % certificates.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#08110b]/80 border border-[#d6be8c]/30 text-[#f5efeb] hover:bg-[#b39257] hover:text-[#08110b] cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCertActiveIdx((prev) => (prev + 1) % certificates.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#08110b]/80 border border-[#d6be8c]/30 text-[#f5efeb] hover:bg-[#b39257] hover:text-[#08110b] cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Certificate Description & SATS_DN Notice */}
              <div className="p-4 rounded-xl bg-[#08110b] border border-[#d6be8c]/15 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-[#d6be8c]">
                  <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                  <span>Sertifikat Resmi Penangkaran & Asal-Usul Avikultural</span>
                </div>
                <p className="text-[11px] text-[#f5efeb]/75 font-sans leading-relaxed">
                  Dokumen legalitas resmi serta sertifikat kesehatan asli akan diserahkan langsung saat serah terima spesimen.
                </p>
                <div className="pt-2 border-t border-[#d6be8c]/10 text-xs text-[#38bdf8] font-bold">
                  • SATS_DN akan diurus setelah pelunasan
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
