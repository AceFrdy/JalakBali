"use client";

import Image from "next/image";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { ImageReveal } from "@/components/motion/ImageReveal";

export function EditorialGallery() {
  return (
    <section className="relative py-28 md:py-36 bg-[#060e08] text-[#f5efeb] border-t border-[#d6be8c]/15">
      <div className="max-w-[1760px] mx-auto site-gutter relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-16 md:mb-20">
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

        {/* ── Asymmetrical Archival Photo Plates ── */}
        <div className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto pb-4 no-scrollbar md:grid md:grid-cols-12 md:gap-8 md:overflow-visible md:pb-0">
          <ImageReveal
            direction="bottom"
            duration={1.1}
            className="w-[84%] shrink-0 snap-start md:col-span-7 md:row-span-2 md:w-auto"
          >
            <div
              data-cursor="VIEW"
              className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#d6be8c]/25 group shadow-2xl cursor-pointer"
            >
              <Image
                src="/assets/jalak-habitat.png"
                alt="Captive-bred Jalak Bali perched on natural branch"
                fill
                sizes="(max-width: 768px) 75vw, 60vw"
                className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 flex flex-col items-start gap-2 text-xs font-mono md:bottom-6 md:left-6 md:right-6 md:flex-row md:items-end md:justify-between">
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
              data-cursor="VIEW"
              className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#d6be8c]/25 group shadow-2xl cursor-pointer md:aspect-[4/3]"
            >
              <Image
                src="/assets/jalak-portrait.png"
                alt="Plumage detail and cobalt eye ring inspection"
                fill
                sizes="(max-width: 768px) 75vw, 40vw"
                className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 flex flex-col items-start gap-2 text-xs font-mono md:bottom-5 md:left-5 md:right-5 md:flex-row md:items-end md:justify-between">
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
              data-cursor="VIEW"
              className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#d6be8c]/25 group shadow-2xl cursor-pointer md:aspect-[4/3]"
            >
              <Image
                src="/assets/jalak-hero.png"
                alt="Avian caretaker monitoring social interaction"
                fill
                sizes="(max-width: 768px) 75vw, 40vw"
                className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060e08] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 flex flex-col items-start gap-2 text-xs font-mono md:bottom-5 md:left-5 md:right-5 md:flex-row md:items-end md:justify-between">
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
