"use client";

import { useRef } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { BREEDING_LIFECYCLE_TIMELINE } from "@/data/provenance";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";

export function BreedingLifecycleSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startScrollLeft: number } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    dragRef.current = {
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    event.currentTarget.scrollLeft =
      dragRef.current.startScrollLeft - (event.clientX - dragRef.current.startX);
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    const canScroll = event.deltaY > 0
      ? element.scrollLeft < maxScrollLeft
      : element.scrollLeft > 0;

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && canScroll) {
      element.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  };

  return (
    <section id="breeding-story" className="relative py-28 md:py-36 bg-[#08110b] text-[#f5efeb] border-t border-[#d6be8c]/15 overflow-hidden">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-[#d6be8c]/15 pb-10">
          <div>
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-3">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Dari Penjodohan hingga Registri · Siklus Hidup Visual
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
              <TextReveal text="Kronologi" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">Penangkaran</span>
            </h2>
          </div>

          <div className="font-mono text-xs text-[#d6be8c] flex items-center space-x-2">
            <span>Gulir atau geser secara horizontal</span>
            <ChevronRight className="w-4 h-4 text-[#b39257] animate-pulse" />
          </div>
        </div>

        {/* ── Horizontal Scrolling Timeline ── */}
        <div
          ref={scrollRef}
          className="overflow-x-auto pb-8 pt-4 no-scrollbar cursor-grab active:cursor-grabbing select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          <div className="flex space-x-6 min-w-max">
            {BREEDING_LIFECYCLE_TIMELINE.map((item, idx) => (
              <motion.div
                key={item.step}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="w-72 sm:w-80 p-8 rounded-3xl border border-[#d6be8c]/20 bg-[#0d1811] hover:border-[#b39257] hover:bg-[#112117] transition-all flex flex-col justify-between space-y-8 font-mono shadow-xl relative"
              >
                <div>
                  {/* Top Step Number */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#d6be8c]/15 mb-6">
                    <span className="font-serif text-4xl text-[#b39257] font-light">
                      {item.step}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#38bdf8] bg-[#38bdf8]/10 px-2.5 py-1 rounded border border-[#38bdf8]/20">
                      {item.duration}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-[#f5efeb] font-light tracking-wide mb-3">
                    {item.phase}
                  </h3>

                  <p className="font-sans text-xs text-[#f5efeb]/75 font-light leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#d6be8c]/10 flex items-center justify-between text-[10px] text-[#f5efeb]/40 uppercase tracking-widest">
                  <span>Tahap 0{idx + 1} dari 06</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#b39257]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
