"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, Calendar, ShieldCheck, Sparkles } from "lucide-react";
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

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const scene = heroRef.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;
    let scroll = window.scrollY;
    let targetScroll = scroll;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let touchX = 0;
    let touchY = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let time = 0;
    let hasMouseMoved = false;

    const onScroll = () => {
      targetScroll = window.scrollY;
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      hasMouseMoved = true;
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const deltaX = (touch.clientX - touchStartX) / (window.innerWidth * 0.4);
        const deltaY = (touch.clientY - touchStartY) / (window.innerHeight * 0.4);
        touchX = Math.max(-1.2, Math.min(1.2, deltaX));
        touchY = Math.max(-1.2, Math.min(1.2, deltaY));
      }
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (hasMouseMoved) return;
      if (event.gamma !== null && event.beta !== null) {
        const clampGamma = Math.max(-35, Math.min(35, event.gamma));
        const clampBeta = Math.max(10, Math.min(70, event.beta)) - 40;
        touchX = clampGamma / 35;
        touchY = clampBeta / 30;
      }
    };

    const render = () => {
      time += 0.02;
      scroll += (targetScroll - scroll) * 0.08;

      // Ambient breathing float (ensures visible cinematic motion on mobile & idle desktop)
      const ambientX = Math.sin(time * 0.9) * 0.5;
      const ambientY = Math.cos(time * 0.7) * 0.4;

      // Slowly decay touch drag so it settles gracefully
      touchX *= 0.96;
      touchY *= 0.96;

      const effectiveX = targetX + ambientX + touchX;
      const effectiveY = targetY + ambientY + touchY;

      pointerX += (effectiveX - pointerX) * 0.05;
      pointerY += (effectiveY - pointerY) * 0.05;

      const offsetScroll = Math.max(0, scroll - scene.offsetTop);
      scene.style.setProperty("--hero-scroll", `${offsetScroll}px`);
      scene.style.setProperty("--hero-x", `${pointerX}`);
      scene.style.setProperty("--hero-y", `${pointerY}`);

      const textOpacity = Math.max(0, 1 - offsetScroll / 450);
      scene.style.setProperty("--hero-text-opacity", `${textOpacity}`);

      frame = requestAnimationFrame(render);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    if (typeof window.DeviceOrientationEvent !== "undefined") {
      window.addEventListener("deviceorientation", onOrientation, { passive: true });
    }
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      if (typeof window.DeviceOrientationEvent !== "undefined") {
        window.removeEventListener("deviceorientation", onOrientation);
      }
    };
  }, []);




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
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="absolute inset-[-4%] pointer-events-none z-1 blur-[3px]"
        style={{
          backgroundImage: "url('/assets/Background.png')",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(3px)",
          transform:
            "translate3d(calc(var(--hero-x) * -20px), calc(var(--hero-scroll) * -0.15 + var(--hero-y) * -12px), 0) rotate(calc(var(--hero-x) * 0.25deg)) scale(1.05)",
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
        className="absolute inset-[-4%] pointer-events-none mix-blend-screen z-2"
        style={{
          background:
            "radial-gradient(ellipse at 74% 28%, rgba(240, 210, 155, 0.55), transparent 30%), linear-gradient(110deg, transparent 35%, rgba(230, 205, 150, 0.15), transparent 72%)",
          transform:
            "translate3d(calc(var(--hero-x) * -30px), calc(var(--hero-scroll) * -0.2 + var(--hero-y) * -16px), 0)",
          willChange: "transform",
        }}
      />

      {/* ── Layer 3: Forest Canopy Layer (Latar Tengah) ── */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-[-4%] pointer-events-none z-3"
        style={{
          backgroundImage: "url('/assets/01_sisi_hutan_gabungan_detail.png')",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          transform:
            "translate3d(calc(var(--hero-x) * -45px), calc(var(--hero-scroll) * -0.32 + var(--hero-y) * -22px), 0) rotate(calc(var(--hero-x) * 0.35deg)) scale(1.05)",
          willChange: "transform",
        }}
      />

      {/* ── Layer 4: Focal Subject - Jalak Bali (Foreground) ── */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-[-2%] sm:right-[1%] md:right-[4%] lg:right-[6%] bottom-0 w-[80vw] sm:w-[62vw] md:w-[50vw] lg:w-[42vw] max-w-[720px] h-[70vh] md:h-[82vh] pointer-events-none z-5"
        style={{
          transform:
            "translate3d(calc(var(--hero-x) * 55px), calc(var(--hero-scroll) * -0.22 + var(--hero-y) * 22px), 0)",
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
        className="relative z-10 max-w-[1760px] mx-auto site-gutter w-full pt-22 sm:pt-24 pb-16 md:py-0 min-h-[85vh] md:min-h-[92vh] flex flex-col justify-center"
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
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center space-x-3 mb-5"
          >
            <span className="h-[1px] w-8 bg-[#b39257]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#d6be8c] font-mono font-medium">
              Penangkaran Resmi BKSDA · Konservasi Ex-Situ
            </span>
          </motion.div>

          {/* Main Editorial Headline */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-[#f5efeb] leading-[1.08] mb-5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
          >
            Penangkaran Legal &amp;{" "}
            <span className="italic font-serif text-[#d6be8c] block sm:inline">
              Pelestarian Jalak Bali
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-base sm:text-lg text-[#f5efeb]/85 font-sans font-normal leading-relaxed mb-8 max-w-lg drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
          >
            Pusat penangkaran terakreditasi untuk satwa Jalak Bali (<em>Leucopsar rothschildi</em>) generasi F2/F3. Dilengkapi gelang cincin tertutup, sertifikat silsilah indukan, dan pengurusan izin angkut SATS-DN resmi.
          </motion.p>

          {/* Small Availability Indicator */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mb-8 p-4 rounded-xl border border-[#233527] bg-[#0e1912] max-w-md font-mono"
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#b39257] pb-2 border-b border-[#233527] mb-2.5">
              <span>Status Rilis Mingguan</span>
              <span className="text-[#d6be8c] font-medium">{CURRENT_RELEASE.week}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#f5efeb] font-medium">
                  Koleksi Siap Verifikasi: 1 Individu · 1 Pasang
                </span>
                <span className="block text-[11px] text-[#f5efeb]/60 font-sans mt-0.5">
                  Jadwal Rilis: {CURRENT_RELEASE.formattedDate} · Kuota Terbatas
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-[#b39257] px-2 py-0.5 rounded border border-[#b39257]/30 bg-[#b39257]/10">
                Resmi BKSDA
              </span>
            </div>
          </motion.div>

          {/* Action Triggers */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 font-mono"
          >
            <button
              type="button"
              onClick={onExploreCollection}
              className="px-7 py-3.5 rounded-full bg-[#b39257] hover:bg-[#c5a880] active:bg-[#9e7e43] text-[#08110b] text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center space-x-2.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lihat Burung Tersedia</span>
            </button>

            <button
              type="button"
              onClick={onCheckAvailability}
              className="px-7 py-3.5 rounded-full border border-[#d6be8c]/30 hover:border-[#b39257] hover:text-[#d6be8c] text-[#f5efeb] text-[11px] uppercase tracking-[0.2em] font-medium transition-colors text-center cursor-pointer flex items-center justify-center space-x-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwal &amp; Alokasi</span>
            </button>
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
