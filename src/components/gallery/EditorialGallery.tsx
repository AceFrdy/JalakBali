"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { ImageReveal } from "@/components/motion/ImageReveal";

export function EditorialGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startScrollLeft: number } | null>(null);

  const scrollByAmount = (distance: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    setIsDragging(true);
    dragRef.current = {
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !scrollRef.current) return;
    const deltaX = event.clientX - dragRef.current.startX;
    scrollRef.current.scrollLeft = dragRef.current.startScrollLeft - deltaX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    dragRef.current = null;
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {}
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!element || window.innerWidth >= 768) return;
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
    <section className="relative py-28 md:py-36 bg-[#060e08] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
          <div className="max-w-2xl">
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-3">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Folio Fotografi Avikultural
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight mb-4">
              <TextReveal text="Arsip Aviari" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">Penangkaran</span>
            </h2>
            <FadeIn direction="up" delay={0.2}>
              <p className="text-xs sm:text-sm text-[#f5efeb]/70 font-mono">
                Dokumentasi visual tanpa rekayasa di dalam koridor pengondisian terbang dan ruang perawatan klinis kami di Bali.
              </p>
            </FadeIn>
          </div>

          {/* Navigation controls on mobile */}
          <div className="flex md:hidden items-center justify-between font-mono text-xs text-[#d6be8c] pt-2 border-t border-[#d6be8c]/15">
            <span className="text-[10px] text-[#f5efeb]/60 flex items-center gap-1.5">
              <span>Geser untuk melihat arsip</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#b39257] animate-pulse" />
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByAmount(-280)}
                aria-label="Foto sebelumnya"
                className="w-8 h-8 rounded border border-[#d6be8c]/30 bg-[#0d1811] flex items-center justify-center text-[#d6be8c] active:bg-[#b39257]/20 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount(280)}
                aria-label="Foto berikutnya"
                className="w-8 h-8 rounded border border-[#d6be8c]/30 bg-[#0d1811] flex items-center justify-center text-[#d6be8c] active:bg-[#b39257]/20 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Asymmetrical Archival Photo Plates ── */}
        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className={`flex items-start gap-4 overflow-x-auto pb-4 no-scrollbar select-none cursor-grab active:cursor-grabbing md:cursor-default md:grid md:grid-cols-12 md:gap-8 md:overflow-visible md:pb-0 touch-pan-x ${
            isDragging ? "snap-none" : "snap-x snap-mandatory"
          }`}
        >
          <ImageReveal
            direction="bottom"
            duration={1.1}
            className="w-[84%] shrink-0 snap-start md:col-span-7 md:row-span-2 md:w-auto"
          >
            <div
              className="relative aspect-[4/5] rounded overflow-hidden border border-[#233527] group shadow-lg bg-[#08110b] select-none"
            >
              <Image
                src="/assets/jalak-habitat.png"
                alt="Captive-bred Jalak Bali perched on natural branch"
                fill
                draggable={false}
                sizes="(max-width: 768px) 75vw, 60vw"
                className="object-cover object-center opacity-95 group-hover:opacity-100 transition-opacity duration-300 filter brightness-95 pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-80 pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex flex-col items-start gap-2 text-xs font-mono md:bottom-6 md:left-6 md:right-6 md:flex-row md:items-end md:justify-between pointer-events-none">
                <div>
                    <span className="block font-serif text-sm text-[#f5efeb] md:text-xl">Kanopi Terbang Naturalisasi</span>
                    <span className="text-[9px] text-[#d6be8c] md:text-[10px]">Koridor Aviari Terbuka · Bali</span>
                </div>
                  <span className="rounded border border-[#b39257]/30 px-2 py-0.5 text-[8px] uppercase tracking-widest text-[#b39257] md:text-[10px]">
                  Plat 01
                </span>
              </div>
            </div>
          </ImageReveal>

          <ImageReveal
            direction="bottom"
            duration={1.0}
            delay={0.15}
            viewportAmount={0.05}
            className="w-[84%] shrink-0 snap-start md:col-span-5 md:w-auto"
          >
            <div
              className="relative aspect-[4/5] rounded overflow-hidden border border-[#233527] group shadow-lg md:aspect-[4/3] bg-[#08110b] select-none"
            >
              <Image
                src="/assets/jalak-portrait.png"
                alt="Plumage detail and cobalt eye ring inspection"
                fill
                draggable={false}
                sizes="(max-width: 768px) 75vw, 40vw"
                className="object-cover object-center opacity-95 group-hover:opacity-100 transition-opacity duration-300 filter brightness-95 pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-80 pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex flex-col items-start gap-2 text-xs font-mono md:bottom-5 md:left-5 md:right-5 md:flex-row md:items-end md:justify-between pointer-events-none">
                <div>
                    <span className="block font-serif text-sm text-[#f5efeb] md:text-lg">Audit Bulu Biometrik</span>
                    <span className="text-[9px] text-[#d6be8c] md:text-[10px]">Ruang Penyaringan Klinis</span>
                </div>
                  <span className="rounded border border-[#b39257]/30 px-2 py-0.5 text-[8px] uppercase tracking-widest text-[#b39257] md:text-[10px]">
                  Plat 02
                </span>
              </div>
            </div>
          </ImageReveal>

          <ImageReveal
            direction="bottom"
            duration={1.0}
            delay={0.25}
            viewportAmount={0.05}
            className="w-[84%] shrink-0 snap-start md:col-span-5 md:w-auto"
          >
            <div
              className="relative aspect-[4/5] rounded overflow-hidden border border-[#233527] group shadow-lg md:aspect-[4/3] bg-[#08110b] select-none"
            >
              <Image
                src="/assets/jalak-hero.png"
                alt="Avian caretaker monitoring social interaction"
                fill
                draggable={false}
                sizes="(max-width: 768px) 75vw, 40vw"
                className="object-cover object-center opacity-95 group-hover:opacity-100 transition-opacity duration-300 filter brightness-95 pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-80 pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex flex-col items-start gap-2 text-xs font-mono md:bottom-5 md:left-5 md:right-5 md:flex-row md:items-end md:justify-between pointer-events-none">
                <div>
                    <span className="block font-serif text-sm text-[#f5efeb] md:text-lg">Observasi Hierarki Sosial</span>
                    <span className="text-[9px] text-[#d6be8c] md:text-[10px]">Kandang Penjodohan 04</span>
                </div>
                  <span className="rounded border border-[#b39257]/30 px-2 py-0.5 text-[8px] uppercase tracking-widest text-[#b39257] md:text-[10px]">
                  Plat 03
                </span>
              </div>
            </div>
          </ImageReveal>
        </div>
      </div>
    </section>
  );
}
