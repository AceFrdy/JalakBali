"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Tag, Info, ChevronLeft, ChevronRight, Users, User, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getHomepageBirds, getHomepagePairs } from "@/lib/api";
import { Bird, BirdPairCatalog } from "@/types";
import { TextReveal } from "@/components/motion/TextReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { FadeIn } from "@/components/motion/FadeIn";

interface AvailableBirdsSectionProps {
  onReserveBird: (birdId: string) => void;
  onReservePair?: (pairId: string) => void;
}

function BirdRow({
  bird,
  index,
  onReserveBird,
}: {
  bird: Bird;
  index: number;
  onReserveBird: (id: string) => void;
}) {
  const isEven = index % 2 === 0;
  const sexLabel =
    bird.sex === "male" ? "Jantan" : bird.sex === "female" ? "Betina" : "Unknown";

  const validImages = (bird.images ?? []).filter(
    (s) => typeof s === "string" && s.trim() !== ""
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentImageIndex = activeImageIndex >= validImages.length ? 0 : activeImageIndex;
  const currentImage = validImages[currentImageIndex] ?? null;
  const hasMultipleImages = validImages.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const displayAge =
    bird.age?.replace(/(\d+\.\d+)/g, (m) => String(Math.round(parseFloat(m)))) || bird.age;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-14 items-center">
      {/* ── Image column ── */}
      <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
        <ImageReveal direction="bottom" duration={1.1}>
          <div
            data-cursor="INSPECT"
            className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl group select-none"
          >
            {currentImage ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentImage}
                    alt={`Jalak Bali ${bird.publicId} - Foto ${currentImageIndex + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0d1811]">
                <span className="font-mono text-[10px] text-[#b39257]/60 uppercase tracking-widest">
                  Foto belum tersedia
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#060e08]/95 via-[#060e08]/20 to-transparent opacity-90 pointer-events-none" />

            {/* Previous & Next Navigation */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Foto sebelumnya"
                  className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#060e08]/75 hover:bg-[#b39257] text-[#f5efeb] hover:text-[#08110b] border border-[#d6be8c]/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Foto selanjutnya"
                  className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#060e08]/75 hover:bg-[#b39257] text-[#f5efeb] hover:text-[#08110b] border border-[#d6be8c]/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}

            {/* Thumbnails switcher */}
            {hasMultipleImages && (
              <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 z-20 flex gap-1.5 sm:gap-2 items-center">
                {validImages.map((img, i) => {
                  const isActive = i === currentImageIndex;
                  return (
                    <button
                      key={img}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(i);
                      }}
                      className={`relative w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer shadow-lg ${
                        isActive
                          ? "border-[#b39257] ring-2 ring-[#b39257]/70 scale-105 opacity-100"
                          : "border-[#d6be8c]/30 opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-cover object-center"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Registry badge + Photo counter */}
            <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10 flex items-center gap-1.5 sm:gap-2">
              <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#d6be8c] bg-[#060e08]/90 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[#d6be8c]/20 backdrop-blur-md shadow-md">
                ID: {bird.publicId}
              </div>
              {hasMultipleImages && (
                <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.1em] text-[#f5efeb] bg-[#060e08]/90 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border border-[#d6be8c]/20 backdrop-blur-md shadow-md">
                  {currentImageIndex + 1}/{validImages.length}
                </div>
              )}
            </div>

            {/* Status badge */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-[#08110b] bg-[#38bdf8] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-mono font-bold shadow-md">
                {bird.status.toUpperCase()}
              </span>
            </div>

            {/* Bottom annotation */}
            <div className="absolute bottom-2.5 left-3 sm:bottom-5 sm:left-5 z-10 font-mono pointer-events-none max-w-[55%] sm:max-w-none">
              <span className="text-[9px] sm:text-[10px] text-[#b39257] uppercase tracking-widest block truncate">
                Cincin: {bird.ringTag ?? "—"}
              </span>
              <span className="text-base sm:text-xl font-serif text-[#f5efeb] truncate block">
                {bird.publicId} · {displayAge}
              </span>
            </div>
          </div>
        </ImageReveal>
      </div>

      {/* ── Dossier column ── */}
      <FadeIn
        direction={isEven ? "left" : "right"}
        delay={0.2}
        className={isEven ? "order-2 space-y-2.5 sm:space-y-3.5" : "order-2 lg:order-1 space-y-2.5 sm:space-y-3.5"}
      >
        <div>
          <div className="flex items-center space-x-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#b39257] font-mono mb-1">
            <Tag className="w-3 h-3 shrink-0" />
            <span>
              Spesimen No. {String(index + 1).padStart(2, "0")} · {sexLabel}
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#f5efeb] tracking-tight">
            {bird.publicId}
          </h3>

          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-[#d6be8c] font-mono mt-0.5">
            Menetas: {bird.hatchDate ?? "—"} · DNA {sexLabel}
          </p>
        </div>

        {bird.description && (
          <p className="text-xs sm:text-sm text-[#f5efeb]/75 font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
            {bird.description}
          </p>
        )}

        {/* Pricing box */}
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0d1811] border border-[#d6be8c]/20 space-y-1.5 sm:space-y-2 font-mono text-[11px] sm:text-xs">
          <div className="flex justify-between text-[#f5efeb]/60 pb-1.5 border-b border-[#d6be8c]/15">
            <span>Harga Penuh</span>
            <span className="text-[#f5efeb] text-right">
              Rp {bird.price?.toLocaleString("id-ID") ?? "—"}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-0.5">
            <span className="text-[#b39257] text-[11px] sm:text-xs">Deposit Reservasi</span>
            <span className="font-serif text-lg sm:text-2xl text-[#d6be8c]">
              Rp {bird.deposit?.toLocaleString("id-ID") ?? "—"}
            </span>
          </div>
          <div className="flex justify-between text-[10px] sm:text-[11px] text-[#f5efeb]/50">
            <span className="shrink-0 mr-2">Sisa Pembayaran</span>
            <span className="text-right">
              Rp {bird.remaining?.toLocaleString("id-ID") ?? "—"} (Saat Serah Terima)
            </span>
          </div>
        </div>

        {/* SATS_DN notice */}
        <div className="py-2 px-3 sm:p-3 rounded-lg sm:rounded-xl bg-[#0d1811]/90 border border-[#d6be8c]/20 text-[10px] sm:text-xs font-mono">
          <div className="font-bold text-[#38bdf8] flex items-center space-x-2">
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38bdf8] shrink-0" />
            <span>SATS_DN akan diurus setelah pelunasan</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-1 flex flex-row gap-2.5 sm:gap-4 font-mono">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onReserveBird(bird.id)}
            data-cursor="RESERVE"
            className="flex-1 px-4 py-2.5 sm:py-3.5 sm:px-7 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-[0.2em] font-semibold transition-all shadow-md flex items-center justify-center space-x-1.5 sm:space-x-2 cursor-pointer whitespace-nowrap"
          >
            <span>Reservasi Individu</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>

          <Link
            href={`/birds/${bird.publicId}`}
            className="flex-1 px-4 py-2.5 sm:py-3.5 sm:px-7 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] hover:text-[#d6be8c] text-[#f5efeb] text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-[0.2em] transition-all text-center flex items-center justify-center space-x-1.5 sm:space-x-2 whitespace-nowrap"
          >
            <span>Periksa Profil</span>
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}

function PairRow({
  pair,
  index,
  onReservePair,
}: {
  pair: BirdPairCatalog;
  index: number;
  onReservePair?: (id: string) => void;
}) {
  const isEven = index % 2 === 0;

  const maleImages = (pair.birdA?.images ?? []).filter((s) => typeof s === "string" && s.trim() !== "");
  const femaleImages = (pair.birdB?.images ?? []).filter((s) => typeof s === "string" && s.trim() !== "");

  const maleImage = maleImages[0] ?? null;
  const femaleImage = femaleImages[0] ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-14 items-center">
      {/* ── Dual Image column (Male & Female side-by-side) ── */}
      <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
        <ImageReveal direction="bottom" duration={1.1}>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Male Bird Image */}
            <div className="relative aspect-[4/5] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl group select-none">
              {maleImage ? (
                <Image
                  src={maleImage}
                  alt={`Jantan ${pair.birdA?.publicId ?? "Male"}`}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0d1811]">
                  <span className="font-mono text-[9px] text-[#b39257]/60 uppercase tracking-widest text-center px-2">
                    Foto Jantan
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060e08]/95 via-[#060e08]/20 to-transparent opacity-90 pointer-events-none" />

              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-[#08110b] bg-[#38bdf8] px-2 py-0.5 rounded-full font-bold shadow-md">
                  Jantan ♂
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 z-10 font-mono text-left pointer-events-none">
                <span className="text-[8px] sm:text-[9px] text-[#b39257] uppercase tracking-widest block truncate">
                  Cincin: {pair.birdA?.ringTag ?? "—"}
                </span>
                <span className="text-sm sm:text-base font-serif text-[#f5efeb] block truncate">
                  {pair.birdA?.publicId}
                </span>
              </div>
            </div>

            {/* Female Bird Image */}
            <div className="relative aspect-[4/5] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl group select-none">
              {femaleImage ? (
                <Image
                  src={femaleImage}
                  alt={`Betina ${pair.birdB?.publicId ?? "Female"}`}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0d1811]">
                  <span className="font-mono text-[9px] text-[#b39257]/60 uppercase tracking-widest text-center px-2">
                    Foto Betina
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060e08]/95 via-[#060e08]/20 to-transparent opacity-90 pointer-events-none" />

              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-[#08110b] bg-[#f472b6] px-2 py-0.5 rounded-full font-bold shadow-md">
                  Betina ♀
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 z-10 font-mono text-left pointer-events-none">
                <span className="text-[8px] sm:text-[9px] text-[#b39257] uppercase tracking-widest block truncate">
                  Cincin: {pair.birdB?.ringTag ?? "—"}
                </span>
                <span className="text-sm sm:text-base font-serif text-[#f5efeb] block truncate">
                  {pair.birdB?.publicId}
                </span>
              </div>
            </div>
          </div>
        </ImageReveal>
      </div>

      {/* ── Dossier column for Pair ── */}
      <FadeIn
        direction={isEven ? "left" : "right"}
        delay={0.2}
        className={isEven ? "order-2 space-y-2.5 sm:space-y-3.5" : "order-2 lg:order-1 space-y-2.5 sm:space-y-3.5"}
      >
        <div>
          <div className="flex items-center space-x-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#b39257] font-mono mb-1">
            <Heart className="w-3 h-3 text-[#f472b6] shrink-0" />
            <span>
              Set Pasangan Indukan No. {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#f5efeb] tracking-tight">
            Pasangan {pair.pairTag}
          </h3>

          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-[#d6be8c] font-mono mt-0.5">
            Kombinasi: {pair.birdA?.publicId} (♂) × {pair.birdB?.publicId} (♀)
          </p>
        </div>

        {pair.description && (
          <p className="text-xs sm:text-sm text-[#f5efeb]/75 font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
            {pair.description}
          </p>
        )}

        {/* Pricing box for Pair */}
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0d1811] border border-[#d6be8c]/20 space-y-1.5 sm:space-y-2 font-mono text-[11px] sm:text-xs">
          <div className="flex justify-between text-[#f5efeb]/60 pb-1.5 border-b border-[#d6be8c]/15">
            <span>Harga Pasangan (2 Burung)</span>
            <span className="text-[#f5efeb] text-right">
              Rp {pair.price?.toLocaleString("id-ID") ?? "—"}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-0.5">
            <span className="text-[#b39257] text-[11px] sm:text-xs">Deposit Reservasi Set</span>
            <span className="font-serif text-lg sm:text-2xl text-[#d6be8c]">
              Rp {pair.deposit?.toLocaleString("id-ID") ?? "—"}
            </span>
          </div>
          <div className="flex justify-between text-[10px] sm:text-[11px] text-[#f5efeb]/50">
            <span className="shrink-0 mr-2">Sisa Pembayaran</span>
            <span className="text-right">
              Rp {pair.remaining?.toLocaleString("id-ID") ?? "—"} (Saat Serah Terima)
            </span>
          </div>
        </div>

        {/* SATS_DN notice */}
        <div className="py-2 px-3 sm:p-3 rounded-lg sm:rounded-xl bg-[#0d1811]/90 border border-[#d6be8c]/20 text-[10px] sm:text-xs font-mono">
          <div className="font-bold text-[#38bdf8] flex items-center space-x-2">
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38bdf8] shrink-0" />
            <span>2 Berkas SATS_DN akan diterbitkan setelah pelunasan</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-1 flex flex-row gap-2.5 sm:gap-4 font-mono">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onReservePair?.(pair.id)}
            data-cursor="RESERVE"
            className="flex-1 px-4 py-2.5 sm:py-3.5 sm:px-7 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-[0.2em] font-semibold transition-all shadow-md flex items-center justify-center space-x-1.5 sm:space-x-2 cursor-pointer whitespace-nowrap"
          >
            <span>Reservasi Pasangan</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>

          <Link
            href="/birds?type=pair"
            className="flex-1 px-4 py-2.5 sm:py-3.5 sm:px-7 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] hover:text-[#d6be8c] text-[#f5efeb] text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-[0.2em] transition-all text-center flex items-center justify-center space-x-1.5 sm:space-x-2 whitespace-nowrap"
          >
            <span>Semua Pasangan</span>
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}

export function AvailableBirdsSection({ onReserveBird, onReservePair }: AvailableBirdsSectionProps) {
  const [activeTab, setActiveTab] = useState<"individual" | "pair">("individual");
  const [birds, setBirds] = useState<Bird[]>([]);
  const [pairs, setPairs] = useState<BirdPairCatalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all([
      getHomepageBirds().catch(() => [] as Bird[]),
      getHomepagePairs().catch(() => [] as BirdPairCatalog[]),
    ])
      .then(([birdsData, pairsData]) => {
        setBirds(birdsData);
        setPairs(pairsData);
      })
      .catch((error: unknown) =>
        setLoadError(
          error instanceof Error ? error.message : "Katalog spesimen tidak dapat dimuat."
        )
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section
      id="collection"
      className="relative py-16 sm:py-24 md:py-32 bg-[#060e08] text-[#f5efeb] border-t border-[#d6be8c]/15"
    >
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 md:mb-16 gap-6 border-b border-[#d6be8c]/15 pb-8">
          <div>
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-2.5">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Registri Aviari Resmi · Profil Spesimen Terpilih
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#f5efeb] tracking-tight">
              <TextReveal text="Koleksi" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">Terkini</span>
            </h2>
          </div>

          {/* Category Tabs Switcher (Individu / Pasangan) */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#0d1811] border border-[#d6be8c]/25 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("individual")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === "individual"
                  ? "bg-[#b39257] text-[#08110b] font-bold shadow-md"
                  : "text-[#f5efeb]/70 hover:text-[#f5efeb]"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Individu ({birds.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pair")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeTab === "pair"
                  ? "bg-[#b39257] text-[#08110b] font-bold shadow-md"
                  : "text-[#f5efeb]/70 hover:text-[#f5efeb]"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Pasangan ({pairs.length})</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="py-20 text-center font-mono text-xs text-[#d6be8c]">
            Memuat katalog koleksi terkini...
          </div>
        ) : loadError ? (
          <div className="py-20 text-center font-mono text-xs text-red-300">
            {loadError}
          </div>
        ) : activeTab === "individual" ? (
          birds.length === 0 ? (
            <div className="py-16 text-center font-mono text-xs text-[#d6be8c]/70 bg-[#0d1811] rounded-2xl border border-[#d6be8c]/20 p-8">
              Belum ada burung individu yang ditandai untuk ditampilkan di halaman depan.
              <p className="mt-2 text-[#f5efeb]/50">
                Aktifkan opsi &quot;Tampilkan di Halaman Depan&quot; pada data burung di Admin Panel.
              </p>
            </div>
          ) : (
            <div className="space-y-16 sm:space-y-24 md:space-y-32">
              {birds.map((bird, i) => (
                <BirdRow key={bird.id} bird={bird} index={i} onReserveBird={onReserveBird} />
              ))}
            </div>
          )
        ) : pairs.length === 0 ? (
          <div className="py-16 text-center font-mono text-xs text-[#d6be8c]/70 bg-[#0d1811] rounded-2xl border border-[#d6be8c]/20 p-8">
            Belum ada pasangan indukan yang ditandai untuk ditampilkan di halaman depan.
            <p className="mt-2 text-[#f5efeb]/50">
              Buat set pasangan baru dan aktifkan &quot;Tampilkan di Halaman Depan&quot; pada menu <strong>Pasangan Burung</strong> di Admin Panel.
            </p>
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-24 md:space-y-32">
            {pairs.map((pair, i) => (
              <PairRow key={pair.id} pair={pair} index={i} onReservePair={onReservePair} />
            ))}
          </div>
        )}

        {/* CTA */}
        <FadeIn direction="up" delay={0.2} className="mt-14 sm:mt-18 text-center">
          <Link
            href={activeTab === "pair" ? "/birds?type=pair" : "/birds?type=individual"}
            className="inline-flex items-center space-x-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#b39257]/15 hover:bg-[#b39257] border border-[#b39257] text-[#f5efeb] hover:text-[#08110b] font-mono text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-xl group"
          >
            <span>
              {activeTab === "pair"
                ? "Jelajahi Seluruh Katalog Pasangan"
                : "Jelajahi Seluruh Katalog Individu"}
            </span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
