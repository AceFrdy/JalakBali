"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { JALAK_BALI_FEATURES } from "@/data/story";
import { TextReveal } from "@/components/motion/TextReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

export function JalakBaliStory() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="the-bird" className="relative py-28 md:py-36 bg-[#060e08] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-[#d6be8c]/15 pb-10">
          <div>
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-3">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Monografi Unggas · Leucopsar Rothschildi
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
              <TextReveal text="Porselen Hidup dari" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">Bali Barat</span>
            </h2>
          </div>

          <FadeIn direction="left" delay={0.2}>
            <p className="text-xs sm:text-sm text-[#f5efeb]/70 max-w-md font-mono leading-relaxed">
              Pertama kali didokumentasikan secara ilmiah pada tahun 1911 dalam Ekspedisi Freiburger Molukken Kedua.
              Endemik khusus di sudut barat laut Bali, tanpa populasi liar di belahan bumi lain.
            </p>
          </FadeIn>
        </div>

        {/* ── Editorial Field Specimen Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Visual Specimen Study Frame */}
          <div className="lg:col-span-6 relative">
            <ImageReveal direction="bottom" duration={1.1}>
              <div
                data-cursor="VIEW"
                className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#d6be8c]/25 shadow-2xl group cursor-pointer"
              >
                <Image
                  src="/assets/istockphoto-177439037-612x612.jpg"
                  alt="Jalak Bali Plumage and Cobalt Eye Patch"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center filter saturate-[1.05] transition-transform duration-700 group-hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-85" />

                {/* Specimen Field Stamp */}
                <div className="absolute top-6 left-6 font-mono text-[9px] uppercase tracking-[0.25em] text-[#d6be8c] bg-[#060e08]/85 px-3 py-1.5 rounded border border-[#d6be8c]/20">
                  Catatan Spesimen · Sektor Teluk Brumbun
                </div>

                {/* Cobalt Orbital Accent Tag */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[#38bdf8] block text-[10px] uppercase tracking-widest">
                      Dermis Safir Terang
                    </span>
                    <span className="text-[#f5efeb] font-serif italic text-lg">
                      Leucopsar rothschildi
                    </span>
                  </div>
                  <span className="text-[10px] text-[#b39257] uppercase tracking-widest border-b border-[#b39257]">
                    Kritis Terancam Punah (IUCN)
                  </span>
                </div>
              </div>
            </ImageReveal>

            {/* Sub-annotation note */}
            <FadeIn direction="up" delay={0.2}>
              <div className="mt-4 p-4 rounded-xl bg-[#0d1811] border border-[#d6be8c]/15 text-xs font-mono text-[#f5efeb]/70 flex items-start space-x-3">
                <span className="text-[#b39257] font-bold">Catatan:</span>
                <span className="font-light">
                  Individu liar menunjukkan kompresi bulu yang lebih rapat dan kulit wajah kobalt yang lebih cerah daripada spesimen hasil penangkaran, karena pola makan liar yang kaya akan buah ara asli dan serangga.
                </span>
              </div>
            </FadeIn>
          </div>

          {/* Right: Interactive Specimen Field Notes with Stagger & Spring */}
          <div className="lg:col-span-6 space-y-4">
            <FadeIn direction="left" delay={0.1}>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#b39257] font-mono mb-2">
                Ciri Anatomis (Klik untuk memeriksa)
              </div>
            </FadeIn>

            <StaggerChildren stagger={0.08} className="space-y-3">
              {JALAK_BALI_FEATURES.map((feat, idx) => {
                const isSelected = activeIdx === idx;
                return (
                  <StaggerItem key={feat.id}>
                    <motion.div
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      onClick={() => setActiveIdx(idx)}
                      className={`p-6 rounded-2xl border cursor-pointer transition-colors duration-300 ${
                        isSelected
                          ? "bg-[#132218] border-[#b39257] shadow-xl"
                          : "bg-[#0d1811]/60 border-[#d6be8c]/15 hover:border-[#d6be8c]/35"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#b39257] font-mono">
                          {feat.tag}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] uppercase tracking-widest text-[#38bdf8] font-mono">
                            Memeriksa
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-2xl text-[#f5efeb] font-light mb-1">
                        {feat.title}
                      </h3>
                      <p className="text-xs uppercase tracking-wider text-[#d6be8c] font-mono mb-3">
                        {feat.subtitle}
                      </p>

                      <p className="text-xs sm:text-sm text-[#f5efeb]/75 font-light leading-relaxed">
                        {feat.description}
                      </p>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-3 border-t border-[#d6be8c]/15 text-xs font-mono text-[#d6be8c]/90">
                              <span className="text-[#b39257]">Catatan Lapangan: </span>
                              {feat.detailNote}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </div>
      </div>
    </section>
  );
}
