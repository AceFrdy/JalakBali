"use client";

import Image from "next/image";
import { ArrowRight, Calendar, Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";

interface FinalCtaSectionProps {
  onCheckAvailability: () => void;
  onJoinWaitlist: () => void;
}

export function FinalCtaSection({
  onCheckAvailability,
  onJoinWaitlist,
}: FinalCtaSectionProps) {
  return (
    <section className="relative py-32 md:py-44 bg-[#060e08] text-[#f5efeb] overflow-hidden border-t border-[#d6be8c]/20">
      {/* Background with warm sunset tone and soft opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25"
        style={{
          backgroundImage: "url('/assets/Background.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-[#060e08]" />

      <div className="max-w-[1760px] mx-auto site-gutter relative z-10 text-center flex flex-col items-center">
        {/* Sub-badge */}
        <FadeIn direction="up">
          <div className="inline-flex items-center space-x-3 mb-6 px-4 py-1.5 rounded-full border border-[#233527] bg-[#0e1912]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b39257]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d6be8c] font-mono">
              Konservasi Resmi BKSDA
            </span>
          </div>
        </FadeIn>

        {/* Editorial Headline */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#f5efeb] tracking-tight leading-[1.12] mb-5 max-w-3xl">
          Komitmen Pelestarian Jalak Bali di{" "}
          <span className="italic font-serif text-[#d6be8c]">Aviari Anda</span>
        </h2>

        {/* Subtext */}
        <FadeIn direction="up" delay={0.2}>
          <p className="text-base sm:text-lg text-[#f5efeb]/80 font-sans font-normal leading-relaxed mb-8 max-w-xl">
            Konsultasikan ketersediaan rilis mingguan atau daftarkan aviari Anda dalam daftar verifikasi resmi pemeliharaan Jalak Bali.
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn direction="up" delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 font-mono">
            <button
              type="button"
              onClick={onCheckAvailability}
              className="px-8 py-3.5 rounded-full bg-[#b39257] hover:bg-[#c5a880] active:bg-[#9e7e43] text-[#08110b] text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors flex items-center space-x-2.5 cursor-pointer shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Cek Jadwal Ketersediaan</span>
            </button>

            <button
              type="button"
              onClick={onJoinWaitlist}
              className="px-8 py-3.5 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] hover:text-[#d6be8c] text-[#f5efeb] text-[11px] uppercase tracking-[0.2em] font-medium transition-colors text-center cursor-pointer"
            >
              <span>Daftar Verifikasi Aviari</span>
            </button>
          </div>
        </FadeIn>

        {/* Jaminan Legal Kecil */}
        <FadeIn direction="up" delay={0.4} className="mt-12">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#f5efeb]/50">
            <ShieldCheck className="w-4 h-4 text-[#b39257]" />
            <span>Verifikasi diperlukan · Dokumen cincin logam tertutup & microchip disertakan</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
