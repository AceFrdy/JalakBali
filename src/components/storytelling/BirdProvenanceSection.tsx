"use client";

import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { PROVENANCE_STAGES } from "@/data/provenance";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";

export function BirdProvenanceSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const dragRef = useRef<{
    startX: number;
    startScrollLeft: number;
    lastX: number;
    lastTime: number;
    velocity: number;
  } | null>(null);

  const animateScrollBy = (distance: number) => {
    const element = scrollRef.current;
    if (!element) return;

    const maxScroll = element.scrollWidth - element.clientWidth;
    const currentTarget = animationFrameRef.current === null
      ? element.scrollLeft
      : scrollTargetRef.current;
    scrollTargetRef.current = Math.max(0, Math.min(maxScroll, currentTarget + distance));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      element.scrollLeft = scrollTargetRef.current;
      return;
    }

    if (animationFrameRef.current !== null) return;

    const animate = () => {
      const remaining = scrollTargetRef.current - element.scrollLeft;
      if (Math.abs(remaining) < 0.5) {
        element.scrollLeft = scrollTargetRef.current;
        animationFrameRef.current = null;
        return;
      }

      element.scrollLeft += remaining * 0.1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    dragRef.current = {
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };
    scrollTargetRef.current = event.currentTarget.scrollLeft;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const now = performance.now();
    const elapsed = Math.max(now - drag.lastTime, 1);
    const nextVelocity = (drag.lastX - event.clientX) / elapsed;
    drag.velocity = drag.velocity * 0.65 + nextVelocity * 0.35;
    drag.lastX = event.clientX;
    drag.lastTime = now;

    const element = event.currentTarget;
    element.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX);
    scrollTargetRef.current = element.scrollLeft;
  };

  const handlePointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;

    animateScrollBy(Math.max(-220, Math.min(220, drag.velocity * 180)));
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    const currentTarget = animationFrameRef.current === null
      ? element.scrollLeft
      : scrollTargetRef.current;
    const canScroll = event.deltaY > 0
      ? currentTarget < maxScrollLeft
      : currentTarget > 0;

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && canScroll) {
      animateScrollBy(event.deltaY * 1.5);
      event.preventDefault();
    }
  };

  useEffect(() => () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  return (
    <section id="provenance" className="relative py-28 md:py-36 bg-[#08110b] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 border-b border-[#d6be8c]/15 pb-10">
          <div>
            <FadeIn direction="up">
              <div className="flex items-center space-x-3 mb-3">
                <span className="h-[1px] w-6 bg-[#b39257]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#b39257] font-mono">
                  Rantai Kepemilikan · Registri Studbook Tertutup
                </span>
              </div>
            </FadeIn>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#f5efeb] tracking-tight">
              <TextReveal text="Terlacak Dari" as="span" />{" "}
              <span className="italic font-serif text-[#d6be8c]">Asal-Usul</span>
            </h2>
          </div>

          <FadeIn direction="left" delay={0.2} className="max-w-md font-mono text-xs text-[#f5efeb]/70 space-y-2 border-l border-[#d6be8c]/25 pl-6">
            <div className="text-[#b39257] uppercase tracking-[0.2em] text-[10px]">
              Prinsip Legalitas Terverifikasi
            </div>
            <p className="font-light leading-relaxed">
              Kami tidak pernah memalsukan nomor izin atau klaim hukum. Setiap tahap kehidupan burung didokumentasikan dengan presisi, dari pencatatan telur awal hingga verifikasi veteriner dan serah terima legal yang terjadwal.
            </p>
          </FadeIn>
        </div>

        <div className="flex items-center justify-end gap-3 mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#d6be8c]">
          <span>Geser untuk melihat tahap berikutnya</span>
          <button
            type="button"
            onClick={() => animateScrollBy(-(scrollRef.current?.clientWidth ?? 0) * 0.8)}
            aria-label="Geser ke tahap sebelumnya"
            className="p-2 rounded-full border border-[#d6be8c]/25 text-[#d6be8c] hover:border-[#b39257] hover:text-[#b39257] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => animateScrollBy((scrollRef.current?.clientWidth ?? 0) * 0.8)}
            aria-label="Geser ke tahap berikutnya"
            className="p-2 rounded-full border border-[#d6be8c]/25 text-[#d6be8c] hover:border-[#b39257] hover:text-[#b39257] transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="overflow-x-auto overflow-y-hidden no-scrollbar cursor-grab active:cursor-grabbing select-none touch-auto"
          aria-label="Tahap asal-usul dan registrasi Jalak Bali"
        >
          <div className="relative flex w-max items-stretch gap-8 pb-4 pt-1 pr-6 md:pr-12">
            <div className="absolute left-0 right-0 top-[10px] h-px bg-[#d6be8c]/25" />
            {PROVENANCE_STAGES.map((stage, idx) => (
              <FadeIn
                key={stage.step}
                direction="up"
                delay={idx * 0.08}
                className="relative w-[min(82vw,420px)] shrink-0 snap-start pt-10"
              >
                <div className="absolute left-0 top-0 z-10 w-5 h-5 rounded-full bg-[#08110b] border-2 border-[#b39257] flex items-center justify-center transition-colors hover:bg-[#b39257]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b39257]" />
                </div>

                <article className="min-h-[300px] border-t border-[#d6be8c]/15 pt-5 pr-6 font-mono">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#b39257]">
                      {stage.step} · {stage.stageName}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        stage.badge === "Verified" || stage.badge === "Terverifikasi"
                          ? "border-[#38bdf8]/40 bg-[#38bdf8]/10 text-[#38bdf8]"
                          : "border-[#d6be8c]/30 bg-[#d6be8c]/10 text-[#d6be8c]"
                      }`}
                    >
                      {stage.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-[#f5efeb] font-light mb-4">
                    {stage.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#f5efeb]/75 font-sans font-light leading-relaxed mb-5">
                    {stage.description}
                  </p>
                  <div className="pt-1 text-[11px] text-[#f5efeb]/50 flex items-start space-x-2">
                    <span className="text-[#b39257]">§</span>
                    <span>{stage.legalNote}</span>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Bottom Banner Note */}
        <FadeIn direction="up" delay={0.3} className="mt-20">
          <div className="p-6 rounded-2xl bg-[#0d1811] border border-[#d6be8c]/20 max-w-3xl mx-auto flex items-center space-x-4 font-mono text-xs text-[#f5efeb]/70">
            <Shield className="w-5 h-5 text-[#b39257] flex-shrink-0" />
            <span>
              Semua otorisasi transfer dan paket dokumentasi resmi diserahkan kepada pemesan terverifikasi setelah pemeriksaan identitas dan fasilitas pemeliharaan dinyatakan lulus.
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
