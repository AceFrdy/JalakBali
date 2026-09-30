"use client";

import Image from "next/image";
import { ShieldCheck, Heart, Feather, FileText, CheckCircle2, Award } from "lucide-react";
import { RESPONSIBLE_BREEDING_PILLARS } from "@/data/provenance";
import { TextReveal } from "@/components/motion/TextReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

export function ResponsibleBreedingSection() {
  return (
    <section id="responsible-breeding" className="relative py-28 md:py-36 bg-[#060e08] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-[#d6be8c]/15 pb-10">
          <div>
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-3">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Standar Avikultural & Pengelolaan
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
              <TextReveal text="Penangkaran" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">Bertanggung Jawab</span>
            </h2>
          </div>

          <FadeIn direction="left" delay={0.2} className="max-w-md font-mono text-xs text-[#f5efeb]/70">
            <p className="font-light leading-relaxed">
              Nilai konservasi sejati dalam penangkaran berakar pada kesejahteraan etis, pengelolaan genetik, dan kepatuhan hukum tanpa kompromi.
            </p>
          </FadeIn>
        </div>

        {/* ── Asymmetrical Editorial Layout: Left Photo Study, Right Staggered Pillars ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Overlapping Photographic Plates */}
          <div className="lg:col-span-5 relative space-y-6">
            <ImageReveal direction="bottom" duration={1.1}>
              <div
                data-cursor="VIEW"
                className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl group cursor-pointer"
              >
                <Image
                  src="/assets/jalak-conservation.png"
                  alt="Responsible aviary care and flight conditioning"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center filter brightness-95 group-hover:scale-104 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-6 left-6 right-6 font-mono text-xs">
                  <span className="text-[9px] uppercase tracking-widest text-[#b39257] block">
                    Zona Terbang Aviari Terkontrol
                  </span>
                  <span className="font-serif text-xl text-[#f5efeb]">
                    Kandang Terbuka Berlimpah Cahaya
                  </span>
                </div>
              </div>
            </ImageReveal>

            {/* Overlapping small plate */}
            <FadeIn direction="up" delay={0.2}>
              <div className="p-6 rounded-2xl bg-[#0d1811] border border-[#d6be8c]/20 space-y-3 font-mono text-xs">
                <div className="flex items-center space-x-2 text-[#38bdf8]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest">Standar Veteriner</span>
                </div>
                <p className="font-sans font-light text-xs text-[#f5efeb]/75 leading-relaxed">
                  Pengujian PCR bulu DNA unggas secara berkala, penyaringan patogen feses, serta pengayaan pakan dengan buah ara asli Bali dan wadah mencari makan serangga hidup.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: 6 Pillars in Asymmetric Stagger */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono mb-2">
              Enam Komitmen Pemeliharaan
            </div>

            <StaggerChildren stagger={0.06} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RESPONSIBLE_BREEDING_PILLARS.map((pillar) => (
                <StaggerItem key={pillar.id}>
                  <div className="p-6 rounded-2xl border border-[#d6be8c]/15 bg-[#0d1811]/70 hover:border-[#b39257]/50 hover:bg-[#112117] transition-all duration-300 space-y-3 font-mono h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-[#b39257] mb-2">
                        <span>{pillar.tag}</span>
                        <span className="text-[#f5efeb]/40">{pillar.number}</span>
                      </div>

                      <h3 className="font-serif text-2xl text-[#f5efeb] font-light mb-1">
                        {pillar.title}
                      </h3>

                      <p className="text-[11px] uppercase tracking-wider text-[#d6be8c] mb-2">
                        {pillar.subtitle}
                      </p>

                      <p className="font-sans text-xs text-[#f5efeb]/75 font-light leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#d6be8c]/10 flex items-center space-x-1 text-[10px] text-[#38bdf8]">
                      <span>✓</span>
                      <span>Standar Terverifikasi</span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </div>
    </section>
  );
}
