"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EDITORIAL_REVIEWS, SOCIAL_PROOF_STATS } from "@/data/reviews";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

export function ReviewSection() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevReview = () => {
    setCurrentIdx((prev) =>
      prev === 0 ? EDITORIAL_REVIEWS.length - 1 : prev - 1
    );
  };

  const nextReview = () => {
    setCurrentIdx((prev) =>
      prev === EDITORIAL_REVIEWS.length - 1 ? 0 : prev + 1
    );
  };

  const review = EDITORIAL_REVIEWS[currentIdx];

  return (
    <section id="reviews" className="relative py-28 md:py-36 bg-[#08110b] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-[#d6be8c]/15 pb-10">
          <div>
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-3">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Buku Tamu Teluk Brumbun
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
              <TextReveal text="Review" as="span" /> <span className="italic font-serif text-[#d6be8c]">Pelanggan</span>
            </h2>
          </div>

          <div className="flex items-center space-x-4 font-mono text-xs">
            <span className="text-[#b39257]">
              Entri 0{currentIdx + 1} / 0{EDITORIAL_REVIEWS.length}
            </span>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={prevReview}
                className="p-2.5 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] text-[#f5efeb] hover:text-[#b39257] transition-colors cursor-pointer"
                aria-label="Entri tamu sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={nextReview}
                className="p-2.5 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] text-[#f5efeb] hover:text-[#b39257] transition-colors cursor-pointer"
                aria-label="Entri tamu berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Large Editorial Guestbook Entry with Drag/Swipe ── */}
        <FadeIn direction="up" delay={0.1}>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x > 60) prevReview();
              else if (info.offset.x < -60) nextReview();
            }}
            data-cursor="DRAG"
            className="p-8 sm:p-14 md:p-20 rounded-3xl border border-[#d6be8c]/25 bg-[#0d1811] shadow-2xl mb-20 relative cursor-grab active:cursor-grabbing select-none"
          >
            {/* Subtle rating representation (hairline gold stars) */}
            <div className="flex items-center space-x-1.5 mb-8 text-[#b39257] font-mono text-xs">
              <span>★★★★★</span>
              <span className="text-[#f5efeb]/40 ml-2">
                · Entri Registri {review.date} {review.individualRef && `(${review.individualRef})`}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Genuine Human Quote */}
                <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#f5efeb] leading-[1.3] tracking-tight mb-12 max-w-4xl">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>

                {/* Patron Signoff */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 border-t border-[#d6be8c]/15">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.08 }}
                  >
                    <div className="font-serif text-xl text-[#d6be8c]">
                      — {review.patronName}
                    </div>
                    <div className="text-xs text-[#f5efeb]/60 font-mono mt-1">
                      {review.patronTitle} · {review.location}
                    </div>
                  </motion.div>

                  <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-mono text-[#b39257] border border-[#b39257]/30 px-3 py-1.5 rounded self-start sm:self-auto">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Pelanggan Penangkaran Terverifikasi</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </FadeIn>

        {/* ── Grounded Social Proof Metrics ── */}
        <StaggerChildren stagger={0.08} className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-[#d6be8c]/15 font-mono">
          {SOCIAL_PROOF_STATS.map((stat, idx) => (
            <StaggerItem key={idx}>
              <div className="space-y-1">
                <div className="font-serif text-3xl sm:text-4xl text-[#f5efeb] font-light">
                  {stat.value}
                  <span className="text-base text-[#d6be8c] ml-1">{stat.suffix}</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#b39257]">
                  {stat.label}
                </div>
                <p className="text-[11px] text-[#f5efeb]/60 font-light font-sans">
                  {stat.detail}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
