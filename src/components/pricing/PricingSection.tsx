"use client";

import { useState } from "react";
import { ArrowRight, Check, ShieldCheck, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EXPERIENCES } from "@/data/experiences";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";

interface PricingSectionProps {
  onSelectPackage: (packageId: string) => void;
}

export function PricingSection({ onSelectPackage }: PricingSectionProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeExp = EXPERIENCES[selectedIdx];

  return (
    <section id="pricing" className="relative py-28 md:py-36 bg-[#08110b] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <FadeIn direction="up">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <span className="h-[1px] w-6 bg-[#b39257]" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                Iuran Akses Suaka
              </span>
              <span className="h-[1px] w-6 bg-[#b39257]" />
            </div>
          </FadeIn>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight mb-4">
            <TextReveal text="Tingkatan" as="span" /> <span className="italic font-serif text-[#d6be8c]">Suaka</span>
          </h2>
          <FadeIn direction="up" delay={0.2}>
            <p className="text-xs sm:text-sm text-[#f5efeb]/70 font-mono">
              Setiap kunjungan bersifat sepenuhnya privat, dibatasi ketat untuk 2–4 tamu, dan beroperasi di bawah panduan riset suaka resmi TNBB.
            </p>
          </FadeIn>
        </div>

        {/* Minimal Folio Tier Switcher (Editorial tabs, not toggle pill) */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex border-b border-[#d6be8c]/25 space-x-8 text-xs font-mono uppercase tracking-[0.2em] relative">
            {EXPERIENCES.map((exp, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`pb-3 transition-colors relative cursor-pointer ${
                    isSelected
                      ? "text-[#d6be8c] font-semibold"
                      : "text-[#f5efeb]/50 hover:text-[#f5efeb]"
                  }`}
                >
                  <span>{exp.title}</span>
                  {isSelected && (
                    <motion.div
                      layoutId="activePricingTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b39257]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Single Focal Expedition Dossier (The Prestige Folio) ── */}
        <FadeIn direction="up" delay={0.15} className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-8 sm:p-12 md:p-16 border border-[#d6be8c]/30 bg-[#0d1811] shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeExp.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Top row: Title and Price */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-[#d6be8c]/20">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#b39257] font-mono mb-2">
                      {activeExp.subtitle}
                    </div>
                    <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#f5efeb]">
                      {activeExp.title}
                    </h3>
                    <p className="text-xs font-mono text-[#d6be8c] mt-2">
                      {activeExp.duration} · {activeExp.groupSize}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-left md:text-right flex-shrink-0 font-mono">
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-[#b39257]">
                      Kontribusi Suaka
                    </span>
                    <span className="font-serif text-4xl sm:text-5xl text-[#f5efeb] font-light tracking-tight block">
                      {activeExp.formattedPrice}
                    </span>
                    <span className="text-[10px] text-[#f5efeb]/50 block mt-1">
                      Per tamu terdaftar · Pendanaan langsung patroli antipemburu liar
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="py-8 border-b border-[#d6be8c]/15">
                  <p className="text-sm sm:text-base text-[#f5efeb]/80 font-light leading-relaxed">
                    {activeExp.description}
                  </p>
                </div>

                {/* Inclusions */}
                <div className="pt-8 pb-10">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-[#b39257] font-mono mb-6">
                    Alokasi Ekspedisi Terjamin
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeExp.inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs text-[#f5efeb]/85 font-light">
                        <span className="w-4 h-4 rounded-full border border-[#b39257]/50 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#b39257] font-mono text-[9px]">
                          ✓
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Row with Direct Reserve CTA */}
                <div className="pt-6 border-t border-[#d6be8c]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-3 text-xs font-mono text-[#f5efeb]/60">
                    <ShieldCheck className="w-4 h-4 text-[#b39257]" />
                    <span>Kebijakan suaka tanpa kerumunan: Maks 1–2 rombongan per minggu</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectPackage(activeExp.id)}
                    data-cursor="RESERVE"
                    className="group w-full sm:w-auto px-8 py-4 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.25em] font-mono font-semibold transition-all shadow-[0_10px_25px_rgba(179,146,87,0.25)] flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Reservasi Tanggal di Registri</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
