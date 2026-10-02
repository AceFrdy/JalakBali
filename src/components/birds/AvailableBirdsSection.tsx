"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Tag, Info } from "lucide-react";
import { motion } from "framer-motion";
import { getCatalogBirds } from "@/lib/api";
import { Bird } from "@/types";
import { TextReveal } from "@/components/motion/TextReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { FadeIn } from "@/components/motion/FadeIn";

interface AvailableBirdsSectionProps {
  onReserveBird: (birdId: string) => void;
}

export function AvailableBirdsSection({ onReserveBird }: AvailableBirdsSectionProps) {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getCatalogBirds()
      .then(setBirds)
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : "Katalog bird tidak dapat dimuat."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || loadError || birds.length < 3) {
    return (
      <section id="collection" className="relative py-28 md:py-36 bg-[#060e08] text-[#f5efeb] border-t border-[#d6be8c]/15">
        <div className="max-w-[1760px] mx-auto site-gutter">
          <p className="text-xs font-mono text-[#d6be8c]">
            {isLoading ? "Memuat katalog aviari..." : loadError || "Katalog bird belum tersedia."}
          </p>
        </div>
      </section>
    );
  }

  const bird1 = birds[0];
  const bird2 = birds[1];
  const bird3 = birds[2];

  return (
    <section id="collection" className="relative py-28 md:py-36 bg-[#060e08] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 border-b border-[#d6be8c]/15 pb-10">
          <div>
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-3">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Registri Aviari Resmi · Profil Spesimen Individu
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
              <TextReveal text="Koleksi" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">Terkini</span>
            </h2>
          </div>

          <FadeIn direction="left" delay={0.2} className="max-w-md font-mono text-xs text-[#f5efeb]/70 space-y-2">
            <p className="font-light leading-relaxed">
              Setiap individu Jalak Bali yang ditampilkan di sini adalah hasil penangkaran di bawah kondisi aviari yang terawasi. Masing-masing memiliki cincin logam tertutup terdaftar, sertifikasi jenis kelamin DNA, dan silsilah studbook yang dapat dilacak.
            </p>
          </FadeIn>
        </div>

        {/* ── Asymmetric Editorial Layout ── */}
        <div className="space-y-28 md:space-y-36">
          {/* ── ROW 1: Bird #01 Large Portrait (7 cols) + Editorial Dossier (5 cols) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Visual Frame: Large Portrait */}
            <div className="lg:col-span-7 relative">
              <ImageReveal direction="bottom" duration={1.1}>
                <div
                  data-cursor="INSPECT"
                  className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl group cursor-pointer"
                >
                  <Image
                    src={bird1.images[0]}
                    alt={`Jalak Bali ${bird1.publicId}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center filter brightness-95 group-hover:scale-104 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-85" />

                  {/* Floating Identifier Badge */}
                  <div className="absolute top-6 left-6 font-mono text-[9px] uppercase tracking-[0.25em] text-[#d6be8c] bg-[#060e08]/90 px-3.5 py-1.5 rounded-full border border-[#d6be8c]/20 backdrop-blur-md">
                    ID Registri: {bird1.publicId}
                  </div>

                  <div className="absolute top-6 right-6">
                    <span className="text-[9px] uppercase tracking-widest text-[#08110b] bg-[#38bdf8] px-3 py-1 rounded-full font-mono font-bold shadow-md">
                      {bird1.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Bottom Annotation Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-[#b39257] uppercase tracking-widest block">
                        Nomor Cincin: {bird1.ringTag}
                      </span>
                      <span className="text-2xl font-serif text-[#f5efeb]">
                        {bird1.name} · {bird1.age}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#f5efeb]/60 uppercase tracking-widest">
                      Hasil Penangkaran F2
                    </span>
                  </div>
                </div>
              </ImageReveal>
            </div>

            {/* Content Dossier */}
            <FadeIn direction="left" delay={0.2} className="lg:col-span-5 space-y-6 lg:pl-2">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono">
                <Tag className="w-3 h-3" />
                <span>Spesimen No. 01 · Jantan</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#f5efeb]">
                {bird1.name} ({bird1.publicId})
              </h3>

              <p className="text-xs uppercase tracking-wider text-[#d6be8c] font-mono">
                Tanggal Menetas: {bird1.hatchDate} · Jenis Kelamin DNA Jantan
              </p>

              <p className="text-sm text-[#f5efeb]/75 font-light leading-relaxed">
                {bird1.description}
              </p>

              {/* Editorial Pricing Box */}
              <div className="p-5 rounded-2xl bg-[#0d1811] border border-[#d6be8c]/20 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-[#f5efeb]/60 pb-2 border-b border-[#d6be8c]/15">
                  <span>Status Silsilah</span>
                  <span className="text-[#d6be8c]">Tersedia setelah verifikasi</span>
                </div>
                <div className="flex justify-between text-[#f5efeb]/60 pb-2 border-b border-[#d6be8c]/15">
                  <span>Harga Penuh</span>
                  <span className="text-[#f5efeb]">Rp {bird1.price?.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-[#b39257]">Deposit Reservasi</span>
                  <span className="font-serif text-2xl text-[#d6be8c]">
                    Rp {bird1.deposit?.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#f5efeb]/50">
                  <span>Sisa Pembayaran</span>
                  <span>Rp {bird1.remaining?.toLocaleString("id-ID")} (Saat Serah Terima)</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 text-[11px] font-mono text-[#f5efeb]/60">
                <Info className="w-3.5 h-3.5 text-[#b39257] flex-shrink-0 mt-0.5" />
                <span>{bird1.legalNote}</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4 font-mono">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onReserveBird(bird1.id)}
                  data-cursor="RESERVE"
                  className="px-7 py-3.5 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.2em] font-semibold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Reservasi Individu</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>

                <Link
                  href={`/birds/${bird1.publicId}`}
                  className="px-7 py-3.5 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] hover:text-[#d6be8c] text-[#f5efeb] text-[11px] uppercase tracking-[0.2em] transition-all text-center flex items-center justify-center space-x-2"
                >
                  <span>Periksa Profil</span>
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* ── ROW 2: Bird #02 Offset Smaller Detail Card (Inverted Asymmetrical) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Content (5 cols) */}
            <FadeIn direction="right" delay={0.2} className="lg:col-span-5 order-2 lg:order-1 space-y-6 lg:pr-2">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono">
                <Tag className="w-3 h-3" />
                <span>Spesimen No. 02 · Betina</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#f5efeb]">
                {bird2.name} ({bird2.publicId})
              </h3>

              <p className="text-xs uppercase tracking-wider text-[#d6be8c] font-mono">
                Tanggal Menetas: {bird2.hatchDate} · Cincin Tertutup {bird2.ringTag}
              </p>

              <p className="text-sm text-[#f5efeb]/75 font-light leading-relaxed">
                {bird2.description}
              </p>

              <div className="p-5 rounded-2xl bg-[#0d1811] border border-[#d6be8c]/20 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-[#f5efeb]/60 pb-2 border-b border-[#d6be8c]/15">
                  <span>Status Veteriner</span>
                  <span className="text-[#38bdf8]">Pemeriksaan Biometrik Terverifikasi</span>
                </div>
                <div className="flex justify-between text-[#f5efeb]/60 pb-2 border-b border-[#d6be8c]/15">
                  <span>Harga</span>
                  <span className="text-[#f5efeb]">Rp {bird2.price?.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-[#b39257]">Deposit Reservasi</span>
                  <span className="font-serif text-2xl text-[#d6be8c]">
                    Rp {bird2.deposit?.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 text-[11px] font-mono text-[#f5efeb]/60">
                <ShieldCheck className="w-3.5 h-3.5 text-[#b39257] flex-shrink-0 mt-0.5" />
                <span>Tunduk pada regulasi berlaku · Dokumentasi legal tersedia setelah verifikasi</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4 font-mono">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onReserveBird(bird2.id)}
                  data-cursor="RESERVE"
                  className="px-7 py-3.5 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.2em] font-semibold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Reservasi Individu</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>

                <Link
                  href={`/birds/${bird2.publicId}`}
                  className="px-7 py-3.5 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] hover:text-[#d6be8c] text-[#f5efeb] text-[11px] uppercase tracking-[0.2em] transition-all text-center flex items-center justify-center space-x-2"
                >
                  <span>Periksa Profil</span>
                </Link>
              </div>
            </FadeIn>

            {/* Right Visual: Offset 7 cols */}
            <div className="lg:col-span-7 order-1 lg:order-2 relative">
              <ImageReveal direction="bottom" duration={1.1}>
                <div
                  data-cursor="INSPECT"
                  className="relative aspect-[16/11] rounded-3xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl group cursor-pointer"
                >
                  <Image
                    src={bird2.images[0]}
                    alt={`Jalak Bali ${bird2.publicId}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center filter brightness-95 group-hover:scale-104 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-80" />

                  <div className="absolute top-6 left-6 font-mono text-[9px] uppercase tracking-[0.25em] text-[#d6be8c] bg-[#060e08]/90 px-3.5 py-1.5 rounded-full border border-[#d6be8c]/20 backdrop-blur-md">
                    ID Registri: {bird2.publicId}
                  </div>

                  <div className="absolute top-6 right-6">
                    <span className="text-[9px] uppercase tracking-widest text-[#08110b] bg-[#38bdf8] px-3 py-1 rounded-full font-mono font-bold shadow-md">
                      TERSEDIA
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-[#b39257] uppercase tracking-widest block">
                        Spesimen Betina
                      </span>
                      <span className="text-xl font-serif text-[#f5efeb]">
                        {bird2.name} · Kontur Bulu Rapat
                      </span>
                    </div>
                  </div>
                </div>
              </ImageReveal>
            </div>
          </div>

          {/* ── ROW 3: Bird #03 Large Landscape (Full-width editorial plate) ── */}
          <FadeIn direction="up" delay={0.15}>
            <div className="p-8 sm:p-12 md:p-16 rounded-3xl border border-[#d6be8c]/25 bg-[#0d1811] shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#d6be8c]/20">
                  <Image
                    src={bird3.images[0]}
                    alt={`Jalak Bali ${bird3.publicId}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center filter brightness-90"
                  />
                  <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-wider text-[#b39257] bg-[#08110b]/80 px-3 py-1 rounded">
                    {bird3.publicId}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="text-[9px] uppercase tracking-widest text-[#08110b] bg-[#f59e0b] px-3 py-1 rounded font-mono font-bold">
                      DALAM VERIFIKASI
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-4 font-mono">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#b39257]">
                    Alokasi Kohort · Dipesan Menunggu Verifikasi
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#f5efeb] font-light">
                    {bird3.name} ({bird3.publicId})
                  </h3>
                  <p className="text-xs text-[#f5efeb]/75 font-sans font-light leading-relaxed">
                    {bird3.description}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#d6be8c]">
                    <span>Menetas: {bird3.hatchDate}</span>
                    <span>·</span>
                    <span>Jenis Kelamin: Jantan</span>
                    <span>·</span>
                    <span>Dokumentasi: Sedang Ditinjau</span>
                  </div>
                  <div className="pt-4 flex items-center space-x-4">
                    <Link
                      href={`/birds/${bird3.publicId}`}
                      className="px-6 py-3 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] text-[#f5efeb] text-xs uppercase tracking-wider transition-colors inline-block"
                    >
                      Lihat Profil
                    </Link>
                    <span className="text-[11px] text-[#f5efeb]/50">
                      Saat ini ditahan dalam antrean verifikasi pemesan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
