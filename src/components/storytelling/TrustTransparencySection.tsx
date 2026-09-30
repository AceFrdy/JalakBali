"use client";

import { ShieldCheck, Search, FileLock2, Award } from "lucide-react";
import { TRUST_PRINCIPLES } from "@/data/provenance";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

export function TrustTransparencySection() {
  return (
    <section className="relative py-28 md:py-36 bg-[#08110b] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <FadeIn direction="up">
            <div className="flex items-center space-x-3 mb-3">
              <span className="h-[1px] w-6 bg-[#b39257]" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                Empat Pilar Avikultural Sah
              </span>
            </div>
          </FadeIn>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
            <TextReveal text="Dibangun di Atas" as="span" />{" "}
            <span className="italic font-serif text-[#d6be8c]">Transparansi</span>
          </h2>
          <FadeIn direction="up" delay={0.2}>
            <p className="text-xs sm:text-sm text-[#f5efeb]/70 font-mono mt-4 leading-relaxed">
              Kami beroperasi sepenuhnya dalam terang kepatuhan hukum. Tanpa dokumen ambigu, tanpa stok tak terverifikasi, dan tanpa jalan pintas.
            </p>
          </FadeIn>
        </div>

        {/* ── Asymmetrical Editorial Row Architecture (NOT 4 rounded cards) ── */}
        <div className="border-t border-[#d6be8c]/20">
          <StaggerChildren stagger={0.08} className="divide-y divide-[#d6be8c]/15">
            {TRUST_PRINCIPLES.map((principle, idx) => (
              <StaggerItem key={principle.title}>
                <div className="py-10 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-baseline group hover:bg-[#0d1811]/40 transition-colors duration-300 px-2 sm:px-4">
                  {/* Oversized Number (Col 1-2) */}
                  <div className="md:col-span-2 font-serif text-4xl sm:text-5xl md:text-6xl text-[#b39257]/40 group-hover:text-[#b39257] transition-colors font-light">
                    0{idx + 1}
                  </div>

                  {/* Principle Title & Badge (Col 3-6) */}
                  <div className="md:col-span-5 space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#38bdf8] font-mono">
                      {principle.badge}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#f5efeb] font-light tracking-wide">
                      {principle.title}
                    </h3>
                  </div>

                  {/* Detailed Explanation (Col 7-12) */}
                  <div className="md:col-span-5 font-mono text-xs sm:text-sm text-[#f5efeb]/75 font-light leading-relaxed">
                    <p>{principle.description}</p>
                    <div className="mt-3 flex items-center space-x-2 text-[10px] text-[#d6be8c] uppercase tracking-wider">
                      <span>✓</span>
                      <span>Protokol Peternak Unggas Terverifikasi</span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}
