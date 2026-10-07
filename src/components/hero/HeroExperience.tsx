"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, Calendar, Volume2, VolumeX, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { CURRENT_RELEASE } from "@/data/weeklyReleases";

interface HeroExperienceProps {
  onCheckAvailability: () => void;
  onExploreCollection: () => void;
}

export function HeroExperience({
  onCheckAvailability,
  onExploreCollection,
}: HeroExperienceProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const scene = heroRef.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const isDesktopPointer = window.matchMedia("(pointer: fine)").matches;

    let frame = 0;
    let scroll = window.scrollY;
    let targetScroll = scroll;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    const onScroll = () => {
      targetScroll = window.scrollY;
    };

    const onPointer = (event: PointerEvent) => {
      if (!isDesktopPointer) return;
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const render = () => {
      scroll += (targetScroll - scroll) * 0.08;
      pointerX += (targetX - pointerX) * 0.06;
      pointerY += (targetY - pointerY) * 0.06;

      const offsetScroll = Math.max(0, scroll - scene.offsetTop);
      scene.style.setProperty("--hero-scroll", `${offsetScroll}px`);
      scene.style.setProperty("--hero-x", `${pointerX}`);
      scene.style.setProperty("--hero-y", `${pointerY}`);

      const textOpacity = Math.max(0, 1 - offsetScroll / 450);
      scene.style.setProperty("--hero-text-opacity", `${textOpacity}`);

      frame = requestAnimationFrame(render);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (isDesktopPointer) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      if (isDesktopPointer) {
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, []);

  const toggleSimulatedAudio = () => {
    setAudioPlaying(!audioPlaying);
  };

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative min-h-screen w-full overflow-hidden bg-[#060e08] flex items-center select-none"
      style={
        {
          "--hero-scroll": "0px",
          "--hero-x": "0",
          "--hero-y": "0",
          "--hero-text-opacity": "1",
        } as React.CSSProperties
      }
    >
      {/* ── Base Backdrop Canvas ── */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0.4 } : { opacity: 0, scale: 1.02 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-bottom pointer-events-none"
        style={{
          backgroundImage: "url('/assets/Background.png')",
        }}
      />

      {/* ── Layer 1: Parallax Sky (Latar Belakang Jauh) ── */}
      {/* TIP: Untuk menjauhkan/mendekatkan, atur 'scale' (contoh: scale(1.02)) dan 'inset' */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="absolute inset-[-2%] pointer-events-none z-1 blur-[3px]"
        style={{
          backgroundImage: "url('/assets/Background.png')",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(3px)",
          // Nilai pengali scroll (* -0.08) & kursor (* -10px) menentukan intensitas parallax
          transform:
            "translate3d(calc(var(--hero-x) * -10px), calc(var(--hero-scroll) * -0.08 + var(--hero-y) * -5px), 0) rotate(calc(var(--hero-x) * 0.15deg)) scale(1.02)",
          willChange: "transform",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#08110b] via-transparent to-[#060e08]/30" />
      </motion.div>

      {/* ── Layer 2: Solar Screen Lighting ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute inset-[-2%] pointer-events-none mix-blend-screen z-2"
        style={{
          background:
            "radial-gradient(ellipse at 74% 28%, rgba(240, 210, 155, 0.55), transparent 30%), linear-gradient(110deg, transparent 35%, rgba(230, 205, 150, 0.15), transparent 72%)",
          transform:
            "translate3d(calc(var(--hero-x) * -15px), calc(var(--hero-scroll) * -0.12 + var(--hero-y) * -8px), 0)",
          willChange: "transform",
        }}
      />

      {/* ── Layer 3: Forest Canopy Layer (Latar Tengah) ── */}
      {/* TIP: Skala diperkecil ke 1.02 agar pemandangan hutan terlihat lebih luas/jauh */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-[-2%] pointer-events-none z-3"
        style={{
          backgroundImage: "url('/assets/01_sisi_hutan_gabungan_detail.png')",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          transform:
            "translate3d(calc(var(--hero-x) * -20px), calc(var(--hero-scroll) * -0.20 + var(--hero-y) * -10px), 0) rotate(calc(var(--hero-x) * 0.2deg)) scale(1.02)",
          willChange: "transform",
        }}
      />

      {/* ── Layer 4: Focal Subject - Jalak Bali (Foreground) ── */}
      {/* TIP: Ukuran burung dibuat lebih proporsional & kini merespon scroll dan mouse 3D */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-[-2%] sm:right-[1%] md:right-[4%] lg:right-[6%] bottom-0 w-[80vw] sm:w-[62vw] md:w-[50vw] lg:w-[42vw] max-w-[720px] h-[70vh] md:h-[82vh] pointer-events-none z-5"
        style={{
          transform:
            "translate3d(calc(var(--hero-x) * 26px), calc(var(--hero-scroll) * -0.16 + var(--hero-y) * 8px), 0)",
          willChange: "transform",
        }}
      >
        <Image
          src="/assets/Jalak Bali Biru.png"
          alt="Captive-Bred Jalak Bali (Leucopsar rothschildi)"
          fill
          priority
          sizes="(max-width: 768px) 95vw, 50vw"
          className="object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.7)]"
        />
      </motion.div>

      {/* ── Film Grain & Bottom Gradient ── */}
      <div className="grain-overlay absolute inset-0 z-8 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08110b] via-[#08110b]/60 to-transparent z-8 pointer-events-none" />

      {/* ── Text Scrim — gelap di sisi kiri agar teks selalu terbaca di semua ukuran ── */}
      <div
        className="absolute inset-0 z-9 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(4,10,5,0.72) 0%, rgba(4,10,5,0.50) 40%, transparent 70%)",
        }}
      />

      {/* ── Main Editorial Typography & Brand Positioning ── */}
      <div
        className="relative z-10 max-w-[1760px] mx-auto site-gutter w-full pt-32 pb-20 md:py-0 min-h-[92vh] flex flex-col justify-center"
        style={{
          transform:
            "translate3d(calc(var(--hero-x) * 12px), calc(var(--hero-scroll) * -0.38 + var(--hero-y) * 6px), 0)",
          opacity: "var(--hero-text-opacity)",
          willChange: "transform, opacity",
        }}
      >
        <div className="max-w-2xl lg:max-w-xl">
          {/* Brand Tagline & Station Marker */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex items-center space-x-3 mb-6"
          >
            <span className="h-[1px] w-8 bg-[#b39257]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#d6be8c] font-mono font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              Platform Penangkaran Legal Resmi · Bali
            </span>
          </motion.div>

          {/* Main Cinematic Title */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[3.5rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-none uppercase mb-6 drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)] space-y-1 sm:space-y-2"
          >
            <span className="block leading-[0.55]">Langka.</span>
            <span className="block italic font-serif font-semibold text-[#f0d080] lowercase tracking-normal text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              bertanggung jawab.
            </span>
            <span className="block leading-[0.95]">Memukau.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.82 }}
            className="text-base sm:text-lg text-white font-normal leading-relaxed mb-8 max-w-lg drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
          >
            Temukan Jalak Bali dari program penangkaran legal yang dikelola dengan cermat.
            Setiap individu bercincin tertutup, berchip mikro, dan diserahterimakan secara eksklusif melalui
            prosedur kepatuhan yang terverifikasi.
          </motion.p>

          {/* Small Availability Indicator */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.95 }}
            className="mb-10 p-4 rounded-xl border border-[#d6be8c]/25 bg-[#0d1811]/85 backdrop-blur-md max-w-md font-mono"
          >
            <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-[#b39257] pb-2 border-b border-[#d6be8c]/15 mb-2.5">
              <span>Alokasi Rilis Mingguan</span>
              <span className="text-[#38bdf8]">{CURRENT_RELEASE.week}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#f5efeb] font-semibold">
                  Ketersediaan Saat Ini: 1 Individu · 1 Pasang
                </span>
                <span className="block text-[10px] text-[#f5efeb]/60 font-light mt-0.5">
                  Rilis Berikutnya: {CURRENT_RELEASE.formattedDate} · Verifikasi Diperlukan
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-[#b39257] px-2 py-0.5 rounded border border-[#b39257]/40 bg-[#b39257]/10">
                Rilis Terbatas
              </span>
            </div>
          </motion.div>

          {/* Action Triggers */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 1.08 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExploreCollection}
              data-cursor="COLLECTION"
              className="px-8 py-4 rounded-full bg-[#b39257] hover:bg-[#d6be8c] text-[#08110b] text-[11px] uppercase tracking-[0.25em] font-mono font-semibold transition-colors shadow-[0_12px_30px_rgba(179,146,87,0.25)] flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jelajahi Burung Tersedia</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCheckAvailability}
              className="px-8 py-4 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] hover:text-[#d6be8c] text-[#f5efeb] text-[11px] uppercase tracking-[0.25em] font-mono font-medium transition-colors text-center backdrop-blur-sm cursor-pointer flex items-center justify-center space-x-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Daftar Rilis Mingguan</span>
            </motion.button>
          </motion.div>

          {/* Soundscape Interactive Cue */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.25 }}
            className="mt-8 flex items-center space-x-3 text-[11px] font-mono text-[#f5efeb]/60"
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleSimulatedAudio}
              className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                audioPlaying
                  ? "border-[#b39257] bg-[#b39257]/20 text-[#b39257]"
                  : "border-[#d6be8c]/30 hover:border-[#b39257] text-[#b39257]"
              }`}
              title="Simulate Avian Vocalization"
            >
              {audioPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            </motion.button>
            <span>
              {audioPlaying
                ? "Simulasi: Suara siulan teritorial jantan dewasa hasil penangkaran"
                : "Dengarkan rekaman suara panggilan burung aviari"}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Margin Watermarks */}
      <div className="absolute bottom-8 left-12 z-20 hidden xl:flex items-center space-x-4 text-[9px] uppercase tracking-[0.3em] text-[#f5efeb]/40 font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-[#b39257]" />
        <span>Registri Penangkaran · Protokol Pita Cincin Tertutup</span>
      </div>

      <div className="absolute bottom-8 right-12 z-20 hidden md:flex items-center space-x-2 text-[9px] uppercase tracking-[0.3em] text-[#d6be8c]/70 font-mono">
        <span>Gulir untuk Melihat Koleksi</span>
        <ArrowDown className="w-3 h-3 text-[#b39257] animate-bounce" />
      </div>
    </section>
  );
}
