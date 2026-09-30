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
          backgroundImage: "url('/assets/01_sisi_hutan_gabungan_detail.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-[#060e08]" />

      <div className="max-w-[1760px] mx-auto site-gutter relative z-10 text-center flex flex-col items-center">
        {/* Sub-badge */}
        <FadeIn direction="up">
          <div className="inline-flex items-center space-x-3 mb-6 px-4 py-1.5 rounded-full border border-[#d6be8c]/30 bg-[#0d1811]/90 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b39257]" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
              Alokasi Penangkaran Legal
            </span>
          </div>
        </FadeIn>

        {/* Cinematic Headline */}
        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#f5efeb] tracking-tight uppercase leading-[0.95] mb-6 max-w-4xl">
          <TextReveal text="Pertemuan" as="span" /> <br />
          <span className="italic font-serif font-normal text-[#d6be8c] lowercase tracking-normal">
            langka
          </span>{" "}
          Berikutmu
        </h2>

        {/* Subtext */}
        <FadeIn direction="up" delay={0.2}>
          <p className="text-base sm:text-lg text-[#f5efeb]/80 font-light font-mono leading-relaxed mb-10 max-w-xl">
            Jelajahi individu yang tersedia saat ini dan mulai proses verifikasi.
            Semua serah terima mengikuti kerangka avicultur dan hukum yang berlaku.
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn direction="up" delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 font-mono">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCheckAvailability}
              data-cursor="RESERVE"
              className="px-9 py-4 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.25em] font-semibold transition-all shadow-[0_12px_35px_rgba(179,146,87,0.3)] flex items-center space-x-2.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Cek Ketersediaan</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onJoinWaitlist}
              className="px-9 py-4 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] hover:text-[#d6be8c] text-[#f5efeb] text-[11px] uppercase tracking-[0.25em] font-medium transition-colors text-center backdrop-blur-sm cursor-pointer"
            >
              <span>Bergabung Daftar Tunggu</span>
            </motion.button>
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
