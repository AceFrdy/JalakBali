"use client";

import Image from "next/image";
import { ArrowUpRight, Compass, ShieldCheck, Clock, MapPin, Feather, Check } from "lucide-react";
import { motion } from "framer-motion";
import { STORY_STAGES, EXPERIENCES } from "@/data/experiences";
import { TextReveal } from "@/components/motion/TextReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

interface ExperienceSectionProps {
  onReserve: () => void;
}

export function ExperienceSection({ onReserve }: ExperienceSectionProps) {
  const focal = EXPERIENCES[0];

  return (
    <section id="experience" className="relative py-28 md:py-36 bg-[#08110b] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 md:mb-32 gap-8 border-b border-[#d6be8c]/15 pb-12">
          <div className="max-w-2xl">
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-4">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Jurnal Lapangan · Perjalanan Fajar 4,5 Jam
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] leading-[1.04] tracking-tight">
              <TextReveal text="Pagi yang tenang di dalam" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">koridor liar terakhir</span>
            </h2>
          </div>

          <FadeIn direction="left" delay={0.2} className="max-w-md font-mono text-xs text-[#f5efeb]/70 space-y-2 border-l border-[#d6be8c]/25 pl-6">
            <div className="text-[#b39257] uppercase tracking-[0.2em] text-[10px]">
              Protokol Etologis
            </div>
            <p className="font-light leading-relaxed">
              Kami tidak melacak burung menggunakan pengeras suara atau umpan makanan. Kami tiba dalam keheningan total sebelum fajar dan menunggu di tenggeran makan pagi alami mereka.
            </p>
          </FadeIn>
        </div>

        {/* ── Editorial Story Progression (Asymmetrical layout with timestamps) ── */}
        <div className="space-y-36 md:space-y-48">
          {/* Chapter 01: The Passage (Wide image with overlaid field caption) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 relative">
              <ImageReveal direction="bottom" duration={1.1}>
                <div
                  data-cursor="VIEW"
                  className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl group cursor-pointer"
                >
                  <Image
                    src={STORY_STAGES[0].image}
                    alt={STORY_STAGES[0].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center filter brightness-95 transition-transform duration-700 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08110b] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-xs font-mono">
                    <span className="text-[#d6be8c] bg-[#08110b]/80 px-3 py-1 rounded border border-[#d6be8c]/20">
                      {STORY_STAGES[0].meta}
                    </span>
                    <span className="text-[#f5efeb]/60 text-[10px] uppercase tracking-widest hidden sm:inline">
                      Menyeberangi Selat Menjangan
                    </span>
                  </div>
                </div>
              </ImageReveal>
            </div>

            <FadeIn direction="left" delay={0.2} className="lg:col-span-5 space-y-6 lg:pl-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono">
                Bab 01 · 06.00 WITA
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#f5efeb]">
                {STORY_STAGES[0].title}
              </h3>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d6be8c] font-mono">
                {STORY_STAGES[0].subtitle}
              </p>
              <p className="text-sm sm:text-base text-[#f5efeb]/75 font-light leading-relaxed">
                {STORY_STAGES[0].description}
              </p>
              <div className="pt-4 border-t border-[#d6be8c]/15 flex items-center space-x-3 text-xs font-mono text-[#f5efeb]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b39257]" />
                <span>Nol kebisingan daratan utama · Transfer perahu kayu privat</span>
              </div>
            </FadeIn>
          </div>

          {/* Chapter 02: The Audience (Inverted layout, emphasis on the bird in the wild) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <FadeIn direction="right" delay={0.2} className="lg:col-span-5 order-2 lg:order-1 space-y-6 lg:pr-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono">
                Bab 02 · 07.15 WITA
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#f5efeb]">
                {STORY_STAGES[1].title}
              </h3>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d6be8c] font-mono">
                {STORY_STAGES[1].subtitle}
              </p>
              <p className="text-sm sm:text-base text-[#f5efeb]/75 font-light leading-relaxed">
                {STORY_STAGES[1].description}
              </p>
              <div className="pt-4 border-t border-[#d6be8c]/15 space-y-2 text-xs font-mono text-[#f5efeb]/70">
                <div className="flex items-center space-x-2">
                  <span className="text-[#b39257]">01.</span>
                  <span>Kamar pengamatan kayu tersembunyi di ketinggian kanopi 12m</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[#b39257]">02.</span>
                  <span>Teleskop pengamat Swarovski Optik ATX 30-70x95 disediakan</span>
                </div>
              </div>
            </FadeIn>

            <div className="lg:col-span-7 order-1 lg:order-2 relative">
              <ImageReveal direction="bottom" duration={1.1}>
                <div
                  data-cursor="VIEW"
                  className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl group cursor-pointer"
                >
                  <Image
                    src={STORY_STAGES[1].image}
                    alt={STORY_STAGES[1].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center filter brightness-95 transition-transform duration-700 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08110b] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-xs font-mono">
                    <span className="text-[#d6be8c] bg-[#08110b]/80 px-3 py-1 rounded border border-[#d6be8c]/20">
                      {STORY_STAGES[1].meta}
                    </span>
                    <span className="text-[#38bdf8] text-[10px] uppercase tracking-widest hidden sm:inline">
                      Siulan & Tundukan Teritorial Teramati
                    </span>
                  </div>
                </div>
              </ImageReveal>
            </div>
          </div>

          {/* Chapter 03: The Collation (Field breakfast & census logging) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 relative">
              <ImageReveal direction="bottom" duration={1.1}>
                <div
                  data-cursor="VIEW"
                  className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl group cursor-pointer"
                >
                  <Image
                    src={STORY_STAGES[2].image}
                    alt={STORY_STAGES[2].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center filter brightness-95 transition-transform duration-700 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08110b] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-xs font-mono">
                    <span className="text-[#d6be8c] bg-[#08110b]/80 px-3 py-1 rounded border border-[#d6be8c]/20">
                      {STORY_STAGES[2].meta}
                    </span>
                    <span className="text-[#f5efeb]/60 text-[10px] uppercase tracking-widest hidden sm:inline">
                      Dek Teduh Pos Jagawana
                    </span>
                  </div>
                </div>
              </ImageReveal>
            </div>

            <FadeIn direction="left" delay={0.2} className="lg:col-span-5 space-y-6 lg:pl-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono">
                Bab 03 · 09.30 WITA
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#f5efeb]">
                {STORY_STAGES[2].title}
              </h3>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d6be8c] font-mono">
                {STORY_STAGES[2].subtitle}
              </p>
              <p className="text-sm sm:text-base text-[#f5efeb]/75 font-light leading-relaxed">
                {STORY_STAGES[2].description}
              </p>
              <div className="pt-4 border-t border-[#d6be8c]/15 flex items-center space-x-3 text-xs font-mono text-[#f5efeb]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b39257]" />
                <span>Kopi Arabika Kintamani & pencatatan sensus resmi</span>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ── Itinerary Details & Protocol Manifest (Editorial split, not SaaS cards) ── */}
        <div className="mt-36 pt-16 border-t border-[#d6be8c]/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Timeline Column */}
            <div className="lg:col-span-7 space-y-8">
              <FadeIn direction="up">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono mb-2">
                    Kronologi Standar
                  </div>
                  <h4 className="font-serif text-3xl text-[#f5efeb] font-light">
                    Jadwal Perjalanan Fajar
                  </h4>
                </div>
              </FadeIn>

              <StaggerChildren stagger={0.06} className="space-y-4">
                {focal.schedule.map((item, idx) => (
                  <StaggerItem key={idx}>
                    <div className="flex items-start space-x-4 py-3 border-b border-[#d6be8c]/15 text-xs font-mono">
                      <span className="text-[#b39257] w-20 flex-shrink-0 pt-0.5">
                        {item.time}
                      </span>
                      <span className="text-[#f5efeb]/80 font-sans text-sm font-light">
                        {item.activity}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>

              {/* Inclusions */}
              <FadeIn direction="up" delay={0.2} className="pt-6">
                <div className="text-xs uppercase tracking-[0.2em] text-[#d6be8c] font-mono mb-4">
                  Fasilitas Terkonfirmasi
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#f5efeb]/80">
                  {focal.inclusions.map((inc, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-[#b39257] flex-shrink-0 mt-0.5" />
                      <span className="font-light">{inc}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Naturalist Preparation & Etiquette Box */}
            <div className="lg:col-span-5">
              <FadeIn direction="left" delay={0.15}>
                <div className="p-8 sm:p-10 rounded-2xl border border-[#d6be8c]/25 bg-[#0d1811] space-y-6">
                  <div className="flex items-center justify-between border-b border-[#d6be8c]/15 pb-4 font-mono">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#b39257]">
                      Protokol Suaka
                    </span>
                    <span className="text-[10px] text-[#f5efeb]/50">Kode Izin TNBB: Z1-EN</span>
                  </div>

                  <h4 className="font-serif text-2xl text-[#f5efeb] font-light">
                    Aturan Lapangan & Standar Pakaian
                  </h4>

                  <p className="text-xs text-[#f5efeb]/70 font-light leading-relaxed">
                    Curik Bali memiliki penglihatan tajam dan kepekaan tinggi terhadap anomali suara. Untuk memastikan observasi alami tanpa gangguan, semua tamu mematuhi empat prinsip ketat:
                  </p>

                  <StaggerChildren stagger={0.05} className="space-y-3 font-mono text-xs text-[#f5efeb]/80">
                    {focal.preparationNotes.map((note, idx) => (
                      <StaggerItem key={idx}>
                        <div className="p-3 rounded-lg bg-[#132218] border border-[#d6be8c]/10 flex items-start space-x-3">
                          <span className="text-[#b39257]">0{idx + 1}.</span>
                          <span className="font-sans font-light text-xs text-[#f5efeb]/85">{note}</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerChildren>

                  <div className="pt-4 border-t border-[#d6be8c]/15 flex items-center justify-between">
                    <div className="text-xs font-mono text-[#f5efeb]/60">
                      Rombongan maksimal: <span className="text-[#d6be8c]">4 Tamu</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onReserve}
                      data-cursor="RESERVE"
                      className="group px-6 py-2.5 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[10px] uppercase tracking-[0.2em] font-mono font-semibold transition-all flex items-center space-x-2 cursor-pointer shadow-sm"
                    >
                      <span>Lihat Tanggal</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </motion.button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
